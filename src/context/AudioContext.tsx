import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Song, Playlist, Schedule, Member } from '../types';
import { INITIAL_PLAYLISTS, INITIAL_SCHEDULES, INITIAL_MEMBERS } from '../data/mock';
import { 
  parsePlayerStatus, 
  parseMusicLibrary, 
  serializeSchedule, 
  serializeScheduleDelete, 
  serializeScheduleToggle,
  sendCommandToServer 
} from '../services/adafruitIO';

export interface ToastMessage {
  id: number;
  message: string;
}

interface AudioContextType {
  isPlaying: boolean;
  currentTrackIndex: number;
  currentTrack: Song;
  currentTime: number;
  volume: number;
  isShuffle: boolean;
  isRepeat: boolean;
  isSystemOnline: boolean;
  commandStatus: string | null;
  toasts: ToastMessage[];
  sdSongs: Song[];
  playlists: Playlist[];
  schedules: Schedule[];
  members: Member[];
  
  togglePlay: () => void;
  playTrack: (index: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (level: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleSystemOnline: () => void;
  addSchedule: (schedule: Schedule) => void;
  toggleScheduleActive: (id: number) => void;
  deleteSchedule: (id: number) => void;
  addMember: (member: Member) => void;
  removeMember: (id: number) => void;
  triggerCommand: (endpoint: string, successMessage?: string, callback?: () => void) => void;
  addToast: (message: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTrackId, setCurrentTrackId] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(15); // Storing hardware volume (0-30)
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isSystemOnline, setIsSystemOnline] = useState(true);
  const [commandStatus, setCommandStatus] = useState<string | null>(null);
  
  const [sdSongs, setSdSongs] = useState<Song[]>([]);
  const [playlists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [schedules, setSchedules] = useState<Schedule[]>(INITIAL_SCHEDULES);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Safe placeholder song when library has not loaded yet
  const placeholderTrack: Song = {
    id: 0,
    fileNum: "00 / 00",
    title: "Waiting for Music Library...",
    artist: "Pico SD Card",
    category: "System",
    duration: "0:00",
    durationSec: 240,
    artwork: "⏳"
  };

  const currentTrack = sdSongs[currentTrackIndex] || sdSongs[0] || placeholderTrack;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const volumePublishTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync track index dynamically as soon as sdSongs library or currentTrackId updates
  useEffect(() => {
    if (sdSongs.length > 0) {
      const index = sdSongs.findIndex(s => s.id === currentTrackId);
      if (index !== -1) {
        setCurrentTrackIndex(index);
      }
    }
  }, [sdSongs, currentTrackId]);

  // Real-time SSE listener
  useEffect(() => {
    console.log("[AudioContext] Connecting to /api/status-stream...");
    const eventSource = new EventSource("/api/status-stream");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { feed, payload } = data;
        
        console.log(`[SSE Event] Feed: ${feed} => Payload: ${payload}`);

        if (feed === "device-status") {
          const isOnline = payload === "ONLINE" || payload === "WIFI_CONNECTED" || payload === "MQTT_CONNECTED" || payload === "RTC_OK";
          setIsSystemOnline(isOnline);
        } else if (feed === "player-status") {
          const parsed = parsePlayerStatus(payload);
          if (parsed) {
            setIsPlaying(parsed.state === "PLAYING");
            setVolume(parsed.volume);
            setIsShuffle(parsed.isShuffle);
            setIsRepeat(parsed.isRepeat);
            setCurrentTrackId(parsed.trackId);
          }
        } else if (feed === "music-library") {
          const parsedSongs = parseMusicLibrary(payload);
          if (parsedSongs && parsedSongs.length > 0) {
            setSdSongs(parsedSongs);
          }
        } else if (feed === "schedule-status") {
          // Log schedule update in UI feedback status bar
          setCommandStatus(`Pico Schedule: ${payload}`);
          setTimeout(() => setCommandStatus(null), 2000);
        }
      } catch (err) {
        console.error("[SSE Parse Error]", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("[SSE Stream Error] Connection interrupted. Reconnecting...", err);
      setIsSystemOnline(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // UI Timeline progression loop
  useEffect(() => {
    if (isPlaying && isSystemOnline) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= (currentTrack?.durationSec || 240)) {
            return 0; // Loops locally, awaits formal track change status from Pico
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isSystemOnline, currentTrackIndex, currentTrack?.durationSec]);

  const addToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Central trigger function to map legacy code gracefully
  const triggerCommand = (endpoint: string, successMessage?: string, callback?: () => void) => {
    if (!isSystemOnline) {
       addToast("Cannot execute command. System is offline.");
       return;
    }
    setCommandStatus(`Dispatched: ${endpoint}`);
    
    if (endpoint === "GET /api/device/songs") {
      fetch("/api/rescan", { method: "POST" })
        .then(res => res.json())
        .then(() => {
          if (callback) callback();
          if (successMessage) addToast(successMessage);
          setTimeout(() => setCommandStatus(null), 1000);
        })
        .catch(err => {
          console.error("Rescan dispatch failed", err);
          if (callback) callback();
          if (successMessage) addToast(successMessage);
          setTimeout(() => setCommandStatus(null), 1000);
        });
    } else {
      setTimeout(() => {
        if (callback) callback();
        if (successMessage) addToast(successMessage);
        setTimeout(() => setCommandStatus(null), 1000);
      }, 150);
    }
  };

  const togglePlay = () => {
    if (!isSystemOnline) return;
    const nextState = !isPlaying;
    const command = nextState ? "PLAY" : "PAUSE";
    
    setCommandStatus(`Sending command: ${command}`);
    // Optimistic UI response
    setIsPlaying(nextState);

    sendCommandToServer("music-control", command).then((success) => {
      if (success) {
        addToast(nextState ? "Playback request sent" : "Pause request sent");
      } else {
        addToast("Error contacting Pico controller");
        setIsPlaying(!nextState); // Rollback
      }
      setCommandStatus(null);
    });
  };

  const handleNextTrack = () => {
    if (!isSystemOnline) return;
    setCommandStatus("Sending command: NEXT");

    sendCommandToServer("music-control", "NEXT").then((success) => {
      if (success) {
        addToast("Skipped to next track");
        setCurrentTime(0);
      } else {
        addToast("Error contacting Pico controller");
      }
      setCommandStatus(null);
    });
  };

  const handlePrevTrack = () => {
    if (!isSystemOnline) return;
    setCommandStatus("Sending command: PREV");

    sendCommandToServer("music-control", "PREV").then((success) => {
      if (success) {
        addToast("Skipped to previous track");
        setCurrentTime(0);
      } else {
        addToast("Error contacting Pico controller");
      }
      setCommandStatus(null);
    });
  };

  const playTrack = (index: number) => {
    if (!isSystemOnline) return;
    const selected = sdSongs[index];
    if (!selected) return;

    setCommandStatus(`Selecting track: ${selected.title}`);
    sendCommandToServer("music-control", `TRACK:${selected.id}`).then((success) => {
      if (success) {
        addToast(`Requested: ${selected.title}`);
        setCurrentTime(0);
      } else {
        addToast("Error contacting Pico controller");
      }
      setCommandStatus(null);
    });
  };

  const handleSetVolume = (level: number) => {
    const clamped = Math.max(0, Math.min(30, level));
    setVolume(clamped); // Snappy UI slider feedback

    if (volumePublishTimeoutRef.current) {
      clearTimeout(volumePublishTimeoutRef.current);
    }

    // Debounce actual MQTT publish to prevent Adafruit IO spam
    volumePublishTimeoutRef.current = setTimeout(() => {
      sendCommandToServer("music-volume", String(clamped));
    }, 250);
  };

  const toggleShuffle = () => {
    const nextState = !isShuffle;
    setIsShuffle(nextState);
    const command = nextState ? "SHUFFLE_ON" : "SHUFFLE_OFF";
    sendCommandToServer("music-control", command).then((success) => {
      if (!success) {
        setIsShuffle(!nextState); // Rollback
        addToast("Error contacting Pico controller");
      }
    });
  };

  const toggleRepeat = () => {
    const nextState = !isRepeat;
    setIsRepeat(nextState);
    const command = nextState ? "REPEAT_ON" : "REPEAT_OFF";
    sendCommandToServer("music-control", command).then((success) => {
      if (!success) {
        setIsRepeat(!nextState); // Rollback
        addToast("Error contacting Pico controller");
      }
    });
  };

  const toggleSystemOnline = () => {
    // Allows toggling mock state when offline to help debug
    const nextOnline = !isSystemOnline;
    setIsSystemOnline(nextOnline);
    addToast(nextOnline ? "Simulated Pico ONLINE" : "Simulated Pico OFFLINE");
  };

  const addScheduleObj = (schedule: Schedule) => {
    const payload = serializeSchedule(schedule);
    setCommandStatus(`Setting Schedule: ${schedule.name}`);

    sendCommandToServer("schedule-control", payload).then((success) => {
      if (success) {
        setSchedules([schedule, ...schedules]);
        addToast(`Schedule "${schedule.name}" sent to Pico`);
      } else {
        addToast("Failed to reach Pico controller");
      }
      setCommandStatus(null);
    });
  };

  const toggleScheduleActive = (id: number) => {
    const sched = schedules.find(s => s.id === id);
    if (!sched) return;
    const nextState = !sched.active;
    const payload = serializeScheduleToggle(id, nextState);
    setCommandStatus(`Toggling Schedule: ${sched.name}`);

    sendCommandToServer("schedule-control", payload).then((success) => {
      if (success) {
        setSchedules(prev => prev.map(s => s.id === id ? { ...s, active: nextState } : s));
        addToast(`Schedule "${sched.name}" ${nextState ? 'enabled' : 'disabled'}`);
      } else {
        addToast("Failed to reach Pico controller");
      }
      setCommandStatus(null);
    });
  };

  const deleteSchedule = (id: number) => {
    const sched = schedules.find(s => s.id === id);
    const name = sched ? sched.name : "Schedule";
    const payload = serializeScheduleDelete(id);
    setCommandStatus(`Deleting Schedule: ${name}`);

    sendCommandToServer("schedule-control", payload).then((success) => {
      if (success) {
        setSchedules(prev => prev.filter(s => s.id !== id));
        addToast("Schedule deleted from Pico");
      } else {
        addToast("Failed to reach Pico controller");
      }
      setCommandStatus(null);
    });
  };

  const addMemberObj = (member: Member) => {
    setMembers([...members, member]);
    addToast("Member added successfully");
  };

  const removeMember = (id: number) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    addToast("Member removed successfully");
  };

  return (
    <AudioContext.Provider value={{
      isPlaying,
      currentTrackIndex,
      currentTrack,
      currentTime,
      volume,
      isShuffle,
      isRepeat,
      isSystemOnline,
      commandStatus,
      toasts,
      sdSongs,
      playlists,
      schedules,
      members,
      togglePlay,
      playTrack,
      nextTrack: handleNextTrack,
      prevTrack: handlePrevTrack,
      setVolume: handleSetVolume,
      toggleShuffle,
      toggleRepeat,
      toggleSystemOnline,
      addSchedule: addScheduleObj,
      toggleScheduleActive,
      deleteSchedule,
      addMember: addMemberObj,
      removeMember,
      triggerCommand,
      addToast
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}

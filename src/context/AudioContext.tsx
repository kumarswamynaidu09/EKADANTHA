import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode, useRef } from 'react';
import { Song, Playlist, Schedule, Member } from '../types';
import { INITIAL_SD_SONGS, INITIAL_PLAYLISTS, INITIAL_SCHEDULES, INITIAL_MEMBERS } from '../data/mock';
import { 
  parsePlayerStatus, 
  parseMusicLibrary, 
  serializeSchedule, 
  serializeScheduleDelete, 
  serializeScheduleToggle,
  serializePlaylistPlay,
  serializePlaylistCreate,
  serializePlaylistDelete,
  serializePlaylistStop,
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
  
  playPlaylist: (name: string) => void;
  createPlaylist: (name: string, trackIds: (string|number)[]) => Promise<boolean>;
  deletePlaylist: (name: string) => void;
  stopPlaylist: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTrackId, setCurrentTrackId] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(20); // Hardware volume (0-30)
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  
  // Default to online if heartbeats are active or recent, with a generous 60s timeout
  const [isSystemOnline, setIsSystemOnline] = useState(true);
  const [commandStatus, setCommandStatus] = useState<string | null>(null);
  
  // Initialize with fallback catalog from mock so UI never shows empty 00/00
  const [sdSongs, setSdSongs] = useState<Song[]>(INITIAL_SD_SONGS);
  const [playlists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [schedules, setSchedules] = useState<Schedule[]>(INITIAL_SCHEDULES);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Stale-status watchdog timeout (Hardware emits every 15s; 60s absorbs network jitter)
  const HEARTBEAT_TIMEOUT = 60000; // 60 seconds
  const lastHeartbeatRef = useRef<number>(Date.now());

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const volumePublishTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic track calculation with accurate total count
  const currentTrack = useMemo<Song>(() => {
    const totalCount = sdSongs.length > 0 ? sdSongs.length : 18;
    const found = sdSongs.find(s => s.id === currentTrackId) || sdSongs[currentTrackIndex] || sdSongs[0];
    if (found) {
      return {
        ...found,
        fileNum: `${String(found.id).padStart(2, '0')} / ${String(totalCount).padStart(2, '0')}`
      };
    }
    return {
      id: currentTrackId,
      fileNum: `${String(currentTrackId).padStart(2, '0')} / ${String(totalCount).padStart(2, '0')}`,
      title: `Track ${currentTrackId}`,
      artist: "Pico SD Card",
      category: "Devotional",
      duration: "4:00",
      durationSec: 240,
      artwork: "🕉️"
    };
  }, [sdSongs, currentTrackId, currentTrackIndex]);

  // Sync currentTrackIndex when sdSongs or currentTrackId changes
  useEffect(() => {
    if (sdSongs.length > 0) {
      const index = sdSongs.findIndex(s => s.id === currentTrackId);
      if (index !== -1) {
        setCurrentTrackIndex(index);
      }
    }
  }, [sdSongs, currentTrackId]);

  // Heartbeat watchdog: checks every 5s if last heartbeat is older than 60s
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (isSystemOnline && lastHeartbeatRef.current > 0 && (Date.now() - lastHeartbeatRef.current > HEARTBEAT_TIMEOUT)) {
        console.warn(`[Pico Status] Stale timeout reached (${HEARTBEAT_TIMEOUT}ms without heartbeat). Marking controller offline.`);
        setIsSystemOnline(false);
      }
    }, 5000);
    return () => clearInterval(checkInterval);
  }, [isSystemOnline]);

  const API_BASE = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');

  // Real-time SSE listener connecting to persistent Railway backend
  useEffect(() => {
    console.log(`[AudioContext] Connecting to ${API_BASE}/api/status-stream...`);
    const eventSource = new EventSource(`${API_BASE}/api/status-stream`);

    eventSource.onopen = () => {
      console.log("[AudioContext] SSE Connection to Railway established.");
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { feed, payload } = data;
        
        console.log(`[SSE Event] Feed: ${feed} => Payload: ${payload}`);

        // Any valid packet from the controller indicates live communication
        if (feed === "device-status") {
          const isOnline = 
            payload.includes("ONLINE") || 
            payload.startsWith("ONLINE") || 
            payload === "WIFI_CONNECTED" || 
            payload === "MQTT_CONNECTED" || 
            payload === "RTC_OK";

          if (isOnline) {
            setIsSystemOnline(true);
            lastHeartbeatRef.current = Date.now();
          } else if (payload === "OFFLINE") {
            setIsSystemOnline(false);
          }
        } else if (feed === "player-status") {
          // Received authoritative feedback from Pico
          lastHeartbeatRef.current = Date.now();
          setIsSystemOnline(true);
          const parsed = parsePlayerStatus(payload);
          if (parsed) {
            setIsPlaying(parsed.state === "PLAYING");
            setVolume(parsed.volume);
            setIsShuffle(parsed.isShuffle);
            setIsRepeat(parsed.isRepeat);
            setCurrentTrackId(parsed.trackId);
          }
        } else if (feed === "music-library") {
          // Received hardware library from Pico
          lastHeartbeatRef.current = Date.now();
          setIsSystemOnline(true);
          const parsedSongs = parseMusicLibrary(payload);
          if (parsedSongs && parsedSongs.length > 0) {
            setSdSongs(parsedSongs);
          }
        } else if (feed === "schedule-status") {
          // Received schedule update from Pico
          lastHeartbeatRef.current = Date.now();
          setIsSystemOnline(true);
          setCommandStatus(`Pico Schedule: ${payload}`);
          setTimeout(() => setCommandStatus(null), 2000);
        }
      } catch (err) {
        console.error("[SSE Parse Error]", err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn("[SSE Stream Warning] Connection reconnecting...", err);
      // Do NOT abruptly mark system offline on momentary SSE reconnects;
      // let the 60-second watchdog handle true offline conditions.
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // UI Timeline progression loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= (currentTrack?.durationSec || 240)) {
            return 0;
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
  }, [isPlaying, currentTrackIndex, currentTrack?.durationSec]);

  const addToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const triggerCommand = (endpoint: string, successMessage?: string, callback?: () => void) => {
    setCommandStatus(`Dispatched: ${endpoint}`);
    
    if (endpoint === "GET /api/device/songs") {
      fetch(`${API_BASE}/api/rescan`, { method: "POST" })
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

  // 1. Optimistic Play/Pause
  const togglePlay = () => {
    const nextState = !isPlaying;
    // Immediate optimistic state update
    setIsPlaying(nextState);
    const command = nextState ? "PLAY" : "PAUSE";
    
    setCommandStatus(`Sending: ${command}`);

    sendCommandToServer("music-control", command).then((success) => {
      if (success) {
        addToast(nextState ? "Playback started" : "Playback paused");
      } else {
        // Rollback on network failure
        setIsPlaying(!nextState);
        addToast("Error contacting Pico controller");
      }
      setCommandStatus(null);
    });
  };

  // 2. Optimistic Next Track
  const handleNextTrack = () => {
    const total = sdSongs.length > 0 ? sdSongs.length : 18;
    const nextIdx = (currentTrackIndex + 1) % total;
    const targetSong = sdSongs[nextIdx];

    // Immediate optimistic UI update
    setCurrentTrackIndex(nextIdx);
    if (targetSong) {
      setCurrentTrackId(targetSong.id);
    } else {
      setCurrentTrackId(nextIdx + 1);
    }
    setIsPlaying(true);
    setCurrentTime(0);

    setCommandStatus("Sending: NEXT");
    sendCommandToServer("music-control", "NEXT").then((success) => {
      if (success) {
        addToast("Skipped to next track");
      } else {
        addToast("Error contacting Pico controller");
      }
      setCommandStatus(null);
    });
  };

  // 3. Optimistic Prev Track
  const handlePrevTrack = () => {
    const total = sdSongs.length > 0 ? sdSongs.length : 18;
    const prevIdx = (currentTrackIndex - 1 + total) % total;
    const targetSong = sdSongs[prevIdx];

    // Immediate optimistic UI update
    setCurrentTrackIndex(prevIdx);
    if (targetSong) {
      setCurrentTrackId(targetSong.id);
    } else {
      setCurrentTrackId(prevIdx + 1);
    }
    setIsPlaying(true);
    setCurrentTime(0);

    setCommandStatus("Sending: PREV");
    sendCommandToServer("music-control", "PREV").then((success) => {
      if (success) {
        addToast("Skipped to previous track");
      } else {
        addToast("Error contacting Pico controller");
      }
      setCommandStatus(null);
    });
  };

  // 4. Optimistic Track Selection
  const playTrack = (index: number) => {
    const selected = sdSongs[index];
    if (!selected) return;

    // Immediate optimistic UI update
    setCurrentTrackIndex(index);
    setCurrentTrackId(selected.id);
    setIsPlaying(true);
    setCurrentTime(0);

    setCommandStatus(`Selecting: ${selected.title}`);
    sendCommandToServer("music-control", `TRACK:${selected.id}`).then((success) => {
      if (success) {
        addToast(`Playing: ${selected.title}`);
      } else {
        addToast("Error contacting Pico controller");
      }
      setCommandStatus(null);
    });
  };

  // 5. Snappy Volume Control
  const handleSetVolume = (level: number) => {
    const clamped = Math.max(0, Math.min(30, level));
    setVolume(clamped); // Immediate slider feedback

    if (volumePublishTimeoutRef.current) {
      clearTimeout(volumePublishTimeoutRef.current);
    }

    // Debounce actual MQTT publish to prevent spamming backend
    volumePublishTimeoutRef.current = setTimeout(() => {
      sendCommandToServer("music-volume", String(clamped));
    }, 250);
  };

  // 6. Optimistic Shuffle Toggle
  const toggleShuffle = () => {
    const nextState = !isShuffle;
    setIsShuffle(nextState); // Immediate optimistic update
    const command = nextState ? "SHUFFLE_ON" : "SHUFFLE_OFF";
    setCommandStatus(`Sending: ${command}`);
    sendCommandToServer("music-control", command).then((success) => {
      if (success) {
        addToast(nextState ? "Shuffle ON" : "Shuffle OFF");
      } else {
        setIsShuffle(!nextState);
        addToast("Error contacting Pico controller");
      }
      setCommandStatus(null);
    });
  };

  // 7. Optimistic Repeat Toggle
  const toggleRepeat = () => {
    const nextState = !isRepeat;
    setIsRepeat(nextState); // Immediate optimistic update
    const command = nextState ? "REPEAT_ON" : "REPEAT_OFF";
    setCommandStatus(`Sending: ${command}`);
    sendCommandToServer("music-control", command).then((success) => {
      if (success) {
        addToast(nextState ? "Repeat ON" : "Repeat OFF");
      } else {
        setIsRepeat(!nextState);
        addToast("Error contacting Pico controller");
      }
      setCommandStatus(null);
    });
  };

  const toggleSystemOnline = () => {
    const nextOnline = !isSystemOnline;
    setIsSystemOnline(nextOnline);
    addToast(nextOnline ? "Pico status set to ONLINE" : "Pico status set to OFFLINE");
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

  const playPlaylist = (name: string) => {
    const payload = serializePlaylistPlay(name);
    setCommandStatus(`Playing Playlist: ${name}`);
    sendCommandToServer("playlist-control", payload).then((success) => {
      if (success) {
        addToast(`Playing Playlist "${name}"`);
      } else {
        addToast("Failed to reach Pico controller");
      }
      setCommandStatus(null);
    });
  };

  const createPlaylist = (name: string, trackIds: (string|number)[]): Promise<boolean> => {
    const payload = serializePlaylistCreate(name, trackIds);
    setCommandStatus(`Creating Playlist: ${name}`);
    return sendCommandToServer("playlist-control", payload).then((success) => {
      if (success) {
        addToast(`Playlist "${name}" created on Pico`);
      } else {
        addToast("Failed to reach Pico controller");
      }
      setCommandStatus(null);
      return success;
    });
  };

  const deletePlaylist = (name: string) => {
    const payload = serializePlaylistDelete(name);
    setCommandStatus(`Deleting Playlist: ${name}`);
    sendCommandToServer("playlist-control", payload).then((success) => {
      if (success) {
        addToast(`Playlist "${name}" deleted from Pico`);
      } else {
        addToast("Failed to reach Pico controller");
      }
      setCommandStatus(null);
    });
  };

  const stopPlaylist = () => {
    const payload = serializePlaylistStop();
    setCommandStatus("Stopping Playlist");
    sendCommandToServer("playlist-control", payload).then((success) => {
      if (success) {
        addToast("Playlist stopped on Pico");
      } else {
        addToast("Failed to reach Pico controller");
      }
      setCommandStatus(null);
    });
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
      addToast,
      playPlaylist,
      createPlaylist,
      deletePlaylist,
      stopPlaylist
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

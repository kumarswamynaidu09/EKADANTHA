import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Song, Playlist, Schedule, Member } from '../types';
import { INITIAL_SD_SONGS, INITIAL_PLAYLISTS, INITIAL_SCHEDULES, INITIAL_MEMBERS } from '../data/mock';

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
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(72);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isSystemOnline, setIsSystemOnline] = useState(true);
  const [commandStatus, setCommandStatus] = useState<string | null>(null);
  
  const [sdSongs] = useState<Song[]>(INITIAL_SD_SONGS);
  const [playlists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [schedules, setSchedules] = useState<Schedule[]>(INITIAL_SCHEDULES);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const currentTrack = sdSongs[currentTrackIndex] || sdSongs[0];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Playback simulation
  useEffect(() => {
    if (isPlaying && isSystemOnline) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentTrack.durationSec) {
            handleNextTrack();
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
  }, [isPlaying, isSystemOnline, currentTrackIndex, currentTrack.durationSec]);

  const addToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const triggerCommand = (endpoint: string, successMessage?: string, callback?: () => void) => {
    if (!isSystemOnline) {
       addToast("Cannot execute command. System is offline.");
       return;
    }
    setCommandStatus(`Simulating command: ${endpoint} -> ESP32`);
    
    // Simulate network delay
    setTimeout(() => {
      if (callback) callback();
      if (successMessage) addToast(successMessage);
      
      // Keep status visible slightly longer for visual feedback
      setTimeout(() => setCommandStatus(null), 1000);
    }, 400); 
  };

  const togglePlay = () => {
    if (!isSystemOnline) return;
    const nextState = !isPlaying;
    const endpoint = nextState ? "POST /api/player/play" : "POST /api/player/pause";
    triggerCommand(endpoint, nextState ? "Playback started" : "Playback paused", () => {
      setIsPlaying(nextState);
    });
  };

  const handleNextTrack = () => {
    if (!isSystemOnline) return;
    triggerCommand("POST /api/player/next", "Skipped to next track", () => {
      if (isShuffle) {
        setCurrentTrackIndex(Math.floor(Math.random() * sdSongs.length));
      } else {
        setCurrentTrackIndex((prev) => (prev + 1) % sdSongs.length);
      }
      setCurrentTime(0);
      setIsPlaying(true);
    });
  };

  const handlePrevTrack = () => {
    if (!isSystemOnline) return;
    triggerCommand("POST /api/player/prev", "Skipped to previous track", () => {
      if (currentTime > 3) {
        setCurrentTime(0);
      } else {
        setCurrentTrackIndex((prev) => (prev - 1 + sdSongs.length) % sdSongs.length);
        setCurrentTime(0);
      }
      setIsPlaying(true);
    });
  };

  const playTrack = (index: number) => {
    if (!isSystemOnline) return;
    const selected = sdSongs[index];
    triggerCommand(`POST /api/player/play {"track": ${selected.id}}`, `Playing ${selected.title}`, () => {
      setCurrentTrackIndex(index);
      setCurrentTime(0);
      setIsPlaying(true);
    });
  };

  const handleSetVolume = (level: number) => {
    if (!isSystemOnline) return;
    const clamped = Math.max(0, Math.min(100, level));
    setVolume(clamped);
    // Don't toast for volume, just show command status to avoid toast spam
    triggerCommand(`POST /api/audio/volume {"level": ${clamped}}`);
  };

  const toggleSystemOnline = () => {
    const newState = !isSystemOnline;
    setIsSystemOnline(newState);
    if (!newState) {
       setIsPlaying(false);
       addToast("System disconnected");
    } else {
       addToast("System reconnected");
    }
  };

  const addScheduleObj = (schedule: Schedule) => {
    triggerCommand("POST /api/schedule/create", "Schedule created", () => {
      setSchedules([schedule, ...schedules]);
    });
  };

  const toggleScheduleActive = (id: number) => {
    const sched = schedules.find(s => s.id === id);
    if (!sched) return;
    const nextState = !sched.active;
    triggerCommand(`POST /api/schedule/update {"id": ${id}, "active": ${nextState}}`, `Schedule ${nextState ? 'enabled' : 'disabled'}`, () => {
      setSchedules(prev => prev.map(s => s.id === id ? { ...s, active: nextState } : s));
    });
  };

  const deleteSchedule = (id: number) => {
    triggerCommand(`DELETE /api/schedule/${id}`, "Schedule deleted", () => {
       setSchedules(prev => prev.filter(s => s.id !== id));
    });
  };

  const addMemberObj = (member: Member) => {
    triggerCommand("POST /api/members/add", "Member added", () => {
      setMembers([...members, member]);
    });
  };

  const removeMember = (id: number) => {
    triggerCommand(`DELETE /api/members/${id}`, "Member removed", () => {
       setMembers(prev => prev.filter(m => m.id !== id));
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
      toggleShuffle: () => setIsShuffle(!isShuffle),
      toggleRepeat: () => setIsRepeat(!isRepeat),
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

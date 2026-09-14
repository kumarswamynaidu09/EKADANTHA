import { Song, Schedule } from '../types';

// Parse player-status payload
// Format: PLAYING|12|30|SHUFFLE_OFF|REPEAT_OFF
export interface PlayerStatusParsed {
  state: 'PLAYING' | 'PAUSED' | 'STOPPED';
  trackId: number;
  volume: number;
  isShuffle: boolean;
  isRepeat: boolean;
}

export function parsePlayerStatus(payload: string): PlayerStatusParsed | null {
  if (!payload) return null;
  const parts = payload.split('|');
  if (parts.length < 5) return null;

  return {
    state: parts[0] as 'PLAYING' | 'PAUSED' | 'STOPPED',
    trackId: parseInt(parts[1], 10) || 1,
    volume: parseInt(parts[2], 10) || 20,
    isShuffle: parts[3] === 'SHUFFLE_ON' || parts[3] === 'ON',
    isRepeat: parts[4] === 'REPEAT_ON' || parts[4] === 'ON',
  };
}

// Parse music library payload
// Format: "1|Sukh Karta Dukh Harta\n2|Ganesh Aarti Traditional"
export function parseMusicLibrary(payload: string): Song[] {
  if (!payload || payload.trim() === "") return [];
  const lines = payload.split(/[\n\r]+/);
  const parsedSongs: Song[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const firstPipe = trimmed.indexOf('|');
    if (firstPipe === -1) continue;
    const idStr = trimmed.slice(0, firstPipe).trim();
    const title = trimmed.slice(firstPipe + 1).trim();
    const id = parseInt(idStr, 10);
    if (isNaN(id)) continue;

    // Generate neat metadata based on song title
    let artwork = "🕉️";
    let category = "Chant";
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("aarti")) {
      artwork = "🪔";
      category = "Aarti";
    } else if (lowerTitle.includes("bhajan") || lowerTitle.includes("stuti")) {
      artwork = "🌸";
      category = "Bhajan";
    } else if (lowerTitle.includes("chant") || lowerTitle.includes("namah") || lowerTitle.includes("namo")) {
      artwork = "🧘";
      category = "Chant";
    } else if (lowerTitle.includes("deva") || lowerTitle.includes("shree") || lowerTitle.includes("morya")) {
      artwork = "✨";
      category = "Devotional";
    }

    parsedSongs.push({
      id,
      fileNum: `${id < 10 ? '0' : ''}${id} / ${lines.length}`,
      title: title || `Track ${id}`,
      artist: "Pico SD Card",
      category,
      duration: "4:00",
      durationSec: 240,
      artwork
    });
  }
  return parsedSongs;
}

// Parse schedule-status payload
// Format: "SCHEDULER|ON|NEXT|06:30|Pratah Morning Aarti"
export interface ScheduleStatusParsed {
  schedulerOn: boolean;
  state: 'NEXT' | 'RUNNING' | 'IDLE';
  time?: string;
  name?: string;
}

export function parseScheduleStatus(payload: string): ScheduleStatusParsed | null {
  if (!payload) return null;
  const parts = payload.split('|');
  if (parts.length < 2) return null;

  return {
    schedulerOn: parts[1] === 'ON',
    state: (parts[2] as 'NEXT' | 'RUNNING') || 'IDLE',
    time: parts[3],
    name: parts[4],
  };
}

// Serialize schedules
export function serializeSchedule(schedule: Schedule): string {
  // Format: SCHEDULE_SET:ID,NAME,HH,MM,DAYS,ACTION,TARGET
  const cleanId = (schedule.id % 100);
  const cleanName = schedule.name.replace(/[,:]/g, '');

  let hh = "06";
  let mm = "30";
  const match = schedule.time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (match) {
    let hour = parseInt(match[1]);
    const min = parseInt(match[2]);
    const meridiem = match[3];
    if (meridiem) {
      if (meridiem.toUpperCase() === "PM" && hour < 12) hour += 12;
      if (meridiem.toUpperCase() === "AM" && hour === 12) hour = 0;
    }
    hh = String(hour).padStart(2, '0');
    mm = String(min).padStart(2, '0');
  }

  // Parse days decimal bitmask
  let daysVal = 0;
  const dStr = schedule.days.toLowerCase();
  if (dStr.includes("daily") || dStr.includes("all")) {
    daysVal = 127;
  } else {
    if (dStr.includes("sun")) daysVal |= 1;
    if (dStr.includes("mon")) daysVal |= 2;
    if (dStr.includes("tue")) daysVal |= 4;
    if (dStr.includes("wed")) daysVal |= 8;
    if (dStr.includes("thu")) daysVal |= 16;
    if (dStr.includes("fri")) daysVal |= 32;
    if (dStr.includes("sat")) daysVal |= 64;
    if (daysVal === 0) daysVal = 127;
  }

  // Parse target from playlist
  let target = "PLAYLIST:Morning";
  const trackMatch = schedule.playlist.match(/Track\s*#(\d+)/i);
  if (trackMatch) {
    target = `TRACK:${parseInt(trackMatch[1])}`;
  } else {
    const nameMatch = schedule.playlist.match(/^([A-Za-z0-9]+)/);
    if (nameMatch) {
      target = `PLAYLIST:${nameMatch[1]}`;
    } else {
      target = `PLAYLIST:${schedule.playlist}`;
    }
  }

  return `SCHEDULE_SET:${cleanId},${cleanName},${hh},${mm},${daysVal},PLAY,${target}`;
}

export function serializeScheduleDelete(id: number): string {
  const cleanId = String(id % 100).padStart(2, '0');
  return `SCHEDULE_DELETE:${cleanId}`;
}

export function serializeScheduleToggle(id: number, active: boolean): string {
  const cleanId = String(id % 100).padStart(2, '0');
  const action = active ? "SCHEDULE_ENABLE" : "SCHEDULE_DISABLE";
  return `${action}:${cleanId}`;
}

// Serialize playlists
export function serializePlaylistPlay(name: string): string {
  return `PLAYLIST_PLAY:${name}`;
}
export function serializePlaylistCreate(name: string, trackIds: (string|number)[] = []): string {
  return `PLAYLIST_CREATE:${name}:${trackIds.join(',')}`;
}
export function serializePlaylistDelete(name: string): string {
  return `PLAYLIST_DELETE:${name}`;
}
export function serializePlaylistStop(): string {
  return `PLAYLIST_STOP`;
}

const API_BASE = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');

// API bridge to the server command publisher
export async function sendCommandToServer(feed: string, payload: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/command`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ feed, payload }),
    });
    if (!response.ok) {
      console.error(`HTTP error posting command to feed ${feed}: ${response.statusText}`);
      return false;
    }
    const result = await response.json();
    return !!result.success;
  } catch (error) {
    console.error(`Error sending command to server:`, error);
    return false;
  }
}

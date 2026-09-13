export interface Song {
  id: number;
  fileNum: string;
  title: string;
  artist: string;
  category: string;
  duration: string;
  durationSec: number;
  artwork: string;
}

export interface Playlist {
  id: string;
  name: string;
  count: number;
  desc: string;
  icon: string;
  badge: string;
}

export interface Schedule {
  id: number;
  name: string;
  time: string;
  days: string;
  playlist: string;
  volume: number;
  active: boolean;
}

export interface Member {
  id: number;
  name: string;
  role: string;
  phone: string;
  access: string;
  avatar: string;
}

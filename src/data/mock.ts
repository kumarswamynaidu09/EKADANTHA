import { Song, Playlist, Schedule, Member } from '../types';

export const INITIAL_SD_SONGS: Song[] = [
  { id: 1, fileNum: "01 / 18", title: "Sukh Karta Dukh Harta", artist: "Lata Mangeshkar", category: "Aarti", duration: "4:32", durationSec: 272, artwork: "🕉️" },
  { id: 2, fileNum: "02 / 18", title: "Ganesh Aarti Traditional", artist: "Anuradha Paudwal", category: "Traditional", duration: "5:18", durationSec: 318, artwork: "🪔" },
  { id: 3, fileNum: "03 / 18", title: "Ganpati Bappa Morya Devotional", artist: "Shankar Mahadevan", category: "Devotional", duration: "3:46", durationSec: 226, artwork: "✨" },
  { id: 4, fileNum: "04 / 18", title: "Vakratunda Mahakaya", artist: "Suresh Wadkar", category: "Chant", duration: "2:58", durationSec: 178, artwork: "🔔" },
  { id: 5, fileNum: "05 / 18", title: "Morya Re Devotional", artist: "Ajay-Atul", category: "High Energy", duration: "4:12", durationSec: 252, artwork: "🥁" },
  { id: 6, fileNum: "06 / 18", title: "Jai Ganesh Deva", artist: "Hariharan", category: "Aarti", duration: "4:45", durationSec: 285, artwork: "🌺" },
  { id: 7, fileNum: "07 / 18", title: "Shendur Lal Chadhayo", artist: "Ravindra Sathe", category: "Aarti", duration: "3:20", durationSec: 200, artwork: "📯" },
  { id: 8, fileNum: "08 / 18", title: "Gajanana Shri Ganraya", artist: "Sadhana Sargam", category: "Bhajan", duration: "5:05", durationSec: 305, artwork: "🌸" },
  { id: 9, fileNum: "09 / 18", title: "Ganpatichi Aarti", artist: "Chorus", category: "Aarti", duration: "3:55", durationSec: 235, artwork: "🕯️" },
  { id: 10, fileNum: "10 / 18", title: "Pratham Tula Vandito", artist: "Traditional", category: "Classical", duration: "6:10", durationSec: 370, artwork: "🎶" },
  { id: 11, fileNum: "11 / 18", title: "Om Gan Ganapataye Namo Namah", artist: "Anuradha Paudwal", category: "Chant", duration: "10:05", durationSec: 605, artwork: "🧘" },
  { id: 12, fileNum: "12 / 18", title: "Deva Shree Ganesha", artist: "Ajay Gogavale", category: "High Energy", duration: "5:56", durationSec: 356, artwork: "🔥" },
  { id: 13, fileNum: "13 / 18", title: "Ekadantaya Vakratundaya", artist: "Shankar Mahadevan", category: "Devotional", duration: "6:20", durationSec: 380, artwork: "🙏" },
  { id: 14, fileNum: "14 / 18", title: "Gajanana", artist: "Sukhwinder Singh", category: "High Energy", duration: "3:34", durationSec: 214, artwork: "💪" },
  { id: 15, fileNum: "15 / 18", title: "Mourya Gosavi", artist: "Traditional", category: "Aarti", duration: "4:15", durationSec: 255, artwork: "🌅" },
  { id: 16, fileNum: "16 / 18", title: "Parvati Nandan", artist: "Chorus", category: "Bhajan", duration: "5:30", durationSec: 330, artwork: "🌺" },
  { id: 17, fileNum: "17 / 18", title: "Bappa Morya", artist: "Sonu Nigam", category: "Devotional", duration: "4:40", durationSec: 280, artwork: "✨" },
  { id: 18, fileNum: "18 / 18", title: "Ganesh Shloka", artist: "Pandit Jasraj", category: "Classical", duration: "2:15", durationSec: 135, artwork: "🕉️" }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  { id: "p1", name: "Morning Aarti", count: 12, desc: "Traditional morning chanting & stutis", icon: "🌅", badge: "12 songs" },
  { id: "p2", name: "Evening Aarti", count: 8, desc: "Maha Aarti & dhoop deep devotional hymns", icon: "🪔", badge: "8 songs" },
  { id: "p3", name: "Ganpati Special", count: 15, desc: "Curated bhajans and popular devotional tunes", icon: "✨", badge: "15 songs" },
  { id: "p4", name: "Visarjan High-Energy", count: 10, desc: "Energetic Dhol Tasha beats and festive dhun", icon: "🥁", badge: "10 songs" }
];

export const INITIAL_SCHEDULES: Schedule[] = [
  { id: 1, name: "Pratah Morning Aarti", time: "06:30 AM", days: "Daily (All 10 Days)", playlist: "Morning Aarti (12 songs)", volume: 65, active: true },
  { id: 2, name: "Madhyanha Bhajans", time: "12:15 PM", days: "Daily (All 10 Days)", playlist: "Ganpati Special (15 songs)", volume: 45, active: true },
  { id: 3, name: "Sandhya Maha Aarti", time: "07:30 PM", days: "Daily (All 10 Days)", playlist: "Evening Aarti (8 songs)", volume: 80, active: true },
  { id: 4, name: "Late Night Instrumental", time: "10:00 PM", days: "Weekdays Only", playlist: "Traditional Chants", volume: 30, active: false }
];

export const INITIAL_MEMBERS: Member[] = [
  { id: 1, name: "Rahul Deshmukh", role: "Admin / President", phone: "+91 98201 44521", access: "Full Control", avatar: "RD" },
  { id: 2, name: "Arjun Kulkarni", role: "Committee Secretary", phone: "+91 98204 88210", access: "Audio & Schedule", avatar: "AK" },
  { id: 3, name: "Suresh Patil", role: "Sound Technician", phone: "+91 98190 32114", access: "Volume & Tracks Only", avatar: "SP" },
  { id: 4, name: "Tanvi Sawant", role: "Cultural Head", phone: "+91 97652 11984", access: "Playlist Management", avatar: "TS" }
];

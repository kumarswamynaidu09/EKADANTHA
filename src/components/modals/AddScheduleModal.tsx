import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { motion } from 'motion/react';

export function AddScheduleModal({ onClose }: { onClose: () => void }) {
  const { addSchedule } = useAudio();
  const [name, setName] = useState("");
  const [time, setTime] = useState("06:30 AM");
  const [repeatDays, setRepeatDays] = useState(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
  const [playlist, setPlaylist] = useState("Morning Aarti (12 songs)");
  const [volume, setVolume] = useState(70);
  const [enabled, setEnabled] = useState(true);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const toggleDay = (day: string) => {
    if (repeatDays.includes(day)) {
      if (repeatDays.length > 1) {
        setRepeatDays(repeatDays.filter(d => d !== day));
      }
    } else {
      setRepeatDays([...repeatDays, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const daysLabel = repeatDays.length === 7 ? "Daily (All 10 Days)" : repeatDays.join(", ");
    
    addSchedule({
      id: Date.now(),
      name,
      time,
      days: daysLabel,
      playlist,
      volume: Number(volume),
      active: enabled
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-4 text-emerald-50">
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="bg-[#051c13] w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl border border-amber-500/30 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-amber-100">New Audio Schedule</h3>
          <button onClick={onClose} className="p-1 rounded-full text-emerald-300/50 hover:text-amber-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-amber-200 block mb-1">Schedule Name</label>
            <input 
              type="text" 
              placeholder="e.g. Morning Maha Aarti" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#08291b] border border-amber-500/20 text-amber-100 placeholder-emerald-300/40 text-sm focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-amber-200 block mb-1">Playback Time</label>
            <input 
              type="text" 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="06:30 AM"
              className="w-full px-3 py-2.5 rounded-xl bg-[#08291b] border border-amber-500/20 text-amber-100 text-sm font-mono focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-amber-200 block mb-1">Repeat Days</label>
            <div className="flex items-center justify-between gap-1">
              {daysOfWeek.map(day => (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
                    repeatDays.includes(day)
                      ? 'bg-amber-500 text-emerald-950 font-bold'
                      : 'bg-[#08291b] text-emerald-200/70 hover:bg-[#0a3322] border border-amber-500/15'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-amber-200 block mb-1">Playlist / Song Selection</label>
            <select 
              value={playlist}
              onChange={(e) => setPlaylist(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#08291b] border border-amber-500/20 text-amber-100 text-sm focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
            >
              <option className="bg-[#051c13]">Morning Aarti (12 songs)</option>
              <option className="bg-[#051c13]">Evening Aarti (8 songs)</option>
              <option className="bg-[#051c13]">Ganpati Special (15 songs)</option>
              <option className="bg-[#051c13]">Visarjan High-Energy (10 songs)</option>
              <option className="bg-[#051c13]">Track #01 - Sukh Karta Dukh Harta</option>
              <option className="bg-[#051c13]">Track #04 - Vakratunda Mahakaya</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between font-bold text-amber-200 mb-1">
              <span>Volume Level</span>
              <span className="font-mono text-amber-300">{volume}%</span>
            </div>
            <input 
              type="range"
              min="10"
              max="90"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-[#08291b] rounded-xl border border-amber-500/15">
            <div>
              <div className="font-bold text-amber-100">Enable Schedule</div>
              <div className="text-emerald-300/50">Arm timer for automatic trigger</div>
            </div>
            <button 
              type="button"
              onClick={() => setEnabled(!enabled)}
              className={`w-12 h-7 rounded-full p-0.5 transition-colors ${
                enabled ? 'bg-amber-500' : 'bg-[#051c13] border border-amber-500/20'
              }`}
            >
              <div className={`w-6 h-6 rounded-full bg-emerald-950 shadow-md transform transition-transform ${
                enabled ? 'translate-x-5' : 'translate-x-0'
              }`}></div>
            </button>
          </div>

          <div className="pt-3 flex gap-2">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-[#08291b] hover:bg-[#0a3322] text-amber-200 font-semibold border border-amber-500/20 active:scale-95 transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-emerald-950 font-bold shadow-md active:scale-95 transition"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

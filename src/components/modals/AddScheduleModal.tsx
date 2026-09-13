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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-4">
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="bg-white w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl border border-neutral-100 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-neutral-900">New Audio Schedule</h3>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-400 hover:text-neutral-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-neutral-700 block mb-1">Schedule Name</label>
            <input 
              type="text" 
              placeholder="e.g. Morning Maha Aarti" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Playback Time</label>
            <input 
              type="text" 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="06:30 AM"
              className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-sm font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Repeat Days</label>
            <div className="flex items-center justify-between gap-1">
              {daysOfWeek.map(day => (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
                    repeatDays.includes(day)
                      ? 'bg-orange-600 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Playlist / Song Selection</label>
            <select 
              value={playlist}
              onChange={(e) => setPlaylist(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option>Morning Aarti (12 songs)</option>
              <option>Evening Aarti (8 songs)</option>
              <option>Ganpati Special (15 songs)</option>
              <option>Visarjan High-Energy (10 songs)</option>
              <option>Track #01 - Sukh Karta Dukh Harta</option>
              <option>Track #04 - Vakratunda Mahakaya</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between font-bold text-neutral-700 mb-1">
              <span>Volume Level</span>
              <span className="font-mono text-orange-600">{volume}%</span>
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

          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200/60">
            <div>
              <div className="font-bold text-neutral-800">Enable Schedule</div>
              <div className="text-neutral-400">Arm timer for automatic trigger</div>
            </div>
            <button 
              type="button"
              onClick={() => setEnabled(!enabled)}
              className={`w-12 h-7 rounded-full p-0.5 transition-colors ${
                enabled ? 'bg-orange-600' : 'bg-neutral-300'
              }`}
            >
              <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                enabled ? 'translate-x-5' : 'translate-x-0'
              }`}></div>
            </button>
          </div>

          <div className="pt-3 flex gap-2">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold active:scale-95 transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-sm active:scale-95 transition"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

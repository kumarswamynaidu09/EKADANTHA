import { Clock, Info, Plus, Trash2 } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useState } from 'react';
import { AddScheduleModal } from '../modals/AddScheduleModal';

export function ScheduleView() {
  const { schedules, toggleScheduleActive, deleteSchedule } = useAudio();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-4 text-emerald-50">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-amber-100 tracking-tight">Audio Automations</h2>
          <p className="text-xs text-emerald-300/60">Scheduled playback times & routine management</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="text-xs font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-emerald-950 px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Schedule</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {schedules.map((item) => (
          <div 
            key={item.id}
            className={`bg-[#051c13] rounded-3xl p-5 border transition shadow-lg flex flex-col justify-between ${
              item.active ? 'border-amber-500/30' : 'border-amber-500/10 opacity-70'
            }`}
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/30">
                    {item.days}
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <h3 className="text-base font-bold text-amber-100">
                      {item.name}
                    </h3>
                  </div>
                  <div className="text-2xl font-extrabold text-amber-200 font-mono tracking-tight mt-0.5">
                    {item.time}
                  </div>
                </div>

                <button 
                  onClick={() => toggleScheduleActive(item.id)}
                  className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
                    item.active ? 'bg-amber-500' : 'bg-[#08291b] border border-amber-500/20'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full bg-emerald-950 shadow-md transform transition-transform duration-200 ease-in-out ${
                    item.active ? 'translate-x-5 bg-emerald-950' : 'translate-x-0 bg-amber-200/40'
                  }`}></div>
                </button>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-emerald-200/70 bg-[#08291b] p-3 rounded-2xl border border-amber-500/15">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-300/50">Target Playlist:</span>
                  <span className="font-semibold text-amber-200">{item.playlist}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-300/50">Preset Volume:</span>
                  <span className="font-semibold text-amber-300 font-mono">{item.volume}%</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-amber-500/15 flex items-center justify-between text-[11px] text-emerald-300/50">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400/60" />
                Next run: {item.active ? `Tomorrow at ${item.time}` : 'Disabled'}
              </span>
              
              <button 
                onClick={() => {
                  if(confirm(`Delete schedule "${item.name}"?`)) {
                    deleteSchedule(item.id);
                  }
                }}
                className="text-emerald-300/40 hover:text-rose-400 transition p-1"
                title="Delete Schedule"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-amber-200 text-xs mt-6">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Real-time RTC Synced:</span> All automations run directly via internal DS3231 real-time clock on the hardware node. Audio triggers automatically even if mobile device connectivity drops.
        </div>
      </div>

      {showAddModal && <AddScheduleModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}

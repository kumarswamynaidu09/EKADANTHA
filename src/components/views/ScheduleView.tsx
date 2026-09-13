import { Clock, Info, Plus, Trash2 } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useState } from 'react';
import { AddScheduleModal } from '../modals/AddScheduleModal';

export function ScheduleView() {
  const { schedules, toggleScheduleActive, deleteSchedule } = useAudio();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Audio Automations</h2>
          <p className="text-xs text-neutral-500">Scheduled playback times & routine management</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm shadow-orange-500/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Schedule</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {schedules.map((item) => (
          <div 
            key={item.id}
            className={`bg-white rounded-3xl p-5 border transition shadow-sm flex flex-col justify-between ${
              item.active ? 'border-orange-200/80 ring-1 ring-orange-100/50' : 'border-neutral-200/70 opacity-80'
            }`}
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                    {item.days}
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <h3 className="text-base font-bold text-neutral-900">
                      {item.name}
                    </h3>
                  </div>
                  <div className="text-2xl font-extrabold text-neutral-900 font-mono tracking-tight mt-0.5">
                    {item.time}
                  </div>
                </div>

                <button 
                  onClick={() => toggleScheduleActive(item.id)}
                  className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
                    item.active ? 'bg-orange-600' : 'bg-neutral-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    item.active ? 'translate-x-5' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-neutral-600 bg-neutral-50/70 p-3 rounded-2xl border border-neutral-100">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Target Playlist:</span>
                  <span className="font-semibold text-neutral-800">{item.playlist}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Preset Volume:</span>
                  <span className="font-semibold text-neutral-800 font-mono">{item.volume}%</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-neutral-400" />
                Next run: {item.active ? `Tomorrow at ${item.time}` : 'Disabled'}
              </span>
              
              <button 
                onClick={() => {
                  if(confirm(`Delete schedule "${item.name}"?`)) {
                    deleteSchedule(item.id);
                  }
                }}
                className="text-neutral-400 hover:text-rose-500 transition p-1"
                title="Delete Schedule"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/50 flex items-start gap-3 text-orange-950 text-xs mt-6">
        <Info className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Real-time RTC Synced:</span> All automations run directly via internal DS3231 real-time clock on the hardware node. Audio triggers automatically even if mobile device connectivity drops.
        </div>
      </div>

      {showAddModal && <AddScheduleModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}

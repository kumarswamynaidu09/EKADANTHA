import { HardDrive, Code2, Users, UserPlus, RefreshCw, VolumeX } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useState } from 'react';
import { AddMemberModal } from '../modals/AddMemberModal';

export function SettingsView() {
  const { members, triggerCommand } = useAudio();
  const [showAddMember, setShowAddMember] = useState(false);

  const controllerTemp = "38°C";
  const lineVoltage = "230V AC Nominal";

  return (
    <div className="space-y-5 text-emerald-50">
      <div>
        <h2 className="text-xl font-bold text-amber-100 tracking-tight">System Diagnostics & API</h2>
        <p className="text-xs text-emerald-300/60">Hardware parameters, RESTful endpoints & authorized operators</p>
      </div>

      {/* HARDWARE DIAGNOSTICS & STATUS */}
      <div className="bg-[#051c13] rounded-3xl p-5 border border-amber-500/20 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-amber-100 text-sm flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-amber-400" />
            Hardware Specifications & Telemetry
          </h3>
          <span className="text-[10px] font-mono bg-[#08291b] text-amber-200/70 border border-amber-500/20 px-2 py-0.5 rounded">Node ID: Raspberry Pi Pico W</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#08291b] rounded-2xl flex justify-between items-center border border-amber-500/15">
            <span className="text-emerald-300/60">Main Amplifier Status</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Power Active (Read-Only)
            </span>
          </div>
          <div className="p-3 bg-[#08291b] rounded-2xl flex justify-between items-center border border-amber-500/15">
            <span className="text-emerald-300/60">Amplifier Sensed Line</span>
            <span className="font-mono font-semibold text-amber-200">{lineVoltage}</span>
          </div>
          <div className="p-3 bg-[#08291b] rounded-2xl flex justify-between items-center border border-amber-500/15">
            <span className="text-emerald-300/60">Pico Core Temp</span>
            <span className="font-mono font-semibold text-amber-200">{controllerTemp} (Nominal)</span>
          </div>
          <div className="p-3 bg-[#08291b] rounded-2xl flex justify-between items-center border border-amber-500/15">
            <span className="text-emerald-300/60">DFPlayer Mini State</span>
            <span className="font-semibold text-emerald-400">Mounted (SD Card OK)</span>
          </div>
          <div className="p-3 bg-[#08291b] rounded-2xl flex justify-between items-center border border-amber-500/15">
            <span className="text-emerald-300/60">Network IP (Local)</span>
            <span className="font-mono text-amber-200">192.168.1.104</span>
          </div>
          <div className="p-3 bg-[#08291b] rounded-2xl flex justify-between items-center border border-amber-500/15">
            <span className="text-emerald-300/60">Firmware Build</span>
            <span className="font-mono text-amber-200">v2.4.1-ota-prod</span>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-2">
          <button 
            onClick={() => triggerCommand("GET /api/player/status", "Status refreshed")}
            className="text-xs font-semibold bg-[#08291b] hover:bg-[#0a3322] text-amber-200 border border-amber-500/20 px-3 py-2 rounded-xl flex items-center gap-1.5 transition active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Poll Status</span>
          </button>

          <button 
            onClick={() => triggerCommand("POST /api/player/pause", "Audio halted")}
            className="text-xs font-semibold bg-[#08291b] hover:bg-[#0a3322] text-amber-200 border border-amber-500/20 px-3 py-2 rounded-xl flex items-center gap-1.5 transition active:scale-95"
          >
            <VolumeX className="w-3.5 h-3.5 text-amber-400" />
            <span>Audio Halt Test</span>
          </button>
        </div>
      </div>

      {/* API ARCHITECTURE READINESS PANEL */}
      <div className="bg-[#051c13] rounded-3xl p-5 border border-amber-500/20 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-amber-100 text-sm flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-400" />
              RESTful API Architecture Readiness
            </h3>
            <p className="text-xs text-emerald-300/50 mt-0.5">Pico & DFPlayer API Endpoints Specification</p>
          </div>
          <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
            Live Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-[#08291b] rounded-xl flex items-center justify-between border border-amber-500/15">
            <span className="text-amber-400 font-bold">GET</span>
            <span className="text-emerald-200">/api/device/songs</span>
          </div>
          <div className="p-2.5 bg-[#08291b] rounded-xl flex items-center justify-between border border-amber-500/15">
            <span className="text-amber-400 font-bold">GET</span>
            <span className="text-emerald-200">/api/player/current</span>
          </div>
          <div className="p-2.5 bg-[#08291b] rounded-xl flex items-center justify-between border border-amber-500/15">
            <span className="text-emerald-400 font-bold">POST</span>
            <span className="text-emerald-200">/api/player/play</span>
          </div>
          <div className="p-2.5 bg-[#08291b] rounded-xl flex items-center justify-between border border-amber-500/15">
            <span className="text-emerald-400 font-bold">POST</span>
            <span className="text-emerald-200">/api/player/pause</span>
          </div>
          <div className="p-2.5 bg-[#08291b] rounded-xl flex items-center justify-between border border-amber-500/15">
            <span className="text-emerald-400 font-bold">POST</span>
            <span className="text-emerald-200">/api/player/next</span>
          </div>
          <div className="p-2.5 bg-[#08291b] rounded-xl flex items-center justify-between border border-amber-500/15 sm:col-span-2">
            <span className="text-emerald-400 font-bold">POST</span>
            <span className="text-emerald-200">/api/audio/volume</span>
          </div>
        </div>
      </div>

      {/* AUTHORIZED COMMITTEE OPERATORS */}
      <div className="bg-[#051c13] rounded-3xl p-5 border border-amber-500/20 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-amber-100 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              Authorized Committee Operators
            </h3>
            <p className="text-xs text-emerald-300/50 mt-0.5">Role-based remote access for members</p>
          </div>
          <button 
            onClick={() => setShowAddMember(true)}
            className="text-xs font-semibold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1 transition active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Member</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {members.map((mem) => (
            <div key={mem.id} className="p-3 bg-[#08291b] rounded-2xl flex items-center justify-between border border-amber-500/15">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-emerald-950 font-bold flex items-center justify-center text-xs shadow-md">
                  {mem.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-amber-100">{mem.name}</span>
                    {mem.role.includes("Admin") && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-500/30">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-emerald-300/50 mt-0.5">
                    {mem.role} • {mem.phone}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-amber-200 bg-[#051c13] px-2.5 py-1 rounded-lg border border-amber-500/20 shadow-sm">
                  {mem.access}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-xs text-emerald-300/40 py-3 pb-8">
        Ekadantha Ganesh Audio Control Hub • Dedicated to Bappa
      </div>

      {showAddMember && <AddMemberModal onClose={() => setShowAddMember(false)} />}
    </div>
  );
}

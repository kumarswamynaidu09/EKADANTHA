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
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 tracking-tight">System Diagnostics & API</h2>
        <p className="text-xs text-neutral-500">Hardware parameters, RESTful endpoints & authorized operators</p>
      </div>

      {/* HARDWARE DIAGNOSTICS & STATUS */}
      <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-orange-600" />
            Hardware Specifications & Telemetry
          </h3>
          <span className="text-[10px] font-mono bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded">Node ID: ESP32-WROOM-32D</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-neutral-50 rounded-2xl flex justify-between items-center">
            <span className="text-neutral-500">Main Amplifier Status</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Power Active (Read-Only)
            </span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-2xl flex justify-between items-center">
            <span className="text-neutral-500">Amplifier Sensed Line</span>
            <span className="font-mono font-semibold text-neutral-800">{lineVoltage}</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-2xl flex justify-between items-center">
            <span className="text-neutral-500">ESP32 Core Temp</span>
            <span className="font-mono font-semibold text-neutral-800">{controllerTemp} (Nominal)</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-2xl flex justify-between items-center">
            <span className="text-neutral-500">DFPlayer Mini State</span>
            <span className="font-semibold text-emerald-600">Mounted (SD Card OK)</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-2xl flex justify-between items-center">
            <span className="text-neutral-500">Network IP (Local)</span>
            <span className="font-mono text-neutral-800">192.168.1.104</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-2xl flex justify-between items-center">
            <span className="text-neutral-500">Firmware Build</span>
            <span className="font-mono text-neutral-800">v2.4.1-ota-prod</span>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-2">
          <button 
            onClick={() => triggerCommand("GET /api/player/status", "Status refreshed")}
            className="text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-2 rounded-xl flex items-center gap-1.5 transition active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
            <span>Poll Status</span>
          </button>

          <button 
            onClick={() => triggerCommand("POST /api/player/pause", "Audio halted")}
            className="text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-2 rounded-xl flex items-center gap-1.5 transition active:scale-95"
          >
            <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
            <span>Audio Halt Test</span>
          </button>
        </div>
      </div>

      {/* API ARCHITECTURE READINESS PANEL */}
      <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
              <Code2 className="w-4 h-4 text-orange-600" />
              RESTful API Architecture Readiness
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">ESP32 & DFPlayer REST API Endpoints Specification</p>
          </div>
          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
            Live Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-neutral-50 rounded-xl flex items-center justify-between border border-neutral-100">
            <span className="text-blue-600 font-bold">GET</span>
            <span className="text-neutral-700">/api/device/songs</span>
          </div>
          <div className="p-2.5 bg-neutral-50 rounded-xl flex items-center justify-between border border-neutral-100">
            <span className="text-blue-600 font-bold">GET</span>
            <span className="text-neutral-700">/api/player/current</span>
          </div>
          <div className="p-2.5 bg-neutral-50 rounded-xl flex items-center justify-between border border-neutral-100">
            <span className="text-emerald-600 font-bold">POST</span>
            <span className="text-neutral-700">/api/player/play</span>
          </div>
          <div className="p-2.5 bg-neutral-50 rounded-xl flex items-center justify-between border border-neutral-100">
            <span className="text-emerald-600 font-bold">POST</span>
            <span className="text-neutral-700">/api/player/pause</span>
          </div>
          <div className="p-2.5 bg-neutral-50 rounded-xl flex items-center justify-between border border-neutral-100">
            <span className="text-emerald-600 font-bold">POST</span>
            <span className="text-neutral-700">/api/player/next</span>
          </div>
          <div className="p-2.5 bg-neutral-50 rounded-xl flex items-center justify-between border border-neutral-100 sm:col-span-2">
            <span className="text-emerald-600 font-bold">POST</span>
            <span className="text-neutral-700">/api/audio/volume</span>
          </div>
        </div>
      </div>

      {/* AUTHORIZED COMMITTEE OPERATORS */}
      <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-600" />
              Authorized Committee Operators
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">Role-based remote access for members</p>
          </div>
          <button 
            onClick={() => setShowAddMember(true)}
            className="text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl border border-orange-200/60 flex items-center gap-1 transition active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Member</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {members.map((mem) => (
            <div key={mem.id} className="p-3 bg-neutral-50 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  {mem.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-neutral-900">{mem.name}</span>
                    {mem.role.includes("Admin") && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    {mem.role} • {mem.phone}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-neutral-600 bg-white px-2.5 py-1 rounded-lg border border-neutral-200 shadow-sm">
                  {mem.access}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-xs text-neutral-400 py-3 pb-8">
        Ganesh Audio Control Hub • Dedicated to Bappa
      </div>

      {showAddMember && <AddMemberModal onClose={() => setShowAddMember(false)} />}
    </div>
  );
}

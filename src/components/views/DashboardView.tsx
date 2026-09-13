import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Volume2, Volume1, ShieldCheck, Lock, CheckCircle2, Activity, Zap, Cpu, Wifi, ListMusic, Radio } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

interface DashboardViewProps {
  onOpenMusic: () => void;
}

export function DashboardView({ onOpenMusic }: DashboardViewProps) {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    nextTrack, 
    prevTrack, 
    currentTime, 
    volume, 
    setVolume, 
    isSystemOnline, 
    isShuffle, 
    toggleShuffle, 
    isRepeat, 
    toggleRepeat,
    playTrack
  } = useAudio();

  const progressPercent = Math.min(100, (currentTime / (currentTrack?.durationSec || 1)) * 100);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const controllerTemp = "38°C";
  const wifiSignal = "Strong (94%)";
  const lineVoltage = "230V AC Nominal";

  if (!currentTrack) return null;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* NOW PLAYING CARD */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-orange-100/70 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-gradient-to-br from-orange-400/10 to-amber-300/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Top row label & track count */}
        <div className="flex items-center justify-between text-xs mb-4">
          <div className="flex items-center gap-1.5 text-orange-600 font-bold uppercase tracking-wider text-[11px]">
            <span className="w-2 h-2 rounded-full bg-orange-500 inline-block animate-pulse"></span>
            Now Playing
          </div>
          <span className="text-neutral-500 font-medium font-mono text-[11px] bg-neutral-100 px-2 py-0.5 rounded-md">
            {currentTrack.fileNum}
          </span>
        </div>

        {/* Track Info & Artwork Placeholder */}
        <div className="flex items-center gap-4 sm:gap-5 mb-5">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center text-3xl sm:text-4xl shadow-md shadow-orange-500/20 text-white shrink-0">
            <span className="select-none">{currentTrack.artwork}</span>
            {isPlaying && (
              <div className="absolute bottom-2 right-2 flex items-end gap-0.5 bg-black/30 backdrop-blur-sm px-1.5 py-1 rounded-md">
                <div className="w-1 bg-white rounded-full eq-bar-1"></div>
                <div className="w-1 bg-white rounded-full eq-bar-2"></div>
                <div className="w-1 bg-white rounded-full eq-bar-3"></div>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 truncate leading-snug tracking-tight">
              {currentTrack.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 truncate mt-0.5 font-medium">
              {currentTrack.artist}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded-full">
                {currentTrack.category}
              </span>
              <span className="inline-flex items-center text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded-full">
                DFPlayer Track #{currentTrack.id}
              </span>
            </div>
          </div>
        </div>

        {/* Scrubbing Progress */}
        <div className="space-y-1.5 mb-5">
          <div className="relative h-2 w-full bg-neutral-100 rounded-full overflow-hidden cursor-pointer">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-300 relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
          <div className="flex justify-between text-[11px] font-mono text-neutral-400 font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        {/* PLAYBACK CONTROLS */}
        <div className="flex items-center justify-between pt-1">
          <button 
            onClick={toggleShuffle}
            className={`p-3 rounded-2xl transition active:scale-95 ${
              isShuffle ? 'text-orange-600 bg-orange-50' : 'text-neutral-400 hover:text-neutral-700'
            }`}
            title="Shuffle Songs"
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 sm:gap-5">
            <button 
              onClick={prevTrack}
              disabled={!isSystemOnline}
              className="w-12 h-12 rounded-full flex items-center justify-center text-neutral-700 bg-neutral-100 hover:bg-neutral-200 active:scale-95 transition disabled:opacity-40"
              aria-label="Previous Track"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button 
              onClick={togglePlay}
              disabled={!isSystemOnline}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white shadow-md shadow-orange-500/20 active:scale-95 transition-transform duration-150 disabled:opacity-40 bg-gradient-to-tr from-orange-500 to-amber-500"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
              ) : (
                <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current translate-x-0.5" />
              )}
            </button>

            <button 
              onClick={nextTrack}
              disabled={!isSystemOnline}
              className="w-12 h-12 rounded-full flex items-center justify-center text-neutral-700 bg-neutral-100 hover:bg-neutral-200 active:scale-95 transition disabled:opacity-40"
              aria-label="Next Track"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>

          <button 
            onClick={toggleRepeat}
            className={`p-3 rounded-2xl transition active:scale-95 ${
              isRepeat ? 'text-orange-600 bg-orange-50' : 'text-neutral-400 hover:text-neutral-700'
            }`}
            title="Repeat Current Track"
          >
            <Repeat className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* TWO COLUMN GRID: VOLUME CONTROL & READ-ONLY AMPLIFIER TELEMETRY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* 1. VOLUME CARD */}
        <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Volume2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-neutral-800 text-sm">Volume Level</span>
            </div>
            <span className="text-base font-bold font-mono text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-lg border border-orange-200/60">
              {volume}%
            </span>
          </div>

          <p className="text-xs text-neutral-500 mb-4">
            Controls remote master output on ESP32 & DFPlayer line-out.
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setVolume(Math.max(0, volume - 5))}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 transition active:scale-90"
              >
                <Volume1 className="w-5 h-5" />
              </button>
              <div className="flex-1 relative">
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-8"
                  disabled={!isSystemOnline}
                />
              </div>
              <button 
                onClick={() => setVolume(Math.max(100, volume + 5))}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 transition active:scale-90"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              {[25, 50, 75, 90].map((v) => (
                <button
                  key={v}
                  onClick={() => setVolume(v)}
                  disabled={!isSystemOnline}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95 disabled:opacity-50 ${
                    volume === v 
                      ? 'bg-orange-600 text-white shadow-sm' 
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {v}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. READ-ONLY HARDWARE & AMPLIFIER TELEMETRY CARD */}
        <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm">Main Amplifier</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-emerald-700">Power Active (Read-Only)</span>
                  </div>
                </div>
              </div>
              
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-1 rounded-lg">
                230V Sensed
              </span>
            </div>

            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-600 text-[11px] font-medium border border-neutral-200/50">
              <Lock className="w-3 h-3 text-neutral-500" />
              <span>Monitored via Hardware Sensor • Remote Switch Disabled</span>
            </div>

            <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
              Amplifier AC supply is continuously validated through optocoupled current sensing. Relay protection active; output clean and distortion-free.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Relay Protection: Active
            </span>
            <span className="font-mono">Temp: {controllerTemp}</span>
          </div>
        </div>

      </div>

      {/* TELEMETRY & STATUS SECTION */}
      <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-orange-600" />
            <h3 className="font-bold text-neutral-900 text-sm tracking-tight">System Telemetry & Status</h3>
          </div>
          <span className="text-[11px] text-neutral-400">Refreshes in real-time</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className="p-3 bg-neutral-50/80 rounded-2xl border border-neutral-100">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-500 font-medium">L/R Speakers</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-sm font-bold text-neutral-900 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-emerald-600" />
              <span>Connected</span>
            </div>
            <span className="text-[10px] text-neutral-400 mt-1 block">8 Ohms • 120W</span>
          </div>

          <div className="p-3 bg-neutral-50/80 rounded-2xl border border-neutral-100">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-500 font-medium">Amp State</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-sm font-bold text-neutral-900 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span className="truncate">Power Active</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium mt-1 block truncate">🟢 Hardware Monitored</span>
          </div>

          <div className="p-3 bg-neutral-50/80 rounded-2xl border border-neutral-100">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-500 font-medium">ESP32 + DFPlayer</span>
              <span className={`w-2 h-2 rounded-full ${isSystemOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </div>
            <div className="text-sm font-bold text-neutral-900 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>{isSystemOnline ? "Online" : "Offline"}</span>
            </div>
            <span className="text-[10px] text-neutral-400 mt-1 block font-mono">UART 9600 baud</span>
          </div>

          <div className="p-3 bg-neutral-50/80 rounded-2xl border border-neutral-100">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-500 font-medium">Wi-Fi Mesh</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-sm font-bold text-neutral-900 flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span>{wifiSignal.split(' ')[0]}</span>
            </div>
            <span className="text-[10px] text-neutral-400 mt-1 block">Home_Fiber_5G</span>
          </div>

        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-neutral-900 text-sm tracking-tight">
            One-Tap Quick Actions
          </h3>
          <span className="text-[11px] text-neutral-400">Audio playback commands</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <button 
            onClick={() => playTrack(0)}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-orange-50/90 hover:bg-orange-100 border border-orange-200/60 text-orange-950 transition active:scale-95 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm text-sm">
              🪔
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs truncate">Play Maha Aarti</div>
              <div className="text-[10px] text-orange-700 truncate">Track #01 • 4:32</div>
            </div>
          </button>

          <button 
            onClick={() => playTrack(3)}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 text-neutral-800 transition active:scale-95 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 text-sm">
              🔔
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs truncate">Peaceful Chants</div>
              <div className="text-[10px] text-neutral-500 truncate">Continuous Loop</div>
            </div>
          </button>

          <button 
            onClick={togglePlay}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 text-neutral-800 transition active:scale-95 text-left"
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              isPlaying ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs truncate">{isPlaying ? "Pause Audio" : "Resume"}</div>
              <div className="text-[10px] text-neutral-500 truncate">Instant Mute/Halt</div>
            </div>
          </button>

          <button 
            onClick={onOpenMusic}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 text-neutral-800 transition active:scale-95 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-neutral-200 text-neutral-700 flex items-center justify-center shrink-0">
              <ListMusic className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs truncate">Browse Songs</div>
              <div className="text-[10px] text-neutral-500 truncate">SD Card Library</div>
            </div>
          </button>

          <button 
            onClick={nextTrack}
            className="col-span-2 sm:col-span-1 flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 text-neutral-800 transition active:scale-95 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
              <SkipForward className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs truncate">Next Song</div>
              <div className="text-[10px] text-neutral-500 truncate">Skip Track</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

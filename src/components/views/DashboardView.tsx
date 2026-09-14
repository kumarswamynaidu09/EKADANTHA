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

  if (!currentTrack) return null;

  return (
    <div className="space-y-4 sm:space-y-5 text-emerald-50">
      {/* NOW PLAYING CARD */}
      <div className="bg-gradient-to-br from-[#062116] via-[#041a11] to-[#020d08] rounded-3xl p-5 sm:p-6 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top row label & track count */}
        <div className="flex items-center justify-between text-xs mb-4">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold uppercase tracking-widest text-[11px]">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse"></span>
            Now Playing
          </div>
          <span className="text-amber-200/70 font-medium font-mono text-[11px] bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
            {currentTrack.fileNum}
          </span>
        </div>

        {/* Track Info & Artwork */}
        <div className="flex items-center gap-4 sm:gap-5 mb-5">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-3xl sm:text-4xl shadow-lg shadow-amber-500/20 text-emerald-950 shrink-0">
            <span className="select-none">{currentTrack.artwork}</span>
            {isPlaying && (
              <div className="absolute bottom-2 right-2 flex items-end gap-0.5 bg-emerald-950/60 backdrop-blur-sm px-1.5 py-1 rounded-md border border-amber-500/30">
                <div className="w-1 bg-amber-300 rounded-full eq-bar-1"></div>
                <div className="w-1 bg-amber-300 rounded-full eq-bar-2"></div>
                <div className="w-1 bg-amber-300 rounded-full eq-bar-3"></div>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-amber-100 truncate leading-snug tracking-tight">
              {currentTrack.title}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/70 truncate mt-0.5 font-medium">
              {currentTrack.artist}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center text-[10px] font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                {currentTrack.category}
              </span>
              <span className="inline-flex items-center text-[10px] font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                DFPlayer Track #{currentTrack.id}
              </span>
            </div>
          </div>
        </div>

        {/* Scrubbing Progress */}
        <div className="space-y-1.5 mb-5">
          <div className="relative h-2 w-full bg-[#08291b] rounded-full overflow-hidden cursor-pointer border border-amber-500/20">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-300 relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-amber-100 rounded-full shadow-md"></div>
            </div>
          </div>
          <div className="flex justify-between text-[11px] font-mono text-amber-200/60 font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        {/* PLAYBACK CONTROLS */}
        <div className="flex items-center justify-between pt-1">
          <button 
            onClick={toggleShuffle}
            className={`p-3 rounded-2xl transition active:scale-95 ${
              isShuffle ? 'text-amber-300 bg-amber-500/20 border border-amber-500/40' : 'text-emerald-300/40 hover:text-amber-200'
            }`}
            title="Shuffle Songs"
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 sm:gap-5">
            <button 
              onClick={prevTrack}
              className="w-12 h-12 rounded-full flex items-center justify-center text-amber-200 bg-[#082b1c] border border-amber-500/20 hover:bg-[#0a3522] active:scale-95 transition"
              aria-label="Previous Track"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button 
              onClick={togglePlay}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-emerald-950 font-bold shadow-lg shadow-amber-500/25 active:scale-95 transition-transform duration-150 bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-500"
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
              className="w-12 h-12 rounded-full flex items-center justify-center text-amber-200 bg-[#082b1c] border border-amber-500/20 hover:bg-[#0a3522] active:scale-95 transition"
              aria-label="Next Track"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>

          <button 
            onClick={toggleRepeat}
            className={`p-3 rounded-2xl transition active:scale-95 ${
              isRepeat ? 'text-amber-300 bg-amber-500/20 border border-amber-500/40' : 'text-emerald-300/40 hover:text-amber-200'
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
        <div className="bg-[#051c13] rounded-3xl p-5 border border-amber-500/20 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-300 flex items-center justify-center border border-amber-500/30">
                <Volume2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-amber-100 text-sm">Volume Level</span>
            </div>
            <span className="text-base font-bold font-mono text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
              {Math.round((volume / 30) * 100)}%
            </span>
          </div>

          <p className="text-xs text-emerald-300/60 mb-4">
            Controls remote master output on Pico & DFPlayer line-out.
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setVolume(Math.max(0, volume - 1))}
                className="p-1.5 text-emerald-300/40 hover:text-amber-200 transition active:scale-90"
              >
                <Volume1 className="w-5 h-5" />
              </button>
              <div className="flex-1 relative">
                <input 
                  type="range"
                  min="0"
                  max="30"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-8"
                />
              </div>
              <button 
                onClick={() => setVolume(Math.min(30, volume + 1))}
                className="p-1.5 text-emerald-300/40 hover:text-amber-200 transition active:scale-90"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              {[25, 50, 75, 90].map((v) => {
                const targetVol = Math.round((v / 100) * 30);
                return (
                  <button
                    key={v}
                    onClick={() => setVolume(targetVol)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95 ${
                      volume === targetVol 
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-emerald-950 font-bold shadow-md' 
                        : 'bg-[#08291b] text-emerald-200/70 hover:bg-[#0a3322] border border-amber-500/10'
                    }`}
                  >
                    {v}%
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. READ-ONLY HARDWARE & AMPLIFIER TELEMETRY CARD */}
        <div className="bg-[#051c13] rounded-3xl p-5 border border-amber-500/20 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-100 text-sm">Main Amplifier</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold text-emerald-400">Power Active (Read-Only)</span>
                  </div>
                </div>
              </div>
              
              <span className="text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded-lg">
                230V Sensed
              </span>
            </div>

            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#08291b] text-amber-200/70 text-[11px] font-medium border border-amber-500/15">
              <Lock className="w-3 h-3 text-amber-400/60" />
              <span>Monitored via Hardware Sensor</span>
            </div>

            <p className="text-xs text-emerald-200/60 mt-3 leading-relaxed">
              Amplifier AC supply validated through optocoupled sensing. Relay protection active; output clean and distortion-free.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-500/15 flex items-center justify-between text-xs text-emerald-200/60">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Relay Protection: Active
            </span>
            <span className="font-mono text-amber-300/80">Temp: {controllerTemp}</span>
          </div>
        </div>

      </div>

      {/* TELEMETRY & STATUS SECTION */}
      <div className="bg-[#051c13] rounded-3xl p-5 border border-amber-500/20 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-amber-100 text-sm tracking-tight">System Telemetry & Status</h3>
          </div>
          <span className="text-[11px] text-emerald-300/50">Refreshes in real-time</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className="p-3 bg-[#082b1c] rounded-2xl border border-amber-500/15">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-emerald-300/60 font-medium">L/R Speakers</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="text-sm font-bold text-amber-200 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>Connected</span>
            </div>
            <span className="text-[10px] text-emerald-300/50 mt-1 block">8 Ohms • 120W</span>
          </div>

          <div className="p-3 bg-[#082b1c] rounded-2xl border border-amber-500/15">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-emerald-300/60 font-medium">Amp State</span>
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            </div>
            <div className="text-sm font-bold text-amber-200 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="truncate">Power Active</span>
            </div>
            <span className="text-[10px] text-amber-300/70 font-medium mt-1 block truncate">230V Sensed</span>
          </div>

          <div className="p-3 bg-[#082b1c] rounded-2xl border border-amber-500/15">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-emerald-300/60 font-medium">Pico + DFPlayer</span>
              <span className={`w-2 h-2 rounded-full ${isSystemOnline ? 'bg-emerald-400' : 'bg-rose-500'}`}></span>
            </div>
            <div className="text-sm font-bold text-amber-200 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span className="truncate">{isSystemOnline ? "Pico Online" : "Pico Offline"}</span>
            </div>
            <span className="text-[10px] text-emerald-300/50 mt-1 block font-mono">UART 9600 baud</span>
          </div>

          <div className="p-3 bg-[#082b1c] rounded-2xl border border-amber-500/15">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-emerald-300/60 font-medium">Wi-Fi Mesh</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="text-sm font-bold text-amber-200 flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>{wifiSignal.split(' ')[0]}</span>
            </div>
            <span className="text-[10px] text-emerald-300/50 mt-1 block">Home_Fiber_5G</span>
          </div>

        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-[#051c13] rounded-3xl p-5 border border-amber-500/20 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-amber-100 text-sm tracking-tight">
            One-Tap Quick Actions
          </h3>
          <span className="text-[11px] text-emerald-300/50">Audio playback commands</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <button 
            onClick={() => playTrack(0)}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-100 transition active:scale-95 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-emerald-950 flex items-center justify-center shrink-0 shadow-sm text-sm font-bold">
              🪔
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs truncate text-amber-200">Play Maha Aarti</div>
              <div className="text-[10px] text-amber-300/70 truncate">Track #01 • 4:32</div>
            </div>
          </button>

          <button 
            onClick={() => playTrack(3)}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#08291b] hover:bg-[#0a3322] border border-amber-500/15 text-amber-100 transition active:scale-95 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 text-sm">
              🔔
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs truncate text-amber-200">Peaceful Chants</div>
              <div className="text-[10px] text-emerald-300/60 truncate">Continuous Loop</div>
            </div>
          </button>

          <button 
            onClick={togglePlay}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#08291b] hover:bg-[#0a3322] border border-amber-500/15 text-amber-100 transition active:scale-95 text-left"
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              isPlaying ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs truncate text-amber-200">{isPlaying ? "Pause Audio" : "Resume"}</div>
              <div className="text-[10px] text-emerald-300/60 truncate">Instant Mute/Halt</div>
            </div>
          </button>

          <button 
            onClick={onOpenMusic}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#08291b] hover:bg-[#0a3322] border border-amber-500/15 text-amber-100 transition active:scale-95 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <ListMusic className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs truncate text-amber-200">Browse Songs</div>
              <div className="text-[10px] text-emerald-300/60 truncate">SD Card Library</div>
            </div>
          </button>

          <button 
            onClick={nextTrack}
            className="col-span-2 sm:col-span-1 flex items-center gap-2.5 p-3 rounded-2xl bg-[#08291b] hover:bg-[#0a3322] border border-amber-500/15 text-amber-100 transition active:scale-95 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <SkipForward className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs truncate text-amber-200">Next Song</div>
              <div className="text-[10px] text-emerald-300/60 truncate">Skip Track</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

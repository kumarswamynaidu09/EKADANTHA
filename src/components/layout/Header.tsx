import { Radio, Play, Pause } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { motion, AnimatePresence } from 'motion/react';

export function Header() {
  const { isSystemOnline, toggleSystemOnline, commandStatus, isPlaying, togglePlay } = useAudio();

  return (
    <header className="sticky top-0 z-30 bg-[#05170f]/90 backdrop-blur-md border-b border-amber-500/20 px-4 sm:px-6 py-3 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <img 
            src="/ganesha.jpg" 
            alt="Lord Ganesha" 
            className="w-10 h-10 rounded-xl object-cover shadow-md shadow-amber-500/10 ring-2 ring-amber-500/30 shrink-0" 
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-serif font-bold tracking-wider text-amber-200 leading-tight">
                Ekadantha
              </h1>
              <span className="hidden sm:inline-flex text-[10px] font-semibold bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                Chaturthi 2026
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-300/60 mt-0.5">
              {/* Live Online/Offline Pill */}
              <button 
                onClick={toggleSystemOnline}
                title="Click to toggle simulated online/offline hardware state"
                className="inline-flex items-center gap-1.5 hover:opacity-80 transition cursor-pointer font-medium active:scale-95"
              >
                <span className="relative flex h-2 w-2">
                  {isSystemOnline ? (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </>
                  ) : (
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  )}
                </span>
                <span className={isSystemOnline ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
                  {isSystemOnline ? "Pico Controller Online" : "Pico Controller Offline"}
                </span>
              </button>
              <span className="text-emerald-800">•</span>
              <span className="truncate max-w-[150px] text-[11px] text-emerald-400/60">
                {isSystemOnline ? "Home Hub • Live" : "Last sync 2m ago"}
              </span>
            </div>
          </div>
        </div>

        {/* Status / Simulated API Toast & Quick Mute */}
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {commandStatus ? (
              <motion.div 
                key="command"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-xs bg-amber-500/15 text-amber-200 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm max-w-[260px] sm:max-w-xs truncate"
              >
                <Radio className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                <span className="font-mono text-[10px] sm:text-[11px] truncate">{commandStatus}</span>
              </motion.div>
            ) : (
              <motion.div 
                key="node"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden md:flex items-center gap-2 bg-[#08291b] px-2.5 py-1 rounded-full text-xs text-amber-200/70 border border-amber-500/20 font-mono"
              >
                <span>Pico Controller #01</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Audio Stop / Pause */}
          <button 
            onClick={togglePlay}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 ${
              isPlaying 
                ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40' 
                : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
            }`}
            title={isPlaying ? "Instantly Pause Audio" : "Resume Audio"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="hidden sm:inline">{isPlaying ? "Pause Audio" : "Resume"}</span>
          </button>
        </div>

      </div>
    </header>
  );
}

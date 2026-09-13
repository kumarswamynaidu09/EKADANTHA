import { Radio, Play, Pause } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { motion, AnimatePresence } from 'motion/react';

export function Header() {
  const { isSystemOnline, toggleSystemOnline, commandStatus, isPlaying, togglePlay } = useAudio();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/70 px-4 sm:px-6 py-3 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-orange-600 flex items-center justify-center text-white shadow-sm shadow-orange-500/20 ring-2 ring-orange-50">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C11.5 2 8 6 8 11C8 14.5 9.8 17.5 12 18.5C14.2 17.5 16 14.5 16 11C16 6 12.5 2 12 2ZM12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22Z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 leading-tight">
                Ganesh Audio Control
              </h1>
              <span className="hidden sm:inline-flex text-[10px] font-semibold bg-orange-100/70 text-orange-800 px-2 py-0.5 rounded-full border border-orange-200/50">
                Chaturthi 2025
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
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
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </>
                  ) : (
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  )}
                </span>
                <span className={isSystemOnline ? "text-emerald-700 font-semibold" : "text-rose-600 font-semibold"}>
                  {isSystemOnline ? "Pico Controller Online" : "Pico Controller Offline"}
                </span>
              </button>
              <span className="text-neutral-300">•</span>
              <span className="truncate max-w-[150px] text-[11px] text-neutral-500">
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
                className="text-xs bg-orange-50 text-orange-800 border border-orange-200/80 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm max-w-[260px] sm:max-w-xs truncate"
              >
                <Radio className="w-3.5 h-3.5 text-orange-600 shrink-0 animate-pulse" />
                <span className="font-mono text-[10px] sm:text-[11px] truncate">{commandStatus}</span>
              </motion.div>
            ) : (
              <motion.div 
                key="node"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden md:flex items-center gap-2 bg-neutral-100/80 px-2.5 py-1 rounded-full text-xs text-neutral-600 border border-neutral-200/60 font-mono"
              >
                <span>Pico Controller #01</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Audio Stop / Pause */}
          <button 
            onClick={togglePlay}
            disabled={!isSystemOnline}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50 ${
              isPlaying 
                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60' 
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
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

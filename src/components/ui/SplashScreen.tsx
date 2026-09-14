import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number; // duration in ms, default 2800ms
}

export function SplashScreen({ onFinish, duration = 2800 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) {
        onFinish();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.05, 
            filter: "blur(8px)",
            transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } 
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between select-none overflow-hidden font-sans"
          style={{
            background: 'radial-gradient(circle at 50% 35%, #0b2419 0%, #05140e 55%, #020906 100%)',
          }}
        >
          {/* Ambient Lighting & Glow Orbs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ 
              opacity: [0.3, 0.6, 0.4], 
              scale: [0.9, 1.15, 0.95] 
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none"
          />

          {/* Top Status Bar Placeholder Spacing */}
          <div className="w-full pt-10 px-8 flex justify-between text-[11px] text-amber-200/40 font-mono tracking-widest pointer-events-none">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-amber-200/40 inline-block"></span>
              <span className="w-2 h-2 rounded-full bg-amber-200/40 inline-block"></span>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="relative flex-1 w-full max-w-sm flex flex-col items-center justify-center px-6 -mt-4">

            {/* Arched Temple Silhouette (Mandap Archway) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <svg 
                viewBox="0 0 320 440" 
                className="w-full h-[430px] stroke-amber-400/25 fill-none"
                style={{ strokeWidth: 1.2 }}
              >
                {/* Arch outline matching reference */}
                <path d="M 40 400 L 40 210 C 40 100 120 40 160 30 C 200 40 280 100 280 210 L 280 400" />
                <path d="M 55 400 L 55 215 C 55 115 125 60 160 50 C 195 60 265 115 265 215 L 265 400" className="stroke-amber-400/15" />
                {/* Crown Finial Point */}
                <path d="M 160 10 L 160 30" className="stroke-amber-300/60" />
                <circle cx="160" cy="10" r="2" className="fill-amber-300/80" />
                {/* Inner Decorative Halo Ring */}
                <circle cx="160" cy="185" r="95" className="stroke-amber-400/20" />
                <circle cx="160" cy="185" r="105" className="stroke-amber-400/10" strokeDasharray="3 6" />
              </svg>
            </motion.div>

            {/* Floating Ganesha Emblem */}
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.85 }}
              animate={{ 
                opacity: 1, 
                y: [0, -8, 0],
                scale: 1 
              }}
              transition={{ 
                opacity: { duration: 1, ease: "easeOut" },
                scale: { duration: 1, ease: "easeOut" },
                y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative z-10 mb-8"
            >
              <svg 
                viewBox="0 0 200 220" 
                className="w-36 h-40 drop-shadow-[0_0_20px_rgba(234,179,8,0.35)]"
              >
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#ca8a04" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Minimalist Lord Ganesha Line Art (matching screenshot) */}
                {/* Crown / Mukut */}
                <path d="M 100 25 L 100 42" stroke="url(#goldGradient)" strokeWidth="3" strokeLinecap="round" />
                <circle cx="100" cy="20" r="3.5" fill="url(#goldGradient)" />
                <path d="M 88 45 Q 100 32 112 45" stroke="url(#goldGradient)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M 82 56 Q 100 40 118 56" stroke="url(#goldGradient)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M 76 68 Q 100 48 124 68" stroke="url(#goldGradient)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                
                {/* Tilak */}
                <path d="M 100 62 L 100 74" stroke="url(#goldGradient)" strokeWidth="3" strokeLinecap="round" />
                <circle cx="100" cy="79" r="2.5" fill="url(#goldGradient)" />

                {/* Ears */}
                {/* Left Ear */}
                <path d="M 75 70 C 45 65 40 100 68 115 C 78 120 80 110 74 95" stroke="url(#goldGradient)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                {/* Right Ear */}
                <path d="M 125 70 C 155 65 160 100 132 115 C 122 120 120 110 126 95" stroke="url(#goldGradient)" strokeWidth="3.5" fill="none" strokeLinecap="round" />

                {/* Trunk & Head Outline */}
                <path 
                  d="M 80 82 Q 100 70 120 82 C 115 105 125 140 108 160 C 95 175 75 165 80 145 C 83 135 96 135 96 146 C 96 152 90 154 88 149" 
                  stroke="url(#goldGradient)" 
                  strokeWidth="4" 
                  fill="none" 
                  strokeLinecap="round"
                  filter="url(#glow)"
                />

                {/* Tusk detail */}
                <path d="M 86 98 L 76 102" stroke="url(#goldGradient)" strokeWidth="3" strokeLinecap="round" />
                <path d="M 114 98 L 126 104" stroke="url(#goldGradient)" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </motion.div>

            {/* Typography Section */}
            <div className="text-center space-y-3 z-10">

              {/* Main Title EKADANTHA */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-2xl sm:text-3xl font-serif tracking-[0.35em] text-amber-200 uppercase font-medium drop-shadow-[0_2px_10px_rgba(234,179,8,0.2)] pl-2"
              >
                EKADANTHA
              </motion.h1>

              {/* Subtitle GANESH AUDIO CONTROL */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-[11px] sm:text-xs tracking-[0.3em] text-amber-400/80 uppercase font-light pl-1"
              >
                GANESH AUDIO CONTROL
              </motion.p>

              {/* Ornamental Lotus Line */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex items-center justify-center gap-3 py-1"
              >
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-400/50"></div>
                {/* Lotus Icon */}
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-amber-400/80">
                  <path d="M12,3C10.5,6 8,8 5,9C8,11 10,14 12,19C14,14 16,11 19,9C16,8 13.5,6 12,3Z" />
                </svg>
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-400/50"></div>
              </motion.div>

              {/* Tagline DEVOTION MEETS TECHNOLOGY */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="text-[10px] sm:text-[11px] tracking-[0.25em] text-amber-100/60 uppercase font-light pt-1 pl-1"
              >
                DEVOTION MEETS TECHNOLOGY
              </motion.p>

            </div>

          </div>

          {/* Bottom Wave Contours & Spinner */}
          <div className="relative w-full pb-10 flex flex-col items-center justify-end z-10 overflow-hidden">

            {/* Layered Golden Waves SVG */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none"
            >
              <svg viewBox="0 0 1440 320" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                <path 
                  fill="rgba(5, 25, 17, 0.8)" 
                  stroke="rgba(234, 179, 8, 0.25)" 
                  strokeWidth="1.5"
                  d="M0,160 C320,300 420,100 720,220 C1020,340 1120,120 1440,200 L1440,320 L0,320 Z" 
                />
                <path 
                  fill="rgba(2, 10, 6, 0.9)" 
                  stroke="rgba(234, 179, 8, 0.4)" 
                  strokeWidth="1.5"
                  d="M0,220 C240,120 480,280 720,180 C960,80 1200,260 1440,160 L1440,320 L0,320 Z" 
                />
              </svg>
            </motion.div>

            {/* Spinner & Loading Text */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="relative z-20 flex flex-col items-center gap-3 pt-6"
            >
              {/* Ring Spinner */}
              <div className="w-6 h-6 rounded-full border-2 border-amber-400/20 border-t-amber-400 animate-spin" />

              {/* Loading text */}
              <span className="text-[10px] tracking-[0.35em] text-amber-200/60 uppercase font-mono font-light pl-1">
                LOADING...
              </span>
            </motion.div>

          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}

import React, { useState } from 'react';
import { AudioProvider } from './context/AudioContext';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { ToastContainer } from './components/ui/Toast';
import { DashboardView } from './components/views/DashboardView';
import { MusicView } from './components/views/MusicView';
import { ScheduleView } from './components/views/ScheduleView';
import { SettingsView } from './components/views/SettingsView';
import { SplashScreen } from './components/ui/SplashScreen';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, Lock } from 'lucide-react';
import { useAudio } from './context/AudioContext';

function OfflineBanner() {
  const { isSystemOnline, toggleSystemOnline } = useAudio();
  if (isSystemOnline) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-5 bg-[#051c13] border border-rose-500/30 rounded-2xl p-4 flex items-start gap-3 text-rose-200 shadow-lg"
    >
      <div className="p-2 bg-rose-500/20 rounded-xl text-rose-400 mt-0.5 shrink-0 border border-rose-500/30">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-sm text-rose-200">Audio Node Disconnected</h4>
        <p className="text-xs text-rose-300/70 mt-0.5">
          Physical Pico & DFPlayer module is offline. Command dispatches will be stored and synchronized automatically when reconnecting.
        </p>
        <div className="mt-2 flex gap-2">
          <button 
            onClick={toggleSystemOnline}
            className="text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-3 py-1.5 rounded-lg shadow-sm active:scale-95 transition"
          >
            Retry Connection
          </button>
          <span className="text-[11px] text-rose-400/60 self-center">Last ping: 2m ago</span>
        </div>
      </div>
    </motion.div>
  );
}

function MainContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAdminLock, setShowAdminLock] = useState(false);
  const [attemptedTab, setAttemptedTab] = useState('');

  const handleTabChange = (tab: string) => {
    if (tab === 'schedule' || tab === 'settings') {
      setAttemptedTab(tab === 'schedule' ? 'Schedule' : 'Settings');
      setShowAdminLock(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative font-sans bg-[#03100a] text-emerald-50">
      <div className="mandala-bg fixed inset-0 pointer-events-none z-0"></div>
      
      <Header />
      <ToastContainer />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 pb-28 sm:pb-32 relative z-10">
        <OfflineBanner />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {activeTab === 'dashboard' && <DashboardView onOpenMusic={() => setActiveTab('music')} />}
            {activeTab === 'music' && <MusicView />}
            {activeTab === 'schedule' && <ScheduleView />}
            {activeTab === 'settings' && <SettingsView />}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Admin Access Only Popup Modal */}
      <AnimatePresence>
        {showAdminLock && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdminLock(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-sm bg-[#051c13] rounded-2xl border border-amber-500/30 p-6 shadow-2xl text-center z-10 overflow-hidden text-emerald-50"
            >
              {/* Top ambient highlight */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-500" />
              
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/15 text-amber-300 mb-4 border border-amber-500/30">
                <Lock className="w-5 h-5" />
              </div>

              <h3 className="text-base font-bold text-amber-100 leading-snug">
                Admin Access Only
              </h3>
              
              <p className="text-xs text-emerald-300/70 mt-2.5 leading-relaxed">
                The <span className="font-semibold text-amber-200">{attemptedTab}</span> module is currently locked. Administrative authorization is required to access these configurations.
              </p>

              <div className="mt-6">
                <button
                  onClick={() => setShowAdminLock(false)}
                  className="w-full py-2 px-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-emerald-950 rounded-xl text-xs font-bold shadow-md transition active:scale-98"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AudioProvider>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <MainContent />
    </AudioProvider>
  );
}

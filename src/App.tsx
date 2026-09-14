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
import { LoginPage } from './components/auth/LoginPage';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';
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
          <span className="text-[11px] text-rose-400/60 self-center">Checking hardware ping</span>
        </div>
      </div>
    </motion.div>
  );
}

interface MainContentProps {
  onLogout: () => void;
}

function MainContent({ onLogout }: MainContentProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen flex flex-col relative font-sans bg-[#03100a] text-emerald-50">
      <div className="mandala-bg fixed inset-0 pointer-events-none z-0"></div>
      
      <Header onLogout={onLogout} />
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

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ekadantha_admin_auth') === 'true';
  });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('ekadantha_admin_auth');
    setIsAuthenticated(false);
  };

  return (
    <AudioProvider>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      {!showSplash && (
        isAuthenticated ? (
          <MainContent onLogout={handleLogout} />
        ) : (
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        )
      )}
    </AudioProvider>
  );
}

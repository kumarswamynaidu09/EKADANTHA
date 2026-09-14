import { LayoutDashboard, Music, CalendarClock, SlidersHorizontal, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'schedule', label: 'Schedule', icon: CalendarClock, isLocked: true },
    { id: 'settings', label: 'Settings', icon: SlidersHorizontal, isLocked: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#05170f]/95 backdrop-blur-lg border-t border-amber-500/20 px-2 py-1.5 sm:py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-150 relative ${
                isActive 
                  ? 'text-amber-300 font-semibold' 
                  : 'text-emerald-300/40 hover:text-amber-200/80'
              }`}
            >
              <div className="relative p-1 rounded-full z-10">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-amber-300' : 'scale-100'}`} />
                {item.isLocked && (
                  <div className="absolute -top-0.5 -right-0.5 bg-[#03100a] text-amber-400/60 rounded-full p-0.5 border border-amber-500/30">
                    <Lock className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
              {isActive && (
                <motion.div 
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-amber-500/15 rounded-xl border border-amber-500/30 z-0"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
              <span className="text-[11px] mt-0.5 tracking-tight z-10 flex items-center gap-0.5 font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

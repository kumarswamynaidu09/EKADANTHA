import { LayoutDashboard, Music, CalendarClock, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'schedule', label: 'Schedule', icon: CalendarClock },
    { id: 'settings', label: 'Settings', icon: SlidersHorizontal },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-neutral-200/80 px-2 py-1.5 sm:py-2">
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
                  ? 'text-orange-600 font-semibold' 
                  : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <div className="relative p-1 rounded-full z-10">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`} />
              </div>
              {isActive && (
                <motion.div 
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-orange-50/80 rounded-xl z-0"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
              <span className="text-[11px] mt-0.5 tracking-tight z-10">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

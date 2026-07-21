import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  Camera, 
  Dumbbell, 
  Apple, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Building2,
  Presentation
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  alertCount: number;
  lang: 'en' | 'fa';
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  alertCount,
  lang
}) => {
  const isFa = lang === 'fa';

  const menuItems = isFa ? [
    { id: 'coach', label: 'داشبورد اصلی', icon: LayoutDashboard, badge: alertCount > 0 ? alertCount : null },
    { id: 'roster', label: 'لیست تیم و بازیکنان', icon: Users },
    { id: 'biometrics', label: 'پایش بیومتریک و HRV', icon: Activity },
    { id: 'vision', label: 'آنالیز بینایی حرکت', icon: Camera },
    { id: 'builder', label: 'طراح تمرینات', icon: Dumbbell },
    { id: 'nutrition', label: 'هوش تغذیه', icon: Apple },
    { id: 'franchise', label: 'مدیریت باشگاه', icon: Building2 },
    { id: 'investor_deck', label: 'ارائه سرمایه‌گذار', icon: Presentation },
  ] : [
    { id: 'coach', label: 'Dashboard', icon: LayoutDashboard, badge: alertCount > 0 ? alertCount : null },
    { id: 'roster', label: 'Team Roster', icon: Users },
    { id: 'biometrics', label: 'Biometrics & HRV', icon: Activity },
    { id: 'vision', label: 'Motion Analysis', icon: Camera },
    { id: 'builder', label: 'Workout Studio', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrition AI', icon: Apple },
    { id: 'franchise', label: 'Gym Operations', icon: Building2 },
    { id: 'investor_deck', label: 'VC Deck', icon: Presentation },
  ];

  return (
    <aside 
      className={`bg-slate-900 border-r border-slate-800/80 flex flex-col justify-between transition-all duration-300 z-40 sticky top-0 h-screen ${
        isCollapsed ? 'w-16 sm:w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Top Header Branding */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-cyan-500/20 shrink-0">
            A
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <h1 className="font-extrabold text-white text-base tracking-tight flex items-center gap-1">
                APEX<span className="text-cyan-400">OS</span>
              </h1>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block truncate">
                {isFa ? 'سیستم‌عامل ورزشی' : 'Sports Coaching OS'}
              </span>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all hidden sm:flex shrink-0"
        >
          {isCollapsed ? (
            isFa ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          ) : (
            isFa ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Menu Links Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto scrollbar-none">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              
              {!isCollapsed && (
                <span className="truncate flex-1 text-right">{item.label}</span>
              )}

              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                  isActive ? 'bg-white text-slate-950' : 'bg-rose-500 text-white animate-pulse'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer User / System Quick Card */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="truncate text-xs">
              <div className="font-bold text-white truncate">{isFa ? 'هوش مصنوعی زنده' : 'AI Active Engine'}</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isFa ? 'همگام‌سازی بیومتریک' : 'Real-Time Sync'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

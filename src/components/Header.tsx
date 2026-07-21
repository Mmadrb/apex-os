import React from 'react';
import { 
  Users, 
  Dumbbell, 
  Apple, 
  Camera, 
  Building2, 
  Presentation, 
  Smartphone, 
  Cpu, 
  Zap, 
  Globe,
  Activity
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedAthleteName: string;
  lang: 'en' | 'fa';
  setLang: (lang: 'en' | 'fa') => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  selectedAthleteName,
  lang,
  setLang
}) => {
  const isFa = lang === 'fa';

  const navItems = isFa ? [
    { id: 'coach', label: 'مربیگری', icon: Users },
    { id: 'builder', label: 'طراح تمرین', icon: Dumbbell },
    { id: 'nutrition', label: 'هوش تغذیه', icon: Apple },
    { id: 'vision', label: 'آنالیز حرکتی', icon: Camera },
    { id: 'biometrics', label: 'پایش و آزمایش', icon: Activity },
    { id: 'profile360', label: 'شناسنامه ۳۶۰°', icon: Cpu },
    { id: 'franchise', label: 'نمایندگی‌ها', icon: Building2 },
    { id: 'mobile_sim', label: 'اپ موبایل', icon: Smartphone },
    { id: 'investor_deck', label: 'ارائه سرمایه‌گذار', icon: Presentation },
  ] : [
    { id: 'coach', label: 'Coach Hub', icon: Users },
    { id: 'builder', label: 'Workout Studio', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrition AI', icon: Apple },
    { id: 'vision', label: 'Form Kinematics', icon: Camera },
    { id: 'biometrics', label: 'Wearable & Labs', icon: Activity },
    { id: 'profile360', label: '360° Athlete Graph', icon: Cpu },
    { id: 'franchise', label: 'Franchise HQ', icon: Building2 },
    { id: 'mobile_sim', label: 'Athlete Mobile', icon: Smartphone },
    { id: 'investor_deck', label: 'Investor Pitch', icon: Presentation },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-2.5 shadow-2xl">
      <div className="flex flex-col gap-2.5">
        
        {/* Brand Logo, Mobile Controls & Context Ribbon */}
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-black text-lg sm:text-xl tracking-wider shrink-0">
              A
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-xl font-bold tracking-tight text-white flex items-center gap-1">
                  APEX<span className="text-cyan-400">OS</span>
                </h1>
                <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {isFa ? '۳.۴ AI' : 'v3.4 AI'}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 hidden sm:block">
                {isFa ? 'سیستم‌عامل هوشمند مربیگری و عملکرد ورزشی' : 'The Operating System for Fitness & Performance'}
              </p>
            </div>
          </div>

          {/* Right Mobile Actions & Desktop Badges */}
          <div className="flex items-center gap-2">
            
            {/* Language Switcher Button */}
            <button 
              onClick={() => setLang(isFa ? 'en' : 'fa')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-bold transition-all active:scale-95"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isFa ? 'English' : 'فارسی'}</span>
            </button>

            {/* Desktop Only Badges */}
            <div className="hidden md:flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-slate-400">{isFa ? 'هدف: ' : 'Focus: '}</span>
                <span className="font-bold text-white">{selectedAthleteName}</span>
              </div>

              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-[10px] text-cyan-300">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>{isFa ? 'هوش مصنوعی زنده' : 'AI Active'}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Horizontal Scrollable Touch Navigation Bar */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 touch-scroller scrollbar-none border-t border-slate-800/60 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};

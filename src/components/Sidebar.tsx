import React from 'react';
import {
  Apple,
  Camera,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  LayoutDashboard,
  Smartphone,
  Sparkles,
  Users,
  Activity,
  X,
} from 'lucide-react';
import type { AppTab } from '../utils/formatters';
import { formatCount } from '../utils/formatters';
import type { BrandConfig } from '../utils/branding';
import { getAccentClasses } from '../utils/branding';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  alertCount: number;
  lang: 'en' | 'fa';
  brand: BrandConfig;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  alertCount,
  lang,
  brand,
}) => {
  const isFa = lang === 'fa';
  const accent = getAccentClasses(brand.accent);

  const menuItems = isFa
    ? [
        { id: 'coach' as const, label: 'داشبورد اصلی', icon: LayoutDashboard, badge: alertCount > 0 ? alertCount : null },
        { id: 'roster' as const, label: 'لیست ورزشکاران', icon: Users },
        { id: 'biometrics' as const, label: 'پزشکی و بیومتریک', icon: Activity },
        { id: 'vision' as const, label: 'آنالیز حرکت', icon: Camera },
        { id: 'builder' as const, label: 'طراح تمرینات', icon: Dumbbell },
        { id: 'nutrition' as const, label: 'تغذیه', icon: Apple },
        { id: 'mobile_sim' as const, label: 'داشبورد ورزشکار', icon: Smartphone },
      ]
    : [
        { id: 'coach' as const, label: 'Dashboard', icon: LayoutDashboard, badge: alertCount > 0 ? alertCount : null },
        { id: 'roster' as const, label: 'Athletes', icon: Users },
        { id: 'biometrics' as const, label: 'Medical & Biometrics', icon: Activity },
        { id: 'vision' as const, label: 'Motion Analysis', icon: Camera },
        { id: 'builder' as const, label: 'Workout Builder', icon: Dumbbell },
        { id: 'nutrition' as const, label: 'Nutrition', icon: Apple },
        { id: 'mobile_sim' as const, label: 'Athlete Dashboard', icon: Smartphone },
      ];

  const handleTabClick = (tab: AppTab) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  const menuContent = (mobile = false) => (
    <>
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${accent.gradient} flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0`}>
            {brand.productName.slice(0, 1) || 'A'}
          </div>
          {(!isCollapsed || mobile) && (
            <div className="truncate">
              <h1 className="font-extrabold text-white text-base tracking-tight flex items-center gap-1">
                {brand.productName}
              </h1>
              <span className={`text-[10px] font-bold uppercase tracking-wider block truncate ${accent.text}`}>
                {brand.organizationName}
              </span>
            </div>
          )}
        </div>

        {mobile ? (
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            aria-label={isFa ? 'بستن منوی ناوبری' : 'Close navigation menu'}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 transition-all shrink-0 md:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? (isFa ? 'باز کردن منوی کناری' : 'Expand sidebar') : (isFa ? 'جمع کردن منوی کناری' : 'Collapse sidebar')}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 transition-all hidden md:flex shrink-0"
          >
            {isCollapsed ? (isFa ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />) : isFa ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto scrollbar-none" aria-label={isFa ? 'ناوبری اصلی' : 'Primary navigation'}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabClick(item.id)}
              title={isCollapsed && !mobile ? item.label : undefined}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all relative min-h-11 ${
                isActive
                  ? `bg-gradient-to-r ${accent.gradient} text-white shadow-md font-bold`
                  : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-300'}`} />
              {(!isCollapsed || mobile) && <span className="truncate flex-1 text-right">{item.label}</span>}
              {item.badge ? (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${isActive ? 'bg-white text-slate-950' : 'bg-rose-500 text-white animate-pulse'}`}>
                  {formatCount(item.badge, lang)}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {(!isCollapsed || mobile) && (
        <div className="p-3 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${accent.soft} border flex items-center justify-center font-bold text-xs shrink-0`}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="truncate text-xs">
              <div className="font-bold text-white truncate">{isFa ? 'موتور تصمیم‌گیری هوشمند' : 'AI Decision Engine'}</div>
              <div className="text-[10px] text-emerald-300 flex items-center gap-1 font-medium mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{brand.tagline}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <aside
        className={`hidden md:flex bg-slate-900 border-s border-slate-800/80 flex-col justify-between transition-all duration-300 z-40 sticky top-0 h-screen shrink-0 ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
        aria-label={isFa ? 'منوی اصلی' : 'Main sidebar'}
      >
        {menuContent(false)}
      </aside>

      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            type="button"
            aria-label={isFa ? 'بستن پس‌زمینه منوی ناوبری' : 'Close navigation backdrop'}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside
            id="apex-mobile-sidebar"
            className={`absolute top-0 ${isFa ? 'right-0' : 'left-0'} h-full w-72 bg-slate-900 border-s border-slate-800 shadow-2xl flex flex-col`}
            aria-label={isFa ? 'منوی موبایل' : 'Mobile navigation'}
          >
            {menuContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};

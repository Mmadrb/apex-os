import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Globe, 
  ShieldAlert
} from 'lucide-react';
import type { AIRecommendation } from '../types';

interface TopHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  aiRecommendations: AIRecommendation[];
  selectedAthleteName: string;
  lang: 'en' | 'fa';
  setLang: (lang: 'en' | 'fa') => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  aiRecommendations,
  selectedAthleteName,
  lang,
  setLang
}) => {
  const isFa = lang === 'fa';
  const [showNotifications, setShowNotifications] = useState(false);

  const unappliedAlerts = aiRecommendations.filter(r => !r.applied);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 shadow-md">
      <div className="flex items-center justify-between gap-4">
        
        {/* Search Bar Input */}
        <div className="relative flex-1 max-w-md">
          <Search className={`w-4 h-4 absolute ${isFa ? 'right-3.5' : 'left-3.5'} top-3 text-slate-400`} />
          <input
            type="text"
            placeholder={isFa ? 'جستجوی بازیکنان، هشدارهای حرکتی، عضلات...' : 'Search players, motion alerts, metrics...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full ${isFa ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all shadow-inner`}
          />
        </div>

        {/* Right Status Actions Controls */}
        <div className="flex items-center gap-3">
          
          {/* Language Switcher */}
          <button 
            onClick={() => setLang(isFa ? 'en' : 'fa')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-bold transition-all active:scale-95 shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isFa ? 'English' : 'فارسی'}</span>
          </button>

          {/* Notifications Center Button & Popover Drawer */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white relative transition-all active:scale-95 border border-slate-700/60"
            >
              <Bell className="w-4 h-4" />
              {unappliedAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center border-2 border-slate-900 animate-pulse">
                  {unappliedAlerts.length}
                </span>
              )}
            </button>

            {/* Notifications Popover Dropdown Card */}
            {showNotifications && (
              <div className={`absolute ${isFa ? 'left-0' : 'right-0'} top-full mt-2 w-80 sm:w-96 p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 space-y-3 animate-in fade-in zoom-in duration-150`}>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>{isFa ? 'هشدارهای بیومکانیک و ریکاوری فعال' : 'Active Biomechanical Alerts'}</span>
                  </h4>
                  <span className="text-[10px] text-cyan-400 font-mono font-bold">
                    {unappliedAlerts.length} {isFa ? 'هشدار جدید' : 'New'}
                  </span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1 text-xs">
                  {unappliedAlerts.length === 0 ? (
                    <div className="text-slate-400 text-center py-4 text-xs">
                      {isFa ? 'هیچ هشدار جدیدی وجود ندارد.' : 'Zero active alert warnings.'}
                    </div>
                  ) : (
                    unappliedAlerts.map(alert => (
                      <div key={alert.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between font-bold text-white">
                          <span>{alert.athleteName}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {alert.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-tight">{alert.suggestedAction}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar Box */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800/80">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Coach Marcus"
                className="w-9 h-9 rounded-xl object-cover border-2 border-cyan-500 shadow-md"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 absolute -bottom-0.5 -right-0.5" />
            </div>

            <div className="hidden sm:block text-xs">
              <div className="font-extrabold text-white leading-none">
                {isFa ? 'استاد مارکوس ونس' : 'Coach Marcus Vance'}
              </div>
              <div className="text-[10px] text-cyan-400 font-medium mt-0.5">
                {selectedAthleteName ? `${isFa ? 'تمرکز:' : 'Focus:'} ${selectedAthleteName}` : (isFa ? 'سرمربی ارشد' : 'Head Coach')}
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};

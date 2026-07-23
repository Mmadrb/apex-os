import React, { useMemo, useState } from 'react';
import { Bell, CheckCheck, Command, Globe, Menu, Palette, Search, ShieldAlert, X } from 'lucide-react';
import type { AIRecommendation } from '../types';
import type { AppTab, RoleView } from '../utils/formatters';
import { formatCount, getRoleLabel, getTabLabel } from '../utils/formatters';
import type { BrandConfig } from '../utils/branding';
import { getAccentClasses } from '../utils/branding';

interface TopHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  aiRecommendations: AIRecommendation[];
  selectedAthleteName: string;
  lastSynced: string;
  activeTab: AppTab;
  roleView: RoleView;
  lang: 'en' | 'fa';
  brand: BrandConfig;
  setLang: (lang: 'en' | 'fa') => void;
  setRoleView: (role: RoleView) => void;
  onReviewRecommendation: (recId: string) => void;
  onReviewAllRecommendations: () => void;
  onOpenCommandPalette: () => void;
  onOpenBrandStudio: () => void;
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
}

type NotificationFilter = 'unread' | 'all' | 'actioned';

export const TopHeader: React.FC<TopHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  aiRecommendations,
  selectedAthleteName,
  lastSynced,
  activeTab,
  roleView,
  lang,
  brand,
  setLang,
  setRoleView,
  onReviewRecommendation,
  onReviewAllRecommendations,
  onOpenCommandPalette,
  onOpenBrandStudio,
  onToggleMobileSidebar,
  isMobileSidebarOpen,
}) => {
  const isFa = lang === 'fa';
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<NotificationFilter>('unread');
  const accent = getAccentClasses(brand.accent);

  const unreadNotifications = aiRecommendations.filter((recommendation) => !recommendation.reviewed);
  const actionableNotifications = aiRecommendations.filter((recommendation) => !recommendation.applied);
  const pageLabel = getTabLabel(activeTab, lang);

  const syncStatus = useMemo(() => {
    const normalized = lastSynced.toLowerCase();
    if (normalized.includes('hour') || normalized.includes('ساعت')) {
      return {
        tone: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
        dot: 'bg-amber-400',
        label: isFa ? 'همگام‌سازی با تأخیر کوتاه' : 'Sync slightly delayed',
      };
    }

    return {
      tone: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      dot: 'bg-emerald-400',
      label: isFa ? 'همگام‌سازی زنده' : 'Live sync',
    };
  }, [isFa, lastSynced]);

  const filteredNotifications = useMemo(() => {
    if (notificationFilter === 'unread') return unreadNotifications;
    if (notificationFilter === 'actioned') return aiRecommendations.filter((recommendation) => recommendation.applied);
    return aiRecommendations;
  }, [aiRecommendations, notificationFilter, unreadNotifications]);

  const notificationTabs: { id: NotificationFilter; label: string; count: number }[] = [
    { id: 'unread', label: isFa ? 'خوانده‌نشده' : 'Unread', count: unreadNotifications.length },
    { id: 'all', label: isFa ? 'همه' : 'All', count: aiRecommendations.length },
    { id: 'actioned', label: isFa ? 'اقدام‌شده' : 'Actioned', count: aiRecommendations.filter((recommendation) => recommendation.applied).length },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 shadow-md" aria-label={isFa ? 'نوار بالایی داشبورد' : 'Dashboard top bar'}>
      <div className="flex flex-col gap-3 lg:gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              aria-label={isMobileSidebarOpen ? (isFa ? 'بستن منوی ناوبری' : 'Close navigation menu') : (isFa ? 'باز کردن منوی ناوبری' : 'Open navigation menu')}
              aria-expanded={isMobileSidebarOpen}
              aria-controls="apex-mobile-sidebar"
              className="md:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/60 shrink-0"
            >
              {isMobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <div className="min-w-0">
              <div className={`text-[11px] uppercase tracking-[0.18em] font-bold ${accent.text}`}>{brand.organizationName}</div>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <h2 className="text-sm sm:text-base font-black text-white truncate">{pageLabel}</h2>
                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${accent.soft}`}>
                  {getRoleLabel(roleView, lang)}
                </span>
                <span className="text-[11px] text-slate-400 truncate">
                  {selectedAthleteName ? `${isFa ? 'تمرکز فعلی:' : 'Current focus:'} ${selectedAthleteName}` : ''}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-300">
            <span className={`px-2.5 py-1 rounded-full border inline-flex items-center gap-2 ${syncStatus.tone}`}>
              <span className={`w-2 h-2 rounded-full ${syncStatus.dot}`} />
              <span>{syncStatus.label}</span>
            </span>
            <span className="text-slate-400">{isFa ? 'آخرین همگام‌سازی:' : 'Last sync:'} {lastSynced}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-2xl">
            <label htmlFor="global-search" className="sr-only">
              {isFa ? 'جستجو در ورزشکاران، هشدارها و گزارش‌ها' : 'Search athletes, alerts, and reports'}
            </label>
            <Search className={`w-4 h-4 absolute ${isFa ? 'right-3.5' : 'left-3.5'} top-3 text-slate-300`} />
            <input
              id="global-search"
              type="text"
              aria-label={isFa ? 'جستجو در ورزشکاران، هشدارها و گزارش‌ها' : 'Search athletes, alerts, and reports'}
              placeholder={isFa ? 'جستجوی ورزشکاران، هشدارها، گزارش‌ها...' : 'Search athletes, alerts, reports...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${isFa ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:border-cyan-500 transition-all shadow-inner`}
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 justify-end flex-wrap">
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="min-h-11 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-bold text-slate-100 inline-flex items-center gap-2 hover:bg-slate-700"
              aria-label={isFa ? 'باز کردن کامند پالِت' : 'Open command palette'}
            >
              <Command className={`w-4 h-4 ${accent.text}`} />
              <span>{isFa ? 'فرمان‌ها' : 'Commands'}</span>
              <span className="text-[10px] text-slate-400">Ctrl/Cmd + K</span>
            </button>

            <button
              type="button"
              onClick={onOpenBrandStudio}
              className="min-h-11 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-bold text-slate-100 inline-flex items-center gap-2 hover:bg-slate-700"
              aria-label={isFa ? 'باز کردن استودیوی برند' : 'Open brand studio'}
            >
              <Palette className={`w-4 h-4 ${accent.text}`} />
              <span>{isFa ? 'برند' : 'Brand'}</span>
            </button>

            <label className="sr-only" htmlFor="role-view-switcher">
              {isFa ? 'انتخاب نمای نقش' : 'Select role view'}
            </label>
            <select
              id="role-view-switcher"
              value={roleView}
              onChange={(e) => setRoleView(e.target.value as RoleView)}
              aria-label={isFa ? 'انتخاب نمای نقش' : 'Select role view'}
              className="min-h-11 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-bold text-slate-100 focus:border-cyan-500"
            >
              {(['coach', 'athlete', 'nutrition', 'medical'] as const).map((role) => (
                <option key={role} value={role}>
                  {getRoleLabel(role, lang)}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setLang(isFa ? 'en' : 'fa')}
              aria-label={isFa ? 'تغییر زبان به انگلیسی' : 'Switch language to Persian'}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-bold transition-all active:scale-95 shadow-sm min-h-11"
            >
              <Globe className={`w-3.5 h-3.5 ${accent.text}`} />
              <span>{isFa ? 'English' : 'فارسی'}</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label={isFa ? 'باز کردن مرکز هشدارها' : 'Open notification center'}
                aria-haspopup="dialog"
                aria-expanded={showNotifications}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 relative transition-all active:scale-95 border border-slate-700/60 min-h-11 min-w-11"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center border-2 border-slate-900 animate-pulse">
                    {formatCount(unreadNotifications.length, lang)}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  role="dialog"
                  aria-label={isFa ? 'مرکز هشدارها و اعلان‌ها' : 'Notification center'}
                  className={`absolute ${isFa ? 'left-0' : 'right-0'} top-full mt-2 w-[min(94vw,28rem)] p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 space-y-4`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-3">
                    <div>
                      <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <span>{isFa ? 'مرکز هشدارها' : 'Notification center'}</span>
                      </h4>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {isFa ? 'اعلان‌های جدید، اقدام‌شده و قابل پیگیری' : 'New, actioned, and trackable items'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onReviewAllRecommendations}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-[11px] font-bold border border-slate-700 inline-flex items-center gap-1.5 min-h-11"
                    >
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                      {isFa ? 'خواندن همه' : 'Mark all read'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {notificationTabs.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        aria-pressed={notificationFilter === tab.id}
                        onClick={() => setNotificationFilter(tab.id)}
                        className={`px-3 py-2 rounded-xl text-[11px] font-bold border min-h-11 transition-all ${
                          notificationFilter === tab.id
                            ? `${accent.soft}`
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        {tab.label} ({formatCount(tab.count, lang)})
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1 text-xs" aria-live="polite">
                    {filteredNotifications.length === 0 ? (
                      <div className="text-slate-300 text-center py-6 text-xs rounded-xl border border-dashed border-slate-800">
                        {isFa ? 'موردی برای این فیلتر وجود ندارد.' : 'No notifications match this filter.'}
                      </div>
                    ) : (
                      filteredNotifications.map((alert) => (
                        <article key={alert.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-white">{alert.athleteName}</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  {alert.category}
                                </span>
                                {!alert.reviewed && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/20">
                                    {isFa ? 'جدید' : 'New'}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-1">{alert.timestamp}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => onReviewRecommendation(alert.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-[10px] font-bold border border-slate-700 min-h-9"
                            >
                              {isFa ? 'خوانده شد' : 'Mark read'}
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">{alert.suggestedAction}</p>
                          {alert.evidence && (
                            <div className={`text-[10px] rounded-lg border px-2.5 py-2 ${accent.soft}`}>
                              {isFa ? 'منبع: ' : 'Source: '}
                              {alert.evidence.dataSource}
                            </div>
                          )}
                        </article>
                      ))
                    )}
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-[11px] text-slate-300">
                    {isFa
                      ? `هشدارهای نیازمند اقدام: ${formatCount(actionableNotifications.length, lang)} | خوانده‌نشده: ${formatCount(unreadNotifications.length, lang)}`
                      : `Actionable alerts: ${formatCount(actionableNotifications.length, lang)} | Unread: ${formatCount(unreadNotifications.length, lang)}`}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-2.5 ps-2 border-s border-slate-800/80">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt={isFa ? 'تصویر مربی' : 'Coach avatar'}
                  className="w-10 h-10 rounded-xl object-cover border-2 border-cyan-500 shadow-md"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 absolute -bottom-0.5 -right-0.5" />
              </div>

              <div className="text-xs">
                <div className="font-extrabold text-white leading-none">{brand.productName}</div>
                <div className="text-[10px] text-slate-300 font-medium mt-1">{brand.tagline}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden flex items-center gap-2 text-[11px] text-slate-300">
          <span className={`px-2.5 py-1 rounded-full border inline-flex items-center gap-2 ${syncStatus.tone}`}>
            <span className={`w-2 h-2 rounded-full ${syncStatus.dot}`} />
            <span>{syncStatus.label}</span>
          </span>
          <span className="text-slate-400 truncate">{lastSynced}</span>
        </div>
      </div>
    </header>
  );
};

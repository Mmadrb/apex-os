import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Command, Keyboard, Search, Wand2 } from 'lucide-react';
import type { AppTab, RoleView } from '../utils/formatters';
import { getRoleLabel, getTabLabel } from '../utils/formatters';
import { ActionButton } from './ui/ActionButton';
import { PanelShell } from './ui/PanelShell';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  lang?: 'fa' | 'en';
  onNavigateTab: (tab: AppTab) => void;
  onSetRoleView: (role: RoleView) => void;
  onExportExecutiveReport: () => void;
  onExportAthletesCsv: () => void;
  onOpenBrandStudio: () => void;
}

type CommandAction = {
  id: string;
  title: string;
  subtitle: string;
  shortcut?: string;
  run: () => void;
};

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  lang = 'fa',
  onNavigateTab,
  onSetRoleView,
  onExportExecutiveReport,
  onExportAthletesCsv,
  onOpenBrandStudio,
}) => {
  const isFa = lang === 'fa';
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const commands = useMemo<CommandAction[]>(() => [
    {
      id: 'nav-dashboard',
      title: isFa ? 'رفتن به داشبورد' : 'Go to Dashboard',
      subtitle: getTabLabel('coach', lang),
      shortcut: 'G D',
      run: () => onNavigateTab('coach'),
    },
    {
      id: 'nav-athletes',
      title: isFa ? 'رفتن به ورزشکاران' : 'Go to Athletes',
      subtitle: getTabLabel('roster', lang),
      shortcut: 'G A',
      run: () => onNavigateTab('roster'),
    },
    {
      id: 'nav-medical',
      title: isFa ? 'رفتن به پزشکی' : 'Go to Medical',
      subtitle: getTabLabel('biometrics', lang),
      shortcut: 'G M',
      run: () => onNavigateTab('biometrics'),
    },
    {
      id: 'nav-workouts',
      title: isFa ? 'رفتن به طراح تمرینات' : 'Go to Workout Builder',
      subtitle: getTabLabel('builder', lang),
      shortcut: 'G W',
      run: () => onNavigateTab('builder'),
    },
    {
      id: 'role-coach',
      title: isFa ? 'تغییر به نمای مربی' : 'Switch to Coach View',
      subtitle: getRoleLabel('coach', lang),
      run: () => onSetRoleView('coach'),
    },
    {
      id: 'role-athlete',
      title: isFa ? 'تغییر به نمای ورزشکار' : 'Switch to Athlete View',
      subtitle: getRoleLabel('athlete', lang),
      run: () => onSetRoleView('athlete'),
    },
    {
      id: 'role-nutrition',
      title: isFa ? 'تغییر به نمای تغذیه' : 'Switch to Nutrition View',
      subtitle: getRoleLabel('nutrition', lang),
      run: () => onSetRoleView('nutrition'),
    },
    {
      id: 'role-medical',
      title: isFa ? 'تغییر به نمای پزشکی' : 'Switch to Medical View',
      subtitle: getRoleLabel('medical', lang),
      run: () => onSetRoleView('medical'),
    },
    {
      id: 'export-report',
      title: isFa ? 'خروجی گزارش اجرایی Markdown' : 'Export executive Markdown report',
      subtitle: isFa ? 'اسنپ‌شات مدیریتی برای اشتراک' : 'Management snapshot for sharing',
      run: onExportExecutiveReport,
    },
    {
      id: 'export-csv',
      title: isFa ? 'خروجی CSV تیم' : 'Export team CSV',
      subtitle: isFa ? 'گزارش عددی ورزشکاران' : 'Athlete numeric report',
      run: onExportAthletesCsv,
    },
    {
      id: 'brand-studio',
      title: isFa ? 'باز کردن استودیوی برند' : 'Open Brand Studio',
      subtitle: isFa ? 'تنظیم وایت‌لیبل و هویت بصری' : 'Configure white-label branding',
      shortcut: 'B R',
      run: onOpenBrandStudio,
    },
  ], [isFa, lang, onExportAthletesCsv, onExportExecutiveReport, onNavigateTab, onOpenBrandStudio, onSetRoleView]);

  const filteredCommands = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return commands;
    return commands.filter((command) => `${command.title} ${command.subtitle} ${command.shortcut ?? ''}`.toLowerCase().includes(normalized));
  }, [commands, query]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIndex(0);
    setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  useEffect(() => {
    if (activeIndex > filteredCommands.length - 1) {
      setActiveIndex(0);
    }
  }, [activeIndex, filteredCommands.length]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((prev) => (prev + 1) % Math.max(filteredCommands.length, 1));
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((prev) => (prev - 1 + Math.max(filteredCommands.length, 1)) % Math.max(filteredCommands.length, 1));
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        filteredCommands[activeIndex]?.run();
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, filteredCommands, onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[75] flex items-start justify-center p-4 sm:p-8">
      <button type="button" aria-label={isFa ? 'بستن کامند پالِت' : 'Close command palette'} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl mt-8 sm:mt-16">
        <PanelShell
          title={isFa ? 'Command Palette' : 'Command Palette'}
          subtitle={isFa ? 'با Ctrl/Cmd + K باز می‌شود و با کلیدهای جهت و Enter کار می‌کند.' : 'Open with Ctrl/Cmd + K, navigate with arrows, confirm with Enter.'}
          actions={<ActionButton variant="ghost" onClick={onClose}>{isFa ? 'بستن' : 'Close'}</ActionButton>}
        >
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-300" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isFa ? 'جستجوی مسیرها، نقش‌ها، خروجی‌ها...' : 'Search routes, roles, exports...'}
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
            />
            <span className="px-2.5 py-1 rounded-xl border border-slate-700 text-[10px] text-slate-300 inline-flex items-center gap-1">
              <Command className="w-3.5 h-3.5" /> K
            </span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-8 space-y-2 max-h-[24rem] overflow-y-auto pr-1">
              {filteredCommands.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 p-6 text-center text-sm text-slate-400">
                  {isFa ? 'هیچ فرمانی پیدا نشد.' : 'No commands found.'}
                </div>
              ) : (
                filteredCommands.map((command, index) => (
                  <button
                    key={command.id}
                    type="button"
                    onClick={() => {
                      command.run();
                      onClose();
                    }}
                    className={`w-full rounded-2xl border px-4 py-4 text-right transition-all ${
                      index === activeIndex ? 'border-cyan-500/40 bg-cyan-500/10' : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-black text-white text-sm">{command.title}</div>
                        <div className="text-xs text-slate-300 mt-2">{command.subtitle}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {command.shortcut ? <span className="text-[10px] text-slate-400 border border-slate-700 rounded-lg px-2 py-1">{command.shortcut}</span> : null}
                        <ArrowRight className="w-4 h-4 text-cyan-300" />
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="xl:col-span-4 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-[0.18em] flex items-center gap-2"><Keyboard className="w-4 h-4 text-cyan-300" /> {isFa ? 'میانبرها' : 'Shortcuts'}</div>
                <div className="text-xs text-slate-400 mt-3 space-y-2">
                  <div>Ctrl/Cmd + K — {isFa ? 'باز کردن پالِت' : 'Open palette'}</div>
                  <div>Esc — {isFa ? 'بستن' : 'Close'}</div>
                  <div>↑ ↓ — {isFa ? 'حرکت بین فرمان‌ها' : 'Move through commands'}</div>
                  <div>Enter — {isFa ? 'اجرا' : 'Run action'}</div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-[0.18em] flex items-center gap-2"><Wand2 className="w-4 h-4 text-cyan-300" /> {isFa ? 'کارهای سریع' : 'Quick actions'}</div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <ActionButton variant="secondary" onClick={() => { onNavigateTab('coach'); onClose(); }}>{isFa ? 'Dashboard' : 'Dashboard'}</ActionButton>
                  <ActionButton variant="secondary" onClick={() => { onSetRoleView('coach'); onClose(); }}>{isFa ? 'Coach View' : 'Coach View'}</ActionButton>
                  <ActionButton variant="secondary" onClick={() => { onOpenBrandStudio(); onClose(); }}>{isFa ? 'Brand Studio' : 'Brand Studio'}</ActionButton>
                </div>
              </div>
            </div>
          </div>
        </PanelShell>
      </div>
    </div>
  );
};

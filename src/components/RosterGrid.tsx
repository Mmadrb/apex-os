import React, { useEffect, useMemo, useState } from 'react';
import type { AthleteProfile } from '../types';
import type { AppTab } from '../utils/formatters';
import { formatCount } from '../utils/formatters';
import {
  Users,
  ChevronRight,
  Search,
  UserPlus,
  Building2,
  History,
  Filter,
  BookmarkPlus,
} from 'lucide-react';
import { EmptyState } from './ui/EmptyState';

interface RosterGridProps {
  athletes: AthleteProfile[];
  selectedAthlete: AthleteProfile;
  onSelectAthlete: (athlete: AthleteProfile) => void;
  onAddAthlete?: (payload: { name: string; goal: string; affiliatedGym: string; previousCoach: string }) => void;
  onNavigateTab?: (tab: AppTab) => void;
  lang?: 'en' | 'fa';
}

type StatusFilter = 'all' | 'high' | 'ready';
type ComplianceFilter = 'all' | 'elite';

interface SavedRosterFilter {
  id: string;
  name: string;
  statusFilter: StatusFilter;
  complianceFilter: ComplianceFilter;
  gymFilter: string;
}

const STORAGE_KEY = 'apexos-roster-filter-presets';

export const RosterGrid: React.FC<RosterGridProps> = ({
  athletes,
  selectedAthlete,
  onSelectAthlete,
  onAddAthlete,
  lang = 'fa',
}) => {
  const isFa = lang === 'fa';
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [complianceFilter, setComplianceFilter] = useState<ComplianceFilter>('all');
  const [gymFilter, setGymFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [presetName, setPresetName] = useState('');
  const [newAthlete, setNewAthlete] = useState({ name: '', goal: '', affiliatedGym: '', previousCoach: '' });
  const [savedFilters, setSavedFilters] = useState<SavedRosterFilter[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SavedRosterFilter[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedFilters));
  }, [savedFilters]);

  const gyms = useMemo(() => {
    const unique = new Set<string>();
    athletes.forEach((athlete) => (athlete.affiliatedGyms ?? []).forEach((gym) => unique.add(gym)));
    return Array.from(unique);
  }, [athletes]);

  const filtered = athletes.filter((athlete) => {
    const query = searchTerm.toLowerCase();
    const gymText = (athlete.affiliatedGyms ?? []).join(' ').toLowerCase();
    const matchSearch = athlete.name.toLowerCase().includes(query) || athlete.goal.toLowerCase().includes(query) || gymText.includes(query);
    const matchStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'high'
          ? athlete.riskScore === 'High' || athlete.riskScore === 'Moderate' || athlete.riskScore === 'Critical'
          : athlete.riskScore === 'Low';
    const matchCompliance = complianceFilter === 'all' ? true : athlete.workoutCompliancePercent >= 90;
    const matchGym = gymFilter === 'all' ? true : (athlete.affiliatedGyms ?? []).includes(gymFilter);
    return matchSearch && matchStatus && matchCompliance && matchGym;
  });

  const handleAddAthlete = () => {
    if (!onAddAthlete || !newAthlete.name.trim()) return;
    onAddAthlete(newAthlete);
    setNewAthlete({ name: '', goal: '', affiliatedGym: '', previousCoach: '' });
  };

  const handleSaveFilterPreset = () => {
    const name = presetName.trim() || `${statusFilter}-${complianceFilter}-${gymFilter}`;
    setSavedFilters((prev) => [
      {
        id: `preset-${Date.now()}`,
        name,
        statusFilter,
        complianceFilter,
        gymFilter,
      },
      ...prev,
    ].slice(0, 6));
    setPresetName('');
  };

  const applyPreset = (preset: SavedRosterFilter) => {
    setStatusFilter(preset.statusFilter);
    setComplianceFilter(preset.complianceFilter);
    setGymFilter(preset.gymFilter);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-extrabold text-white text-base">
                {isFa ? 'بخش ورزشکاران: پروفایل، باشگاه و سابقه مربیان' : 'Athletes Section: profiles, gyms, and trainer history'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isFa ? 'فیلترهای ذخیره‌شونده برای مدیریت سریع لیست ورزشکاران.' : 'Persistent team filters for fast athlete management.'}
              </p>
            </div>
          </div>

          <div className="relative w-full lg:w-72">
            <Search className={`w-4 h-4 absolute ${isFa ? 'right-3' : 'left-3'} top-3 text-slate-500`} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isFa ? 'جستجو در نام، هدف، باشگاه...' : 'Search name, goal, gym...'}
              className={`w-full rounded-xl bg-slate-950 border border-slate-800 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 ${isFa ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-bold uppercase tracking-[0.18em]">
                <Filter className="w-4 h-4 text-cyan-300" /> {isFa ? 'فیلترهای تیمی' : 'Team filters'}
              </div>
              <span className="text-xs text-slate-400">{isFa ? `${formatCount(filtered.length, lang)} ورزشکار مطابق فیلتر` : `${formatCount(filtered.length, lang)} athletes match filters`}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button onClick={() => setStatusFilter('all')} className={`px-3 py-2 rounded-lg transition-all min-h-11 ${statusFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'}`}>{isFa ? 'همه' : 'All'}</button>
                <button onClick={() => setStatusFilter('high')} className={`px-3 py-2 rounded-lg transition-all min-h-11 ${statusFilter === 'high' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400'}`}>{isFa ? 'ریسک' : 'At Risk'}</button>
                <button onClick={() => setStatusFilter('ready')} className={`px-3 py-2 rounded-lg transition-all min-h-11 ${statusFilter === 'ready' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'}`}>{isFa ? 'آماده' : 'Ready'}</button>
              </div>

              <select value={complianceFilter} onChange={(e) => setComplianceFilter(e.target.value as ComplianceFilter)} className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500">
                <option value="all">{isFa ? 'همه پایبندی‌ها' : 'All compliance levels'}</option>
                <option value="elite">{isFa ? 'پایبندی ۹۰٪ به بالا' : '90%+ compliance'}</option>
              </select>

              <select value={gymFilter} onChange={(e) => setGymFilter(e.target.value)} className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500">
                <option value="all">{isFa ? 'همه باشگاه‌ها' : 'All gyms'}</option>
                {gyms.map((gym) => (
                  <option key={gym} value={gym}>{gym}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="xl:col-span-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-[0.18em]">
              <BookmarkPlus className="w-4 h-4 text-cyan-300" /> {isFa ? 'پریست فیلترها' : 'Filter presets'}
            </div>
            <div className="flex gap-2">
              <input value={presetName} onChange={(e) => setPresetName(e.target.value)} placeholder={isFa ? 'نام پریست...' : 'Preset name...'} className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" />
              <button onClick={handleSaveFilterPreset} className="px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black min-h-11">{isFa ? 'ذخیره' : 'Save'}</button>
            </div>
            <div className="space-y-2">
              {savedFilters.length === 0 ? (
                <div className="text-xs text-slate-500">{isFa ? 'هنوز پریستی ذخیره نشده است.' : 'No saved filter presets yet.'}</div>
              ) : (
                savedFilters.map((preset) => (
                  <button key={preset.id} onClick={() => applyPreset(preset)} className="w-full rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-right hover:border-slate-700 transition-all">
                    <div className="font-bold text-white text-xs">{preset.name}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{preset.statusFilter} • {preset.complianceFilter} • {preset.gymFilter}</div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="md:col-span-2 xl:col-span-3">
              <EmptyState
                title={isFa ? 'ورزشکاری با این فیلترها پیدا نشد' : 'No athletes match these filters'}
                description={isFa ? 'جستجو، باشگاه یا سطح ریسک را تغییر دهید تا نتایج تازه ببینید.' : 'Adjust the search, gym, or risk filters to surface more athlete records.'}
                icon={<Users className="w-5 h-5" />}
              />
            </div>
          ) : filtered.map((player) => {
            const isSelected = selectedAthlete.id === player.id;
            return (
              <div
                key={player.id}
                onClick={() => onSelectAthlete(player)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-4 ${
                  isSelected ? 'bg-slate-950 border-cyan-500 shadow-lg ring-1 ring-cyan-500/30' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={player.avatar} alt={player.name} className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                    <div>
                      <h4 className="font-bold text-white text-sm flex items-center gap-1">
                        {player.name}
                        {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                      </h4>
                      <span className="text-xs text-slate-400">{player.goal}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    player.riskScore === 'High' || player.riskScore === 'Critical'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : player.riskScore === 'Moderate'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {isFa
                      ? player.riskScore === 'High' || player.riskScore === 'Critical'
                        ? 'ریسک بالا'
                        : player.riskScore === 'Moderate'
                          ? 'ریسک متوسط'
                          : 'ایمن'
                      : player.riskScore}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                    <div className="text-slate-500 flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {isFa ? 'باشگاه' : 'Gym'}</div>
                    <div className="text-white mt-2 leading-relaxed">{(player.affiliatedGyms ?? [isFa ? 'ثبت نشده' : 'Not set']).join(' • ')}</div>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                    <div className="text-slate-500 flex items-center gap-1"><History className="w-3.5 h-3.5" /> {isFa ? 'مربیان قبلی' : 'Previous Trainers'}</div>
                    <div className="text-white mt-2 leading-relaxed">{(player.previousCoaches && player.previousCoaches.length > 0 ? player.previousCoaches : [isFa ? 'بدون سابقه' : 'No history']).join(' • ')}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                  <div>
                    <div className="text-[10px] text-slate-500">{isFa ? 'ریکاوری' : 'Recovery'}</div>
                    <div className={`font-bold ${player.wearableSync.recoveryScore > 75 ? 'text-emerald-400' : 'text-amber-400'}`}>{player.wearableSync.recoveryScore}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">{isFa ? 'عضله' : 'Muscle'}</div>
                    <div className="font-bold text-cyan-300">{player.muscleMassKg}kg</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">{isFa ? 'پایبندی' : 'Compliance'}</div>
                    <div className="font-bold text-amber-300 font-mono">{player.workoutCompliancePercent}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold pt-1">
                  <span>{isFa ? 'مشاهده پرونده کامل' : 'Inspect full details'}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {onAddAthlete && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">{isFa ? 'افزودن ورزشکار جدید' : 'Add New Athlete'}</h3>
            </div>
            <button onClick={handleAddAthlete} className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold">{isFa ? 'ثبت' : 'Add'}</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <input value={newAthlete.name} onChange={(e) => setNewAthlete((prev) => ({ ...prev, name: e.target.value }))} placeholder={isFa ? 'نام ورزشکار' : 'Athlete name'} className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" />
            <input value={newAthlete.goal} onChange={(e) => setNewAthlete((prev) => ({ ...prev, goal: e.target.value }))} placeholder={isFa ? 'هدف / تخصص' : 'Goal / specialization'} className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" />
            <input value={newAthlete.affiliatedGym} onChange={(e) => setNewAthlete((prev) => ({ ...prev, affiliatedGym: e.target.value }))} placeholder={isFa ? 'باشگاه وابسته' : 'Affiliated gym'} className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" />
            <input value={newAthlete.previousCoach} onChange={(e) => setNewAthlete((prev) => ({ ...prev, previousCoach: e.target.value }))} placeholder={isFa ? 'مربی قبلی' : 'Previous trainer'} className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" />
          </div>
        </div>
      )}
    </div>
  );
};

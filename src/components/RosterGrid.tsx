import React, { useState } from 'react';
import type { AthleteProfile } from '../types';
import {
  Users,
  ChevronRight,
  Search,
  UserPlus,
  Building2,
  History,
} from 'lucide-react';

interface RosterGridProps {
  athletes: AthleteProfile[];
  selectedAthlete: AthleteProfile;
  onSelectAthlete: (athlete: AthleteProfile) => void;
  onAddAthlete?: (payload: { name: string; goal: string; affiliatedGym: string; previousCoach: string }) => void;
  onNavigateTab?: (tab: string) => void;
  lang?: 'en' | 'fa';
}

export const RosterGrid: React.FC<RosterGridProps> = ({
  athletes,
  selectedAthlete,
  onSelectAthlete,
  onAddAthlete,
  lang = 'fa',
}) => {
  const isFa = lang === 'fa';
  const [statusFilter, setStatusFilter] = useState<'all' | 'high' | 'ready'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newAthlete, setNewAthlete] = useState({ name: '', goal: '', affiliatedGym: '', previousCoach: '' });

  const filtered = athletes.filter((athlete) => {
    const query = searchTerm.toLowerCase();
    const matchSearch =
      athlete.name.toLowerCase().includes(query) ||
      athlete.goal.toLowerCase().includes(query) ||
      (athlete.affiliatedGyms ?? []).join(' ').toLowerCase().includes(query);
    const matchStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'high'
          ? athlete.riskScore === 'High' || athlete.riskScore === 'Moderate' || athlete.riskScore === 'Critical'
          : athlete.riskScore === 'Low';
    return matchSearch && matchStatus;
  });

  const handleAddAthlete = () => {
    if (!onAddAthlete || !newAthlete.name.trim()) return;
    onAddAthlete(newAthlete);
    setNewAthlete({ name: '', goal: '', affiliatedGym: '', previousCoach: '' });
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
                {isFa ? 'مشاهده مشخصات ورزشکار، باشگاه وابسته و تاریخچه مربیان قبلی.' : 'View athlete details, affiliated gyms, and previous trainer history.'}
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

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button onClick={() => setStatusFilter('all')} className={`px-3 py-1 rounded-lg transition-all ${statusFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'}`}>
              {isFa ? 'همه' : 'All'}
            </button>
            <button onClick={() => setStatusFilter('high')} className={`px-3 py-1 rounded-lg transition-all ${statusFilter === 'high' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400'}`}>
              {isFa ? 'نیازمند توجه' : 'At Risk'}
            </button>
            <button onClick={() => setStatusFilter('ready')} className={`px-3 py-1 rounded-lg transition-all ${statusFilter === 'ready' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'}`}>
              {isFa ? 'آماده کامل' : 'Ready'}
            </button>
          </div>
          <span className="text-xs text-slate-400">{isFa ? `${filtered.length} ورزشکار مطابق فیلتر` : `${filtered.length} athletes match filters`}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((player) => {
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
                    <div className={`font-bold ${player.wearableSync.recoveryScore > 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {player.wearableSync.recoveryScore}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">{isFa ? 'عضله' : 'Muscle'}</div>
                    <div className="font-bold text-cyan-300">{player.muscleMassKg}kg</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">{isFa ? 'استمرار' : 'Streak'}</div>
                    <div className="font-bold text-amber-300 font-mono">{player.activeStreakDays}d</div>
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
            <button onClick={handleAddAthlete} className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold">
              {isFa ? 'ثبت' : 'Add'}
            </button>
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

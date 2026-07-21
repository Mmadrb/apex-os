import React, { useState } from 'react';
import type { AthleteProfile } from '../types';
import { 
  Users, 
  ChevronRight
} from 'lucide-react';

interface RosterGridProps {
  athletes: AthleteProfile[];
  selectedAthlete: AthleteProfile;
  onSelectAthlete: (athlete: AthleteProfile) => void;
  onNavigateTab?: (tab: string) => void;
  lang?: 'en' | 'fa';
}

export const RosterGrid: React.FC<RosterGridProps> = ({
  athletes,
  selectedAthlete,
  onSelectAthlete,
  lang = 'fa'
}) => {
  const isFa = lang === 'fa';
  const [statusFilter, setStatusFilter] = useState<'all' | 'high' | 'ready'>('all');
  const [searchTerm] = useState('');

  const filtered = athletes.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        a.goal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' ? true :
                        statusFilter === 'high' ? (a.riskScore === 'High' || a.riskScore === 'Moderate') :
                        (a.riskScore === 'Low');
    return matchSearch && matchStatus;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
      
      {/* Roster Header & Search Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          <h3 className="font-extrabold text-white text-base">
            {isFa ? 'لیست هوشمند بازیکنان و اعضای تیم (Team Roster)' : 'Team Roster & Player Status'}
          </h3>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all ${statusFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'}`}
            >
              {isFa ? 'همه' : 'All'}
            </button>
            <button
              onClick={() => setStatusFilter('high')}
              className={`px-3 py-1 rounded-lg transition-all ${statusFilter === 'high' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400'}`}
            >
              {isFa ? 'نیازمند توجه' : 'At Risk'}
            </button>
            <button
              onClick={() => setStatusFilter('ready')}
              className={`px-3 py-1 rounded-lg transition-all ${statusFilter === 'ready' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'}`}
            >
              {isFa ? 'آماده کامل' : 'Ready'}
            </button>
          </div>
        </div>
      </div>

      {/* Roster Player Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((player) => {
          const isSelected = selectedAthlete.id === player.id;
          return (
            <div
              key={player.id}
              onClick={() => onSelectAthlete(player)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                isSelected 
                  ? 'bg-slate-950 border-cyan-500 shadow-lg ring-1 ring-cyan-500/30' 
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={player.avatar}
                    alt={player.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-1">
                      {player.name}
                      {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                    </h4>
                    <span className="text-xs text-slate-400">{player.goal}</span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  player.riskScore === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  player.riskScore === 'Moderate' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {isFa ? (player.riskScore === 'High' ? 'ریسک بالا' : player.riskScore === 'Moderate' ? 'ریسک متوسط' : 'ایمن') : player.riskScore}
                </span>
              </div>

              {/* Player Telemetry Summary Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                <div>
                  <div className="text-[10px] text-slate-500">{isFa ? 'ریکاوری' : 'Recovery'}</div>
                  <div className={`font-bold ${player.wearableSync.recoveryScore > 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {player.wearableSync.recoveryScore}٪
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">{isFa ? 'نسبت ACWR' : 'ACWR'}</div>
                  <div className={`font-bold ${player.wearableSync.acwrRatio > 1.4 ? 'text-rose-400' : 'text-cyan-300'}`}>
                    {player.wearableSync.acwrRatio}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">{isFa ? 'استمرار' : 'Streak'}</div>
                  <div className="font-bold text-amber-300 font-mono">
                    {player.activeStreakDays}d
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold pt-1">
                <span>{isFa ? 'مشاهده پرونده تخصصی' : 'Inspect Details'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

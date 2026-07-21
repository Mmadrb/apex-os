import React from 'react';
import { 
  Heart, 
  Zap, 
  AlertTriangle, 
  Activity, 
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface StatCardsProps {
  avgHeartRateBpm: number;
  totalSprintKm: number;
  acwrStrainRatio: number;
  teamReadinessPercent: number;
  lang?: 'en' | 'fa';
}

export const StatCards: React.FC<StatCardsProps> = ({
  avgHeartRateBpm,
  totalSprintKm,
  acwrStrainRatio,
  teamReadinessPercent,
  lang = 'fa'
}) => {
  const isFa = lang === 'fa';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Stat Card 1: Avg Heart Rate */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl relative overflow-hidden group hover:border-cyan-500/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-500/20" /> {isFa ? 'میانگین ضربان قلب تیم' : 'Avg Heart Rate'}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
            <ArrowDownRight className="w-3 h-3" /> -۲.۴٪ {isFa ? 'بهبود' : 'vs yesterday'}
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-black text-white font-mono">{avgHeartRateBpm} <span className="text-xs font-normal text-slate-400">bpm</span></div>
          <span className="text-[10px] text-slate-500">{isFa ? 'محدوده استراحت: ۵۲-۶۴' : 'Resting: 52-64 bpm'}</span>
        </div>

        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-rose-500 h-full rounded-full w-[62%]" />
        </div>
      </div>

      {/* Stat Card 2: Sprint Distance */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl relative overflow-hidden group hover:border-cyan-500/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-cyan-400" /> {isFa ? 'مسافت مسابقه / اسپیرینت' : 'Sprint Distance'}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +۱۲.۵٪ {isFa ? 'افزایش توان' : 'power boost'}
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-black text-cyan-300 font-mono">{totalSprintKm} <span className="text-xs font-normal text-slate-400">km</span></div>
          <span className="text-[10px] text-cyan-400/80">{isFa ? 'سرعت > ۲۲ km/h' : 'Speed > 22 km/h'}</span>
        </div>

        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-cyan-400 h-full rounded-full w-[78%]" />
        </div>
      </div>

      {/* Stat Card 3: Fatigue & Muscle Strain Index (ACWR) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl relative overflow-hidden group hover:border-amber-500/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> {isFa ? 'شاخص خستگی و فشار (ACWR)' : 'Fatigue & Strain Level'}
          </span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${
            acwrStrainRatio > 1.4 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}>
            {acwrStrainRatio > 1.4 ? (isFa ? 'مرز بیش‌تمرینی' : 'Overreaching Alert') : (isFa ? 'محدوده بهینه' : 'Optimal Zone')}
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-black text-amber-300 font-mono">{acwrStrainRatio} <span className="text-xs font-normal text-slate-400">ratio</span></div>
          <span className="text-[10px] text-slate-400">{isFa ? 'آستانه خطر: > ۱.۵' : 'Risk threshold > 1.5'}</span>
        </div>

        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-amber-400 h-full rounded-full" style={{ width: `${(acwrStrainRatio / 2) * 100}%` }} />
        </div>
      </div>

      {/* Stat Card 4: Team Readiness Score */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-400" /> {isFa ? 'شاخص آمادگی کل تیم' : 'Team Readiness'}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +۴.۰٪ {isFa ? 'بهبود کیفیت خواب' : 'recovery boost'}
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-black text-emerald-300 font-mono">{teamReadinessPercent}٪</div>
          <span className="text-[10px] text-emerald-400 font-semibold">{isFa ? 'آماده برای مسابقه' : 'Match Ready'}</span>
        </div>

        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${teamReadinessPercent}%` }} />
        </div>
      </div>

    </div>
  );
};

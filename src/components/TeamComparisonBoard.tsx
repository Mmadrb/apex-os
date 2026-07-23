import React, { useMemo, useState } from 'react';
import { ArrowUpDown, Medal, ShieldAlert, Users } from 'lucide-react';
import type { AthleteProfile } from '../types';
import { formatMetricNumber, formatPercent } from '../utils/formatters';
import { EmptyState } from './ui/EmptyState';
import { PanelShell } from './ui/PanelShell';

type CompareMetric = 'recovery' | 'acwr' | 'compliance' | 'muscle';

interface TeamComparisonBoardProps {
  athletes: AthleteProfile[];
  selectedAthlete: AthleteProfile;
  onSelectAthlete: (athlete: AthleteProfile) => void;
  lang?: 'fa' | 'en';
}

export const TeamComparisonBoard: React.FC<TeamComparisonBoardProps> = ({
  athletes,
  selectedAthlete,
  onSelectAthlete,
  lang = 'fa',
}) => {
  const isFa = lang === 'fa';
  const [metric, setMetric] = useState<CompareMetric>('recovery');

  const rankedAthletes = useMemo(() => {
    const getValue = (athlete: AthleteProfile) => {
      switch (metric) {
        case 'acwr':
          return athlete.wearableSync.acwrRatio;
        case 'compliance':
          return athlete.workoutCompliancePercent;
        case 'muscle':
          return athlete.muscleMassKg;
        case 'recovery':
        default:
          return athlete.wearableSync.recoveryScore;
      }
    };

    const copy = [...athletes].sort((a, b) => getValue(b) - getValue(a));
    if (metric === 'acwr') {
      return [...athletes].sort((a, b) => b.wearableSync.acwrRatio - a.wearableSync.acwrRatio);
    }
    return copy;
  }, [athletes, metric]);

  const topPerformer = rankedAthletes[0];
  const atRiskAthlete = [...athletes].sort((a, b) => b.wearableSync.acwrRatio - a.wearableSync.acwrRatio)[0];

  const metricLabel = {
    recovery: isFa ? 'ریکاوری' : 'Recovery',
    acwr: 'ACWR',
    compliance: isFa ? 'پایبندی تمرین' : 'Workout Compliance',
    muscle: isFa ? 'توده عضلانی' : 'Muscle Mass',
  }[metric];

  const formatMetricValue = (athlete: AthleteProfile) => {
    switch (metric) {
      case 'acwr':
        return formatMetricNumber(athlete.wearableSync.acwrRatio, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      case 'compliance':
        return formatPercent(athlete.workoutCompliancePercent);
      case 'muscle':
        return `${formatMetricNumber(athlete.muscleMassKg)} kg`;
      case 'recovery':
      default:
        return formatPercent(athlete.wearableSync.recoveryScore);
    }
  };

  if (athletes.length < 2) {
    return (
      <PanelShell
        title={isFa ? 'مقایسه تیمی ورزشکاران' : 'Team athlete comparison'}
        subtitle={isFa ? 'برای مقایسه تیمی حداقل دو ورزشکار نیاز است.' : 'At least two athletes are needed for team comparison.'}
      >
        <EmptyState
          title={isFa ? 'مقایسه‌گر تیمی هنوز آماده نیست' : 'Team comparison is not ready yet'}
          description={isFa ? 'ورزشکاران بیشتری اضافه کنید تا رتبه‌بندی، مقایسه و تصمیم‌گیری تیمی فعال شود.' : 'Add more athletes to unlock rankings, side-by-side comparison, and team decision support.'}
          icon={<Users className="w-5 h-5" />}
        />
      </PanelShell>
    );
  }

  return (
    <PanelShell
      title={isFa ? 'مقایسه تیمی و رتبه‌بندی ورزشکاران' : 'Team comparison and athlete rankings'}
      subtitle={isFa ? 'نمای مقایسه‌ای برای تصمیم‌گیری سریع بین آمادگی، ریسک، پایبندی و توسعه عضله.' : 'A comparison view for fast decisions across readiness, risk, compliance, and muscle development.'}
      actions={
        <div className="flex flex-wrap gap-2">
          {(['recovery', 'acwr', 'compliance', 'muscle'] as CompareMetric[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setMetric(value)}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-bold min-h-11 inline-flex items-center gap-2 transition-all ${
                metric === value ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 ring-1 ring-cyan-500/30' : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <ArrowUpDown className="w-4 h-4" />
              {value === 'recovery'
                ? isFa ? 'ریکاوری' : 'Recovery'
                : value === 'acwr'
                  ? 'ACWR'
                  : value === 'compliance'
                    ? isFa ? 'پایبندی' : 'Compliance'
                    : isFa ? 'عضله' : 'Muscle'}
            </button>
          ))}
        </div>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <div className="flex items-center gap-2 text-white font-black text-sm">
              <Medal className="w-4 h-4 text-amber-300" />
              {isFa ? 'بالاترین رتبه' : 'Top ranked athlete'}
            </div>
            <div className="text-2xl font-black text-white mt-4">{topPerformer.name}</div>
            <div className="text-sm text-cyan-300 mt-2">{metricLabel}: {formatMetricValue(topPerformer)}</div>
            <div className="text-xs text-slate-400 mt-3">{topPerformer.goal}</div>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-5">
            <div className="flex items-center gap-2 text-white font-black text-sm">
              <ShieldAlert className="w-4 h-4 text-amber-300" />
              {isFa ? 'بیشترین فشار فعلی' : 'Highest current load'}
            </div>
            <div className="text-2xl font-black text-white mt-4">{atRiskAthlete.name}</div>
            <div className="text-sm text-amber-300 mt-2">ACWR {formatMetricNumber(atRiskAthlete.wearableSync.acwrRatio, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="text-xs text-slate-400 mt-3">{atRiskAthlete.riskReason ?? (isFa ? 'نیازمند پایش بیشتر' : 'Needs close monitoring')}</div>
          </div>
        </div>

        <div className="xl:col-span-8 space-y-3">
          {rankedAthletes.slice(0, 5).map((athlete, index) => {
            const selected = athlete.id === selectedAthlete.id;
            return (
              <button
                key={athlete.id}
                type="button"
                onClick={() => onSelectAthlete(athlete)}
                className={`w-full rounded-2xl border p-4 text-right transition-all ${selected ? 'bg-slate-950 border-cyan-500 ring-1 ring-cyan-500/30' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-black text-cyan-300">
                      {index + 1}
                    </span>
                    <img src={athlete.avatar} alt={athlete.name} className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                    <div>
                      <div className="font-black text-white text-sm">{athlete.name}</div>
                      <div className="text-xs text-slate-400 mt-1">{athlete.goal}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs min-w-[50%]">
                    <div>
                      <div className="text-slate-500">{isFa ? 'ریکاوری' : 'Recovery'}</div>
                      <div className="text-emerald-300 font-black mt-1">{formatPercent(athlete.wearableSync.recoveryScore)}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">ACWR</div>
                      <div className="text-amber-300 font-black mt-1">{formatMetricNumber(athlete.wearableSync.acwrRatio, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">{isFa ? 'پایبندی' : 'Compliance'}</div>
                      <div className="text-cyan-300 font-black mt-1">{formatPercent(athlete.workoutCompliancePercent)}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">{metricLabel}</div>
                      <div className="text-white font-black mt-1">{formatMetricValue(athlete)}</div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </PanelShell>
  );
};

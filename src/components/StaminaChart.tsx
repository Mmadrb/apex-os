import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Activity } from 'lucide-react';
import { formatMetricNumber } from '../utils/formatters';

interface StaminaChartProps {
  lang?: 'en' | 'fa';
}

export const StaminaChart: React.FC<StaminaChartProps> = ({ lang = 'fa' }) => {
  const isFa = lang === 'fa';
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('14d');

  const chartDataFa = [
    { day: 'روز ۱', stamina: 92, recovery: 88, workload: 3200 },
    { day: 'روز ۲', stamina: 88, recovery: 85, workload: 4100 },
    { day: 'روز ۳', stamina: 82, recovery: 78, workload: 4800 },
    { day: 'روز ۴', stamina: 74, recovery: 68, workload: 5200 },
    { day: 'روز ۵', stamina: 84, recovery: 82, workload: 2400 },
    { day: 'روز ۶', stamina: 89, recovery: 88, workload: 3800 },
    { day: 'روز ۷', stamina: 94, recovery: 92, workload: 4200 },
    { day: 'روز ۸', stamina: 90, recovery: 89, workload: 4400 },
    { day: 'روز ۹', stamina: 85, recovery: 81, workload: 4900 },
    { day: 'روز ۱۰', stamina: 78, recovery: 72, workload: 5400 },
    { day: 'روز ۱۱', stamina: 88, recovery: 86, workload: 3100 },
    { day: 'روز ۱۲', stamina: 93, recovery: 91, workload: 3900 },
    { day: 'روز ۱۳', stamina: 91, recovery: 88, workload: 4300 },
    { day: 'روز ۱۴', stamina: 88, recovery: 85, workload: 4600 },
  ];

  const chartDataEn = [
    { day: 'Day 1', stamina: 92, recovery: 88, workload: 3200 },
    { day: 'Day 2', stamina: 88, recovery: 85, workload: 4100 },
    { day: 'Day 3', stamina: 82, recovery: 78, workload: 4800 },
    { day: 'Day 4', stamina: 74, recovery: 68, workload: 5200 },
    { day: 'Day 5', stamina: 84, recovery: 82, workload: 2400 },
    { day: 'Day 6', stamina: 89, recovery: 88, workload: 3800 },
    { day: 'Day 7', stamina: 94, recovery: 92, workload: 4200 },
    { day: 'Day 8', stamina: 90, recovery: 89, workload: 4400 },
    { day: 'Day 9', stamina: 85, recovery: 81, workload: 4900 },
    { day: 'Day 10', stamina: 78, recovery: 72, workload: 5400 },
    { day: 'Day 11', stamina: 88, recovery: 86, workload: 3100 },
    { day: 'Day 12', stamina: 93, recovery: 91, workload: 3900 },
    { day: 'Day 13', stamina: 91, recovery: 88, workload: 4300 },
    { day: 'Day 14', stamina: 88, recovery: 85, workload: 4600 },
  ];

  const sourceData = isFa ? chartDataFa : chartDataEn;
  const data = useMemo(() => {
    if (timeRange === '7d') return sourceData.slice(-7);
    return sourceData;
  }, [sourceData, timeRange]);

  const chartSummary = useMemo(() => {
    const latest = data[data.length - 1];
    const peakWorkload = Math.max(...data.map((entry) => entry.workload));
    return isFa
      ? `در بازه ${timeRange}، آخرین استقامت ${formatMetricNumber(latest.stamina, { maximumFractionDigits: 0 })} درصد، ریکاوری ${formatMetricNumber(latest.recovery, { maximumFractionDigits: 0 })} درصد و اوج حجم تمرین ${formatMetricNumber(peakWorkload, { maximumFractionDigits: 0 })} ثبت شد.`
      : `Across ${timeRange}, latest stamina is ${formatMetricNumber(latest.stamina, { maximumFractionDigits: 0 })}%, recovery is ${formatMetricNumber(latest.recovery, { maximumFractionDigits: 0 })}%, and peak workload reached ${formatMetricNumber(peakWorkload, { maximumFractionDigits: 0 })}.`;
  }, [data, isFa, timeRange]);

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4" aria-labelledby="stamina-chart-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 id="stamina-chart-heading" className="font-extrabold text-white text-base">
              {isFa ? 'روند استقامت، ریکاوری و حجم کار' : 'Stamina, recovery, and workload trend'}
            </h3>
            <p className="text-xs text-slate-300">{chartSummary}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold" role="tablist" aria-label={isFa ? 'انتخاب بازه زمانی نمودار' : 'Select chart time range'}>
          {(['7d', '14d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              role="tab"
              aria-selected={timeRange === range}
              className={`px-3 py-2 rounded-lg transition-all min-h-11 ${
                timeRange === range ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
        <div className="h-64 sm:h-80 w-full pt-2" role="img" aria-label={chartSummary}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorStamina" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRecovery" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[40, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="stamina" name={isFa ? 'استقامت' : 'Stamina'} stroke="#06b6d4" fillOpacity={1} fill="url(#colorStamina)" strokeWidth={3} />
              <Area type="monotone" dataKey="recovery" name={isFa ? 'ریکاوری' : 'Recovery'} stroke="#10b981" fillOpacity={1} fill="url(#colorRecovery)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <div className="text-slate-400">{isFa ? 'آخرین استقامت' : 'Latest stamina'}</div>
          <div className="font-black text-cyan-300 mt-2">{formatMetricNumber(data[data.length - 1].stamina, { maximumFractionDigits: 0 })}%</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <div className="text-slate-400">{isFa ? 'آخرین ریکاوری' : 'Latest recovery'}</div>
          <div className="font-black text-emerald-300 mt-2">{formatMetricNumber(data[data.length - 1].recovery, { maximumFractionDigits: 0 })}%</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <div className="text-slate-400">{isFa ? 'اوج حجم تمرین' : 'Peak workload'}</div>
          <div className="font-black text-amber-300 mt-2">{formatMetricNumber(Math.max(...data.map((entry) => entry.workload)), { maximumFractionDigits: 0 })}</div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 text-xs border-t border-slate-800/80 pt-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-cyan-400" />
          <span className="text-slate-300 font-semibold">{isFa ? 'استقامت و ذخایر گلیکوژن' : 'Stamina index'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="text-slate-300 font-semibold">{isFa ? 'ریکاوری عصب خودگردان' : 'Autonomic recovery'}</span>
        </div>
      </div>
    </section>
  );
};

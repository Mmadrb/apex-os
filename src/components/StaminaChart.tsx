import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { Activity } from 'lucide-react';

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
    { day: 'روز ۵ (دی‌لود)', stamina: 84, recovery: 82, workload: 2400 },
    { day: 'روز ۶', stamina: 89, recovery: 88, workload: 3800 },
    { day: 'روز ۷', stamina: 94, recovery: 92, workload: 4200 },
    { day: 'روز ۸', stamina: 90, recovery: 89, workload: 4400 },
    { day: 'روز ۹', stamina: 85, recovery: 81, workload: 4900 },
    { day: 'روز ۱۰', stamina: 78, recovery: 72, workload: 5400 },
    { day: 'روز ۱۱', stamina: 88, recovery: 86, workload: 3100 },
    { day: 'روز ۱۲', stamina: 93, recovery: 91, workload: 3900 },
    { day: 'روز ۱۳', stamina: 91, recovery: 88, workload: 4300 },
    { day: 'روز ۱۴ (امروز)', stamina: 88, recovery: 85, workload: 4600 },
  ];

  const chartDataEn = [
    { day: 'Day 1', stamina: 92, recovery: 88, workload: 3200 },
    { day: 'Day 2', stamina: 88, recovery: 85, workload: 4100 },
    { day: 'Day 3', stamina: 82, recovery: 78, workload: 4800 },
    { day: 'Day 4', stamina: 74, recovery: 68, workload: 5200 },
    { day: 'Day 5 (Deload)', stamina: 84, recovery: 82, workload: 2400 },
    { day: 'Day 6', stamina: 89, recovery: 88, workload: 3800 },
    { day: 'Day 7', stamina: 94, recovery: 92, workload: 4200 },
    { day: 'Day 8', stamina: 90, recovery: 89, workload: 4400 },
    { day: 'Day 9', stamina: 85, recovery: 81, workload: 4900 },
    { day: 'Day 10', stamina: 78, recovery: 72, workload: 5400 },
    { day: 'Day 11', stamina: 88, recovery: 86, workload: 3100 },
    { day: 'Day 12', stamina: 93, recovery: 91, workload: 3900 },
    { day: 'Day 13', stamina: 91, recovery: 88, workload: 4300 },
    { day: 'Day 14 (Today)', stamina: 88, recovery: 85, workload: 4600 },
  ];

  const data = isFa ? chartDataFa : chartDataEn;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="font-extrabold text-white text-base">
              {isFa ? 'روند پایش استقامت، ریکاوری و حجم کارکرد بازیکن (Player Stamina & Recovery Curve)' : 'Player Stamina & Recovery Over Time'}
            </h3>
            <p className="text-xs text-slate-400">
              {isFa ? 'پایش علمی اثر بارهای تمرینی بر ذخایر استقامت و تغییرپذیری ضربان قلب (HRV)' : 'Real-time telemetry trend of player stamina and autonomic recovery reserves.'}
            </p>
          </div>
        </div>

        {/* Time Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          {(['7d', '14d', '30d'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeRange === range ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-64 sm:h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorStamina" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRecovery" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} domain={[40, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} 
            />
            <Area 
              type="monotone" 
              dataKey="stamina" 
              name={isFa ? 'شاخص استقامت (٪)' : 'Stamina %'} 
              stroke="#06b6d4" 
              fillOpacity={1} 
              fill="url(#colorStamina)" 
              strokeWidth={3} 
            />
            <Area 
              type="monotone" 
              dataKey="recovery" 
              name={isFa ? 'امتیاز ریکاوری (٪)' : 'Recovery %'} 
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorRecovery)" 
              strokeWidth={2} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Indicator Legends */}
      <div className="flex items-center justify-center gap-6 text-xs border-t border-slate-800/80 pt-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-cyan-400" />
          <span className="text-slate-300 font-semibold">{isFa ? 'استقامت و ذخایر گلیکوژن' : 'Stamina Index'}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="text-slate-300 font-semibold">{isFa ? 'ریکاوری عصب خودگردان (HRV)' : 'Autonomic Recovery'}</span>
        </div>
      </div>

    </div>
  );
};

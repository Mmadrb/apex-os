import React, { useState } from 'react';
import type { AthleteProfile, LabMarker } from '../types';
import { 
  Activity, 
  Moon, 
  TrendingUp, 
  AlertCircle, 
  ShieldAlert, 
  FlaskConical, 
  Battery
} from 'lucide-react';

interface BiometricsLabProps {
  selectedAthlete: AthleteProfile;
  lang?: 'en' | 'fa';
}

export const BiometricsLab: React.FC<BiometricsLabProps> = ({ selectedAthlete, lang = 'fa' }) => {
  const isFa = lang === 'fa';
  const [activeTabSub, setActiveTabSub] = useState<'wearables' | 'labs'>('wearables');

  const labMarkers: LabMarker[] = [
    {
      name: isFa ? 'تستوسترون کل (Total Testosterone)' : 'Total Testosterone',
      value: selectedAthlete.labResults.totalTestosteroneNgDl || 780,
      unit: 'ng/dL',
      rangeMin: 300,
      rangeMax: 1000,
      status: 'Optimal',
      category: isFa ? 'هورمونی' : 'Hormonal'
    },
    {
      name: isFa ? 'تستوسترون آزاد (Free Testosterone)' : 'Free Testosterone',
      value: selectedAthlete.labResults.freeTestosteronePgMl || 21.4,
      unit: 'pg/mL',
      rangeMin: 9.0,
      rangeMax: 26.0,
      status: 'Optimal',
      category: isFa ? 'هورمونی' : 'Hormonal'
    },
    {
      name: isFa ? 'پروتئین فاز حاد التهابی hs-CRP' : 'hs-CRP (C-Reactive Protein)',
      value: selectedAthlete.labResults.hsCrpMgL || 2.1,
      unit: 'mg/L',
      rangeMin: 0.1,
      rangeMax: 1.0,
      status: (selectedAthlete.labResults.hsCrpMgL || 2.1) > 1.0 ? 'Critical' : 'Optimal',
      category: isFa ? 'شاخص التهابی' : 'Inflammatory'
    },
    {
      name: isFa ? 'کورتیزول سرم (ساعت ۸ صبح)' : 'Cortisol (Morning 8 AM)',
      value: selectedAthlete.labResults.cortisolMcgDl || 18.5,
      unit: 'mcg/dL',
      rangeMin: 6.0,
      rangeMax: 19.0,
      status: (selectedAthlete.labResults.cortisolMcgDl || 18.5) > 18.0 ? 'Borderline' : 'Optimal',
      category: isFa ? 'هورمون استرس' : 'Hormonal'
    },
    {
      name: isFa ? 'قند خون ناشتا (Fasting Glucose)' : 'Fasting Blood Glucose',
      value: selectedAthlete.labResults.fastingGlucoseMgDl || 88,
      unit: 'mg/dL',
      rangeMin: 70,
      rangeMax: 99,
      status: 'Optimal',
      category: isFa ? 'متابولیک' : 'Metabolic'
    },
    {
      name: isFa ? 'کلسترول LDL (چربی بد)' : 'LDL Cholesterol',
      value: selectedAthlete.labResults.ldlMgDl || 95,
      unit: 'mg/dL',
      rangeMin: 50,
      rangeMax: 100,
      status: 'Optimal',
      category: isFa ? 'پروفایل چربی' : 'Lipid Profile'
    }
  ];

  return (
    <div className="p-2 sm:p-4 lg:p-8 space-y-6 lg:space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold uppercase tracking-wider">
              {isFa ? 'مجموعه پایش بیومارکرها و آزمایشگاه بالینی' : 'Biometrics & Clinical Lab Suite'}
            </span>
            <span className="text-xs text-slate-400">{isFa ? 'ورزشکار: ' : 'Athlete: '}<strong className="text-white">{selectedAthlete.name}</strong></span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">{isFa ? 'پایش زنده دورسنجی زیستی و فاکتورهای آزمایشگاهی' : 'Biomarker Telemetry & Health Monitoring'}</h2>
          <p className="text-xs text-slate-400 mt-1">{isFa ? 'تجمیع داده‌های گجت‌های هوشمند Apple Health، WHOOP و Garmin همراه با آزمایش خون تخصصی.' : 'Unified aggregation from Apple Health, WHOOP, Garmin APIs alongside clinical blood panel markers.'}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTabSub('wearables')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTabSub === 'wearables'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{isFa ? 'دورسنجی گجت‌ها' : 'Wearable Telemetry'}</span>
          </button>

          <button
            onClick={() => setActiveTabSub('labs')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTabSub === 'labs'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>{isFa ? 'آزمایش خون بالینی' : 'Clinical Blood Panel'}</span>
          </button>
        </div>
      </div>

      {/* View 1: Wearable Telemetry Streams */}
      {activeTabSub === 'wearables' && (
        <div className="space-y-8">
          
          {/* Main Telemetry Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Activity className="w-4 h-4 text-cyan-400" /> {isFa ? 'شاخص HRV (تغییرپذیری ضربان)' : 'HRV (Heart Rate Var)'}
                </span>
                <span className="text-[10px] text-cyan-400 font-mono bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                  {selectedAthlete.wearableSync.device}
                </span>
              </div>
              <div className="text-2xl font-black text-white">
                {selectedAthlete.wearableSync.hrvMs} ms <span className="text-xs text-slate-400 font-normal">({isFa ? 'پایه: ' : 'Base: '}{selectedAthlete.wearableSync.hrvBaselineMs}ms)</span>
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> {isFa ? 'تعادل عصب خودگردان پایدار' : 'Stable Autonomic Drive'}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Battery className="w-4 h-4 text-emerald-400" /> {isFa ? 'امتیاز ریکاوری روزانه' : 'Daily Recovery'}
                </span>
                <span className="text-xs font-bold text-emerald-400">{selectedAthlete.wearableSync.recoveryScore}٪</span>
              </div>
              <div className="text-2xl font-black text-emerald-300">
                {selectedAthlete.wearableSync.recoveryScore} / ۱۰۰
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${selectedAthlete.wearableSync.recoveryScore}%` }} />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-amber-400" /> {isFa ? 'نسبت فشار ACWR' : 'ACWR Strain Ratio'}
                </span>
                <span className={`text-xs font-bold ${
                  selectedAthlete.wearableSync.acwrRatio > 1.4 ? 'text-rose-400' : 'text-slate-200'
                }`}>
                  {selectedAthlete.wearableSync.acwrRatio}
                </span>
              </div>
              <div className="text-2xl font-black text-amber-300">
                {selectedAthlete.wearableSync.acwrRatio > 1.4 ? (isFa ? 'فشار تمرینی بالا' : 'Elevated Strain') : (isFa ? 'محدوده بهینه' : 'Optimal Zone')}
              </div>
              <div className="text-[10px] text-slate-400">
                {isFa ? `محدوده ایمن: ۰.۸ تا ۱.۳ | فعلی: ${selectedAthlete.wearableSync.acwrRatio}` : `Safe Sweet Spot: 0.8 - 1.3 | Current: ${selectedAthlete.wearableSync.acwrRatio}`}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Moon className="w-4 h-4 text-indigo-400" /> {isFa ? 'معماری و مراحل خواب' : 'Sleep Architecture'}
                </span>
                <span className="text-xs font-bold text-indigo-300">{selectedAthlete.wearableSync.sleepScore}٪</span>
              </div>
              <div className="text-2xl font-black text-indigo-200">
                {selectedAthlete.wearableSync.sleepHours} {isFa ? 'ساعت' : 'hrs'}
              </div>
              <div className="text-[10px] text-indigo-300">
                {isFa ? 'عمیق: ۱.۸س | REM: ۲.۱س | سبک: ۳.۲س' : 'Deep: 1.8h | REM: 2.1h | Light: 3.2h'}
              </div>
            </div>

          </div>

          {/* ACWR & Recovery Trend Graph Box */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">{isFa ? 'طیف شاخص فشار تمرین حاد به مزمن (ACWR)' : 'Acute-to-Chronic Workload Strain (ACWR) Spectrum'}</h3>
                <p className="text-xs text-slate-400">{isFa ? 'تراکم خستگی ۷ روزه متوازن شده در برابر ظرفیت پایه ۲۸ روزه ورزشکار.' : '7-day cumulative training fatigue balanced against 28-day baseline capacity.'}</p>
              </div>
              <span className="text-xs text-cyan-400 font-mono font-bold">{isFa ? 'هشدار پیش‌بینی پیشگیری از آسیب: فعال' : 'Predictive Injury Alert: Active'}</span>
            </div>

            {/* Visual ACWR Spectrum Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-blue-400">{isFa ? 'کاهش بار (زیر ۰.۸)' : 'Underloading (<0.8)'}</span>
                <span className="text-emerald-400">{isFa ? 'زون طلایی تمرین (۰.۸ - ۱.۳)' : 'Optimal Training Zone (0.8 - 1.3)'}</span>
                <span className="text-amber-400">{isFa ? 'مرز خستگی (۱.۳ - ۱.۵)' : 'Overreaching (1.3 - 1.5)'}</span>
                <span className="text-rose-400">{isFa ? 'خطر بالای آسیب (بالای ۱.۵)' : 'High Injury Risk (>1.5)'}</span>
              </div>

              <div className="relative w-full h-6 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex">
                <div className="w-[20%] bg-blue-950/60 border-r border-slate-800 flex items-center justify-center text-[10px] text-blue-300 font-bold">{isFa ? 'افت آمادگی' : 'Deconditioned'}</div>
                <div className="w-[35%] bg-emerald-950/60 border-r border-slate-800 flex items-center justify-center text-[10px] text-emerald-300 font-bold">{isFa ? 'زون طلایی' : 'Sweet Spot'}</div>
                <div className="w-[25%] bg-amber-950/60 border-r border-slate-800 flex items-center justify-center text-[10px] text-amber-300 font-bold">{isFa ? 'بار اضافی' : 'Overreaching'}</div>
                <div className="w-[20%] bg-rose-950/60 flex items-center justify-center text-[10px] text-rose-300 font-bold">{isFa ? 'زون خطر' : 'Danger Zone'}</div>

                {/* Pin pointer for current athlete */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-lg shadow-cyan-400 z-10 animate-pulse"
                  style={{ [isFa ? 'right' : 'left']: `${Math.min(Math.max((selectedAthlete.wearableSync.acwrRatio / 2) * 100, 5), 95)}%` }}
                >
                  <div className="absolute -top-6 -left-8 bg-cyan-500 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded shadow">
                    {selectedAthlete.wearableSync.acwrRatio}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* View 2: Clinical Blood Laboratory Results */}
      {activeTabSub === 'labs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-cyan-400" /> {isFa ? 'گزارش پنل آزمایش خون و هورمون' : 'Clinical Blood Laboratory Report'}
              </h3>
              <p className="text-xs text-slate-400">{isFa ? `تاریخ آزمایش: ${selectedAthlete.labResults.testDate} • آزمایشگاه تشخیص پزشکی` : `Panel Date: ${selectedAthlete.labResults.testDate} • Clinical Diagnostic Laboratory`}</p>
            </div>

            <button className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700">
              {isFa ? 'دانلود کارنامه کامل PDF' : 'Download Full Lab PDF'}
            </button>
          </div>

          {/* Marker Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800 pb-3">
                  <th className="py-2 font-semibold">{isFa ? 'بیومارکر' : 'BIOMARKER'}</th>
                  <th className="py-2 font-semibold">{isFa ? 'دسته‌بندی' : 'CATEGORY'}</th>
                  <th className="py-2 font-semibold">{isFa ? 'مقدار ثبت‌شده' : 'VALUE LOGGED'}</th>
                  <th className="py-2 font-semibold">{isFa ? 'بازه مرجع نرمال' : 'REFERENCE RANGE'}</th>
                  <th className="py-2 font-semibold">{isFa ? 'وضعیت' : 'STATUS'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {labMarkers.map((m, idx) => (
                  <tr key={idx} className="text-slate-200">
                    <td className="py-3 font-bold text-white">{m.name}</td>
                    <td className="py-3 text-slate-400">{m.category}</td>
                    <td className="py-3 font-mono font-bold text-cyan-300">
                      {m.value} {m.unit}
                    </td>
                    <td className="py-3 text-slate-400 font-mono">
                      {m.rangeMin} - {m.rangeMax} {m.unit}
                    </td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        m.status === 'Optimal' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        m.status === 'Borderline' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {isFa ? (m.status === 'Optimal' ? 'عالی / نرمال' : m.status === 'Borderline' ? 'در مرز هشدار' : 'بحرانی') : m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Clinical Flag Action Alert */}
          {selectedAthlete.labResults.flaggedMarkers.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>{isFa ? 'پروتکل خودکار خارج از محدوده نرمال فعال شد' : 'Out-of-Range Biomarker Protocol Triggered'}</span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                {isFa ? (
                  <>سیستم نشانگر غیرنرمال <strong>{selectedAthlete.labResults.flaggedMarkers.join('، ')}</strong> را شناسایی کرد. توصیه‌های تغذیه‌ای هوشمند شامل افزایش دوز امگا-۳ به ۳۰۰۰ میلی‌گرم در روز و تنظیم آزمایش مجدد در ۶۰ روز آینده است.</>
                ) : (
                  <>System detected <strong>{selectedAthlete.labResults.flaggedMarkers.join(', ')}</strong>. Automated recommendations include increasing Omega-3 EPA/DHA dosage and scheduling follow-up in 60 days.</>
                )}
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

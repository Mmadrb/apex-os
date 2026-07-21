import React from 'react';
import type { AthleteProfile } from '../types';
import { 
  Ruler, 
  Activity, 
  ShieldAlert, 
  CheckCircle2
} from 'lucide-react';

interface Athlete360ProfileProps {
  athlete: AthleteProfile;
  onUpdateAthlete?: (updated: AthleteProfile) => void;
  lang?: 'en' | 'fa';
}

export const Athlete360Profile: React.FC<Athlete360ProfileProps> = ({ 
  athlete, 
  onUpdateAthlete,
  lang = 'fa' 
}) => {
  const isFa = lang === 'fa';

  const handleZoneCircumferenceChange = (zone: keyof AthleteProfile['circumferences'], val: number) => {
    if (!onUpdateAthlete) return;
    const updated = {
      ...athlete,
      circumferences: {
        ...athlete.circumferences,
        [zone]: val
      }
    };
    onUpdateAthlete(updated);
  };

  return (
    <div className="p-2 sm:p-4 lg:p-8 space-y-6 lg:space-y-8">
      
      {/* Profile Top Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <img
            src={athlete.avatar}
            alt={athlete.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-cyan-500 shadow-xl shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white">{athlete.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {athlete.membershipTier}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {athlete.age} {isFa ? 'ساله' : 'yrs'} • {athlete.gender} • {isFa ? 'هدف: ' : 'Goal: '}<strong className="text-white">{athlete.goal}</strong> ({athlete.phase})
            </p>
            <p className="text-xs text-slate-400">
              {isFa ? 'مربی مسئول: ' : 'Primary Coach: '}<strong className="text-cyan-300">{athlete.coachName}</strong>
            </p>
          </div>
        </div>

        {/* Quick Physical Status Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">{isFa ? 'وزن فعلی' : 'Weight'}</div>
            <div className="text-base sm:text-lg font-black text-white">{athlete.weightKg} {isFa ? 'کیلو' : 'kg'}</div>
            <div className="text-[10px] text-slate-500">{isFa ? `هدف: ${athlete.targetWeightKg} کیلو` : `Target: ${athlete.targetWeightKg} kg`}</div>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">{isFa ? 'درصد چربی' : 'Body Fat %'}</div>
            <div className="text-base sm:text-lg font-black text-emerald-400">{athlete.bodyFatPercent}٪</div>
            <div className="text-[10px] text-slate-500">BMI: {athlete.bmi}</div>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">{isFa ? 'توده عضلانی' : 'Muscle Mass'}</div>
            <div className="text-base sm:text-lg font-black text-cyan-300">{athlete.muscleMassKg} {isFa ? 'کیلو' : 'kg'}</div>
            <div className="text-[10px] text-slate-500">{isFa ? 'عضله خالص' : 'Lean Tissue'}</div>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">{isFa ? 'زنجیره استمرار' : 'Active Streak'}</div>
            <div className="text-base sm:text-lg font-black text-amber-400">{athlete.activeStreakDays} {isFa ? 'روز' : 'Days'}</div>
            <div className="text-[10px] text-slate-500">{isFa ? `پایبندی ${athlete.workoutCompliancePercent}٪` : `Compliance ${athlete.workoutCompliancePercent}%`}</div>
          </div>
        </div>
      </div>

      {/* Grid Layout: Physical Measurements & Photos + Clinical & Bio Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: 8 Circumference Zones & Progress Photos (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 8 Circumference Zone Measurements Box with Live Editable Inputs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Ruler className="w-4 h-4 text-cyan-400" /> {isFa ? 'اندازه‌گیری دور آناتومیک ۸ ناحیه (ویرایش زنده)' : '8-Zone Circumference Measurements'}
              </h3>
              <span className="text-[10px] text-cyan-400 font-mono">{isFa ? 'پویا' : 'Interactive'}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { zone: 'waist' as const, labelFa: 'دور کمر', labelEn: 'Waist' },
                { zone: 'chest' as const, labelFa: 'دور سینه', labelEn: 'Chest' },
                { zone: 'arms' as const, labelFa: 'دور بازو', labelEn: 'Arms' },
                { zone: 'thighs' as const, labelFa: 'دور ران', labelEn: 'Thighs' },
                { zone: 'calves' as const, labelFa: 'دور ساق', labelEn: 'Calves' },
                { zone: 'neck' as const, labelFa: 'دور گردن', labelEn: 'Neck' },
                { zone: 'hips' as const, labelFa: 'دور باسن', labelEn: 'Hips' },
                { zone: 'forearms' as const, labelFa: 'دور ساعد', labelEn: 'Forearms' },
              ].map((item) => (
                <div key={item.zone} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400 text-[11px] font-semibold">{isFa ? item.labelFa : item.labelEn}</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.5"
                      value={athlete.circumferences[item.zone]}
                      onChange={(e) => handleZoneCircumferenceChange(item.zone, Number(e.target.value))}
                      className="w-14 bg-slate-900 border border-slate-800 rounded text-center text-xs font-bold text-cyan-300 font-mono p-1 focus:outline-none focus:border-cyan-500"
                    />
                    <span className="text-[10px] text-slate-500 font-mono">cm</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Photos Side-by-Side Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">{isFa ? 'تایید تصویری پیشرفت بدنی' : 'Visual Progress Verification'}</h3>
              <span className="text-[10px] text-cyan-400 font-semibold">{isFa ? 'تراز شبکه فعال' : 'Grid Alignment Active'}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 text-center">
                <div className="relative rounded-xl overflow-hidden border border-slate-800 h-36 sm:h-44 bg-slate-950">
                  <img
                    src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80"
                    alt="Front Progress"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border border-cyan-500/30 pointer-events-none" />
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">{isFa ? 'نمای روبرو (۱۰ تیر)' : 'Front View'}</span>
              </div>

              <div className="space-y-1 text-center">
                <div className="relative rounded-xl overflow-hidden border border-slate-800 h-36 sm:h-44 bg-slate-950">
                  <img
                    src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80"
                    alt="Side Progress"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border border-cyan-500/30 pointer-events-none" />
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">{isFa ? 'نمای جانبی (۱۰ تیر)' : 'Side View'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Complete Bio-Data, Lab Vectors & Coach Log (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Biofeedback & Wearables Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
              <Activity className="w-4 h-4 text-cyan-400" /> {isFa ? 'بازخورد بیومتریک و آمادگی ذهنی/جسمی' : 'Biofeedback & Subjective Readiness'}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">{isFa ? 'وضعیت خلق و خو' : 'Mood State'}</div>
                <div className="font-bold text-cyan-300 mt-1">{isFa ? 'عالی و پرانرژی' : athlete.biofeedback.mood}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">{isFa ? 'سطح انرژی (۱-۱۰)' : 'Energy (1-10)'}</div>
                <div className="font-bold text-emerald-400 mt-1">{athlete.biofeedback.energyLevel} / ۱۰</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">{isFa ? 'سطح استرس (۱-۱۰)' : 'Stress (1-10)'}</div>
                <div className="font-bold text-amber-400 mt-1">{athlete.biofeedback.stressLevel} / ۱۰</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">{isFa ? 'کوفتگی عضلانی' : 'Soreness'}</div>
                <div className="font-bold text-rose-400 mt-1">{athlete.biofeedback.muscleSoreness} / ۱۰</div>
              </div>
            </div>

            {athlete.biofeedback.jointAches.length > 0 && (
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 text-xs text-rose-200 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{isFa ? 'حساسیت مفصلی ثبت‌شده: ' : 'Active Joint Sensitivity: '}<strong>{athlete.biofeedback.jointAches.join('، ')}</strong></span>
              </div>
            )}
          </div>

          {/* Injuries & Mobility Map */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">{isFa ? 'آسیب‌های ساختاری و محدودیتهای حرکتی' : 'Active Pathology & Mobility Constraints'}</h3>
            
            {athlete.injuries.length === 0 ? (
              <div className="text-xs text-emerald-400 flex items-center gap-1.5 p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30">
                <CheckCircle2 className="w-4 h-4" /> {isFa ? 'هیچ آسیب ساختاری ثبت نشده است.' : 'Zero active structural injuries recorded.'}
              </div>
            ) : (
              athlete.injuries.map((inj, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{inj.area}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {isFa ? 'شدت متوسط' : `${inj.severity} Severity`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{inj.notes}</p>
                </div>
              ))
            )}
          </div>

          {/* Clinical Labs & Medication Vectors */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">{isFa ? 'تحلیل هورمونی و فاکتورهای التهابی' : 'Hormonal & Inflammatory Vectors'}</h3>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-[10px]">{isFa ? 'تستوسترون تام' : 'Total Testosterone'}</div>
                <div className="font-bold text-cyan-300 text-sm">{athlete.labResults.totalTestosteroneNgDl} ng/dL</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-[10px]">{isFa ? 'شاخص hs-CRP (التهاب)' : 'hs-CRP Inflammatory'}</div>
                <div className={`font-bold text-sm ${(athlete.labResults.hsCrpMgL || 0) > 1.0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {athlete.labResults.hsCrpMgL} mg/L
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

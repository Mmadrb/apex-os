import React from 'react';
import { 
  Zap, 
  Calculator, 
  CheckCircle2,
  Flame,
  Utensils
} from 'lucide-react';
import type { AthleteProfile } from '../types';

interface BiometricCalibratorProps {
  athlete: AthleteProfile;
  onUpdateAthlete: (updated: AthleteProfile) => void;
  lang?: 'en' | 'fa';
}

export const BiometricCalibrator: React.FC<BiometricCalibratorProps> = ({
  athlete,
  onUpdateAthlete,
  lang = 'fa'
}) => {
  const isFa = lang === 'fa';

  const calculateBMI = (weightKg: number, heightCm: number): number => {
    if (!heightCm || heightCm <= 0) return 0;
    const heightM = heightCm / 100;
    return Number((weightKg / (heightM * heightM)).toFixed(1));
  };

  const calculateBodyFatNavy = (
    gender: string,
    waistCm: number,
    neckCm: number,
    hipsCm: number,
    heightCm: number
  ): number => {
    if (!waistCm || !neckCm || !heightCm) return athlete.bodyFatPercent;
    
    if (gender === 'مرد' || gender === 'Male') {
      const val = 86.010 * Math.log10(waistCm - neckCm) - 70.041 * Math.log10(heightCm) + 36.76;
      const bf = Math.max(Math.min(val, 45), 5);
      return Number(bf.toFixed(1));
    } else {
      const val = 163.205 * Math.log10(waistCm + hipsCm - neckCm) - 97.684 * Math.log10(heightCm) - 78.387;
      const bf = Math.max(Math.min(val, 50), 10);
      return Number(bf.toFixed(1));
    }
  };

  const handleMetricChange = (field: string, value: number | string) => {
    const newAthlete = { ...athlete };

    if (field === 'weightKg') newAthlete.weightKg = Number(value);
    if (field === 'heightCm') newAthlete.heightCm = Number(value);
    if (field === 'waist') newAthlete.circumferences.waist = Number(value);
    if (field === 'neck') newAthlete.circumferences.neck = Number(value);
    if (field === 'hips') newAthlete.circumferences.hips = Number(value);
    if (field === 'goal') newAthlete.goal = String(value);

    newAthlete.bmi = calculateBMI(newAthlete.weightKg, newAthlete.heightCm);

    newAthlete.bodyFatPercent = calculateBodyFatNavy(
      newAthlete.gender,
      newAthlete.circumferences.waist,
      newAthlete.circumferences.neck,
      newAthlete.circumferences.hips,
      newAthlete.heightCm
    );

    newAthlete.muscleMassKg = Number(
      (newAthlete.weightKg * (1 - newAthlete.bodyFatPercent / 100)).toFixed(1)
    );

    const bmr = 370 + 21.6 * newAthlete.muscleMassKg;
    const tdee = bmr * 1.55;

    if (newAthlete.goal.includes('Fat Loss') || newAthlete.goal.includes('چربی')) {
      newAthlete.caloriesTarget = Math.round(tdee * 0.80);
    } else if (newAthlete.goal.includes('Hypertrophy') || newAthlete.goal.includes('عضله')) {
      newAthlete.caloriesTarget = Math.round(tdee * 1.12);
    } else {
      newAthlete.caloriesTarget = Math.round(tdee);
    }

    newAthlete.proteinTargetG = Math.round(newAthlete.muscleMassKg * 2.4);
    newAthlete.fatsTargetG = Math.round((newAthlete.caloriesTarget * 0.25) / 9);
    const proteinCal = newAthlete.proteinTargetG * 4;
    const fatCal = newAthlete.fatsTargetG * 9;
    newAthlete.carbsTargetG = Math.round((newAthlete.caloriesTarget - proteinCal - fatCal) / 4);

    onUpdateAthlete(newAthlete);
  };

  const bmiCategory = 
    athlete.bmi < 18.5 ? (isFa ? 'کم‌وزن' : 'Underweight') :
    athlete.bmi < 25 ? (isFa ? 'نرمال و ایده‌آل' : 'Optimal Weight') :
    athlete.bmi < 30 ? (isFa ? 'اضافه وزن' : 'Overweight') :
    (isFa ? 'چاقی' : 'Obese');

  return (
    <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xl relative overflow-hidden">
      
      {/* Header Controls Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-cyan-500/20 shrink-0">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5 flex-wrap">
              <span>{isFa ? 'محاسبه‌گر زنده بیومتریک و متابولیسم' : 'Live Biometric Calculation Engine'}</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] font-mono animate-pulse">
                {isFa ? 'زنده' : 'Live'}
              </span>
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-400">
              {isFa ? 'اعداد را ویرایش کنید تا BMI، چربی و کالیبره کالری بازنویسی شوند.' : 'Edit inputs to dynamically calculate BMI & TDEE.'}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[11px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {isFa ? 'Katch-McArdle' : 'Katch-McArdle'}
          </span>
        </div>
      </div>

      {/* Responsive Form Inputs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        
        {/* Weight Input */}
        <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950 border border-slate-800 focus-within:border-cyan-500 transition-all">
          <label className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
            {isFa ? 'وزن (کیلوگرم)' : 'Weight (kg)'}
          </label>
          <input
            type="number"
            step="0.5"
            value={athlete.weightKg}
            onChange={(e) => handleMetricChange('weightKg', e.target.value)}
            className="w-full bg-transparent text-white font-mono font-black text-sm sm:text-base focus:outline-none text-cyan-300"
          />
        </div>

        {/* Height Input */}
        <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950 border border-slate-800 focus-within:border-cyan-500 transition-all">
          <label className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
            {isFa ? 'قد (سانتی‌متر)' : 'Height (cm)'}
          </label>
          <input
            type="number"
            value={athlete.heightCm}
            onChange={(e) => handleMetricChange('heightCm', e.target.value)}
            className="w-full bg-transparent text-white font-mono font-bold text-sm sm:text-base focus:outline-none"
          />
        </div>

        {/* Waist Input */}
        <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950 border border-amber-800/60 focus-within:border-amber-400 transition-all">
          <label className="text-[9px] sm:text-[10px] text-amber-300 font-bold uppercase block mb-0.5">
            {isFa ? 'دور کمر (cm)' : 'Waist (cm)'}
          </label>
          <input
            type="number"
            step="0.5"
            value={athlete.circumferences.waist}
            onChange={(e) => handleMetricChange('waist', e.target.value)}
            className="w-full bg-transparent text-amber-300 font-mono font-black text-sm sm:text-base focus:outline-none"
          />
        </div>

        {/* Neck Input */}
        <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950 border border-slate-800 focus-within:border-cyan-500 transition-all">
          <label className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
            {isFa ? 'دور گردن (cm)' : 'Neck (cm)'}
          </label>
          <input
            type="number"
            step="0.5"
            value={athlete.circumferences.neck}
            onChange={(e) => handleMetricChange('neck', e.target.value)}
            className="w-full bg-transparent text-white font-mono font-bold text-sm sm:text-base focus:outline-none"
          />
        </div>

        {/* Hips Input */}
        <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950 border border-slate-800 focus-within:border-cyan-500 transition-all">
          <label className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
            {isFa ? 'دور باسن (cm)' : 'Hips (cm)'}
          </label>
          <input
            type="number"
            step="0.5"
            value={athlete.circumferences.hips}
            onChange={(e) => handleMetricChange('hips', e.target.value)}
            className="w-full bg-transparent text-white font-mono font-bold text-sm sm:text-base focus:outline-none"
          />
        </div>

        {/* Goal Selector */}
        <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950 border border-slate-800 focus-within:border-cyan-500 transition-all col-span-2 sm:col-span-1">
          <label className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
            {isFa ? 'هدف بدنی' : 'Goal Target'}
          </label>
          <select
            value={athlete.goal}
            onChange={(e) => handleMetricChange('goal', e.target.value)}
            className="w-full bg-slate-950 text-emerald-300 text-xs font-bold focus:outline-none py-0.5"
          >
            <option value="Hypertrophy">{isFa ? 'عضله‌سازی' : 'Hypertrophy'}</option>
            <option value="Fat Loss">{isFa ? 'چربی‌سوزی' : 'Fat Loss'}</option>
            <option value="Powerlifting">{isFa ? 'قدرت' : 'Powerlifting'}</option>
            <option value="Rehab / Longevity">{isFa ? 'سلامتی' : 'Longevity'}</option>
          </select>
        </div>

      </div>

      {/* Output Calculated Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        
        {/* Output 1: BMI */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
          <div className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase">{isFa ? 'شاخص BMI' : 'BMI Index'}</div>
          <div className="text-base sm:text-lg font-black text-white font-mono flex items-baseline gap-1">
            <span>{athlete.bmi}</span>
            <span className="text-[10px] text-cyan-400 font-sans font-normal truncate">({bmiCategory})</span>
          </div>
        </div>

        {/* Output 2: Body Fat % */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
          <div className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase">{isFa ? 'درصد چربی' : 'Body Fat %'}</div>
          <div className="text-base sm:text-lg font-black text-emerald-400 font-mono">
            {athlete.bodyFatPercent}٪
          </div>
        </div>

        {/* Output 3: Target Calories */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
          <div className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-400" /> {isFa ? 'کالری هدف' : 'Calories'}
          </div>
          <div className="text-base sm:text-lg font-black text-amber-300 font-mono">
            {athlete.caloriesTarget} <span className="text-[10px] text-slate-400 font-normal">kcal</span>
          </div>
        </div>

        {/* Output 4: Target Macros */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
          <div className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
            <Utensils className="w-3 h-3 text-cyan-400" /> {isFa ? 'ماکروها' : 'Macros'}
          </div>
          <div className="text-xs font-black text-white font-mono">
            P: <span className="text-cyan-300">{athlete.proteinTargetG}g</span> | C: <span className="text-emerald-300">{athlete.carbsTargetG}g</span>
          </div>
        </div>

      </div>

      {/* Dynamic AI Feedback Log */}
      <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/50 flex items-start gap-2.5">
        <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="text-cyan-100/90 text-xs leading-relaxed">
          {isFa ? (
            <>
              با وزن <strong>{athlete.weightKg} کیلو</strong> و کمر <strong>{athlete.circumferences.waist}cm</strong>، BMI شما <strong>{athlete.bmi}</strong> ({bmiCategory}) و چربی بدن <strong>{athlete.bodyFatPercent}٪</strong> محاسبه شد. کالری به <strong>{athlete.caloriesTarget} kcal</strong> به‌روزرسانی گردید.
            </>
          ) : (
            <>
              With weight <strong>{athlete.weightKg}kg</strong> and waist <strong>{athlete.circumferences.waist}cm</strong>, BMI is <strong>{athlete.bmi}</strong> ({bmiCategory}). Recalibrated to <strong>{athlete.caloriesTarget} kcal</strong>.
            </>
          )}
        </p>
      </div>

    </div>
  );
};

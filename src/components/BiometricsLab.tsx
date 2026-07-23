import React, { useMemo, useState } from 'react';
import type { AthleteProfile, LabMarker } from '../types';
import {
  Activity,
  Moon,
  TrendingUp,
  AlertCircle,
  ShieldAlert,
  FlaskConical,
  Battery,
  HeartPulse,
  Pill,
  ClipboardPlus,
  Dumbbell,
} from 'lucide-react';

interface BiometricsLabProps {
  selectedAthlete: AthleteProfile;
  onUpdateAthlete?: (updated: AthleteProfile) => void;
  lang?: 'en' | 'fa';
}

type BiometricsTab = 'wearables' | 'labs' | 'medical';

export const BiometricsLab: React.FC<BiometricsLabProps> = ({ selectedAthlete, onUpdateAthlete, lang = 'fa' }) => {
  const isFa = lang === 'fa';
  const [activeTabSub, setActiveTabSub] = useState<BiometricsTab>('wearables');
  const [healthLog, setHealthLog] = useState({
    energyLevel: selectedAthlete.biofeedback.energyLevel,
    stressLevel: selectedAthlete.biofeedback.stressLevel,
    muscleSoreness: selectedAthlete.biofeedback.muscleSoreness,
    sleepHours: selectedAthlete.wearableSync.sleepHours,
    weightKg: selectedAthlete.weightKg,
  });

  const labMarkers: LabMarker[] = [
    {
      name: isFa ? 'تستوسترون کل' : 'Total Testosterone',
      value: selectedAthlete.labResults.totalTestosteroneNgDl || 780,
      unit: 'ng/dL',
      rangeMin: 300,
      rangeMax: 1000,
      status: 'Optimal',
      category: isFa ? 'هورمونی' : 'Hormonal',
    },
    {
      name: isFa ? 'تستوسترون آزاد' : 'Free Testosterone',
      value: selectedAthlete.labResults.freeTestosteronePgMl || 21.4,
      unit: 'pg/mL',
      rangeMin: 9,
      rangeMax: 26,
      status: 'Optimal',
      category: isFa ? 'هورمونی' : 'Hormonal',
    },
    {
      name: isFa ? 'hs-CRP' : 'hs-CRP',
      value: selectedAthlete.labResults.hsCrpMgL || 2.1,
      unit: 'mg/L',
      rangeMin: 0.1,
      rangeMax: 1,
      status: (selectedAthlete.labResults.hsCrpMgL || 2.1) > 1 ? 'Critical' : 'Optimal',
      category: isFa ? 'التهاب' : 'Inflammatory',
    },
    {
      name: isFa ? 'کورتیزول' : 'Cortisol',
      value: selectedAthlete.labResults.cortisolMcgDl || 18.5,
      unit: 'mcg/dL',
      rangeMin: 6,
      rangeMax: 19,
      status: (selectedAthlete.labResults.cortisolMcgDl || 18.5) > 18 ? 'Borderline' : 'Optimal',
      category: isFa ? 'استرس' : 'Stress',
    },
    {
      name: isFa ? 'قند ناشتا' : 'Fasting Glucose',
      value: selectedAthlete.labResults.fastingGlucoseMgDl || 88,
      unit: 'mg/dL',
      rangeMin: 70,
      rangeMax: 99,
      status: 'Optimal',
      category: isFa ? 'متابولیک' : 'Metabolic',
    },
    {
      name: isFa ? 'کلسترول LDL' : 'LDL Cholesterol',
      value: selectedAthlete.labResults.ldlMgDl || 95,
      unit: 'mg/dL',
      rangeMin: 50,
      rangeMax: 100,
      status: 'Optimal',
      category: isFa ? 'چربی خون' : 'Lipid',
    },
  ];

  const muscleProgress = useMemo(
    () => [
      {
        label: isFa ? 'بازو' : 'Arms',
        value: selectedAthlete.circumferences.arms,
        target: Number((selectedAthlete.circumferences.arms + 1.5).toFixed(1)),
      },
      {
        label: isFa ? 'ران' : 'Thighs',
        value: selectedAthlete.circumferences.thighs,
        target: Number((selectedAthlete.circumferences.thighs + 2).toFixed(1)),
      },
      {
        label: isFa ? 'سینه' : 'Chest',
        value: selectedAthlete.circumferences.chest,
        target: Number((selectedAthlete.circumferences.chest + 2.5).toFixed(1)),
      },
      {
        label: isFa ? 'ساق' : 'Calves',
        value: selectedAthlete.circumferences.calves,
        target: Number((selectedAthlete.circumferences.calves + 1).toFixed(1)),
      },
    ],
    [isFa, selectedAthlete.circumferences]
  );

  const handleSaveMedicalLog = () => {
    if (!onUpdateAthlete) return;

    onUpdateAthlete({
      ...selectedAthlete,
      weightKg: healthLog.weightKg,
      wearableSync: {
        ...selectedAthlete.wearableSync,
        sleepHours: healthLog.sleepHours,
      },
      biofeedback: {
        ...selectedAthlete.biofeedback,
        energyLevel: healthLog.energyLevel,
        stressLevel: healthLog.stressLevel,
        muscleSoreness: healthLog.muscleSoreness,
      },
    });
  };

  const toggleSupplement = (index: number) => {
    if (!onUpdateAthlete) return;

    onUpdateAthlete({
      ...selectedAthlete,
      supplements: selectedAthlete.supplements.map((supplement, supplementIndex) =>
        supplementIndex === index
          ? { ...supplement, status: supplement.status === 'Taken' ? 'Pending' : 'Taken' }
          : supplement
      ),
    });
  };

  const healthProfile = selectedAthlete.healthProfile ?? {
    bloodType: isFa ? 'نامشخص' : 'Unknown',
    allergies: isFa ? ['ثبت نشده'] : ['Not logged'],
    conditions: selectedAthlete.injuries.length > 0 ? selectedAthlete.injuries.map((injury) => injury.area) : [isFa ? 'بدون مورد حاد' : 'No acute conditions'],
    emergencyContact: isFa ? 'در انتظار ثبت' : 'Pending entry',
    medicalClearance: isFa ? 'مجاز برای تمرین تحت پایش مربی' : 'Cleared for training with coach supervision',
  };

  return (
    <div className="p-2 sm:p-4 lg:p-8 space-y-6 lg:space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold uppercase tracking-wider">
              {isFa ? 'بخش پزشکی، بیومتریک و پیشرفت عضلانی' : 'Medical, Biometrics & Progress Center'}
            </span>
            <span className="text-xs text-slate-400">
              {isFa ? 'ورزشکار: ' : 'Athlete: '}<strong className="text-white">{selectedAthlete.name}</strong>
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            {isFa ? 'ثبت اطلاعات سلامت، پایش رشد عضلانی و مدیریت مکمل‌ها' : 'Record health data, monitor muscle development, and manage supplements'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isFa
              ? 'پایش پوشیدنی‌ها، آزمایشگاه، پیشرفت تمرین و وضعیت سلامت ورزشکار در یک هاب یکپارچه.'
              : 'Wearables, lab results, training progress, and medical readiness in one integrated coach workspace.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTabSub('wearables')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTabSub === 'wearables'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{isFa ? 'پوشیدنی‌ها' : 'Wearables'}</span>
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
            <span>{isFa ? 'آزمایش‌ها' : 'Labs'}</span>
          </button>

          <button
            onClick={() => setActiveTabSub('medical')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTabSub === 'medical'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>{isFa ? 'پزشکی و پیشرفت' : 'Medical & Progress'}</span>
          </button>
        </div>
      </div>

      {activeTabSub === 'wearables' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Activity className="w-4 h-4 text-cyan-400" /> HRV
                </span>
                <span className="text-[10px] text-cyan-400 font-mono bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                  {selectedAthlete.wearableSync.device}
                </span>
              </div>
              <div className="text-2xl font-black text-white">{selectedAthlete.wearableSync.hrvMs} ms</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                {isFa ? 'تعادل عصبی پایدار' : 'Stable autonomic balance'}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Battery className="w-4 h-4 text-emerald-400" /> {isFa ? 'ریکاوری' : 'Recovery'}
                </span>
                <span className="text-xs font-bold text-emerald-400">{selectedAthlete.wearableSync.recoveryScore}%</span>
              </div>
              <div className="text-2xl font-black text-emerald-300">{selectedAthlete.wearableSync.recoveryScore} / 100</div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${selectedAthlete.wearableSync.recoveryScore}%` }} />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-amber-400" /> ACWR
                </span>
                <span className={`text-xs font-bold ${selectedAthlete.wearableSync.acwrRatio > 1.4 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {selectedAthlete.wearableSync.acwrRatio}
                </span>
              </div>
              <div className="text-2xl font-black text-amber-300">
                {selectedAthlete.wearableSync.acwrRatio > 1.4 ? (isFa ? 'خطر فشار بالا' : 'Elevated strain') : isFa ? 'محدوده مناسب' : 'Optimal zone'}
              </div>
              <div className="text-[10px] text-slate-400">{isFa ? 'محدوده ایمن: ۰.۸ تا ۱.۳' : 'Safe range: 0.8 to 1.3'}</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Moon className="w-4 h-4 text-indigo-400" /> {isFa ? 'خواب' : 'Sleep'}
                </span>
                <span className="text-xs font-bold text-indigo-300">{selectedAthlete.wearableSync.sleepScore}%</span>
              </div>
              <div className="text-2xl font-black text-indigo-200">{selectedAthlete.wearableSync.sleepHours} {isFa ? 'ساعت' : 'hrs'}</div>
              <div className="text-[10px] text-indigo-300">{isFa ? 'کیفیت خواب و بازسازی عصبی' : 'Sleep quality and nervous system recovery'}</div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">{isFa ? 'نمای کلی آمادگی تمرینی' : 'Training readiness overview'}</h3>
                <p className="text-xs text-slate-400">{isFa ? 'ترکیب HRV، ریکاوری، خواب و فشار تمرین برای تصمیم‌گیری مربی.' : 'HRV, recovery, sleep, and workload combined for coach decision-making.'}</p>
              </div>
              <span className="text-xs text-cyan-400 font-mono font-bold">{isFa ? 'زنده' : 'Live'}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-[11px] text-slate-500 uppercase font-bold">{isFa ? 'آمادگی امروز' : 'Today readiness'}</div>
                <div className="text-2xl font-black text-white mt-2">{Math.round((selectedAthlete.wearableSync.recoveryScore + selectedAthlete.wearableSync.sleepScore) / 2)}%</div>
                <p className="text-xs text-slate-400 mt-2">{isFa ? 'ترکیب ریکاوری و خواب برای تعیین شدت مجاز.' : 'Blended sleep and recovery score to guide training intensity.'}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-[11px] text-slate-500 uppercase font-bold">{isFa ? 'بار تمرینی' : 'Training load'}</div>
                <div className="text-2xl font-black text-cyan-300 mt-2">{selectedAthlete.wearableSync.strainIndex}</div>
                <p className="text-xs text-slate-400 mt-2">{isFa ? 'شاخص زنده فشار از پوشیدنی‌ها و گزارش تمرینی.' : 'Live strain from wearable sync and training logs.'}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-[11px] text-slate-500 uppercase font-bold">{isFa ? 'هشدار فعال' : 'Active alert'}</div>
                <div className="text-2xl font-black text-amber-300 mt-2">{selectedAthlete.riskScore}</div>
                <p className="text-xs text-slate-400 mt-2">{selectedAthlete.riskReason ?? (isFa ? 'بدون هشدار بحرانی' : 'No critical alert logged.')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTabSub === 'labs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-cyan-400" /> {isFa ? 'گزارش پنل آزمایشگاهی' : 'Clinical lab report'}
              </h3>
              <p className="text-xs text-slate-400">{isFa ? `تاریخ آزمایش: ${selectedAthlete.labResults.testDate}` : `Panel date: ${selectedAthlete.labResults.testDate}`}</p>
            </div>
            <button className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700">
              {isFa ? 'دانلود PDF' : 'Download PDF'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800 pb-3">
                  <th className="py-2 font-semibold">{isFa ? 'بیومارکر' : 'BIOMARKER'}</th>
                  <th className="py-2 font-semibold">{isFa ? 'دسته' : 'CATEGORY'}</th>
                  <th className="py-2 font-semibold">{isFa ? 'مقدار' : 'VALUE'}</th>
                  <th className="py-2 font-semibold">{isFa ? 'بازه' : 'RANGE'}</th>
                  <th className="py-2 font-semibold">{isFa ? 'وضعیت' : 'STATUS'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {labMarkers.map((marker) => (
                  <tr key={marker.name} className="text-slate-200">
                    <td className="py-3 font-bold text-white">{marker.name}</td>
                    <td className="py-3 text-slate-400">{marker.category}</td>
                    <td className="py-3 font-mono font-bold text-cyan-300">{marker.value} {marker.unit}</td>
                    <td className="py-3 text-slate-400 font-mono">{marker.rangeMin} - {marker.rangeMax} {marker.unit}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        marker.status === 'Optimal'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : marker.status === 'Borderline'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {marker.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedAthlete.labResults.flaggedMarkers.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>{isFa ? 'نشانگرهای خارج از محدوده' : 'Out-of-range markers'}</span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">{selectedAthlete.labResults.flaggedMarkers.join(isFa ? '، ' : ', ')}</p>
            </div>
          )}
        </div>
      )}

      {activeTabSub === 'medical' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-7 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <ClipboardPlus className="w-4 h-4 text-cyan-400" /> {isFa ? 'ثبت اطلاعات سلامت و شاخص‌های روزانه' : 'Health data & daily metric logging'}
                </h3>
                <button onClick={handleSaveMedicalLog} className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold">
                  {isFa ? 'ذخیره' : 'Save log'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-1">
                  <span className="text-xs text-slate-400">{isFa ? 'سطح انرژی' : 'Energy level'}</span>
                  <input type="number" min="1" max="10" value={healthLog.energyLevel} onChange={(e) => setHealthLog((prev) => ({ ...prev, energyLevel: Number(e.target.value) }))} className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" />
                </label>
                <label className="space-y-1">
                  <span className="text-xs text-slate-400">{isFa ? 'سطح استرس' : 'Stress level'}</span>
                  <input type="number" min="1" max="10" value={healthLog.stressLevel} onChange={(e) => setHealthLog((prev) => ({ ...prev, stressLevel: Number(e.target.value) }))} className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" />
                </label>
                <label className="space-y-1">
                  <span className="text-xs text-slate-400">{isFa ? 'کوفتگی عضلات' : 'Muscle soreness'}</span>
                  <input type="number" min="1" max="10" value={healthLog.muscleSoreness} onChange={(e) => setHealthLog((prev) => ({ ...prev, muscleSoreness: Number(e.target.value) }))} className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" />
                </label>
                <label className="space-y-1">
                  <span className="text-xs text-slate-400">{isFa ? 'ساعت خواب' : 'Sleep hours'}</span>
                  <input type="number" min="1" max="14" step="0.1" value={healthLog.sleepHours} onChange={(e) => setHealthLog((prev) => ({ ...prev, sleepHours: Number(e.target.value) }))} className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" />
                </label>
                <label className="space-y-1 md:col-span-2">
                  <span className="text-xs text-slate-400">{isFa ? 'وزن بدن' : 'Bodyweight'}</span>
                  <input type="number" min="20" max="250" step="0.1" value={healthLog.weightKg} onChange={(e) => setHealthLog((prev) => ({ ...prev, weightKg: Number(e.target.value) }))} className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" />
                </label>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-cyan-400" /> {isFa ? 'پایش پیشرفت تمرین و رشد عضلانی' : 'Training progress & muscle development'}
                </h3>
                <span className="text-xs text-cyan-400 font-semibold">{isFa ? 'مقایسه با هدف' : 'vs target'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {muscleProgress.map((item) => {
                  const progress = Math.min(Math.round((item.value / item.target) * 100), 100);
                  return (
                    <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="font-bold text-white">{item.value} / {item.target} cm</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-3">
                        <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-[11px] text-slate-500 uppercase font-bold">{isFa ? 'وزن فعلی' : 'Current weight'}</div>
                  <div className="text-2xl font-black text-white mt-2">{selectedAthlete.weightKg} kg</div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-[11px] text-slate-500 uppercase font-bold">{isFa ? 'توده عضلانی' : 'Muscle mass'}</div>
                  <div className="text-2xl font-black text-cyan-300 mt-2">{selectedAthlete.muscleMassKg} kg</div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-[11px] text-slate-500 uppercase font-bold">{isFa ? 'پایبندی تمرین' : 'Workout compliance'}</div>
                  <div className="text-2xl font-black text-emerald-300 mt-2">{selectedAthlete.workoutCompliancePercent}%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-rose-400" /> {isFa ? 'پرونده سلامت ورزشکار' : 'Athlete health file'}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="text-slate-500">{isFa ? 'گروه خونی' : 'Blood type'}</div>
                  <div className="text-white mt-2">{healthProfile.bloodType}</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="text-slate-500">{isFa ? 'وضعیت مجوز پزشکی' : 'Medical clearance'}</div>
                  <div className="text-white mt-2">{healthProfile.medicalClearance}</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 sm:col-span-2">
                  <div className="text-slate-500">{isFa ? 'حساسیت‌ها' : 'Allergies'}</div>
                  <div className="text-white mt-2">{(healthProfile.allergies ?? []).join(isFa ? '، ' : ', ')}</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 sm:col-span-2">
                  <div className="text-slate-500">{isFa ? 'سوابق / شرایط' : 'Conditions / history'}</div>
                  <div className="text-white mt-2">{(healthProfile.conditions ?? []).join(isFa ? '، ' : ', ')}</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 sm:col-span-2">
                  <div className="text-slate-500">{isFa ? 'تماس اضطراری' : 'Emergency contact'}</div>
                  <div className="text-white mt-2">{healthProfile.emergencyContact}</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Pill className="w-4 h-4 text-amber-400" /> {isFa ? 'مدیریت مکمل‌ها' : 'Supplement management'}
                </h3>
              </div>
              <div className="space-y-3">
                {selectedAthlete.supplements.map((supplement, index) => (
                  <button
                    key={supplement.name + index}
                    onClick={() => toggleSupplement(index)}
                    className="w-full text-right rounded-xl border border-slate-800 bg-slate-950/60 p-4 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                  >
                    <div>
                      <div className="font-bold text-white text-sm">{supplement.name}</div>
                      <div className="text-xs text-slate-400 mt-1">{supplement.dosage} • {supplement.timing}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                      supplement.status === 'Taken'
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}>
                      {isFa ? (supplement.status === 'Taken' ? 'مصرف شده' : 'در انتظار') : supplement.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

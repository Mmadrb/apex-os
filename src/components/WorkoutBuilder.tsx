import React, { useEffect, useMemo, useState } from 'react';
import type {
  WorkoutProgram,
  Exercise,
  AthleteProfile,
  WorkoutSet,
  WorkoutType,
  WorkoutDifficultyTier,
  WorkoutEquipmentMode,
} from '../types';
import {
  Dumbbell,
  Plus,
  Trash2,
  Sparkles,
  Save,
  Shuffle,
  Check,
  BarChart2,
  Flame,
  Activity,
  CheckCircle2,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

interface WorkoutBuilderProps {
  program: WorkoutProgram;
  exerciseDb: Exercise[];
  selectedAthlete: AthleteProfile;
  onUpdateProgram: (newProg: WorkoutProgram) => void;
  lang?: 'en' | 'fa';
}

type FilterValue = 'all';

const WORKOUT_TYPES: WorkoutType[] = [
  'abs',
  'everything',
  'cardio',
  'combat',
  'HIIT',
  'RPG fitness',
  'running',
  'strength',
  'stretching',
  'yoga',
];

const DIFFICULTY_LEVELS: WorkoutDifficultyTier[] = ['light', 'easy', 'normal', 'hard', 'advanced'];
const EQUIPMENT_MODES: WorkoutEquipmentMode[] = ['no equipment', 'with equipment'];

const getWorkoutTypeLabel = (value: WorkoutType, isFa: boolean) => {
  const labels: Record<WorkoutType, { fa: string; en: string }> = {
    abs: { fa: 'شکم', en: 'Abs' },
    everything: { fa: 'فول بادی', en: 'Everything' },
    cardio: { fa: 'کاردیو', en: 'Cardio' },
    combat: { fa: 'رزمی', en: 'Combat' },
    HIIT: { fa: 'HIIT', en: 'HIIT' },
    'RPG fitness': { fa: 'RPG Fitness', en: 'RPG Fitness' },
    running: { fa: 'دویدن', en: 'Running' },
    strength: { fa: 'قدرتی', en: 'Strength' },
    stretching: { fa: 'کشش', en: 'Stretching' },
    yoga: { fa: 'یوگا', en: 'Yoga' },
  };

  return isFa ? labels[value].fa : labels[value].en;
};

const getDifficultyLabel = (value: WorkoutDifficultyTier, isFa: boolean) => {
  const labels: Record<WorkoutDifficultyTier, { fa: string; en: string }> = {
    light: { fa: 'خیلی سبک', en: 'Light' },
    easy: { fa: 'آسان', en: 'Easy' },
    normal: { fa: 'نرمال', en: 'Normal' },
    hard: { fa: 'سخت', en: 'Hard' },
    advanced: { fa: 'پیشرفته', en: 'Advanced' },
  };

  return isFa ? labels[value].fa : labels[value].en;
};

const getEquipmentLabel = (value: WorkoutEquipmentMode, isFa: boolean) => {
  const labels: Record<WorkoutEquipmentMode, { fa: string; en: string }> = {
    'no equipment': { fa: 'بدون تجهیزات', en: 'No Equipment' },
    'with equipment': { fa: 'با تجهیزات', en: 'With Equipment' },
  };

  return isFa ? labels[value].fa : labels[value].en;
};

const difficultyChipTone: Record<WorkoutDifficultyTier, string> = {
  light: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  easy: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
  normal: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
  hard: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  advanced: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
};

export const WorkoutBuilder: React.FC<WorkoutBuilderProps> = ({
  program,
  exerciseDb,
  selectedAthlete,
  onUpdateProgram,
  lang = 'fa',
}) => {
  const isFa = lang === 'fa';
  const [currentProgram, setCurrentProgram] = useState<WorkoutProgram>(program);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [aiSplit, setAiSplit] = useState<string>('Upper/Lower 4-Day Undulating');
  const [aiFocus, setAiFocus] = useState<string>('Maximal Hypertrophy & Density');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [exerciseSearch, setExerciseSearch] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<WorkoutType | FilterValue>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<WorkoutDifficultyTier | FilterValue>('all');
  const [equipmentFilter, setEquipmentFilter] = useState<WorkoutEquipmentMode | FilterValue>('all');

  useEffect(() => {
    setCurrentProgram(program);
    setActiveDayIndex(0);
  }, [program]);

  const activeDay = currentProgram.days[activeDayIndex] ?? currentProgram.days[0];

  const calculateSessionMetrics = () => {
    let totalVolumeKg = 0;
    let totalSetsCount = 0;
    let totalRpeSum = 0;

    activeDay?.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        totalVolumeKg += s.weightKg * s.reps;
        totalSetsCount += 1;
        totalRpeSum += s.targetRpe;
      });
    });

    const avgRpe = totalSetsCount > 0 ? totalRpeSum / totalSetsCount : 7.5;
    const met = Math.min(Math.max(avgRpe * 0.85, 4.0), 8.5);
    const estDurationMinutes = totalSetsCount * 3 + 10;
    const caloriesBurned = Math.round(met * selectedAthlete.weightKg * (estDurationMinutes / 60));

    return {
      totalVolumeKg,
      totalSetsCount,
      avgRpe: Number(avgRpe.toFixed(1)),
      estDurationMinutes,
      caloriesBurned,
    };
  };

  const metrics = calculateSessionMetrics();

  const filteredExercises = useMemo(() => {
    const normalizedSearch = exerciseSearch.trim().toLowerCase();

    return exerciseDb.filter((exercise) => {
      const matchesType = typeFilter === 'all' ? true : exercise.trainingType === typeFilter;
      const matchesDifficulty = difficultyFilter === 'all' ? true : exercise.intensity === difficultyFilter;
      const matchesEquipment = equipmentFilter === 'all' ? true : exercise.equipmentMode === equipmentFilter;
      const haystack = [
        exercise.name,
        exercise.category,
        exercise.primaryMuscle,
        exercise.equipment,
        exercise.instructions,
        ...exercise.secondaryMuscles,
      ]
        .join(' ')
        .toLowerCase();
      const matchesSearch = normalizedSearch ? haystack.includes(normalizedSearch) : true;

      return matchesType && matchesDifficulty && matchesEquipment && matchesSearch;
    });
  }, [difficultyFilter, equipmentFilter, exerciseDb, exerciseSearch, typeFilter]);

  const featuredTypes = useMemo(
    () =>
      WORKOUT_TYPES.map((type) => ({
        type,
        count: exerciseDb.filter((exercise) => exercise.trainingType === type).length,
      })),
    [exerciseDb]
  );

  const createExercisePrescription = (exercise: Exercise) => {
    const equipmentLoad =
      exercise.equipmentMode === 'with equipment'
        ? Math.max(10, Math.round((selectedAthlete.weightKg * 0.45) / 2.5) * 2.5)
        : 0;

    const buildSets = (reps: number[], rpe: number[], weightMultiplier: number[] = [1, 1, 1]): WorkoutSet[] =>
      reps.map((rep, index) => ({
        setNumber: index + 1,
        reps: rep,
        targetRpe: rpe[index] ?? 7,
        weightKg: Math.round((equipmentLoad * (weightMultiplier[index] ?? 1)) / 2.5) * 2.5,
        completed: false,
        tempo: exercise.tempoDefault,
      }));

    switch (exercise.trainingType) {
      case 'abs':
        return {
          restSeconds: 45,
          notes: isFa
            ? `پروتکل مرکزی شکم • ${getDifficultyLabel(exercise.intensity, true)} • ${getEquipmentLabel(exercise.equipmentMode, true)}`
            : `Core protocol • ${getDifficultyLabel(exercise.intensity, false)} • ${getEquipmentLabel(exercise.equipmentMode, false)}`,
          sets: buildSets([15, 15, 12], [6, 7, 8], exercise.equipmentMode === 'with equipment' ? [0.5, 0.55, 0.6] : [0, 0, 0]),
        };
      case 'cardio':
      case 'running':
        return {
          restSeconds: 60,
          notes: isFa
            ? `پروتکل هوازی / دویدن • برای حرکات زمان‌محور، فیلد تکرار به‌صورت بازه یا دقیقه ثبت می‌شود.`
            : `Cardio / running protocol • For time-based sessions, reps field tracks intervals or minutes.`,
          sets: buildSets([8, 8, 6], [6, 7, 7], [0, 0, 0]),
        };
      case 'combat':
      case 'HIIT':
      case 'everything':
      case 'RPG fitness':
        return {
          restSeconds: 75,
          notes: isFa
            ? `پروتکل متابولیک ${getWorkoutTypeLabel(exercise.trainingType, true)} • مناسب برای ارتقای ظرفیت، چابکی و استقامت.`
            : `${getWorkoutTypeLabel(exercise.trainingType, false)} metabolic protocol • Built for work capacity, agility, and conditioning.`,
          sets: buildSets([12, 12, 10], [7, 8, 8], exercise.equipmentMode === 'with equipment' ? [0.3, 0.35, 0.4] : [0, 0, 0]),
        };
      case 'stretching':
      case 'yoga':
        return {
          restSeconds: 30,
          notes: isFa
            ? `پروتکل بازیابی و موبیلیتی • در این حرکات عدد تکرار می‌تواند به‌عنوان ثانیه نگه‌داری نیز استفاده شود.`
            : `Recovery and mobility protocol • Reps can represent hold seconds for these movements.`,
          sets: buildSets([45, 45, 60], [4, 5, 5], [0, 0, 0]),
        };
      case 'strength':
      default:
        return {
          restSeconds: 120,
          notes: isFa
            ? `تمرکز بر تمپو: ${exercise.tempoDefault} • ${getDifficultyLabel(exercise.intensity, true)} • ${getEquipmentLabel(exercise.equipmentMode, true)}`
            : `Focus on tempo: ${exercise.tempoDefault} • ${getDifficultyLabel(exercise.intensity, false)} • ${getEquipmentLabel(exercise.equipmentMode, false)}`,
          sets: buildSets([10, 10, 8], [7, 8, 9], [1, 1.05, 1.1]),
        };
    }
  };

  const handlePeriodizationChange = (type: WorkoutProgram['periodizationType']) => {
    setCurrentProgram({ ...currentProgram, periodizationType: type });
  };

  const handleAddExercise = (exercise: Exercise) => {
    if (!activeDay) return;

    const prescription = createExercisePrescription(exercise);
    const updatedDays = [...currentProgram.days];
    const targetDay = updatedDays[activeDayIndex];

    targetDay.exercises.push({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      notes: prescription.notes,
      restSeconds: prescription.restSeconds,
      sets: prescription.sets,
    });

    setCurrentProgram({ ...currentProgram, days: updatedDays });
  };

  const handleRemoveExercise = (exIndex: number) => {
    const updatedDays = [...currentProgram.days];
    updatedDays[activeDayIndex].exercises.splice(exIndex, 1);
    setCurrentProgram({ ...currentProgram, days: updatedDays });
  };

  const handleSetFieldChange = (
    exIndex: number,
    setIdx: number,
    field: keyof WorkoutSet,
    val: number | boolean
  ) => {
    const updatedDays = [...currentProgram.days];
    const targetSet = updatedDays[activeDayIndex].exercises[exIndex].sets[setIdx];
    (targetSet as any)[field] = val;
    setCurrentProgram({ ...currentProgram, days: updatedDays });
  };

  const handleSubstitute = (exIndex: number, substituteName: string) => {
    const updatedDays = [...currentProgram.days];
    updatedDays[activeDayIndex].exercises[exIndex].exerciseName = substituteName;
    updatedDays[activeDayIndex].exercises[exIndex].notes = isFa
      ? `جایگزین‌شده جهت راحتی بیومکانیکی ${selectedAthlete.name}`
      : `Substituted for ${selectedAthlete.name} biomechanical comfort.`;
    setCurrentProgram({ ...currentProgram, days: updatedDays });
  };

  const handleSaveProgram = () => {
    onUpdateProgram(currentProgram);
    alert(isFa ? `برنامه "${currentProgram.title}" با موفقیت ثبت شد!` : `Program "${currentProgram.title}" assigned!`);
  };

  const handleRunAiGenerator = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowAiModal(false);

      const generated: WorkoutProgram = {
        id: `prog-ai-${Date.now()}`,
        title: isFa ? `برنامه هوشمند تولیدشده با AI: ${aiFocus}` : `AI Auto-Generated Macrocycle: ${aiFocus}`,
        description: isFa
          ? `برنامه اختصاصی ۱۲ هفته‌ای طراحی‌شده بر اساس مشخصات بیومتریک ${selectedAthlete.name}، تجهیزات در دسترس و تاریخچه ریکاوری.`
          : `Custom 12-week program tailored to ${selectedAthlete.name}'s biometric profile, equipment availability, and historical recovery telemetry.`,
        targetGoal: selectedAthlete.goal,
        durationWeeks: 12,
        periodizationType: 'Daily Undulating (DUP)',
        days: [
          {
            dayName: isFa ? 'روز ۱: هایپرتروفی بالاتنه' : 'Day 1: Upper Hypertrophy',
            focus: isFa ? 'سینه، پشتی بزرگ، دلتوئید جانبی' : 'Pectoralis Major, Lats, Lateral Delts',
            isRestDay: false,
            exercises: [
              {
                exerciseId: 'ex-1',
                exerciseName: isFa ? 'پرس بالا سینه هالتر' : 'Barbell Incline Press',
                notes: isFa
                  ? 'هدف هوش مصنوعی: خودتنظیمی ۳ ست ۸ تکرار در RPE 8.'
                  : 'AI Target: Auto-regulating 3x8 at RPE 8.',
                restSeconds: 150,
                sets: [
                  { setNumber: 1, reps: 8, targetRpe: 8, weightKg: 95, completed: false },
                  { setNumber: 2, reps: 8, targetRpe: 8, weightKg: 95, completed: false },
                  { setNumber: 3, reps: 8, targetRpe: 8.5, weightKg: 97.5, completed: false },
                ],
              },
              {
                exerciseId: 'ex-3',
                exerciseName: isFa ? 'زیربغل تی بار سینه تکیه‌گاه' : 'Chest Supported T-Bar Row',
                notes: isFa
                  ? 'انقباض پشتی بزرگ به مدت ۱ ثانیه در نقطه اوج.'
                  : 'Squeeze lats for 1 second at full contraction.',
                restSeconds: 120,
                sets: [
                  { setNumber: 1, reps: 10, targetRpe: 8, weightKg: 65, completed: false },
                  { setNumber: 2, reps: 10, targetRpe: 8, weightKg: 65, completed: false },
                  { setNumber: 3, reps: 10, targetRpe: 8.5, weightKg: 70, completed: false },
                ],
              },
            ],
          },
          {
            dayName: isFa ? 'روز ۲: چهارسر ران و تنش قدامی' : 'Day 2: Lower Quad & Anterior Tension',
            focus: isFa ? 'چهارسر ران، نزدیک‌کننده‌ها و ساق' : 'Quadriceps, Adductors & Calf Density',
            isRestDay: false,
            exercises: [
              {
                exerciseId: 'ex-2',
                exerciseName: isFa
                  ? 'دستگاه هک اسکوات (جایگزین اسکوات هالتر)'
                  : 'Hack Squat Machine (Substituted for Barbell Back Squat)',
                notes: isFa
                  ? 'جایگزینی خودکار توسط هوش مصنوعی جهت حفاظت از ستون فقرات کمری.'
                  : 'Auto-substituted by AI to protect lumbar spine based on L4 strain telemetry.',
                restSeconds: 180,
                sets: [
                  { setNumber: 1, reps: 10, targetRpe: 7.5, weightKg: 140, completed: false },
                  { setNumber: 2, reps: 10, targetRpe: 8, weightKg: 150, completed: false },
                  { setNumber: 3, reps: 8, targetRpe: 8.5, weightKg: 160, completed: false },
                ],
              },
              {
                exerciseId: 'ex-18',
                exerciseName: isFa ? 'تکرارهای دو سرعتی تناوبی' : 'Sprint Interval Repeats',
                notes: isFa
                  ? 'بلوک توان بی‌هوازی برای روزهای انفجاری با ریکاوری خودتنظیم.'
                  : 'Anaerobic power block for explosive days with auto-regulated recovery.',
                restSeconds: 60,
                sets: [
                  { setNumber: 1, reps: 8, targetRpe: 7, weightKg: 0, completed: false },
                  { setNumber: 2, reps: 8, targetRpe: 8, weightKg: 0, completed: false },
                  { setNumber: 3, reps: 6, targetRpe: 8.5, weightKg: 0, completed: false },
                ],
              },
            ],
          },
        ],
      };

      setCurrentProgram(generated);
      setActiveDayIndex(0);
    }, 1500);
  };

  if (!activeDay) {
    return null;
  }

  return (
    <div className="p-2 sm:p-4 lg:p-8 space-y-6 lg:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold uppercase tracking-wider">
              {isFa ? 'استودیوی دوره‌بندی تمرین تطبیقی' : 'Adaptive Periodization Studio'}
            </span>
            <span className="text-xs text-slate-400">
              {isFa ? 'ورزشکار: ' : 'Client: '}
              <strong className="text-white">{selectedAthlete.name}</strong>
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">{currentProgram.title}</h2>
          <p className="text-xs text-slate-400 mt-1">{currentProgram.description}</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowAiModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            {isFa ? 'تولید آنی برنامه با هوش مصنوعی' : 'Instant AI Program Generator'}
          </button>

          <button
            onClick={handleSaveProgram}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            {isFa ? 'کامپایل و ابلاغ به ورزشکار' : 'Compile & Assign'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900 border border-cyan-500/30 p-4 rounded-2xl shadow-xl">
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-cyan-400" /> {isFa ? 'حجم کل جابجا شده' : 'Total Volume Lifted'}
          </div>
          <div className="text-xl font-black text-cyan-300 font-mono mt-1">
            {metrics.totalVolumeKg.toLocaleString()} <span className="text-xs font-normal text-slate-400">{isFa ? 'کیلوگرم' : 'kg'}</span>
          </div>
          <div className="text-[10px] text-slate-500">
            {isFa ? `تعداد کل ست‌ها: ${metrics.totalSetsCount}` : `${metrics.totalSetsCount} Sets total`}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> {isFa ? 'کالری‌سوزی تمرین (فرمول MET)' : 'Caloric Expenditure'}
          </div>
          <div className="text-xl font-black text-amber-300 font-mono mt-1">
            {metrics.caloriesBurned} <span className="text-xs font-normal text-slate-400">kcal</span>
          </div>
          <div className="text-[10px] text-amber-400/80">
            {isFa ? `مدت زمان تخمینی: ${metrics.estDurationMinutes} دقیقه` : `Est Duration: ${metrics.estDurationMinutes} mins`}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
            <BarChart2 className="w-3.5 h-3.5 text-emerald-400" /> {isFa ? 'میانگین شدت RPE' : 'Average RPE Target'}
          </div>
          <div className="text-xl font-black text-emerald-300 font-mono mt-1">RPE {metrics.avgRpe}</div>
          <div className="text-[10px] text-emerald-400">{isFa ? 'تنش مکانیکی بهینه' : 'Optimal Tension'}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center">
          <div className="text-xs text-cyan-200 leading-relaxed">
            <strong className="text-white font-bold">{isFa ? 'بازخورد زنده سیستم: ' : 'Live Feedback: '}</strong>
            {isFa
              ? `بار مکانیکی ${metrics.totalVolumeKg.toLocaleString()} کیلوگرمی با کالری‌سوزی ${metrics.caloriesBurned} کیلوکالری، رشد هایپرتروفی بدون بیش‌تمرینی را پشتیبانی می‌کند.`
              : `A ${metrics.totalVolumeKg.toLocaleString()}kg tonnage with ${metrics.caloriesBurned} kcal demand supports productive hypertrophy without excessive overload.`}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <SlidersHorizontal className="w-4 h-4" />
                {isFa ? 'فیلتر پیشرفته بانک تمرینات' : 'Advanced Workout Library Filters'}
              </div>
              <h3 className="text-lg font-black text-white mt-1">
                {isFa ? 'کتابخانه تمرینات متنوع برای تمام سناریوها' : 'Varied workout library for every training scenario'}
              </h3>
            </div>
            <div className="text-xs text-slate-400">
              {isFa ? `${filteredExercises.length} حرکت مطابق فیلترها` : `${filteredExercises.length} exercises match your filters`}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <label className="lg:col-span-3 relative block">
              <Search className={`absolute ${isFa ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500`} />
              <input
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                placeholder={isFa ? 'جستجو بر اساس نام حرکت، عضله هدف، دستور اجرا...' : 'Search by movement name, muscle group, equipment...'}
                className={`w-full rounded-xl bg-slate-950 border border-slate-800 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 ${isFa ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
              />
            </label>

            <label className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400">{isFa ? 'نوع تمرین' : 'Workout Type'}</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as WorkoutType | FilterValue)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="all">{isFa ? 'همه دسته‌ها' : 'All types'}</option>
                {WORKOUT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {getWorkoutTypeLabel(type, isFa)}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400">{isFa ? 'سطح سختی' : 'Difficulty'}</span>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value as WorkoutDifficultyTier | FilterValue)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="all">{isFa ? 'همه سطوح' : 'All levels'}</option>
                {DIFFICULTY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {getDifficultyLabel(level, isFa)}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400">{isFa ? 'تجهیزات' : 'Equipment'}</span>
              <select
                value={equipmentFilter}
                onChange={(e) => setEquipmentFilter(e.target.value as WorkoutEquipmentMode | FilterValue)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="all">{isFa ? 'همه حالت‌ها' : 'All equipment modes'}</option>
                {EQUIPMENT_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {getEquipmentLabel(mode, isFa)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                typeFilter === 'all'
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isFa ? 'همه' : 'All'}
            </button>
            {featuredTypes.map(({ type, count }) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                  typeFilter === type
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {getWorkoutTypeLabel(type, isFa)}
                <span className="text-slate-500 ms-1">({count})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">{isFa ? 'پوشش انواع تمرین' : 'Type Coverage'}</div>
            <div className="text-2xl font-black text-white mt-1">{WORKOUT_TYPES.length}</div>
            <p className="text-xs text-slate-400 mt-1">
              {isFa ? 'شکم، کاردیو، رزمی، HIIT، دویدن، قدرتی، کشش، یوگا و بیشتر.' : 'Abs, cardio, combat, HIIT, running, strength, stretching, yoga and more.'}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">{isFa ? 'سطوح سختی' : 'Difficulty Range'}</div>
            <div className="text-2xl font-black text-cyan-300 mt-1">{DIFFICULTY_LEVELS.length}</div>
            <p className="text-xs text-slate-400 mt-1">
              {isFa ? 'از بسیار سبک تا پیشرفته برای نسخه‌سازی دقیق برنامه.' : 'From light to advanced for precise athlete programming.'}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">{isFa ? 'تنوع تجهیزات' : 'Equipment Modes'}</div>
            <div className="text-2xl font-black text-emerald-300 mt-1">{exerciseDb.length}</div>
            <p className="text-xs text-slate-400 mt-1">
              {isFa ? 'پوشش بدون تجهیزات و با تجهیزات برای باشگاه، منزل و سفر.' : 'Supports no-equipment and equipped sessions for gym, home, and travel.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(['Linear Block', 'Daily Undulating (DUP)', 'Conjugate', 'Overload Peak'] as const).map((scheme) => {
          const isActive = currentProgram.periodizationType === scheme;
          return (
            <button
              key={scheme}
              onClick={() => handlePeriodizationChange(scheme)}
              className={`p-3.5 rounded-xl border text-right transition-all ${
                isActive
                  ? 'bg-cyan-950/40 border-cyan-500/80 text-cyan-300 ring-1 ring-cyan-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="text-[10px] uppercase font-semibold text-slate-500">{isFa ? 'موتور دوره‌بندی تمرین' : 'Periodization Engine'}</div>
              <div className="text-xs font-bold mt-0.5">
                {scheme === 'Daily Undulating (DUP)'
                  ? isFa
                    ? 'موجی روزانه (DUP)'
                    : 'Daily Undulating (DUP)'
                  : scheme === 'Linear Block'
                    ? isFa
                      ? 'بلاک خطی (Linear)'
                      : 'Linear Block'
                    : scheme === 'Conjugate'
                      ? isFa
                        ? 'ترکیبی (Conjugate)'
                        : 'Conjugate'
                      : isFa
                        ? 'اوج‌گیری (Peaking)'
                        : 'Overload Peak'}
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
            {currentProgram.days.map((day, idx) => {
              const isActive = activeDayIndex === idx;
              return (
                <button
                  key={day.dayName}
                  onClick={() => setActiveDayIndex(idx)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>{day.dayName}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/40 font-mono">
                    {day.exercises.length} {isFa ? 'حرکت' : 'ex'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{activeDay.dayName}</span>
                <span className="text-xs text-slate-400 font-normal">({activeDay.focus})</span>
              </h3>
              <span className="text-xs text-cyan-400 font-medium">
                {isFa ? 'فرمت تمپو: E-I-C-P (برگشت-مکث-انقباض-مکث)' : 'Tempo Format: E-I-C-P'}
              </span>
            </div>

            {activeDay.exercises.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-slate-800 text-center space-y-2">
                <Dumbbell className="w-8 h-8 text-slate-600 mx-auto" />
                <div className="text-sm font-semibold text-slate-400">
                  {isFa ? 'هنوز حرکتی برای این روز ثبت نشده است' : 'No exercises added to this day yet'}
                </div>
              </div>
            ) : (
              activeDay.exercises.map((ex, exIdx) => {
                const matchedDbEx = exerciseDb.find((entry) => entry.id === ex.exerciseId);
                return (
                  <div key={`${ex.exerciseId}-${exIdx}`} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-black flex items-center justify-center">
                            {exIdx + 1}
                          </span>
                          <h4 className="font-bold text-white text-base">{ex.exerciseName}</h4>
                          {matchedDbEx && (
                            <span className="px-2 py-1 rounded-lg text-[10px] font-bold border bg-slate-950 text-slate-300 border-slate-800">
                              {getWorkoutTypeLabel(matchedDbEx.trainingType, isFa)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{ex.notes}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {matchedDbEx?.substitutes && matchedDbEx.substitutes.length > 0 && (
                          <div className="relative group">
                            <button className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1">
                              <Shuffle className="w-3.5 h-3.5" /> {isFa ? 'جایگزینی هوشمند' : 'Auto-Substitute'}
                            </button>
                            <div className={`absolute ${isFa ? 'left-0' : 'right-0'} top-full mt-1 w-56 p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl hidden group-hover:block z-20`}>
                              <div className="text-[10px] text-slate-400 font-semibold mb-1">
                                {isFa ? 'گزینه‌های ایمن‌تر از نظر بیومکانیک:' : 'Safer Options:'}
                              </div>
                              {matchedDbEx.substitutes.map((sub) => (
                                <button
                                  key={sub}
                                  onClick={() => handleSubstitute(exIdx, sub)}
                                  className="w-full text-right px-2 py-1 rounded hover:bg-slate-800 text-xs text-white transition-all flex items-center justify-between"
                                >
                                  <span>{sub}</span>
                                  <Check className="w-3 h-3 text-cyan-400" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => handleRemoveExercise(exIdx)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-xs">
                        <thead>
                          <tr className="text-slate-500 border-b border-slate-800/60 pb-2">
                            <th className="py-1.5 font-semibold">{isFa ? 'ست' : 'SET'}</th>
                            <th className="py-1.5 font-semibold">{isFa ? 'تکرار هدف' : 'REPS'}</th>
                            <th className="py-1.5 font-semibold">{isFa ? 'وزنه (کیلوگرم)' : 'LOAD (KG)'}</th>
                            <th className="py-1.5 font-semibold">{isFa ? 'RPE' : 'RPE'}</th>
                            <th className="py-1.5 font-semibold">{isFa ? 'تکمیل' : 'STATUS'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                          {ex.sets.map((s, sIdx) => (
                            <tr key={`${ex.exerciseId}-${sIdx}`} className="text-slate-300 font-medium">
                              <td className="py-2">
                                <span className="w-5 h-5 rounded bg-slate-800 text-slate-300 font-bold inline-flex items-center justify-center text-[10px]">
                                  {s.setNumber}
                                </span>
                              </td>
                              <td className="py-2">
                                <input
                                  type="number"
                                  value={s.reps}
                                  onChange={(e) => handleSetFieldChange(exIdx, sIdx, 'reps', Number(e.target.value))}
                                  className="w-16 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-white text-center font-bold"
                                />
                              </td>
                              <td className="py-2">
                                <input
                                  type="number"
                                  step="2.5"
                                  value={s.weightKg}
                                  onChange={(e) => handleSetFieldChange(exIdx, sIdx, 'weightKg', Number(e.target.value))}
                                  className="w-16 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-cyan-300 font-bold text-center"
                                />
                              </td>
                              <td className="py-2">
                                <input
                                  type="number"
                                  step="0.5"
                                  min="4"
                                  max="10"
                                  value={s.targetRpe}
                                  onChange={(e) => handleSetFieldChange(exIdx, sIdx, 'targetRpe', Number(e.target.value))}
                                  className="w-16 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-amber-300 font-bold text-center"
                                />
                              </td>
                              <td className="py-2">
                                <button
                                  onClick={() => handleSetFieldChange(exIdx, sIdx, 'completed', !s.completed)}
                                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                                    s.completed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                                  }`}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-cyan-400" /> {isFa ? 'بانک جامع حرکات' : 'Movement Database'}
              </h3>
              <span className="text-[10px] text-slate-400">{isFa ? 'کلیک روی + برای افزودن' : 'Click + to add'}</span>
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredExercises.length === 0 ? (
                <div className="p-6 rounded-2xl border border-dashed border-slate-800 text-center space-y-2">
                  <Search className="w-6 h-6 text-slate-600 mx-auto" />
                  <div className="text-sm font-semibold text-slate-300">
                    {isFa ? 'تمرینی با این فیلترها پیدا نشد' : 'No workouts found for these filters'}
                  </div>
                  <p className="text-xs text-slate-500">
                    {isFa ? 'جستجو یا فیلترها را تغییر دهید تا تمرینات بیشتری ببینید.' : 'Change your search or filters to explore more sessions.'}
                  </p>
                </div>
              ) : (
                filteredExercises.map((ex) => (
                  <div key={ex.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3">
                    <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="font-bold text-white text-sm">{ex.name}</h5>
                      <span className="text-[11px] text-cyan-400 font-medium">
                        {ex.primaryMuscle} • {ex.equipment}
                      </span>
                      <div className="text-[10px] text-amber-300 mt-1">
                        {isFa ? 'کالری تخمینی:' : 'Estimated burn:'} {ex.caloriesPer10Min ?? 0} {isFa ? 'کیلوکالری / ۱۰ دقیقه' : 'kcal / 10 min'}
                      </div>
                    </div>

                      <button
                        onClick={() => handleAddExercise(ex)}
                        className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition-all shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-1 rounded-lg text-[10px] border bg-slate-900 text-slate-200 border-slate-700">
                        {getWorkoutTypeLabel(ex.trainingType, isFa)}
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-[10px] border ${difficultyChipTone[ex.intensity]}`}>
                        {getDifficultyLabel(ex.intensity, isFa)}
                      </span>
                      <span className="px-2 py-1 rounded-lg text-[10px] border bg-violet-500/10 text-violet-300 border-violet-500/30">
                        {getEquipmentLabel(ex.equipmentMode, isFa)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">{ex.instructions}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">{isFa ? 'دستیار هوشمند طراحی دوره‌بندی تمرین' : 'Periodization AI Co-Pilot'}</h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-white text-sm">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{isFa ? 'معماری و تقسیم‌بندی روزهای تمرین' : 'Target Split'}</label>
                <select
                  value={aiSplit}
                  onChange={(e) => setAiSplit(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option>{isFa ? 'بالاتنه/پایین‌تنه ۴ روزه موجی' : 'Upper/Lower 4-Day Undulating'}</option>
                  <option>{isFa ? 'هل دادن/کشیدن/پا ۶ روزه پرحجم' : 'Push/Pull/Legs 6-Day High Volume'}</option>
                  <option>{isFa ? 'کنژوگیت حداکثر تلاش / دینامیک ۴ روزه' : 'Conjugate Max Effort / Dynamic 4-Day'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{isFa ? 'تمرکز فیزیولوژیک هدف' : 'Target Focus'}</label>
                <select
                  value={aiFocus}
                  onChange={(e) => setAiFocus(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option>{isFa ? 'حداکثر هایپرتروفی و تراکم عضلانی' : 'Maximal Hypertrophy & Density'}</option>
                  <option>{isFa ? 'اوج قدرت پاورلیفتینگ' : 'Powerlifting Peak'}</option>
                  <option>{isFa ? 'ترکیب قدرت، استقامت و چابکی' : 'Strength + Conditioning Hybrid'}</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
              <button onClick={() => setShowAiModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
                {isFa ? 'انصراف' : 'Cancel'}
              </button>

              <button
                disabled={isGenerating}
                onClick={handleRunAiGenerator}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isFa ? 'در حال تولید برنامه...' : 'Generating...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{isFa ? 'تولید برنامه تمرینی هوشمند' : 'Generate AI Program'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import type { AthleteProfile, Exercise, WorkoutProgram, FranchiseLocation, AIRecommendation } from '../types';

export const MOCK_ATHLETES_FA: AthleteProfile[] = [
  {
    id: 'ath-1',
    name: 'الکس ریورا',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    age: 28,
    gender: 'مرد',
    goal: 'هایپرتروفی و تراکم عضلانی',
    phase: 'فاز بارافزایی بیومکانیکی',
    coachId: 'coach-101',
    coachName: 'استاد مارکوس ونس',
    membershipTier: 'اشتراک VIP مربیگری',
    riskScore: 'Moderate',
    riskReason: 'سیگنال انحراف حرکتی شانه چپ + بار اضافه حاد (ACWR ۱.۴۸)',
    weightKg: 82.5,
    targetWeightKg: 85.0,
    heightCm: 180,
    bodyFatPercent: 11.8,
    bmi: 25.5,
    muscleMassKg: 42.1,
    circumferences: {
      waist: 81.0,
      chest: 108.5,
      arms: 41.2,
      thighs: 62.0,
      calves: 38.5,
      neck: 40.0,
      hips: 96.0,
      forearms: 32.0,
    },
    photos: [
      {
        date: '۱۴۰۵/۰۴/۱۰',
        front: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80',
        side: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80',
        back: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80',
      }
    ],
    caloriesTarget: 3100,
    caloriesLogged: 2950,
    proteinTargetG: 200,
    proteinLoggedG: 192,
    carbsTargetG: 380,
    carbsLoggedG: 360,
    fatsTargetG: 80,
    fatsLoggedG: 78,
    hydrationOzTarget: 128,
    hydrationOzLogged: 110,
    wearableSync: {
      device: 'WHOOP 4.0 Telemetry',
      lastSynced: '۱۲ دقیقه پیش',
      hrvMs: 68,
      hrvBaselineMs: 78,
      restingHeartRateBpm: 52,
      sleepScore: 74,
      sleepHours: 7.1,
      recoveryScore: 62,
      acwrRatio: 1.48,
      strainIndex: 16.2,
    },
    biofeedback: {
      mood: 'عالی',
      energyLevel: 7,
      stressLevel: 6,
      muscleSoreness: 8,
      jointAches: ['سیگنال حساسیت دلتوئید قدامی چپ'],
    },
    labResults: {
      testDate: '۱۴۰۵/۰۳/۲۵',
      totalTestosteroneNgDl: 780,
      freeTestosteronePgMl: 21.4,
      fastingGlucoseMgDl: 88,
      hba1cPercent: 5.1,
      hsCrpMgL: 2.1,
      t3NgDl: 125,
      t4McgDl: 8.2,
      cortisolMcgDl: 18.5,
      ldlMgDl: 95,
      hdlMgDl: 58,
      triglyceridesMgDl: 102,
      flaggedMarkers: ['شاخص التهاب سیستمیک hs-CRP'],
    },
    supplements: [
      { name: 'کراتین مونوهیدرات', dosage: '۵ گرم', timing: 'پس از تمرین', status: 'Taken' },
      { name: 'پروتئین وی ایزوله', dosage: '۴۰ گرم', timing: 'پس از تمرین', status: 'Taken' },
      { name: 'روغن ماهی امگا-۳', dosage: '۳۰۰۰ میلی‌گرم', timing: 'وعده صبحانه', status: 'Taken' },
      { name: 'منیزیم گلیسینات', dosage: '۴۰۰ میلی‌گرم', timing: 'قبل از خواب', status: 'Pending' },
    ],
    medications: [],
    injuries: [
      { area: 'اینفرااسپیناتوس شانه چپ', severity: 'Mild', notes: 'سیگنال فشار بالای ۸۵٪ توان عضلانی توسط بینایی ماشین ثبت گردید' }
    ],
    workoutCompliancePercent: 95,
    nutritionCompliancePercent: 92,
    activeStreakDays: 14,
  },

  {
    id: 'ath-2',
    name: 'سارا چن',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    age: 32,
    gender: 'زن',
    goal: 'حفظ ذخایر عضلانی و کاهش چربی',
    phase: 'آماده‌سازی مسابقات',
    coachId: 'coach-101',
    coachName: 'استاد مارکوس ونس',
    membershipTier: 'اشتراک VIP مربیگری',
    riskScore: 'Low',
    weightKg: 58.2,
    targetWeightKg: 56.0,
    heightCm: 165,
    bodyFatPercent: 18.2,
    bmi: 21.4,
    muscleMassKg: 27.8,
    circumferences: {
      waist: 66.5,
      chest: 88.0,
      arms: 28.5,
      thighs: 52.4,
      calves: 34.0,
      neck: 32.0,
      hips: 91.0,
      forearms: 23.5,
    },
    photos: [],
    caloriesTarget: 1850,
    caloriesLogged: 1820,
    proteinTargetG: 145,
    proteinLoggedG: 148,
    carbsTargetG: 160,
    carbsLoggedG: 155,
    fatsTargetG: 50,
    fatsLoggedG: 48,
    hydrationOzTarget: 100,
    hydrationOzLogged: 96,
    wearableSync: {
      device: 'Apple Health Telemetry',
      lastSynced: '۲ دقیقه پیش',
      hrvMs: 82,
      hrvBaselineMs: 80,
      restingHeartRateBpm: 48,
      sleepScore: 88,
      sleepHours: 8.2,
      recoveryScore: 91,
      acwrRatio: 1.05,
      strainIndex: 12.8,
    },
    biofeedback: {
      mood: 'عالی',
      energyLevel: 9,
      stressLevel: 3,
      muscleSoreness: 4,
      jointAches: [],
    },
    labResults: {
      testDate: '۱۴۰۵/۰۴/۱۲',
      totalTestosteroneNgDl: 38,
      freeTestosteronePgMl: 1.8,
      fastingGlucoseMgDl: 82,
      hba1cPercent: 4.9,
      hsCrpMgL: 0.6,
      t3NgDl: 110,
      t4McgDl: 7.9,
      cortisolMcgDl: 12.1,
      ldlMgDl: 88,
      hdlMgDl: 68,
      triglyceridesMgDl: 75,
      flaggedMarkers: [],
    },
    supplements: [
      { name: 'مولتی‌ویتامین الیت', dosage: '۲ کپسول', timing: 'صبح', status: 'Taken' },
      { name: 'ال-کارنیتین تارتارات', dosage: '۲۰۰۰ میلی‌گرم', timing: 'قبل هوازی', status: 'Taken' },
    ],
    medications: [],
    injuries: [],
    workoutCompliancePercent: 98,
    nutritionCompliancePercent: 97,
    activeStreakDays: 28,
  },

  {
    id: 'ath-3',
    name: 'دامتریوس ثورن',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    age: 35,
    gender: 'مرد',
    goal: 'افزایش قدرت و رکورد پاورلیفتینگ',
    phase: 'بلاک پایه قدرت',
    coachId: 'coach-102',
    coachName: 'سارا میلر',
    membershipTier: 'Pro Hybrid',
    riskScore: 'High',
    riskReason: 'انحراف کمری ۶.۸ درجه در ددلیفت + افت ریکاوری سیستم عصبی (امتیاز خواب ۴۲٪)',
    weightKg: 104.0,
    targetWeightKg: 105.0,
    heightCm: 185,
    bodyFatPercent: 19.5,
    bmi: 30.4,
    muscleMassKg: 52.0,
    circumferences: {
      waist: 92.0,
      chest: 122.0,
      arms: 46.5,
      thighs: 68.0,
      calves: 43.0,
      neck: 44.0,
      hips: 106.0,
      forearms: 36.0,
    },
    photos: [],
    caloriesTarget: 3800,
    caloriesLogged: 3400,
    proteinTargetG: 240,
    proteinLoggedG: 210,
    carbsTargetG: 450,
    carbsLoggedG: 400,
    fatsTargetG: 100,
    fatsLoggedG: 95,
    hydrationOzTarget: 150,
    hydrationOzLogged: 90,
    wearableSync: {
      device: 'Garmin Fenix 7 Telemetry',
      lastSynced: '۱ ساعت پیش',
      hrvMs: 44,
      hrvBaselineMs: 65,
      restingHeartRateBpm: 64,
      sleepScore: 42,
      sleepHours: 5.2,
      recoveryScore: 38,
      acwrRatio: 1.62,
      strainIndex: 18.9,
    },
    biofeedback: {
      mood: 'خسته',
      energyLevel: 4,
      stressLevel: 8,
      muscleSoreness: 9,
      jointAches: ['مهره‌های کمری L4-L5', 'تاندون زانوی راست'],
    },
    labResults: {
      testDate: '۱۴۰۵/۰۲/۲۸',
      totalTestosteroneNgDl: 520,
      freeTestosteronePgMl: 14.2,
      fastingGlucoseMgDl: 96,
      hba1cPercent: 5.4,
      hsCrpMgL: 3.4,
      t3NgDl: 115,
      t4McgDl: 7.4,
      cortisolMcgDl: 24.1,
      ldlMgDl: 122,
      hdlMgDl: 42,
      triglyceridesMgDl: 145,
      flaggedMarkers: ['کورتیزول بالا', 'hs-CRP بالا'],
    },
    supplements: [
      { name: 'کراتین HCl', dosage: '۵ گرم', timing: 'صبح', status: 'Taken' },
      { name: 'آشواگاندا KSM-66', dosage: '۶۰۰ میلی‌گرم', timing: 'عصر', status: 'Pending' },
    ],
    medications: ['مسکن مسکن در صورت نیاز'],
    injuries: [
      { area: 'علامت کشیدگی دیسک کمری L4-L5', severity: 'Moderate', notes: 'شناسایی ۶.۸ درجه خمیدگی غیرایمن تحت بار محوری سنگین' }
    ],
    workoutCompliancePercent: 78,
    nutritionCompliancePercent: 82,
    activeStreakDays: 3,
  }
];

export const EXERCISE_DATABASE_FA: Exercise[] = [
  {
    id: 'ex-1',
    name: 'پرس بالا سینه هالتر',
    category: 'Chest',
    primaryMuscle: 'بخش بالایی سینه',
    secondaryMuscles: ['دلتوئید قدامی', 'سه سر بازویی'],
    equipment: 'هالتر و نیمکت شیب‌دار',
    difficulty: 'Intermediate',
    tempoDefault: '3-1-1-0',
    substitutes: ['پرس بالا سینه دمبل', 'پرس بالا سینه دستگاه همراستایل'],
    instructions: 'کنترل کامل فاز منفی حرکت همراه با حفظ وضعیت پایین کتف‌ها.'
  },
  {
    id: 'ex-2',
    name: 'اسکوات پا هالتر از پشت',
    category: 'Quads',
    primaryMuscle: 'چهارسر ران',
    secondaryMuscles: ['سرینی بزرگ', 'نزدیک‌کننده بزرگ'],
    equipment: 'هالتر و رک اسکوات',
    difficulty: 'Advanced',
    tempoDefault: '3-1-1-0',
    substitutes: ['دستگاه هک اسکوات', 'پاندولوم اسکوات'],
    instructions: 'حفظ راستای ستون فقرات و جلوگیری از انحراف زانوها به سمت داخل.'
  },
  {
    id: 'ex-3',
    name: 'زیربغل تی بار سینه تکیه‌گاه',
    category: 'Back',
    primaryMuscle: 'پشتی بزرگ و رومبوئیدها',
    secondaryMuscles: ['دلتوئید خلفی'],
    equipment: 'دستگاه تی‌بار',
    difficulty: 'Intermediate',
    tempoDefault: '2-1-1-1',
    substitutes: ['زیربغل دمبل جفت سینه تکیه‌گاه'],
    instructions: 'انقباض ۱ ثانیه‌ای در اوج حرکت بدون حرکت دادن تنه.'
  }
];

export const MOCK_PROGRAM_FA: WorkoutProgram = {
  id: 'prog-hypertrophy-v3',
  title: 'بلاک ۲ هایپرتروفی اپکس: تمرکز بر تنش مکانیکی',
  description: 'برنامه ۱۲ هفته‌ای خودتنظیم‌شونده مبتنی بر سرعت حرکت و پایش بیومارکرهای ریکاوری.',
  targetGoal: 'حداکثر رشد حجم عضلانی',
  durationWeeks: 12,
  periodizationType: 'Daily Undulating (DUP)',
  days: [
    {
      dayName: 'روز ۱: قدرت و تنش بالاتنه',
      focus: 'سینه، پشتی بزرگ، بار مکانیکی بالاتنه',
      isRestDay: false,
      exercises: [
        {
          exerciseId: 'ex-1',
          exerciseName: 'پرس بالا سینه هالتر',
          notes: 'کتف‌ها را پایین نگه دارید. روی تنش بخش بالایی سینه تمرکز کنید.',
          restSeconds: 180,
          sets: [
            { setNumber: 1, reps: 8, targetRpe: 7, weightKg: 90, completed: true, actualRpe: 7 },
            { setNumber: 2, reps: 8, targetRpe: 8, weightKg: 95, completed: true, actualRpe: 8 },
            { setNumber: 3, reps: 6, targetRpe: 9, weightKg: 100, completed: true, actualRpe: 9 },
          ]
        },
        {
          exerciseId: 'ex-3',
          exerciseName: 'زیربغل تی بار سینه تکیه‌گاه',
          notes: '۱ ثانیه مکث محکم در نقطه اوج انقباض.',
          restSeconds: 150,
          sets: [
            { setNumber: 1, reps: 10, targetRpe: 7, weightKg: 60, completed: true, actualRpe: 7 },
            { setNumber: 2, reps: 10, targetRpe: 8, weightKg: 65, completed: true, actualRpe: 8 },
            { setNumber: 3, reps: 8, targetRpe: 9, weightKg: 70, completed: true, actualRpe: 9 },
          ]
        }
      ]
    },
    {
      dayName: 'روز ۲: چهارسر ران و زنجیره قدامی',
      focus: 'عضلات چهارسر و نزدیک‌کننده',
      isRestDay: false,
      exercises: [
        {
          exerciseId: 'ex-2',
          exerciseName: 'اسکوات پا هالتر از پشت',
          notes: 'عمق کامل. نیرو را از مرکز کف پا وارد کنید.',
          restSeconds: 180,
          sets: [
            { setNumber: 1, reps: 6, targetRpe: 7, weightKg: 120, completed: false },
            { setNumber: 2, reps: 6, targetRpe: 8, weightKg: 130, completed: false },
            { setNumber: 3, reps: 6, targetRpe: 9, weightKg: 135, completed: false },
          ]
        }
      ]
    }
  ]
};

export const MOCK_FRANCHISES_FA: FranchiseLocation[] = [
  {
    id: 'loc-1',
    name: 'مرکز عملکرد پرچمدار اپکس فرانکفورت',
    city: 'فرانکفورت',
    country: 'آلمان',
    coachesCount: 14,
    activeClientsCount: 420,
    monthlyRevenueUsd: 84000,
    retentionRatePercent: 94.2,
    complianceAveragePercent: 91.5,
    managerName: 'کلوس لیندنر'
  },
  {
    id: 'loc-2',
    name: 'دفتر مرکزی اپکس سیتی لندن',
    city: 'لندن',
    country: 'بریتانیا',
    coachesCount: 22,
    activeClientsCount: 680,
    monthlyRevenueUsd: 142000,
    retentionRatePercent: 92.8,
    complianceAveragePercent: 88.9,
    managerName: 'جما استرلینگ'
  }
];

export const MOCK_AI_RECOMMENDATIONS_FA: AIRecommendation[] = [
  {
    id: 'rec-101',
    athleteId: 'ath-1',
    athleteName: 'الکس ریورا',
    timestamp: '۱۰ دقیقه پیش',
    category: 'بازنویسی خودکار حجم هفته بعد',
    insight: 'تخفیف ۱۲.۸٪ در HRV دستگاه WHOOP و شاخص ACWR ۱.۴۸ نشان‌دهنده تجمع خستگی سیستم عصبی است.',
    suggestedAction: 'کاهش ۱۵٪ حجم تمرینی هفته بعد (حذف ۱ ست اسکوات و محدود کردن RPE به ۷.۵)',
    applied: false,
    evidence: {
      confidenceScorePercent: 94.2,
      dataSource: '۱۴ روز داده پیوسته WHOOP 4.0 + سابقه ۱۲۰ ست تمرینی',
      reasoning: 'روند افت HRV همزمان با افزایش فشار ACWR بالاتر از ۱.۴۵ نشان‌دهنده لزوم مداخله و پیشگیری از خستگی سیستمیک است.'
    }
  },
  {
    id: 'rec-102',
    athleteId: 'ath-3',
    athleteName: 'دامتریوس ثورن',
    timestamp: '۱ ساعت پیش',
    category: 'سیگنال انحراف بیومکانیک حرکتی',
    insight: 'بینایی ماشین انحراف ۶.۸ درجه‌ای ستون فقرات کمری در ثانیه‌های اولیه جدا شدن ددلیفت از زمین را ثبت نمود.',
    suggestedAction: 'جایگزینی ددلیفت با بلت اسکوات و فعال‌سازی تمرینات اصلاحی ثبات‌دهنده هسته بدن',
    applied: true,
    evidence: {
      confidenceScorePercent: 89.6,
      dataSource: 'آنالیز ۱۲۰ فریم ویدیو با مدل ۳۳ نقطه‌ای MediaPipe',
      reasoning: 'عبور زاویه انحراف از آستانه ۵.۰ درجه همراه با کیفیت خواب ۴۲٪ احتمال آسیب کمری را به شدت افزایش می‌دهد.'
    }
  }
];

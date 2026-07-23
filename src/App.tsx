import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { RouteLoading } from './components/RouteLoading';
import { CommandPalette } from './components/CommandPalette';
import { BrandStudio } from './components/BrandStudio';
import {
  EXERCISE_DATABASE,
  MOCK_AI_RECOMMENDATIONS,
  MOCK_ATHLETES,
  MOCK_PROGRAM,
} from './data/mockData';
import {
  EXERCISE_DATABASE_FA,
  MOCK_AI_RECOMMENDATIONS_FA,
  MOCK_ATHLETES_FA,
  MOCK_PROGRAM_FA,
} from './data/mockDataFa';
import type { AIRecommendation, AthleteProfile, WorkoutProgram } from './types';
import { getPathFromTab, getTabFromPath, type AppTab, type RoleView } from './utils/formatters';
import { DEFAULT_BRAND, type BrandConfig } from './utils/branding';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AthletesPage = lazy(() => import('./pages/AthletesPage'));
const MedicalPage = lazy(() => import('./pages/MedicalPage'));
const MotionPage = lazy(() => import('./pages/MotionPage'));
const WorkoutsPage = lazy(() => import('./pages/WorkoutsPage'));
const NutritionPage = lazy(() => import('./pages/NutritionPage'));
const Profile360Page = lazy(() => import('./pages/Profile360Page'));
const AthleteDashboardPage = lazy(() => import('./pages/AthleteDashboardPage'));
const BiometricCalibrator = lazy(() =>
  import('./components/BiometricCalibrator').then((module) => ({ default: module.BiometricCalibrator }))
);

const ROLE_STORAGE_KEY = 'apexos-role-view';
const BRAND_STORAGE_KEY = 'apexos-brand-config';

export function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [lang, setLang] = useState<'en' | 'fa'>('fa');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState<string>('');
  const [roleView, setRoleView] = useState<RoleView>(() => {
    if (typeof window === 'undefined') return 'coach';
    const saved = window.localStorage.getItem(ROLE_STORAGE_KEY);
    return saved === 'coach' || saved === 'athlete' || saved === 'nutrition' || saved === 'medical' ? saved : 'coach';
  });
  const [brand, setBrand] = useState<BrandConfig>(() => {
    if (typeof window === 'undefined') return DEFAULT_BRAND;
    try {
      const raw = window.localStorage.getItem(BRAND_STORAGE_KEY);
      return raw ? { ...DEFAULT_BRAND, ...(JSON.parse(raw) as Partial<BrandConfig>) } : DEFAULT_BRAND;
    } catch {
      return DEFAULT_BRAND;
    }
  });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isBrandStudioOpen, setIsBrandStudioOpen] = useState(false);

  const isFa = lang === 'fa';
  const activeTab = getTabFromPath(location.pathname);

  const initialAthletes = isFa ? MOCK_ATHLETES_FA : MOCK_ATHLETES;
  const exerciseDb = isFa ? EXERCISE_DATABASE_FA : EXERCISE_DATABASE;
  const initialProgram = isFa ? MOCK_PROGRAM_FA : MOCK_PROGRAM;
  const initialAiRecs = (isFa ? MOCK_AI_RECOMMENDATIONS_FA : MOCK_AI_RECOMMENDATIONS).map((recommendation) => ({
    ...recommendation,
    reviewed: recommendation.reviewed ?? recommendation.applied,
  }));

  const [athletes, setAthletes] = useState<AthleteProfile[]>(initialAthletes);
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteProfile>(initialAthletes[0]);
  const [program, setProgram] = useState<WorkoutProgram>(initialProgram);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>(initialAiRecs);

  useEffect(() => {
    document.documentElement.dir = isFa ? 'rtl' : 'ltr';
    document.documentElement.lang = isFa ? 'fa' : 'en';
    const newAthletes = isFa ? MOCK_ATHLETES_FA : MOCK_ATHLETES;
    setAthletes(newAthletes);
    setSelectedAthlete(newAthletes[0]);
    setProgram(isFa ? MOCK_PROGRAM_FA : MOCK_PROGRAM);
    setAiRecommendations(
      (isFa ? MOCK_AI_RECOMMENDATIONS_FA : MOCK_AI_RECOMMENDATIONS).map((recommendation) => ({
        ...recommendation,
        reviewed: recommendation.reviewed ?? recommendation.applied,
      }))
    );
  }, [isFa, lang]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(ROLE_STORAGE_KEY, roleView);
  }, [roleView]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(BRAND_STORAGE_KEY, JSON.stringify(brand));
  }, [brand]);

  useEffect(() => {
    const applyResponsiveSidebarState = () => {
      const width = window.innerWidth;
      setIsSidebarCollapsed(width < 1024);
      if (width >= 768) {
        setIsMobileSidebarOpen(false);
      }
    };

    applyResponsiveSidebarState();
    window.addEventListener('resize', applyResponsiveSidebarState);
    return () => window.removeEventListener('resize', applyResponsiveSidebarState);
  }, []);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isModifier = event.metaKey || event.ctrlKey;
      if (isModifier && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if (event.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsBrandStudioOpen(false);
      }
      if (isModifier && event.key.toLowerCase() === 'b') {
        event.preventDefault();
        setIsBrandStudioOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigateTab = (tab: AppTab) => {
    navigate(getPathFromTab(tab));
  };

  const handleUpdateAthlete = (updated: AthleteProfile) => {
    setSelectedAthlete(updated);
    setAthletes((prev) => prev.map((athlete) => (athlete.id === updated.id ? updated : athlete)));
  };

  const handleApplyAIRecommendation = (recId: string) => {
    setAiRecommendations((prev) =>
      prev.map((recommendation) =>
        recommendation.id === recId ? { ...recommendation, applied: true, reviewed: true } : recommendation
      )
    );
  };

  const handleReviewAIRecommendation = (recId: string) => {
    setAiRecommendations((prev) =>
      prev.map((recommendation) =>
        recommendation.id === recId ? { ...recommendation, reviewed: true } : recommendation
      )
    );
  };

  const handleReviewAllAIRecommendations = () => {
    setAiRecommendations((prev) => prev.map((recommendation) => ({ ...recommendation, reviewed: true })));
  };

  const handleUpdateProgram = (newProg: WorkoutProgram) => {
    setProgram(newProg);
  };

  const handleAddAthlete = (payload: { name: string; goal: string; affiliatedGym: string; previousCoach: string }) => {
    const newAthlete: AthleteProfile = {
      id: `ath-${Date.now()}`,
      name: payload.name.trim(),
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      age: 25,
      gender: isFa ? 'ثبت‌نشده' : 'Unspecified',
      goal: payload.goal.trim() || (isFa ? 'بهبود عملکرد ورزشی' : 'Improve athletic performance'),
      phase: isFa ? 'شروع آنبوردینگ' : 'Onboarding Phase',
      coachId: 'coach-101',
      coachName: isFa ? 'استاد مارکوس ونس' : 'Coach Marcus Vance',
      membershipTier: isFa ? 'پلن ورزشکار جدید' : 'New Athlete Plan',
      riskScore: 'Low',
      affiliatedGyms: [payload.affiliatedGym.trim() || (isFa ? 'باشگاه ثبت‌نشده' : 'Gym not set')],
      previousCoaches: payload.previousCoach.trim() ? [payload.previousCoach.trim()] : [],
      healthProfile: {
        bloodType: isFa ? 'نامشخص' : 'Unknown',
        allergies: [],
        conditions: [],
        emergencyContact: isFa ? 'در انتظار ثبت' : 'Pending entry',
        medicalClearance: isFa ? 'در انتظار ارزیابی' : 'Awaiting evaluation',
      },
      weightKg: 72,
      targetWeightKg: 74,
      heightCm: 175,
      bodyFatPercent: 16,
      bmi: 23.5,
      muscleMassKg: 31,
      circumferences: {
        waist: 80,
        chest: 100,
        arms: 34,
        thighs: 56,
        calves: 36,
        neck: 37,
        hips: 94,
        forearms: 29,
      },
      photos: [],
      caloriesTarget: 2500,
      caloriesLogged: 0,
      proteinTargetG: 170,
      proteinLoggedG: 0,
      carbsTargetG: 250,
      carbsLoggedG: 0,
      fatsTargetG: 70,
      fatsLoggedG: 0,
      hydrationOzTarget: 110,
      hydrationOzLogged: 0,
      wearableSync: {
        device: isFa ? 'در انتظار اتصال گجت' : 'Wearable Pending Sync',
        lastSynced: isFa ? 'هنوز متصل نشده' : 'Not synced yet',
        hrvMs: 60,
        hrvBaselineMs: 60,
        restingHeartRateBpm: 58,
        sleepScore: 76,
        sleepHours: 7,
        recoveryScore: 78,
        acwrRatio: 1,
        strainIndex: 11.5,
      },
      biofeedback: {
        mood: isFa ? 'خوب' : 'Good',
        energyLevel: 7,
        stressLevel: 4,
        muscleSoreness: 3,
        jointAches: [],
      },
      labResults: {
        testDate: isFa ? '۱۴۰۵/۰۴/۲۵' : '2026-07-16',
        fastingGlucoseMgDl: 90,
        hsCrpMgL: 0.8,
        ldlMgDl: 92,
        flaggedMarkers: [],
      },
      supplements: [
        {
          name: isFa ? 'پروتئین وی' : 'Whey Protein',
          dosage: isFa ? '۳۰ گرم' : '30g',
          timing: isFa ? 'بعد تمرین' : 'Post-workout',
          status: 'Pending',
        },
      ],
      medications: [],
      injuries: [],
      workoutCompliancePercent: 88,
      nutritionCompliancePercent: 84,
      activeStreakDays: 1,
    };

    setAthletes((prev) => [newAthlete, ...prev]);
    setSelectedAthlete(newAthlete);
  };

  const handleAssignQuickPlan = (templateId: 'strength' | 'conditioning' | 'mobility') => {
    const templates: Record<'strength' | 'conditioning' | 'mobility', WorkoutProgram> = {
      strength: {
        id: `quick-strength-${Date.now()}`,
        title: isFa ? 'پلن سریع قدرت عمومی' : 'Quick General Strength Plan',
        description: isFa ? 'پلن ۳ روزه برای قدرت پایه و توسعه عضلانی عمومی.' : '3-day plan for foundational strength and general hypertrophy.',
        targetGoal: isFa ? 'قدرت و عضله' : 'Strength and muscle',
        durationWeeks: 4,
        periodizationType: 'Linear Block',
        days: [
          {
            dayName: isFa ? 'روز ۱: فشار بالاتنه' : 'Day 1: Upper Push',
            focus: isFa ? 'سینه، سرشانه و سه‌سر' : 'Chest, shoulders, triceps',
            isRestDay: false,
            exercises: [
              {
                exerciseId: 'ex-1',
                exerciseName: isFa ? 'پرس بالا سینه هالتر' : 'Barbell Incline Press',
                notes: isFa ? 'قدرت پایه' : 'Foundational strength',
                restSeconds: 120,
                sets: [
                  { setNumber: 1, reps: 8, targetRpe: 7, weightKg: 60, completed: false },
                  { setNumber: 2, reps: 8, targetRpe: 8, weightKg: 65, completed: false },
                  { setNumber: 3, reps: 6, targetRpe: 8.5, weightKg: 70, completed: false },
                ],
              },
              {
                exerciseId: 'ex-5',
                exerciseName: isFa ? 'نشر جانب نشسته' : 'Seated Lateral Raises',
                notes: isFa ? 'کنترل کامل تمپو' : 'Controlled tempo',
                restSeconds: 75,
                sets: [
                  { setNumber: 1, reps: 15, targetRpe: 7, weightKg: 8, completed: false },
                  { setNumber: 2, reps: 15, targetRpe: 8, weightKg: 8, completed: false },
                  { setNumber: 3, reps: 12, targetRpe: 8.5, weightKg: 10, completed: false },
                ],
              },
            ],
          },
          {
            dayName: isFa ? 'روز ۲: پایین‌تنه' : 'Day 2: Lower Body',
            focus: isFa ? 'چهارسر، همسترینگ و سرینی' : 'Quads, hamstrings, glutes',
            isRestDay: false,
            exercises: [
              {
                exerciseId: 'ex-2',
                exerciseName: isFa ? 'اسکوات پا هالتر از پشت' : 'Barbell Back Squat',
                notes: isFa ? 'فشار پیشرونده' : 'Progressive loading',
                restSeconds: 150,
                sets: [
                  { setNumber: 1, reps: 6, targetRpe: 7, weightKg: 80, completed: false },
                  { setNumber: 2, reps: 6, targetRpe: 8, weightKg: 85, completed: false },
                  { setNumber: 3, reps: 5, targetRpe: 8.5, weightKg: 90, completed: false },
                ],
              },
              {
                exerciseId: 'ex-4',
                exerciseName: isFa ? 'ددلیفت رومانیایی' : 'Romanian Deadlift (RDL)',
                notes: isFa ? 'تمرکز بر زنجیره خلفی' : 'Posterior chain focus',
                restSeconds: 120,
                sets: [
                  { setNumber: 1, reps: 10, targetRpe: 7, weightKg: 70, completed: false },
                  { setNumber: 2, reps: 10, targetRpe: 8, weightKg: 75, completed: false },
                  { setNumber: 3, reps: 8, targetRpe: 8.5, weightKg: 80, completed: false },
                ],
              },
            ],
          },
          {
            dayName: isFa ? 'روز ۳: کشش و کشش‌پول' : 'Day 3: Pull Strength',
            focus: isFa ? 'پشت، بازو و گیرش' : 'Back, biceps, grip',
            isRestDay: false,
            exercises: [
              {
                exerciseId: 'ex-3',
                exerciseName: isFa ? 'زیربغل تی بار سینه تکیه‌گاه' : 'Chest Supported T-Bar Row',
                notes: isFa ? 'مکث در اوج' : 'Pause at peak',
                restSeconds: 120,
                sets: [
                  { setNumber: 1, reps: 10, targetRpe: 7, weightKg: 50, completed: false },
                  { setNumber: 2, reps: 10, targetRpe: 8, weightKg: 55, completed: false },
                  { setNumber: 3, reps: 8, targetRpe: 8.5, weightKg: 60, completed: false },
                ],
              },
            ],
          },
        ],
      },
      conditioning: {
        id: `quick-conditioning-${Date.now()}`,
        title: isFa ? 'پلن سریع چربی‌سوزی و هوازی' : 'Quick Fat-Loss & Conditioning Plan',
        description: isFa ? 'پلن ۴ روزه برای افزایش کالری‌سوزی، استقامت و ظرفیت قلبی-تنفسی.' : '4-day plan to increase calorie burn, endurance, and work capacity.',
        targetGoal: isFa ? 'کاهش چربی و استقامت' : 'Fat loss and conditioning',
        durationWeeks: 4,
        periodizationType: 'Daily Undulating (DUP)',
        days: [
          {
            dayName: isFa ? 'روز ۱: هوازی و طناب' : 'Day 1: Cardio Rope Flow',
            focus: isFa ? 'هوازی پایه' : 'Base conditioning',
            isRestDay: false,
            exercises: [
              {
                exerciseId: 'ex-11',
                exerciseName: isFa ? 'طناب‌زدن تناوبی هوازی' : 'Jump Rope Aerobic Intervals',
                notes: isFa ? 'ریتم ثابت' : 'Steady rhythm',
                restSeconds: 45,
                sets: [
                  { setNumber: 1, reps: 10, targetRpe: 6, weightKg: 0, completed: false },
                  { setNumber: 2, reps: 10, targetRpe: 6.5, weightKg: 0, completed: false },
                  { setNumber: 3, reps: 8, targetRpe: 7, weightKg: 0, completed: false },
                ],
              },
            ],
          },
          {
            dayName: isFa ? 'روز ۲: HIIT و اسپرینت' : 'Day 2: HIIT Sprint',
            focus: isFa ? 'توان بی‌هوازی' : 'Anaerobic power',
            isRestDay: false,
            exercises: [
              {
                exerciseId: 'ex-15',
                exerciseName: isFa ? 'تکرارهای دو سرعتی تناوبی' : 'Sprint Interval Repeats',
                notes: isFa ? 'شدت بالا' : 'High intensity',
                restSeconds: 60,
                sets: [
                  { setNumber: 1, reps: 8, targetRpe: 7.5, weightKg: 0, completed: false },
                  { setNumber: 2, reps: 8, targetRpe: 8, weightKg: 0, completed: false },
                  { setNumber: 3, reps: 6, targetRpe: 8.5, weightKg: 0, completed: false },
                ],
              },
            ],
          },
          {
            dayName: isFa ? 'روز ۳: فول‌بادی متابولیک' : 'Day 3: Full-Body Metabolic',
            focus: isFa ? 'کالری‌سوزی و استقامت' : 'Calorie burn and endurance',
            isRestDay: false,
            exercises: [
              {
                exerciseId: 'ex-30',
                exerciseName: isFa ? 'خرس‌روی + لانج معکوس' : 'Bear Crawl + Reverse Lunge Flow',
                notes: isFa ? 'کنترل مرکزی بدن' : 'Core control',
                restSeconds: 60,
                sets: [
                  { setNumber: 1, reps: 12, targetRpe: 7, weightKg: 0, completed: false },
                  { setNumber: 2, reps: 12, targetRpe: 7.5, weightKg: 0, completed: false },
                  { setNumber: 3, reps: 10, targetRpe: 8, weightKg: 0, completed: false },
                ],
              },
            ],
          },
        ],
      },
      mobility: {
        id: `quick-mobility-${Date.now()}`,
        title: isFa ? 'پلن سریع موبیلیتی و ریکاوری' : 'Quick Mobility & Recovery Plan',
        description: isFa ? 'پلن ۳ روزه برای ریکاوری، کشش و کاهش سفتی عضلات.' : '3-day plan focused on recovery, stretching, and movement quality.',
        targetGoal: isFa ? 'ریکاوری و کیفیت حرکت' : 'Recovery and movement quality',
        durationWeeks: 3,
        periodizationType: 'Conjugate',
        days: [
          {
            dayName: isFa ? 'روز ۱: موبیلیتی فعال' : 'Day 1: Active Mobility',
            focus: isFa ? 'لگن و سرشانه' : 'Hips and shoulders',
            isRestDay: false,
            exercises: [
              {
                exerciseId: 'ex-20',
                exerciseName: isFa ? 'فلوی موبیلیتی با کش مقاومتی' : 'Resistance Band Mobility Flow',
                notes: isFa ? 'دامنه کنترل‌شده' : 'Controlled mobility',
                restSeconds: 30,
                sets: [
                  { setNumber: 1, reps: 45, targetRpe: 4, weightKg: 0, completed: false },
                  { setNumber: 2, reps: 45, targetRpe: 4, weightKg: 0, completed: false },
                  { setNumber: 3, reps: 60, targetRpe: 5, weightKg: 0, completed: false },
                ],
              },
            ],
          },
          {
            dayName: isFa ? 'روز ۲: کشش پایین‌تنه' : 'Day 2: Lower-Body Stretching',
            focus: isFa ? 'فلکسور ران و ستون فقرات' : 'Hip flexors and spine',
            isRestDay: false,
            exercises: [
              {
                exerciseId: 'ex-21',
                exerciseName: isFa ? 'کشش زانوزده فلکسور ران' : 'Kneeling Hip Flexor Stretch',
                notes: isFa ? 'بازدم طولانی' : 'Long exhales',
                restSeconds: 20,
                sets: [
                  { setNumber: 1, reps: 45, targetRpe: 4, weightKg: 0, completed: false },
                  { setNumber: 2, reps: 45, targetRpe: 4, weightKg: 0, completed: false },
                  { setNumber: 3, reps: 60, targetRpe: 4.5, weightKg: 0, completed: false },
                ],
              },
            ],
          },
          {
            dayName: isFa ? 'روز ۳: یوگا و تنفس' : 'Day 3: Yoga & Breathwork',
            focus: isFa ? 'یوگا و آرام‌سازی' : 'Yoga and recovery',
            isRestDay: false,
            exercises: [
              {
                exerciseId: 'ex-22',
                exerciseName: isFa ? 'فلوی موبیلیتی سلام بر خورشید' : 'Sun Salutation Mobility Flow',
                notes: isFa ? 'حرکت همراه با تنفس' : 'Move with breath',
                restSeconds: 20,
                sets: [
                  { setNumber: 1, reps: 45, targetRpe: 4, weightKg: 0, completed: false },
                  { setNumber: 2, reps: 45, targetRpe: 4.5, weightKg: 0, completed: false },
                  { setNumber: 3, reps: 60, targetRpe: 5, weightKg: 0, completed: false },
                ],
              },
            ],
          },
        ],
      },
    };

    setProgram(templates[templateId]);
    navigate(getPathFromTab('builder'));
  };

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const handleExportAthletesCsv = () => {
    const header = ['Athlete', 'Goal', 'RecoveryScore', 'ACWR', 'WorkoutCompliance', 'NutritionCompliance', 'Risk'];
    const rows = athletes.map((athlete) => [
      athlete.name,
      athlete.goal,
      athlete.wearableSync.recoveryScore,
      athlete.wearableSync.acwrRatio,
      athlete.workoutCompliancePercent,
      athlete.nutritionCompliancePercent,
      athlete.riskScore,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    downloadFile('apexos-athletes-report.csv', csv, 'text/csv;charset=utf-8;');
  };

  const handleExportExecutiveReport = () => {
    const report = [
      `# ${brand.productName} Executive Report`,
      '',
      `- Organization: ${brand.organizationName}`,
      `- Tagline: ${brand.tagline}`,
      `- Role View: ${roleView}`,
      `- Focus Athlete: ${selectedAthlete.name}`,
      `- Alerts Pending: ${aiRecommendations.filter((item) => !item.applied).length}`,
      '',
      '## Team Snapshot',
      ...athletes.map(
        (athlete) =>
          `- ${athlete.name}: Recovery ${athlete.wearableSync.recoveryScore}%, ACWR ${athlete.wearableSync.acwrRatio}, Workout ${athlete.workoutCompliancePercent}%, Nutrition ${athlete.nutritionCompliancePercent}%`
      ),
      '',
      '## Active Alerts',
      ...aiRecommendations.map(
        (alert) =>
          `- ${alert.athleteName} | ${alert.category} | ${alert.suggestedAction} | Applied: ${alert.applied ? 'Yes' : 'No'}`
      ),
    ].join('\n');
    downloadFile('apexos-executive-report.md', report, 'text/markdown;charset=utf-8;');
  };

  const shouldShowBiometricCalibrator = ['coach', 'biometrics', 'profile360', 'mobile_sim'].includes(activeTab);

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased ${isFa ? 'font-vazir' : ''}`}>
      <a href="#main-content" className="skip-link">
        {isFa ? 'پرش به محتوای اصلی' : 'Skip to main content'}
      </a>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        alertCount={aiRecommendations.filter((item) => !item.reviewed).length}
        lang={lang}
        brand={brand}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TopHeader
          searchTerm={globalSearchTerm}
          setSearchTerm={setGlobalSearchTerm}
          aiRecommendations={aiRecommendations}
          selectedAthleteName={selectedAthlete.name}
          lastSynced={selectedAthlete.wearableSync.lastSynced}
          activeTab={activeTab}
          roleView={roleView}
          lang={lang}
          brand={brand}
          setLang={setLang}
          setRoleView={setRoleView}
          onReviewRecommendation={handleReviewAIRecommendation}
          onReviewAllRecommendations={handleReviewAllAIRecommendations}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenBrandStudio={() => setIsBrandStudioOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          isMobileSidebarOpen={isMobileSidebarOpen}
        />

        <CommandPalette
          open={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          lang={lang}
          onNavigateTab={handleNavigateTab}
          onSetRoleView={setRoleView}
          onExportExecutiveReport={handleExportExecutiveReport}
          onExportAthletesCsv={handleExportAthletesCsv}
          onOpenBrandStudio={() => setIsBrandStudioOpen(true)}
        />

        <BrandStudio
          open={isBrandStudioOpen}
          onClose={() => setIsBrandStudioOpen(false)}
          brand={brand}
          onChange={setBrand}
          lang={lang}
        />

        <main id="main-content" className="flex-1 p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto" aria-live="polite">
          {shouldShowBiometricCalibrator && (
            <Suspense fallback={<RouteLoading lang={lang} />}>
              <BiometricCalibrator athlete={selectedAthlete} onUpdateAthlete={handleUpdateAthlete} lang={lang} />
            </Suspense>
          )}

          <Suspense fallback={<RouteLoading lang={lang} />}>
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <DashboardPage
                    athletes={athletes}
                    selectedAthlete={selectedAthlete}
                    program={program}
                    aiRecommendations={aiRecommendations}
                    roleView={roleView}
                    brand={brand}
                    lang={lang}
                    onSelectAthlete={setSelectedAthlete}
                    onApplyAIRecommendation={handleApplyAIRecommendation}
                    onNavigateTab={handleNavigateTab}
                    onSetRoleView={setRoleView}
                    onAddAthlete={handleAddAthlete}
                    onAssignQuickPlan={handleAssignQuickPlan}
                    onExportExecutiveReport={handleExportExecutiveReport}
                    onExportAthletesCsv={handleExportAthletesCsv}
                  />
                }
              />
              <Route
                path="/athletes"
                element={
                  <AthletesPage
                    athletes={athletes}
                    selectedAthlete={selectedAthlete}
                    onSelectAthlete={setSelectedAthlete}
                    onAddAthlete={handleAddAthlete}
                    onNavigateTab={handleNavigateTab}
                    lang={lang}
                  />
                }
              />
              <Route path="/medical" element={<MedicalPage selectedAthlete={selectedAthlete} onUpdateAthlete={handleUpdateAthlete} lang={lang} />} />
              <Route path="/motion-analysis" element={<MotionPage selectedAthlete={selectedAthlete} lang={lang} />} />
              <Route
                path="/workouts"
                element={
                  <WorkoutsPage
                    program={program}
                    exerciseDb={exerciseDb}
                    selectedAthlete={selectedAthlete}
                    onUpdateProgram={handleUpdateProgram}
                    lang={lang}
                  />
                }
              />
              <Route path="/nutrition" element={<NutritionPage selectedAthlete={selectedAthlete} onUpdateAthlete={handleUpdateAthlete} lang={lang} />} />
              <Route path="/profile-360" element={<Profile360Page athlete={selectedAthlete} onUpdateAthlete={handleUpdateAthlete} lang={lang} />} />
              <Route
                path="/athlete-dashboard"
                element={
                  <AthleteDashboardPage
                    athlete={selectedAthlete}
                    program={program}
                    onUpdateAthlete={handleUpdateAthlete}
                    onUpdateProgram={handleUpdateProgram}
                    lang={lang}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="border-t border-slate-800/80 bg-slate-900/60 py-4 px-6 text-center text-xs text-slate-400 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <strong>{isFa ? 'معماری داشبورد اپکس' : 'ApexOS Dashboard Architecture'}</strong> •{' '}
              {isFa ? 'نسخه مسیرمحور + نمای نقش‌محور' : 'Route-based + role-based workspace'}
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-300">
              <span>{isFa ? 'بهینه‌سازی ناوبری و موبایل' : 'Improved navigation & mobile UX'}</span>
              <span>{isFa ? 'بارگذاری تنبل ماژول‌ها' : 'Lazy-loaded modules'}</span>
              <span>{isFa ? 'قابل بوکمارک' : 'Bookmarkable views'}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;

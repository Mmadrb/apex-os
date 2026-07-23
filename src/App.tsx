import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { StatCards } from './components/StatCards';
import { ActiveAlerts } from './components/ActiveAlerts';
import { StaminaChart } from './components/StaminaChart';
import { RosterGrid } from './components/RosterGrid';
import { BiometricCalibrator } from './components/BiometricCalibrator';
import { CoachDashboard } from './components/CoachDashboard';
import { WorkoutBuilder } from './components/WorkoutBuilder';
import { NutritionStudio } from './components/NutritionStudio';
import { VisionKinematics } from './components/VisionKinematics';
import { BiometricsLab } from './components/BiometricsLab';
import { Athlete360Profile } from './components/Athlete360Profile';
import { AthleteMobileSim } from './components/AthleteMobileSim';

import { 
  MOCK_ATHLETES, 
  EXERCISE_DATABASE, 
  MOCK_PROGRAM, 
  MOCK_AI_RECOMMENDATIONS 
} from './data/mockData';

import {
  MOCK_ATHLETES_FA,
  EXERCISE_DATABASE_FA,
  MOCK_PROGRAM_FA,
  MOCK_AI_RECOMMENDATIONS_FA
} from './data/mockDataFa';

import type { AthleteProfile, WorkoutProgram, AIRecommendation } from './types';

export function App() {
  const [lang, setLang] = useState<'en' | 'fa'>('fa'); // Default Persian
  const [activeTab, setActiveTab] = useState<string>('coach');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState<string>('');

  const isFa = lang === 'fa';

  const initialAthletes = isFa ? MOCK_ATHLETES_FA : MOCK_ATHLETES;
  const exerciseDb = isFa ? EXERCISE_DATABASE_FA : EXERCISE_DATABASE;
  const initialProgram = isFa ? MOCK_PROGRAM_FA : MOCK_PROGRAM;
  const initialAiRecs = isFa ? MOCK_AI_RECOMMENDATIONS_FA : MOCK_AI_RECOMMENDATIONS;

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
    setAiRecommendations(isFa ? MOCK_AI_RECOMMENDATIONS_FA : MOCK_AI_RECOMMENDATIONS);
  }, [lang]);

  const handleUpdateAthlete = (updated: AthleteProfile) => {
    setSelectedAthlete(updated);
    setAthletes(prev => prev.map(a => (a.id === updated.id ? updated : a)));
  };

  const handleApplyAIRecommendation = (recId: string) => {
    setAiRecommendations(prev =>
      prev.map(r => (r.id === recId ? { ...r, applied: true } : r))
    );
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
        { name: isFa ? 'پروتئین وی' : 'Whey Protein', dosage: isFa ? '۳۰ گرم' : '30g', timing: isFa ? 'بعد تمرین' : 'Post-workout', status: 'Pending' },
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
              { exerciseId: 'ex-1', exerciseName: isFa ? 'پرس بالا سینه هالتر' : 'Barbell Incline Press', notes: isFa ? 'قدرت پایه' : 'Foundational strength', restSeconds: 120, sets: [
                { setNumber: 1, reps: 8, targetRpe: 7, weightKg: 60, completed: false },
                { setNumber: 2, reps: 8, targetRpe: 8, weightKg: 65, completed: false },
                { setNumber: 3, reps: 6, targetRpe: 8.5, weightKg: 70, completed: false },
              ] },
              { exerciseId: 'ex-5', exerciseName: isFa ? 'نشر جانب نشسته' : 'Seated Lateral Raises', notes: isFa ? 'کنترل کامل تمپو' : 'Controlled tempo', restSeconds: 75, sets: [
                { setNumber: 1, reps: 15, targetRpe: 7, weightKg: 8, completed: false },
                { setNumber: 2, reps: 15, targetRpe: 8, weightKg: 8, completed: false },
                { setNumber: 3, reps: 12, targetRpe: 8.5, weightKg: 10, completed: false },
              ] },
            ],
          },
          {
            dayName: isFa ? 'روز ۲: پایین‌تنه' : 'Day 2: Lower Body',
            focus: isFa ? 'چهارسر، همسترینگ و سرینی' : 'Quads, hamstrings, glutes',
            isRestDay: false,
            exercises: [
              { exerciseId: 'ex-2', exerciseName: isFa ? 'اسکوات پا هالتر از پشت' : 'Barbell Back Squat', notes: isFa ? 'فشار پیشرونده' : 'Progressive loading', restSeconds: 150, sets: [
                { setNumber: 1, reps: 6, targetRpe: 7, weightKg: 80, completed: false },
                { setNumber: 2, reps: 6, targetRpe: 8, weightKg: 85, completed: false },
                { setNumber: 3, reps: 5, targetRpe: 8.5, weightKg: 90, completed: false },
              ] },
              { exerciseId: 'ex-4', exerciseName: isFa ? 'ددلیفت رومانیایی' : 'Romanian Deadlift (RDL)', notes: isFa ? 'تمرکز بر زنجیره خلفی' : 'Posterior chain focus', restSeconds: 120, sets: [
                { setNumber: 1, reps: 10, targetRpe: 7, weightKg: 70, completed: false },
                { setNumber: 2, reps: 10, targetRpe: 8, weightKg: 75, completed: false },
                { setNumber: 3, reps: 8, targetRpe: 8.5, weightKg: 80, completed: false },
              ] },
            ],
          },
          {
            dayName: isFa ? 'روز ۳: کشش و کشش‌پول' : 'Day 3: Pull Strength',
            focus: isFa ? 'پشت، بازو و گیرش' : 'Back, biceps, grip',
            isRestDay: false,
            exercises: [
              { exerciseId: 'ex-3', exerciseName: isFa ? 'زیربغل تی بار سینه تکیه‌گاه' : 'Chest Supported T-Bar Row', notes: isFa ? 'مکث در اوج' : 'Pause at peak', restSeconds: 120, sets: [
                { setNumber: 1, reps: 10, targetRpe: 7, weightKg: 50, completed: false },
                { setNumber: 2, reps: 10, targetRpe: 8, weightKg: 55, completed: false },
                { setNumber: 3, reps: 8, targetRpe: 8.5, weightKg: 60, completed: false },
              ] },
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
              { exerciseId: 'ex-11', exerciseName: isFa ? 'طناب‌زدن تناوبی هوازی' : 'Jump Rope Aerobic Intervals', notes: isFa ? 'ریتم ثابت' : 'Steady rhythm', restSeconds: 45, sets: [
                { setNumber: 1, reps: 10, targetRpe: 6, weightKg: 0, completed: false },
                { setNumber: 2, reps: 10, targetRpe: 6.5, weightKg: 0, completed: false },
                { setNumber: 3, reps: 8, targetRpe: 7, weightKg: 0, completed: false },
              ] },
            ],
          },
          {
            dayName: isFa ? 'روز ۲: HIIT و اسپرینت' : 'Day 2: HIIT Sprint',
            focus: isFa ? 'توان بی‌هوازی' : 'Anaerobic power',
            isRestDay: false,
            exercises: [
              { exerciseId: 'ex-15', exerciseName: isFa ? 'تکرارهای دو سرعتی تناوبی' : 'Sprint Interval Repeats', notes: isFa ? 'شدت بالا' : 'High intensity', restSeconds: 60, sets: [
                { setNumber: 1, reps: 8, targetRpe: 7.5, weightKg: 0, completed: false },
                { setNumber: 2, reps: 8, targetRpe: 8, weightKg: 0, completed: false },
                { setNumber: 3, reps: 6, targetRpe: 8.5, weightKg: 0, completed: false },
              ] },
            ],
          },
          {
            dayName: isFa ? 'روز ۳: فول‌بادی متابولیک' : 'Day 3: Full-Body Metabolic',
            focus: isFa ? 'کالری‌سوزی و استقامت' : 'Calorie burn and endurance',
            isRestDay: false,
            exercises: [
              { exerciseId: 'ex-30', exerciseName: isFa ? 'خرس‌روی + لانج معکوس' : 'Bear Crawl + Reverse Lunge Flow', notes: isFa ? 'کنترل مرکزی بدن' : 'Core control', restSeconds: 60, sets: [
                { setNumber: 1, reps: 12, targetRpe: 7, weightKg: 0, completed: false },
                { setNumber: 2, reps: 12, targetRpe: 7.5, weightKg: 0, completed: false },
                { setNumber: 3, reps: 10, targetRpe: 8, weightKg: 0, completed: false },
              ] },
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
              { exerciseId: 'ex-20', exerciseName: isFa ? 'فلوی موبیلیتی با کش مقاومتی' : 'Resistance Band Mobility Flow', notes: isFa ? 'دامنه کنترل‌شده' : 'Controlled mobility', restSeconds: 30, sets: [
                { setNumber: 1, reps: 45, targetRpe: 4, weightKg: 0, completed: false },
                { setNumber: 2, reps: 45, targetRpe: 4, weightKg: 0, completed: false },
                { setNumber: 3, reps: 60, targetRpe: 5, weightKg: 0, completed: false },
              ] },
            ],
          },
          {
            dayName: isFa ? 'روز ۲: کشش پایین‌تنه' : 'Day 2: Lower-Body Stretching',
            focus: isFa ? 'فلکسور ران و ستون فقرات' : 'Hip flexors and spine',
            isRestDay: false,
            exercises: [
              { exerciseId: 'ex-21', exerciseName: isFa ? 'کشش زانوزده فلکسور ران' : 'Kneeling Hip Flexor Stretch', notes: isFa ? 'بازدم طولانی' : 'Long exhales', restSeconds: 20, sets: [
                { setNumber: 1, reps: 45, targetRpe: 4, weightKg: 0, completed: false },
                { setNumber: 2, reps: 45, targetRpe: 4, weightKg: 0, completed: false },
                { setNumber: 3, reps: 60, targetRpe: 4.5, weightKg: 0, completed: false },
              ] },
            ],
          },
          {
            dayName: isFa ? 'روز ۳: یوگا و تنفس' : 'Day 3: Yoga & Breathwork',
            focus: isFa ? 'یوگا و آرام‌سازی' : 'Yoga and recovery',
            isRestDay: false,
            exercises: [
              { exerciseId: 'ex-22', exerciseName: isFa ? 'فلوی موبیلیتی سلام بر خورشید' : 'Sun Salutation Mobility Flow', notes: isFa ? 'حرکت همراه با تنفس' : 'Move with breath', restSeconds: 20, sets: [
                { setNumber: 1, reps: 45, targetRpe: 4, weightKg: 0, completed: false },
                { setNumber: 2, reps: 45, targetRpe: 4.5, weightKg: 0, completed: false },
                { setNumber: 3, reps: 60, targetRpe: 5, weightKg: 0, completed: false },
              ] },
            ],
          },
        ],
      },
    };

    setProgram(templates[templateId]);
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased ${isFa ? 'font-vazir' : ''}`}>
      
      {/* 1. Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        alertCount={aiRecommendations.filter(r => !r.applied).length}
        lang={lang}
      />

      {/* 2. Main Workspace Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header */}
        <TopHeader
          searchTerm={globalSearchTerm}
          setSearchTerm={setGlobalSearchTerm}
          aiRecommendations={aiRecommendations}
          selectedAthleteName={selectedAthlete.name}
          lang={lang}
          setLang={setLang}
        />

        {/* Main Content Dashboard Canvas Area */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Always Present Live Biometric Calibrator */}
          <BiometricCalibrator
            athlete={selectedAthlete}
            onUpdateAthlete={handleUpdateAthlete}
            lang={lang}
          />

          {/* Tab 1: Main Overview Dashboard (Combines Stat Cards, Active Alerts & Stamina Chart) */}
          {activeTab === 'coach' && (
            <div className="space-y-6">
              
              {/* Top Row: Stat Cards Metrics */}
              <StatCards
                avgHeartRateBpm={58}
                totalSprintKm={14.8}
                acwrStrainRatio={selectedAthlete.wearableSync.acwrRatio}
                teamReadinessPercent={88}
                lang={lang}
              />

              {/* Grid: Active Alerts & Stamina Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Active Warnings & Injury Alerts Box (5 cols) */}
                <div className="lg:col-span-5">
                  <ActiveAlerts
                    alerts={aiRecommendations}
                    onApplyAlert={handleApplyAIRecommendation}
                    lang={lang}
                  />
                </div>

                {/* Stamina & Performance Area Chart (7 cols) */}
                <div className="lg:col-span-7">
                  <StaminaChart lang={lang} />
                </div>

              </div>

              {/* Full Roster Grid & Coach Triage Details */}
              <CoachDashboard
                athletes={athletes}
                selectedAthlete={selectedAthlete}
                onSelectAthlete={setSelectedAthlete}
                aiRecommendations={aiRecommendations}
                onApplyAIRecommendation={handleApplyAIRecommendation}
                onNavigateTab={setActiveTab}
                onAddAthlete={handleAddAthlete}
                onAssignQuickPlan={handleAssignQuickPlan}
                lang={lang}
              />
            </div>
          )}

          {/* Tab 2: Team Roster Module */}
          {activeTab === 'roster' && (
            <RosterGrid
              athletes={athletes}
              selectedAthlete={selectedAthlete}
              onSelectAthlete={setSelectedAthlete}
              onAddAthlete={handleAddAthlete}
              onNavigateTab={setActiveTab}
              lang={lang}
            />
          )}

          {/* Tab 3: Biometrics & Telemetry */}
          {activeTab === 'biometrics' && (
            <BiometricsLab selectedAthlete={selectedAthlete} onUpdateAthlete={handleUpdateAthlete} lang={lang} />
          )}

          {/* Tab 4: Motion Analysis Kinematics */}
          {activeTab === 'vision' && (
            <VisionKinematics selectedAthlete={selectedAthlete} lang={lang} />
          )}

          {/* Tab 5: Workout Builder */}
          {activeTab === 'builder' && (
            <WorkoutBuilder
              program={program}
              exerciseDb={exerciseDb}
              selectedAthlete={selectedAthlete}
              onUpdateProgram={handleUpdateProgram}
              lang={lang}
            />
          )}

          {/* Tab 6: Nutrition Studio */}
          {activeTab === 'nutrition' && (
            <NutritionStudio
              selectedAthlete={selectedAthlete}
              onUpdateAthlete={handleUpdateAthlete}
              lang={lang}
            />
          )}

          {/* Tab 7: 360 Athlete Profile */}
          {activeTab === 'profile360' && (
            <Athlete360Profile
              athlete={selectedAthlete}
              onUpdateAthlete={handleUpdateAthlete}
              lang={lang}
            />
          )}

          {/* Tab 8: Athlete Mobile Sim */}
          {activeTab === 'mobile_sim' && (
            <AthleteMobileSim
              athlete={selectedAthlete}
              program={program}
              onUpdateAthlete={handleUpdateAthlete}
              onUpdateProgram={handleUpdateProgram}
              lang={lang}
            />
          )}

        </main>

        {/* Global Dashboard Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-900/60 py-4 px-6 text-center text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <strong>
                {isFa ? 'معماری داشبورد مربیگری اپکس (ApexOS)' : 'ApexOS Sports Coaching OS Architecture'}
              </strong> • {isFa ? 'سیستم‌عامل عملکرد ورزشی و مدیریت هوشمند ورزشکاران' : 'AI Operating System for Human Performance'}
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-[11px]">
              <span>{isFa ? 'رابط کاربری ری‌اکت و تیلویند' : 'React & Tailwind CSS'}</span>
              <span>{isFa ? 'نمودارهای Recharts زنده' : 'Recharts Analytics'}</span>
              <span>{isFa ? 'کاملاً رسپانسیو' : 'Fully Responsive'}</span>
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}

export default App;

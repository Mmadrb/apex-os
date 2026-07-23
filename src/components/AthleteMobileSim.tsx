import React, { useEffect, useMemo, useState } from 'react';
import type { AthleteProfile, WorkoutProgram } from '../types';
import {
  CheckCircle2,
  Send,
  UserPlus,
  Smartphone,
  Utensils,
  Flame,
} from 'lucide-react';

interface AthleteMobileSimProps {
  athlete: AthleteProfile;
  program: WorkoutProgram;
  onUpdateAthlete?: (updated: AthleteProfile) => void;
  onUpdateProgram?: (updated: WorkoutProgram) => void;
  lang?: 'en' | 'fa';
}

type MobileTab = 'account' | 'dashboard' | 'messages' | 'personal' | 'nutrition';

interface AthleteAccountRecord {
  id: string;
  fullName: string;
  email: string;
  sport: string;
  goal: string;
  plan: string;
  createdAt: string;
}

interface AccountFormState {
  fullName: string;
  email: string;
  password: string;
  sport: string;
  goal: string;
  plan: string;
}

const ACCOUNT_STORAGE_KEY = 'apexos-athlete-self-onboarding';

export const AthleteMobileSim: React.FC<AthleteMobileSimProps> = ({
  athlete,
  program,
  onUpdateAthlete,
  onUpdateProgram,
  lang = 'fa',
}) => {
  const isFa = lang === 'fa';
  const [mobileTab, setMobileTab] = useState<MobileTab>('dashboard');
  const [chatMessages, setChatMessages] = useState<{ sender: 'coach' | 'athlete'; text: string }[]>([
    {
      sender: 'coach',
      text: isFa
        ? `سلام ${athlete.name}! برنامه امروز شما توسط ${athlete.coachName} آماده شده است. بعد از هر ست آن را تیک بزن.`
        : `Hi ${athlete.name}! Your plan from ${athlete.coachName} is ready. Check off each completed set as you go.`,
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [accountForm, setAccountForm] = useState<AccountFormState>({
    fullName: '',
    email: '',
    password: '',
    sport: '',
    goal: '',
    plan: isFa ? 'پلن مربی محور Elite' : 'Coach-Led Elite Plan',
  });
  const [accountNotice, setAccountNotice] = useState('');
  const [createdAccounts, setCreatedAccounts] = useState<AthleteAccountRecord[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(ACCOUNT_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AthleteAccountRecord[]) : [];
    } catch {
      return [];
    }
  });
  const [personalLog, setPersonalLog] = useState({
    weightKg: athlete.weightKg,
    sleepHours: athlete.wearableSync.sleepHours,
    soreness: athlete.biofeedback.muscleSoreness,
    hydrationOz: athlete.hydrationOzLogged,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(createdAccounts));
  }, [createdAccounts]);

  useEffect(() => {
    setChatMessages([
      {
        sender: 'coach',
        text: isFa
          ? `سلام ${athlete.name}! برنامه امروز شما توسط ${athlete.coachName} آماده شده است. بعد از هر ست آن را تیک بزن.`
          : `Hi ${athlete.name}! Your plan from ${athlete.coachName} is ready. Check off each completed set as you go.`,
      },
    ]);
    setPersonalLog({
      weightKg: athlete.weightKg,
      sleepHours: athlete.wearableSync.sleepHours,
      soreness: athlete.biofeedback.muscleSoreness,
      hydrationOz: athlete.hydrationOzLogged,
    });
  }, [athlete, isFa]);

  const workoutStats = useMemo(() => {
    const totalSets = program.days.reduce((dayAcc, day) => dayAcc + day.exercises.reduce((exerciseAcc, exercise) => exerciseAcc + exercise.sets.length, 0), 0);
    const completedSets = program.days.reduce(
      (dayAcc, day) => dayAcc + day.exercises.reduce((exerciseAcc, exercise) => exerciseAcc + exercise.sets.filter((set) => set.completed).length, 0),
      0
    );
    const totalVolume = program.days.reduce(
      (dayAcc, day) =>
        dayAcc +
        day.exercises.reduce(
          (exerciseAcc, exercise) => exerciseAcc + exercise.sets.reduce((setAcc, set) => setAcc + set.weightKg * set.reps, 0),
          0
        ),
      0
    );
    const progressPercent = totalSets === 0 ? 0 : Math.round((completedSets / totalSets) * 100);
    const caloriesBurned = Math.round((totalVolume / 1000) * 18 + completedSets * 14);

    return { totalSets, completedSets, totalVolume, progressPercent, caloriesBurned };
  }, [program.days]);

  const mealPlan = isFa
    ? [
        { name: 'صبحانه عملکردی', calories: 620, detail: 'اوتمیل + ماست یونانی + موز + وی' },
        { name: 'ناهار ریکاوری', calories: 740, detail: 'مرغ گریل + برنج + سبزیجات + روغن زیتون' },
        { name: 'شام کنترل‌شده', calories: 610, detail: 'سالمون + سیب‌زمینی شیرین + سالاد' },
        { name: 'میان‌وعده', calories: 280, detail: 'اسکایر + بادام + توت' },
      ]
    : [
        { name: 'Performance Breakfast', calories: 620, detail: 'Oats + Greek yogurt + banana + whey' },
        { name: 'Recovery Lunch', calories: 740, detail: 'Grilled chicken + rice + vegetables + olive oil' },
        { name: 'Controlled Dinner', calories: 610, detail: 'Salmon + sweet potato + salad' },
        { name: 'Snack', calories: 280, detail: 'Skyr + almonds + berries' },
      ];

  const onboardingPlanOptions = isFa
    ? ['پلن مربی محور Elite', 'پلن Performance Pro', 'پلن Longevity Reset']
    : ['Coach-Led Elite Plan', 'Performance Pro Plan', 'Longevity Reset Plan'];

  const handleSendChat = () => {
    if (!inputMsg.trim()) return;
    const newMessages = [...chatMessages, { sender: 'athlete' as const, text: inputMsg }];
    setChatMessages(newMessages);
    setInputMsg('');

    setTimeout(() => {
      setChatMessages([
        ...newMessages,
        {
          sender: 'coach',
          text: isFa
            ? `پیام شما دریافت شد. ${athlete.coachName} وضعیت تمرین و ریکاوری شما را بررسی می‌کند.`
            : `Your message was received. ${athlete.coachName} will review your training and recovery status.`,
        },
      ]);
    }, 700);
  };

  const handleAccountFieldChange = (field: keyof AccountFormState, value: string) => {
    setAccountForm((prev) => ({ ...prev, [field]: value }));
    setAccountNotice('');
  };

  const handleCreateAccount = () => {
    if (!accountForm.fullName.trim() || !accountForm.email.trim() || !accountForm.password.trim()) {
      setAccountNotice(isFa ? 'نام، ایمیل و رمز عبور الزامی است.' : 'Full name, email, and password are required.');
      return;
    }
    if (accountForm.password.length < 8) {
      setAccountNotice(isFa ? 'رمز عبور باید حداقل ۸ کاراکتر باشد.' : 'Password must be at least 8 characters.');
      return;
    }
    const createdAt = new Date().toLocaleString(isFa ? 'fa-IR' : 'en-US');
    setCreatedAccounts((prev) => [
      {
        id: `acct-${Date.now()}`,
        fullName: accountForm.fullName,
        email: accountForm.email,
        sport: accountForm.sport || (isFa ? 'عملکرد عمومی' : 'General performance'),
        goal: accountForm.goal || (isFa ? 'بهبود عملکرد' : 'Improve performance'),
        plan: accountForm.plan,
        createdAt,
      },
      ...prev,
    ].slice(0, 8));
    setAccountForm({ fullName: '', email: '', password: '', sport: '', goal: '', plan: onboardingPlanOptions[0] });
    setAccountNotice(
      isFa ? 'حساب ورزشکار ساخته شد و به صف آنبوردینگ مربی ارسال شد.' : 'Athlete account created and routed into the coach onboarding queue.'
    );
  };

  const handleToggleSet = (dayIndex: number, exerciseIndex: number, setIndex: number) => {
    if (!onUpdateProgram) return;

    const updatedProgram: WorkoutProgram = {
      ...program,
      days: program.days.map((day, currentDayIndex) =>
        currentDayIndex === dayIndex
          ? {
              ...day,
              exercises: day.exercises.map((exercise, currentExerciseIndex) =>
                currentExerciseIndex === exerciseIndex
                  ? {
                      ...exercise,
                      sets: exercise.sets.map((set, currentSetIndex) =>
                        currentSetIndex === setIndex ? { ...set, completed: !set.completed } : set
                      ),
                    }
                  : exercise
              ),
            }
          : day
      ),
    };

    onUpdateProgram(updatedProgram);
  };

  const handleSavePersonalLog = () => {
    if (!onUpdateAthlete) return;
    onUpdateAthlete({
      ...athlete,
      weightKg: personalLog.weightKg,
      hydrationOzLogged: personalLog.hydrationOz,
      wearableSync: {
        ...athlete.wearableSync,
        sleepHours: personalLog.sleepHours,
      },
      biofeedback: {
        ...athlete.biofeedback,
        muscleSoreness: personalLog.soreness,
      },
    });
  };

  return (
    <div className="p-2 sm:p-4 lg:p-8 space-y-6 lg:space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold uppercase tracking-wider">
              {isFa ? 'Athlete Dashboard / Mobile App' : 'Athlete Dashboard / Mobile App'}
            </span>
            <span className="text-xs text-slate-400">{isFa ? 'تمرین، پیام، سلامت و تغذیه در یک نما' : 'Workout, messages, health, and nutrition in one view'}</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            {isFa ? 'داشبورد ورزشکار: برنامه، پیشرفت، سلامت و تغذیه' : 'Athlete Dashboard: plan, progress, health, and nutrition'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isFa
              ? 'ورزشکار می‌تواند برنامه منتخب مربی را ببیند، تمرینات را تیک بزند، پیام بفرستد و شاخص‌های سلامت و تغذیه را ثبت کند.'
              : 'Athletes can view the coach-selected plan, check off workouts, send messages, and log personal health and nutrition progress.'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex-wrap">
          {(['account', 'dashboard', 'messages', 'personal', 'nutrition'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mobileTab === tab ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'account'
                ? isFa
                  ? 'ایجاد حساب'
                  : 'Create Account'
                : tab === 'dashboard'
                  ? isFa
                    ? 'خانه ورزشکار'
                    : 'Home'
                  : tab === 'messages'
                    ? isFa
                      ? 'پیام‌ها'
                      : 'Messages'
                    : tab === 'personal'
                      ? isFa
                        ? 'شخصی و سلامت'
                        : 'Personal'
                      : isFa
                        ? 'تغذیه'
                        : 'Nutrition'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4" />
            {isFa ? 'کالری سوزانده شده' : 'Calories Burned'}
          </div>
          <div className="text-3xl font-black text-white mt-2">{workoutStats.caloriesBurned}</div>
          <p className="text-xs text-slate-400 mt-2">{isFa ? 'براساس حجم تمرین و ست‌های تکمیل‌شده' : 'Estimated from training volume and completed sets'}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            {isFa ? 'پیشرفت برنامه' : 'Plan Progress'}
          </div>
          <div className="text-3xl font-black text-white mt-2">{workoutStats.progressPercent}%</div>
          <p className="text-xs text-slate-400 mt-2">{workoutStats.completedSets}/{workoutStats.totalSets} {isFa ? 'ست کامل شد' : 'sets completed'}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Utensils className="w-4 h-4" />
            {isFa ? 'پیشرفت تغذیه' : 'Nutrition Progress'}
          </div>
          <div className="text-3xl font-black text-white mt-2">{Math.round((athlete.caloriesLogged / athlete.caloriesTarget) * 100)}%</div>
          <p className="text-xs text-slate-400 mt-2">{athlete.caloriesLogged}/{athlete.caloriesTarget} kcal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.05fr,0.95fr] gap-6 items-start">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-5">
          {mobileTab === 'account' && (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-cyan-400 text-xs font-bold uppercase tracking-[0.2em]">{isFa ? 'Self Onboarding' : 'Self Onboarding'}</div>
                  <h3 className="text-xl font-black text-white mt-1">{isFa ? 'ایجاد حساب ورزشکار' : 'Create athlete account'}</h3>
                  <p className="text-sm text-slate-400 mt-2">
                    {isFa ? 'ورزشکار می‌تواند پیش از شروع همکاری، حساب خود را ایجاد و وارد صف مربی شود.' : 'Athletes can create an account and enter the coach onboarding flow before formal kickoff.'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 text-cyan-300" />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
                <input type="text" value={accountForm.fullName} onChange={(e) => handleAccountFieldChange('fullName', e.target.value)} placeholder={isFa ? 'نام و نام خانوادگی' : 'Full name'} className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500" />
                <input type="email" value={accountForm.email} onChange={(e) => handleAccountFieldChange('email', e.target.value)} placeholder={isFa ? 'ایمیل' : 'Email'} className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500" />
                <input type="password" value={accountForm.password} onChange={(e) => handleAccountFieldChange('password', e.target.value)} placeholder={isFa ? 'رمز عبور' : 'Password'} className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500" />
                <input type="text" value={accountForm.sport} onChange={(e) => handleAccountFieldChange('sport', e.target.value)} placeholder={isFa ? 'رشته یا سبک تمرین' : 'Sport or training style'} className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500" />
                <input type="text" value={accountForm.goal} onChange={(e) => handleAccountFieldChange('goal', e.target.value)} placeholder={isFa ? 'هدف اصلی' : 'Primary goal'} className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500" />
                <select value={accountForm.plan} onChange={(e) => handleAccountFieldChange('plan', e.target.value)} className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500">
                  {onboardingPlanOptions.map((plan) => (
                    <option key={plan} value={plan}>{plan}</option>
                  ))}
                </select>

                {accountNotice ? (
                  <div className={`rounded-xl border px-3 py-2 text-[11px] ${accountNotice.includes('ساخته') || accountNotice.includes('created') ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-amber-500/30 bg-amber-500/10 text-amber-200'}`}>
                    {accountNotice}
                  </div>
                ) : null}

                <button onClick={handleCreateAccount} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20">
                  {isFa ? 'ساخت حساب ورزشکار' : 'Create athlete account'}
                </button>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">{isFa ? 'حساب‌های ساخته شده' : 'Created accounts'}</h4>
                  <span className="text-[11px] text-slate-500">{createdAccounts.length}</span>
                </div>
                {createdAccounts.length === 0 ? (
                  <div className="text-sm text-slate-500">{isFa ? 'هنوز حسابی ثبت نشده است.' : 'No accounts have been created yet.'}</div>
                ) : (
                  createdAccounts.slice(0, 3).map((account) => (
                    <div key={account.id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                      <div className="font-bold text-white text-sm">{account.fullName}</div>
                      <div className="text-xs text-slate-400 mt-1">{account.email}</div>
                      <div className="flex flex-wrap gap-2 mt-3 text-[11px] text-slate-400">
                        <span className="px-2 py-1 rounded-lg bg-slate-800">{account.sport}</span>
                        <span className="px-2 py-1 rounded-lg bg-slate-800">{account.goal}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {mobileTab === 'dashboard' && (
            <>
              <div>
                <div className="text-cyan-400 text-xs font-bold uppercase tracking-[0.2em]">{isFa ? 'Athlete Home' : 'Athlete Home'}</div>
                <h3 className="text-xl font-black text-white mt-1">{isFa ? 'برنامه منتخب مربی و وضعیت اجرای تمرین' : 'Coach-selected workout plan and execution status'}</h3>
                <p className="text-sm text-slate-400 mt-2">{program.title}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-[11px] text-slate-500 uppercase font-bold">{isFa ? 'درصد پیشرفت' : 'Progress'}</div>
                  <div className="text-2xl font-black text-white mt-2">{workoutStats.progressPercent}%</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-[11px] text-slate-500 uppercase font-bold">{isFa ? 'کالری مصرف‌شده' : 'Calories Burned'}</div>
                  <div className="text-2xl font-black text-amber-300 mt-2">{workoutStats.caloriesBurned}</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-[11px] text-slate-500 uppercase font-bold">{isFa ? 'حجم تمرین' : 'Training Volume'}</div>
                  <div className="text-2xl font-black text-cyan-300 mt-2">{Math.round(workoutStats.totalVolume).toLocaleString()}</div>
                </div>
              </div>

              <div className="space-y-4">
                {program.days.slice(0, 2).map((day, dayIndex) => (
                  <div key={day.dayName} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                    <div>
                      <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider">{day.dayName}</div>
                      <h4 className="text-sm font-black text-white mt-1">{day.focus}</h4>
                    </div>
                    {day.exercises.map((exercise, exerciseIndex) => (
                      <div key={`${day.dayName}-${exercise.exerciseId}`} className="rounded-xl border border-slate-800 bg-slate-900 p-3 space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-bold text-white text-sm">{exercise.exerciseName}</div>
                            <div className="text-[11px] text-slate-400 mt-1">{exercise.notes}</div>
                          </div>
                          <span className="text-[10px] text-slate-500">{exercise.restSeconds}s</span>
                        </div>
                        <div className="space-y-2">
                          {exercise.sets.map((set, setIndex) => (
                            <div key={`${exercise.exerciseId}-${set.setNumber}`} className="flex items-center justify-between text-xs bg-slate-950 p-2 rounded-xl border border-slate-800">
                              <span className="font-bold text-slate-400">{isFa ? `ست ${set.setNumber}` : `Set ${set.setNumber}`}</span>
                              <span className="font-bold text-cyan-300">{set.weightKg} kg</span>
                              <span className="text-slate-300">{set.reps} {isFa ? 'تکرار' : 'reps'}</span>
                              <button onClick={() => handleToggleSet(dayIndex, exerciseIndex, setIndex)} className={`p-1 rounded ${set.completed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}

          {mobileTab === 'messages' && (
            <>
              <div>
                <div className="text-cyan-400 text-xs font-bold uppercase tracking-[0.2em]">{isFa ? 'Messaging' : 'Messaging'}</div>
                <h3 className="text-xl font-black text-white mt-1">{isFa ? 'پیام با مربی' : 'Coach messaging'}</h3>
                <p className="text-sm text-slate-400 mt-2">{isFa ? 'ارسال پیام، گزارش درد یا درخواست تغییر برنامه.' : 'Send updates, report pain, or request program changes.'}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 h-[480px] flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                  {chatMessages.map((message, index) => (
                    <div key={`${message.sender}-${index}`} className={`p-3 rounded-2xl max-w-[85%] ${message.sender === 'coach' ? 'bg-cyan-950/60 border border-cyan-800/50 text-cyan-100 self-start' : 'bg-blue-600 text-white self-end ml-auto'}`}>
                      {message.text}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-slate-800 mt-3">
                  <input type="text" placeholder={isFa ? 'پیام برای مربی...' : 'Message your coach...'} value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendChat()} className="flex-1 p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500" />
                  <button onClick={handleSendChat} className="p-2 rounded-xl bg-cyan-500 text-slate-950 font-bold"><Send className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </>
          )}

          {mobileTab === 'personal' && (
            <>
              <div>
                <div className="text-cyan-400 text-xs font-bold uppercase tracking-[0.2em]">{isFa ? 'Personal Section' : 'Personal Section'}</div>
                <h3 className="text-xl font-black text-white mt-1">{isFa ? 'اطلاعات سلامت و ثبت شاخص‌های شخصی' : 'Health information and personal metric logging'}</h3>
                <p className="text-sm text-slate-400 mt-2">{isFa ? 'مشاهده جزئیات سلامت و ثبت وزن، خواب، کوفتگی و آب مصرفی.' : 'Review detailed health data and log weight, sleep, soreness, and hydration.'}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                  <div className="text-[11px] text-slate-500 uppercase font-bold">{isFa ? 'اطلاعات فردی' : 'Personal info'}</div>
                  <div className="text-sm text-white">{athlete.age} {isFa ? 'ساله' : 'years old'} • {athlete.gender}</div>
                  <div className="text-sm text-slate-400">{athlete.goal}</div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                  <div className="text-[11px] text-slate-500 uppercase font-bold">{isFa ? 'سلامت و مجوز' : 'Health status'}</div>
                  <div className="text-sm text-white">{athlete.healthProfile?.medicalClearance ?? (isFa ? 'مجاز برای تمرین' : 'Cleared for training')}</div>
                  <div className="text-sm text-slate-400">{athlete.healthProfile?.emergencyContact ?? (isFa ? 'تماس اضطراری ثبت نشده' : 'No emergency contact logged')}</div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">{isFa ? 'ثبت شاخص‌های شخصی' : 'Log personal metrics'}</h4>
                  <button onClick={handleSavePersonalLog} className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold">{isFa ? 'ذخیره' : 'Save'}</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="number" step="0.1" value={personalLog.weightKg} onChange={(e) => setPersonalLog((prev) => ({ ...prev, weightKg: Number(e.target.value) }))} placeholder={isFa ? 'وزن' : 'Weight'} className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500" />
                  <input type="number" step="0.1" value={personalLog.sleepHours} onChange={(e) => setPersonalLog((prev) => ({ ...prev, sleepHours: Number(e.target.value) }))} placeholder={isFa ? 'ساعات خواب' : 'Sleep hours'} className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500" />
                  <input type="number" value={personalLog.soreness} onChange={(e) => setPersonalLog((prev) => ({ ...prev, soreness: Number(e.target.value) }))} placeholder={isFa ? 'کوفتگی' : 'Soreness'} className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500" />
                  <input type="number" value={personalLog.hydrationOz} onChange={(e) => setPersonalLog((prev) => ({ ...prev, hydrationOz: Number(e.target.value) }))} placeholder={isFa ? 'آب مصرفی' : 'Hydration'} className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500" />
                </div>
              </div>
            </>
          )}

          {mobileTab === 'nutrition' && (
            <>
              <div>
                <div className="text-cyan-400 text-xs font-bold uppercase tracking-[0.2em]">{isFa ? 'Nutrition Section' : 'Nutrition Section'}</div>
                <h3 className="text-xl font-black text-white mt-1">{isFa ? 'پلن تغذیه شخصی‌سازی‌شده و پیگیری پیشرفت' : 'Personalized nutrition plan and progress tracking'}</h3>
                <p className="text-sm text-slate-400 mt-2">{isFa ? 'برنامه غذایی روزانه، کالری‌ها و درصد پیشرفت تغذیه.' : 'Daily meal plan, calories, and nutrition completion progress.'}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                    <div className="text-[11px] text-slate-500 uppercase font-bold">{isFa ? 'کالری' : 'Calories'}</div>
                    <div className="text-2xl font-black text-white mt-2">{athlete.caloriesLogged}/{athlete.caloriesTarget}</div>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                    <div className="text-[11px] text-slate-500 uppercase font-bold">{isFa ? 'پروتئین' : 'Protein'}</div>
                    <div className="text-2xl font-black text-cyan-300 mt-2">{athlete.proteinLoggedG}/{athlete.proteinTargetG}g</div>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                    <div className="text-[11px] text-slate-500 uppercase font-bold">{isFa ? 'آبرسانی' : 'Hydration'}</div>
                    <div className="text-2xl font-black text-blue-300 mt-2">{athlete.hydrationOzLogged}/{athlete.hydrationOzTarget} oz</div>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" style={{ width: `${Math.min(Math.round((athlete.caloriesLogged / athlete.caloriesTarget) * 100), 100)}%` }} />
                </div>
                <div className="space-y-3">
                  {mealPlan.map((meal) => (
                    <div key={meal.name} className="rounded-xl border border-slate-800 bg-slate-900 p-4 flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-white text-sm">{meal.name}</div>
                        <div className="text-xs text-slate-400 mt-1">{meal.detail}</div>
                      </div>
                      <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                        {meal.calories} kcal
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-center">
          <div className="w-[360px] h-[720px] rounded-[44px] bg-slate-950 border-8 border-slate-800 shadow-2xl p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="w-32 h-5 bg-slate-900 rounded-full mx-auto shrink-0 flex items-center justify-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-slate-800" />
              <span className="w-3 h-1 bg-slate-800 rounded" />
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-slate-100 scrollbar-none">
              {mobileTab === 'account' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{isFa ? 'ورود به اکوسیستم ApexOS' : 'Enter the ApexOS Ecosystem'}</div>
                        <h3 className="font-bold text-white text-base">{isFa ? 'ایجاد حساب ورزشکار' : 'Create Athlete Account'}</h3>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center"><UserPlus className="w-4 h-4 text-cyan-300" /></div>
                    </div>
                    <p className="text-[11px] text-slate-400">{isFa ? 'ثبت حساب برای شروع همکاری با مربی.' : 'Create your account to start the coaching flow.'}</p>
                  </div>
                </div>
              )}

              {mobileTab === 'dashboard' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{isFa ? 'خانه ورزشکار' : 'Athlete Home'}</div>
                    <h3 className="font-bold text-white text-base">{program.title}</h3>
                    <div className="text-[11px] text-slate-400">{isFa ? `پیشرفت برنامه: ${workoutStats.progressPercent}٪` : `Plan progress: ${workoutStats.progressPercent}%`}</div>
                  </div>
                  {program.days[0]?.exercises.slice(0, 2).map((exercise, exerciseIndex) => (
                    <div key={exercise.exerciseId} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-xs">{exercise.exerciseName}</h4>
                        <span className="text-[10px] text-slate-400">{exercise.restSeconds}s</span>
                      </div>
                      {exercise.sets.map((set, setIndex) => (
                        <div key={`${exercise.exerciseId}-${set.setNumber}`} className="flex items-center justify-between text-xs bg-slate-950 p-2 rounded-xl border border-slate-800">
                          <span className="font-bold text-slate-400">{isFa ? `ست ${set.setNumber}` : `SET ${set.setNumber}`}</span>
                          <span className="font-bold text-cyan-300">{set.weightKg} kg</span>
                          <span className="text-slate-300">{set.reps} {isFa ? 'تکرار' : 'reps'}</span>
                          <button onClick={() => handleToggleSet(0, exerciseIndex, setIndex)} className={`p-1 rounded ${set.completed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {mobileTab === 'messages' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{isFa ? 'پیام‌رسان مربی' : 'Coach Messaging'}</div>
                    <div className="text-sm font-bold text-white mt-1">{athlete.coachName}</div>
                  </div>
                  {chatMessages.slice(-3).map((message, index) => (
                    <div key={`${message.sender}-preview-${index}`} className={`p-3 rounded-2xl max-w-[90%] ${message.sender === 'coach' ? 'bg-cyan-950/60 border border-cyan-800/50 text-cyan-100' : 'bg-blue-600 text-white ml-auto'}`}>
                      {message.text}
                    </div>
                  ))}
                </div>
              )}

              {mobileTab === 'personal' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{isFa ? 'اطلاعات شخصی و سلامت' : 'Personal & Health'}</div>
                    <div className="text-sm font-bold text-white mt-1">{athlete.name}</div>
                    <div className="text-[11px] text-slate-400 mt-2">{athlete.healthProfile?.medicalClearance ?? (isFa ? 'مجاز برای تمرین' : 'Cleared for training')}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800"><div className="text-slate-500">{isFa ? 'وزن' : 'Weight'}</div><div className="font-bold text-white mt-1">{athlete.weightKg} kg</div></div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800"><div className="text-slate-500">{isFa ? 'خواب' : 'Sleep'}</div><div className="font-bold text-indigo-300 mt-1">{athlete.wearableSync.sleepHours} h</div></div>
                  </div>
                </div>
              )}

              {mobileTab === 'nutrition' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{isFa ? 'تغذیه شخصی' : 'Personal Nutrition'}</div>
                    <div className="text-sm font-bold text-white mt-1">{isFa ? 'پیشرفت برنامه غذایی' : 'Nutrition plan progress'}</div>
                    <div className="text-[11px] text-slate-400 mt-2">{athlete.caloriesLogged}/{athlete.caloriesTarget} kcal</div>
                  </div>
                  {mealPlan.slice(0, 3).map((meal) => (
                    <div key={meal.name} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                      <div className="font-bold text-white">{meal.name}</div>
                      <div className="text-slate-400 mt-1">{meal.detail}</div>
                      <div className="text-amber-300 mt-2 font-bold">{meal.calories} kcal</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto shrink-0 mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

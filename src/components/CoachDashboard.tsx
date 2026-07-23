import React, { useMemo, useState } from 'react';
import type { AthleteProfile, AIRecommendation } from '../types';
import {
  Users,
  Activity,
  BrainCircuit,
  CheckCircle2,
  Search,
  Zap,
  ShieldAlert,
  Dumbbell,
  FileCheck,
  TrendingUp,
  Inbox,
  MessageSquare,
  ClipboardList,
  UserPlus,
  Building2,
  History,
  Flame,
} from 'lucide-react';

interface CoachDashboardProps {
  athletes: AthleteProfile[];
  selectedAthlete: AthleteProfile;
  onSelectAthlete: (athlete: AthleteProfile) => void;
  aiRecommendations: AIRecommendation[];
  onApplyAIRecommendation: (recId: string) => void;
  onNavigateTab: (tab: string) => void;
  onAddAthlete: (payload: { name: string; goal: string; affiliatedGym: string; previousCoach: string }) => void;
  onAssignQuickPlan: (templateId: 'strength' | 'conditioning' | 'mobility') => void;
  lang?: 'en' | 'fa';
}

type CoachHomeSection = 'overview' | 'athletes' | 'messages' | 'requests' | 'quick_plans';

export const CoachDashboard: React.FC<CoachDashboardProps> = ({
  athletes,
  selectedAthlete,
  onSelectAthlete,
  aiRecommendations,
  onApplyAIRecommendation,
  onNavigateTab,
  onAddAthlete,
  onAssignQuickPlan,
  lang = 'fa',
}) => {
  const isFa = lang === 'fa';
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<CoachHomeSection>('overview');
  const [newAthlete, setNewAthlete] = useState({ name: '', goal: '', affiliatedGym: '', previousCoach: '' });

  const filteredAthletes = athletes.filter((athlete) => {
    const query = searchTerm.toLowerCase();
    return (
      athlete.name.toLowerCase().includes(query) ||
      athlete.goal.toLowerCase().includes(query) ||
      (athlete.affiliatedGyms ?? []).join(' ').toLowerCase().includes(query)
    );
  });

  const criticalCount = athletes.filter((athlete) => athlete.riskScore === 'High' || athlete.riskScore === 'Critical').length;
  const avgCompliance = Math.round(athletes.reduce((acc, athlete) => acc + athlete.workoutCompliancePercent, 0) / athletes.length);
  const avgNutrition = Math.round(athletes.reduce((acc, athlete) => acc + athlete.nutritionCompliancePercent, 0) / athletes.length);

  const reportCards = useMemo(() => {
    const highReadinessAthlete = [...athletes].sort((a, b) => b.wearableSync.recoveryScore - a.wearableSync.recoveryScore)[0];
    const highestStrainAthlete = [...athletes].sort((a, b) => b.wearableSync.strainIndex - a.wearableSync.strainIndex)[0];
    const bestComplianceAthlete = [...athletes].sort((a, b) => b.workoutCompliancePercent - a.workoutCompliancePercent)[0];

    return [
      {
        id: 'report-1',
        title: isFa ? 'گزارش عملکرد هفتگی تیم' : 'Weekly Team Performance Report',
        athlete: bestComplianceAthlete?.name ?? selectedAthlete.name,
        summary: isFa
          ? `پایبندی تمرینی به ${bestComplianceAthlete?.workoutCompliancePercent ?? 0}٪ رسیده و روند اجرای برنامه در سطح بالا باقی مانده است.`
          : `Training compliance reached ${bestComplianceAthlete?.workoutCompliancePercent ?? 0}% and execution quality is holding strong.`,
        accent: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
      },
      {
        id: 'report-2',
        title: isFa ? 'گزارش ریسک و خستگی' : 'Risk & Fatigue Review',
        athlete: highestStrainAthlete?.name ?? selectedAthlete.name,
        summary: isFa
          ? `شاخص فشار ${highestStrainAthlete?.wearableSync.strainIndex ?? 0} ثبت شده و نیاز به بازبینی حجم تمرین وجود دارد.`
          : `A strain index of ${highestStrainAthlete?.wearableSync.strainIndex ?? 0} was detected and workload review is recommended.`,
        accent: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
      },
      {
        id: 'report-3',
        title: isFa ? 'گزارش ریکاوری و آمادگی' : 'Recovery & Readiness Report',
        athlete: highReadinessAthlete?.name ?? selectedAthlete.name,
        summary: isFa
          ? `ریکاوری ${highReadinessAthlete?.wearableSync.recoveryScore ?? 0}٪ و آمادگی برای تمرین با کیفیت بالا ثبت شد.`
          : `Recovery at ${highReadinessAthlete?.wearableSync.recoveryScore ?? 0}% signals readiness for high-quality work.`,
        accent: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
      },
    ];
  }, [athletes, isFa, selectedAthlete.name]);

  const coachMessages = isFa
    ? [
        {
          from: 'الکس ریورا',
          subject: 'گزارش درد شانه و درخواست اصلاح تمرین',
          preview: 'بعد از پرس بالاسینه ست سوم، درد قدامی شانه دوباره برگشت. آیا می‌توانم جایگزین بگیرم؟',
          time: '۸ دقیقه پیش',
          unread: true,
        },
        {
          from: 'مدیر باشگاه Apex Frankfurt',
          subject: 'درخواست جلسه برای ظرفیت‌سازی مربیان',
          preview: 'برای توسعه پلن باشگاه و افزایش ظرفیت مربیان، لطفاً جلسه فردا را تأیید کنید.',
          time: '۴۵ دقیقه پیش',
          unread: true,
        },
        {
          from: 'سارا چن',
          subject: 'گزارش کامل وعده‌های روز تمرین',
          preview: 'همه وعده‌ها و مکمل‌ها ثبت شدند و برای بازبینی آماده هستند.',
          time: '۲ ساعت پیش',
          unread: false,
        },
      ]
    : [
        {
          from: 'Alex Rivera',
          subject: 'Shoulder issue and exercise substitution request',
          preview: 'The anterior shoulder pain came back on set three of incline pressing. Can you swap the lift?',
          time: '8 min ago',
          unread: true,
        },
        {
          from: 'Apex Frankfurt Gym Manager',
          subject: 'Meeting request for coach capacity scaling',
          preview: 'Please confirm tomorrow’s session to discuss coach capacity scaling and white-label rollout.',
          time: '45 min ago',
          unread: true,
        },
        {
          from: 'Sarah Chen',
          subject: 'Full meal logging submitted',
          preview: 'All meals and supplements were logged and are ready for your review.',
          time: '2 hrs ago',
          unread: false,
        },
      ];

  const coachRequests = isFa
    ? [
        {
          name: 'نیکلاس هارت',
          type: 'درخواست برنامه تمرینی عمومی',
          notes: 'هدف: چربی‌سوزی و افزایش استقامت، شروع از هفته آینده',
          gym: 'Apex Downtown',
          status: 'جدید',
        },
        {
          name: 'باشگاه CoreForge',
          type: 'درخواست پکیج تمرین شخصی‌سازی‌شده',
          notes: 'دو پلن ۱۲ هفته‌ای برای ۲۰ ورزشکار رزمی مورد نیاز است.',
          gym: 'CoreForge Performance Lab',
          status: 'در حال بررسی',
        },
        {
          name: 'مریم رضوی',
          type: 'درخواست پرسونال ترینینگ',
          notes: 'سه جلسه حضوری + برنامه تغذیه برای فاز شروع',
          gym: 'Apex Women Studio',
          status: 'نیازمند پاسخ',
        },
      ]
    : [
        {
          name: 'Nicholas Hart',
          type: 'General workout plan request',
          notes: 'Goal: fat loss and endurance; requested start next week.',
          gym: 'Apex Downtown',
          status: 'New',
        },
        {
          name: 'CoreForge Gym',
          type: 'Personalized training package request',
          notes: 'Two 12-week performance plans needed for 20 combat athletes.',
          gym: 'CoreForge Performance Lab',
          status: 'In review',
        },
        {
          name: 'Maryam Razavi',
          type: 'Personal training request',
          notes: 'Three in-person sessions plus onboarding nutrition plan.',
          gym: 'Apex Women Studio',
          status: 'Needs response',
        },
      ];

  const quickPlans = isFa
    ? [
        {
          id: 'strength' as const,
          title: 'پلن سریع قدرت عمومی',
          subtitle: '۳ روزه • قدرت + حجم پایه',
          calories: '۴۵۰-۶۲۰ kcal/session',
          description: 'برای شروع ورزشکاران جدید یا بازتنظیم قدرت پایه با حرکات اصلی.',
        },
        {
          id: 'conditioning' as const,
          title: 'پلن سریع چربی‌سوزی و هوازی',
          subtitle: '۴ روزه • کاردیو + HIIT',
          calories: '۵۰۰-۷۵۰ kcal/session',
          description: 'برای ورزشکارانی که درخواست کاهش چربی و افزایش ظرفیت هوازی دارند.',
        },
        {
          id: 'mobility' as const,
          title: 'پلن سریع موبیلیتی و ریکاوری',
          subtitle: '۳ روزه • کشش + یوگا + بازیابی',
          calories: '۱۸۰-۳۲۰ kcal/session',
          description: 'برای برگشت از خستگی، بازگشت به تمرین و مدیریت حساسیت‌های حرکتی.',
        },
      ]
    : [
        {
          id: 'strength' as const,
          title: 'Quick General Strength Plan',
          subtitle: '3 days • strength + foundational hypertrophy',
          calories: '450-620 kcal/session',
          description: 'Ideal for onboarding new athletes or rebuilding foundational force output.',
        },
        {
          id: 'conditioning' as const,
          title: 'Quick Fat-Loss & Conditioning Plan',
          subtitle: '4 days • cardio + HIIT',
          calories: '500-750 kcal/session',
          description: 'Built for athletes requesting fat loss and improved work capacity.',
        },
        {
          id: 'mobility' as const,
          title: 'Quick Mobility & Recovery Plan',
          subtitle: '3 days • stretching + yoga + recovery',
          calories: '180-320 kcal/session',
          description: 'Useful for recovery blocks, return-to-training, and movement restoration.',
        },
      ];

  const handleSubmitNewAthlete = () => {
    if (!newAthlete.name.trim()) return;
    onAddAthlete(newAthlete);
    setNewAthlete({ name: '', goal: '', affiliatedGym: '', previousCoach: '' });
    setActiveSection('athletes');
  };

  const unreadMessages = coachMessages.filter((message) => message.unread).length;

  const sectionButtons = [
    { id: 'overview' as const, label: isFa ? 'خانه و گزارش‌ها' : 'Home & Reports', icon: Activity },
    { id: 'athletes' as const, label: isFa ? 'ورزشکاران' : 'Athletes', icon: Users },
    { id: 'messages' as const, label: isFa ? 'پیام‌ها' : 'Messages', icon: MessageSquare },
    { id: 'requests' as const, label: isFa ? 'درخواست‌ها' : 'Requests', icon: ClipboardList },
    { id: 'quick_plans' as const, label: isFa ? 'پلن‌های سریع' : 'Quick Plans', icon: Dumbbell },
  ];

  return (
    <div className="p-2 sm:p-4 lg:p-8 space-y-6 lg:space-y-8">
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 p-4 rounded-2xl border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm sm:text-base">
              {isFa ? 'اهرم ۱۰ برابری ظرفیت مربیگری' : '10x Coach Capacity Scaling Lever'}
            </h3>
            <p className="text-xs text-slate-300">
              {isFa
                ? 'مربی می‌تواند گزارش‌ها، پیام‌ها، درخواست‌ها و برنامه‌های سریع را از یک هاب واحد مدیریت کند.'
                : 'Coaches can manage reports, inbox, requests, and quick plans from a single operating hub.'}
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold whitespace-nowrap">
          {isFa ? '۷۸٪ صرفه‌جویی زمانی' : '78% Time Saved'}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              {isFa ? 'Coach Management Dashboard' : 'Coach Management Dashboard'}
            </span>
            <span className="text-xs text-slate-400">{isFa ? 'مرکز گزارش، پیام و ورزشکاران' : 'Reports, messaging, and athlete management hub'}</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            {isFa ? 'فرماندهی کامل عملکرد ورزشکاران' : 'Full command over athlete performance operations'}
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            {isFa
              ? `امروز ${criticalCount} ورزشکار نیازمند بازبینی فوری هستند و ${coachRequests.length} درخواست جدید در صف شما ثبت شده است.`
              : `Today, ${criticalCount} athletes need review and ${coachRequests.length} incoming requests are waiting in your queue.`}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-xl text-center">
            <div className="text-xs text-slate-400 font-medium">{isFa ? 'گزارش‌های آماده' : 'Reports Ready'}</div>
            <div className="text-2xl font-black text-white mt-1">{reportCards.length}</div>
            <div className="text-[10px] text-cyan-400 mt-0.5">{isFa ? 'مرور امروز' : 'Today Review'}</div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-xl text-center">
            <div className="text-xs text-slate-400 font-medium">{isFa ? 'پیام‌های جدید' : 'Unread Messages'}</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{unreadMessages}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{isFa ? 'ورودی مربی' : 'Coach Inbox'}</div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-xl text-center">
            <div className="text-xs text-slate-400 font-medium">{isFa ? 'میانگین پایبندی' : 'Avg Compliance'}</div>
            <div className="text-2xl font-black text-cyan-400 mt-1">{avgCompliance}٪</div>
            <div className="text-[10px] text-cyan-400 mt-0.5">{isFa ? 'پایش تمرین' : 'Training'}</div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-xl text-center">
            <div className="text-xs text-slate-400 font-medium">{isFa ? 'پایبندی تغذیه' : 'Nutrition Adherence'}</div>
            <div className="text-2xl font-black text-amber-400 mt-1">{avgNutrition}٪</div>
            <div className="text-[10px] text-amber-400 mt-0.5">{isFa ? 'رژیم و ریکاوری' : 'Diet & Recovery'}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {sectionButtons.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-white bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className={`w-3.5 h-3.5 absolute ${isFa ? 'right-3' : 'left-3'} top-2.5 text-slate-400`} />
          <input
            type="text"
            placeholder={isFa ? 'جستجو در ورزشکاران و باشگاه‌ها...' : 'Search athletes and gyms...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${isFa ? 'pr-8 pl-3' : 'pl-8 pr-3'} py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 w-56 sm:w-72`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reportCards.map((report) => (
                  <div key={report.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-3">
                    <div className={`inline-flex px-2 py-1 rounded-lg border text-[10px] font-bold ${report.accent}`}>
                      {report.title}
                    </div>
                    <div>
                      <div className="text-sm font-black text-white">{report.athlete}</div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{report.summary}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Inbox className="w-4 h-4 text-cyan-400" /> {isFa ? 'پیام‌های دریافتی مربی' : 'Coach Inbox'}
                    </h3>
                    <button onClick={() => setActiveSection('messages')} className="text-xs text-cyan-400 font-semibold">
                      {isFa ? 'مشاهده همه' : 'View all'}
                    </button>
                  </div>
                  {coachMessages.slice(0, 2).map((message) => (
                    <div key={message.subject} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-bold text-white text-sm">{message.from}</div>
                        <span className="text-[10px] text-slate-500">{message.time}</span>
                      </div>
                      <div className="text-xs text-cyan-300 font-semibold mt-2">{message.subject}</div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{message.preview}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-amber-400" /> {isFa ? 'درخواست‌های برنامه و تمرین شخصی' : 'Plan & Personal Training Requests'}
                    </h3>
                    <button onClick={() => setActiveSection('requests')} className="text-xs text-cyan-400 font-semibold">
                      {isFa ? 'مدیریت صف' : 'Manage queue'}
                    </button>
                  </div>
                  {coachRequests.slice(0, 2).map((request) => (
                    <div key={request.name + request.type} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-bold text-white text-sm">{request.name}</div>
                        <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                          {request.status}
                        </span>
                      </div>
                      <div className="text-xs text-cyan-300 font-semibold">{request.type}</div>
                      <div className="text-[11px] text-slate-500">{request.gym}</div>
                      <p className="text-xs text-slate-400 leading-relaxed">{request.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-emerald-400" /> {isFa ? 'افزودن دستی ورزشکار جدید' : 'Manually Add a New Athlete'}
                  </h3>
                  <button
                    onClick={handleSubmitNewAthlete}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    {isFa ? 'ثبت ورزشکار' : 'Add athlete'}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    value={newAthlete.name}
                    onChange={(e) => setNewAthlete((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder={isFa ? 'نام ورزشکار' : 'Athlete name'}
                    className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                  <input
                    value={newAthlete.goal}
                    onChange={(e) => setNewAthlete((prev) => ({ ...prev, goal: e.target.value }))}
                    placeholder={isFa ? 'هدف ورزشی / عملکردی' : 'Performance goal'}
                    className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                  <input
                    value={newAthlete.affiliatedGym}
                    onChange={(e) => setNewAthlete((prev) => ({ ...prev, affiliatedGym: e.target.value }))}
                    placeholder={isFa ? 'باشگاه وابسته' : 'Affiliated gym'}
                    className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                  <input
                    value={newAthlete.previousCoach}
                    onChange={(e) => setNewAthlete((prev) => ({ ...prev, previousCoach: e.target.value }))}
                    placeholder={isFa ? 'مربی قبلی' : 'Previous trainer'}
                    className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'athletes' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAthletes.map((athlete) => {
                  const isSelected = selectedAthlete.id === athlete.id;
                  return (
                    <div
                      key={athlete.id}
                      onClick={() => onSelectAthlete(athlete)}
                      className={`rounded-2xl border p-5 cursor-pointer transition-all shadow-xl ${
                        isSelected ? 'bg-slate-900 border-cyan-500/70 ring-1 ring-cyan-500/30' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img src={athlete.avatar} alt={athlete.name} className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                          <div>
                            <div className="font-bold text-white text-sm flex items-center gap-2">
                              {athlete.name}
                              {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">{athlete.goal}</div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                          athlete.riskScore === 'High' || athlete.riskScore === 'Critical'
                            ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                            : athlete.riskScore === 'Moderate'
                              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {athlete.riskScore}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
                        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                          <div className="text-slate-500 flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {isFa ? 'باشگاه‌های وابسته' : 'Affiliated Gyms'}</div>
                          <div className="text-white mt-2 leading-relaxed">{(athlete.affiliatedGyms ?? [isFa ? 'ثبت نشده' : 'Not set']).join(' • ')}</div>
                        </div>
                        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                          <div className="text-slate-500 flex items-center gap-1"><History className="w-3.5 h-3.5" /> {isFa ? 'سابقه مربیان' : 'Previous Trainers'}</div>
                          <div className="text-white mt-2 leading-relaxed">{(athlete.previousCoaches && athlete.previousCoaches.length > 0 ? athlete.previousCoaches : [isFa ? 'بدون سابقه ثبت‌شده' : 'No trainer history logged']).join(' • ')}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
                        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                          <div className="text-slate-500">{isFa ? 'ریکاوری' : 'Recovery'}</div>
                          <div className="font-bold text-emerald-300 mt-1">{athlete.wearableSync.recoveryScore}%</div>
                        </div>
                        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                          <div className="text-slate-500">{isFa ? 'عضله' : 'Muscle'}</div>
                          <div className="font-bold text-cyan-300 mt-1">{athlete.muscleMassKg} kg</div>
                        </div>
                        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                          <div className="text-slate-500">{isFa ? 'پایبندی' : 'Compliance'}</div>
                          <div className="font-bold text-amber-300 mt-1">{athlete.workoutCompliancePercent}%</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-emerald-400" /> {isFa ? 'افزودن ورزشکار جدید' : 'Add Athlete'}
                  </h3>
                  <button onClick={handleSubmitNewAthlete} className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold">
                    {isFa ? 'افزودن' : 'Create'}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input value={newAthlete.name} onChange={(e) => setNewAthlete((prev) => ({ ...prev, name: e.target.value }))} placeholder={isFa ? 'نام ورزشکار' : 'Athlete name'} className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" />
                  <input value={newAthlete.goal} onChange={(e) => setNewAthlete((prev) => ({ ...prev, goal: e.target.value }))} placeholder={isFa ? 'هدف' : 'Goal'} className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" />
                  <input value={newAthlete.affiliatedGym} onChange={(e) => setNewAthlete((prev) => ({ ...prev, affiliatedGym: e.target.value }))} placeholder={isFa ? 'باشگاه' : 'Gym'} className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" />
                  <input value={newAthlete.previousCoach} onChange={(e) => setNewAthlete((prev) => ({ ...prev, previousCoach: e.target.value }))} placeholder={isFa ? 'مربی قبلی' : 'Previous trainer'} className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'messages' && (
            <div className="space-y-4">
              {coachMessages.map((message) => (
                <div key={message.subject} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-white text-sm">{message.from}</h4>
                        {message.unread && <span className="px-2 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-bold">{isFa ? 'خوانده‌نشده' : 'Unread'}</span>}
                      </div>
                      <div className="text-xs text-cyan-300 font-semibold mt-2">{message.subject}</div>
                    </div>
                    <div className="text-[11px] text-slate-500">{message.time}</div>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mt-3">{message.preview}</p>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'requests' && (
            <div className="space-y-4">
              {coachRequests.map((request) => (
                <div key={request.name + request.type} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-white text-sm">{request.name}</h4>
                      <div className="text-xs text-cyan-300 mt-1">{request.type}</div>
                    </div>
                    <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                      {request.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">{request.gym}</div>
                  <p className="text-sm text-slate-400 leading-relaxed">{request.notes}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button className="px-3 py-2 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 text-xs font-bold">
                      {isFa ? 'ارسال پاسخ' : 'Reply'}
                    </button>
                    <button className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold">
                      {isFa ? 'تبدیل به برنامه' : 'Convert to plan'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'quick_plans' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickPlans.map((plan) => (
                <div key={plan.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-4">
                  <div className="inline-flex px-2 py-1 rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 text-[10px] font-bold">
                    {plan.subtitle}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-lg">{plan.title}</h4>
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">{plan.description}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> {isFa ? 'مصرف انرژی' : 'Energy Burn'}</span>
                    <span className="font-bold text-amber-300">{plan.calories}</span>
                  </div>
                  <button
                    onClick={() => {
                      onAssignQuickPlan(plan.id);
                      onNavigateTab('builder');
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs"
                  >
                    {isFa ? 'ساخت و باز کردن در طراح تمرینات' : 'Build and open in Workout Builder'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'overview' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-cyan-400" /> {isFa ? 'فید تصمیم‌گیری هوشمند و هشدارها' : 'AI Decision Feed & Alerts'}
                </h3>
                <button onClick={() => setActiveSection('overview')} className="text-xs text-cyan-400 font-semibold">
                  {isFa ? 'خانه' : 'Home'}
                </button>
              </div>
              <div className="space-y-4">
                {aiRecommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className={`p-5 rounded-2xl border space-y-4 transition-all ${
                      rec.applied ? 'bg-slate-900/40 border-slate-800/80 opacity-75' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                            rec.category.includes('آسیب') || rec.category.includes('Injury')
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          }`}
                        >
                          {rec.category.includes('آسیب') || rec.category.includes('Injury') ? <ShieldAlert className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-white text-sm">{rec.athleteName}</h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-cyan-300 border border-slate-700">
                              {rec.category}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">{rec.timestamp}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => {
                            const target = athletes.find((athlete) => athlete.id === rec.athleteId);
                            if (target) onSelectAthlete(target);
                            onNavigateTab('profile360');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
                        >
                          {isFa ? 'پروفایل' : 'Profile'}
                        </button>

                        {!rec.applied ? (
                          <button
                            onClick={() => onApplyAIRecommendation(rec.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {isFa ? 'اعمال' : 'Approve'}
                          </button>
                        ) : (
                          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> {isFa ? 'اعمال شد' : 'Applied'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <p className="text-xs text-slate-200 leading-relaxed">
                        <strong className="text-white">{isFa ? 'تصمیم سیستم: ' : 'System Decision: '}</strong>
                        {rec.suggestedAction}
                      </p>
                    </div>

                    {rec.evidence && (
                      <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 space-y-1.5">
                        <div className="flex items-center justify-between font-bold border-b border-cyan-800/40 pb-1">
                          <span className="flex items-center gap-1.5 text-cyan-300">
                            <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                            {isFa ? 'لایه شواهد' : 'Evidence Layer'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/30">
                            {isFa ? `اطمینان: ${rec.evidence.confidenceScorePercent}٪` : `Confidence: ${rec.evidence.confidenceScorePercent}%`}
                          </span>
                        </div>
                        <div className="text-[11px] text-cyan-100/90 leading-relaxed">
                          <strong>{isFa ? 'منبع داده: ' : 'Data Source: '}</strong> {rec.evidence.dataSource}
                        </div>
                        <div className="text-[11px] text-slate-300 italic">"{rec.evidence.reasoning}"</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" /> {isFa ? 'ورزشکار منتخب' : 'Selected Athlete'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                {isFa ? 'پایش زنده' : 'Live Sync'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <img src={selectedAthlete.avatar} alt={selectedAthlete.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-md" />
              <div>
                <h3 className="text-lg font-black text-white">{selectedAthlete.name}</h3>
                <div className="text-xs text-cyan-400 font-semibold mt-0.5">{selectedAthlete.goal}</div>
                <div className="text-xs text-slate-400 mt-1">{selectedAthlete.membershipTier}</div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="text-slate-500">{isFa ? 'باشگاه‌های وابسته' : 'Affiliated Gyms'}</div>
                <div className="text-white mt-1 leading-relaxed">{(selectedAthlete.affiliatedGyms ?? [isFa ? 'ثبت نشده' : 'Not set']).join(' • ')}</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="text-slate-500">{isFa ? 'مربیان قبلی' : 'Previous Trainers'}</div>
                <div className="text-white mt-1 leading-relaxed">{(selectedAthlete.previousCoaches && selectedAthlete.previousCoaches.length > 0 ? selectedAthlete.previousCoaches : [isFa ? 'بدون سابقه ثبت‌شده' : 'No trainer history logged']).join(' • ')}</div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{isFa ? 'شاخص فشار' : 'Strain Index'}</span>
                <span className="font-bold text-cyan-300">{selectedAthlete.wearableSync.strainIndex} / 21</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: `${(selectedAthlete.wearableSync.strainIndex / 21) * 100}%` }} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="text-slate-500">{isFa ? 'ریکاوری' : 'Recovery'}</div>
                  <div className="font-bold text-emerald-300 mt-1">{selectedAthlete.wearableSync.recoveryScore}%</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="text-slate-500">{isFa ? 'عضله' : 'Muscle Mass'}</div>
                  <div className="font-bold text-cyan-300 mt-1">{selectedAthlete.muscleMassKg} kg</div>
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              <button
                onClick={() => onNavigateTab('builder')}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Dumbbell className="w-4 h-4" />
                {isFa ? 'ویرایش برنامه‌ تمرینی' : 'Modify Workout Plan'}
              </button>

              <button
                onClick={() => onNavigateTab('biometrics')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-2 border border-slate-700"
              >
                <Activity className="w-4 h-4 text-slate-400" />
                {isFa ? 'پرونده پزشکی و پیشرفت' : 'Medical & Progress File'}
              </button>

              <button
                onClick={() => onNavigateTab('nutrition')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-2 border border-slate-700"
              >
                <Flame className="w-4 h-4 text-slate-400" />
                {isFa ? 'پلن تغذیه و کالری' : 'Nutrition Plans & Calories'}
              </button>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">{isFa ? 'گزارش مربی:' : 'Coach Note:'}</strong>{' '}
              {selectedAthlete.riskReason ?? (isFa ? 'ورزشکار در وضعیت پایدار قرار دارد و آماده ادامه تمرین است.' : 'Athlete is stable and ready to continue.' )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

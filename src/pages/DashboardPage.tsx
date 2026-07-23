import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowDownToLine,
  ArrowUpRight,
  BellRing,
  BookmarkPlus,
  ClipboardCheck,
  Eye,
  Flame,
  HeartPulse,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
} from 'lucide-react';
import { ActiveAlerts } from '../components/ActiveAlerts';
import { BusinessOpsCenter } from '../components/BusinessOpsCenter';
import { CoachDashboard } from '../components/CoachDashboard';
import { DemoStoryFlow } from '../components/DemoStoryFlow';
import { StaminaChart } from '../components/StaminaChart';
import { StatCards } from '../components/StatCards';
import { TeamComparisonBoard } from '../components/TeamComparisonBoard';
import { PanelShell } from '../components/ui/PanelShell';
import type { AIRecommendation, AthleteProfile, WorkoutProgram } from '../types';
import type { AppTab, RoleView } from '../utils/formatters';
import { formatMetricNumber, formatPercent, getRoleLabel } from '../utils/formatters';
import type { BrandConfig } from '../utils/branding';

interface DashboardPageProps {
  athletes: AthleteProfile[];
  selectedAthlete: AthleteProfile;
  program: WorkoutProgram;
  aiRecommendations: AIRecommendation[];
  roleView: RoleView;
  brand: BrandConfig;
  lang?: 'fa' | 'en';
  onSelectAthlete: (athlete: AthleteProfile) => void;
  onApplyAIRecommendation: (recId: string) => void;
  onNavigateTab: (tab: AppTab) => void;
  onSetRoleView: (role: RoleView) => void;
  onAddAthlete: (payload: { name: string; goal: string; affiliatedGym: string; previousCoach: string }) => void;
  onAssignQuickPlan: (templateId: 'strength' | 'conditioning' | 'mobility') => void;
  onExportExecutiveReport: () => void;
  onExportAthletesCsv: () => void;
}

interface SavedWorkspaceView {
  id: string;
  name: string;
  roleView: RoleView;
  targetTab: AppTab;
  athleteId: string;
  createdAt: string;
}

const SAVED_VIEWS_STORAGE_KEY = 'apexos-saved-workspace-views';

type HeroCard = {
  label: string;
  value: string;
  helper: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
};

export const DashboardPage: React.FC<DashboardPageProps> = ({
  athletes,
  selectedAthlete,
  program,
  aiRecommendations,
  roleView,
  brand,
  lang = 'fa',
  onSelectAthlete,
  onApplyAIRecommendation,
  onNavigateTab,
  onSetRoleView,
  onAddAthlete,
  onAssignQuickPlan,
  onExportExecutiveReport,
  onExportAthletesCsv,
}) => {
  const isFa = lang === 'fa';
  const urgentAlerts = aiRecommendations.filter((item) => !item.applied);
  const unreadNotifications = aiRecommendations.filter((item) => !item.reviewed);
  const totalSets = program.days.reduce((dayAcc, day) => dayAcc + day.exercises.reduce((exAcc, exercise) => exAcc + exercise.sets.length, 0), 0);
  const completedSets = program.days.reduce(
    (dayAcc, day) => dayAcc + day.exercises.reduce((exAcc, exercise) => exAcc + exercise.sets.filter((set) => set.completed).length, 0),
    0
  );
  const workoutProgress = totalSets === 0 ? 0 : Math.round((completedSets / totalSets) * 100);
  const flaggedMarkers = selectedAthlete.labResults.flaggedMarkers.length;

  const [savedViewName, setSavedViewName] = useState('');
  const [savedViews, setSavedViews] = useState<SavedWorkspaceView[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(SAVED_VIEWS_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SavedWorkspaceView[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(SAVED_VIEWS_STORAGE_KEY, JSON.stringify(savedViews));
  }, [savedViews]);

  const heroContent = useMemo(() => {
    const averageRecovery = Math.round(
      athletes.reduce((acc, athlete) => acc + athlete.wearableSync.recoveryScore, 0) / Math.max(athletes.length, 1)
    );
    const avgNutrition = Math.round(
      athletes.reduce((acc, athlete) => acc + athlete.nutritionCompliancePercent, 0) / Math.max(athletes.length, 1)
    );

    const result: { title: string; subtitle: string; cards: HeroCard[] } = {
      title: '',
      subtitle: '',
      cards: [],
    };

    switch (roleView) {
      case 'medical':
        result.title = isFa ? 'داشبورد پزشکی و پایش ریسک' : 'Medical risk & monitoring dashboard';
        result.subtitle = isFa
          ? 'تمرکز بر سلامت، خستگی، شاخص‌های آزمایشگاهی و مسیرهای مداخله.'
          : 'Focused on health, fatigue, lab indicators, and intervention pathways.';
        result.cards = [
          {
            label: isFa ? 'ریسک فعال' : 'Active risk',
            value: selectedAthlete.riskScore,
            helper: selectedAthlete.riskReason ?? (isFa ? 'بدون هشدار حاد' : 'No acute alert'),
            icon: ShieldAlert,
            tone: 'text-rose-300 border-rose-500/30 bg-rose-500/10',
          },
          {
            label: 'HRV',
            value: `${formatMetricNumber(selectedAthlete.wearableSync.hrvMs, { maximumFractionDigits: 0 })} ms`,
            helper: `${isFa ? 'پایه' : 'Baseline'} ${formatMetricNumber(selectedAthlete.wearableSync.hrvBaselineMs, { maximumFractionDigits: 0 })} ms`,
            icon: HeartPulse,
            tone: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
          },
          {
            label: isFa ? 'شاخص‌های علامت‌گذاری‌شده' : 'Flagged markers',
            value: formatMetricNumber(flaggedMarkers, { maximumFractionDigits: 0 }),
            helper: selectedAthlete.labResults.flaggedMarkers.join(' • ') || (isFa ? 'نرمال' : 'Optimal'),
            icon: Activity,
            tone: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
          },
        ];
        break;
      case 'nutrition':
        result.title = isFa ? 'داشبورد تغذیه و پایبندی غذایی' : 'Nutrition adherence dashboard';
        result.subtitle = isFa
          ? 'کالری، پروتئین، آب و پیشرفت رژیم برای تصمیم‌گیری سریع.'
          : 'Calories, protein, hydration, and adherence for fast nutrition decisions.';
        result.cards = [
          {
            label: isFa ? 'پیشرفت کالری' : 'Calorie progress',
            value: `${formatMetricNumber(selectedAthlete.caloriesLogged, { maximumFractionDigits: 0 })} / ${formatMetricNumber(selectedAthlete.caloriesTarget, { maximumFractionDigits: 0 })}`,
            helper: `${formatPercent(Math.round((selectedAthlete.caloriesLogged / selectedAthlete.caloriesTarget) * 100))} ${isFa ? 'تکمیل' : 'complete'}`,
            icon: Flame,
            tone: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
          },
          {
            label: isFa ? 'پروتئین' : 'Protein',
            value: `${formatMetricNumber(selectedAthlete.proteinLoggedG)}g`,
            helper: `${isFa ? 'هدف' : 'Target'} ${formatMetricNumber(selectedAthlete.proteinTargetG, { maximumFractionDigits: 0 })}g`,
            icon: Target,
            tone: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
          },
          {
            label: isFa ? 'پایبندی تیمی' : 'Team adherence',
            value: formatPercent(avgNutrition),
            helper: isFa ? 'میانگین پایبندی تغذیه ورزشکاران' : 'Average athlete nutrition adherence',
            icon: ClipboardCheck,
            tone: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
          },
        ];
        break;
      case 'athlete':
        result.title = isFa ? 'داشبورد ورزشکار و اجرای برنامه' : 'Athlete plan execution dashboard';
        result.subtitle = isFa
          ? 'پیشرفت برنامه، پیام‌ها، ریکاوری و تعامل مستقیم با مربی.'
          : 'Plan progress, messages, recovery, and direct coach interaction.';
        result.cards = [
          {
            label: isFa ? 'پیشرفت تمرین' : 'Workout progress',
            value: formatPercent(workoutProgress),
            helper: `${formatMetricNumber(completedSets, { maximumFractionDigits: 0 })}/${formatMetricNumber(totalSets, { maximumFractionDigits: 0 })} ${isFa ? 'ست کامل شد' : 'sets completed'}`,
            icon: ClipboardCheck,
            tone: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
          },
          {
            label: isFa ? 'ریکاوری' : 'Recovery',
            value: formatPercent(selectedAthlete.wearableSync.recoveryScore),
            helper: `${isFa ? 'خواب' : 'Sleep'} ${formatMetricNumber(selectedAthlete.wearableSync.sleepHours)}h`,
            icon: HeartPulse,
            tone: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
          },
          {
            label: isFa ? 'اعلان‌های جدید' : 'New notifications',
            value: formatMetricNumber(unreadNotifications.length, { maximumFractionDigits: 0 }),
            helper: isFa ? 'هشدارها و بازخوردهای تازه سیستم' : 'Fresh alerts and system feedback',
            icon: MessageSquare,
            tone: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
          },
        ];
        break;
      case 'coach':
      default:
        result.title = isFa ? 'داشبورد فرماندهی مربی' : 'Coach command dashboard';
        result.subtitle = isFa
          ? 'نمای مدیریتی با گزارش‌های قهرمان، هشدارهای فوری و وضعیت تیم.'
          : 'Management overview with hero metrics, urgent alerts, and team status.';
        result.cards = [
          {
            label: isFa ? 'آمادگی تیم' : 'Team readiness',
            value: formatPercent(averageRecovery),
            helper: isFa ? 'میانگین ریکاوری کل ورزشکاران' : 'Average recovery across athletes',
            icon: TrendingUp,
            tone: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
          },
          {
            label: isFa ? 'هشدارهای فوری' : 'Urgent alerts',
            value: formatMetricNumber(urgentAlerts.length, { maximumFractionDigits: 0 }),
            helper: isFa ? 'اقدامات باز مانده برای امروز' : 'Pending interventions for today',
            icon: BellRing,
            tone: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
          },
          {
            label: isFa ? 'ورزشکار منتخب' : 'Focused athlete',
            value: selectedAthlete.name,
            helper: `${isFa ? 'ریکاوری' : 'Recovery'} ${formatPercent(selectedAthlete.wearableSync.recoveryScore)} • ACWR ${formatMetricNumber(selectedAthlete.wearableSync.acwrRatio, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: UserRound,
            tone: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
          },
        ];
        break;
    }

    return result;
  }, [athletes, flaggedMarkers, isFa, roleView, selectedAthlete, totalSets, completedSets, unreadNotifications.length, urgentAlerts.length, workoutProgress]);

  const presetViews = useMemo(
    () => [
      {
        id: 'preset-triage',
        name: isFa ? 'Morning Triage' : 'Morning Triage',
        description: isFa ? 'نمای مربی + هشدارها + ورزشکار منتخب' : 'Coach view + alerts + focused athlete',
        role: 'coach' as RoleView,
        tab: 'coach' as AppTab,
      },
      {
        id: 'preset-medical',
        name: isFa ? 'Medical Round' : 'Medical Round',
        description: isFa ? 'نمای پزشکی + HRV + شاخص‌های ریسک' : 'Medical view + HRV + risk indicators',
        role: 'medical' as RoleView,
        tab: 'biometrics' as AppTab,
      },
      {
        id: 'preset-athlete',
        name: isFa ? 'Athlete Check-in' : 'Athlete Check-in',
        description: isFa ? 'نمای ورزشکار + پیشرفت برنامه و پیام‌ها' : 'Athlete view + plan progress and messages',
        role: 'athlete' as RoleView,
        tab: 'mobile_sim' as AppTab,
      },
      {
        id: 'preset-nutrition',
        name: isFa ? 'Nutrition Sweep' : 'Nutrition Sweep',
        description: isFa ? 'نمای تغذیه + کالری و پایبندی' : 'Nutrition view + calories and adherence',
        role: 'nutrition' as RoleView,
        tab: 'nutrition' as AppTab,
      },
    ],
    [isFa]
  );

  const applySavedView = (view: { roleView: RoleView; targetTab: AppTab; athleteId?: string }) => {
    onSetRoleView(view.roleView);
    if (view.athleteId) {
      const targetAthlete = athletes.find((athlete) => athlete.id === view.athleteId);
      if (targetAthlete) onSelectAthlete(targetAthlete);
    }
    onNavigateTab(view.targetTab);
  };

  const handleSaveCurrentView = () => {
    const name = savedViewName.trim() || `${getRoleLabel(roleView, lang)} • ${selectedAthlete.name}`;
    const createdAt = new Date().toLocaleString(isFa ? 'fa-IR' : 'en-US');
    const targetTab: AppTab = roleView === 'nutrition' ? 'nutrition' : roleView === 'athlete' ? 'mobile_sim' : roleView === 'medical' ? 'biometrics' : 'coach';
    setSavedViews((prev) => [
      {
        id: `view-${Date.now()}`,
        name,
        roleView,
        targetTab,
        athleteId: selectedAthlete.id,
        createdAt,
      },
      ...prev,
    ].slice(0, 8));
    setSavedViewName('');
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

  const exportTeamCsv = () => {
    const header = ['Athlete', 'Goal', 'RecoveryScore', 'ACWR', 'Compliance', 'Nutrition', 'Risk'];
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
    downloadFile('apexos-team-report.csv', csv, 'text/csv;charset=utf-8;');
  };

  const exportWorkspaceJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      roleView,
      athlete: selectedAthlete,
      heroCards: heroContent.cards,
      urgentAlerts: urgentAlerts.map((alert) => ({
        athlete: alert.athleteName,
        category: alert.category,
        action: alert.suggestedAction,
        reviewed: alert.reviewed ?? false,
        applied: alert.applied,
      })),
      workoutProgress,
    };
    downloadFile('apexos-workspace-snapshot.json', JSON.stringify(payload, null, 2), 'application/json;charset=utf-8;');
  };

  return (
    <div className="space-y-6" aria-label={isFa ? 'صفحه داشبورد' : 'Dashboard page'}>
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 shadow-2xl space-y-5" aria-labelledby="dashboard-hero-heading">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-[11px] font-black uppercase tracking-[0.18em]">
              <Sparkles className="w-3.5 h-3.5" />
              {getRoleLabel(roleView, lang)}
            </div>
            <h1 id="dashboard-hero-heading" className="text-2xl lg:text-3xl font-black text-white">
              {heroContent.title}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">{heroContent.subtitle}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigateTab('builder')}
              className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black inline-flex items-center gap-2 min-h-11"
            >
              <ArrowUpRight className="w-4 h-4" />
              {isFa ? 'حرکت به طراح تمرینات' : 'Open workout builder'}
            </button>
            <button
              onClick={() => onNavigateTab(roleView === 'nutrition' ? 'nutrition' : roleView === 'athlete' ? 'mobile_sim' : 'biometrics')}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold inline-flex items-center gap-2 min-h-11 border border-slate-700"
            >
              {isFa ? 'مشاهده ماژول تخصصی' : 'Open specialist module'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {heroContent.cards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.label} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-300 font-bold">{card.label}</div>
                    <div className="text-2xl font-black text-white mt-2 break-words">{card.value}</div>
                  </div>
                  <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${card.tone}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-slate-300 mt-4 leading-relaxed">{card.helper}</p>
              </article>
            );
          })}
        </div>
      </section>

      <PanelShell
        title={isFa ? 'Saved Views, Filters & Exports' : 'Saved Views, Filters & Exports'}
        subtitle={
          isFa
            ? 'ویوهای ذخیره‌شده برای نقش‌های مختلف، میانبرهای آماده و خروجی گزارش.'
            : 'Persistent saved views, role-specific presets, and quick exports.'
        }
        actions={
          <>
            <button
              onClick={exportTeamCsv}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold inline-flex items-center gap-2 min-h-11 border border-slate-700"
            >
              <ArrowDownToLine className="w-4 h-4 text-cyan-300" />
              {isFa ? 'خروجی CSV تیم' : 'Export team CSV'}
            </button>
            <button
              onClick={exportWorkspaceJson}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold inline-flex items-center gap-2 min-h-11 border border-slate-700"
            >
              <ArrowDownToLine className="w-4 h-4 text-emerald-300" />
              {isFa ? 'خروجی JSON فضای کار' : 'Export workspace JSON'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {presetViews.map((view) => (
                <button
                  key={view.id}
                  onClick={() => applySavedView({ roleView: view.role, targetTab: view.tab, athleteId: selectedAthlete.id })}
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-right hover:border-cyan-500/40 transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-black text-white text-sm">{view.name}</div>
                      <div className="text-xs text-slate-300 mt-2 leading-relaxed">{view.description}</div>
                    </div>
                    <Eye className="w-4 h-4 text-cyan-300 shrink-0" />
                  </div>
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <div className="font-bold text-white text-sm">{isFa ? 'ذخیره نمای فعلی' : 'Save current workspace view'}</div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={savedViewName}
                  onChange={(e) => setSavedViewName(e.target.value)}
                  placeholder={isFa ? 'نام نمای ذخیره‌شده...' : 'Saved view name...'}
                  className="flex-1 rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleSaveCurrentView}
                  className="px-4 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black inline-flex items-center justify-center gap-2 min-h-11"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  {isFa ? 'ذخیره نما' : 'Save view'}
                </button>
              </div>
            </div>
          </div>

          <div className="xl:col-span-5 space-y-3">
            {savedViews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 p-6 text-center text-sm text-slate-400">
                {isFa ? 'هنوز نمای ذخیره‌شده‌ای وجود ندارد.' : 'No saved workspace views yet.'}
              </div>
            ) : (
              savedViews.map((view) => (
                <div key={view.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-black text-white text-sm">{view.name}</div>
                      <div className="text-[11px] text-slate-400 mt-1">{view.createdAt}</div>
                    </div>
                    <span className="px-2 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 text-[10px] font-bold">
                      {getRoleLabel(view.roleView, lang)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300">{isFa ? 'ورزشکار:' : 'Athlete:'} {athletes.find((athlete) => athlete.id === view.athleteId)?.name ?? selectedAthlete.name}</div>
                  <button
                    onClick={() => applySavedView(view)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold inline-flex items-center justify-center gap-2 min-h-11 border border-slate-700"
                  >
                    <Eye className="w-4 h-4 text-cyan-300" />
                    {isFa ? 'بارگذاری این نما' : 'Load this view'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </PanelShell>

      {roleView === 'coach' && (
        <>
          <BusinessOpsCenter
            athleteCount={athletes.length}
            lang={lang}
            brand={brand}
            onNavigateTab={onNavigateTab}
            onExportExecutiveReport={onExportExecutiveReport}
            onExportAthletesCsv={onExportAthletesCsv}
          />

          <DemoStoryFlow
            brand={brand}
            lang={lang}
            onNavigateToVision={() => onNavigateTab('vision')}
            onNavigateToWorkouts={() => onNavigateTab('builder')}
            onNavigateToBusiness={() => onNavigateTab('coach')}
          />

          <TeamComparisonBoard
            athletes={athletes}
            selectedAthlete={selectedAthlete}
            onSelectAthlete={onSelectAthlete}
            lang={lang}
          />

          <StatCards
            avgHeartRateBpm={58}
            totalSprintKm={14.8}
            acwrStrainRatio={selectedAthlete.wearableSync.acwrRatio}
            teamReadinessPercent={88}
            lang={lang}
          />

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6" aria-label={isFa ? 'هشدارها و نمودار استقامت' : 'Alerts and stamina chart'}>
            <div className="lg:col-span-5">
              <ActiveAlerts alerts={aiRecommendations} onApplyAlert={onApplyAIRecommendation} lang={lang} />
            </div>
            <div className="lg:col-span-7">
              <StaminaChart lang={lang} />
            </div>
          </section>

          <CoachDashboard
            athletes={athletes}
            selectedAthlete={selectedAthlete}
            onSelectAthlete={onSelectAthlete}
            aiRecommendations={aiRecommendations}
            onApplyAIRecommendation={onApplyAIRecommendation}
            onNavigateTab={onNavigateTab}
            onAddAthlete={onAddAthlete}
            onAssignQuickPlan={onAssignQuickPlan}
            lang={lang}
          />
        </>
      )}

      {roleView === 'medical' && (
        <PanelShell
          title={isFa ? 'Medical Snapshot' : 'Medical Snapshot'}
          subtitle={isFa ? 'نمای سریع برای تیم پزشکی و تصمیم‌گیری مبتنی بر ریسک.' : 'Fast view for medical decision-making and risk triage.'}
          actions={
            <button onClick={() => onNavigateTab('biometrics')} className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black min-h-11">
              {isFa ? 'ورود به ماژول پزشکی' : 'Open medical suite'}
            </button>
          }
        >
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-5">
              <ActiveAlerts alerts={aiRecommendations} onApplyAlert={onApplyAIRecommendation} lang={lang} />
            </div>
            <div className="xl:col-span-7 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-300 font-bold">HRV</div>
                  <div className="text-3xl font-black text-cyan-300 mt-2">{formatMetricNumber(selectedAthlete.wearableSync.hrvMs, { maximumFractionDigits: 0 })} ms</div>
                  <p className="text-xs text-slate-300 mt-3">{isFa ? 'آخرین همگام‌سازی:' : 'Last sync:'} {selectedAthlete.wearableSync.lastSynced}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-300 font-bold">ACWR</div>
                  <div className="text-3xl font-black text-amber-300 mt-2">{formatMetricNumber(selectedAthlete.wearableSync.acwrRatio, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <p className="text-xs text-slate-300 mt-3">{selectedAthlete.riskReason ?? (isFa ? 'بدون هشدار حاد' : 'No critical risk note')}</p>
                </div>
              </div>
              <StaminaChart lang={lang} />
            </div>
          </div>
        </PanelShell>
      )}

      {roleView === 'nutrition' && (
        <PanelShell
          title={isFa ? 'Nutrition Snapshot' : 'Nutrition Snapshot'}
          subtitle={isFa ? 'مرور سریع کالری، پروتئین، آبرسانی و پایبندی.' : 'Fast review of calories, protein, hydration, and adherence.'}
          actions={
            <button onClick={() => onNavigateTab('nutrition')} className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black min-h-11">
              {isFa ? 'ورود به ماژول تغذیه' : 'Open nutrition studio'}
            </button>
          }
        >
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-300 font-bold">Calories</div>
                  <div className="text-2xl font-black text-white mt-2">{formatMetricNumber(selectedAthlete.caloriesLogged, { maximumFractionDigits: 0 })}</div>
                  <p className="text-xs text-slate-300 mt-3">{isFa ? 'از هدف' : 'of target'} {formatMetricNumber(selectedAthlete.caloriesTarget, { maximumFractionDigits: 0 })} kcal</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-300 font-bold">Protein</div>
                  <div className="text-2xl font-black text-cyan-300 mt-2">{formatMetricNumber(selectedAthlete.proteinLoggedG)}g</div>
                  <p className="text-xs text-slate-300 mt-3">{isFa ? 'هدف' : 'Target'} {formatMetricNumber(selectedAthlete.proteinTargetG, { maximumFractionDigits: 0 })}g</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-300 font-bold">Hydration</div>
                  <div className="text-2xl font-black text-blue-300 mt-2">{formatMetricNumber(selectedAthlete.hydrationOzLogged, { maximumFractionDigits: 0 })} oz</div>
                  <p className="text-xs text-slate-300 mt-3">{isFa ? 'از هدف' : 'of target'} {formatMetricNumber(selectedAthlete.hydrationOzTarget, { maximumFractionDigits: 0 })} oz</p>
                </div>
              </div>
            </div>
            <div className="xl:col-span-5">
              <ActiveAlerts alerts={aiRecommendations} onApplyAlert={onApplyAIRecommendation} lang={lang} />
            </div>
          </div>
        </PanelShell>
      )}

      {roleView === 'athlete' && (
        <PanelShell
          title={isFa ? 'Athlete Quick Access' : 'Athlete Quick Access'}
          subtitle={isFa ? 'خلاصه برنامه، پیشرفت و مسیر سریع به داشبورد ورزشکار.' : 'Plan summary, progress, and quick jump into the athlete dashboard.'}
          actions={
            <button onClick={() => onNavigateTab('mobile_sim')} className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black min-h-11">
              {isFa ? 'ورود به داشبورد ورزشکار' : 'Open athlete dashboard'}
            </button>
          }
        >
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-7 space-y-3">
              {program.days.slice(0, 2).map((day) => (
                <article key={day.dayName} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="text-sm font-black text-white">{day.dayName}</div>
                  <div className="text-xs text-slate-300 mt-1">{day.focus}</div>
                  <div className="text-xs text-cyan-300 mt-3">{day.exercises.length} {isFa ? 'حرکت' : 'exercises'}</div>
                </article>
              ))}
            </div>
            <div className="xl:col-span-5">
              <StaminaChart lang={lang} />
            </div>
          </div>
        </PanelShell>
      )}
    </div>
  );
};

export default DashboardPage;

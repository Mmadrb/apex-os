import React, { useMemo, useState } from 'react';
import {
  BarChart3,
  CreditCard,
  Download,
  FolderKanban,
  Globe2,
  PlugZap,
  Receipt,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Wallet,
  Waypoints,
} from 'lucide-react';
import type { AppTab } from '../utils/formatters';
import type { BrandConfig } from '../utils/branding';
import { getAccentClasses } from '../utils/branding';
import { formatMetricNumber, formatPercent } from '../utils/formatters';
import { ActionButton } from './ui/ActionButton';
import { EmptyState } from './ui/EmptyState';
import { ErrorState } from './ui/ErrorState';
import { PanelShell } from './ui/PanelShell';

type OpsTab = 'analytics' | 'billing' | 'integrations' | 'collaboration';

interface BusinessOpsCenterProps {
  athleteCount: number;
  lang?: 'fa' | 'en';
  brand: BrandConfig;
  onNavigateTab: (tab: AppTab) => void;
  onExportExecutiveReport: () => void;
  onExportAthletesCsv: () => void;
}

export const BusinessOpsCenter: React.FC<BusinessOpsCenterProps> = ({
  athleteCount,
  lang = 'fa',
  brand,
  onNavigateTab,
  onExportExecutiveReport,
  onExportAthletesCsv,
}) => {
  const isFa = lang === 'fa';
  const [activeTab, setActiveTab] = useState<OpsTab>('analytics');
  const accent = getAccentClasses(brand.accent);

  const tabs = [
    { id: 'analytics' as const, label: isFa ? 'تحلیل و گزارش' : 'Analytics & Reports', icon: BarChart3 },
    { id: 'billing' as const, label: isFa ? 'اشتراک و صورتحساب' : 'Billing & SaaS', icon: CreditCard },
    { id: 'integrations' as const, label: isFa ? 'API و اینتگریشن' : 'API & Integrations', icon: PlugZap },
    { id: 'collaboration' as const, label: isFa ? 'همکاری مربیان' : 'Coach Collaboration', icon: UsersRound },
  ];

  const analyticsCards = useMemo(
    () => [
      {
        title: isFa ? 'ظرفیت مربی' : 'Coach capacity',
        value: '10x',
        helper: isFa ? 'هر مربی به جای ۳۰، تا ۳۰۰ ورزشکار را پوشش می‌دهد.' : '1 coach scales from 30 to 300 athletes.',
      },
      {
        title: isFa ? 'نرخ ماندگاری پایلوت' : 'Pilot retention',
        value: formatPercent(94),
        helper: isFa ? 'هدف ۹۰ روزه برای اثبات ارزش SaaS' : '90-day pilot benchmark for SaaS proof.',
      },
      {
        title: isFa ? 'کاهش زمان اداری' : 'Admin time saved',
        value: formatPercent(78),
        helper: isFa ? 'کاهش کار دستی مربیان با هشدارها و اتوماسیون' : 'Reduced manual admin through alerts and automation.',
      },
      {
        title: isFa ? 'ورزشکاران فعال' : 'Active athletes',
        value: formatMetricNumber(athleteCount, { maximumFractionDigits: 0 }),
        helper: isFa ? 'پایه گزارش‌های رشد و ظرفیت' : 'Base layer for growth and scale reporting.',
      },
    ],
    [athleteCount, isFa]
  );

  const billingCards = useMemo(
    () => [
      {
        name: isFa ? 'Coach Pro' : 'Coach Pro',
        price: '$149/mo',
        status: isFa ? '۲۴ صندلی فعال' : '24 active seats',
        detail: isFa ? 'مربیان انفرادی و استودیوهای کوچک' : 'Solo coaches and boutique studios',
      },
      {
        name: isFa ? 'Gym OS' : 'Gym OS',
        price: '$899/mo',
        status: isFa ? '۶ باشگاه در پایلوت' : '6 gyms in pilot',
        detail: isFa ? 'وایت‌لیبل + آنالیتیکس + نگهداشت مشتری' : 'White-label + analytics + retention tools',
      },
      {
        name: isFa ? 'Enterprise White Label' : 'Enterprise White Label',
        price: '$2,900/mo',
        status: isFa ? '۲ قرارداد در مذاکره' : '2 deals in negotiation',
        detail: isFa ? 'چند شعبه، API و برند اختصاصی' : 'Multi-site, API, and custom brand stack',
      },
    ],
    [isFa]
  );

  const integrations = useMemo(
    () => [
      { name: 'WHOOP', status: isFa ? 'متصل' : 'Connected', latency: '220ms', uptime: '99.98%' },
      { name: 'Apple Health', status: isFa ? 'همگام' : 'Synced', latency: '310ms', uptime: '99.92%' },
      { name: 'Garmin', status: isFa ? 'در حال مانیتور' : 'Monitoring', latency: '420ms', uptime: '99.74%' },
      { name: 'Oura', status: isFa ? 'فعال' : 'Active', latency: '295ms', uptime: '99.89%' },
      { name: 'Stripe Billing', status: isFa ? 'سالم' : 'Healthy', latency: '180ms', uptime: '99.99%' },
      { name: 'Apex API Layer', status: isFa ? 'بدون خطا' : 'Stable', latency: '145ms', uptime: '99.995%' },
    ],
    [isFa]
  );

  const collaboration = useMemo(
    () => [
      {
        coach: isFa ? 'استاد مارکوس ونس' : 'Coach Marcus Vance',
        role: isFa ? 'سرمربی / برنامه‌ریز' : 'Head Coach / Programming',
        task: isFa ? 'بازبینی هشدارهای صبحگاهی و تخصیص deload' : 'Review morning alerts and assign deloads',
      },
      {
        coach: isFa ? 'سارا میلر' : 'Sarah Miller',
        role: isFa ? 'قدرت و پاورلیفتینگ' : 'Strength & Powerlifting',
        task: isFa ? 'تأیید تغییرات فاز قدرت برای ۱۲ ورزشکار' : 'Approve strength phase changes for 12 athletes',
      },
      {
        coach: isFa ? 'لیا برنر' : 'Leah Brenner',
        role: isFa ? 'تغذیه و ریکاوری' : 'Nutrition & Recovery',
        task: isFa ? 'بازتنظیم کالری ۸ ورزشکار مسابقه‌ای' : 'Re-tune calories for 8 competition athletes',
      },
    ],
    [isFa]
  );

  const degradedIntegrations = integrations.filter((integration) => parseFloat(integration.uptime) < 99.8);

  return (
    <PanelShell
      title={isFa ? 'Phase 5 Operating Layer' : 'Phase 5 Operating Layer'}
      subtitle={
        isFa
          ? 'تحلیل، درآمد SaaS، API و همکاری چندمربی برای تبدیل ApexOS به سیستم عملیاتی کامل.'
          : 'Analytics, SaaS revenue, API infrastructure, and multi-coach workflows that elevate ApexOS into a full operating system.'
      }
      actions={
        <>
          <ActionButton variant="secondary" icon={<Download className="w-4 h-4 text-cyan-300" />} onClick={onExportExecutiveReport}>
            {isFa ? 'گزارش اجرایی' : 'Executive report'}
          </ActionButton>
          <ActionButton variant="secondary" icon={<Receipt className="w-4 h-4 text-emerald-300" />} onClick={onExportAthletesCsv}>
            {isFa ? 'خروجی CSV' : 'Export CSV'}
          </ActionButton>
        </>
      }
    >
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-bold min-h-11 inline-flex items-center gap-2 transition-all ${
                isActive ? `${accent.soft} ring-1 ${accent.ring}` : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'analytics' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {analyticsCards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-300 font-bold">{card.title}</div>
                <div className="text-2xl font-black text-white mt-2">{card.value}</div>
                <div className="text-xs text-slate-400 mt-3 leading-relaxed">{card.helper}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <div className="xl:col-span-7 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
              <div className="flex items-center gap-2 text-white font-black text-sm">
                <FolderKanban className={`w-4 h-4 ${accent.text}`} />
                {isFa ? 'Report Center' : 'Report Center'}
              </div>
              <div className="space-y-3">
                {[
                  {
                    title: isFa ? 'Board Snapshot' : 'Board Snapshot',
                    detail: isFa ? 'MRR، رشد، ظرفیت مربیان و هشدارهای بحرانی' : 'MRR, growth, coach capacity, and critical alerts',
                  },
                  {
                    title: isFa ? 'Coach Efficiency Review' : 'Coach Efficiency Review',
                    detail: isFa ? 'زمان ذخیره‌شده، بار مراجعات و نرخ پاسخ مربیان' : 'Time saved, request load, and response quality',
                  },
                  {
                    title: isFa ? 'Athlete Risk Summary' : 'Athlete Risk Summary',
                    detail: isFa ? 'ریسک‌های باز، روند HRV و ACWR' : 'Open risks, HRV patterns, and ACWR movements',
                  },
                ].map((report) => (
                  <div key={report.title} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-white text-sm">{report.title}</div>
                      <div className="text-xs text-slate-400 mt-2">{report.detail}</div>
                    </div>
                    <ActionButton variant="ghost" icon={<Download className="w-4 h-4 text-cyan-300" />} onClick={onExportExecutiveReport}>
                      {isFa ? 'دریافت' : 'Export'}
                    </ActionButton>
                  </div>
                ))}
              </div>
            </div>

            <div className="xl:col-span-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
              <div className="flex items-center gap-2 text-white font-black text-sm">
                <Sparkles className={`w-4 h-4 ${accent.text}`} />
                {isFa ? 'Investor Snapshot' : 'Investor Snapshot'}
              </div>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <div className="font-bold text-white">{isFa ? 'داستان محصول' : 'Product story'}</div>
                  <div className="mt-2">{isFa ? 'ApexOS مربیان را به سیستم‌های تصمیم‌گیری مقیاس‌پذیر تبدیل می‌کند.' : 'ApexOS turns coaches into scalable performance systems.'}</div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <div className="font-bold text-white">{isFa ? 'کشش بازار' : 'Market traction'}</div>
                  <div className="mt-2">{isFa ? '۶ باشگاه، ۲۴۰ ورزشکار و ۹۴٪ ماندگاری در پایلوت.' : '6 gyms, 240 athletes, and 94% retention in pilot.'}</div>
                </div>
                <ActionButton variant="primary" icon={<BarChart3 className="w-4 h-4" />} onClick={onNavigateTab.bind(null, 'coach')} className="w-full">
                  {isFa ? 'بازگشت به هاب مدیریتی' : 'Back to command hub'}
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {billingCards.map((plan) => (
                <div key={plan.name} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-300 font-bold">{plan.name}</div>
                  <div className="text-2xl font-black text-white">{plan.price}</div>
                  <div className={`inline-flex px-2 py-1 rounded-full border text-[10px] font-bold ${accent.soft}`}>{plan.status}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{plan.detail}</div>
                </div>
              ))}
            </div>

            <div className="xl:col-span-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
              <div className="flex items-center gap-2 text-white font-black text-sm">
                <Wallet className={`w-4 h-4 ${accent.text}`} />
                {isFa ? 'Revenue Snapshot' : 'Revenue Snapshot'}
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                  <div className="text-slate-400">MRR</div>
                  <div className="text-xl font-black text-white mt-2">$18.4K</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                  <div className="text-slate-400">ARR</div>
                  <div className="text-xl font-black text-emerald-300 mt-2">$220K</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                  <div className="text-slate-400">{isFa ? 'نرخ تمدید' : 'Renewal rate'}</div>
                  <div className="text-xl font-black text-cyan-300 mt-2">96%</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                  <div className="text-slate-400">{isFa ? 'باز شدن فاکتور' : 'Invoices paid'}</div>
                  <div className="text-xl font-black text-amber-300 mt-2">32/34</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-white font-black text-sm">
              <Receipt className={`w-4 h-4 ${accent.text}`} />
              {isFa ? 'Renewal & Invoice Pipeline' : 'Renewal & Invoice Pipeline'}
            </div>
            <div className="space-y-2 text-xs">
              {[
                { client: 'Apex Frankfurt', amount: '$2,900', due: isFa ? '۳ روز دیگر' : 'Due in 3 days', status: isFa ? 'در انتظار تأیید' : 'Pending approval' },
                { client: 'CoreForge Gym', amount: '$899', due: isFa ? 'امروز' : 'Due today', status: isFa ? 'ارسال شد' : 'Sent' },
                { client: 'Pulse Athlete Lab', amount: '$149', due: isFa ? '۷ روز دیگر' : 'Due in 7 days', status: isFa ? 'خودکار' : 'Auto-renew' },
              ].map((invoice) => (
                <div key={invoice.client} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-white">{invoice.client}</div>
                    <div className="text-slate-400 mt-1">{invoice.due}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-white">{invoice.amount}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{invoice.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="space-y-5">
          {degradedIntegrations.length > 0 ? (
            <ErrorState
              title={isFa ? 'چند اینتگریشن نیاز به بررسی دارند' : 'A few integrations need attention'}
              description={isFa ? `سرویس‌های ${degradedIntegrations.map((item) => item.name).join('، ')} زیر آستانه سلامت ایده‌آل هستند.` : `${degradedIntegrations.map((item) => item.name).join(', ')} are below the ideal health threshold.`}
              action={<ActionButton variant="secondary" onClick={onExportExecutiveReport}>{isFa ? 'ارسال در گزارش اجرایی' : 'Include in executive report'}</ActionButton>}
            />
          ) : (
            <EmptyState
              title={isFa ? 'همه اینتگریشن‌ها پایدار هستند' : 'All integrations are healthy'}
              description={isFa ? 'در این لحظه هیچ اختلال بحرانی در لایه API و سرویس‌های متصل وجود ندارد.' : 'There are no critical incidents across the API and connected services right now.'}
              icon={<ShieldCheck className="w-5 h-5" />}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {integrations.map((integration) => (
              <div key={integration.name} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-black text-white text-sm">{integration.name}</div>
                  <span className={`px-2 py-1 rounded-full border text-[10px] font-bold ${accent.soft}`}>{integration.status}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-slate-400">{isFa ? 'Latency' : 'Latency'}</div>
                    <div className="text-white font-bold mt-1">{integration.latency}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Uptime</div>
                    <div className="text-emerald-300 font-bold mt-1">{integration.uptime}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="flex items-center gap-2 text-white font-black text-sm"><Waypoints className={`w-4 h-4 ${accent.text}`} /> {isFa ? 'وب‌هوک‌ها' : 'Webhook Queue'}</div>
              <div className="text-3xl font-black text-white mt-4">128</div>
              <div className="text-xs text-slate-400 mt-2">{isFa ? 'رویدادهای در صف، ۹۹.۴٪ تحویل موفق' : 'Queued events with 99.4% successful delivery'}</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="flex items-center gap-2 text-white font-black text-sm"><Globe2 className={`w-4 h-4 ${accent.text}`} /> {isFa ? 'API Health' : 'API Health'}</div>
              <div className="text-3xl font-black text-cyan-300 mt-4">99.97%</div>
              <div className="text-xs text-slate-400 mt-2">{isFa ? 'میانگین uptime هسته API و سرویس‌های جانبی' : 'Average uptime across the API core and supporting services'}</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="flex items-center gap-2 text-white font-black text-sm"><ShieldCheck className={`w-4 h-4 ${accent.text}`} /> {isFa ? 'اعتبار داده' : 'Data trust layer'}</div>
              <div className="text-3xl font-black text-emerald-300 mt-4">86%</div>
              <div className="text-xs text-slate-400 mt-2">{isFa ? 'شاخص صحت سیگنال‌ها و داده‌های ورودی' : 'Signal quality and input data confidence score'}</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'collaboration' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <div className="xl:col-span-7 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
              <div className="flex items-center gap-2 text-white font-black text-sm">
                <UsersRound className={`w-4 h-4 ${accent.text}`} />
                {isFa ? 'Coach Collaboration Board' : 'Coach Collaboration Board'}
              </div>
              {collaboration.map((item) => (
                <div key={item.coach} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-black text-white text-sm">{item.coach}</div>
                    <div className="text-xs text-slate-400 mt-1">{item.role}</div>
                    <div className="text-xs text-slate-300 mt-3 leading-relaxed">{item.task}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full border text-[10px] font-bold ${accent.soft}`}>{isFa ? 'فعال' : 'Active'}</span>
                </div>
              ))}
            </div>

            <div className="xl:col-span-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
              <div className="flex items-center gap-2 text-white font-black text-sm">
                <FolderKanban className={`w-4 h-4 ${accent.text}`} />
                {isFa ? 'Workflow Actions' : 'Workflow Actions'}
              </div>
              <div className="space-y-2">
                <ActionButton variant="secondary" onClick={() => onNavigateTab('roster')} className="w-full justify-between">
                  {isFa ? 'باز کردن مدیریت ورزشکاران' : 'Open athlete management'}
                </ActionButton>
                <ActionButton variant="secondary" onClick={() => onNavigateTab('builder')} className="w-full justify-between">
                  {isFa ? 'ارسال همکاری به طراح تمرینات' : 'Hand off to workout builder'}
                </ActionButton>
                <ActionButton variant="secondary" onClick={() => onNavigateTab('biometrics')} className="w-full justify-between">
                  {isFa ? 'ارجاع به تیم پزشکی' : 'Send to medical team'}
                </ActionButton>
                <ActionButton variant="secondary" onClick={() => onNavigateTab('nutrition')} className="w-full justify-between">
                  {isFa ? 'ارجاع به تغذیه' : 'Hand off to nutrition'}
                </ActionButton>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-300 leading-relaxed">
                {isFa
                  ? '۳ درخواست تأیید، ۲ بازبینی برنامه و ۱ ارجاع پزشکی در صف همکاری وجود دارد.'
                  : 'There are 3 approval requests, 2 programming reviews, and 1 medical handoff in the collaboration queue.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </PanelShell>
  );
};

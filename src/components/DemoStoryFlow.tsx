import React from 'react';
import {
  ArrowRight,
  Building2,
  Camera,
  Cpu,
  LineChart,
  ShieldCheck,
} from 'lucide-react';
import type { BrandConfig } from '../utils/branding';
import { getAccentClasses } from '../utils/branding';
import { ActionButton } from './ui/ActionButton';
import { PanelShell } from './ui/PanelShell';

type Step = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

interface DemoStoryFlowProps {
  brand: BrandConfig;
  lang?: 'fa' | 'en';
  onNavigateToWorkouts: () => void;
  onNavigateToVision: () => void;
  onNavigateToBusiness: () => void;
}

export const DemoStoryFlow: React.FC<DemoStoryFlowProps> = ({
  brand,
  lang = 'fa',
  onNavigateToWorkouts,
  onNavigateToVision,
  onNavigateToBusiness,
}) => {
  const isFa = lang === 'fa';
  const accent = getAccentClasses(brand.accent);

  const steps: Step[] = [
    {
      title: isFa ? 'مشکل' : 'Problem',
      description: isFa ? 'مربیان نمی‌توانند بدن انسان را در مقیاس بالا با دقت مدیریت کنند.' : 'Coaches cannot manage human bodies at scale with precision.',
      icon: Building2,
    },
    {
      title: isFa ? 'سیگنال' : 'Signal',
      description: isFa ? 'داده‌های پوشیدنی، تغذیه، خواب و تمرین وارد هسته داده می‌شوند.' : 'Wearables, sleep, nutrition, and training feed the data core.',
      icon: LineChart,
    },
    {
      title: isFa ? 'تحلیل AI' : 'AI Analysis',
      description: isFa ? 'بینایی ماشین و مدل توصیه‌گر، ریسک و فرصت را کشف می‌کنند.' : 'Vision and recommendation engines detect risk and opportunity.',
      icon: Camera,
    },
    {
      title: isFa ? 'تصمیم' : 'Decision',
      description: isFa ? 'مربی با یک لایه شواهد‌دار تصمیم را تأیید یا بازتنظیم می‌کند.' : 'Coach confirms or adjusts decisions with an evidence layer.',
      icon: Cpu,
    },
    {
      title: isFa ? 'نتیجه' : 'Outcome',
      description: isFa ? 'نگهداشت، عملکرد و ظرفیت مربی در سطح SaaS رشد می‌کند.' : 'Retention, performance, and coach capacity scale up as SaaS outcomes.',
      icon: ShieldCheck,
    },
  ];

  return (
    <PanelShell
      title={isFa ? 'Investor-Grade Demo Story Flow' : 'Investor-Grade Demo Story Flow'}
      subtitle={
        isFa
          ? 'روایت نهایی برای دمو: داده → تحلیل → تصمیم → نتیجه → مقیاس.'
          : 'The polished product story for demos: data → analysis → decision → outcome → scale.'
      }
      actions={
        <div className="flex flex-wrap gap-2">
          <ActionButton variant="primary" icon={<Camera className="w-4 h-4" />} onClick={onNavigateToVision}>
            {isFa ? 'باز کردن آنالیز حرکت' : 'Open motion analysis'}
          </ActionButton>
          <ActionButton variant="secondary" icon={<LineChart className="w-4 h-4 text-cyan-300" />} onClick={onNavigateToWorkouts}>
            {isFa ? 'باز کردن طراح تمرینات' : 'Open workout builder'}
          </ActionButton>
          <ActionButton variant="secondary" icon={<Building2 className="w-4 h-4 text-cyan-300" />} onClick={onNavigateToBusiness}>
            {isFa ? 'بازگشت به لایه کسب‌وکار' : 'Go to business layer'}
          </ActionButton>
        </div>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="relative rounded-2xl border border-slate-800 bg-slate-950/60 p-5 hover:-translate-y-1 transition-transform duration-200">
              <div className={`w-11 h-11 rounded-2xl border ${accent.soft} flex items-center justify-center mb-4`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-sm font-black text-white">{step.title}</div>
              <div className="text-xs text-slate-400 mt-3 leading-relaxed">{step.description}</div>
              {index < steps.length - 1 ? <ArrowRight className={`hidden xl:block absolute -right-3 top-10 w-5 h-5 ${accent.text}`} /> : null}
            </div>
          );
        })}
      </div>
    </PanelShell>
  );
};

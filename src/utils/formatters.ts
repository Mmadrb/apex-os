export const VALID_TABS = [
  'coach',
  'roster',
  'biometrics',
  'vision',
  'builder',
  'nutrition',
  'profile360',
  'mobile_sim',
] as const;

export type AppTab = (typeof VALID_TABS)[number];
export type RoleView = 'coach' | 'athlete' | 'nutrition' | 'medical';

export const TAB_PATHS: Record<AppTab, string> = {
  coach: '/dashboard',
  roster: '/athletes',
  biometrics: '/medical',
  vision: '/motion-analysis',
  builder: '/workouts',
  nutrition: '/nutrition',
  profile360: '/profile-360',
  mobile_sim: '/athlete-dashboard',
};

export function isValidTab(value: string): value is AppTab {
  return (VALID_TABS as readonly string[]).includes(value);
}

export function getTabFromPath(pathname: string): AppTab {
  const entry = Object.entries(TAB_PATHS).find(([, path]) => path === pathname);
  return (entry?.[0] as AppTab | undefined) ?? 'coach';
}

export function getPathFromTab(tab: AppTab) {
  return TAB_PATHS[tab];
}

export function formatMetricNumber(value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    ...options,
  }).format(value);
}

export function formatPercent(value: number, fractionDigits = 0) {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value)}%`;
}

export function formatCount(value: number, lang: 'fa' | 'en') {
  return new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US', {
    maximumFractionDigits: 0,
  }).format(value);
}

export function getTabLabel(tab: AppTab, lang: 'fa' | 'en') {
  const labels: Record<AppTab, { fa: string; en: string }> = {
    coach: { fa: 'داشبورد', en: 'Dashboard' },
    roster: { fa: 'ورزشکاران', en: 'Athletes' },
    biometrics: { fa: 'پزشکی و بیومتریک', en: 'Medical & Biometrics' },
    vision: { fa: 'آنالیز حرکت', en: 'Motion Analysis' },
    builder: { fa: 'طراح تمرینات', en: 'Workout Builder' },
    nutrition: { fa: 'تغذیه', en: 'Nutrition' },
    profile360: { fa: 'پروفایل ۳۶۰', en: '360 Profile' },
    mobile_sim: { fa: 'داشبورد ورزشکار', en: 'Athlete Dashboard' },
  };

  return lang === 'fa' ? labels[tab].fa : labels[tab].en;
}

export function getRoleLabel(role: RoleView, lang: 'fa' | 'en') {
  const labels: Record<RoleView, { fa: string; en: string }> = {
    coach: { fa: 'نمای مربی', en: 'Coach View' },
    athlete: { fa: 'نمای ورزشکار', en: 'Athlete View' },
    nutrition: { fa: 'نمای تغذیه', en: 'Nutrition View' },
    medical: { fa: 'نمای پزشکی', en: 'Medical View' },
  };

  return lang === 'fa' ? labels[role].fa : labels[role].en;
}

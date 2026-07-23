export type BrandAccent = 'cyan' | 'emerald' | 'violet';

export interface BrandConfig {
  organizationName: string;
  productName: string;
  tagline: string;
  accent: BrandAccent;
}

export const DEFAULT_BRAND: BrandConfig = {
  organizationName: 'Apex Performance Group',
  productName: 'APEXOS',
  tagline: 'Human Performance & Longevity OS',
  accent: 'cyan',
};

export function getAccentClasses(accent: BrandAccent) {
  const map = {
    cyan: {
      gradient: 'from-cyan-500 via-blue-600 to-indigo-600',
      soft: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
      text: 'text-cyan-300',
      ring: 'ring-cyan-500/30',
      button: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950',
    },
    emerald: {
      gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
      soft: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      text: 'text-emerald-300',
      ring: 'ring-emerald-500/30',
      button: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
    },
    violet: {
      gradient: 'from-violet-500 via-fuchsia-600 to-indigo-600',
      soft: 'bg-violet-500/10 border-violet-500/30 text-violet-300',
      text: 'text-violet-300',
      ring: 'ring-violet-500/30',
      button: 'bg-violet-500 hover:bg-violet-400 text-white',
    },
  } as const;

  return map[accent];
}

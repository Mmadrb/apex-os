import React from 'react';
import { Palette, Wand2 } from 'lucide-react';
import type { BrandConfig, BrandAccent } from '../utils/branding';
import { getAccentClasses } from '../utils/branding';
import { ActionButton } from './ui/ActionButton';
import { PanelShell } from './ui/PanelShell';

interface BrandStudioProps {
  open: boolean;
  onClose: () => void;
  brand: BrandConfig;
  onChange: (brand: BrandConfig) => void;
  lang?: 'fa' | 'en';
}

const presets = [
  {
    organizationName: 'Apex Performance Group',
    productName: 'APEXOS',
    tagline: 'Human Performance & Longevity OS',
    accent: 'cyan' as BrandAccent,
  },
  {
    organizationName: 'PulseForge Athletics',
    productName: 'PULSEOS',
    tagline: 'Performance Intelligence Platform',
    accent: 'emerald' as BrandAccent,
  },
  {
    organizationName: 'Titan Lab Systems',
    productName: 'TITAN CORE',
    tagline: 'Elite Coaching Command Center',
    accent: 'violet' as BrandAccent,
  },
];

export const BrandStudio: React.FC<BrandStudioProps> = ({ open, onClose, brand, onChange, lang = 'fa' }) => {
  const isFa = lang === 'fa';
  const accent = getAccentClasses(brand.accent);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button type="button" aria-label={isFa ? 'بستن استودیوی برند' : 'Close brand studio'} className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl">
        <PanelShell
          title={isFa ? 'White-Label Brand Studio' : 'White-Label Brand Studio'}
          subtitle={
            isFa
              ? 'نام سازمان، محصول، تگ‌لاین و رنگ برند را برای نسخه وایت‌لیبل تنظیم کنید.'
              : 'Configure organization, product, tagline, and accent color for the white-label experience.'
          }
          actions={<ActionButton variant="ghost" onClick={onClose}>{isFa ? 'بستن' : 'Close'}</ActionButton>}
          className="relative"
        >
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-7 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-xs text-slate-300 font-bold">{isFa ? 'نام سازمان' : 'Organization name'}</span>
                  <input
                    value={brand.organizationName}
                    onChange={(e) => onChange({ ...brand, organizationName: e.target.value })}
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs text-slate-300 font-bold">{isFa ? 'نام محصول' : 'Product name'}</span>
                  <input
                    value={brand.productName}
                    onChange={(e) => onChange({ ...brand, productName: e.target.value.toUpperCase() })}
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </label>
              </div>

              <label className="space-y-2 block">
                <span className="text-xs text-slate-300 font-bold">{isFa ? 'تگ‌لاین' : 'Tagline'}</span>
                <input
                  value={brand.tagline}
                  onChange={(e) => onChange({ ...brand, tagline: e.target.value })}
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </label>

              <div className="space-y-3">
                <div className="text-xs text-slate-300 font-bold flex items-center gap-2"><Palette className="w-4 h-4 text-cyan-300" /> {isFa ? 'رنگ برند' : 'Brand accent'}</div>
                <div className="grid grid-cols-3 gap-3">
                  {(['cyan', 'emerald', 'violet'] as BrandAccent[]).map((value) => {
                    const tone = getAccentClasses(value);
                    const isActive = brand.accent === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => onChange({ ...brand, accent: value })}
                        className={`rounded-2xl border px-4 py-4 text-xs font-black transition-all ${tone.soft} ${isActive ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-white/40' : ''}`}
                      >
                        {value.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-xs text-slate-300 font-bold flex items-center gap-2"><Wand2 className="w-4 h-4 text-cyan-300" /> {isFa ? 'پریست‌های سریع' : 'Quick presets'}</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {presets.map((preset) => (
                    <button
                      key={preset.productName}
                      type="button"
                      onClick={() => onChange(preset)}
                      className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-right hover:border-slate-700 transition-all"
                    >
                      <div className="font-black text-white text-sm">{preset.productName}</div>
                      <div className="text-xs text-slate-300 mt-2">{preset.organizationName}</div>
                      <div className="text-[11px] text-slate-400 mt-2">{preset.tagline}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="xl:col-span-5">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 space-y-4 sticky top-0">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">{isFa ? 'پیش‌نمایش برند' : 'Brand preview'}</div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${accent.gradient} flex items-center justify-center text-white font-black text-2xl shadow-xl`}>
                  {brand.productName.slice(0, 1) || 'A'}
                </div>
                <div>
                  <div className="text-xl font-black text-white break-words">{brand.productName}</div>
                  <div className="text-sm text-slate-300 mt-1">{brand.organizationName}</div>
                  <div className={`text-xs mt-2 ${accent.text}`}>{brand.tagline}</div>
                </div>
                <div className={`rounded-2xl border px-4 py-3 ${accent.soft}`}>
                  <div className="text-[11px] font-bold uppercase">{isFa ? 'استایل فعال' : 'Active style'}</div>
                  <div className="text-xs mt-2">{isFa ? 'این تنظیمات روی برندینگ هدر و سایدبار اعمال می‌شود.' : 'These settings are applied to the header and sidebar branding.'}</div>
                </div>
              </div>
            </div>
          </div>
        </PanelShell>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import type { FranchiseLocation } from '../types';
import { 
  Globe, 
  Smartphone, 
  Palette, 
  ArrowUpRight
} from 'lucide-react';

interface FranchiseHQProps {
  franchises: FranchiseLocation[];
  lang?: 'en' | 'fa';
}

export const FranchiseHQ: React.FC<FranchiseHQProps> = ({ franchises, lang = 'fa' }) => {
  const isFa = lang === 'fa';
  const [activeSubTab, setActiveSubTab] = useState<'branches' | 'coaches' | 'white_label'>('branches');
  
  // White Label Branding States
  const [brandName, setBrandName] = useState<string>(isFa ? 'باشگاه اپکس فیتنس' : 'Apex Fitness Hub');
  const [primaryColor, setPrimaryColor] = useState<string>('#06b6d4');
  const [customDomain, setCustomDomain] = useState<string>('app.apexperformance.ir');

  const totalClients = franchises.reduce((acc, f) => acc + f.activeClientsCount, 0);
  const totalRevenue = franchises.reduce((acc, f) => acc + f.monthlyRevenueUsd, 0);
  const avgRetention = (franchises.reduce((acc, f) => acc + f.retentionRatePercent, 0) / franchises.length).toFixed(1);

  return (
    <div className="p-2 sm:p-4 lg:p-8 space-y-6 lg:space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold uppercase tracking-wider">
              {isFa ? 'مرکز مدیریت شبکه‌ای چندشعبه‌ای' : 'Multi-Tenant Franchise Control Center'}
            </span>
            <span className="text-xs text-slate-400">{isFa ? 'زیرساخت بین‌المللی' : 'Global Infrastructure'}</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">{isFa ? 'مدیریت شعب شبکه‌ای و زنجیره‌ای باشگاه‌ها' : 'Enterprise Franchise & Gym Chain Operations'}</h2>
          <p className="text-xs text-slate-400 mt-1">{isFa ? 'سطوح دسترسی کارمندان (RBAC)، تحلیلی شعب و انتشار خودکار اپلیکیشن اختصاصی با برند شما.' : 'Role-Based Access Control (RBAC), multi-location analytics, and automated app store white-label publishing.'}</p>
        </div>

        <div className="flex items-center gap-2">
          {(['branches', 'coaches', 'white_label'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === tab
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'branches' ? (isFa ? 'شعب منطقه‌ای' : 'Regional Locations') :
               tab === 'coaches' ? (isFa ? 'ماتریس ظرفیت مربیان' : 'Coach Capacity Matrix') : (isFa ? 'استودیوی اپلیکیشن سفارشی' : 'White-Label App Studio')}
            </button>
          ))}
        </div>
      </div>

      {/* Global Performance Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">{isFa ? 'درآمد کل ماهانه شعب' : 'Total Franchise Revenue'}</div>
          <div className="text-3xl font-black text-white">${totalRevenue.toLocaleString()} / {isFa ? 'ماه' : 'mo'}</div>
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> {isFa ? '۱۸.۴٪+ رشد سالانه' : '+18.4% YoY Expansion'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">{isFa ? 'تعداد ورزشکاران فعال' : 'Active Member Seats'}</div>
          <div className="text-3xl font-black text-cyan-300">{totalClients.toLocaleString()} {isFa ? 'نفر' : ''}</div>
          <div className="text-xs text-cyan-400 font-medium">{isFa ? 'در ۳ شعبه فعال بین‌المللی' : 'Across 3 International Locations'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">{isFa ? 'نرخ ماندگاری کل' : 'Global Retention Rate'}</div>
          <div className="text-3xl font-black text-emerald-400">{avgRetention}٪</div>
          <div className="text-xs text-slate-400 font-medium">{isFa ? 'معیار استاندارد صنعت: ۸۲٪' : 'Enterprise Baseline: 82%'}</div>
        </div>
      </div>

      {/* View 1: Regional Locations */}
      {activeSubTab === 'branches' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {franchises.map((f) => (
            <div key={f.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-bold">
                    <Globe className="w-3.5 h-3.5" /> {f.city}، {f.country}
                  </div>
                  <h3 className="text-lg font-black text-white mt-0.5">{f.name}</h3>
                  <div className="text-xs text-slate-400">{isFa ? 'مدیر شعبه: ' : 'Director: '}{f.managerName}</div>
                </div>
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                  {isFa ? 'شعبه فعال' : 'Active Hub'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">{isFa ? 'کادر مربیان' : 'Staff Coaches'}</div>
                  <div className="font-bold text-white text-base mt-0.5">{f.coachesCount} {isFa ? 'مربی ارشد' : 'Head Trainers'}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">{isFa ? 'اعضای فعال' : 'Active Clients'}</div>
                  <div className="font-bold text-cyan-300 text-base mt-0.5">{f.activeClientsCount} {isFa ? 'اشتراک' : 'Seats'}</div>
                </div>
              </div>

              <div className="pt-2 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>{isFa ? 'درآمد تکرارشونده ماهانه' : 'Monthly Recurring Revenue'}</span>
                  <span className="font-bold text-white">${f.monthlyRevenueUsd.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{isFa ? 'پایبندی ورزشکاران به برنامه' : 'Client Program Compliance'}</span>
                  <span className="font-bold text-emerald-400">{f.complianceAveragePercent}٪</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{isFa ? 'نرخ ماندگاری ۳۰ روزه' : '30-Day Retention Benchmark'}</span>
                  <span className="font-bold text-emerald-400">{f.retentionRatePercent}٪</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View 3: Automated White-Label Publishing Studio */}
      {activeSubTab === 'white_label' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Palette className="w-4 h-4 text-cyan-400" /> {isFa ? 'سیستم ساخت خودکار اپلیکیشن موبایل با برند اختصاصی' : 'Automated App Store Publishing Pipeline'}
              </h3>
              <p className="text-xs text-slate-400">{isFa ? 'تولید خودکار نسخه iOS و اندروید اختصاصی شما با لگو و تم رنگی برندتان.' : 'Custom branded iOS/Android app store builds generated via CI/CD.'}</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">{isFa ? 'نام اختصاری اپلیکیشن باشگاه شما' : 'Franchise App Name'}</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">{isFa ? 'رنگ سازمانی و تم اصلی' : 'Primary Accent Color Theme'}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer"
                  />
                  <span className="font-mono text-white font-bold">{primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">{isFa ? 'آدرس دامنه اختصاصی CNAME' : 'Custom Dedicated Domain CNAME'}</label>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => alert(isFa ? `فرآیند کامپایل و ساخت اپلیکیشن برای ${brandName} آغاز شد! فایل‌های خروجی تا ۲ ساعت آینده روی اپ‌استور قرار خواهند گرفت.` : `Build pipeline triggered for ${brandName}!`)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20"
                >
                  {isFa ? 'کامپایل و انتشار اپلیکیشن‌های اختصاصی' : 'Compile & Deploy Custom Native Apps'}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile App Custom Branding Preview Mockup */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 shadow-xl">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-cyan-400" /> {isFa ? 'پیش‌نمایش زنده اپلیکیشن موبایل برند شما' : 'Dynamic Mobile Custom App Preview'}
            </div>

            <div className="w-64 h-[420px] rounded-[36px] bg-slate-950 border-4 border-slate-800 shadow-2xl p-4 space-y-4 relative overflow-hidden">
              <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto" />
              
              <div className="flex items-center gap-2 pt-2">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  {brandName[0]}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{brandName}</div>
                  <div className="text-[9px] text-slate-400">پشتیبانی‌شده توسط سیستم‌عامل اپکس</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-[10px] text-slate-400 font-semibold">{isFa ? 'برنامه تمرینی امروز' : 'Daily Training Target'}</div>
                <div className="text-sm font-black text-white">{isFa ? 'هایپرتروفی روز ۱' : 'Hypertrophy Day 1'}</div>
                <button 
                  className="w-full py-1.5 rounded-lg text-[10px] font-bold text-slate-950"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isFa ? 'شروع تمرین' : 'Start Session'}
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

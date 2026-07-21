import React, { useState } from 'react';
import type { AthleteProfile, AIRecommendation } from '../types';
import { 
  Users, 
  Activity, 
  BrainCircuit, 
  CheckCircle2, 
  ChevronRight, 
  Search, 
  Zap, 
  ShieldAlert, 
  ArrowUpRight,
  Dumbbell,
  FileCheck,
  TrendingUp
} from 'lucide-react';

interface CoachDashboardProps {
  athletes: AthleteProfile[];
  selectedAthlete: AthleteProfile;
  onSelectAthlete: (athlete: AthleteProfile) => void;
  aiRecommendations: AIRecommendation[];
  onApplyAIRecommendation: (recId: string) => void;
  onNavigateTab: (tab: string) => void;
  lang?: 'en' | 'fa';
}

export const CoachDashboard: React.FC<CoachDashboardProps> = ({
  athletes,
  selectedAthlete,
  onSelectAthlete,
  aiRecommendations,
  onApplyAIRecommendation,
  onNavigateTab,
  lang = 'fa'
}) => {
  const isFa = lang === 'fa';
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTabSub, setActiveTabSub] = useState<'roster' | 'ai_triage'>('ai_triage');

  const filteredAthletes = athletes.filter((a) => {
    return a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           a.goal.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const criticalCount = athletes.filter(a => a.riskScore === 'High' || a.riskScore === 'Critical').length;
  const avgCompliance = Math.round(athletes.reduce((acc, a) => acc + a.workoutCompliancePercent, 0) / athletes.length);

  return (
    <div className="p-2 sm:p-4 lg:p-8 space-y-6 lg:space-y-8">
      
      {/* Strategic B2B2C Value Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 p-4 rounded-2xl border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm sm:text-base">
              {isFa ? 'اهرم ۱۰ برابری ظرفیت مربیگری (10x Coach Capacity Scale)' : '10x Coach Capacity Scaling Lever'}
            </h3>
            <p className="text-xs text-slate-300">
              {isFa 
                ? 'با هوش مصنوعی اپکس، هر مربی به جای مدیریت ۳۰ شاگرد، بیش از ۳۰۰ ورزشکار را با دقت بیومکانیکی فوق‌العاده اداره می‌کند.'
                : 'Empower 1 coach to seamlessly manage 300 athletes instead of 30, driving 10x capacity and retention.'}
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold whitespace-nowrap">
          {isFa ? 'صرفه‌جویی ۷۸٪ در کارهای اداری' : '78% Time Saved'}
        </span>
      </div>

      {/* Top Welcome Banner & KPI Ribbon */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              {isFa ? 'داشبورد هوشمند مربیان' : 'Coach Intelligence Dashboard'}
            </span>
            <span className="text-xs text-slate-400">{isFa ? '۲۸ تیر ۱۴۰۵' : 'July 19, 2026'}</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            {isFa ? (
              <>فرماندهی هوشمند، <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">استاد مارکوس</span></>
            ) : (
              <>Command Hub, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Coach Marcus</span></>
            )}
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            {isFa ? (
              <>امروز <strong className="text-cyan-300">{criticalCount} ورزشکار با سیگنال نیاز به تغییر برنامه</strong> شناسایی شده‌اند. تصمیمات بر اساس لایه شواهد (Evidence Layer) آماده بررسی هستند.</>
            ) : (
              <>You have <strong className="text-cyan-300">{criticalCount} athletes needing plan modifications</strong> today based on evidence data.</>
            )}
          </p>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-xl text-center">
            <div className="text-xs text-slate-400 font-medium">{isFa ? 'تعداد شاگردان' : 'Total Clients'}</div>
            <div className="text-2xl font-black text-white mt-1">۲۴۰</div>
            <div className="text-[10px] text-emerald-400 flex items-center justify-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3 h-3" /> {isFa ? 'ظرفیت فعال ۱۰x' : '10x Active Scale'}
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-xl text-center">
            <div className="text-xs text-slate-400 font-medium">{isFa ? 'میانگین پایبندی' : 'Avg Compliance'}</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{avgCompliance}٪</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{isFa ? '۴.۲٪+ بالاتر از میانگین' : '+4.2% vs target'}</div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-xl text-center">
            <div className="text-xs text-slate-400 font-medium">{isFa ? 'همگام‌سازی زنده' : 'Wearable Sync'}</div>
            <div className="text-2xl font-black text-cyan-400 mt-1">۹۴٪</div>
            <div className="text-[10px] text-cyan-400 mt-0.5">{isFa ? 'WHOOP / Apple Health' : 'WHOOP / Apple'}</div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-xl text-center">
            <div className="text-xs text-slate-400 font-medium">{isFa ? 'هشدار انحراف' : 'Deviations'}</div>
            <div className="text-2xl font-black text-amber-400 mt-1">{criticalCount}</div>
            <div className="text-[10px] text-amber-400 mt-0.5">{isFa ? 'بررسی شواهد' : 'Review Evidence'}</div>
          </div>
        </div>
      </div>

      {/* Main Command Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Risk Triage & Evidence Layer (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTabSub('ai_triage')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTabSub === 'ai_triage'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-white bg-slate-900/60'
                }`}
              >
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                <span>{isFa ? 'جریان تصمیم‌گیری هوشمند با لایه شواهد (Evidence Layer)' : 'AI Risk Triage & Evidence Feed'}</span>
              </button>

              <button
                onClick={() => setActiveTabSub('roster')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTabSub === 'roster'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-white bg-slate-900/60'
                }`}
              >
                <Users className="w-4 h-4 text-cyan-400" />
                <span>{isFa ? `لیست ورزشکاران (${athletes.length})` : `Roster (${athletes.length})`}</span>
              </button>
            </div>

            <div className="relative">
              <Search className={`w-3.5 h-3.5 absolute ${isFa ? 'right-3' : 'left-3'} top-2.5 text-slate-400`} />
              <input
                type="text"
                placeholder={isFa ? 'جستجوی نام...' : 'Search...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${isFa ? 'pr-8 pl-3' : 'pl-8 pr-3'} py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 w-40 sm:w-56`}
              />
            </div>
          </div>

          {/* Tab View 1: AI Risk Triage Feed with Evidence Layer */}
          {activeTabSub === 'ai_triage' && (
            <div className="space-y-4">
              {aiRecommendations.map((rec) => (
                <div 
                  key={rec.id}
                  className={`p-5 rounded-2xl border space-y-4 transition-all ${
                    rec.applied 
                      ? 'bg-slate-900/40 border-slate-800/80 opacity-75' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-xl'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                        rec.category.includes('آسیب') || rec.category.includes('Injury') ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      }`}>
                        {rec.category.includes('آسیب') || rec.category.includes('Injury') ? <ShieldAlert className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{rec.athleteName}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-cyan-300 border border-slate-700">
                            {rec.category}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{rec.timestamp}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const target = athletes.find(a => a.id === rec.athleteId);
                          if (target) onSelectAthlete(target);
                          onNavigateTab('profile360');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
                      >
                        {isFa ? 'پروفایل ۳۶۰°' : '360° Profile'}
                      </button>

                      {!rec.applied ? (
                        <button
                          onClick={() => onApplyAIRecommendation(rec.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {isFa ? 'تایید و اعمال خودکار' : 'Approve Decision'}
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {isFa ? 'اعمال شد' : 'Applied'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Recommendation Details */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <p className="text-xs text-slate-200 leading-relaxed">
                      <strong className="text-white">{isFa ? 'تصمیم هوشمند سیستم: ' : 'AI System Decision: '}</strong>
                      {rec.suggestedAction}
                    </p>
                  </div>

                  {/* Scientific Evidence Layer Showcase */}
                  {rec.evidence && (
                    <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 space-y-1.5">
                      <div className="flex items-center justify-between font-bold border-b border-cyan-800/40 pb-1">
                        <span className="flex items-center gap-1.5 text-cyan-300">
                          <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                          {isFa ? 'لایه شواهد و منبع داده (Evidence Layer)' : 'Evidence Layer'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/30">
                          {isFa ? `ضریب اطمینان: ${rec.evidence.confidenceScorePercent}٪` : `Confidence: ${rec.evidence.confidenceScorePercent}%`}
                        </span>
                      </div>
                      <div className="text-[11px] text-cyan-100/90 leading-relaxed">
                        <strong>{isFa ? 'منبع استخراج داده: ' : 'Data Source: '}</strong> {rec.evidence.dataSource}
                      </div>
                      <div className="text-[11px] text-slate-300 italic">
                        "{rec.evidence.reasoning}"
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}

          {/* Tab View 2: Client Roster Grid */}
          {activeTabSub === 'roster' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAthletes.map((ath) => {
                const isSelected = selectedAthlete.id === ath.id;
                return (
                  <div
                    key={ath.id}
                    onClick={() => onSelectAthlete(ath)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500/80 shadow-xl shadow-cyan-500/10'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={ath.avatar}
                          alt={ath.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                            {ath.name}
                            {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                          </h4>
                          <span className="text-xs text-slate-400">{ath.goal}</span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ath.riskScore === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        ath.riskScore === 'Moderate' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {isFa ? (ath.riskScore === 'High' ? 'ریسک بالا' : ath.riskScore === 'Moderate' ? 'متوسط' : 'کم‌ریسک') : ath.riskScore}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                      <span>{isFa ? `استمرار: ${ath.activeStreakDays} روز` : `Streak: ${ath.activeStreakDays}d`}</span>
                      <span className="text-cyan-400 font-medium flex items-center gap-0.5">
                        {isFa ? 'انتخاب' : 'Select'} <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Right Column: Active Client Spotlight (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl sticky top-24">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" /> {isFa ? 'ورزشکار منتخب' : 'Selected Focus'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                {isFa ? 'پایش زنده' : 'Live Sync'}
              </span>
            </div>

            {/* Athlete Profile Spotlight */}
            <div className="flex items-center gap-4">
              <img
                src={selectedAthlete.avatar}
                alt={selectedAthlete.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-md"
              />
              <div>
                <h3 className="text-lg font-black text-white">{selectedAthlete.name}</h3>
                <div className="text-xs text-cyan-400 font-semibold mt-0.5">{selectedAthlete.goal}</div>
                <div className="text-xs text-slate-400 mt-1">{selectedAthlete.membershipTier}</div>
              </div>
            </div>

            {/* Telemetry Gauge Bar */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{isFa ? 'شاخص فشار WHOOP' : 'Strain Index'}</span>
                <span className="font-bold text-cyan-300">{selectedAthlete.wearableSync.strainIndex} / ۲۱.۰</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(selectedAthlete.wearableSync.strainIndex / 21) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">{isFa ? 'شاخص HRV' : 'HRV'}</span>
                <span className="font-bold text-white">{selectedAthlete.wearableSync.hrvMs} ms</span>
              </div>
            </div>

            {/* Action Direct Links */}
            <div className="pt-2 space-y-2.5">
              <button
                onClick={() => onNavigateTab('builder')}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Dumbbell className="w-4 h-4" />
                {isFa ? 'ویرایش برنامه‌ریزی زنده' : 'Modify Program'}
              </button>

              <button
                onClick={() => onNavigateTab('profile360')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-2 border border-slate-700"
              >
                <Users className="w-4 h-4 text-slate-400" />
                {isFa ? 'مشاهده پرونده کامل ۳۶۰°' : 'View 360° Profile'}
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

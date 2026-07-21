import React, { useState } from 'react';
import type { AthleteProfile, WorkoutProgram } from '../types';
import { 
  CheckCircle2, 
  Camera, 
  Send
} from 'lucide-react';

interface AthleteMobileSimProps {
  athlete: AthleteProfile;
  program: WorkoutProgram;
  lang?: 'en' | 'fa';
}

export const AthleteMobileSim: React.FC<AthleteMobileSimProps> = ({ athlete, program, lang = 'fa' }) => {
  const isFa = lang === 'fa';
  const [mobileTab, setMobileTab] = useState<'workout' | 'checkin' | 'ai_chat'>('workout');
  const [chatMessages, setChatMessages] = useState<{ sender: 'ai' | 'athlete'; text: string }[]>([
    { 
      sender: 'ai', 
      text: isFa 
        ? `سلام ${athlete.name}! امتیاز ریکاوری دستگاه WHOOP شما امروز ${athlete.wearableSync.recoveryScore}٪ ثبت شد. تمرین امروز شما برای حداکثر رشد عضلانی بهینه شده است!` 
        : `Hi ${athlete.name}! Your WHOOP recovery is at ${athlete.wearableSync.recoveryScore}%. Your workout is optimized for hypertrophy!` 
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSendChat = () => {
    if (!inputMsg.trim()) return;
    const newMsgs = [...chatMessages, { sender: 'athlete' as const, text: inputMsg }];
    setChatMessages(newMsgs);
    setInputMsg('');

    setTimeout(() => {
      setChatMessages([
        ...newMsgs,
        { 
          sender: 'ai', 
          text: isFa 
            ? `متوجه شدم! پیام شما برای ${athlete.coachName} ارسال شد. بر اساس هدف پروتئین امروز شما، مصرف ۲۰۰ گرم ماست ایسلندی ۲۲ گرم پروتئین با کیفیت به شما اضافه می‌کند.` 
            : `Got it! I logged your question for ${athlete.coachName}. Adding 200g of skyr yogurt provides 22g of leucine-rich protein!` 
        }
      ]);
    }, 1000);
  };

  return (
    <div className="p-2 sm:p-4 lg:p-8 space-y-6 lg:space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold uppercase tracking-wider">
              {isFa ? 'شبیه‌ساز اپلیکیشن نیتیو موبایل ورزشکار' : 'Native Mobile Application Simulator'}
            </span>
            <span className="text-xs text-slate-400">{isFa ? 'نسخه iOS و Android مبتنی بر React Native' : 'iOS & Android React Native Builds'}</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">{isFa ? 'پورتال موبایل ورزشکار و ثبت‌کننده در تمرین' : 'Athlete Client Portal & In-Gym Logger'}</h2>
          <p className="text-xs text-slate-400 mt-1">{isFa ? 'ثبت آفلاین تمرین، همگام‌سازی گجت‌ها، اسکن بینایی ماشین غذا و دستیار ۲۴ ساعته هوش مصنوعی.' : 'Offline-first logging, wearable sync, camera AI, and continuous 24/7 AI concierge.'}</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {(['workout', 'checkin', 'ai_chat'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setMobileTab(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mobileTab === t
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t === 'workout' ? (isFa ? 'ثبت تمرین در باشگاه' : 'In-Gym Workout') :
               t === 'checkin' ? (isFa ? 'ارزیابی آمادگی روزانه' : 'Daily Readiness') : (isFa ? 'چت‌بات ۲۴/۷ هوش مصنوعی' : '24/7 AI Concierge')}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Device Frame Container */}
      <div className="flex justify-center">
        <div className="w-[360px] h-[720px] rounded-[44px] bg-slate-950 border-8 border-slate-800 shadow-2xl p-4 flex flex-col justify-between relative overflow-hidden">
          
          {/* Top Speaker & Camera Notch Bar */}
          <div className="w-32 h-5 bg-slate-900 rounded-full mx-auto shrink-0 flex items-center justify-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-slate-800" />
            <span className="w-3 h-1 bg-slate-800 rounded" />
          </div>

          {/* Active Mobile View Content */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-slate-100 scrollbar-none">
            
            {/* View 1: In-Gym Workout Logger */}
            {mobileTab === 'workout' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{isFa ? 'پروتکل امروز' : "Today's Protocol"}</div>
                    <h3 className="font-bold text-white text-base">{isFa ? 'تنش مکانیکی بالاتنه' : 'Upper Mechanical Load'}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    {isFa ? 'ذخیره آفلاین فعال' : 'Offline Sync Active'}
                  </span>
                </div>

                {/* Exercise Cards */}
                {program.days[0].exercises.slice(0, 2).map((ex, exIdx) => (
                  <div key={exIdx} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-xs">{ex.exerciseName}</h4>
                      <span className="text-[10px] text-slate-400">{isFa ? `۳ ست • ${ex.restSeconds}ث استراحت` : `3 Sets • ${ex.restSeconds}s Rest`}</span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {ex.sets.map((s, sIdx) => (
                        <div key={sIdx} className="flex items-center justify-between text-xs bg-slate-950 p-2 rounded-xl border border-slate-800">
                          <span className="font-bold text-slate-400 text-[10px]">{isFa ? `ست ${s.setNumber}` : `SET ${s.setNumber}`}</span>
                          <span className="font-bold text-cyan-300">{s.weightKg} {isFa ? 'کیلو' : 'kg'}</span>
                          <span className="text-slate-300">{s.reps} {isFa ? 'تکرار' : 'reps'}</span>
                          <span className="text-amber-400 text-[10px] font-bold">RPE {s.targetRpe}</span>
                          <button className="p-1 rounded bg-emerald-500 text-slate-950 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* View 2: Daily Bio Readiness & Meal Scanner */}
            {mobileTab === 'checkin' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{isFa ? 'همگام‌سازی ریکاوری WHOOP' : 'WHOOP Recovery Sync'}</div>
                  <div className="text-3xl font-black text-emerald-400">{athlete.wearableSync.recoveryScore}٪</div>
                  <p className="text-xs text-slate-300">{isFa ? 'دستگاه عصبی خودگردان برای تمرینات سنگین مکانیکی آماده است.' : 'Autonomic nervous system ready for heavy loading.'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border border-cyan-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <Camera className="w-4 h-4 text-cyan-400" /> {isFa ? 'هوش مصنوعی اسکن غذا' : 'Meal Photo Vision AI'}
                    </span>
                  </div>
                  <p className="text-[11px] text-cyan-200">{isFa ? 'از بشقاب غذای خود عکس بگیرید تا میزان پروتئین و کالری آن محاسبه شود.' : 'Snap a photo of your plate to auto-calculate macros.'}</p>
                  <button className="w-full py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow">
                    {isFa ? 'باز کردن دوربین بینایی ماشین' : 'Open Camera AI'}
                  </button>
                </div>
              </div>
            )}

            {/* View 3: AI Concierge Chat */}
            {mobileTab === 'ai_chat' && (
              <div className="flex flex-col h-[520px] justify-between space-y-3">
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl max-w-[85%] ${
                        msg.sender === 'ai'
                          ? 'bg-cyan-950/60 border border-cyan-800/50 text-cyan-100 self-start'
                          : 'bg-blue-600 text-white self-end ml-auto'
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    placeholder={isFa ? 'پرسش از مربی هوشمند...' : 'Ask AI Coach...'}
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                    className="flex-1 p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button onClick={handleSendChat} className="p-2 rounded-xl bg-cyan-500 text-slate-950 font-bold">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Mobile iOS Home Line */}
          <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto shrink-0 mt-2" />
        </div>
      </div>

    </div>
  );
};

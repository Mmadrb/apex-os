import React, { useState } from 'react';
import { 
  Presentation, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Zap,
  CheckCircle2,
  Camera
} from 'lucide-react';

interface InvestorDeckProps {
  lang?: 'en' | 'fa';
}

export const InvestorDeck: React.FC<InvestorDeckProps> = ({ lang = 'fa' }) => {
  const isFa = lang === 'fa';
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const totalSlides = 5;

  const slidesData = isFa ? [
    {
      id: 1,
      title: "۱. مسئله اصلی: مربیان نمی‌توانند بدن انسان را در مقیاس بالا مدیریت کنند",
      subtitle: "مربیان در حدود ۳۰ شاگرد متوقف می‌شوند و ۷۸٪ زمان آن‌ها صرف کارهای اداری و پیام‌های پراکنده می‌شود",
      type: "problem",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
          <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-4">
            <h3 className="font-bold text-rose-300 text-base">بزرگ‌ترین گلوگاه صنعت مربیگری</h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">❌ <strong>محدودیت ظرفیت انسانی:</strong> یک مربی حداکثر می‌تواند ۳۰ شاگرد را با کیفیت مدیریت کند.</li>
              <li className="flex items-start gap-2">❌ <strong>۷۸٪ اتلاف وقت اداری:</strong> اکسل، پی‌دی‌اف و پیام‌های پراکنده در پیام‌رسان‌ها.</li>
              <li className="flex items-start gap-2">❌ <strong>عدم پایش زنده بیومکانیک:</strong> عدم تشخیص خمیدگی ستون فقرات و فرم اشتباه حرکتی.</li>
              <li className="flex items-start gap-2">❌ <strong>ریزش بالا:</strong> ۱۲٪ ریزش ماهانه شاگردان به دلیل عدم نتیجه‌گیری و استپ وزنی.</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-center text-center">
            <div className="text-4xl font-black text-rose-400">سقف ۳۰ شاگرد</div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              بدون هوش مصنوعی و یکپارچه‌سازی، مربیگری ورزشی یک شغل غیرقابل مقیاس‌پذیری با درآمدهای محدود است.
            </p>
          </div>
        </div>
      ),
      speakerNotes: "با سلام. مسئله اصلی این است که مربیان نمی‌توانند بیش از ۳۰ شاگرد را بدون افت کیفیت مدیریت کنند. ۷۸٪ از وقت آن‌ها هدر می‌رود."
    },
    {
      id: 2,
      title: "۲. راهکار: تبدیل مربیان به سیستم‌های هوشمند عملکرد انسانی (ApexOS)",
      subtitle: "اپکس مربیان را به سیستم‌های مجهز به هوش مصنوعی تبدیل می‌کند تا به جای ۳۰ نفر، ۳۰۰ ورزشکار را مربیگری کنند",
      type: "solution",
      content: (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-2">
              <div className="text-3xl font-black text-cyan-400">۱۰x افزایش ظرفیت</div>
              <div className="text-xs font-bold text-white">مدیریت ۳۰۰ ورزشکار توسط ۱ مربی</div>
              <p className="text-[11px] text-slate-400">بدون افت کیفیت خدمات و تحویل برنامه</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-2">
              <div className="text-3xl font-black text-emerald-400">۴۰٪ کاهش ریزش</div>
              <div className="text-xs font-bold text-white">بازنویسی خودکار تمرین و تغذیه</div>
              <p className="text-[11px] text-slate-400">پایش بیومارکرها مانع از استپ بدنی می‌شود</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/40 space-y-2">
              <div className="text-3xl font-black text-indigo-400">۱۰۰٪ White Label</div>
              <div className="text-xs font-bold text-white">سیستم‌عامل اختصاصی باشگاه</div>
              <p className="text-[11px] text-slate-400">انتشار اپ با رنگ و لوگوی برند شما</p>
            </div>
          </div>
        </div>
      ),
      speakerNotes: "اپکس یک اپلیکیشن ساده نیست؛ اپکس مربی را تبدیل به یک سوپرمربی مجهز به سیستم‌عامل تصمیم‌گیری هوشمند می‌کند."
    },
    {
      id: 3,
      title: "۳. حلقه محصول (Demo Loop): Camera → AI Analysis → Decision → Result",
      subtitle: "بینایی ماشین روی گوشی، آنالیز زوایای اسکلتی، اتخاذ تصمیم علمی و نمایش لایه شواهد (Evidence Layer)",
      type: "demo_loop",
      content: (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <Camera className="w-6 h-6 text-cyan-400 mx-auto" />
              <div className="font-bold text-white mt-2">۱. تصویر دوربین</div>
              <p className="text-[10px] text-slate-400">ضبط حرکات بدون سنسور گران‌قیمت</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <Zap className="w-6 h-6 text-amber-400 mx-auto" />
              <div className="font-bold text-white mt-2">۲. آنالیز ۳۳ نقطه</div>
              <p className="text-[10px] text-slate-400">محاسبه زوایا و سرعت هالتر</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <Sparkles className="w-6 h-6 text-indigo-400 mx-auto" />
              <div className="font-bold text-white mt-2">۳. تصمیم هوشمند AI</div>
              <p className="text-[10px] text-slate-400">جایگزینی خودکار حرکت خطرناک</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
              <div className="font-bold text-white mt-2">۴. لایه شواهد (Evidence)</div>
              <p className="text-[10px] text-slate-400">ضریب اطمینان ۹۴.۲٪ + منبع داده</p>
            </div>
          </div>
        </div>
      ),
      speakerNotes: "بینایی ماشین بدون سنسور گران‌قیمت، تکنیک حرکت را آنالیز کرده، درصد ضریب اطمینان علمی ارائه داده و برنامه را فوراً اصلاح می‌کند."
    },
    {
      id: 4,
      title: "۴. مدل تجاری و اقتصادی (Gym SaaS + White Label)",
      subtitle: "درآمد تکرارشونده SaaS برای مربیان و باشگاه‌ها + کارمزد تراکنش‌ها",
      type: "business",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 text-xs">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-white text-sm">مربی مستقل (Solo)</div>
            <div className="text-3xl font-black text-cyan-300">$49 / ماه</div>
            <p className="text-slate-400">تا ۲۵ ورزشکار + آنالیز حرکتی پایه</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-800 space-y-2">
            <div className="font-bold text-white text-sm">باشگاه و تیم (Gym)</div>
            <div className="text-3xl font-black text-cyan-300">$499 / ماه</div>
            <p className="text-slate-400">چندشعبه‌ای + لایه شواهد کامل</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-800 space-y-2">
            <div className="font-bold text-white text-sm">برند اختصاصی (White-Label)</div>
            <div className="text-3xl font-black text-emerald-400">$10,000+ / سال</div>
            <p className="text-slate-400">اپلیکیشن نیتیو اختصاصی اپ‌استور</p>
          </div>
        </div>
      ),
      speakerNotes: "ما با فروش نرم‌افزار به مربیان و سیستم‌عامل سفید به باشگاه‌ها، درآمد فوق‌العاده با حاشیه سود بالای ۸۲٪ خلق می‌کنیم."
    },
    {
      id: 5,
      title: "۵. چشم‌انداز: سیستم‌عامل عملکرد انسانی و طول عمر (Human Longevity)",
      subtitle: "دستیابی به ۲۸۵ میلیون دلار سهم بازار با خلق قوی‌ترین خندق داده‌ای (Data Moat) حرکتی و زیستی",
      type: "vision",
      content: (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 text-center">
          <div className="space-y-2">
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">
              The Operating System of Human Performance
            </div>
            <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
              هدف نهایی اپکس تبدیل شدن به زیرساخت استاندارد جهانی برای آنالیز حرکتی، بیومارکرهای طول عمر و تصمیم‌گیری هوشمند برای بدن انسان است.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-slate-400">بازار کلی (TAM)</div>
              <div className="font-black text-white text-lg mt-0.5">۱۴.۲B $</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-slate-400">پیش‌بینی سال ۵ (ARR)</div>
              <div className="font-black text-emerald-400 text-lg mt-0.5">۸۵M $</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-slate-400">خندق داده (Data Moat)</div>
              <div className="font-black text-cyan-300 text-lg mt-0.5">میلیون‌ها فریم</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-slate-400">مبلغ جذب Seed</div>
              <div className="font-black text-amber-300 text-lg mt-0.5">۳.۵M $</div>
            </div>
          </div>
        </div>
      ),
      speakerNotes: "هدف ما تبدیل شدن به استاندارد طلایی زیرساخت سلامت و عملکرد انسانی است. با جذب ۳.۵ میلیون دلار به هدف ۸۵ میلیون دلار ARR دست خواهیم یافت."
    }
  ] : [
    {
      id: 1,
      title: "1. The Problem: Coaches Cannot Manage Human Performance at Scale",
      subtitle: "Coaches are capped at ~30 clients and waste 78% of billable time on scattered manual admin tasks",
      type: "problem",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
          <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-4">
            <h3 className="font-bold text-rose-300 text-base">The Core Industry Bottleneck</h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li>❌ <strong>30-Client Capacity Cap:</strong> Human limits restrict scaling without quality degradation.</li>
              <li>❌ <strong>78% Admin Overhead:</strong> Wasted time across WhatsApp, PDFs, and spreadsheets.</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-center text-center">
            <div className="text-4xl font-black text-rose-400">30 Client Cap</div>
          </div>
        </div>
      ),
      speakerNotes: "Coaches cannot scale beyond 30 clients without software automation."
    },
    {
      id: 2,
      title: "2. The Solution: ApexOS Turns Coaches into AI Performance Systems",
      subtitle: "Empower 1 coach to seamlessly manage 300 athletes instead of 30",
      type: "solution",
      content: (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-3xl font-black text-cyan-400">10x Coach Scaling Capacity</div>
          <p className="text-xs text-slate-300 mt-2">Manage 300 athletes per coach with precision biofeedback.</p>
        </div>
      ),
      speakerNotes: "ApexOS turns coaches into AI-powered performance systems."
    }
  ];

  const currentSlideObj = slidesData.find(s => s.id === currentSlide) || slidesData[0];

  return (
    <div className="p-2 sm:p-4 lg:p-8 space-y-6">
      
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <Presentation className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="font-bold text-white text-sm">{isFa ? `اسلاید کلیدی سرمایه‌گذاری (${currentSlide} از ${totalSlides})` : `Pitch Slide (${currentSlide} / ${totalSlides})`}</h3>
            <p className="text-xs text-slate-400">{isFa ? 'داستان استراتژیک جذب سرمایه (Venture Pitch Narrative)' : 'VC Pitch Deck Narrative'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={currentSlide === 1}
            onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 1))}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 text-xs font-bold flex items-center gap-1"
          >
            <ChevronRight className="w-4 h-4" /> {isFa ? 'قبلی' : 'Prev'}
          </button>

          <span className="text-xs text-cyan-400 font-mono font-bold px-2">
            {currentSlide} {isFa ? 'از' : 'of'} {slidesData.length}
          </span>

          <button
            disabled={currentSlide === slidesData.length}
            onClick={() => setCurrentSlide(prev => Math.min(prev + 1, slidesData.length))}
            className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow"
          >
            {isFa ? 'بعدی' : 'Next'} <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Card Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl min-h-[440px] flex flex-col justify-between">
        
        <div className="space-y-2 border-b border-slate-800 pb-4">
          <div className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">{isFa ? `اسلاید کلیدی شماره ${currentSlideObj.id}` : `Slide ${currentSlideObj.id}`}</div>
          <h2 className="text-xl sm:text-2xl font-black text-white">{currentSlideObj.title}</h2>
          <p className="text-xs text-slate-400">{currentSlideObj.subtitle}</p>
        </div>

        {/* Dynamic Slide View Content */}
        <div className="flex-1">
          {currentSlideObj.content}
        </div>

        {/* Founder Speaker Notes Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> {isFa ? 'پیام و گفتار کلیدی بنیان‌گذار به سرمایه‌گذار:' : 'Founder Pitch Script:'}
          </div>
          <p className="text-xs text-slate-300 italic leading-relaxed">
            "{currentSlideObj.speakerNotes}"
          </p>
        </div>

      </div>

    </div>
  );
};

import React, { useState } from 'react';
import type { AthleteProfile } from '../types';
import { FOOD_DATABASE, calculateFoodNutrition } from '../data/foodDatabase';
import { 
  Camera, 
  Sparkles, 
  Flame, 
  Droplets, 
  CheckCircle2, 
  Heart, 
  PieChart as PieIcon, 
  ShieldCheck, 
  ScanLine,
  Utensils,
  Plus,
  Search,
  Database
} from 'lucide-react';

interface NutritionStudioProps {
  selectedAthlete: AthleteProfile;
  onUpdateAthlete?: (updated: AthleteProfile) => void;
  lang?: 'en' | 'fa';
}

export const NutritionStudio: React.FC<NutritionStudioProps> = ({ 
  selectedAthlete, 
  onUpdateAthlete,
  lang = 'fa' 
}) => {
  const isFa = lang === 'fa';
  const [selectedMealPhoto] = useState<string>(
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
  );
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Database Food Selection State
  const [selectedFoodId, setSelectedFoodId] = useState<string>(FOOD_DATABASE[0].id);
  const [portionGrams, setPortionGrams] = useState<number>(180);
  const [foodSearchTerm, setFoodSearchTerm] = useState<string>('');

  // Selected food calculation
  const currentFood = FOOD_DATABASE.find(f => f.id === selectedFoodId) || FOOD_DATABASE[0];
  const computedNutrition = calculateFoodNutrition(currentFood, portionGrams);

  const [scannedResult, setScannedResult] = useState<{
    items: string[];
    calories: number;
    proteinG: number;
    carbsG: number;
    fatsG: number;
    confidence: number;
  } | null>(
    isFa ? {
      items: ['۲۲۰ گرم سینه مرغ گریل شده', '۱۸۰ گرم برنج کته با کیفیت', '۱۰۰ گرم کلم بروکلی بخارپز', '۱۵ گرم روغن زیتون فرابکر'],
      calories: 680,
      proteinG: 62,
      carbsG: 54,
      fatsG: 18,
      confidence: 98.4
    } : {
      items: ['220g Grilled Chicken Breast', '180g Steamed Jasmine Rice', '100g Roasted Broccoli', '15g Extra Virgin Olive Oil'],
      calories: 680,
      proteinG: 62,
      carbsG: 54,
      fatsG: 18,
      confidence: 98.4
    }
  );

  const [activeCraving, setActiveCraving] = useState<boolean>(false);
  const [cravingFeedbackMsg, setCravingFeedbackMsg] = useState<string | null>(null);

  const cravingBusters = isFa ? [
    { name: 'قایق خیار با پنیر خامه‌ای کم‌چرب و شوید', calories: 45, protein: 2, carbs: 4, fatigueRelief: 'آبرسانی فوق‌العاده' },
    { name: 'پاپ‌کورن بدون روغن با مخمر تغذیه‌ای', calories: 90, protein: 5, carbs: 14, fatigueRelief: 'رفع هوس شور' },
    { name: 'خوشه انگور سیاه منجمد با دارچین', calories: 70, protein: 1, carbs: 18, fatigueRelief: 'رفع هوس شیرین' },
    { name: 'کدو سبز سرخ‌شده در هواپز با سس مارینارا', calories: 120, protein: 4, carbs: 16, fatigueRelief: 'ترکیب ترد' },
    { name: 'جلبک دریایی برشته‌شده با نمک دریا', calories: 35, protein: 2, carbs: 1, fatigueRelief: 'تامین ید و نمک' }
  ] : [
    { name: 'Cucumber Boats with Cream Cheese & Dill', calories: 45, protein: 2, carbs: 4, fatigueRelief: 'High Hydration' },
    { name: 'Air-popped Popcorn with Nutritional Yeast', calories: 90, protein: 5, carbs: 14, fatigueRelief: 'Savory Fix' },
    { name: 'Frozen Dark Grape Clusters with Cinnamon', calories: 70, protein: 1, carbs: 18, fatigueRelief: 'Sweet Fix' },
    { name: 'Air-Fried Zucchini Fries with Marinara', calories: 120, protein: 4, carbs: 16, fatigueRelief: 'Crunch Fix' },
    { name: 'Toasted Seaweed Snacks with Sea Salt', calories: 35, protein: 2, carbs: 1, fatigueRelief: 'Iodine & Salt Fix' }
  ];

  const handleSimulateScan = () => {
    setIsScanning(true);
    setScannedResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScannedResult(isFa ? {
        items: ['۲۰۰ گرم فیله ماهی سالمون', '۱۵۰ گرم سیب‌زمینی شیرین تنوری', '۸۰ گرم مارچوبه گریل شده'],
        calories: 610,
        proteinG: 48,
        carbsG: 42,
        fatsG: 22,
        confidence: 97.8
      } : {
        items: ['200g Atlantic Salmon Fillet', '150g Roasted Sweet Potato', '80g Grilled Asparagus'],
        calories: 610,
        proteinG: 48,
        carbsG: 42,
        fatsG: 22,
        confidence: 97.8
      });
    }, 1200);
  };

  // Add calculated DB item to Athlete's Logged Profile
  const handleAddCalculatedFood = () => {
    if (!onUpdateAthlete) return;

    const updated = {
      ...selectedAthlete,
      caloriesLogged: selectedAthlete.caloriesLogged + computedNutrition.calories,
      proteinLoggedG: Number((selectedAthlete.proteinLoggedG + computedNutrition.proteinG).toFixed(1)),
      carbsLoggedG: Number((selectedAthlete.carbsLoggedG + computedNutrition.carbsG).toFixed(1)),
      fatsLoggedG: Number((selectedAthlete.fatsLoggedG + computedNutrition.fatsG).toFixed(1)),
    };

    onUpdateAthlete(updated);
  };

  // Log Craving Buster
  const handleLogCravingBuster = (cb: typeof cravingBusters[0]) => {
    if (!onUpdateAthlete) return;

    const updated = {
      ...selectedAthlete,
      caloriesLogged: selectedAthlete.caloriesLogged + cb.calories,
      proteinLoggedG: Number((selectedAthlete.proteinLoggedG + cb.protein).toFixed(1)),
      carbsLoggedG: Number((selectedAthlete.carbsLoggedG + cb.carbs).toFixed(1)),
    };

    onUpdateAthlete(updated);
    setCravingFeedbackMsg(
      isFa 
        ? `خوراکی «${cb.name}» با ${cb.calories} کالری ثبت شد. ثبات قند خون و مهار هوس فعال گردید.`
        : `Logged "${cb.name}" (${cb.calories} kcal). Blood sugar response stabilized.`
    );
  };

  const filteredFoods = FOOD_DATABASE.filter(f => {
    const q = foodSearchTerm.toLowerCase();
    return f.nameFa.toLowerCase().includes(q) || f.nameEn.toLowerCase().includes(q);
  });

  const caloriesPercent = Math.min(Math.round((selectedAthlete.caloriesLogged / selectedAthlete.caloriesTarget) * 100), 100);
  const proteinPercent = Math.min(Math.round((selectedAthlete.proteinLoggedG / selectedAthlete.proteinTargetG) * 100), 100);

  const personalizedMealPlan = isFa ? [
    { title: 'صبحانه عملکردی', calories: 620, recipe: 'اوتمیل + ماست یونانی + موز + وی ایزوله', macro: 'P 42g • C 68g • F 14g' },
    { title: 'ناهار ریکاوری', calories: 740, recipe: 'مرغ گریل + برنج + سبزیجات بخارپز + روغن زیتون', macro: 'P 58g • C 72g • F 18g' },
    { title: 'شام کنترل‌شده', calories: 610, recipe: 'سالمون + سیب‌زمینی شیرین + سالاد سبز', macro: 'P 44g • C 48g • F 22g' },
    { title: 'میان‌وعده', calories: 280, recipe: 'اسکایر + بادام + توت', macro: 'P 22g • C 18g • F 10g' }
  ] : [
    { title: 'Performance Breakfast', calories: 620, recipe: 'Oats + Greek yogurt + banana + whey isolate', macro: 'P 42g • C 68g • F 14g' },
    { title: 'Recovery Lunch', calories: 740, recipe: 'Grilled chicken + rice + steamed vegetables + olive oil', macro: 'P 58g • C 72g • F 18g' },
    { title: 'Controlled Dinner', calories: 610, recipe: 'Salmon + sweet potato + green salad', macro: 'P 44g • C 48g • F 22g' },
    { title: 'Snack', calories: 280, recipe: 'Skyr + almonds + berries', macro: 'P 22g • C 18g • F 10g' }
  ];

  const dietRecipes = isFa ? [
    { name: 'رپ مرغ کم‌چرب', calories: 410, note: 'مناسب بعد تمرین با پروتئین بالا و چربی کنترل‌شده' },
    { name: 'کاسه سالمون و برنج', calories: 560, note: 'برای ریکاوری و تکمیل امگا-۳ و کربوهیدرات' },
    { name: 'پارفه اسکایر و توت', calories: 240, note: 'میان‌وعده سبک با پروتئین بالا و فیبر مناسب' },
  ] : [
    { name: 'Lean Chicken Wrap', calories: 410, note: 'High-protein post-workout meal with controlled fats' },
    { name: 'Salmon Rice Bowl', calories: 560, note: 'Supports recovery with omega-3 and smart carbohydrates' },
    { name: 'Skyr Berry Parfait', calories: 240, note: 'Light snack with strong protein density and fiber' },
  ];

  return (
    <div className="p-2 sm:p-4 lg:p-8 space-y-6 lg:space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider">
              {isFa ? 'موتور پردازش بینایی تغذیه دقیق' : 'Precision Nutrition & Vision Engine'}
            </span>
            <span className="text-xs text-slate-400">{isFa ? 'ورزشکار: ' : 'Athlete: '}<strong className="text-white">{selectedAthlete.name}</strong></span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">{isFa ? 'ماتریس تطبیقی ارزش غذایی و پایگاه داده خوراکی‌ها' : 'Adaptive Macro & Micro Nutrition Matrix'}</h2>
          <p className="text-xs text-slate-400 mt-1">{isFa ? 'محاسبه علمی ریزمغذی‌ها براساس گرم و وزن دقیق مواد غذایی استخراج‌شده از دیتابیس رسمی.' : 'Scientific per-gram nutrition calculations dynamically integrated with formal USDA database values.'}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveCraving(!activeCraving)}
            className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-2"
          >
            <Heart className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{isFa ? 'سیستم مهار هوس‌های غذایی' : 'Anti-Binge Craving Interceptor'}</span>
          </button>
        </div>
      </div>

      {/* Craving Interceptor Modal Bar */}
      {activeCraving && (
        <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-800/60 space-y-4 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-amber-200 text-sm">{isFa ? 'پشتیبانی رفتاری و علوم اعصاب مهار هوس' : 'Behavioral Support & Anti-Binge Engine'}</h4>
                <p className="text-xs text-amber-300/80">{isFa ? '«انتخاب یک میان‌وعده کم‌کالری تراکم دوپامین را متعادل کرده و جلوی پرخوری جبرانی را می‌گیرد.»' : '"Choosing a low-cal buster stabilizes dopamine levels and prevents overeating."'}</p>
              </div>
            </div>
            <button onClick={() => setActiveCraving(false)} className="text-amber-400 text-xs hover:underline font-semibold">
              {isFa ? 'بستن' : 'Close'}
            </button>
          </div>

          {cravingFeedbackMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{cravingFeedbackMsg}</span>
            </div>
          )}

          <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider">{isFa ? 'پیشنهادهای کم‌کالری (ثبت مستقیم با کلیک)' : 'Low-Calorie Craving Busters (Click to Log)'}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {cravingBusters.map((cb, idx) => (
              <div 
                key={idx} 
                onClick={() => handleLogCravingBuster(cb)}
                className="p-3 rounded-xl bg-slate-900 border border-amber-800/40 space-y-2 hover:border-amber-400 cursor-pointer transition-all shadow-md group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-amber-400">{cb.calories} CAL</span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {isFa ? '+ ثبت' : '+ Add'}
                  </span>
                </div>
                <div className="text-xs font-bold text-white leading-tight">{cb.name}</div>
                <div className="text-[10px] text-slate-400">P: {cb.protein}g • C: {cb.carbs}g</div>
                <div className="text-[10px] text-emerald-400 font-medium">{cb.fatigueRelief}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Target Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-400" /> {isFa ? 'کالری دریافت شده' : 'Daily Energy'}
            </span>
            <span className="text-xs font-bold text-slate-200">{caloriesPercent}٪</span>
          </div>
          <div className="text-2xl font-black text-white">
            {selectedAthlete.caloriesLogged} <span className="text-sm font-normal text-slate-400">/ {selectedAthlete.caloriesTarget} kcal</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-300" style={{ width: `${caloriesPercent}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Utensils className="w-4 h-4 text-cyan-400" /> {isFa ? 'پروتئین دریافتی' : 'Protein Target'}
            </span>
            <span className="text-xs font-bold text-slate-200">{proteinPercent}٪</span>
          </div>
          <div className="text-2xl font-black text-cyan-300">
            {selectedAthlete.proteinLoggedG}g <span className="text-sm font-normal text-slate-400">/ {selectedAthlete.proteinTargetG}g</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full transition-all duration-300" style={{ width: `${proteinPercent}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <PieIcon className="w-4 h-4 text-emerald-400" /> {isFa ? 'کربوهیدرات و چربی' : 'Carbs & Fats'}
            </span>
            <span className="text-xs font-bold text-emerald-400">{isFa ? 'پایش زنده مصرف' : 'Live Tracking'}</span>
          </div>
          <div className="text-2xl font-black text-white">
            {selectedAthlete.carbsLoggedG}g C <span className="text-sm text-slate-400">/ {selectedAthlete.fatsLoggedG}g F</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
            <div className="bg-emerald-400 h-full" style={{ width: '65%' }} />
            <div className="bg-indigo-400 h-full" style={{ width: '35%' }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Droplets className="w-4 h-4 text-blue-400" /> {isFa ? 'آبرسانی بدن' : 'Hydration'}
            </span>
            <span className="text-xs font-bold text-blue-300">۸۶٪</span>
          </div>
          <div className="text-2xl font-black text-blue-300">
            {selectedAthlete.hydrationOzLogged} <span className="text-sm text-slate-400">/ {selectedAthlete.hydrationOzTarget} oz</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: '86%' }} />
          </div>
        </div>
      </div>

      {/* Personalized Meal Plans & Diet Recipes */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base">{isFa ? 'پلن غذایی شخصی‌سازی‌شده' : 'Personalized meal plan'}</h3>
              <p className="text-xs text-slate-400 mt-1">{isFa ? 'برای هر وعده، کالری و ترکیب درشت‌مغذی مشخص شده است.' : 'Every meal includes calories and macro guidance.'}</p>
            </div>
            <span className="text-xs text-cyan-400 font-semibold">{isFa ? 'قابل پیگیری' : 'Trackable'}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personalizedMealPlan.map((meal) => (
              <div key={meal.title} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-bold text-white text-sm">{meal.title}</div>
                  <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                    {meal.calories} kcal
                  </span>
                </div>
                <div className="text-xs text-slate-400 leading-relaxed">{meal.recipe}</div>
                <div className="text-[11px] text-cyan-300 font-semibold">{meal.macro}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base">{isFa ? 'دستورهای غذایی رژیمی' : 'Diet-friendly recipes'}</h3>
              <p className="text-xs text-slate-400 mt-1">{isFa ? 'دستورهای آماده با کالری مشخص برای استفاده مربی و ورزشکار.' : 'Ready-to-use recipes with clear calorie targets for coach and athlete.'}</p>
            </div>
          </div>
          <div className="space-y-3">
            {dietRecipes.map((recipe) => (
              <div key={recipe.name} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-bold text-white text-sm">{recipe.name}</div>
                  <span className="text-[10px] font-bold text-emerald-300">{recipe.calories} kcal</span>
                </div>
                <div className="text-xs text-slate-400 mt-2 leading-relaxed">{recipe.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Database Food Lookup & Gram Portion Calculator Form */}
      <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-white text-base">
                {isFa ? 'محاسبه علمی ارزش غذایی از پایگاه داده (بر اساس گرم دقیق)' : 'Scientific Food Database & Gram Calculator'}
              </h3>
              <p className="text-xs text-slate-400">
                {isFa ? 'یک خوراکی را انتخاب کنید و وزن آن را بر حسب گرم تغییر دهید تا تمامی کالری‌ها و درشت‌مغذی‌ها فوراً محاسبه شوند.' : 'Select food and adjust exact grams to dynamically compute calories, macros, and micronutrients.'}
              </p>
            </div>
          </div>

          <div className="relative">
            <Search className={`w-3.5 h-3.5 absolute ${isFa ? 'right-3' : 'left-3'} top-2.5 text-slate-400`} />
            <input
              type="text"
              placeholder={isFa ? 'جستجو در بانک غذاها...' : 'Search food DB...'}
              value={foodSearchTerm}
              onChange={(e) => setFoodSearchTerm(e.target.value)}
              className={`${isFa ? 'pr-8 pl-3' : 'pl-8 pr-3'} py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-48`}
            />
          </div>
        </div>

        {/* Food Selector Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          
          {/* Food Dropdown Selector (5 cols) */}
          <div className="md:col-span-5 space-y-1">
            <label className="text-xs font-bold text-slate-300 block">{isFa ? 'انتخاب ماده غذایی از پایگاه معتبر' : 'Select Food Item'}</label>
            <select
              value={selectedFoodId}
              onChange={(e) => setSelectedFoodId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold"
            >
              {filteredFoods.map(f => (
                <option key={f.id} value={f.id}>
                  {isFa ? f.nameFa : f.nameEn} ({f.caloriesPer100g} kcal / 100g)
                </option>
              ))}
            </select>
          </div>

          {/* Portion Weight Input in Grams (3 cols) */}
          <div className="md:col-span-3 space-y-1">
            <label className="text-xs font-bold text-slate-300 block">{isFa ? 'وزن وعده (گرم)' : 'Portion Weight (Grams)'}</label>
            <input
              type="number"
              min="1"
              max="2000"
              step="5"
              value={portionGrams}
              onChange={(e) => setPortionGrams(Math.max(Number(e.target.value), 1))}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-cyan-500/60 text-xs font-mono font-black text-cyan-300 focus:outline-none"
            />
          </div>

          {/* Action Add Button (4 cols) */}
          <div className="md:col-span-4">
            <button
              onClick={handleAddCalculatedFood}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isFa ? `ثبت ${portionGrams} گرم در کارنامه امروز` : `Log ${portionGrams}g to Daily Record`}</span>
            </button>
          </div>

        </div>

        {/* Dynamic Calculated Nutrient Results Preview Card */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">{isFa ? 'کالری محاسبه‌شده' : 'Calculated Cal'}</div>
            <div className="text-lg font-black text-amber-300 font-mono mt-0.5">{computedNutrition.calories} <span className="text-[10px] font-normal text-slate-400">kcal</span></div>
          </div>

          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">{isFa ? 'پروتئین خالص' : 'Protein'}</div>
            <div className="text-lg font-black text-cyan-300 font-mono mt-0.5">{computedNutrition.proteinG}g</div>
          </div>

          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">{isFa ? 'کربوهیدرات' : 'Carbs'}</div>
            <div className="text-lg font-black text-emerald-300 font-mono mt-0.5">{computedNutrition.carbsG}g</div>
          </div>

          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">{isFa ? 'چربی سالم' : 'Fats'}</div>
            <div className="text-lg font-black text-indigo-300 font-mono mt-0.5">{computedNutrition.fatsG}g</div>
          </div>

          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">{isFa ? 'فیبر غذایی' : 'Fiber'}</div>
            <div className="text-lg font-black text-amber-400 font-mono mt-0.5">{computedNutrition.fiberG}g</div>
          </div>
        </div>

      </div>

      {/* Main Grid: Computer Vision Photo Recognition + Micronutrient Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Multi-Modal Computer Vision Meal Analyzer (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{isFa ? 'استودیوی تشخیص عکس غذای بینایی ماشین' : 'Vision AI Meal Recognition Studio'}</h3>
                <p className="text-xs text-slate-400">{isFa ? 'قطعه‌بندی اجزای بشقاب و تخمین حجمی ارزش غذایی' : 'Computer vision segmentation & volumetric macro estimation'}</p>
              </div>
            </div>

            <button
              onClick={handleSimulateScan}
              disabled={isScanning}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <ScanLine className="w-4 h-4" />
              <span>{isScanning ? (isFa ? 'در حال آنالیز...' : 'Segmenting Plate...') : (isFa ? 'اسکن نمونه غذا' : 'Scan Sample Meal')}</span>
            </button>
          </div>

          {/* Interactive Photo Simulator Container */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-72 bg-slate-950 flex items-center justify-center">
            <img
              src={selectedMealPhoto}
              alt="Meal Photo"
              className="w-full h-full object-cover opacity-80"
            />

            {/* Bounding Box Highlights Overlays */}
            <div className="absolute inset-0 p-4 pointer-events-none">
              <div className="absolute top-12 left-16 border-2 border-cyan-400 bg-cyan-950/40 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded shadow-lg flex items-center gap-1 animate-pulse">
                <CheckCircle2 className="w-3 h-3 text-cyan-400" /> {isFa ? 'پروتئین گریل (۲۲۰ گرم)' : 'Grilled Protein (220g)'}
              </div>

              <div className="absolute bottom-16 right-20 border-2 border-emerald-400 bg-emerald-950/40 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded shadow-lg flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {isFa ? 'کربوهیدرات پیچیده (۱۸۰ گرم)' : 'Complex Carbs (180g)'}
              </div>
            </div>

            {isScanning && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-cyan-300 font-bold tracking-wider uppercase">{isFa ? 'اجرای شبکه عصبی قطعه‌بندی تصویر...' : 'Running Neural Segmentation...'}</span>
              </div>
            )}
          </div>

          {/* Scanned Breakdown Output */}
          {scannedResult && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> {isFa ? 'استخراج ارزش غذایی کامل شد' : 'Vision Extraction Complete'}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  {scannedResult.confidence}٪ {isFa ? 'اطمینان مدل' : 'Neural Confidence'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                {scannedResult.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-900 text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {item}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{isFa ? `قطعه ${idx + 1}` : `Segment ${idx + 1}`}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">{isFa ? 'کالری' : 'Calories'}</div>
                  <div className="font-bold text-amber-300">{scannedResult.calories}</div>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">{isFa ? 'پروتئین' : 'Protein'}</div>
                  <div className="font-bold text-cyan-300">{scannedResult.proteinG}g</div>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">{isFa ? 'کربوهیدرات' : 'Carbs'}</div>
                  <div className="font-bold text-emerald-300">{scannedResult.carbsG}g</div>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">{isFa ? 'چربی' : 'Fats'}</div>
                  <div className="font-bold text-indigo-300">{scannedResult.fatsG}g</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Micronutrient Panel & Glycemic Load Index (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-bold text-white text-base flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> {isFa ? 'ماتریس ۳۴ ریزمغذی ضروری' : '34 Micronutrient Matrix'}
            </h3>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              {isFa ? 'جذب زیستی بهینه' : 'Optimal Bio-Availability'}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>{isFa ? 'منیزیم گلیسینات (عضله/خواب)' : 'Magnesium Glycinate'}</span>
                <span className="font-bold text-emerald-400">420mg / 400mg (105%)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full w-[100%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>{isFa ? 'روی پیکولینات (محور هورمونی)' : 'Zinc Picolinate'}</span>
                <span className="font-bold text-emerald-400">25mg / 25mg (100%)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full w-[100%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>{isFa ? 'ویتامین D3 + K2 (استخوان/ایمنی)' : 'Vitamin D3 + K2'}</span>
                <span className="font-bold text-amber-400">3,200 IU / 5,000 IU (64%)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full w-[64%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>{isFa ? 'امگا-۳ EPA/DHA (ضدالتهاب)' : 'Omega-3 EPA/DHA'}</span>
                <span className="font-bold text-emerald-400">2,800mg / 3,000mg (93%)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full w-[93%]" />
              </div>
            </div>
          </div>

          {/* Supplement Protocols Active */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">{isFa ? 'پروتکل مکمل‌های غذایی تجویز شده' : 'Assigned Supplement Protocols'}</h4>
            <div className="space-y-2">
              {selectedAthlete.supplements.map((supp, sIdx) => (
                <div key={sIdx} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{supp.name}</div>
                    <div className="text-[10px] text-slate-400">{supp.dosage} • {supp.timing}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    supp.status === 'Taken' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isFa ? (supp.status === 'Taken' ? 'مصرف شده' : 'در انتظار') : supp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

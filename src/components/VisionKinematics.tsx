import React, { useState } from 'react';
import type { AthleteProfile } from '../types';
import { 
  Camera, 
  Play, 
  Pause, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert,
  Sliders
} from 'lucide-react';

interface VisionKinematicsProps {
  selectedAthlete: AthleteProfile;
  lang?: 'en' | 'fa';
}

export const VisionKinematics: React.FC<VisionKinematicsProps> = ({ selectedAthlete, lang = 'fa' }) => {
  const isFa = lang === 'fa';
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [selectedLift, setSelectedLift] = useState<'Squat' | 'Deadlift' | 'Bench'>('Squat');
  const [currentFrame, setCurrentFrame] = useState<number>(45);

  // Interactive Live Sliders for Joint Kinematics Controls
  const [kneeAngleDeg, setKneeAngleDeg] = useState<number>(112);
  const [spinalFlexionDeg, setSpinalFlexionDeg] = useState<number>(3.2);
  const [barVelocityMs, setBarVelocityMs] = useState<number>(0.42);

  // Dynamic Score Calculation
  const calculateKineticScore = () => {
    let base = 100;
    
    // Deduct points for high spinal flexion
    if (spinalFlexionDeg > 5.0) {
      base -= (spinalFlexionDeg - 5.0) * 8;
    }

    // Deduct or reward based on bar velocity
    if (barVelocityMs < 0.25) {
      base -= 10;
    } else if (barVelocityMs > 0.45) {
      base += 5;
    }

    return Math.max(Math.min(Math.round(base), 100), 40);
  };

  const kineticScore = calculateKineticScore();

  return (
    <div className="p-2 sm:p-4 lg:p-8 space-y-6 lg:space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold uppercase tracking-wider">
              {isFa ? 'موتور کینماتیک بیومکانیک با بینایی ماشین' : 'Computer Vision Kinematics Engine'}
            </span>
            <span className="text-xs text-slate-400">{isFa ? 'ورزشکار: ' : 'Athlete: '}<strong className="text-white">{selectedAthlete.name}</strong></span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">{isFa ? 'آنالیز زنده بیومکانیک و ردیابی ۳۳ نقطه اسکلتی' : 'On-Device 33-Point Pose Estimation'}</h2>
          <p className="text-xs text-slate-400 mt-1">{isFa ? 'اسلایدرها را جابجا کنید تا تغییر زنده امتیاز تکنیک حرکتی و هشدارهای ایمنی را مشاهده نمایید.' : 'Adjust joint angle sliders to see live technique score recalibrations.'}</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {(['Squat', 'Deadlift', 'Bench'] as const).map((lift) => (
            <button
              key={lift}
              onClick={() => setSelectedLift(lift)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedLift === lift
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lift === 'Squat' ? (isFa ? 'اسکوات' : 'Squat') :
               lift === 'Deadlift' ? (isFa ? 'ددلیفت' : 'Deadlift') : (isFa ? 'پرس سینه' : 'Bench')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Vision Canvas & Interactive Telemetry Sliders Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Video Mesh Canvas Simulation (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">{isFa ? `حرکت ${selectedLift} با ردیابی بینایی ماشین` : `${selectedLift} Kinematics Render`}</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 font-bold">{isFa ? 'رندر کینماتیک ۶۰ فریم بر ثانیه' : '60 FPS Render'}</span>
            </div>
          </div>

          {/* Interactive Video Mesh Frame Simulation */}
          <div className="relative h-96 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
            
            <img
              src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1000&auto=format&fit=crop&q=80"
              alt="Exercise Kinematics Analysis"
              className="w-full h-full object-cover opacity-35"
            />

            {/* Simulated 33-Point MediaPipe Mesh Skeleton Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600">
              <line x1="500" y1="180" x2="500" y2="340" stroke={spinalFlexionDeg > 5 ? "#f43f5e" : "#06b6d4"} strokeWidth="4" strokeDasharray="6 2" />
              <line x1="500" y1="340" x2="420" y2="450" stroke="#10b981" strokeWidth="4" />
              <line x1="500" y1="340" x2="580" y2="450" stroke="#10b981" strokeWidth="4" />

              {[
                { x: 500, y: 150, label: isFa ? 'جمجمه' : 'Cranium' },
                { x: 500, y: 180, label: isFa ? 'C7 Cervical' : 'C7 Cervical' },
                { x: 500, y: 340, label: isFa ? `انحراف کمر (${spinalFlexionDeg}°)` : `Spine Flex (${spinalFlexionDeg}°)` },
                { x: 420, y: 450, label: isFa ? `زاویه زانو (${kneeAngleDeg}°)` : `Knee (${kneeAngleDeg}°)` },
              ].map((pt, idx) => (
                <g key={idx}>
                  <circle cx={pt.x} cy={pt.y} r="8" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
                  <text x={pt.x + 12} y={pt.y + 4} fill="#e2e8f0" fontSize="11" fontWeight="bold">
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>

            {/* Floating Live Overlay Badges */}
            <div className={`absolute top-4 ${isFa ? 'right-4 text-right' : 'left-4'} bg-slate-900/90 border border-slate-800 backdrop-blur-md p-3 rounded-xl space-y-1`}>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">{isFa ? 'سرعت جابجایی' : 'Bar Velocity'}</div>
              <div className="text-xl font-black text-cyan-300 font-mono">{barVelocityMs} m/s</div>
            </div>

            <div className={`absolute top-4 ${isFa ? 'left-4 text-left' : 'right-4 text-right'} bg-slate-900/90 border border-slate-800 backdrop-blur-md p-3 rounded-xl space-y-1`}>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">{isFa ? 'امتیاز زنده تکنیک' : 'Kinetic Score'}</div>
              <div className={`text-xl font-black font-mono ${
                kineticScore > 85 ? 'text-emerald-400' : kineticScore > 70 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {kineticScore} / ۱۰۰
              </div>
            </div>

            {/* Bottom Play Controls */}
            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 border border-slate-800 backdrop-blur-md p-3 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <span className="text-xs text-slate-300 font-mono">{isFa ? `فریم ${currentFrame} از ۱۲۰` : `Frame ${currentFrame} / 120`}</span>
              </div>

              <input
                type="range"
                min="0"
                max="120"
                value={currentFrame}
                onChange={(e) => setCurrentFrame(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

          </div>

        </div>

        {/* Right Column: Interactive Sliders & Real-Time Biomechanical Feedback */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>{isFa ? 'کنترل‌های تعاملی بیومکانیک' : 'Interactive Kinematics Sliders'}</span>
            </h3>
            <p className="text-xs text-slate-400">{isFa ? 'تغییر زنده زوایا و سرعت جهت ارزیابی انحراف از فرم صحیح' : 'Adjust parameters live to see real-time safety scores.'}</p>
          </div>

          <div className="space-y-4 text-xs">
            
            {/* Slider 1: Knee Extension Angle */}
            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">{isFa ? 'زاویه خم زانو' : 'Knee Flexion'}</span>
                <span className="font-bold text-cyan-300 font-mono">{kneeAngleDeg}°</span>
              </div>
              <input
                type="range"
                min="70"
                max="160"
                value={kneeAngleDeg}
                onChange={(e) => setKneeAngleDeg(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Slider 2: Lumbar Spinal Flexion */}
            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">{isFa ? 'خمیدگی ستون فقرات کمری' : 'Spinal Flexion'}</span>
                <span className={`font-bold font-mono ${spinalFlexionDeg > 5.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {spinalFlexionDeg}°
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="12.0"
                step="0.2"
                value={spinalFlexionDeg}
                onChange={(e) => setSpinalFlexionDeg(Number(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer"
              />
            </div>

            {/* Slider 3: Barbell Velocity */}
            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">{isFa ? 'سرعت جابجایی هالتر' : 'Barbell Velocity'}</span>
                <span className="font-bold text-amber-300 font-mono">{barVelocityMs} m/s</span>
              </div>
              <input
                type="range"
                min="0.15"
                max="0.85"
                step="0.01"
                value={barVelocityMs}
                onChange={(e) => setBarVelocityMs(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

          </div>

          {/* Real-Time AI Corrective Cues Box */}
          <div className="pt-2 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> {isFa ? 'تحلیل آنی هوش مصنوعی' : 'Real-time AI Cues'}
            </h4>

            {spinalFlexionDeg > 5.0 ? (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-200 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4 text-rose-400" /> {isFa ? 'هشدار خطر انحراف کمری' : 'High Spinal Danger'}
                </div>
                <p className="text-[11px] leading-relaxed">
                  {isFa 
                    ? `خمیدگی کمری ${spinalFlexionDeg} درجه از آستانه ایمن ۵.۰ درجه عبور کرد! امتیاز تکنیک به ${kineticScore} افت یافت. کاهش بار وزنه توصیه می‌شود.`
                    : `Spinal flexion (${spinalFlexionDeg}°) crossed 5° safe threshold.`}
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-200 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {isFa ? 'فرم و بیومکانیک ایمن' : 'Optimal Biomechanics'}
                </div>
                <p className="text-[11px] leading-relaxed">
                  {isFa 
                    ? `ستون فقرات در محدوده خنثی (${spinalFlexionDeg}°) قرار دارد. امتیاز تکنیک عالی ${kineticScore} از ۱۰۰ محقق شد.`
                    : `Spine maintained in safe neutral zone.`}
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

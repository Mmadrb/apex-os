import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { StatCards } from './components/StatCards';
import { ActiveAlerts } from './components/ActiveAlerts';
import { StaminaChart } from './components/StaminaChart';
import { RosterGrid } from './components/RosterGrid';
import { BiometricCalibrator } from './components/BiometricCalibrator';
import { CoachDashboard } from './components/CoachDashboard';
import { WorkoutBuilder } from './components/WorkoutBuilder';
import { NutritionStudio } from './components/NutritionStudio';
import { VisionKinematics } from './components/VisionKinematics';
import { BiometricsLab } from './components/BiometricsLab';
import { Athlete360Profile } from './components/Athlete360Profile';
import { FranchiseHQ } from './components/FranchiseHQ';
import { AthleteMobileSim } from './components/AthleteMobileSim';
import { InvestorDeck } from './components/InvestorDeck';

import { 
  MOCK_ATHLETES, 
  EXERCISE_DATABASE, 
  MOCK_PROGRAM, 
  MOCK_FRANCHISES, 
  MOCK_AI_RECOMMENDATIONS 
} from './data/mockData';

import {
  MOCK_ATHLETES_FA,
  EXERCISE_DATABASE_FA,
  MOCK_PROGRAM_FA,
  MOCK_FRANCHISES_FA,
  MOCK_AI_RECOMMENDATIONS_FA
} from './data/mockDataFa';

import type { AthleteProfile, WorkoutProgram, AIRecommendation } from './types';

export function App() {
  const [lang, setLang] = useState<'en' | 'fa'>('fa'); // Default Persian
  const [activeTab, setActiveTab] = useState<string>('coach');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState<string>('');

  const isFa = lang === 'fa';

  const initialAthletes = isFa ? MOCK_ATHLETES_FA : MOCK_ATHLETES;
  const exerciseDb = isFa ? EXERCISE_DATABASE_FA : EXERCISE_DATABASE;
  const initialProgram = isFa ? MOCK_PROGRAM_FA : MOCK_PROGRAM;
  const franchises = isFa ? MOCK_FRANCHISES_FA : MOCK_FRANCHISES;
  const initialAiRecs = isFa ? MOCK_AI_RECOMMENDATIONS_FA : MOCK_AI_RECOMMENDATIONS;

  const [athletes, setAthletes] = useState<AthleteProfile[]>(initialAthletes);
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteProfile>(initialAthletes[0]);
  const [program, setProgram] = useState<WorkoutProgram>(initialProgram);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>(initialAiRecs);

  useEffect(() => {
    document.documentElement.dir = isFa ? 'rtl' : 'ltr';
    document.documentElement.lang = isFa ? 'fa' : 'en';
    const newAthletes = isFa ? MOCK_ATHLETES_FA : MOCK_ATHLETES;
    setAthletes(newAthletes);
    setSelectedAthlete(newAthletes[0]);
    setProgram(isFa ? MOCK_PROGRAM_FA : MOCK_PROGRAM);
    setAiRecommendations(isFa ? MOCK_AI_RECOMMENDATIONS_FA : MOCK_AI_RECOMMENDATIONS);
  }, [lang]);

  const handleUpdateAthlete = (updated: AthleteProfile) => {
    setSelectedAthlete(updated);
    setAthletes(prev => prev.map(a => (a.id === updated.id ? updated : a)));
  };

  const handleApplyAIRecommendation = (recId: string) => {
    setAiRecommendations(prev =>
      prev.map(r => (r.id === recId ? { ...r, applied: true } : r))
    );
  };

  const handleUpdateProgram = (newProg: WorkoutProgram) => {
    setProgram(newProg);
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased ${isFa ? 'font-vazir' : ''}`}>
      
      {/* 1. Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        alertCount={aiRecommendations.filter(r => !r.applied).length}
        lang={lang}
      />

      {/* 2. Main Workspace Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header */}
        <TopHeader
          searchTerm={globalSearchTerm}
          setSearchTerm={setGlobalSearchTerm}
          aiRecommendations={aiRecommendations}
          selectedAthleteName={selectedAthlete.name}
          lang={lang}
          setLang={setLang}
        />

        {/* Main Content Dashboard Canvas Area */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Always Present Live Biometric Calibrator */}
          {activeTab !== 'investor_deck' && activeTab !== 'franchise' && (
            <BiometricCalibrator
              athlete={selectedAthlete}
              onUpdateAthlete={handleUpdateAthlete}
              lang={lang}
            />
          )}

          {/* Tab 1: Main Overview Dashboard (Combines Stat Cards, Active Alerts & Stamina Chart) */}
          {activeTab === 'coach' && (
            <div className="space-y-6">
              
              {/* Top Row: Stat Cards Metrics */}
              <StatCards
                avgHeartRateBpm={58}
                totalSprintKm={14.8}
                acwrStrainRatio={selectedAthlete.wearableSync.acwrRatio}
                teamReadinessPercent={88}
                lang={lang}
              />

              {/* Grid: Active Alerts & Stamina Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Active Warnings & Injury Alerts Box (5 cols) */}
                <div className="lg:col-span-5">
                  <ActiveAlerts
                    alerts={aiRecommendations}
                    onApplyAlert={handleApplyAIRecommendation}
                    lang={lang}
                  />
                </div>

                {/* Stamina & Performance Area Chart (7 cols) */}
                <div className="lg:col-span-7">
                  <StaminaChart lang={lang} />
                </div>

              </div>

              {/* Full Roster Grid & Coach Triage Details */}
              <CoachDashboard
                athletes={athletes}
                selectedAthlete={selectedAthlete}
                onSelectAthlete={setSelectedAthlete}
                aiRecommendations={aiRecommendations}
                onApplyAIRecommendation={handleApplyAIRecommendation}
                onNavigateTab={setActiveTab}
                lang={lang}
              />
            </div>
          )}

          {/* Tab 2: Team Roster Module */}
          {activeTab === 'roster' && (
            <RosterGrid
              athletes={athletes}
              selectedAthlete={selectedAthlete}
              onSelectAthlete={setSelectedAthlete}
              onNavigateTab={setActiveTab}
              lang={lang}
            />
          )}

          {/* Tab 3: Biometrics & Telemetry */}
          {activeTab === 'biometrics' && (
            <BiometricsLab selectedAthlete={selectedAthlete} lang={lang} />
          )}

          {/* Tab 4: Motion Analysis Kinematics */}
          {activeTab === 'vision' && (
            <VisionKinematics selectedAthlete={selectedAthlete} lang={lang} />
          )}

          {/* Tab 5: Workout Builder */}
          {activeTab === 'builder' && (
            <WorkoutBuilder
              program={program}
              exerciseDb={exerciseDb}
              selectedAthlete={selectedAthlete}
              onUpdateProgram={handleUpdateProgram}
              lang={lang}
            />
          )}

          {/* Tab 6: Nutrition Studio */}
          {activeTab === 'nutrition' && (
            <NutritionStudio
              selectedAthlete={selectedAthlete}
              onUpdateAthlete={handleUpdateAthlete}
              lang={lang}
            />
          )}

          {/* Tab 7: 360 Athlete Profile */}
          {activeTab === 'profile360' && (
            <Athlete360Profile
              athlete={selectedAthlete}
              onUpdateAthlete={handleUpdateAthlete}
              lang={lang}
            />
          )}

          {/* Tab 8: Gym Franchise Operations */}
          {activeTab === 'franchise' && (
            <FranchiseHQ franchises={franchises} lang={lang} />
          )}

          {/* Tab 9: Athlete Mobile Sim */}
          {activeTab === 'mobile_sim' && (
            <AthleteMobileSim athlete={selectedAthlete} program={program} lang={lang} />
          )}

          {/* Tab 10: Investor Pitch Deck */}
          {activeTab === 'investor_deck' && (
            <InvestorDeck lang={lang} />
          )}

        </main>

        {/* Global Dashboard Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-900/60 py-4 px-6 text-center text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <strong>
                {isFa ? 'معماری داشبورد مربیگری اپکس (ApexOS)' : 'ApexOS Refactored SaaS Architecture'}
              </strong> • {isFa ? 'سیستم‌عامل عملکرد ورزشی و طول عمر' : 'AI Operating System for Human Performance & Longevity'}
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-[11px]">
              <span>{isFa ? 'رابط کاربری ری‌اکت و تیلویند' : 'React & Tailwind CSS'}</span>
              <span>{isFa ? 'نمودارهای Recharts زنده' : 'Recharts Analytics'}</span>
              <span>{isFa ? 'کاملاً رسپانسیو' : 'Fully Responsive'}</span>
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}

export default App;

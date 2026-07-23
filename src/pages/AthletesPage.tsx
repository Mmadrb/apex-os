import React from 'react';
import { RosterGrid } from '../components/RosterGrid';
import type { AthleteProfile } from '../types';
import type { AppTab } from '../utils/formatters';

interface AthletesPageProps {
  athletes: AthleteProfile[];
  selectedAthlete: AthleteProfile;
  onSelectAthlete: (athlete: AthleteProfile) => void;
  onAddAthlete: (payload: { name: string; goal: string; affiliatedGym: string; previousCoach: string }) => void;
  onNavigateTab: (tab: AppTab) => void;
  lang?: 'fa' | 'en';
}

export const AthletesPage: React.FC<AthletesPageProps> = ({
  athletes,
  selectedAthlete,
  onSelectAthlete,
  onAddAthlete,
  onNavigateTab,
  lang = 'fa',
}) => {
  return (
    <section aria-label={lang === 'fa' ? 'صفحه ورزشکاران' : 'Athletes page'}>
      <RosterGrid
        athletes={athletes}
        selectedAthlete={selectedAthlete}
        onSelectAthlete={onSelectAthlete}
        onAddAthlete={onAddAthlete}
        onNavigateTab={onNavigateTab}
        lang={lang}
      />
    </section>
  );
};

export default AthletesPage;

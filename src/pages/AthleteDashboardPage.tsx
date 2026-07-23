import React from 'react';
import { AthleteMobileSim } from '../components/AthleteMobileSim';
import type { AthleteProfile, WorkoutProgram } from '../types';

interface AthleteDashboardPageProps {
  athlete: AthleteProfile;
  program: WorkoutProgram;
  onUpdateAthlete: (athlete: AthleteProfile) => void;
  onUpdateProgram: (program: WorkoutProgram) => void;
  lang?: 'fa' | 'en';
}

export const AthleteDashboardPage: React.FC<AthleteDashboardPageProps> = ({
  athlete,
  program,
  onUpdateAthlete,
  onUpdateProgram,
  lang = 'fa',
}) => {
  return (
    <section aria-label={lang === 'fa' ? 'صفحه داشبورد ورزشکار' : 'Athlete dashboard page'}>
      <AthleteMobileSim
        athlete={athlete}
        program={program}
        onUpdateAthlete={onUpdateAthlete}
        onUpdateProgram={onUpdateProgram}
        lang={lang}
      />
    </section>
  );
};

export default AthleteDashboardPage;

import React from 'react';
import { WorkoutBuilder } from '../components/WorkoutBuilder';
import type { AthleteProfile, Exercise, WorkoutProgram } from '../types';

interface WorkoutsPageProps {
  program: WorkoutProgram;
  exerciseDb: Exercise[];
  selectedAthlete: AthleteProfile;
  onUpdateProgram: (program: WorkoutProgram) => void;
  lang?: 'fa' | 'en';
}

export const WorkoutsPage: React.FC<WorkoutsPageProps> = ({
  program,
  exerciseDb,
  selectedAthlete,
  onUpdateProgram,
  lang = 'fa',
}) => {
  return (
    <section aria-label={lang === 'fa' ? 'صفحه طراح تمرینات' : 'Workout builder page'}>
      <WorkoutBuilder
        program={program}
        exerciseDb={exerciseDb}
        selectedAthlete={selectedAthlete}
        onUpdateProgram={onUpdateProgram}
        lang={lang}
      />
    </section>
  );
};

export default WorkoutsPage;

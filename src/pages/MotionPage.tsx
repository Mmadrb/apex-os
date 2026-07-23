import React from 'react';
import { VisionKinematics } from '../components/VisionKinematics';
import type { AthleteProfile } from '../types';

interface MotionPageProps {
  selectedAthlete: AthleteProfile;
  lang?: 'fa' | 'en';
}

export const MotionPage: React.FC<MotionPageProps> = ({ selectedAthlete, lang = 'fa' }) => {
  return (
    <section aria-label={lang === 'fa' ? 'صفحه آنالیز حرکت' : 'Motion analysis page'}>
      <VisionKinematics selectedAthlete={selectedAthlete} lang={lang} />
    </section>
  );
};

export default MotionPage;

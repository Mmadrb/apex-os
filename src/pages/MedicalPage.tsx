import React from 'react';
import { BiometricsLab } from '../components/BiometricsLab';
import type { AthleteProfile } from '../types';

interface MedicalPageProps {
  selectedAthlete: AthleteProfile;
  onUpdateAthlete: (athlete: AthleteProfile) => void;
  lang?: 'fa' | 'en';
}

export const MedicalPage: React.FC<MedicalPageProps> = ({ selectedAthlete, onUpdateAthlete, lang = 'fa' }) => {
  return (
    <section aria-label={lang === 'fa' ? 'صفحه پزشکی و بیومتریک' : 'Medical and biometrics page'}>
      <BiometricsLab selectedAthlete={selectedAthlete} onUpdateAthlete={onUpdateAthlete} lang={lang} />
    </section>
  );
};

export default MedicalPage;

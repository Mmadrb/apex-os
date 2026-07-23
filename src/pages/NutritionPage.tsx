import React from 'react';
import { NutritionStudio } from '../components/NutritionStudio';
import type { AthleteProfile } from '../types';

interface NutritionPageProps {
  selectedAthlete: AthleteProfile;
  onUpdateAthlete: (athlete: AthleteProfile) => void;
  lang?: 'fa' | 'en';
}

export const NutritionPage: React.FC<NutritionPageProps> = ({ selectedAthlete, onUpdateAthlete, lang = 'fa' }) => {
  return (
    <section aria-label={lang === 'fa' ? 'صفحه تغذیه' : 'Nutrition page'}>
      <NutritionStudio selectedAthlete={selectedAthlete} onUpdateAthlete={onUpdateAthlete} lang={lang} />
    </section>
  );
};

export default NutritionPage;

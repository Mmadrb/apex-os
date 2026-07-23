import React from 'react';
import { Athlete360Profile } from '../components/Athlete360Profile';
import type { AthleteProfile } from '../types';

interface Profile360PageProps {
  athlete: AthleteProfile;
  onUpdateAthlete: (athlete: AthleteProfile) => void;
  lang?: 'fa' | 'en';
}

export const Profile360Page: React.FC<Profile360PageProps> = ({ athlete, onUpdateAthlete, lang = 'fa' }) => {
  return (
    <section aria-label={lang === 'fa' ? 'صفحه پروفایل ۳۶۰' : '360 profile page'}>
      <Athlete360Profile athlete={athlete} onUpdateAthlete={onUpdateAthlete} lang={lang} />
    </section>
  );
};

export default Profile360Page;

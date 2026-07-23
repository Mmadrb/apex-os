import React from 'react';
import { LoadingGrid } from './ui/LoadingGrid';

interface RouteLoadingProps {
  lang?: 'fa' | 'en';
}

export const RouteLoading: React.FC<RouteLoadingProps> = ({ lang = 'fa' }) => {
  const isFa = lang === 'fa';

  return (
    <LoadingGrid
      title={isFa ? 'در حال بارگذاری ماژول داشبورد...' : 'Loading dashboard module...'}
      description={isFa ? 'در حال آماده‌سازی نمای انتخاب‌شده شما' : 'Preparing your selected workspace view'}
    />
  );
};

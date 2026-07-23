import React from 'react';

interface LoadingGridProps {
  title?: string;
  description?: string;
}

export const LoadingGrid: React.FC<LoadingGridProps> = ({ title, description }) => {
  return (
    <div role="status" aria-live="polite" className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl space-y-6">
      {(title || description) && (
        <div>
          {title ? <div className="text-sm font-black text-white">{title}</div> : null}
          {description ? <div className="text-xs text-slate-300 mt-1">{description}</div> : null}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-4 animate-pulse">
            <div className="h-4 w-28 rounded bg-slate-800" />
            <div className="h-8 w-20 rounded bg-slate-800" />
            <div className="h-2 w-full rounded-full bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action }) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 p-6 text-center space-y-3">
      {icon ? <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-300">{icon}</div> : null}
      <div>
        <div className="text-sm font-black text-white">{title}</div>
        <div className="text-xs text-slate-400 mt-2 leading-relaxed max-w-md mx-auto">{description}</div>
      </div>
      {action ? <div className="pt-1 flex justify-center">{action}</div> : null}
    </div>
  );
};

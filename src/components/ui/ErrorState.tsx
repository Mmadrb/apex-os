import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  tone?: 'warning' | 'critical';
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  action,
  tone = 'warning',
}) => {
  const toneClass =
    tone === 'critical'
      ? 'border-rose-500/30 bg-rose-950/20 text-rose-200'
      : 'border-amber-500/30 bg-amber-950/20 text-amber-200';
  const iconClass = tone === 'critical' ? 'text-rose-300' : 'text-amber-300';

  return (
    <div className={`rounded-2xl border p-5 space-y-3 ${toneClass}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-slate-950/40 border border-current/20 flex items-center justify-center shrink-0">
          <AlertTriangle className={`w-5 h-5 ${iconClass}`} />
        </div>
        <div>
          <div className="text-sm font-black text-white">{title}</div>
          <div className="text-xs mt-2 leading-relaxed">{description}</div>
        </div>
      </div>
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
};

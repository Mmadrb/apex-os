import React from 'react';

interface PanelShellProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const PanelShell: React.FC<PanelShellProps> = ({ title, subtitle, actions, children, className = '' }) => {
  return (
    <section className={`rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 transition-all duration-300 animate-soft-enter hover:shadow-cyan-950/20 ${className}`}>
      {(title || actions) && (
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            {title ? <h2 className="text-lg font-black text-white">{title}</h2> : null}
            {subtitle ? <p className="text-xs text-slate-300 mt-1 leading-relaxed">{subtitle}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
};

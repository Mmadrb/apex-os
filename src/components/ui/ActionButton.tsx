import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  variant = 'secondary',
  icon,
  className = '',
  children,
  ...props
}) => {
  const variantClasses =
    variant === 'primary'
      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border border-cyan-400/40'
      : variant === 'ghost'
        ? 'bg-transparent hover:bg-slate-800 text-slate-100 border border-slate-700/60'
        : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/60';

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold min-h-11 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${variantClasses} ${className}`}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};

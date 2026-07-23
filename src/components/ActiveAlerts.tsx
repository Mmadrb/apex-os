import React from 'react';
import { CheckCircle2, FileCheck, ShieldAlert, UserCheck } from 'lucide-react';
import type { AIRecommendation } from '../types';
import { formatCount, formatPercent } from '../utils/formatters';
import { EmptyState } from './ui/EmptyState';

interface ActiveAlertsProps {
  alerts: AIRecommendation[];
  onApplyAlert: (alertId: string) => void;
  lang?: 'en' | 'fa';
}

export const ActiveAlerts: React.FC<ActiveAlertsProps> = ({ alerts, onApplyAlert, lang = 'fa' }) => {
  const isFa = lang === 'fa';
  const activeAlerts = alerts.filter((alert) => !alert.applied);

  return (
    <section
      className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-2xl space-y-4 relative overflow-hidden"
      aria-labelledby="active-alerts-heading"
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 id="active-alerts-heading" className="font-extrabold text-white text-sm flex items-center gap-2 flex-wrap">
              <span>{isFa ? 'هشدارهای زنده و بار تمرینی' : 'Active athlete warnings & load alerts'}</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 animate-pulse">
                {formatCount(activeAlerts.length, lang)} {isFa ? 'هشدار بحرانی' : 'urgent alerts'}
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              {isFa
                ? 'پیشنهادهای قابل پیگیری برای کاهش بار، تعویض ورزشکار و مداخله سریع.'
                : 'Trackable recommendations for deloading, substitution, and fast intervention.'}
            </p>
          </div>
        </div>

        <span className="text-[11px] text-slate-300 hidden sm:block">
          {isFa ? 'تأیید مستقیم با یک کلیک' : '1-click decision engine'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <div className="text-slate-400">{isFa ? 'هشدارهای باز' : 'Open alerts'}</div>
          <div className="text-xl font-black text-white mt-2">{formatCount(activeAlerts.length, lang)}</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <div className="text-slate-400">{isFa ? 'اقدام‌شده' : 'Actioned'}</div>
          <div className="text-xl font-black text-emerald-300 mt-2">{formatCount(alerts.filter((alert) => alert.applied).length, lang)}</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <div className="text-slate-400">{isFa ? 'میانگین اطمینان' : 'Avg confidence'}</div>
          <div className="text-xl font-black text-cyan-300 mt-2">
            {formatPercent(
              Math.round(
                alerts.reduce((acc, alert) => acc + (alert.evidence?.confidenceScorePercent ?? 0), 0) /
                  Math.max(alerts.filter((alert) => alert.evidence).length, 1)
              )
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3" aria-live="polite">
        {alerts.length === 0 ? (
          <EmptyState
            title={isFa ? 'هشداری ثبت نشده است' : 'No alerts available'}
            description={isFa ? 'وقتی سیگنال‌های AI یا پوشیدنی‌ها هشدار ایجاد کنند، اینجا نمایش داده می‌شود.' : 'AI and wearable driven alerts will appear here when the system detects intervention needs.'}
            icon={<ShieldAlert className="w-5 h-5" />}
          />
        ) : alerts.map((alert) => (
          <article
            key={alert.id}
            className={`p-4 rounded-xl border transition-all space-y-3 ${
              alert.applied ? 'bg-slate-950/40 border-slate-800/80 opacity-60' : 'bg-slate-950 border-amber-500/40 hover:border-amber-400 shadow-lg'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${alert.applied ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-black text-white text-xs sm:text-sm">{alert.athleteName}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-amber-300 border border-slate-700">
                      {alert.category}
                    </span>
                    {alert.reviewed === false && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/20">
                        {isFa ? 'جدید' : 'New'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">⚠️ {alert.suggestedAction}</p>
                </div>
              </div>

              <div className="shrink-0 flex items-center justify-end">
                {!alert.applied ? (
                  <button
                    onClick={() => onApplyAlert(alert.id)}
                    aria-label={isFa ? `اعمال هشدار برای ${alert.athleteName}` : `Apply alert action for ${alert.athleteName}`}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-1.5 active:scale-95 min-h-11"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{isFa ? 'اعمال دستور' : 'Apply action'}</span>
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {isFa ? 'اقدام ثبت شد' : 'Action executed'}
                  </span>
                )}
              </div>
            </div>

            {alert.evidence && (
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 text-[11px] text-cyan-200 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span><strong>{isFa ? 'منبع شواهد: ' : 'Data source: '}</strong>{alert.evidence.dataSource}</span>
                </div>
                <span className="font-mono font-bold text-emerald-400">
                  {isFa ? `اطمینان مدل: ${formatPercent(alert.evidence.confidenceScorePercent)}` : `Confidence: ${formatPercent(alert.evidence.confidenceScorePercent)}`}
                </span>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

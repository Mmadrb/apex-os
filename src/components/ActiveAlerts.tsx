import React from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  FileCheck,
  UserCheck
} from 'lucide-react';
import type { AIRecommendation } from '../types';

interface ActiveAlertsProps {
  alerts: AIRecommendation[];
  onApplyAlert: (alertId: string) => void;
  lang?: 'en' | 'fa';
}

export const ActiveAlerts: React.FC<ActiveAlertsProps> = ({
  alerts,
  onApplyAlert,
  lang = 'fa'
}) => {
  const isFa = lang === 'fa';

  return (
    <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-2xl space-y-4 relative overflow-hidden">
      
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <span>{isFa ? 'هشدارهای خطرات زیستی زنده تیم (Active Player Alerts)' : 'Active Athlete Warnings & Load Alerts'}</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 animate-pulse">
                {alerts.filter(a => !a.applied).length} {isFa ? 'هشدار بحرانی' : 'Urgent Alerts'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isFa ? 'پیشنهادهای هوش مصنوعی مبنی بر تعویض بازیکن یا کاهش بار تمرینی جهت جلوگیری از پارگی همسترینگ و دیسک کمری.' : 'Real-time injury risk indicators requiring coach intervention.'}
            </p>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:block">
          {isFa ? 'تایید مستقیم با ۱ کلیک' : '1-Click Decision Engine'}
        </span>
      </div>

      {/* Alerts Stream List */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className={`p-4 rounded-xl border transition-all space-y-3 ${
              alert.applied 
                ? 'bg-slate-950/40 border-slate-800/80 opacity-60' 
                : 'bg-slate-950 border-amber-500/40 hover:border-amber-400 shadow-lg'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-white text-xs sm:text-sm">{alert.athleteName}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-amber-300 border border-slate-700">
                      {alert.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    ⚠️ {alert.suggestedAction}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 flex items-center justify-end">
                {!alert.applied ? (
                  <button
                    onClick={() => onApplyAlert(alert.id)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{isFa ? 'تعویض / اعمال دستور هوش مصنوعی' : 'Substitute / Recalibrate Load'}</span>
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {isFa ? 'دستور اعمال گردید' : 'Action Executed'}
                  </span>
                )}
              </div>
            </div>

            {/* Evidence Layer Insight Dropdown */}
            {alert.evidence && (
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80 text-[11px] text-cyan-200 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span><strong>{isFa ? 'منبع شواهد: ' : 'Data Source: '}</strong>{alert.evidence.dataSource}</span>
                </div>
                <span className="font-mono font-bold text-emerald-400">
                  {isFa ? `اطمینان مدل: ${alert.evidence.confidenceScorePercent}٪` : `Confidence: ${alert.evidence.confidenceScorePercent}%`}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

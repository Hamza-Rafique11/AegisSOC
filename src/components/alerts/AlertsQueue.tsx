import React, { useState } from 'react';
import { AlertTriangle, Filter, CheckCircle2, XCircle, ArrowUpRight, Flame } from 'lucide-react';
import type { Alert, SeverityLevel } from '../../types/soc';

interface AlertsQueueProps {
  alerts: Alert[];
  onUpdateAlertStatus: (alertId: string, status: Alert['status']) => void;
  onSelectIncident?: (incidentId: string) => void;
}

export const AlertsQueue: React.FC<AlertsQueueProps> = ({
  alerts,
  onUpdateAlertStatus,
  onSelectIncident
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filtered = alerts.filter(a => selectedStatus === 'ALL' || a.status === selectedStatus);

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)] text-neutral-100">
      {/* Top Banner */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/90 border border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-neutral-100">Security Alerts Queue</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800">
                ACTIVE TRIAGE PIPELINE
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Raw detection triggers fired by correlation engine, Sigma rules, and Isolation Forest models.
            </p>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2">
          {['ALL', 'NEW', 'TRIAGED', 'ESCALATED', 'RESOLVED', 'FALSE_POSITIVE'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                selectedStatus === st ? 'bg-neutral-800 text-neutral-100 font-bold border border-neutral-700' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-neutral-900/90 rounded-lg border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 font-mono text-[11px] text-neutral-400 bg-neutral-950/60">
                <th className="py-3 px-4">Alert ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Detection Rule</th>
                <th className="py-3 px-4">MITRE Technique</th>
                <th className="py-3 px-4">Host / User</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Triage Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono text-[11px]">
              {filtered.map(alt => (
                <tr key={alt.alert_id} className="hover:bg-neutral-850/50">
                  <td className="py-3 px-4 text-neutral-400">{alt.alert_id.substring(0, 12)}</td>
                  <td className="py-3 px-4 text-neutral-400 whitespace-nowrap">
                    {alt.timestamp.substring(11, 19)} UTC
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      alt.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      alt.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-neutral-800 text-neutral-300'
                    }`}>
                      {alt.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans font-medium text-neutral-200 max-w-xs truncate">
                    {alt.rule_name}
                  </td>
                  <td className="py-3 px-4 text-emerald-400">{alt.mitre_technique}</td>
                  <td className="py-3 px-4 text-neutral-300 whitespace-nowrap">
                    {alt.hostname} ({alt.username})
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      alt.status === 'ESCALATED' ? 'bg-rose-950 text-rose-300' :
                      alt.status === 'RESOLVED' ? 'bg-emerald-950 text-emerald-300' :
                      alt.status === 'FALSE_POSITIVE' ? 'bg-neutral-800 text-neutral-400' :
                      'bg-amber-950 text-amber-300'
                    }`}>
                      {alt.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                    {alt.status !== 'TRIAGED' && (
                      <button
                        onClick={() => onUpdateAlertStatus(alt.alert_id, 'TRIAGED')}
                        className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px]"
                        title="Mark as Triaged"
                      >
                        Triage
                      </button>
                    )}
                    {alt.status !== 'FALSE_POSITIVE' && (
                      <button
                        onClick={() => onUpdateAlertStatus(alt.alert_id, 'FALSE_POSITIVE')}
                        className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-rose-300 text-[10px]"
                        title="Mark as False Positive"
                      >
                        FP
                      </button>
                    )}
                    {alt.incident_id && onSelectIncident && (
                      <button
                        onClick={() => onSelectIncident(alt.incident_id!)}
                        className="px-2 py-1 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-[10px] inline-flex items-center gap-1 border border-rose-800/60"
                        title="View Incident"
                      >
                        <Flame className="w-3 h-3" /> Incident
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

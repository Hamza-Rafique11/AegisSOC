import React, { useState } from 'react';
import {
  Flame,
  AlertTriangle,
  Shield,
  Clock,
  Server,
  User,
  CheckCircle2,
  XCircle,
  Share2,
  BrainCircuit,
  Zap,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import type { Incident, Alert, SOARAction } from '../../types/soc';

interface IncidentsHubProps {
  incidents: Incident[];
  selectedIncidentId: string | null;
  onSelectIncident: (id: string) => void;
  onInvestigateWithAI: (incidentId: string) => void;
  onOpenAttackGraph: (incidentId: string) => void;
  onApproveSOARAction: (actionId: string) => void;
}

export const IncidentsHub: React.FC<IncidentsHubProps> = ({
  incidents,
  selectedIncidentId,
  onSelectIncident,
  onInvestigateWithAI,
  onOpenAttackGraph,
  onApproveSOARAction
}) => {
  const activeIncident = incidents.find(i => i.incident_id === selectedIncidentId) || incidents[0];

  return (
    <div className="flex h-[calc(100vh-3.5rem)] text-neutral-100 overflow-hidden">
      {/* Left List of Incidents */}
      <div className="w-80 border-r border-neutral-800 bg-neutral-950/70 flex flex-col shrink-0">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-400" />
            <span className="font-mono text-xs font-semibold uppercase text-neutral-200">
              Correlated Incidents ({incidents.length})
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/60 scrollbar-thin scrollbar-thumb-neutral-800">
          {incidents.map((inc) => {
            const isSelected = activeIncident?.incident_id === inc.incident_id;
            return (
              <div
                key={inc.incident_id}
                onClick={() => onSelectIncident(inc.incident_id)}
                className={`p-4 cursor-pointer transition-colors ${
                  isSelected ? 'bg-neutral-900/90 border-l-2 border-l-rose-500' : 'hover:bg-neutral-900/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] font-bold text-neutral-400">
                    {inc.incident_id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                    inc.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                    inc.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-neutral-800 text-neutral-300'
                  }`}>
                    {inc.severity}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-neutral-200 line-clamp-2 leading-snug">
                  {inc.title}
                </h4>

                <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span className="flex items-center gap-1">
                    <span className="text-rose-400 font-bold">Score {inc.risk_score}</span>/100
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {inc.alerts.length} Alerts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Detailed Incident Dossier */}
      {activeIncident ? (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-950/40 scrollbar-thin scrollbar-thumb-neutral-800">
          {/* Header Action Bar */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-900 border border-neutral-700 text-neutral-300">
                  {activeIncident.incident_id}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                  {activeIncident.severity}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                  STATUS: {activeIncident.status}
                </span>
              </div>
              <h2 className="text-base font-bold text-neutral-100">{activeIncident.title}</h2>
              <p className="text-xs text-neutral-400 mt-1 font-mono">
                First Seen: {activeIncident.first_seen.replace('T', ' ').substring(0, 19)} UTC | Last Seen: {activeIncident.last_seen.replace('T', ' ').substring(0, 19)} UTC
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onOpenAttackGraph(activeIncident.incident_id)}
                className="px-3 py-1.5 rounded text-xs font-mono font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                Attack Graph
              </button>
              <button
                onClick={() => onInvestigateWithAI(activeIncident.incident_id)}
                className="px-3 py-1.5 rounded text-xs font-mono font-medium bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 flex items-center gap-1.5 transition-colors"
              >
                <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
                AI SOC Investigation
              </button>
            </div>
          </div>

          {/* Incident Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-neutral-900/80 p-3.5 rounded-lg border border-neutral-800">
              <span className="text-[11px] text-neutral-400 block mb-1">Impact Risk Score</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-rose-400">{activeIncident.risk_score}</span>
                <span className="text-xs font-mono text-neutral-400">/ 100</span>
              </div>
              <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden mt-2 border border-neutral-800">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${activeIncident.risk_score}%` }}></div>
              </div>
            </div>

            <div className="bg-neutral-900/80 p-3.5 rounded-lg border border-neutral-800">
              <span className="text-[11px] text-neutral-400 block mb-1">Affected Hosts</span>
              <div className="space-y-1">
                {activeIncident.affected_hosts.map(h => (
                  <div key={h} className="flex items-center gap-1.5 font-mono text-xs text-neutral-200">
                    <Server className="w-3 h-3 text-orange-400" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-900/80 p-3.5 rounded-lg border border-neutral-800">
              <span className="text-[11px] text-neutral-400 block mb-1">Impacted Identities</span>
              <div className="space-y-1">
                {activeIncident.affected_users.map(u => (
                  <div key={u} className="flex items-center gap-1.5 font-mono text-xs text-neutral-200">
                    <User className="w-3 h-3 text-indigo-400" />
                    <span>{u}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-900/80 p-3.5 rounded-lg border border-neutral-800">
              <span className="text-[11px] text-neutral-400 block mb-1">MITRE ATT&CK Mapping</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {activeIncident.mitre_techniques.map(t => (
                  <span key={t} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-950 text-emerald-400 border border-neutral-800">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Containment & SOAR Actions Queue */}
          <div className="bg-neutral-900/80 rounded-lg border border-neutral-800 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-mono font-semibold uppercase text-neutral-200">
                  Recommended Containment Actions (SOAR)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">Human Approval Mandatory</span>
            </div>

            <div className="space-y-2.5">
              {activeIncident.response_actions.map(action => (
                <div
                  key={action.action_id}
                  className="p-3 rounded bg-neutral-950 border border-neutral-800/80 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-neutral-200">{action.action_type}</span>
                      <span className="font-mono text-xs text-neutral-400">→ {action.target}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono ${
                        action.status === 'EXECUTED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        action.status === 'PENDING_APPROVAL' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-neutral-800 text-neutral-400'
                      }`}>
                        {action.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">{action.description}</p>
                    <p className="text-[10px] font-mono text-neutral-400">Rollback plan: {action.rollback_action}</p>
                  </div>

                  {action.status === 'PENDING_APPROVAL' ? (
                    <button
                      onClick={() => onApproveSOARAction(action.action_id)}
                      className="px-3 py-1.5 rounded text-xs font-mono font-medium bg-amber-950 hover:bg-amber-900 text-amber-200 border border-amber-700/60 flex items-center gap-1.5 shrink-0 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      Approve & Execute
                    </button>
                  ) : action.status === 'EXECUTED' ? (
                    <div className="text-xs font-mono text-emerald-400 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Executed
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Forensic Evidence Chain */}
          <div className="bg-neutral-900/80 rounded-lg border border-neutral-800 p-4">
            <h3 className="text-xs font-mono font-semibold uppercase text-neutral-200 mb-3">
              Forensic Evidence Chain
            </h3>
            <ul className="space-y-2">
              {activeIncident.evidence.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                  <span className="font-mono text-[10px] text-rose-400 font-bold shrink-0 mt-0.5">[{idx + 1}]</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Correlated Alerts Table */}
          <div className="bg-neutral-900/80 rounded-lg border border-neutral-800 p-4">
            <h3 className="text-xs font-mono font-semibold uppercase text-neutral-200 mb-3">
              Correlated Detection Alerts ({activeIncident.alerts.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 font-mono text-[11px] text-neutral-400">
                    <th className="pb-2">Timestamp</th>
                    <th className="pb-2">Rule Name</th>
                    <th className="pb-2">Severity</th>
                    <th className="pb-2">MITRE Technique</th>
                    <th className="pb-2">Host</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-mono text-[11px]">
                  {activeIncident.alerts.map(alt => (
                    <tr key={alt.alert_id} className="hover:bg-neutral-900/40">
                      <td className="py-2.5 text-neutral-400">{alt.timestamp.substring(11, 19)}</td>
                      <td className="py-2.5 font-sans font-medium text-neutral-200">{alt.rule_name}</td>
                      <td className="py-2.5">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          alt.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                          alt.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-neutral-800 text-neutral-300'
                        }`}>
                          {alt.severity}
                        </span>
                      </td>
                      <td className="py-2.5 text-emerald-400">{alt.mitre_technique}</td>
                      <td className="py-2.5 text-neutral-300">{alt.hostname}</td>
                      <td className="py-2.5 text-neutral-400">{alt.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-neutral-400 text-sm">
          Select an incident to view technical details.
        </div>
      )}
    </div>
  );
};

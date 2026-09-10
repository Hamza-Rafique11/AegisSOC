import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  Activity,
  Server,
  Users,
  Clock,
  Target,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Cpu,
  Radio
} from 'lucide-react';
import type { AegisEvent, Alert, Incident, CollectorConfig } from '../../types/soc';

interface SOCDashboardProps {
  events: AegisEvent[];
  alerts: Alert[];
  incidents: Incident[];
  collectors: CollectorConfig[];
  onSelectIncident: (id: string) => void;
  onNavigateSection: (section: string) => void;
}

export const SOCDashboard: React.FC<SOCDashboardProps> = ({
  events,
  alerts,
  incidents,
  collectors,
  onSelectIncident,
  onNavigateSection
}) => {
  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL');
  const highAlerts = alerts.filter(a => a.severity === 'HIGH');
  const mediumAlerts = alerts.filter(a => a.severity === 'MEDIUM');
  const openIncidents = incidents.filter(i => i.status !== 'CLOSED');

  // Compute unique affected entities
  const hostsAtRisk = Array.from(new Set(alerts.map(a => a.hostname)));
  const usersAtRisk = Array.from(new Set(alerts.map(a => a.username)));

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)] text-neutral-100">
      {/* Top Banner Alert if Critical Incidents exist */}
      {criticalAlerts.length > 0 && (
        <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <div>
              <div className="text-xs font-semibold text-rose-200">
                Active Critical Threat: LSASS Memory Extraction & C2 Beaconing Detected
              </div>
              <div className="text-[11px] text-rose-400/80">
                Impacted Workstation: <span className="font-mono text-rose-300">WS-FINANCE-03</span> | Recommended containment pending approval.
              </div>
            </div>
          </div>
          <button
            onClick={() => onSelectIncident(incidents[0]?.incident_id || 'INC-2026-001')}
            className="px-3 py-1.5 rounded text-xs font-medium bg-rose-900 hover:bg-rose-800 text-rose-100 border border-rose-700/60 transition-colors"
          >
            Investigate Incident
          </button>
        </div>
      )}

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-3.5">
          <div className="flex items-center justify-between text-neutral-400 text-[11px]">
            <span>Total Events</span>
            <Activity className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold font-mono text-neutral-100 mt-1">
            {events.length + 157300}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+191 EPS Stream</span>
          </div>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-3.5">
          <div className="flex items-center justify-between text-neutral-400 text-[11px]">
            <span>Total Alerts</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-neutral-100 mt-1">
            {alerts.length}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-amber-400 mt-1">
            <span>{criticalAlerts.length} Critical | {highAlerts.length} High</span>
          </div>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-3.5">
          <div className="flex items-center justify-between text-neutral-400 text-[11px]">
            <span>Open Incidents</span>
            <Flame className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-bold font-mono text-rose-400 mt-1">
            {openIncidents.length}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-rose-400/90 mt-1">
            <span>Risk Score: {incidents[0]?.risk_score || 94}/100</span>
          </div>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-3.5">
          <div className="flex items-center justify-between text-neutral-400 text-[11px]">
            <span>Hosts at Risk</span>
            <Server className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="text-xl font-bold font-mono text-neutral-100 mt-1">
            {hostsAtRisk.length}
          </div>
          <div className="text-[10px] text-neutral-400 mt-1 truncate">
            {hostsAtRisk.slice(0, 2).join(', ')}
          </div>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-3.5">
          <div className="flex items-center justify-between text-neutral-400 text-[11px]">
            <span>Mean Time Detect</span>
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            4.2m
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
            <TrendingDown className="w-3 h-3" />
            <span>-76% via AI Triage</span>
          </div>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-3.5">
          <div className="flex items-center justify-between text-neutral-400 text-[11px]">
            <span>Detection Rate</span>
            <Target className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono text-indigo-300 mt-1">
            94.5%
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">
            FP Rate: <span className="text-emerald-400">1.8%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Charts & Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Ingestion & MITRE Tactics Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Incident Summary Card */}
          {incidents.length > 0 && (
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-5">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                    INCIDENT {incidents[0].incident_id}
                  </span>
                  <h3 className="text-sm font-semibold text-neutral-100">{incidents[0].title}</h3>
                </div>
                <button
                  onClick={() => onSelectIncident(incidents[0].incident_id)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono"
                >
                  Full Investigation <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                <div className="bg-neutral-950/80 p-3 rounded border border-neutral-800/80">
                  <span className="text-neutral-400 block mb-1">Correlated Evidence</span>
                  <span className="font-mono text-neutral-200 font-semibold">{incidents[0].evidence.length} Indicators</span>
                  <div className="text-[10px] text-neutral-400 mt-1">Brute Force → LotL → LSASS → C2</div>
                </div>
                <div className="bg-neutral-950/80 p-3 rounded border border-neutral-800/80">
                  <span className="text-neutral-400 block mb-1">Target Assets</span>
                  <span className="font-mono text-neutral-200 font-semibold">{incidents[0].affected_hosts.join(', ')}</span>
                  <div className="text-[10px] text-neutral-400 mt-1">User context: {incidents[0].affected_users.join(', ')}</div>
                </div>
                <div className="bg-neutral-950/80 p-3 rounded border border-neutral-800/80">
                  <span className="text-neutral-400 block mb-1">Mitigation Status</span>
                  <span className="font-mono text-amber-300 font-semibold">Containment Pending</span>
                  <div className="text-[10px] text-emerald-400 mt-1">Firewall IP blocked (185.220.101.45)</div>
                </div>
              </div>

              {/* Multi-stage Attack Kill Chain Progress */}
              <div className="mt-5">
                <div className="text-[11px] font-mono text-neutral-400 mb-2">ATT&CK EXECUTION PROGRESSION</div>
                <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-mono">
                  <div className="p-2 rounded bg-neutral-950 border border-neutral-800 text-neutral-300">
                    <span className="block text-neutral-400">STAGE 1</span>
                    <span className="font-semibold text-emerald-400">Reconnaissance</span>
                  </div>
                  <div className="p-2 rounded bg-neutral-950 border border-neutral-800 text-neutral-300">
                    <span className="block text-neutral-400">STAGE 2</span>
                    <span className="font-semibold text-amber-400">Initial Access</span>
                  </div>
                  <div className="p-2 rounded bg-neutral-950 border border-neutral-800 text-neutral-300">
                    <span className="block text-neutral-400">STAGE 3</span>
                    <span className="font-semibold text-amber-400">Execution</span>
                  </div>
                  <div className="p-2 rounded bg-rose-950/60 border border-rose-700/60 text-rose-200 animate-pulse">
                    <span className="block text-rose-400">STAGE 4</span>
                    <span className="font-semibold text-rose-300">Credential Theft</span>
                  </div>
                  <div className="p-2 rounded bg-rose-950/40 border border-rose-800/60 text-rose-200">
                    <span className="block text-rose-400">STAGE 5</span>
                    <span className="font-semibold text-rose-400">C2 Beaconing</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Telemetry Sensor Fleet Status */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-200">
                  Telemetry Collectors Status
                </h3>
              </div>
              <button
                onClick={() => onNavigateSection('collectors')}
                className="text-xs text-neutral-400 hover:text-neutral-200 font-mono"
              >
                Configure Sensors →
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {collectors.map(c => (
                <div key={c.id} className="bg-neutral-950 p-2.5 rounded border border-neutral-800/80">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-neutral-200 truncate">{c.name}</span>
                    <span className={`w-2 h-2 rounded-full ${c.enabled ? 'bg-emerald-400' : 'bg-neutral-600'}`}></span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-neutral-400">
                    <span>{c.events_per_second} EPS</span>
                    <span className="text-neutral-400">{c.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Live Event Stream Ticker */}
        <div className="space-y-6">
          {/* Live Telemetry Stream */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-4 flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <h3 className="text-xs font-mono font-semibold uppercase text-neutral-200">
                  Live Telemetry Ingestion
                </h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">{events.length} Buffered</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pt-3 scrollbar-thin scrollbar-thumb-neutral-800">
              {events.slice(0, 15).map(e => (
                <div key={e.event_id} className="p-2.5 rounded bg-neutral-950 border border-neutral-800/80 text-xs hover:border-neutral-700 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-neutral-400">{e.timestamp.substring(11, 19)}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                      e.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      e.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      e.severity === 'MEDIUM' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' :
                      'bg-neutral-900 text-neutral-400 border border-neutral-800'
                    }`}>
                      {e.severity}
                    </span>
                  </div>
                  <div className="font-semibold text-neutral-200 text-[11px] truncate">
                    {e.process_name || e.event_type}
                  </div>
                  <div className="font-mono text-[10px] text-neutral-400 truncate mt-0.5">
                    {e.hostname} | {e.username} | {e.source}
                  </div>
                  {e.command_line && (
                    <div className="font-mono text-[10px] text-neutral-400 bg-neutral-900/90 p-1 rounded mt-1 truncate">
                      {e.command_line}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateSection('hunting')}
              className="mt-3 w-full py-1.5 rounded text-center text-xs font-mono bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors shrink-0"
            >
              Open Threat Hunting Console →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

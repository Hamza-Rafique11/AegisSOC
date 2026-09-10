import React, { useState } from 'react';
import { Search, Filter, Download, Terminal, Code, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';
import type { AegisEvent, EventSource, SeverityLevel } from '../../types/soc';

interface ThreatHuntingProps {
  events: AegisEvent[];
  onSearch: (query: string, source: string, severity: string) => void;
  onCreateRuleFromQuery?: (query: string) => void;
}

export const ThreatHunting: React.FC<ThreatHuntingProps> = ({
  events,
  onSearch,
  onCreateRuleFromQuery
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleApplyFilter = () => {
    onSearch(searchQuery, selectedSource, selectedSeverity);
  };

  const handleQuickFilter = (q: string) => {
    setSearchQuery(q);
    onSearch(q, selectedSource, selectedSeverity);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-3.5rem)] text-neutral-100">
      {/* Search Bar & Filter Bar */}
      <div className="bg-neutral-900/90 p-4 rounded-lg border border-neutral-800 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
              placeholder="Query telemetry: e.g. powershell.exe, 185.220.101.45, lsass.dmp, j.doe..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-md pl-9 pr-4 py-2 text-xs text-neutral-200 placeholder-neutral-400 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedSource}
              onChange={(e) => { setSelectedSource(e.target.value); onSearch(searchQuery, e.target.value, selectedSeverity); }}
              className="bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-neutral-300 focus:outline-none"
            >
              <option value="ALL">All Sensors</option>
              <option value="windows_sysmon">Windows Sysmon</option>
              <option value="windows_eventlog">Windows EventLog</option>
              <option value="linux_auth">Linux Auth</option>
              <option value="linux_auditd">Linux Auditd</option>
              <option value="network_zeek">Zeek Network</option>
              <option value="network_suricata">Suricata IDS</option>
            </select>

            <select
              value={selectedSeverity}
              onChange={(e) => { setSelectedSeverity(e.target.value); onSearch(searchQuery, selectedSource, e.target.value); }}
              className="bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-neutral-300 focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High & Above</option>
              <option value="MEDIUM">Medium</option>
              <option value="INFORMATIONAL">Informational</option>
            </select>

            <button
              onClick={handleApplyFilter}
              className="px-4 py-2 rounded text-xs font-mono font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              Execute Search
            </button>
          </div>
        </div>

        {/* Quick Pivot Chips */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-neutral-400 pt-1">
          <span>Quick Pivots:</span>
          <button
            onClick={() => handleQuickFilter('powershell.exe')}
            className="px-2 py-0.5 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 transition-colors"
          >
            process:powershell.exe
          </button>
          <button
            onClick={() => handleQuickFilter('185.220.101.45')}
            className="px-2 py-0.5 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 transition-colors"
          >
            ip:185.220.101.45
          </button>
          <button
            onClick={() => handleQuickFilter('rundll32.exe')}
            className="px-2 py-0.5 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 transition-colors"
          >
            process:rundll32.exe
          </button>
          <button
            onClick={() => handleQuickFilter('authentication_failure')}
            className="px-2 py-0.5 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 transition-colors"
          >
            event:auth_fail
          </button>
        </div>
      </div>

      {/* Results Header & Summary */}
      <div className="flex items-center justify-between font-mono text-xs text-neutral-400 px-1">
        <div>
          Showing <span className="text-neutral-200 font-bold">{events.length}</span> security events matching filter
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(events, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", `aegis-telemetry-${Date.now()}.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="flex items-center gap-1.5 text-neutral-300 hover:text-white"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Events Table & Raw Inspector */}
      <div className="bg-neutral-900/90 rounded-lg border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 font-mono text-[11px] text-neutral-400 bg-neutral-950/60">
                <th className="py-2.5 px-3 w-8"></th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Sensor</th>
                <th className="py-2.5 px-3">Host</th>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Process / Action</th>
                <th className="py-2.5 px-3">Source & Target IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono text-[11px]">
              {events.map((evt) => {
                const isExpanded = expandedEventId === evt.event_id;
                return (
                  <React.Fragment key={evt.event_id}>
                    <tr
                      onClick={() => setExpandedEventId(isExpanded ? null : evt.event_id)}
                      className={`cursor-pointer transition-colors ${
                        isExpanded ? 'bg-neutral-800/60' : 'hover:bg-neutral-800/30'
                      }`}
                    >
                      <td className="py-2.5 px-3 text-neutral-400">
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </td>
                      <td className="py-2.5 px-3 text-neutral-400 whitespace-nowrap">
                        {evt.timestamp.substring(11, 19)} UTC
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          evt.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                          evt.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          evt.severity === 'MEDIUM' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' :
                          'bg-neutral-800 text-neutral-400'
                        }`}>
                          {evt.severity}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-neutral-300 whitespace-nowrap">{evt.source}</td>
                      <td className="py-2.5 px-3 text-neutral-200 font-medium">{evt.hostname}</td>
                      <td className="py-2.5 px-3 text-neutral-300">{evt.username}</td>
                      <td className="py-2.5 px-3 text-neutral-200 max-w-xs truncate font-sans">
                        {evt.process_name || evt.event_type}
                      </td>
                      <td className="py-2.5 px-3 text-neutral-400 whitespace-nowrap">
                        {evt.source_ip} → {evt.destination_ip}
                        {evt.destination_port ? `:${evt.destination_port}` : ''}
                      </td>
                    </tr>

                    {/* Expandable Raw JSON & Command-Line Inspector */}
                    {isExpanded && (
                      <tr className="bg-neutral-950">
                        <td colSpan={8} className="p-4 border-t border-b border-neutral-800">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs text-neutral-400 font-bold">
                                Raw Telemetry Envelope ({evt.event_id})
                              </span>
                              <button
                                onClick={() => copyToClipboard(JSON.stringify(evt, null, 2), evt.event_id)}
                                className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-white"
                              >
                                {copiedId === evt.event_id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                {copiedId === evt.event_id ? 'Copied' : 'Copy JSON'}
                              </button>
                            </div>

                            {evt.command_line && (
                              <div className="bg-neutral-900 p-2.5 rounded border border-neutral-800 font-mono text-xs text-amber-300 break-all">
                                <span className="text-neutral-400 block text-[10px] mb-1">COMMAND LINE:</span>
                                {evt.command_line}
                              </div>
                            )}

                            <pre className="bg-neutral-900/80 p-3 rounded border border-neutral-800 font-mono text-[11px] text-neutral-300 overflow-x-auto max-h-60 scrollbar-thin">
                              {JSON.stringify(evt, null, 2)}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

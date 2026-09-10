import React, { useState } from 'react';
import { Globe2, Search, ShieldCheck, ShieldAlert, Hash, ExternalLink, Tag } from 'lucide-react';
import type { ThreatIntelIOC } from '../../types/soc';

interface ThreatIntelViewProps {
  iocs: ThreatIntelIOC[];
}

export const ThreatIntelView: React.FC<ThreatIntelViewProps> = ({ iocs }) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [lookupValue, setLookupValue] = useState('');
  const [lookupResult, setLookupResult] = useState<ThreatIntelIOC | null | 'NOT_FOUND'>(null);

  const filtered = iocs.filter(ioc =>
    ioc.value.toLowerCase().includes(filterQuery.toLowerCase()) ||
    ioc.related_threat.toLowerCase().includes(filterQuery.toLowerCase()) ||
    ioc.tags.some(t => t.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  const handleLookup = () => {
    const found = iocs.find(i => i.value.toLowerCase() === lookupValue.trim().toLowerCase());
    setLookupResult(found || 'NOT_FOUND');
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)] text-neutral-100">
      {/* Top Banner */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/90 border border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-neutral-100">Cyber Threat Intelligence (CTI) Feed</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800">
                LIVE IOC DATABASE
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Aggregated indicators of compromise, actor attributions, CVE linkages, and automated telemetry cross-referencing.
            </p>
          </div>
        </div>
      </div>

      {/* Quick IOC Reputation Query */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-5">
        <h3 className="font-mono text-xs font-bold uppercase text-neutral-300 mb-3">
          On-Demand Indicator Reputation Lookup
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={lookupValue}
            onChange={(e) => setLookupValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
            placeholder="Enter IP address, Domain, or File Hash (SHA-256 / MD5)..."
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-neutral-200 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleLookup}
            className="px-4 py-2 rounded text-xs font-mono font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            Check Reputation
          </button>
        </div>

        {lookupResult && lookupResult !== 'NOT_FOUND' && (
          <div className="mt-4 p-4 rounded bg-rose-950/40 border border-rose-800/80 text-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-mono text-rose-300 font-bold">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>CONFIRMED THREAT IOC: {lookupResult.value}</span>
              </div>
              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-rose-900 text-rose-200">
                Confidence: {lookupResult.confidence}%
              </span>
            </div>
            <p className="text-neutral-300 font-sans mb-2">{lookupResult.notes}</p>
            <div className="font-mono text-[11px] text-neutral-400 flex flex-wrap gap-4">
              <span>Attribution: <strong className="text-neutral-200">{lookupResult.related_threat}</strong></span>
              <span>Source: {lookupResult.source}</span>
              {lookupResult.cve_references && (
                <span>CVEs: {lookupResult.cve_references.join(', ')}</span>
              )}
            </div>
          </div>
        )}

        {lookupResult === 'NOT_FOUND' && (
          <div className="mt-4 p-3 rounded bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-400">
            No malicious reputation record found in local feeds for &quot;{lookupValue}&quot;.
          </div>
        )}
      </div>

      {/* IOC Catalog Table */}
      <div className="bg-neutral-900/90 rounded-lg border border-neutral-800 overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <h3 className="font-mono text-xs font-bold uppercase text-neutral-200">
            Active Threat Indicators ({filtered.length})
          </h3>
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter IOCs..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded pl-8 pr-3 py-1.5 text-xs font-mono text-neutral-200 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 font-mono text-[11px] text-neutral-400 bg-neutral-950/60">
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Indicator Value</th>
                <th className="py-2.5 px-4">Attribution / Threat</th>
                <th className="py-2.5 px-4">Confidence</th>
                <th className="py-2.5 px-4">Tags</th>
                <th className="py-2.5 px-4">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono text-[11px]">
              {filtered.map(ioc => (
                <tr key={ioc.id} className="hover:bg-neutral-850/50">
                  <td className="py-3 px-4 text-neutral-400 font-bold">{ioc.type}</td>
                  <td className="py-3 px-4 text-neutral-200 font-semibold">{ioc.value}</td>
                  <td className="py-3 px-4 text-rose-300 font-sans">{ioc.related_threat}</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">{ioc.confidence}%</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {ioc.tags.map((t, i) => (
                        <span key={i} className="px-1.5 py-0.2 rounded text-[9px] bg-neutral-950 text-neutral-400 border border-neutral-800">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-neutral-400">{ioc.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

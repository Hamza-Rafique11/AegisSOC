import React from 'react';
import { Grid3X3, CheckCircle, AlertTriangle, XCircle, Shield } from 'lucide-react';

interface MitreMatrixViewProps {
  tactics: {
    id: string;
    name: string;
    active_alerts: number;
    total_rules: number;
    coverage: string;
  }[];
}

export const MitreMatrixView: React.FC<MitreMatrixViewProps> = ({ tactics }) => {
  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)] text-neutral-100">
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/90 border border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Grid3X3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-neutral-100">MITRE ATT&CK Enterprise Matrix v14</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                12 TACTICS MAPPED
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Visual defense posture, active alert hotspots, and detection rule coverage across the adversary lifecycle.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
            <span className="text-neutral-300">Full Coverage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
            <span className="text-neutral-300">Partial Coverage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-neutral-700"></span>
            <span className="text-neutral-300">Detection Gap</span>
          </div>
        </div>
      </div>

      {/* Grid of 12 Tactics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {tactics.map((tac) => {
          const isFull = tac.coverage === 'FULL_COVERAGE';
          const isPartial = tac.coverage === 'PARTIAL_COVERAGE';

          return (
            <div
              key={tac.id}
              className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-3.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1">
                  <span>{tac.id}</span>
                  {tac.active_alerts > 0 && (
                    <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 font-bold border border-rose-800 animate-pulse">
                      {tac.active_alerts} Alert{tac.active_alerts > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-neutral-100 line-clamp-1">{tac.name}</h4>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-neutral-400">{tac.total_rules} Rules</span>
                <span className={`px-2 py-0.5 rounded font-semibold ${
                  isFull ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' :
                  isPartial ? 'bg-amber-950 text-amber-400 border border-amber-800/60' :
                  'bg-neutral-800 text-neutral-400'
                }`}>
                  {isFull ? 'FULL' : isPartial ? 'PARTIAL' : 'GAP'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gap Analysis & Defensive Recommendation */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-5">
        <h3 className="font-mono text-xs font-bold uppercase text-neutral-200 mb-2">
          Detection Engineering Gap Analysis
        </h3>
        <p className="text-xs text-neutral-400 leading-relaxed max-w-4xl font-sans">
          AegisSOC maintains strong rule coverage in <span className="text-emerald-400 font-medium">Initial Access</span>, <span className="text-emerald-400 font-medium">Execution</span>, and <span className="text-emerald-400 font-medium">Credential Access</span>. Gaps are identified in <span className="text-amber-400 font-medium">Exfiltration (TA0010)</span> and <span className="text-amber-400 font-medium">Impact (TA0040)</span>. We recommend authoring Zeek DNS tunneling detection rules and Volume Shadow Copy deletion rules in the Detection-as-Code Studio.
        </p>
      </div>
    </div>
  );
};

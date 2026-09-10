import React, { useState } from 'react';
import { FlaskConical, Play, ShieldAlert, CheckCircle2, RotateCcw, AlertTriangle, RefreshCw } from 'lucide-react';
import type { AttackSimulationScenario, SimulationExecution } from '../../types/soc';

interface AttackSimulationLabProps {
  scenarios: AttackSimulationScenario[];
  executions: SimulationExecution[];
  onExecuteScenario: (scenarioId: string, host: string) => Promise<void>;
}

export const AttackSimulationLab: React.FC<AttackSimulationLabProps> = ({
  scenarios,
  executions,
  onExecuteScenario
}) => {
  const [selectedScenario, setSelectedScenario] = useState<AttackSimulationScenario>(scenarios[0]);
  const [targetHost, setTargetHost] = useState(scenarios[0]?.parameters.target_host || 'SRV-UBUNTU-LAB-01');
  const [isExecuting, setIsExecuting] = useState(false);
  const [scopeConfirmed, setScopeConfirmed] = useState(false);

  const handleRun = async () => {
    if (!scopeConfirmed) return;
    setIsExecuting(true);
    await onExecuteScenario(selectedScenario.id, targetHost);
    setIsExecuting(false);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)] text-neutral-100">
      {/* Top Banner */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/90 border border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-neutral-100">Controlled Attack & Defense Simulation Lab</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800">
                PURPLE TEAM VALIDATION
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Execute controlled offensive techniques against isolated laboratory assets to empirically validate detection rules and ML models.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenarios Catalog */}
        <div className="bg-neutral-900/90 rounded-lg border border-neutral-800 p-4">
          <h3 className="font-mono text-xs font-bold uppercase text-neutral-300 mb-3">
            Available Scenarios ({scenarios.length})
          </h3>
          <div className="space-y-2">
            {scenarios.map(s => {
              const isSelected = selectedScenario.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    setSelectedScenario(s);
                    setTargetHost(s.parameters.target_host);
                  }}
                  className={`p-3 rounded cursor-pointer border transition-colors ${
                    isSelected ? 'bg-neutral-800 border-rose-500/80' : 'bg-neutral-950 border-neutral-800/80 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-neutral-400">{s.id}</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-neutral-900 text-rose-400 border border-neutral-800">
                      {s.category}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-neutral-200">{s.name}</h4>
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-neutral-400">
                    <span>MITRE: {s.mitre_techniques.join(', ')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scenario Config & Execution Console */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900/90 rounded-lg border border-neutral-800 p-5 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-neutral-800">
              <div>
                <span className="font-mono text-[10px] text-neutral-400 uppercase">Selected Emulation Plan</span>
                <h3 className="text-base font-bold text-neutral-100">{selectedScenario.name}</h3>
                <p className="text-xs text-neutral-400 mt-1">{selectedScenario.description}</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-950 text-neutral-300 border border-neutral-800">
                {selectedScenario.risk_level}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[10px] text-neutral-400 uppercase mb-1">Target Laboratory Host</label>
                <input
                  type="text"
                  value={targetHost}
                  onChange={(e) => setTargetHost(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <span className="block text-[10px] text-neutral-400 uppercase mb-1">Telemetry Channels to be Generated</span>
                <div className="flex flex-wrap gap-2">
                  {selectedScenario.telemetry_types_generated.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-300 text-[11px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400">
                <span className="text-amber-400 font-semibold block mb-0.5">Automated Rollback Procedure:</span>
                {selectedScenario.rollback_procedure}
              </div>

              {/* Safety Authorization Checkbox */}
              <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
                <input
                  type="checkbox"
                  id="scopeCheck"
                  checked={scopeConfirmed}
                  onChange={(e) => setScopeConfirmed(e.target.checked)}
                  className="rounded bg-neutral-950 border-neutral-800 text-rose-600 focus:ring-0"
                />
                <label htmlFor="scopeCheck" className="text-xs text-neutral-300 font-sans cursor-pointer">
                  I confirm that <strong className="text-neutral-100">{targetHost}</strong> is an authorized laboratory test VM and within designated scope.
                </label>
              </div>

              <button
                onClick={handleRun}
                disabled={!scopeConfirmed || isExecuting}
                className="w-full py-2.5 rounded font-mono text-xs font-semibold bg-rose-700 hover:bg-rose-600 disabled:opacity-40 text-white flex items-center justify-center gap-2 transition-colors"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Injecting Attack Telemetry Sequence...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Execute Laboratory Scenario
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Execution History */}
          <div className="bg-neutral-900/90 rounded-lg border border-neutral-800 p-5">
            <h4 className="font-mono text-xs font-bold uppercase text-neutral-300 mb-3">
              Recent Emulation Executions ({executions.length})
            </h4>
            {executions.length > 0 ? (
              <div className="space-y-2 font-mono text-xs">
                {executions.map(ex => (
                  <div key={ex.simulation_id} className="p-3 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">{ex.scenario_name}</span>
                        <span className="text-neutral-400 text-[10px]">({ex.simulation_id})</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">
                        Target: {ex.target_hosts.join(', ')} • Operator: {ex.operator}
                      </div>
                    </div>
                    <div className="text-right text-[11px]">
                      <div className="text-emerald-400 font-bold">
                        {ex.telemetry_generated_count} Events Injected
                      </div>
                      <div className="text-amber-400">
                        {ex.detections_triggered_count} Rules Triggered
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs font-mono text-neutral-400 text-center py-4">
                No simulations executed in this session yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

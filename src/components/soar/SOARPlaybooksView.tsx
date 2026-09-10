import React from 'react';
import { Zap, ShieldCheck, CheckCircle2, RotateCcw, AlertTriangle, UserCheck } from 'lucide-react';
import type { SOARAction } from '../../types/soc';

interface SOARPlaybooksViewProps {
  actions: SOARAction[];
  onApproveAction: (actionId: string) => void;
  onRollbackAction: (actionId: string) => void;
}

export const SOARPlaybooksView: React.FC<SOARPlaybooksViewProps> = ({
  actions,
  onApproveAction,
  onRollbackAction
}) => {
  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)] text-neutral-100">
      {/* Top Banner */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/90 border border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-neutral-100">SOAR Automated & Human-Gated Playbooks</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800">
                CONTAINMENT & ROLLBACK ENGINE
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Deterministic incident response playbooks with strict human sign-off gates and reversible mitigation steps.
            </p>
          </div>
        </div>
      </div>

      {/* Action Queue */}
      <div className="space-y-4">
        <h3 className="font-mono text-xs font-bold uppercase text-neutral-300">
          Response Action Dispatch Queue ({actions.length})
        </h3>

        <div className="space-y-3">
          {actions.map((action) => (
            <div
              key={action.action_id}
              className="bg-neutral-900/90 rounded-lg border border-neutral-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-neutral-100 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                    {action.action_type}
                  </span>
                  <span className="font-mono text-xs text-emerald-400 font-semibold">
                    Target: {action.target}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    action.status === 'EXECUTED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    action.status === 'PENDING_APPROVAL' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    action.status === 'ROLLED_BACK' ? 'bg-neutral-800 text-neutral-400 border border-neutral-700' :
                    'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {action.status}
                  </span>
                </div>

                <p className="text-xs text-neutral-300 font-sans">{action.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-neutral-400 pt-1">
                  <span>Incident: {action.incident_id}</span>
                  {action.approved_by && <span>Approved by: {action.approved_by}</span>}
                  {action.executed_at && <span>Executed: {action.executed_at.substring(11, 19)} UTC</span>}
                </div>

                <div className="text-[11px] font-mono text-neutral-400 bg-neutral-950/80 p-2 rounded border border-neutral-800/80">
                  <span className="text-amber-400/90 font-semibold">Reversal Plan: </span>
                  {action.rollback_action}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                {action.status === 'PENDING_APPROVAL' && (
                  <button
                    onClick={() => onApproveAction(action.action_id)}
                    className="px-4 py-2 rounded text-xs font-mono font-medium bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-2 transition-colors"
                  >
                    <UserCheck className="w-4 h-4" />
                    Approve & Enforce
                  </button>
                )}

                {action.status === 'EXECUTED' && (
                  <button
                    onClick={() => onRollbackAction(action.action_id)}
                    className="px-3.5 py-1.5 rounded text-xs font-mono font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
                    Trigger Rollback
                  </button>
                )}

                {action.status === 'ROLLED_BACK' && (
                  <span className="text-xs font-mono text-neutral-400">
                    Defensive policy successfully reverted.
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

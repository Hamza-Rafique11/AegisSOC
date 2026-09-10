import React from 'react';
import { ScrollText, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import type { AuditLogEntry } from '../../types/soc';

interface AuditLogsViewProps {
  logs: AuditLogEntry[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs }) => {
  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)] text-neutral-100">
      {/* Top Banner */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/90 border border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ScrollText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-neutral-100">Security Operations Tamper-Evident Audit Trail</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                COMPLIANCE & ACCOUNTABILITY
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Immutable chronological record of analyst decisions, SOAR approvals, rule alterations, and containment actions.
            </p>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-neutral-900/90 rounded-lg border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-neutral-800 text-[11px] text-neutral-400 bg-neutral-950/60">
                <th className="py-3 px-4">Audit ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Operator / Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Justification / Reason</th>
                <th className="py-3 px-4">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-[11px]">
              {logs.map((log) => (
                <tr key={log.audit_id} className="hover:bg-neutral-850/50">
                  <td className="py-3 px-4 text-neutral-400">{log.audit_id}</td>
                  <td className="py-3 px-4 text-neutral-400 whitespace-nowrap">
                    {log.timestamp.substring(11, 19)} UTC
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-neutral-200">{log.user}</div>
                    <div className="text-[10px] text-neutral-400">{log.role}</div>
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">{log.action}</td>
                  <td className="py-3 px-4 text-neutral-200">{log.target}</td>
                  <td className="py-3 px-4 text-neutral-300 font-sans max-w-sm truncate">{log.reason}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                      {log.result}
                    </span>
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

import React, { useState } from 'react';
import { Users, UserX, AlertTriangle, ShieldAlert, Key, Globe, Lock, Unlock, ArrowRight } from 'lucide-react';
import type { IdentityProfile } from '../../types/soc';

interface IdentityThreatViewProps {
  profiles: IdentityProfile[];
}

export const IdentityThreatView: React.FC<IdentityThreatViewProps> = ({ profiles }) => {
  const [selectedUser, setSelectedUser] = useState<IdentityProfile>(profiles[0]);

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)] text-neutral-100">
      {/* Top Banner */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/90 border border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-neutral-100">Identity Threat Detection & Response (ITDR)</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
                BEHAVIORAL ENTITY TRACKER
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Detects credential stuffing, password spraying, impossible travel, and anomalous privilege elevation across corporate identities.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Profiles List */}
        <div className="bg-neutral-900/90 rounded-lg border border-neutral-800 p-4 flex flex-col">
          <h3 className="font-mono text-xs font-bold uppercase text-neutral-300 mb-3">
            Monitored Accounts ({profiles.length})
          </h3>
          <div className="space-y-2">
            {profiles.map(p => {
              const isSelected = selectedUser?.username === p.username;
              return (
                <div
                  key={p.username}
                  onClick={() => setSelectedUser(p)}
                  className={`p-3 rounded-md cursor-pointer border transition-colors ${
                    isSelected
                      ? 'bg-neutral-800 border-indigo-500/70 shadow-sm'
                      : 'bg-neutral-950 border-neutral-800/80 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-neutral-200">{p.username}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                      p.identity_risk_score > 70 ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      p.identity_risk_score > 30 ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      Score: {p.identity_risk_score}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                    <span>{p.account_type}</span>
                    <span>{p.failed_attempts_last_24h} Failed Logons</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Details Profile */}
        <div className="lg:col-span-2 space-y-6">
          {selectedUser && (
            <>
              {/* Account Risk Card */}
              <div className="bg-neutral-900/90 rounded-lg border border-neutral-800 p-5">
                <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
                  <div>
                    <span className="font-mono text-[10px] text-neutral-400 uppercase">Identity Profile</span>
                    <h3 className="text-base font-bold text-neutral-100">{selectedUser.username}</h3>
                    <div className="text-xs text-neutral-400 font-mono mt-0.5">
                      Type: {selectedUser.account_type} • Assigned Hosts: {selectedUser.assigned_hosts.join(', ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-neutral-400 uppercase">Composite Risk Score</div>
                    <div className="text-2xl font-bold font-mono text-rose-400">
                      {selectedUser.identity_risk_score}<span className="text-xs text-neutral-400">/100</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-neutral-950 p-3 rounded border border-neutral-800">
                    <span className="text-neutral-400 block text-[10px] mb-1">RECENT GEOGRAPHIC AUTHENTICATIONS</span>
                    <div className="space-y-1">
                      {selectedUser.recent_locations.map((loc, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-neutral-200">
                          <Globe className="w-3 h-3 text-indigo-400" />
                          <span>{loc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-neutral-950 p-3 rounded border border-neutral-800">
                    <span className="text-neutral-400 block text-[10px] mb-1">ACCOUNT STATE</span>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedUser.is_locked ? (
                        <span className="text-rose-400 flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" /> LOCKED / QUARANTINED
                        </span>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Unlock className="w-3.5 h-3.5" /> ACTIVE (MFA CHALLENGED)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Observed Identity Risk Factors */}
              <div className="bg-neutral-900/90 rounded-lg border border-neutral-800 p-5">
                <h4 className="font-mono text-xs font-bold uppercase text-neutral-300 mb-3">
                  Behavioral Anomalies & Risk Factors ({selectedUser.risk_factors.length})
                </h4>
                {selectedUser.risk_factors.length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedUser.risk_factors.map((rf, idx) => (
                      <div key={idx} className="p-3 rounded bg-neutral-950 border border-neutral-800 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-neutral-200">{rf.factor}</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                            {rf.severity}
                          </span>
                        </div>
                        <p className="text-neutral-400 text-[11px]">{rf.details}</p>
                        <span className="text-[10px] font-mono text-neutral-400 mt-1 block">
                          Recorded: {rf.timestamp.substring(11, 19)} UTC
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs font-mono text-emerald-400">
                    No active behavioral anomalies detected for this account.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

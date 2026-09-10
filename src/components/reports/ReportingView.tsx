import React, { useState } from 'react';
import { FileBarChart, Download, Printer, Shield, CheckCircle, FileText } from 'lucide-react';
import type { Incident, Alert } from '../../types/soc';

interface ReportingViewProps {
  incidents: Incident[];
  alerts: Alert[];
}

export const ReportingView: React.FC<ReportingViewProps> = ({ incidents, alerts }) => {
  const [reportType, setReportType] = useState<'EXECUTIVE' | 'TECHNICAL_IR'>('EXECUTIVE');
  const activeIncident = incidents[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)] text-neutral-100">
      {/* Top Banner */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/90 border border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <FileBarChart className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-neutral-100">SOC Executive & Incident Reports</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-950 text-teal-300 border border-teal-800">
                AUDITABLE ARTIFACTS
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Generate standardized incident response dossiers and executive governance summaries ready for leadership and audit review.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-neutral-950 p-1 rounded border border-neutral-800 flex text-xs font-mono">
            <button
              onClick={() => setReportType('EXECUTIVE')}
              className={`px-3 py-1 rounded transition-colors ${
                reportType === 'EXECUTIVE' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400'
              }`}
            >
              Executive Summary
            </button>
            <button
              onClick={() => setReportType('TECHNICAL_IR')}
              className={`px-3 py-1 rounded transition-colors ${
                reportType === 'TECHNICAL_IR' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400'
              }`}
            >
              Technical IR Dossier
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded text-xs font-mono font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-neutral-900/90 rounded-lg border border-neutral-800 p-8 max-w-4xl mx-auto space-y-6 print:bg-white print:text-black print:p-4">
        <div className="flex items-start justify-between border-b border-neutral-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm font-bold text-emerald-400">AegisSOC Platform</span>
              <span className="text-neutral-400 text-xs">| Blue Team Operations</span>
            </div>
            <h1 className="text-xl font-bold text-neutral-100">
              {reportType === 'EXECUTIVE'
                ? 'Cybersecurity Executive Briefing & Threat Posture'
                : `Incident Post-Mortem Report: ${activeIncident?.incident_id}`}
            </h1>
            <p className="text-xs text-neutral-400 font-mono mt-1">
              Document Classification: INTERNAL USE ONLY • Generated: {new Date().toISOString().substring(0, 10)}
            </p>
          </div>
          <div className="text-right font-mono text-xs text-neutral-400">
            <div>CONFIDENTIAL</div>
            <div className="text-emerald-400 font-bold">PASS / AUDITED</div>
          </div>
        </div>

        {reportType === 'EXECUTIVE' ? (
          <div className="space-y-6 text-xs text-neutral-300 font-sans leading-relaxed">
            <section className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-100 font-mono uppercase tracking-wider">
                1. Executive Threat Summary
              </h3>
              <p>
                During the reporting window, AegisSOC processed over <strong className="text-neutral-100">185,000 security telemetry events</strong> across Windows endpoints, Linux server nodes, and network gateways. 1 critical correlated incident was detected and mitigated with an average MTTD of <strong className="text-emerald-400">4.2 minutes</strong>.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-100 font-mono uppercase tracking-wider">
                2. Key Security Risk Metrics
              </h3>
              <div className="grid grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-3 rounded bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-400 block text-[10px]">TOTAL CRITICAL ALERTS</span>
                  <span className="text-lg font-bold text-rose-400">{alerts.filter(a => a.severity === 'CRITICAL').length}</span>
                </div>
                <div className="p-3 rounded bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-400 block text-[10px]">DETECTION ACCURACY (F1)</span>
                  <span className="text-lg font-bold text-emerald-400">94.5%</span>
                </div>
                <div className="p-3 rounded bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-400 block text-[10px]">SOAR ACTIONS TAKEN</span>
                  <span className="text-lg font-bold text-indigo-400">3 (100% Reversible)</span>
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-100 font-mono uppercase tracking-wider">
                3. Remediation Recommendations
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Deploy Credential Guard and LSA protection across Windows 11 fleet to block LSASS memory dumping.</li>
                <li>Mandate FIDO2 hardware MFA keys for administrative domain users.</li>
                <li>Enforce egress port restriction dropping outbound port 8443 on perimeter firewalls.</li>
              </ul>
            </section>
          </div>
        ) : (
          <div className="space-y-6 text-xs text-neutral-300 font-sans leading-relaxed">
            <section className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-100 font-mono uppercase tracking-wider">
                1. Incident Timeline & Attack Chain
              </h3>
              <div className="space-y-2 font-mono text-[11px]">
                {activeIncident?.timeline.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-neutral-950 border border-neutral-800 flex items-start gap-3">
                    <span className="text-emerald-400 font-bold whitespace-nowrap">{item.timestamp.substring(11, 19)} UTC</span>
                    <div>
                      <span className="text-neutral-100 font-bold">[{item.stage}]</span> {item.description}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-100 font-mono uppercase tracking-wider">
                2. Forensic Artifacts & Indicators of Compromise
              </h3>
              <div className="bg-neutral-950 p-3 rounded border border-neutral-800 font-mono text-[11px] space-y-1">
                <div>Malicious IP: <span className="text-rose-400">185.220.101.45 (Tor Exit Node / C2)</span></div>
                <div>Attacker Domain: <span className="text-rose-400">cdn-update-auth-telemetry.com</span></div>
                <div>Target Host: <span className="text-neutral-200">WS-FINANCE-03 (192.168.10.45)</span></div>
                <div>Target Account: <span className="text-neutral-200">j.doe</span></div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  BrainCircuit,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ListFilter,
  FileCheck,
  Zap,
  Sparkles,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import type { Incident, AIInvestigationResult } from '../../types/soc';

interface AIAnalystWorkspaceProps {
  incidents: Incident[];
  activeIncidentId: string;
  onSelectIncident: (id: string) => void;
  onTriggerInvestigation: (incidentId: string) => Promise<void>;
  isAnalyzing: boolean;
}

export const AIAnalystWorkspace: React.FC<AIAnalystWorkspaceProps> = ({
  incidents,
  activeIncidentId,
  onSelectIncident,
  onTriggerInvestigation,
  isAnalyzing
}) => {
  const currentIncident = incidents.find(i => i.incident_id === activeIncidentId) || incidents[0];
  const analysis = currentIncident?.ai_analysis;

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)] text-neutral-100">
      {/* Top Banner & Incident Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-neutral-900/90 border border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-neutral-100">AI SOC Analyst Workspace</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                GEMINI 3.8 FLASH + HEURISTIC REASONING
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Evidence-based incident decomposition strictly categorizing Facts, Inferences, Recommendations, and Unknowns.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={currentIncident?.incident_id}
            onChange={(e) => onSelectIncident(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs font-mono text-neutral-200 focus:outline-none focus:border-emerald-500"
          >
            {incidents.map(inc => (
              <option key={inc.incident_id} value={inc.incident_id}>
                {inc.incident_id} — {inc.title.slice(0, 45)}...
              </option>
            ))}
          </select>

          <button
            onClick={() => onTriggerInvestigation(currentIncident.incident_id)}
            disabled={isAnalyzing}
            className="px-4 py-1.5 rounded text-xs font-mono font-medium bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Analyzing Telemetry...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Run AI Investigation
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Output Container */}
      {analysis ? (
        <div className="space-y-6">
          {/* Executive Assessment Card */}
          <div className="bg-neutral-900/90 rounded-lg border border-neutral-800 p-5">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-800">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-neutral-400 mb-1">
                  <span>Engine: {analysis.model_name}</span>
                  <span>•</span>
                  <span>Evaluated at: {analysis.generated_at.substring(11, 19)} UTC</span>
                </div>
                <h3 className="text-sm font-semibold text-neutral-100">{analysis.summary}</h3>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-mono text-neutral-400">Confidence Score</div>
                <div className="text-xl font-bold font-mono text-emerald-400">{analysis.confidence}%</div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-mono font-semibold uppercase text-neutral-300 mb-1">
                Attack Narrative Reconstruction
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                {analysis.likely_attack_narrative}
              </p>
            </div>
          </div>

          {/* 4-Quadrant Evidence Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quadrant 1: FACTS */}
            <div className="bg-neutral-900/80 rounded-lg border border-emerald-900/50 p-4">
              <div className="flex items-center gap-2 pb-2.5 border-b border-neutral-800 mb-3 text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                  1. Facts (Empirically Confirmed Logs)
                </h4>
              </div>
              <ul className="space-y-2">
                {analysis.facts.map((fact, i) => (
                  <li key={i} className="text-xs text-neutral-300 flex items-start gap-2 bg-neutral-950/60 p-2 rounded border border-neutral-800/80">
                    <span className="font-mono text-[10px] text-emerald-400 font-bold shrink-0 mt-0.5">F-{i+1}</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quadrant 2: INFERENCES */}
            <div className="bg-neutral-900/80 rounded-lg border border-indigo-900/50 p-4">
              <div className="flex items-center gap-2 pb-2.5 border-b border-neutral-800 mb-3 text-indigo-400">
                <BrainCircuit className="w-4 h-4" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                  2. Inferences (Deductions & Intent)
                </h4>
              </div>
              <ul className="space-y-2">
                {analysis.inferences.map((inf, i) => (
                  <li key={i} className="text-xs text-neutral-300 flex items-start gap-2 bg-neutral-950/60 p-2 rounded border border-neutral-800/80">
                    <span className="font-mono text-[10px] text-indigo-400 font-bold shrink-0 mt-0.5">I-{i+1}</span>
                    <span>{inf}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quadrant 3: RECOMMENDATIONS */}
            <div className="bg-neutral-900/80 rounded-lg border border-amber-900/50 p-4">
              <div className="flex items-center gap-2 pb-2.5 border-b border-neutral-800 mb-3 text-amber-400">
                <ShieldCheck className="w-4 h-4" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                  3. Containment Recommendations
                </h4>
              </div>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="text-xs text-neutral-300 flex items-start gap-2 bg-neutral-950/60 p-2 rounded border border-neutral-800/80">
                    <span className="font-mono text-[10px] text-amber-400 font-bold shrink-0 mt-0.5">R-{i+1}</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quadrant 4: UNKNOWN */}
            <div className="bg-neutral-900/80 rounded-lg border border-rose-900/50 p-4">
              <div className="flex items-center gap-2 pb-2.5 border-b border-neutral-800 mb-3 text-rose-400">
                <HelpCircle className="w-4 h-4" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                  4. Unknown / Telemetry Gaps
                </h4>
              </div>
              <ul className="space-y-2">
                {analysis.unknown.map((unk, i) => (
                  <li key={i} className="text-xs text-neutral-300 flex items-start gap-2 bg-neutral-950/60 p-2 rounded border border-neutral-800/80">
                    <span className="font-mono text-[10px] text-rose-400 font-bold shrink-0 mt-0.5">U-{i+1}</span>
                    <span>{unk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Standard Defense Framework & Runbook Citations */}
          <div className="bg-neutral-900/90 rounded-lg border border-neutral-800 p-4">
            <div className="flex items-center gap-2 mb-3 text-neutral-200">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-mono font-semibold uppercase">Authoritative Runbook References</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.runbook_citations.map((cite, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs font-mono"
                >
                  {cite}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-neutral-900/40 border border-neutral-800 rounded-lg">
          <BrainCircuit className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-neutral-300">No AI Investigation on Record</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
            Click &quot;Run AI Investigation&quot; above to synthesize the correlated alerts, extract hard facts, formulate threat inferences, and prescribe defensible containment actions.
          </p>
        </div>
      )}
    </div>
  );
};

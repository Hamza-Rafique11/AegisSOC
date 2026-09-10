import React, { useState } from 'react';
import { Code2, Play, CheckCircle2, XCircle, Plus, Save, AlertTriangle, Shield } from 'lucide-react';
import type { DetectionRule, AegisEvent } from '../../types/soc';

interface DetectionStudioProps {
  rules: DetectionRule[];
  events: AegisEvent[];
  onToggleRule: (ruleId: string) => void;
  onSaveRule: (rule: DetectionRule) => void;
}

export const DetectionStudio: React.FC<DetectionStudioProps> = ({
  rules,
  events,
  onToggleRule,
  onSaveRule
}) => {
  const [selectedRuleId, setSelectedRuleId] = useState<string>(rules[0]?.id || '');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [editedYaml, setEditedYaml] = useState<string>('');
  const [testResults, setTestResults] = useState<{ matchedCount: number; matchedEvents: AegisEvent[] } | null>(null);

  const currentRule = rules.find(r => r.id === selectedRuleId) || rules[0];

  React.useEffect(() => {
    if (currentRule) {
      setEditedYaml(currentRule.yaml_raw || '');
      setTestResults(null);
    }
  }, [selectedRuleId, currentRule]);

  const filteredRules = rules.filter(r => activeCategory === 'ALL' || r.category === activeCategory);

  const handleTestRule = () => {
    if (!currentRule) return;
    const matches: AegisEvent[] = [];

    for (const evt of events) {
      let isMatch = true;
      if (currentRule.conditions.event_type && currentRule.conditions.event_type !== evt.event_type) {
        isMatch = false;
      }
      if (isMatch && currentRule.conditions.process_name && evt.process_name) {
        const names = Array.isArray(currentRule.conditions.process_name)
          ? currentRule.conditions.process_name
          : [currentRule.conditions.process_name];
        if (!names.some(n => evt.process_name?.toLowerCase().includes(n.toLowerCase()))) {
          isMatch = false;
        }
      }
      if (isMatch && currentRule.conditions.command_line_match && evt.command_line) {
        const patterns = currentRule.conditions.command_line_match;
        if (!patterns.some(p => evt.command_line?.toLowerCase().includes(p.toLowerCase()))) {
          isMatch = false;
        }
      }
      if (isMatch) matches.push(evt);
    }

    setTestResults({
      matchedCount: matches.length,
      matchedEvents: matches
    });
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] text-neutral-100 overflow-hidden">
      {/* Left Rules List */}
      <div className="w-80 border-r border-neutral-800 bg-neutral-950 flex flex-col shrink-0">
        <div className="p-4 border-b border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xs font-semibold uppercase text-neutral-200">
                Detection Rules ({rules.length})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-mono">
            {['ALL', 'windows', 'linux', 'network', 'identity'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2 py-0.5 rounded capitalize ${
                  activeCategory === cat ? 'bg-neutral-800 text-neutral-100 font-bold' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/60 scrollbar-thin scrollbar-thumb-neutral-800">
          {filteredRules.map((r) => {
            const isSelected = r.id === currentRule?.id;
            return (
              <div
                key={r.id}
                onClick={() => setSelectedRuleId(r.id)}
                className={`p-3.5 cursor-pointer transition-colors ${
                  isSelected ? 'bg-neutral-900/90 border-l-2 border-l-emerald-500' : 'hover:bg-neutral-900/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] font-bold text-neutral-400">{r.id}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                      r.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      r.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-neutral-800 text-neutral-300'
                    }`}>
                      {r.severity}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleRule(r.id); }}
                      className={`w-2.5 h-2.5 rounded-full ${r.enabled ? 'bg-emerald-400' : 'bg-neutral-600'}`}
                      title={r.enabled ? 'Enabled' : 'Disabled'}
                    />
                  </div>
                </div>

                <h4 className="text-xs font-semibold text-neutral-200 leading-snug line-clamp-1">
                  {r.name}
                </h4>

                <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <span className="text-emerald-400">{r.mitre_technique_id}</span>
                  <span>Conf: {r.confidence}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Rule Editor & Test Harness */}
      {currentRule ? (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-950/40 scrollbar-thin scrollbar-thumb-neutral-800">
          <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-neutral-300 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                  {currentRule.id}
                </span>
                <span className="font-mono text-xs text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                  {currentRule.mitre_tactic} • {currentRule.mitre_technique} ({currentRule.mitre_technique_id})
                </span>
              </div>
              <h2 className="text-base font-bold text-neutral-100">{currentRule.name}</h2>
              <p className="text-xs text-neutral-400 mt-1 max-w-2xl">{currentRule.description}</p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleTestRule}
                className="px-3.5 py-1.5 rounded text-xs font-mono font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                Dry-Run on Event Pipeline
              </button>
            </div>
          </div>

          {/* Test Harness Results Card */}
          {testResults && (
            <div className="bg-neutral-900/90 rounded-lg border border-neutral-800 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold uppercase text-neutral-200">
                  Test Execution Results
                </span>
                <span className="font-mono text-xs text-emerald-400">
                  Matched {testResults.matchedCount} historical events
                </span>
              </div>
              {testResults.matchedCount > 0 ? (
                <div className="space-y-1.5 max-h-40 overflow-y-auto font-mono text-[11px]">
                  {testResults.matchedEvents.map(e => (
                    <div key={e.event_id} className="p-2 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-between text-neutral-300">
                      <span>{e.timestamp.substring(11, 19)} UTC — {e.hostname}</span>
                      <span className="text-neutral-400 truncate max-w-xs">{e.command_line || e.process_name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs font-mono text-neutral-400">
                  No events in the current buffer satisfied these rule conditions.
                </div>
              )}
            </div>
          )}

          {/* YAML Definition Editor */}
          <div className="bg-neutral-900/90 rounded-lg border border-neutral-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase text-neutral-300">
                Rule Definition (Sigma / YAML Specification)
              </span>
              <span className="text-[10px] font-mono text-neutral-400">Schema Validated</span>
            </div>

            <textarea
              value={editedYaml}
              onChange={(e) => setEditedYaml(e.target.value)}
              rows={12}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-md p-3 font-mono text-xs text-emerald-400 focus:outline-none focus:border-emerald-500 leading-relaxed"
            />

            <div className="flex justify-end">
              <button
                onClick={() => onSaveRule({ ...currentRule, yaml_raw: editedYaml })}
                className="px-4 py-1.5 rounded text-xs font-mono font-medium bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                Save Rule Definition
              </button>
            </div>
          </div>

          {/* Recommended Response Playbook */}
          <div className="bg-neutral-900/90 rounded-lg border border-neutral-800 p-4">
            <h4 className="font-mono text-xs font-bold uppercase text-neutral-300 mb-1">
              Prescribed Analyst Response Procedure
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              {currentRule.recommended_response}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-neutral-400 text-xs font-mono">
          Select a detection rule to inspect specification and logic.
        </div>
      )}
    </div>
  );
};

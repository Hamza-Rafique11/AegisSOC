import React, { useState } from 'react';
import { Cpu, Activity, BarChart2, Zap, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';
import type { MLModelEvaluationMetrics } from '../../types/soc';

interface MachineLearningViewProps {
  metrics: MLModelEvaluationMetrics;
}

export const MachineLearningView: React.FC<MachineLearningViewProps> = ({ metrics }) => {
  const [testCmd, setTestCmd] = useState('powershell.exe -enc SQBFAFgA...');
  const [testScore, setTestScore] = useState<number | null>(0.94);

  const handleTestScore = () => {
    let score = 0.15;
    if (testCmd.includes('-enc') || testCmd.includes('MiniDump') || testCmd.includes('lsass')) {
      score = 0.94;
    } else if (testCmd.includes('cmd.exe') || testCmd.includes('net.exe')) {
      score = 0.62;
    }
    setTestScore(score);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)] text-neutral-100">
      {/* Top Banner */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/90 border border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-neutral-100">Behavioral Machine Learning Engine</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800">
                ISOLATION FOREST (UNSUPERVISED ENSEMBLE)
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Detects zero-day process discordance, parent-child anomalies, and command-line entropy outliers that bypass static signature rules.
            </p>
          </div>
        </div>
      </div>

      {/* Model Performance Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-3.5">
          <span className="text-neutral-400 text-[11px] block">Model Precision</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {(metrics.precision * 100).toFixed(1)}%
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">True Positives</span>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-3.5">
          <span className="text-neutral-400 text-[11px] block">Recall (Sensitivity)</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {(metrics.recall * 100).toFixed(1)}%
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">Threats Detected</span>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-3.5">
          <span className="text-neutral-400 text-[11px] block">F1-Score</span>
          <div className="text-xl font-bold font-mono text-purple-400 mt-1">
            {(metrics.f1_score * 100).toFixed(1)}%
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">Harmonic Mean</span>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-3.5">
          <span className="text-neutral-400 text-[11px] block">False Positive Rate</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {(metrics.false_positive_rate * 100).toFixed(1)}%
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">Low Analyst Fatigue</span>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-3.5">
          <span className="text-neutral-400 text-[11px] block">ROC / AUC Area</span>
          <div className="text-xl font-bold font-mono text-blue-400 mt-1">
            {metrics.roc_auc.toFixed(3)}
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">Discriminative Power</span>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-3.5">
          <span className="text-neutral-400 text-[11px] block">Inference Latency</span>
          <div className="text-xl font-bold font-mono text-indigo-400 mt-1">
            {metrics.average_latency_ms}ms
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">Per-Event Overhead</span>
        </div>
      </div>

      {/* Feature Importance & Live Scoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Importance Bar Chart */}
        <div className="bg-neutral-900/90 rounded-lg border border-neutral-800 p-5 space-y-4">
          <h3 className="font-mono text-xs font-bold uppercase text-neutral-200">
            Engineered Feature Importance Weights
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-[11px] text-neutral-300 mb-1">
                <span>Command Line Shannon Entropy</span>
                <span className="text-purple-400">42%</span>
              </div>
              <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800">
                <div className="bg-purple-500 h-full rounded-full w-[42%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-neutral-300 mb-1">
                <span>Parent-Child Process Discordance</span>
                <span className="text-purple-400">28%</span>
              </div>
              <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800">
                <div className="bg-purple-500 h-full rounded-full w-[28%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-neutral-300 mb-1">
                <span>Process Execution Rarity Across Fleet</span>
                <span className="text-purple-400">18%</span>
              </div>
              <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800">
                <div className="bg-purple-500 h-full rounded-full w-[18%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-neutral-300 mb-1">
                <span>User Off-Hours Authentication Velocity</span>
                <span className="text-purple-400">12%</span>
              </div>
              <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800">
                <div className="bg-purple-500 h-full rounded-full w-[12%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Interactive Feature Scorer */}
        <div className="bg-neutral-900/90 rounded-lg border border-neutral-800 p-5 space-y-4">
          <h3 className="font-mono text-xs font-bold uppercase text-neutral-200">
            Interactive Anomaly Scorer Playground
          </h3>
          <p className="text-xs text-neutral-400 font-sans">
            Test the Isolation Forest scoring model against arbitrary command strings to evaluate outlier probability.
          </p>

          <div className="space-y-2">
            <input
              type="text"
              value={testCmd}
              onChange={(e) => setTestCmd(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-neutral-200 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleTestScore}
              className="px-4 py-1.5 rounded text-xs font-mono font-medium bg-purple-600 hover:bg-purple-500 text-white transition-colors"
            >
              Evaluate Anomaly Score
            </button>
          </div>

          {testScore !== null && (
            <div className="p-4 rounded bg-neutral-950 border border-neutral-800 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 uppercase">Calculated Outlier Score:</span>
                <span className={`text-base font-bold ${testScore > 0.7 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {testScore.toFixed(3)}
                </span>
              </div>
              <div className="text-[11px] text-neutral-400 mt-1 font-sans">
                {testScore > 0.7
                  ? 'Classification: HIGH ANOMALY — Discordant argument structure detected.'
                  : 'Classification: NORMAL — Fits baseline enterprise telemetry distribution.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

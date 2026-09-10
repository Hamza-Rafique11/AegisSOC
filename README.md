# AegisSOC

**AI-Augmented Blue Team & Threat Detection Platform** for enterprise SOC operations, threat hunting, and defensive security research.

AegisSOC is a full-stack Security Operations Center (SOC) simulation platform built as a Final Year Project (FYP). It combines rule-based detection-as-code, an unsupervised ML anomaly engine, an LLM-powered AI SOC analyst, and a human-in-the-loop SOAR response workflow — all wrapped in a single-pane-of-glass dashboard modeled on real-world enterprise SOC tooling.

> ⚠️ **Lab / research project.** AegisSOC runs against an in-memory, seeded data store designed for demonstration, coursework, and research evaluation. It is not hardened for production deployment.

---

## Table of Contents

- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Detection-as-Code](#detection-as-code)
- [API Overview](#api-overview)
- [Research / FYP Evaluation](#research--fyp-evaluation)
- [Roadmap](#roadmap)
- [Disclaimer](#disclaimer)
- [License](#license)

---

## Key Features

| Module | Description |
|---|---|
| **SOC Dashboard** | Real-time overview of open incidents, critical alerts, telemetry throughput, and sensor health. |
| **Incidents Hub** | Case management view correlating alerts into incidents with timelines, affected hosts/users, and IOCs. |
| **Alert Queue** | Triage workflow for alerts (`NEW → TRIAGED → ESCALATED → RESOLVED / FALSE_POSITIVE`). |
| **Threat Hunting** | Ad-hoc query interface over ingested telemetry (source, severity, keyword search). |
| **Detection-as-Code Studio** | YAML-defined detection rules, editable and toggleable at runtime, mapped to MITRE ATT&CK. |
| **AI SOC Analyst** | LLM-driven incident investigation (Google Gemini) that separates **facts**, **inferences**, **recommendations**, and **unknowns**, with citations to response runbooks. Falls back to a deterministic offline reasoning engine if no API key is configured. |
| **Attack Graph** | Node/edge graph visualization of an incident's attack path (attacker → host → process → C2). |
| **Identity Threat Detection (ITDR)** | Per-identity risk scoring, risk factors, login geography, and lockout state. |
| **MITRE ATT&CK Matrix** | Live coverage map showing detection rule count and active alerts per technique. |
| **Threat Intelligence** | IOC repository (IP / domain / hash / URL) with confidence scoring and CVE references. |
| **ML Analytics** | Evaluation metrics and live inference for an Isolation Forest–based anomaly model. |
| **SOAR / Response** | Approval-gated automated response actions (isolate host, block IP, disable account, terminate process) with rollback support. |
| **Attack Simulation Lab** | Safe, lab-scoped attack scenario execution to generate telemetry and validate detection coverage. |
| **Telemetry Sensors** | Manage collector status (Sysmon, Windows Event Log, Linux auditd/auth, Zeek, Suricata) and inject sample/live telemetry via SSE. |
| **Audit Trail** | Full audit log of analyst and system actions for accountability. |
| **FYP Evaluation** | Research metrics comparing detection conditions (`RULE_ONLY`, `ML_ONLY`, `RULE_PLUS_ML`, `RULE_ML_AI_ANALYST`) — precision, recall, F1, MTTD, MTTR, automation rate, etc. |
| **SOC Reports** | Exportable reporting view summarizing incidents and alerts. |

## Architecture

```
┌──────────────────────────────┐        ┌──────────────────────────────────┐
│   React 19 + Vite SPA        │  HTTP  │   Express Server (server.ts)      │
│   (src/)                     │◄──────►│   In-memory state store           │
│   - Sidebar / routed views   │  SSE   │   REST API (/api/*)               │
│   - 17 feature components    │◄──────►│   Live telemetry stream           │
└──────────────────────────────┘        │   Google Gemini integration       │
                                         │   (AI SOC Analyst investigations) │
                                         └──────────────────────────────────┘
                                                        │
                                                        ▼
                                         ┌──────────────────────────────────┐
                                         │  Detection-as-Code (YAML rules)   │
                                         │  detections/{windows,linux,       │
                                         │              network,identity}/  │
                                         └──────────────────────────────────┘
```

- The **frontend** is a single-page React app (`src/App.tsx`) that fetches all SOC state on load and subscribes to a Server-Sent Events (SSE) stream for live telemetry/alerts.
- The **backend** (`server.ts`) exposes a REST API backed by an in-memory data store pre-seeded with realistic collectors, detection rules, alerts, incidents, IOCs, and identity profiles.
- **Detection rules** are authored as YAML (see `detections/`) and mirrored into the in-memory rule engine; rules can be toggled or edited live from the Detection Studio.
- The **AI SOC Analyst** calls the Gemini API when `GEMINI_API_KEY` is set, requesting a strictly structured JSON investigation (facts vs. inferences vs. recommendations vs. unknowns, MITRE mapping, runbook citations). If no key is present or the call fails, a deterministic offline reasoning engine returns an equivalent structured analysis so the platform remains fully functional without external dependencies.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite 6, Tailwind CSS 4, lucide-react, motion
- **Backend:** Node.js, Express 4, tsx (dev), esbuild (build)
- **AI:** `@google/genai` (Gemini API)
- **Tooling:** TypeScript 5.8, ESM throughout

## Project Structure

```
AegisSOC/
├── detections/                  # Detection-as-Code rule library (YAML)
│   ├── identity/                #   Impossible travel / identity anomalies
│   ├── linux/                   #   SSH brute force, auth abuse
│   ├── network/                 #   C2 beaconing, non-standard ports
│   └── windows/                 #   LSASS dumping, encoded PowerShell
├── public/assets/aistudio/      # Static asset mount
├── src/
│   ├── components/
│   │   ├── ai_analyst/          # AI SOC Analyst workspace
│   │   ├── alerts/               # Alert Queue
│   │   ├── attack_graph/         # Attack Graph visualization
│   │   ├── audit/                # Audit Trail
│   │   ├── collectors/           # Telemetry Sensors
│   │   ├── dashboard/             # SOC Dashboard
│   │   ├── detections/           # Detection-as-Code Studio
│   │   ├── hunting/               # Threat Hunting
│   │   ├── identity/              # Identity Threat (ITDR)
│   │   ├── incidents/             # Incidents Hub
│   │   ├── layout/                # Sidebar / Header
│   │   ├── mitre/                 # MITRE ATT&CK Matrix
│   │   ├── ml/                    # ML Analytics
│   │   ├── reports/               # SOC Reports
│   │   ├── research/              # FYP Evaluation
│   │   ├── simulation/            # Attack Simulation Lab
│   │   ├── soar/                  # SOAR / Response Playbooks
│   │   └── threat_intel/          # Threat Intelligence
│   ├── types/soc.ts              # Shared TypeScript data models
│   ├── App.tsx                   # Root component / routing / data loading
│   ├── main.tsx                  # React entry point
│   └── index.css
├── server.ts                     # Express API server + in-memory data engine
├── vite.config.ts
├── tsconfig.json
├── metadata.json
├── .env.example
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ (Node 20 LTS recommended)
- npm

### Installation

```bash
git clone https://github.com/Hamza-Rafique11/AegisSOC.git
cd AegisSOC
npm install
```

### Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set `GEMINI_API_KEY` if you want live LLM-powered incident investigations (see [Environment Variables](#environment-variables)). The platform works fully without it, using the offline deterministic analysis engine as a fallback.

### Run in development

```bash
npm run dev
```

This starts the Express + Vite dev server (`tsx server.ts`) on **http://localhost:3000**.

### Build for production

```bash
npm run build
npm start
```

`npm run build` compiles the Vite frontend and bundles `server.ts` into `dist/server.cjs`; `npm start` runs the bundled server.

### Other scripts

```bash
npm run preview   # Preview the built frontend
npm run lint       # Type-check with tsc --noEmit
npm run clean      # Remove build output
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Optional | Enables the AI SOC Analyst to call the Gemini API for live incident investigation. Without it, a deterministic offline reasoning engine is used instead. |
| `APP_URL` | Optional | Base URL of the hosted instance, used for self-referential links. |

## Detection-as-Code

Detection rules live under `detections/<category>/*.yaml` and follow a common schema:

```yaml
id: "AEGIS-WIN-001"
name: "Suspicious Encoded PowerShell Execution"
description: "..."
category: "windows"
severity: "HIGH"
confidence: 88
mitre_tactic: "Execution"
mitre_technique: "Command and Scripting Interpreter: PowerShell"
mitre_technique_id: "T1059.001"
recommended_response: "..."
enabled: true
conditions:
  event_type: "process_creation"
  process_name: ["powershell.exe", "pwsh.exe"]
  command_line_match: ["-enc", "-encodedcommand", "-e ", "frombase64string", "downloadstring"]
```

Shipped rules cover:

- **Windows:** Encoded PowerShell execution (`T1059.001`), LSASS credential dumping (`T1003.001`)
- **Linux:** SSH brute force (`T1110.001`)
- **Network:** Outbound C2 beaconing on non-standard ports (`T1071.001`)
- **Identity:** Impossible travel velocity anomaly (`T1078.004`)

New rules can be added as YAML files and/or created live from the Detection-as-Code Studio UI (`POST /api/detections/rules`).

## API Overview

All endpoints are served under `/api`. Highlights:

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/health` | GET | Service health check |
| `/api/telemetry/collectors` | GET | List telemetry collectors/sensors |
| `/api/telemetry/collectors/:id/toggle` | POST | Enable/disable a collector |
| `/api/telemetry/stream` | GET | SSE stream of live telemetry, events, and alerts |
| `/api/telemetry/ingest` | POST | Ingest a batch of raw security events |
| `/api/telemetry/upload` | POST | Upload telemetry from a file |
| `/api/events` | GET | Query ingested events (filter by source/severity/keyword) |
| `/api/detections/rules` | GET / POST | List / create detection rules |
| `/api/detections/rules/:id/toggle` | POST | Enable/disable a rule |
| `/api/alerts` | GET | List alerts |
| `/api/alerts/:id/status` | PATCH | Update alert triage status |
| `/api/incidents` | GET | List incidents |
| `/api/incidents/:id/graph` | GET | Attack graph nodes/edges for an incident |
| `/api/mitre/coverage` | GET | MITRE ATT&CK technique coverage |
| `/api/threat-intel/iocs` | GET | List threat intel IOCs |
| `/api/threat-intel/enrich` | POST | Enrich an indicator |
| `/api/ml/metrics` | GET | Anomaly model evaluation metrics |
| `/api/ml/predict` | POST | Score a single event for anomaly likelihood |
| `/api/identity/profiles` | GET | Identity risk profiles (ITDR) |
| `/api/ai/investigate` | POST | Trigger an AI SOC Analyst investigation for an incident |
| `/api/soar/actions` | GET | List SOAR response actions |
| `/api/soar/approve` | POST | Approve a pending SOAR action |
| `/api/soar/rollback` | POST | Roll back an executed SOAR action |
| `/api/simulation/scenarios` | GET | List attack simulation scenarios |
| `/api/simulation/execute` | POST | Execute a lab-scoped attack scenario |
| `/api/audit/logs` | GET | Retrieve the audit trail |
| `/api/research/metrics` | GET | FYP research evaluation metrics |

## Research / FYP Evaluation

The **FYP Evaluation** module exists specifically to support academic evaluation of this project. It reports precision, recall, F1 score, false-positive rate, detection latency, mean time to detect/respond (MTTD/MTTR), alert triage time, automation rate, AI recommendation accuracy, AI hallucination rate, human override rate, containment time, and rollback success rate — broken down across four escalating detection conditions:

1. `RULE_ONLY` — signature/rule-based detection alone
2. `ML_ONLY` — unsupervised anomaly detection alone
3. `RULE_PLUS_ML` — combined rule + ML pipeline
4. `RULE_ML_AI_ANALYST` — full pipeline with AI-assisted triage and investigation

This structure is designed to let the platform double as an experimental testbed comparing detection strategies, as well as a functioning SOC demo.

## Roadmap

- [ ] Persistent storage (replace in-memory state store)
- [ ] Authentication / role-based access control
- [ ] Real collector integrations (Sysmon, Zeek, Suricata agents)
- [ ] Exportable PDF/CSV incident reports
- [ ] Unit/integration test suite

## Disclaimer

AegisSOC is an educational and research platform built to demonstrate SOC workflows, detection engineering, and AI-assisted security operations. The **Attack Simulation Lab** is intended strictly for **isolated lab environments** and must never be run against production systems or networks you do not own or have explicit authorization to test.

## License

No license file is currently included in this repository. Add a `LICENSE` file to clarify usage terms before distributing or accepting external contributions.

import React from 'react';
import {
  ShieldAlert,
  LayoutDashboard,
  AlertTriangle,
  Flame,
  Search,
  Code2,
  BrainCircuit,
  Share2,
  Users,
  Grid3X3,
  Globe2,
  Cpu,
  Zap,
  FlaskConical,
  ScrollText,
  GraduationCap,
  FileBarChart,
  Radio
} from 'lucide-react';

export type NavSection = 
  | 'dashboard'
  | 'incidents'
  | 'alerts'
  | 'hunting'
  | 'detections'
  | 'ai_analyst'
  | 'attack_graph'
  | 'identity'
  | 'mitre'
  | 'threat_intel'
  | 'ml'
  | 'soar'
  | 'simulation'
  | 'collectors'
  | 'audit'
  | 'research'
  | 'reports';

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  openIncidentCount: number;
  criticalAlertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  openIncidentCount,
  criticalAlertCount
}) => {
  const navItems: { id: NavSection; label: string; icon: React.ElementType; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'SOC Dashboard', icon: LayoutDashboard },
    { id: 'incidents', label: 'Incidents Hub', icon: Flame, badge: openIncidentCount, badgeColor: 'bg-rose-900/80 text-rose-300 border-rose-700/50' },
    { id: 'alerts', label: 'Alert Queue', icon: AlertTriangle, badge: criticalAlertCount, badgeColor: 'bg-amber-900/80 text-amber-300 border-amber-700/50' },
    { id: 'hunting', label: 'Threat Hunting', icon: Search },
    { id: 'detections', label: 'Detection-as-Code', icon: Code2 },
    { id: 'ai_analyst', label: 'AI SOC Analyst', icon: BrainCircuit },
    { id: 'attack_graph', label: 'Attack Graph', icon: Share2 },
    { id: 'identity', label: 'Identity (ITDR)', icon: Users },
    { id: 'mitre', label: 'MITRE ATT&CK', icon: Grid3X3 },
    { id: 'threat_intel', label: 'Threat Intel', icon: Globe2 },
    { id: 'ml', label: 'ML Analytics', icon: Cpu },
    { id: 'soar', label: 'SOAR / Response', icon: Zap },
    { id: 'simulation', label: 'Attack Simulation Lab', icon: FlaskConical },
    { id: 'collectors', label: 'Telemetry Sensors', icon: Radio },
    { id: 'audit', label: 'Audit Trail', icon: ScrollText },
    { id: 'research', label: 'FYP Evaluation', icon: GraduationCap },
    { id: 'reports', label: 'SOC Reports', icon: FileBarChart }
  ];

  return (
    <aside id="soc-sidebar" className="w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col h-screen select-none shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-neutral-800/80 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-950">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold tracking-wider text-neutral-100 text-sm">AegisSOC</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
              BLUE TEAM
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 tracking-tight">Threat Detection & Response</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5 scrollbar-thin scrollbar-thumb-neutral-800">
        <div className="px-2 pb-1.5 text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-semibold">
          SOC Operations
        </div>

        {navItems.slice(0, 7).map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => onSelectSection(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-neutral-800/90 text-white font-semibold shadow-inner border border-neutral-700/60'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-neutral-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono border ${item.badgeColor || 'bg-neutral-800 text-neutral-300'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="px-2 pt-3 pb-1 text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-semibold">
          Intelligence & Defense
        </div>

        {navItems.slice(7, 13).map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => onSelectSection(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-neutral-800/90 text-white font-semibold shadow-inner border border-neutral-700/60'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-neutral-400'}`} />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}

        <div className="px-2 pt-3 pb-1 text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-semibold">
          Governance & Research
        </div>

        {navItems.slice(13).map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => onSelectSection(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-neutral-800/90 text-white font-semibold shadow-inner border border-neutral-700/60'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-neutral-400'}`} />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Readiness / Sensor Health Bar */}
      <div className="p-3 border-t border-neutral-800/80 bg-neutral-950/60 text-[11px]">
        <div className="flex items-center justify-between text-neutral-400 mb-1.5">
          <span className="flex items-center gap-1.5 font-mono text-[10px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            PIPELINE READY
          </span>
          <span className="font-mono text-[10px] text-emerald-400">191 EPS</span>
        </div>
        <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden border border-neutral-800">
          <div className="bg-emerald-500 h-full rounded-full w-[84%]"></div>
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-neutral-400 font-mono">
          <span>Buffer: 16%</span>
          <span>Latency: 12ms</span>
        </div>
      </div>
    </aside>
  );
};

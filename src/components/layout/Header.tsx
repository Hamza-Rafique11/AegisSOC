import React from 'react';
import { Search, ShieldAlert, Terminal, Clock, BellRing, RefreshCw, Radio } from 'lucide-react';

interface HeaderProps {
  currentSectionTitle: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onNavigateToLiveIngest?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSectionTitle,
  onRefresh,
  isRefreshing,
  onNavigateToLiveIngest
}) => {
  return (
    <header id="soc-header" className="h-14 bg-neutral-950 border-b border-neutral-800 px-5 flex items-center justify-between shrink-0">
      {/* Breadcrumb & Section Name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-mono text-xs text-neutral-400">
          <span>Aegis</span>
          <span>/</span>
          <span className="text-neutral-100 font-semibold uppercase">{currentSectionTitle}</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          DEFCON 3 (ELEVATED GUARD)
        </div>

        {onNavigateToLiveIngest && (
          <button
            onClick={onNavigateToLiveIngest}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-850 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono transition-colors"
            title="Open Live Telemetry Ingestion Hub"
          >
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>LIVE INGEST API: READY</span>
          </button>
        )}
      </div>

      {/* Center Command Search Bar */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search telemetry (IP, Hostname, SHA256, User, MITRE ID)..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-md pl-9 pr-8 py-1.5 text-xs text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 font-mono transition-colors"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-neutral-800 text-neutral-400 px-1 rounded border border-neutral-700 font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Controls & Analyst Identity */}
      <div className="flex items-center gap-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Refresh live telemetry stream"
            disabled={isRefreshing}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 rounded border border-neutral-800 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        )}

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 px-2 py-1 rounded bg-neutral-900 border border-neutral-800">
          <Clock className="w-3.5 h-3.5 text-neutral-400" />
          <span>UTC {new Date().toISOString().substring(11, 19)}</span>
        </div>

        <div className="flex items-center gap-2.5 pl-2 border-l border-neutral-800">
          <div className="w-7 h-7 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-200 text-xs font-mono font-bold">
            BT
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-[11px] font-medium text-neutral-200 leading-none">lead.analyst</div>
            <div className="text-[10px] font-mono text-emerald-400 leading-tight">SOC_ANALYST</div>
          </div>
        </div>
      </div>
    </header>
  );
};

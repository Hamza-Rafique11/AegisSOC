import React, { useState } from 'react';
import { Share2, Server, User, Terminal, Globe, ShieldAlert, Cpu, ZoomIn, ZoomOut, RotateCcw, Info } from 'lucide-react';
import type { AttackGraphNode, AttackGraphEdge } from '../../types/soc';

interface AttackGraphViewProps {
  incidentId: string;
  nodes: AttackGraphNode[];
  edges: AttackGraphEdge[];
}

export const AttackGraphView: React.FC<AttackGraphViewProps> = ({
  incidentId,
  nodes,
  edges
}) => {
  const [selectedNode, setSelectedNode] = useState<AttackGraphNode | null>(nodes[nodes.length - 2] || nodes[0]);
  const [zoom, setZoom] = useState(1);

  const getNodeIcon = (type: AttackGraphNode['type']) => {
    switch (type) {
      case 'attacker':
        return Globe;
      case 'host':
        return Server;
      case 'user':
        return User;
      case 'process':
        return Terminal;
      case 'c2':
        return ShieldAlert;
      default:
        return Cpu;
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] text-neutral-100 overflow-hidden">
      {/* Interactive Graph Canvas */}
      <div className="flex-1 flex flex-col bg-neutral-950/90 relative border-r border-neutral-800">
        {/* Canvas Toolbar */}
        <div className="p-3 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 font-mono text-xs text-neutral-300">
            <Share2 className="w-4 h-4 text-indigo-400" />
            <span>INCIDENT ATTACK GRAPH: {incidentId}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-neutral-900 px-2 py-1 rounded border border-neutral-800 text-xs font-mono">
            <button
              onClick={() => setZoom(z => Math.min(z + 0.1, 1.4))}
              className="p-1 hover:text-white text-neutral-400"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-neutral-400 text-[11px]">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(z => Math.max(z - 0.1, 0.7))}
              className="p-1 hover:text-white text-neutral-400"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1 hover:text-white text-neutral-400"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SVG Attack Flow Viewport */}
        <div className="flex-1 overflow-auto p-8 relative flex items-center justify-center">
          <div
            className="transition-transform duration-150 origin-center"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* SVG Visual Lines connecting nodes */}
            <svg className="w-[1100px] h-[400px] absolute inset-0 pointer-events-none">
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                </marker>
                <marker
                  id="arrow-red"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                </marker>
              </defs>

              {edges.map((edge) => {
                const src = nodes.find(n => n.id === edge.source);
                const tgt = nodes.find(n => n.id === edge.target);
                if (!src || !tgt || src.x === undefined || src.y === undefined || tgt.x === undefined || tgt.y === undefined) {
                  return null;
                }
                const isCritical = edge.severity === 'CRITICAL';
                return (
                  <g key={edge.id}>
                    <line
                      x1={src.x + 90}
                      y1={src.y + 40}
                      x2={tgt.x + 10}
                      y2={tgt.y + 40}
                      stroke={isCritical ? '#f43f5e' : '#475569'}
                      strokeWidth={isCritical ? 2.5 : 1.5}
                      strokeDasharray={edge.animated ? '5,5' : undefined}
                      markerEnd={isCritical ? 'url(#arrow-red)' : 'url(#arrow)'}
                      className={edge.animated ? 'animate-pulse' : ''}
                    />
                    {edge.label && (
                      <text
                        x={(src.x + tgt.x) / 2 + 50}
                        y={(src.y + tgt.y) / 2 + 30}
                        fill="#94a3b8"
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="middle"
                        className="bg-neutral-900 px-1"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Nodes DOM Elements positioned explicitly */}
            <div className="w-[1100px] h-[400px] relative">
              {nodes.map((node) => {
                const Icon = getNodeIcon(node.type);
                const isSelected = selectedNode?.id === node.id;
                const isCritical = node.severity === 'CRITICAL';
                const isHigh = node.severity === 'HIGH';

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{
                      left: `${node.x || 0}px`,
                      top: `${node.y || 0}px`
                    }}
                    className={`absolute w-52 p-3 rounded-lg cursor-pointer transition-all duration-150 border select-none ${
                      isSelected
                        ? 'bg-neutral-900 ring-2 ring-emerald-500 border-emerald-500/80 shadow-lg shadow-emerald-950'
                        : isCritical
                        ? 'bg-neutral-950/90 border-rose-800/80 hover:border-rose-600'
                        : isHigh
                        ? 'bg-neutral-950/90 border-amber-800/80 hover:border-amber-600'
                        : 'bg-neutral-950/90 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`p-1.5 rounded ${
                        isCritical ? 'bg-rose-950 text-rose-400' :
                        isHigh ? 'bg-amber-950 text-amber-400' :
                        'bg-neutral-800 text-neutral-300'
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">
                        {node.type}
                      </span>
                    </div>

                    <div className="font-semibold text-xs text-neutral-200 truncate">
                      {node.label}
                    </div>

                    {node.sublabel && (
                      <div className="font-mono text-[10px] text-neutral-400 truncate mt-0.5">
                        {node.sublabel}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Node Inspector Drawer */}
      <div className="w-80 bg-neutral-950 p-5 flex flex-col border-l border-neutral-800 shrink-0 overflow-y-auto">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-800 text-neutral-200">
          <Info className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-mono font-semibold uppercase">Node Telemetry Inspector</h3>
        </div>

        {selectedNode ? (
          <div className="mt-4 space-y-4 text-xs font-mono">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase">Selected Entity</span>
              <div className="text-sm font-sans font-bold text-neutral-100 mt-0.5">
                {selectedNode.label}
              </div>
              <div className="text-neutral-400 text-[11px]">{selectedNode.sublabel}</div>
            </div>

            <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
              <span className="text-[10px] text-neutral-400 uppercase block mb-1">Entity Type</span>
              <span className="text-emerald-400 uppercase font-bold">{selectedNode.type}</span>
            </div>

            <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
              <span className="text-[10px] text-neutral-400 uppercase block mb-1">Risk Severity</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                selectedNode.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                selectedNode.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                'bg-neutral-800 text-neutral-300'
              }`}>
                {selectedNode.severity || 'INFORMATIONAL'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-neutral-400 uppercase block mb-1">Attack Pivots (Edges)</span>
              <div className="space-y-1.5">
                {edges
                  .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                  .map(e => (
                    <div key={e.id} className="p-2 rounded bg-neutral-900/60 border border-neutral-800 text-[10px] text-neutral-300">
                      {e.source === selectedNode.id ? 'Outbound → ' : 'Inbound ← '}
                      <span className="text-neutral-200">{e.label || 'Connection'}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 text-neutral-400 text-xs text-center font-mono">
            Click any node on the graph to inspect raw attributes and pivot connections.
          </div>
        )}
      </div>
    </div>
  );
};

import { useState } from 'react';
import { MapPin, Info, ArrowRight, Gauge } from 'lucide-react';
import { Village, CanalGate, EmergencyReport } from '../types';

interface RiverMapProps {
  villages: Village[];
  gates: CanalGate[];
  emergencies: EmergencyReport[];
}

export default function RiverMap({ villages, gates, emergencies }: RiverMapProps) {
  const [selectedNode, setSelectedNode] = useState<{ type: 'village' | 'gate' | 'emergency'; id: string } | null>(null);

  // Distributary points coordinates on SVG
  const mapPoints = {
    reservoir: { x: 80, y: 150 },
    mainCanal: [
      { x: 80, y: 150 },
      { x: 200, y: 150 },
      { x: 350, y: 150 },
      { x: 500, y: 150 },
      { x: 650, y: 150 },
      { x: 800, y: 150 }
    ],
    villages: {
      V1: { x: 200, y: 60, offtake: { x: 200, y: 150 } }, // Rampur
      V2: { x: 350, y: 240, offtake: { x: 350, y: 150 } }, // Kalyanpur
      V3: { x: 500, y: 60, offtake: { x: 500, y: 150 } }, // Shivpur
      V4: { x: 650, y: 240, offtake: { x: 650, y: 150 } }, // Daulatpur
      V5: { x: 800, y: 60, offtake: { x: 800, y: 150 } }  // Harigarh
    }
  };

  const getSelectedDetails = () => {
    if (!selectedNode) return null;
    if (selectedNode.type === 'village') {
      const v = villages.find(x => x.id === selectedNode.id);
      if (!v) return null;
      return (
        <div className="bg-slate-900/40 border border-cyan-500/20 p-3 rounded-lg space-y-2.5 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-500/20">Village Basin</span>
              <h4 className="text-xs font-bold text-white mt-1">{v.name}</h4>
            </div>
            <span className="text-xs font-mono text-slate-400">km {v.distanceFromHead}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-950/40 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block">CROP FIELD</span>
              <span className="text-slate-200 font-semibold text-[11px]">{v.cropType}</span>
            </div>
            <div className="bg-slate-950/40 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block">GROWTH STAGE</span>
              <span className="text-slate-200 font-semibold text-[11px]">{v.cropStage}</span>
            </div>
            <div className="bg-slate-950/40 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block">DAILY DEMAND</span>
              <span className="text-cyan-400 font-bold text-[11px]">{v.waterDemand.toLocaleString()} m³</span>
            </div>
            <div className="bg-slate-950/40 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block">SOIL MOISTURE</span>
              <span className={`font-bold text-[11px] ${v.soilMoisture < 35 ? 'text-amber-400' : 'text-emerald-400'}`}>{v.soilMoisture}%</span>
            </div>
          </div>
          <div className="text-center pt-1 border-t border-slate-800">
            <span className="text-[10px] text-slate-400">Water Debt Balance: <b className={v.waterDebt < 0 ? 'text-rose-400' : 'text-emerald-400'}>{v.waterDebt.toLocaleString()} m³</b></span>
          </div>
        </div>
      );
    } else if (selectedNode.type === 'gate') {
      const g = gates.find(x => x.id === selectedNode.id);
      if (!g) return null;
      return (
        <div className="bg-slate-900/40 border border-blue-500/20 p-3 rounded-lg space-y-2.5 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-500/20">Radial Regulator Gate</span>
              <h4 className="text-xs font-bold text-white mt-1">{g.name}</h4>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-semibold">{g.status}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-950/40 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block">CURRENT DISCHARGE</span>
              <span className="text-blue-400 font-bold text-[11px]">{g.currentFlowRate} m³/s</span>
            </div>
            <div className="bg-slate-950/40 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block">GATE HEIGHT</span>
              <span className="text-slate-200 font-semibold text-[11px]">{g.gateOpeningPercent}% OPEN</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 font-mono leading-relaxed bg-slate-950/40 p-2 rounded border border-slate-800/50">
            Location segment: {g.canalSegment}. Controlled via SCADA digital telemetry framework.
          </p>
        </div>
      );
    } else if (selectedNode.type === 'emergency') {
      const e = emergencies.find(x => x.id === selectedNode.id);
      if (!e) return null;
      return (
        <div className="bg-slate-900/40 border border-rose-500/20 p-3 rounded-lg space-y-2.5 shadow-lg">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
              <h4 className="text-xs font-bold text-white">{e.type}</h4>
            </div>
            <span className="text-[10px] bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold px-2 py-0.5 rounded uppercase">
              {e.priority}
            </span>
          </div>
          <div className="text-xs font-mono bg-slate-950/40 p-2.5 rounded border border-slate-800 space-y-2">
            <div>
              <span className="text-slate-500 block">INCIDENT SITE:</span>
              <span className="text-slate-200 font-semibold">{e.location}</span>
            </div>
            <div>
              <span className="text-slate-500 block">REPORTER REMARKS:</span>
              <p className="text-rose-300 text-[11px] leading-relaxed mt-0.5 font-sans font-medium">{e.description}</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
            <span>STATUS: <b className="text-rose-400">{e.status}</b></span>
            <span>Reported {new Date(e.reportedAt).toLocaleTimeString()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 bg-slate-900/30 p-3.5 rounded-lg border border-slate-800">
      {/* SVG Map Section */}
      <div className="xl:col-span-2 bg-slate-950 rounded-lg p-3.5 border border-slate-800 relative overflow-hidden flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2 border-b border-slate-800 pb-2">
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              GIS Canal Command Area Telemetry Map
            </h3>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Real-time water flow lines, control points &amp; village offtakes</p>
          </div>
          <span className="text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded">
            SCALE: 1:50,000
          </span>
        </div>

        {/* SVG Canvas */}
        <div className="relative aspect-[3/1.5] w-full min-h-[300px] flex items-center justify-center bg-slate-950 rounded-lg">
          <svg viewBox="0 0 900 300" className="w-full h-full">
            {/* Legend Line indicators */}
            <defs>
              <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Canal Flow Pathway Line (Thick glowing path) */}
            <path
              d="M 50 150 L 850 150"
              stroke="url(#blueGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              className="animate-pulse"
            />
            {/* Flow direction arrows */}
            <path d="M 120 150 L 115 145 M 120 150 L 115 155" stroke="#38bdf8" strokeWidth="2" />
            <path d="M 420 150 L 415 145 M 420 150 L 415 155" stroke="#38bdf8" strokeWidth="2" />
            <path d="M 720 150 L 715 145 M 720 150 L 715 155" stroke="#38bdf8" strokeWidth="2" />

            {/* Offtake Feeder Canals (Vertical lines) */}
            {/* Rampur V1 Feeder */}
            <line x1="200" y1="150" x2="200" y2="70" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="4 2" />
            {/* Kalyanpur V2 Feeder */}
            <line x1="350" y1="150" x2="350" y2="230" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="4 2" />
            {/* Shivpur V3 Feeder */}
            <line x1="500" y1="150" x2="500" y2="70" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="4 2" />
            {/* Daulatpur V4 Feeder */}
            <line x1="650" y1="150" x2="650" y2="230" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="4 2" />
            {/* Harigarh V5 Feeder */}
            <line x1="800" y1="150" x2="800" y2="70" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="4 2" />

            {/* Reservoir Gate (Main Head regulator) */}
            <g transform="translate(60, 130)" className="cursor-pointer" onClick={() => setSelectedNode({ type: 'gate', id: 'G1' })}>
              <rect x="0" y="0" width="30" height="40" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" rx="4" />
              <line x1="0" y1="20" x2="30" y2="20" stroke="#3b82f6" strokeWidth="3" />
              <text x="15" y="-5" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">HEAD</text>
            </g>

            {/* Canal Gates (G2-G5) placed on offtakes */}
            <g transform="translate(185, 135)" className="cursor-pointer" onClick={() => setSelectedNode({ type: 'gate', id: 'G2' })}>
              <circle cx="15" cy="15" r="10" fill="#0f172a" stroke="#0284c7" strokeWidth="2" />
              <rect x="12" y="8" width="6" height="14" fill="#38bdf8" />
            </g>
            <g transform="translate(335, 135)" className="cursor-pointer" onClick={() => setSelectedNode({ type: 'gate', id: 'G3' })}>
              <circle cx="15" cy="15" r="10" fill="#0f172a" stroke="#0284c7" strokeWidth="2" />
              <rect x="12" y="8" width="6" height="14" fill="#38bdf8" />
            </g>
            <g transform="translate(485, 135)" className="cursor-pointer" onClick={() => setSelectedNode({ type: 'gate', id: 'G4' })}>
              <circle cx="15" cy="15" r="10" fill="#0f172a" stroke="#0284c7" strokeWidth="2" />
              <rect x="12" y="8" width="6" height="14" fill="#38bdf8" />
            </g>
            <g transform="translate(785, 135)" className="cursor-pointer" onClick={() => setSelectedNode({ type: 'gate', id: 'G5' })}>
              <circle cx="15" cy="15" r="10" fill="#0f172a" stroke="#e11d48" strokeWidth="2" />
              <rect x="12" y="8" width="6" height="14" fill="#f43f5e" />
            </g>

            {/* Village Nodes on Map */}
            {villages.map((v) => {
              const pos = mapPoints.villages[v.id as keyof typeof mapPoints.villages];
              if (!pos) return null;
              const isDry = v.soilMoisture < 35;
              const nodeColor = isDry ? '#f59e0b' : '#10b981';

              return (
                <g 
                  key={v.id} 
                  transform={`translate(${pos.x}, ${pos.y})`} 
                  className="cursor-pointer group"
                  onClick={() => setSelectedNode({ type: 'village', id: v.id })}
                >
                  <circle cx="0" cy="0" r="16" fill="#1e293b" stroke={nodeColor} strokeWidth="3" className="transition-all group-hover:scale-110" />
                  <text cx="0" cy="0" dy="4" fill="#fff" fontSize="10" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">{v.id}</text>
                  <text cx="0" cy="0" dy="30" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    {v.name}
                  </text>
                </g>
              );
            })}

            {/* Active Emergency markers */}
            {emergencies.map((e, idx) => {
              // Convert coordinate percentages to SVG coordinates
              const svgX = (e.coordinates.x / 100) * 750 + 80;
              const svgY = (e.coordinates.y / 100) * 160 + 50;

              return (
                <g 
                  key={e.id || idx} 
                  transform={`translate(${svgX}, ${svgY})`} 
                  className="cursor-pointer"
                  onClick={() => setSelectedNode({ type: 'emergency', id: e.id })}
                >
                  <circle cx="0" cy="0" r="12" fill="#991b1b" fillOpacity="0.4" className="animate-ping" />
                  <circle cx="0" cy="0" r="6" fill="#f43f5e" stroke="#fff" strokeWidth="1.5" />
                  <path d="M-4,-15 L4,-15 L0,-24 Z" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex gap-4 justify-center items-center text-[10px] text-slate-500 font-mono border-t border-slate-800 pt-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-emerald-500" />
            <span>Optimal Soil (&gt;35%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-amber-500" />
            <span>Stressed Soil (&lt;35%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-blue-500" />
            <span>SCADA Regulator Gate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>SOS Breach Alert</span>
          </div>
        </div>
      </div>

      {/* Details Box */}
      <div className="bg-slate-950 rounded-lg p-3.5 border border-slate-800 flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-bold text-white mb-0.5 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            Telemetry Node Inspector
          </h3>
          <p className="text-[10px] text-slate-500 font-mono mb-3">Click any node on the maps, gates, or SOS flags to inspect sensors</p>
          
          {selectedNode ? (
            getSelectedDetails()
          ) : (
            <div className="border border-dashed border-slate-800 p-6 rounded-lg text-center flex flex-col items-center justify-center space-y-2.5 h-64 text-slate-500">
              <MapPin className="w-8 h-8 text-slate-700" />
              <p className="text-xs">No active node selected for SCADA inspection.</p>
              <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800/40">Select V1-V5, radial gates, or red SOS targets</span>
            </div>
          )}
        </div>

        {selectedNode && (
          <div className="bg-slate-900/40 p-2.5 border border-slate-800/50 rounded-lg text-[9px] font-mono text-slate-500 flex items-center justify-between mt-3">
            <span>UPSTREAM INFLOW: 120 m³/s</span>
            <ArrowRight className="w-3 h-3 text-cyan-500" />
            <span>DISPATCH EFFICIENCY: 94.2%</span>
          </div>
        )}
      </div>
    </div>
  );
}

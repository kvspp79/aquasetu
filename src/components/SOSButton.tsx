import React, { useState, useEffect } from 'react';
import { AlertOctagon, X, MapPin, Send, AlertTriangle, ShieldCheck, Activity, ShieldAlert, Volume2, Globe } from 'lucide-react';
import { EmergencyReport } from '../types';

interface SOSButtonProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (report: Partial<EmergencyReport>) => void;
}

export default function SOSButton({ isOpen, onClose, onSubmitReport }: SOSButtonProps) {
  const [reportType, setReportType] = useState<EmergencyReport['type']>('Canal Breach');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<EmergencyReport['priority']>('High');
  const [description, setDescription] = useState('');
  const [coordinates, setCoordinates] = useState({ x: 50, y: 50 });
  const [isSuccess, setIsSuccess] = useState(false);
  const [telemetryNoise, setTelemetryNoise] = useState(0.85);

  const reportTypes: EmergencyReport['type'][] = [
    'Canal Breach',
    'Flood',
    'Illegal Diversion',
    'Water Theft',
    'Gate Failure',
    'Canal Blockage',
    'Dam Emergency'
  ];

  // Synthesize sound effects to make the action physically real & satisfying
  const playCues = (type: 'open' | 'success') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (type === 'open') {
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.03, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.15);
        });
      } else {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.4);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch (e) {
      console.warn("Audio cue playback blocked or unsupported by browser sandbox:", e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      playCues('open');
    }
  }, [isOpen]);

  // Minor fluctuations in telemetry coordinates
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTelemetryNoise(prev => Math.min(1.0, Math.max(0.6, prev + (Math.random() - 0.5) * 0.05)));
    }, 1500);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleMapCoordClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setCoordinates({ x, y });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !description) return;

    const newReport: Partial<EmergencyReport> = {
      type: reportType,
      location,
      priority,
      description,
      coordinates,
      status: 'Reported',
      reportedAt: new Date().toISOString()
    };

    onSubmitReport(newReport);
    playCues('success');
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      // Clear form
      setLocation('');
      setDescription('');
    }, 2800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-950/85 backdrop-blur-xl transition-all duration-300">
      <div 
        id="sos-modal-container"
        className="bg-slate-900 border-2 border-rose-500/30 rounded-xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl shadow-rose-950/30 font-sans relative"
      >
        {/* Subtle grid pattern background overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-20 pointer-events-none rounded-xl" />

        {/* Official Header */}
        <div className="relative z-10 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 px-6 py-5 border-b border-rose-500/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-rose-600 p-2.5 rounded-lg text-white shadow-lg shadow-rose-600/20 animate-pulse">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold tracking-widest text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/25 uppercase font-mono">
                  Priority Dispatch Terminal
                </span>
                <span className="text-[9px] font-bold text-slate-500 font-mono">
                  NWIC System ID: CAD-712-A
                </span>
              </div>
              <h2 className="text-base font-extrabold text-white tracking-tight mt-0.5">
                Jal Shakti Emergency SOS Command Console
              </h2>
              <p className="text-[10px] text-slate-400 font-medium">
                Official Telemetry Portal for 100-Village Canal Infrastructure System (₹100 Crore Budget Area)
              </p>
            </div>
          </div>
          <button 
            id="close-sos-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 p-2 rounded-lg border border-slate-700 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="relative z-10 p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-400 p-4 rounded-full animate-bounce shadow-xl shadow-emerald-950/20">
              <ShieldCheck className="w-12 h-12" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">Emergency Dispatch Sequence Initiated</h3>
              <p className="text-emerald-400 font-mono text-[10px] uppercase tracking-wider font-bold">
                Incident Stored and Synced with Server Database
              </p>
            </div>
            <p className="text-slate-400 text-xs max-w-md leading-relaxed">
              Live coordinates synchronized. SCADA safety override protocols triggered for local gates. District Collector, canal maintenance crew, and telemetry team are alerted on priority.
            </p>
            <div className="pt-4 flex items-center gap-2 text-slate-500 text-[10px] font-mono">
              <Activity className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> Resolving automatic telemetry sensors...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative z-10 p-6 md:p-8 space-y-6 text-slate-200">
            {/* National Directives Disclaimer */}
            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-rose-400 uppercase">Indian Irrigation Directive Sec 44 (PIM Rule)</span>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  Reporting an emergency triggers real-time legal diversion overrides and logs physical water balance debts on the central grid database. Sensor measurements and farmer allocations will react dynamically on the server.
                </p>
              </div>
            </div>

            {/* Main Fields Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column - 7/12 width */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <label htmlFor="sos-report-type" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">
                    Incident Category
                  </label>
                  <select
                    id="sos-report-type"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as EmergencyReport['type'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-semibold transition-all cursor-pointer"
                  >
                    {reportTypes.map((type) => (
                      <option key={type} value={type}>{type} &mdash; Emergency</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="sos-location" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">
                      Precise Canal Segment Location
                    </label>
                    <input
                      type="text"
                      id="sos-location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Rampur Regulator Km 5.2"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 placeholder:text-slate-600 font-semibold"
                    />
                  </div>

                  <div>
                    <label htmlFor="sos-priority" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">
                      Priority Level
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                      {(['Low', 'Medium', 'High', 'Critical'] as EmergencyReport['priority'][]).map((level) => {
                        const priorityColors = {
                          Low: 'border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-700',
                          Medium: 'border-amber-500/20 text-amber-500 hover:bg-amber-500/10',
                          High: 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10',
                          Critical: 'border-rose-500/40 bg-rose-950/20 text-rose-400 hover:bg-rose-950/40'
                        };
                        const activeColors = {
                          Low: 'bg-slate-800 border-slate-600 text-white',
                          Medium: 'bg-amber-500 border-amber-500 text-amber-950 font-black',
                          High: 'bg-orange-500 border-orange-500 text-slate-950 font-black',
                          Critical: 'bg-rose-600 border-rose-500 text-white font-black'
                        };

                        const isSelected = priority === level;
                        return (
                          <button
                            key={level}
                            type="button"
                            id={`priority-btn-${level}`}
                            onClick={() => setPriority(level)}
                            className={`py-2 rounded-md text-[10px] font-bold border transition-all duration-150 cursor-pointer text-center uppercase tracking-wider ${
                              isSelected ? activeColors[level] : priorityColors[level]
                            }`}
                          >
                            {level}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="sos-desc" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">
                    Physical Signs, Sensor Anomalies &amp; Evidence Description
                  </label>
                  <textarea
                    id="sos-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Provide details of water leakage, mechanical gate blockages, or illegal diversions. Include current approximate water loss rates and local visual indicators..."
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 placeholder:text-slate-600 leading-relaxed font-semibold"
                  />
                </div>
              </div>

              {/* Right Column - GIS Interactive Map / GIS telemetries - 5/12 width */}
              <div className="lg:col-span-5 flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    Canal Grid GIS Positioning
                  </span>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-1.5 py-0.5 rounded">
                    <Volume2 className="w-3 h-3 text-cyan-400" /> Audio Cue Active
                  </div>
                </div>

                <div 
                  onClick={handleMapCoordClick}
                  className="flex-1 bg-slate-950 rounded-lg relative overflow-hidden border border-slate-800 cursor-crosshair min-h-[220px] transition-all hover:border-slate-700 select-none shadow-inner"
                >
                  {/* Map Grid Background */}
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-10 pointer-events-none">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className="border border-white" />
                    ))}
                  </div>

                  {/* Canal Diagonal Flow Line */}
                  <div className="absolute top-1/3 left-0 w-[140%] h-12 bg-sky-500/10 border-y border-sky-400/20 rotate-12 -translate-x-12 pointer-events-none flex items-center justify-center">
                    <span className="text-[8px] font-mono tracking-widest text-sky-400 font-extrabold uppercase select-none opacity-40 animate-pulse">
                      MAIN FEEDER CANAL PIPELINE ZONE &bull; CAD FLOW
                    </span>
                  </div>

                  {/* Real-time Dynamic Pin */}
                  <div 
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none transition-all duration-300 ease-out"
                    style={{ left: `${coordinates.x}%`, top: `${coordinates.y}%` }}
                  >
                    {/* Ring Pulse Effect */}
                    <span className="absolute w-10 h-10 bg-rose-500/30 rounded-full animate-ping pointer-events-none" />
                    <MapPin className="w-6 h-6 text-rose-500 fill-rose-500 drop-shadow-lg" />
                    <span className="bg-rose-950/90 text-rose-200 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-rose-500/40 mt-1 shadow-md whitespace-nowrap">
                      X: {coordinates.x} | Y: {coordinates.y}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-[9px] text-slate-400 bg-slate-900/95 p-2.5 rounded-md border border-slate-800 pointer-events-none space-y-1 font-mono">
                    <div className="flex justify-between font-bold text-rose-400">
                      <span>TELEMETRY STRENGTH</span>
                      <span>{(telemetryNoise * 100).toFixed(0)}% (ONLINE)</span>
                    </div>
                    <div className="text-slate-500 leading-normal">
                      Click anywhere inside this GIS layout grid to map high-accuracy coordinates dynamically.
                    </div>
                  </div>
                </div>

                {/* Additional real-world metrics to show ₹100Cr scale */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800 font-mono text-[10px]">
                  <div>
                    <span className="text-slate-500 block uppercase font-bold text-[8px]">Network Flow Lock</span>
                    <span className="text-white font-extrabold uppercase">AUTO OVERRIDE LOCK</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-bold text-[8px]">Linked Reservoirs</span>
                    <span className="text-cyan-400 font-extrabold uppercase">NRLD SECTOR-4</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 justify-end pt-4 border-t border-slate-800">
              <button
                type="button"
                id="cancel-sos-btn"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="submit-sos-btn"
                className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs px-6 py-2.5 rounded-lg shadow-lg shadow-rose-600/10 flex items-center gap-2 transition-all cursor-pointer border border-rose-500/40 uppercase tracking-wider"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Incident to NWIC Central Desk
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

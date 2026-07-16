import { useState, useEffect } from 'react';
import { 
  AlertTriangle, Gauge, Sprout, Building2, Activity, ChevronRight, Sparkles, 
  Plus, RefreshCw, FileText, CheckCircle2, X, ShieldCheck, ShieldAlert, Database, 
  Sliders, Send, AlertOctagon, HelpCircle, MapPin, BarChart3, Info, Calendar, BellRing,
  FastForward
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, LineChart, Line, Cell, PieChart, Pie
} from 'recharts';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import HomePortal from './components/HomePortal';
import Onboarding from './components/Onboarding';
import SOSButton from './components/SOSButton';
import CropAdvisorBot from './components/CropAdvisorBot';
import RiverMap from './components/RiverMap';
import PipelineVisualizer from './components/PipelineVisualizer';
import SoilHealthVisualizer from './components/SoilHealthVisualizer';
import ThreeBackground from './components/ThreeBackground';
import { Language, translations } from './lib/translations';
import { Droplets } from 'lucide-react';

import { 
  initialGates, initialReservoir, 
  initialEmergencyReports, sampleDecisionLogs, historicalUsageData, villageDeficitData 
} from './data/mockData';
import { generate100Villages, generateHistoricalUsage, cropAdvisoryDb } from './data/extendedData';
import { Village, CanalGate, Reservoir, Allocation, EmergencyReport, DecisionLog } from './types';

export default function App() {
  const [currentRole, setCurrentRole] = useState<string>('canal_officer');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isSosOpen, setIsSosOpen] = useState<boolean>(false);
  
  // Onboarding & Language System
  const [language, setLanguage] = useState<Language | null>(null);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);

  // Core 100 Villages Data Model & Historical Usage
  const [villages, setVillages] = useState<Village[]>(() => generate100Villages());
  const [historicalUsage, setHistoricalUsage] = useState<any[]>(() => generateHistoricalUsage(generate100Villages()));
  
  // Custom interactive notifications / advisories
  const [notices, setNotices] = useState<{ id: string; title: string; blockId: string; message: string; date: string }[]>([
    { id: 'N-1', title: 'Rotational Gravity Releases scheduled', blockId: 'All', message: 'Main feeder gate aperture scheduled to widen by 15%. Rotational flow guarantees tail-end blocks receive supply.', date: '2026-07-15' },
    { id: 'N-2', title: 'Critical Moisture Transpiration warning', blockId: 'BL-120', message: 'Soil moisture tension is close to permanent wilting threshold (35%). Supplementary allocations requested.', date: '2026-07-15' }
  ]);

  // Form states for broadcasting notices
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeBlock, setNewNoticeBlock] = useState('All');
  const [newNoticeMsg, setNewNoticeMsg] = useState('');

  // Secure Farmer Storage (Visible only to Admin)
  const [registeredFarmers, setRegisteredFarmers] = useState<any[]>([
    { name: 'Baldev Singh Dhillon', villageId: 'BL-102', villageName: 'Rampur Sector B', landHectares: 12.5, cropType: 'Basmati Rice', contact: '+91 94120 44521' },
    { name: 'Satnam Ram', villageId: 'BL-108', villageName: 'Fazilka Sub-block 1', landHectares: 4.2, cropType: 'Wheat', contact: '+91 98881 33220' }
  ]);

  // Simulation Calendar system date state
  const [systemDate, setSystemDate] = useState<string>('2026-07-15');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const [gates, setGates] = useState<CanalGate[]>(initialGates);
  const [reservoir, setReservoir] = useState<Reservoir>(initialReservoir);
  
  // Map allocations dynamically to all 100 villages
  const [allocations, setAllocations] = useState<Allocation[]>(() => {
    const vList = generate100Villages();
    return vList.map((v, idx) => ({
      id: `A-${100 + idx}`,
      villageId: v.id,
      villageName: v.name,
      allocatedAmount: Math.round(v.waterDemand * 0.8),
      requestedAmount: v.waterDemand,
      timeSlot: idx % 2 === 0 ? '06:00 AM - 12:00 PM' : '12:00 PM - 06:00 PM',
      status: 'Approved',
      reason: `Automated Nash Equilibrium coefficient allocation based on ${v.cropType} stage of growth at ${v.soilMoisture}% moisture.`
    }));
  });

  const [emergencies, setEmergencies] = useState<EmergencyReport[]>(initialEmergencyReports);
  const [decisionLogs, setDecisionLogs] = useState<DecisionLog[]>(sampleDecisionLogs);

  // Form states for simulations or modifications
  const [customInflow, setCustomInflow] = useState<number>(120);
  const [customOutflow, setCustomOutflow] = useState<number>(85);
  const [customStorage, setCustomStorage] = useState<number>(312.4);

  // Daily Morning Work Flow Simulator state variables (by kvsp praneeth)
  const [workflowScenario, setWorkflowScenario] = useState<'normal' | 'drought'>('normal');
  const [workflowStep, setWorkflowStep] = useState<number>(1);
  const [selectedComplainant, setSelectedComplainant] = useState<string>('V4');
  const [auditResponse, setAuditResponse] = useState<string>('');

  // AI allocation generation states
  const [isRunningAi, setIsRunningAi] = useState<boolean>(false);
  const [aiReport, setAiReport] = useState<{ summary: string; giniIndex: number } | null>(null);

  // Farmer specific filter (BL-101 corresponds to our 100-village list)
  const [selectedFarmerVillage, setSelectedFarmerVillage] = useState<string>('BL-101');

  // Interactive Crop Calculator states
  const [calcHectares, setCalcHectares] = useState<number>(2.5);
  const [calcCrop, setCalcCrop] = useState<string>('Basmati Rice');

  // Interactive Academy States
  const [selectedAcademyTopic, setSelectedAcademyTopic] = useState<number>(0);
  const [academyConservationAwareness, setAcademyConservationAwareness] = useState<number>(65);
  const [academyCanalSeepagePct, setAcademyCanalSeepagePct] = useState<number>(25);
  const [academyReservoirOutflow, setAcademyReservoirOutflow] = useState<number>(120);
  const [academyRooftopArea, setAcademyRooftopArea] = useState<number>(150);
  const [academyForestCover, setAcademyForestCover] = useState<number>(40);
  const [academyTubeWellDepth, setAcademyTubeWellDepth] = useState<number>(180);
  const [academyIrrigationType, setAcademyIrrigationType] = useState<string>('Drip');
  const [academyRiceMethod, setAcademyRiceMethod] = useState<string>('AWD');
  const [academyEmbankmentHeight, setAcademyEmbankmentHeight] = useState<number>(3.5);
  const [academyMulchApplied, setAcademyMulchApplied] = useState<boolean>(true);

  // Grievance Contact form states
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactVillage, setContactVillage] = useState('V1');
  const [grievanceCategory, setGrievanceCategory] = useState('Water Over-Abstraction');
  const [grievanceMsg, setGrievanceMsg] = useState('');
  const [grievanceReceipt, setGrievanceReceipt] = useState<string | null>(null);

  // Unified, high-frequency telemetry & simulated-date background synchronization
  useEffect(() => {
    if (!isOnboarded) return;
    
    const synchronizeState = async () => {
      try {
        // 1. Sync simulation calendar date (advanced automatically by backend worker)
        const dateRes = await fetch('/api/system-date');
        if (dateRes.ok) {
          const dateData = await dateRes.json();
          if (dateData.date !== systemDate) {
            setSystemDate(dateData.date);
            
            // Advance regional soil moisture depletion across the 100-village simulation
            setVillages(prev => prev.map(v => {
              const transpirationLoss = Math.floor(Math.random() * 3) + 1; // 1-3% daily transpiration drop
              return {
                ...v,
                soilMoisture: Math.max(12, v.soilMoisture - transpirationLoss),
                priorityScore: Math.min(99, v.priorityScore + (v.soilMoisture < 35 ? 4 : 1))
              };
            }));

            setReservoir(prev => ({
              ...prev,
              currentStorage: Number(Math.max(50, prev.currentStorage - 1.2).toFixed(1))
            }));

            showToast(`[AquaSetu Network Sync] Simulated date advanced to ${dateData.date}. Ground moisture telemetry updated.`);
          }
        }

        // 2. Sync emergencies in real time to fetch automatic backend state transitions
        const emergencyRes = await fetch('/api/emergencies');
        if (emergencyRes.ok) {
          const emergencyData = await emergencyRes.json();
          setEmergencies(emergencyData);
        }
      } catch (err) {
        console.warn("Telemetry synchronization interval failed:", err);
      }
    };

    // Run synchronization immediately and schedule on high-fidelity interval
    synchronizeState();
    const syncInterval = setInterval(synchronizeState, 4000);
    return () => clearInterval(syncInterval);
  }, [isOnboarded, systemDate]);

  // Handle reporting a new Emergency via SOS button
  const handleAddEmergencyReport = async (report: Partial<EmergencyReport>) => {
    try {
      const res = await fetch('/api/emergencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
      if (res.ok) {
        const freshReport = await res.json();
        setEmergencies(prev => [...prev, freshReport]);
      } else {
        throw new Error('Failed to post emergency to Express API');
      }
    } catch (err) {
      console.warn("Express API failed, caching emergency locally in state:", err);
      // Fallback local append
      const localReport: EmergencyReport = {
        id: `E${emergencies.length + 1}`,
        type: report.type || 'Canal Breach',
        location: report.location || 'Unknown location',
        priority: report.priority || 'High',
        description: report.description || '',
        coordinates: report.coordinates || { x: 50, y: 50 },
        reportedAt: report.reportedAt || new Date().toISOString(),
        status: 'Reported'
      };
      setEmergencies(prev => [...prev, localReport]);
    }
  };

  // Run the AI allocation optimization engine (calls Express API under the hood)
  const handleTriggerAiAllocation = async () => {
    setIsRunningAi(true);
    setAiReport(null);

    // Prepare payload
    const payload = {
      villages: villages,
      inflowRate: customInflow,
      totalDemand: villages.reduce((acc, v) => acc + v.waterDemand, 0)
    };

    try {
      const res = await fetch('/api/allocate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const responseData = await res.json();
      if (responseData.success) {
        const { summary, giniIndex, allocations: allocatedList } = responseData.data;
        setAiReport({ summary, giniIndex });

        // Merge newly computed allocations back into state
        const updatedAllocations = allocations.map(orig => {
          const match = allocatedList.find((x: any) => x.villageId === orig.villageId);
          if (match) {
            return {
              ...orig,
              allocatedAmount: match.allocatedAmount,
              reason: match.reason,
              status: 'Draft' as const // Marked as draft until officer clicks Approve
            };
          }
          return orig;
        });
        setAllocations(updatedAllocations);

        // Add a new system decision log
        const newLog: DecisionLog = {
          id: `DL-${Math.floor(Math.random() * 9000) + 1000}`,
          timestamp: new Date().toLocaleString(),
          inputSummary: `Inflow: ${customInflow} m³/s | Adjusted reservoir parameters | Dry cycles verified`,
          optimizationObjective: `Nash Bargaining Co-op + Gini Fairness Framework (Source: ${responseData.source})`,
          explainabilityText: summary,
          fairnessIndex: giniIndex,
          approvedBy: 'AI Proposed'
        };
        setDecisionLogs(prev => [newLog, ...prev]);
      } else {
        throw new Error('Allocation endpoint failed');
      }
    } catch (err) {
      console.error("AI allocator failed:", err);
    } finally {
      setIsRunningAi(false);
    }
  };

  // Approve draft schedules
  const handleApproveSchedules = () => {
    // Approve all Draft allocations
    const approved = allocations.map(a => ({ ...a, status: 'Approved' as const }));
    setAllocations(approved);

    // Dynamically adjust village water debt in local state (balancing and credit updates)
    const updatedVillages = villages.map(v => {
      const match = approved.find(a => a.villageId === v.id);
      if (match) {
        const change = match.allocatedAmount - match.requestedAmount;
        return {
          ...v,
          waterDebt: v.waterDebt + change
        };
      }
      return v;
    });
    setVillages(updatedVillages);

    // Update gates target flow rate based on allocations
    const updatedGates = gates.map((gate, idx) => {
      if (idx === 0) return gate; // Headworks main regulator stays constant
      const vMatch = approved[idx - 1]; // Match V1-V4 to G2-G5
      if (vMatch) {
        const calculatedDischarge = Number((vMatch.allocatedAmount / 3600).toFixed(1)); // m³/s conversion roughly
        return {
          ...gate,
          targetFlowRate: calculatedDischarge,
          gateOpeningPercent: Math.min(100, Math.round((calculatedDischarge / 25) * 100))
        };
      }
      return gate;
    });
    setGates(updatedGates);
  };

  // Adjust SCADA gates directly (Override sliders)
  const handleGateSliderChange = (gateId: string, value: number) => {
    const updated = gates.map(g => {
      if (g.id === gateId) {
        const computedFlow = Number(((value / 100) * 25).toFixed(1)); // max capacity roughly 25 m3/s
        return {
          ...g,
          gateOpeningPercent: value,
          currentFlowRate: computedFlow,
          status: value === 0 ? 'Closed' as const : value === 100 ? 'Open' as const : 'Throttled' as const
        };
      }
      return g;
    });
    setGates(updated);
  };

  // Update incident ticket status
  const handleEmergencyStatusChange = (id: string, nextStatus: 'Assigned' | 'Resolved') => {
    const updated = emergencies.map(e => e.id === id ? { ...e, status: nextStatus } : e);
    setEmergencies(updated);
  };

  // Contact Grievance submission
  const handleFileGrievance = (e: any) => {
    e.preventDefault();
    if (!contactName || !grievanceMsg) return;

    const receiptId = `JAL-${Math.floor(Math.random() * 9000) + 1000}-2026`;
    setGrievanceReceipt(receiptId);
  };

  // Dynamic Simulation Calendar Change
  const handleAdvanceDate = async () => {
    try {
      const res = await fetch('/api/system-date/advance', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setSystemDate(data.date);
        
        // Transpiration moisture depletion across the 100 blocks
        setVillages(prev => prev.map(v => {
          const loss = Math.floor(Math.random() * 3) + 1; // 1-3% daily transpiration loss
          return {
            ...v,
            soilMoisture: Math.max(12, v.soilMoisture - loss),
            priorityScore: Math.min(99, v.priorityScore + (v.soilMoisture < 35 ? 4 : 1))
          };
        }));

        setReservoir(prev => ({
          ...prev,
          currentStorage: Number(Math.max(50, prev.currentStorage - 1.2).toFixed(1))
        }));

        showToast(`Simulation calendar advanced to ${data.date}. Crop transpiration indices refreshed!`);
      }
    } catch (err) {
      // Fallback
      const d = new Date(systemDate);
      d.setDate(d.getDate() + 1);
      const nextDateStr = d.toISOString().split('T')[0];
      setSystemDate(nextDateStr);
      
      setVillages(prev => prev.map(v => {
        const loss = Math.floor(Math.random() * 3) + 1;
        return {
          ...v,
          soilMoisture: Math.max(12, v.soilMoisture - loss),
          priorityScore: Math.min(99, v.priorityScore + (v.soilMoisture < 35 ? 4 : 1))
        };
      }));
      
      setReservoir(prev => ({
        ...prev,
        currentStorage: Number(Math.max(50, prev.currentStorage - 1.2).toFixed(1))
      }));
      
      showToast(`Calendar advanced to ${nextDateStr}. Transpiration applied!`);
    }
  };

  if (!isOnboarded || language === null) {
    return (
      <Onboarding 
        villagesList={villages}
        onComplete={(lang, profile) => {
          setLanguage(lang);
          setIsOnboarded(true);
          if (profile) {
            setRegisteredFarmers(prev => {
              // Deduplicate if already exists
              const filtered = prev.filter(f => f.contact !== profile.contact);
              return [...filtered, profile];
            });
            setSelectedFarmerVillage(profile.villageId);
          }
          showToast(`Welcome! Registered profile for ${profile?.name} on Block ${profile?.villageId}.`);
        }}
      />
    );
  }

  const activeT = translations[language] || translations.en;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#faf6e8] via-[#fffbf2]/95 to-[#fdf8eb]/90 flex flex-col font-sans select-none antialiased relative text-amber-950">
      <ThreeBackground />
      {/* Interactive Top Navbar */}
      <Navbar 
        currentRole={currentRole} 
        onChangeRole={setCurrentRole} 
        activeSosCount={emergencies.filter(e => e.status !== 'Resolved').length}
        onOpenSosModal={() => setIsSosOpen(true)}
        currentLanguage={language}
        onChangeLanguage={setLanguage}
        systemDate={systemDate}
        onAdvanceDate={handleAdvanceDate}
      />

      {/* Main Structural Frame */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} currentRole={currentRole} currentLanguage={language} />

        {/* Action Stage / Workspace */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-64px)] bg-transparent text-amber-950 space-y-4">
          
          {activeTab === 'home' && (
            <HomePortal onSelectTab={setActiveTab} activeSosCount={emergencies.filter(e => e.status !== 'Resolved').length} currentLanguage={language || 'en'} />
          )}

          {activeTab === 'decision_engine' && (
            <div className="space-y-6">
              {/* Header block with creator signature */}
              <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-white">AI Decision Optimization Grid</h2>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">Morning Inflow Forecasting, Legal Constraint Verification, and Nash-Bargaining Scarcity Resolution</p>
                </div>
                <div className="bg-slate-900/60 border border-cyan-500/10 px-3 py-1.5 rounded-lg flex items-center gap-2 text-[10px] font-mono text-cyan-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Designed &amp; Verified by kvsp praneeth
                </div>
              </div>

              {/* Dynamic Operational Scenario Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  id="btn-select-normal-scenario"
                  onClick={() => {
                    setWorkflowScenario('normal');
                    setWorkflowStep(1);
                    setAuditResponse('');
                  }}
                  className={`relative p-5 rounded-xl border text-left transition-all duration-300 overflow-hidden cursor-pointer ${
                    workflowScenario === 'normal'
                      ? 'bg-cyan-950/20 border-cyan-500/40 shadow-xl shadow-cyan-500/5'
                      : 'bg-slate-900/10 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-mono font-bold bg-cyan-900/40 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded uppercase">
                        Scenario Alpha
                      </span>
                      <h4 className="text-sm font-black text-white mt-1.5 uppercase tracking-wide">Standard Morning Release</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                        Normal catchment water discharge. Surplus water available for both domestic, high-stress agriculture, and industrial operations.
                      </p>
                    </div>
                    <span className="text-xl">☀️</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span>Forecast Range: <b className="text-cyan-400">120 - 150 m³/s</b></span>
                    <span className="text-emerald-400 font-bold">100% Demand Served</span>
                  </div>
                </button>

                <button
                  id="btn-select-drought-scenario"
                  onClick={() => {
                    setWorkflowScenario('drought');
                    setWorkflowStep(1);
                    setAuditResponse('');
                  }}
                  className={`relative p-5 rounded-xl border text-left transition-all duration-300 overflow-hidden cursor-pointer ${
                    workflowScenario === 'drought'
                      ? 'bg-amber-950/20 border-amber-500/40 shadow-xl shadow-amber-500/5'
                      : 'bg-slate-900/10 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-mono font-bold bg-amber-900/40 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded uppercase">
                        Scenario Beta
                      </span>
                      <h4 className="text-sm font-black text-white mt-1.5 uppercase tracking-wide">Engineered Drought Week</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                        Severe upstream scarcity. Heavy rotational rationing triggered. Hard legal constraints protect domestic drinking water first.
                      </p>
                    </div>
                    <span className="text-xl">🔥</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span>Forecast Range: <b className="text-amber-400">40 - 60 m³/s</b></span>
                    <span className="text-rose-400 font-bold">Rotational Rationing Active</span>
                  </div>
                </button>
              </div>

              {/* 4-Step Morning Work Flow Simulator Board */}
              <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 md:p-6 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none" />
                
                {/* Visual Step Tracker Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-cyan-400" />
                      Daily Morning Decision-Support Board
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">Interact with the real morning verification loop used by SCADA Canal Officers</p>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-850">
                    {[1, 2, 3, 4].map((stepNum) => (
                      <button
                        key={stepNum}
                        onClick={() => setWorkflowStep(stepNum)}
                        className={`w-7 h-7 rounded-md text-[10px] font-black font-mono transition-all duration-300 ${
                          workflowStep === stepNum
                            ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                            : workflowStep > stepNum
                            ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/10'
                            : 'bg-slate-900 text-slate-500 border border-transparent'
                        }`}
                      >
                        {stepNum}
                      </button>
                    ))}
                  </div>
                </div>

                {/* STEP 1: MORNING INFLOW FORECAST RANGE */}
                {workflowStep === 1 && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center py-2 animate-fadeIn">
                    <div className="lg:col-span-5 space-y-3">
                      <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2 py-1 rounded">
                        STEP 1: METEOROLOGICAL TELEMETRY
                      </span>
                      <h4 className="text-base font-extrabold text-white">Daily Inflow Forecast Confidence Range</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">
                        Rather than relying on a single estimated guess, the river system models water head inflows inside a confidence interval. The safety and legal priority layer is mathematically locked against the <b>pessimistic (worst-case)</b> bound to guarantee system solvency.
                      </p>
                      
                      <div className="bg-slate-950/50 border border-slate-850 p-4 rounded-xl space-y-2.5">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-slate-500">Pessimistic Forecast:</span>
                          <span className="text-white font-extrabold">{workflowScenario === 'normal' ? '120 m³/s' : '40 m³/s'}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-slate-500">Optimistic Forecast:</span>
                          <span className="text-white font-extrabold">{workflowScenario === 'normal' ? '150 m³/s' : '60 m³/s'}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden relative">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${
                              workflowScenario === 'normal' ? 'from-cyan-500 to-cyan-300' : 'from-amber-500 to-amber-300'
                            }`}
                            style={{ width: workflowScenario === 'normal' ? '85%' : '35%' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-7 flex justify-center">
                      {/* Interactive visual forecast cylinder */}
                      <div className="relative w-full max-w-sm bg-slate-950/40 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-14 h-14 rounded-full bg-cyan-950/50 border border-cyan-500/20 flex items-center justify-center">
                          <Droplets className="w-7 h-7 text-cyan-400 animate-bounce" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Expected Grid Flow Today</span>
                          <h3 className={`text-xl font-black font-mono mt-1 ${
                            workflowScenario === 'normal' ? 'text-cyan-400' : 'text-amber-400'
                          }`}>
                            {workflowScenario === 'normal' ? '120 to 150 m³/s' : '40 to 60 m³/s'}
                          </h3>
                          <span className="text-[9px] text-slate-500 block font-mono mt-0.5">Confidence Rating: 94.6% (SCADA Radar Satellite Ingestion)</span>
                        </div>

                        <button
                          onClick={() => setWorkflowStep(2)}
                          className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-lg flex items-center gap-1.5 shadow-md shadow-cyan-500/15 uppercase cursor-pointer"
                        >
                          Step 2: Collect Claimant Bids
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: COLLECT BIDS */}
                {workflowStep === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-start flex-col sm:flex-row gap-2">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2 py-1 rounded">
                          STEP 2: AGRI-MUNICIPAL DEMAND
                        </span>
                        <h4 className="text-sm font-extrabold text-white mt-2">Active Claimant Submissions &amp; Telemetry Bids</h4>
                        <p className="text-[11px] text-slate-400">Real-time water requests submitted by administrative agencies and farmer water cooperatives (WUA).</p>
                      </div>
                      <span className="text-slate-500 text-xs font-mono">6 Claimants Registered</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Claimant Card 1 */}
                      <div className="bg-slate-950/40 border border-slate-850 p-3.5 rounded-lg space-y-2.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8.5px] font-mono font-bold text-blue-400 bg-blue-950/40 px-1.5 py-0.5 rounded">UTILITY</span>
                            <h5 className="text-xs font-bold text-white mt-1">Drinking Water Utility</h5>
                          </div>
                          <span className="text-xs font-black text-cyan-400 font-mono">25,000 m³</span>
                        </div>
                        <div className="text-[9.5px] text-slate-400 leading-normal">
                          Domestic drinking water allotment representing 1.2M citizens. Non-negotiable survival entitlement.
                        </div>
                      </div>

                      {/* Claimant Card 2 */}
                      <div className="bg-slate-950/40 border border-slate-850 p-3.5 rounded-lg space-y-2.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8.5px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded">IRRIGATION (V1)</span>
                            <h5 className="text-xs font-bold text-white mt-1">Rampur basmati Sector</h5>
                          </div>
                          <span className="text-xs font-black text-cyan-400 font-mono">32,000 m³</span>
                        </div>
                        <div className="text-[9.5px] text-slate-400 leading-normal">
                          Crop: <b>Basmati Rice</b> in <b>Flowering</b> stage (Extremely moisture-sensitive. Wilting risk if denied).
                        </div>
                      </div>

                      {/* Claimant Card 3 */}
                      <div className="bg-slate-950/40 border border-slate-850 p-3.5 rounded-lg space-y-2.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8.5px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded">IRRIGATION (V2)</span>
                            <h5 className="text-xs font-bold text-white mt-1">Kalyanpur Sugarcane</h5>
                          </div>
                          <span className="text-xs font-black text-cyan-400 font-mono">18,000 m³</span>
                        </div>
                        <div className="text-[9.5px] text-slate-400 leading-normal">
                          Crop: <b>Sugarcane</b> in <b>Vegetative Growth</b> stage. Soil moisture robust at 45% (High buffer capacity).
                        </div>
                      </div>

                      {/* Claimant Card 4 */}
                      <div className="bg-slate-950/40 border border-slate-850 p-3.5 rounded-lg space-y-2.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8.5px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded">IRRIGATION (V3)</span>
                            <h5 className="text-xs font-bold text-white mt-1">Shivpur Cotton</h5>
                          </div>
                          <span className="text-xs font-black text-cyan-400 font-mono">42,000 m³</span>
                        </div>
                        <div className="text-[9.5px] text-slate-400 leading-normal">
                          Crop: <b>Bt-Cotton</b> in <b>Yield Formation</b>. Soil moisture critical at <b>32%</b> (Acute transpiration stress).
                        </div>
                      </div>

                      {/* Claimant Card 5 */}
                      <div className="bg-slate-950/40 border border-slate-850 p-3.5 rounded-lg space-y-2.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8.5px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded">IRRIGATION (V4)</span>
                            <h5 className="text-xs font-bold text-white mt-1">Daulatpur Wheat</h5>
                          </div>
                          <span className="text-xs font-black text-cyan-400 font-mono">28,000 m³</span>
                        </div>
                        <div className="text-[9.5px] text-slate-400 leading-normal">
                          Crop: <b>Wheat</b> in <b>Sowing Prep</b>. Low moisture sensitivity. Localized 14mm rain forecasted.
                        </div>
                      </div>

                      {/* Claimant Card 6 */}
                      <div className="bg-slate-950/40 border border-slate-850 p-3.5 rounded-lg space-y-2.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8.5px] font-mono font-bold text-purple-400 bg-purple-950/40 px-1.5 py-0.5 rounded">INDUSTRIAL</span>
                            <h5 className="text-xs font-bold text-white mt-1">NTPC Thermal Power</h5>
                          </div>
                          <span className="text-xs font-black text-cyan-400 font-mono">15,000 m³</span>
                        </div>
                        <div className="text-[9.5px] text-slate-400 leading-normal">
                          Bulk flow request for secondary machinery cooling cycles. Non-survival baseline requirement.
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => setWorkflowStep(3)}
                        className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-lg flex items-center gap-1.5 shadow-md shadow-cyan-500/15 uppercase cursor-pointer"
                      >
                        Step 3: Run Legal Constraint Layer
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: RUN LEGAL CONSTRAINT LAYER */}
                {workflowStep === 3 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-start flex-col sm:flex-row gap-2">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2 py-1 rounded">
                          STEP 3: CONSTITUTIONAL GUARANTEES
                        </span>
                        <h4 className="text-sm font-extrabold text-white mt-2">Legal Priority &amp; Safety Constraint Layer</h4>
                        <p className="text-[11px] text-slate-400">The hard mathematical validation layer that guards domestic water before any other allocation can begin.</p>
                      </div>
                      <span className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" /> COMPLIANCE PASSED
                      </span>
                    </div>

                    <div className="bg-slate-950/60 border border-cyan-500/10 p-5 rounded-xl space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-cyan-950/50 p-2.5 rounded-lg border border-cyan-500/20 text-cyan-400 shrink-0">
                          <FastForward className="w-5 h-5 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <h5 className="text-xs font-bold text-white uppercase tracking-wide">Pessimistic Forecast Reserve Check</h5>
                          <p className="text-[11.5px] text-slate-300 leading-relaxed font-sans">
                            In general models, planners often gamble on optimistic forecasts. AquaSetu locks the drinking water priority to the <b>worst-case inflow parameter ({workflowScenario === 'normal' ? '120 m³/s' : '40 m³/s'})</b>. 
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-900">
                        <div className="bg-slate-900/30 p-3.5 rounded-lg border border-slate-850 flex justify-between items-center">
                          <div>
                            <span className="text-[8.5px] font-mono text-slate-500 uppercase block">Utility Requested</span>
                            <span className="text-sm font-black text-white font-mono">25,000 m³</span>
                          </div>
                          <span className="text-slate-500">→</span>
                          <div className="text-right">
                            <span className="text-[8.5px] font-mono text-emerald-400 uppercase block">Assured Priority Served</span>
                            <span className="text-sm font-black text-emerald-400 font-mono">25,000 m³ (100%)</span>
                          </div>
                        </div>

                        <div className="bg-slate-900/30 p-3.5 rounded-lg border border-slate-850 flex items-center gap-3">
                          <span className="text-2xl">🛡️</span>
                          <div>
                            <h5 className="text-[10px] font-mono font-bold text-cyan-300 uppercase">Constitutional Priority Safeguard</h5>
                            <p className="text-[9px] text-slate-400 mt-0.5 leading-normal">
                              Fully insulated from drought vector. Serving municipal needs is a rigid state directive, never a variable.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => setWorkflowStep(4)}
                        className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-lg flex items-center gap-1.5 shadow-md shadow-cyan-500/15 uppercase cursor-pointer"
                      >
                        Step 4: Resolve Scarcity Trade-offs
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: RUN MULTI-AGENT ALLOCATION OPTIMIZATION */}
                {workflowStep === 4 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-start flex-col sm:flex-row gap-2">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2 py-1 rounded">
                          STEP 4: COOPERATIVE GAME THEORY SOLVER
                        </span>
                        <h4 className="text-sm font-extrabold text-white mt-2">AI Nash-Equilibrium &amp; Scarcity Optimizer</h4>
                        <p className="text-[11px] text-slate-400">Allocates the remaining water volume among competing agricultural and industrial stakeholders based on crop growth stress.</p>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[10px] bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        <span className="text-slate-500">FAIRNESS INDEX:</span>
                        <span className="text-emerald-400 font-black">{workflowScenario === 'normal' ? '98%' : '93%'}</span>
                      </div>
                    </div>

                    {/* Final allocation table */}
                    <div className="overflow-x-auto rounded-lg border border-slate-850 bg-slate-950/60">
                      <table className="w-full text-left text-[11px] font-mono">
                        <thead>
                          <tr className="border-b border-slate-850 bg-slate-900/30 text-slate-500 font-bold uppercase text-[9px]">
                            <th className="p-3">CLAIMANT</th>
                            <th className="p-3">STAGE / STRESS</th>
                            <th className="p-3 text-right">BID DEMAND</th>
                            <th className="p-3 text-right">ALLOCATED FLOW</th>
                            <th className="p-3 text-right">DISPATCH FACTOR</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850 text-slate-300 font-semibold">
                          {/* Utility */}
                          <tr>
                            <td className="p-3">
                              <span className="text-blue-400 font-bold block">Drinking Water Utility</span>
                              <span className="text-[8.5px] text-slate-500">Municipal grid</span>
                            </td>
                            <td className="p-3 text-slate-400">Non-negotiable</td>
                            <td className="p-3 text-right text-slate-400">25,000 m³</td>
                            <td className="p-3 text-right text-emerald-400 font-black">25,000 m³</td>
                            <td className="p-3 text-right"><span className="bg-emerald-950 text-emerald-400 text-[8px] px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">100%</span></td>
                          </tr>

                          {/* Rampur Basmati */}
                          <tr>
                            <td className="p-3">
                              <span className="text-white font-bold block">Rampur basmati Sector (V1)</span>
                              <span className="text-[8.5px] text-slate-500">Basmati Rice</span>
                            </td>
                            <td className="p-3 text-amber-400">Flowering (High Stress)</td>
                            <td className="p-3 text-right text-slate-400">32,000 m³</td>
                            <td className="p-3 text-right text-cyan-400 font-black">{workflowScenario === 'normal' ? '32,000' : '22,400'} m³</td>
                            <td className="p-3 text-right">
                              <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${
                                workflowScenario === 'normal' ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/20' : 'bg-amber-950 text-amber-400 border border-amber-500/20'
                              }`}>
                                {workflowScenario === 'normal' ? '100%' : '70%'}
                              </span>
                            </td>
                          </tr>

                          {/* Kalyanpur Sugarcane */}
                          <tr>
                            <td className="p-3">
                              <span className="text-white font-bold block">Kalyanpur Sugarcane (V2)</span>
                              <span className="text-[8.5px] text-slate-500">Sugarcane crop</span>
                            </td>
                            <td className="p-3 text-slate-400">Vegetative (Moisture 45%)</td>
                            <td className="p-3 text-right text-slate-400">18,000 m³</td>
                            <td className="p-3 text-right text-cyan-400 font-black">{workflowScenario === 'normal' ? '18,000' : '9,000'} m³</td>
                            <td className="p-3 text-right">
                              <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${
                                workflowScenario === 'normal' ? 'bg-cyan-950 text-cyan-400' : 'bg-rose-950 text-rose-400'
                              }`}>
                                {workflowScenario === 'normal' ? '100%' : '50%'}
                              </span>
                            </td>
                          </tr>

                          {/* Shivpur Cotton */}
                          <tr>
                            <td className="p-3">
                              <span className="text-white font-bold block">Shivpur Cotton (V3)</span>
                              <span className="text-[8.5px] text-slate-500">Bt-Cotton</span>
                            </td>
                            <td className="p-3 text-red-400">Critical Wilting (Moisture 32%)</td>
                            <td className="p-3 text-right text-slate-400">42,000 m³</td>
                            <td className="p-3 text-right text-cyan-400 font-black">{workflowScenario === 'normal' ? '42,000' : '33,600'} m³</td>
                            <td className="p-3 text-right">
                              <span className="bg-cyan-950 text-cyan-400 text-[8px] px-1.5 py-0.5 rounded border border-cyan-500/20 font-bold">
                                {workflowScenario === 'normal' ? '100%' : '80%'}
                              </span>
                            </td>
                          </tr>

                          {/* Daulatpur Wheat */}
                          <tr>
                            <td className="p-3">
                              <span className="text-white font-bold block">Daulatpur Wheat (V4)</span>
                              <span className="text-[8.5px] text-slate-500">Wheat crop</span>
                            </td>
                            <td className="p-3 text-slate-400">Sowing prep (Rain forecasted)</td>
                            <td className="p-3 text-right text-slate-400">28,000 m³</td>
                            <td className="p-3 text-right text-cyan-400 font-black">{workflowScenario === 'normal' ? '25,200' : '0'} m³</td>
                            <td className="p-3 text-right">
                              <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${
                                workflowScenario === 'normal' ? 'bg-cyan-950 text-cyan-400' : 'bg-slate-900 text-slate-500'
                              }`}>
                                {workflowScenario === 'normal' ? '90%' : '0% (DEFERRED)'}
                              </span>
                            </td>
                          </tr>

                          {/* Industry */}
                          <tr>
                            <td className="p-3">
                              <span className="text-purple-400 font-bold block">NTPC Thermal Power</span>
                              <span className="text-[8.5px] text-slate-500">Industrial cooling</span>
                            </td>
                            <td className="p-3 text-slate-400">Secondary process</td>
                            <td className="p-3 text-right text-slate-400">15,000 m³</td>
                            <td className="p-3 text-right text-cyan-400 font-black">{workflowScenario === 'normal' ? '15,000' : '0'} m³</td>
                            <td className="p-3 text-right">
                              <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${
                                workflowScenario === 'normal' ? 'bg-cyan-950 text-cyan-400' : 'bg-slate-900 text-rose-500 border border-rose-500/10 font-black'
                              }`}>
                                {workflowScenario === 'normal' ? '100%' : '0% (CUT)'}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850/60">
                      <h5 className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">AI Strategy Rationale &amp; Audit Trail</h5>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-1">
                        {workflowScenario === 'normal' ? (
                          "With optimal inflows at 120-150 m³/s, the Nash Bargaining algorithm satisfied 100% of municipal drinking water and standing crop requirements. Daulatpur wheat was optimized slightly (90%) to build canal conservation reserves without impacting early germination."
                        ) : (
                          "CRITICAL SCARCITY ACTION: Canal inflows are highly restricted (40-60 m³/s). Under national priority rules, domestic drinking water (25,000 m³) is locked first. NTPC industrial cooling is cut first to 0% as a secondary priority. Daulatpur Wheat (V4) is deferred (0%) due to sowing prep buffer and imminent rainfall forecast. Remaining residue is routed to high-stress cotton (80%) and flowering rice (70%) to prevent irreparable crop wilting."
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* OFFICER'S COMPLAINT RESOLUTION & DEFENSE CENTER */}
              <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 md:p-6 space-y-4">
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-500 animate-pulse" />
                    Officer's Farmer Dispute Resolution Center
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">Generate auditable legal-technical answers instantly to address farmer union complaints about water distribution</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Select complaining claimant:</label>
                    <select
                      id="complainant-picker"
                      value={selectedComplainant}
                      onChange={(e) => {
                        setSelectedComplainant(e.target.value);
                        setAuditResponse('');
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="V4">🌾 Daulatpur Wheat (Irrigation Block V4)</option>
                      <option value="V2">🌾 Kalyanpur Sugarcane (Irrigation Block V2)</option>
                      <option value="NTPC">🏭 NTPC Industrial User (Bulk Sector)</option>
                    </select>
                  </div>

                  <button
                    id="btn-generate-audit"
                    onClick={() => {
                      if (selectedComplainant === 'V4') {
                        setAuditResponse(
                          `AUDIT EXPLANATION GENERATED FOR BLOCK V4 (DAULATPUR WHEAT):\n\n` +
                          `• Current Allocation Status: ${workflowScenario === 'normal' ? '25,200 m³ (90%)' : '0 m³ (Deferred)'}\n` +
                          `• Technical Comparison Point: Under drought conditions, water was prioritised for Block V3 (Shivpur Cotton) which was at a critical 32% soil moisture (wilting threshold) versus Daulatpur's early preparation soil.\n` +
                          `• Meteorological Justification: Local radar telemetry reports an incoming 14mm rainfall forecast tomorrow in your Block, which will replenish root soil safely without depleting precious canal head storage.\n` +
                          `• Deficit Credit Guarantee: Today's water deficit has been logged in the PIM credit ledger. Block V4 will receive a boosted priority score of +18% on the subsequent rotation releasing next Monday.`
                        );
                      } else if (selectedComplainant === 'V2') {
                        setAuditResponse(
                          `AUDIT EXPLANATION GENERATED FOR BLOCK V2 (KALYANPUR SUGARCANE):\n\n` +
                          `• Current Allocation Status: ${workflowScenario === 'normal' ? '18,000 m³ (100%)' : '9,000 m³ (50%)'}\n` +
                          `• Technical Comparison Point: Sugarcane in your sector has deep robust root systems and a soil moisture index of 45%. This permits a safe 50% temporary rotational throttle without reaching permanent crop wilting boundaries.\n` +
                          `• Priority Re-routing: Saved volumes were scheduled to protect Rampur (V1) Basmati rice which is currently in its flowering stage—where any water denial results in complete pollination failure.\n` +
                          `• Next Delivery Guarantee: Rotational flow is scheduled to restore your full discharge levels in 4 days.`
                        );
                      } else {
                        setAuditResponse(
                          `AUDIT EXPLANATION GENERATED FOR INDUSTRIAL USER (NTPC):\n\n` +
                          `• Current Allocation Status: ${workflowScenario === 'normal' ? '15,000 m³ (100%)' : '0 m³ (Complete Cut)'}\n` +
                          `• Legal Framework Reference: Under National Water Policy directives (Section 4.2.1), domestic drinking water and agricultural survival water hold statutory priority over industrial commercial allocations.\n` +
                          `• SCADA System Override: The SCADA gates have been restricted to protect municipal grids. Industrial users are legally required to activate internal recycled cooling water reserves during state-declared Engineered Drought Weeks.`
                        );
                      }
                    }}
                    className="md:col-span-1 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-amber-600/10 transition-all uppercase cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    Query Auditable Defense
                  </button>
                </div>

                {auditResponse && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/15 animate-fadeIn">
                    <pre className="text-xs text-amber-200 leading-relaxed font-mono whitespace-pre-wrap font-semibold">
                      {auditResponse}
                    </pre>
                  </div>
                )}
              </div>

              {/* SEARCHABLE 100-VILLAGE LEDGER FOR DEEP DATASET VERIFICATION */}
              <div className="space-y-3">
                <div className="px-1 flex justify-between items-center">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                     Live 100-Block Water Allocation Ledger
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">Verified Active Dataset</span>
                </div>

                {/* Grid view of all 100 blocks mapped seamlessly */}
                <div className="bg-slate-900/10 border border-slate-800 rounded-xl p-4 space-y-4">
                  <p className="text-xs text-slate-400 font-medium">
                    The entire dataset of 100 administrative canal segments is fully loaded and synchronised. Below are representative blocks from the network.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {villages.slice(0, 12).map((v) => {
                      // Map allocation proportionally under selected scenario
                      let finalAlloc = Math.round(v.waterDemand * 0.9);
                      if (workflowScenario === 'drought') {
                        if (v.cropType === 'Wheat') finalAlloc = 0;
                        else if (v.cropType === 'Basmati Rice') finalAlloc = Math.round(v.waterDemand * 0.7);
                        else if (v.cropType === 'Cotton') finalAlloc = Math.round(v.waterDemand * 0.8);
                        else finalAlloc = Math.round(v.waterDemand * 0.5);
                      }
                      
                      return (
                        <div key={v.id} className="bg-slate-950/40 border border-slate-850 p-3 rounded-lg flex flex-col justify-between space-y-2.5">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[8.5px] font-mono text-cyan-400">{v.id}</span>
                              <h4 className="text-xs font-bold text-white leading-tight">{v.name}</h4>
                            </div>
                            <span className="text-[9px] bg-slate-900 text-slate-400 font-mono px-1.5 py-0.5 rounded border border-slate-850 font-bold uppercase">
                              {v.cropType.substring(0, 5)}
                            </span>
                          </div>

                          <div className="space-y-1 bg-slate-900/20 p-2 rounded border border-slate-850/40 text-[9.5px] font-mono">
                            <div className="flex justify-between text-slate-500">
                              <span>Demand:</span>
                              <span className="text-slate-300">{v.waterDemand.toLocaleString()} m³</span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                              <span>Allotted:</span>
                              <span className={finalAlloc === 0 ? 'text-rose-400 font-black' : 'text-emerald-400 font-black'}>
                                {finalAlloc.toLocaleString()} m³
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between text-[8.5px] font-mono text-slate-500">
                            <span>Moisture: <b className="text-slate-400">{v.soilMoisture}%</b></span>
                            <span>Debt: <b className={v.waterDebt < 0 ? 'text-rose-400' : 'text-slate-400'}>{v.waterDebt.toLocaleString()} m³</b></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-center pt-2">
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-850 font-bold uppercase tracking-widest inline-block">
                      +88 Additional Blocks Active on the National Grid
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Pipeline */}
              <PipelineVisualizer />
            </div>
          )}

          {activeTab === 'farmer_dashboard' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-white">Smart Farmer Advisor &amp; Input Calculator</h2>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">Crop alignment indices, hydraulic wastage logs, and pesticide calculations</p>
                </div>

                {/* Block Selector */}
                <div className="flex items-center gap-2 bg-slate-900/40 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-mono pl-1 uppercase tracking-wider">Select Canal Block:</span>
                  <select
                    id="farmer-village-picker"
                    value={selectedFarmerVillage}
                    onChange={(e) => setSelectedFarmerVillage(e.target.value)}
                    className="bg-slate-950 text-slate-200 border border-slate-800 text-xs rounded-lg px-2.5 py-1.5 font-bold focus:outline-none focus:border-cyan-500"
                  >
                    {villages.map((v) => (
                      <option key={v.id} value={v.id}>{v.name} ({v.id})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Core Dash Content Grid */}
              {(() => {
                const activeVill = villages.find(x => x.id === selectedFarmerVillage) || villages[0];
                const activeAlloc = allocations.find(x => x.villageId === selectedFarmerVillage) || allocations[0];
                
                // Get historical records for this specific village
                const vHistory = historicalUsage.filter(h => h.villageId === selectedFarmerVillage) || [];
                const chartData = vHistory.map(h => ({
                  day: h.date.substring(5), // Month-day formatting
                  requested: h.requestedM3,
                  delivered: h.deliveredM3,
                  wasted: h.requestedM3 - h.deliveredM3 + h.wastedM3.evaporation + h.wastedM3.seepage
                })).reverse(); // chronological order

                // Total wastage metrics for the selected block
                const latestHistory = vHistory[0] || { wastedM3: { seepage: 240, evaporation: 150, theftOrOther: 40 }, efficiencyPercent: 78, deliveredM3: 1500 };
                const totalLost = latestHistory.wastedM3.seepage + latestHistory.wastedM3.evaporation + latestHistory.wastedM3.theftOrOther;
                const seepagePct = Math.round((latestHistory.wastedM3.seepage / (totalLost || 1)) * 100);
                const evapPct = Math.round((latestHistory.wastedM3.evaporation / (totalLost || 1)) * 100);
                const theftPct = Math.round((latestHistory.wastedM3.theftOrOther / (totalLost || 1)) * 100);

                // Fetch Crop Advisory specs based on calculator inputs
                const advisory = cropAdvisoryDb[calcCrop] || cropAdvisoryDb['Basmati Rice'];
                const computedWaterReq = advisory.waterRequiredM3PerHectare * calcHectares;
                const computedSeedsReq = advisory.seedsRequiredKgPerHectare * calcHectares;
                const computedNitrogen = advisory.fertilizersRequiredKgPerHectare.nitrogen * calcHectares;
                const computedPhosphorus = advisory.fertilizersRequiredKgPerHectare.phosphorus * calcHectares;
                const computedPotassium = advisory.fertilizersRequiredKgPerHectare.potassium * calcHectares;

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* LEFT PANEL (8 Columns): Water Flow Usage Statistics & Wastage breakdown */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      {/* Interactive block details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 space-y-1">
                          <span className="text-[9px] text-slate-500 font-bold uppercase font-mono">Soil Moisture</span>
                          <h3 className="text-base font-black text-white font-mono">{activeVill.soilMoisture}%</h3>
                          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-2">
                            <div 
                              className={`h-full rounded-full ${activeVill.soilMoisture < 35 ? 'bg-red-500' : 'bg-cyan-500'}`}
                              style={{ width: `${activeVill.soilMoisture}%` }}
                            />
                          </div>
                          <span className="text-[8px] text-slate-500 font-mono block mt-1">Wilting Point Coefficient: 35%</span>
                        </div>

                        <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 space-y-1">
                          <span className="text-[9px] text-slate-500 font-bold uppercase font-mono">Distance From Headworks</span>
                          <h3 className="text-base font-black text-cyan-400 font-mono">{activeVill.distanceFromHead} Km</h3>
                          <p className="text-[9px] text-slate-500 leading-none mt-1">
                            {activeVill.distanceFromHead > 20 ? 'Tail-end block (High lag)' : 'Head-works block (Low lag)'}
                          </p>
                        </div>

                        <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 space-y-1">
                          <span className="text-[9px] text-slate-500 font-bold uppercase font-mono">Active Allocation</span>
                          <h3 className="text-base font-black text-emerald-400 font-mono">{activeAlloc.allocatedAmount.toLocaleString()} m³</h3>
                          <span className="text-[9px] bg-emerald-950 text-emerald-400 font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-500/20 inline-block mt-1">
                            Slot: {activeAlloc.timeSlot}
                          </span>
                        </div>
                      </div>

                      {/* CHART: Previous water usage requested vs delivered */}
                      <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 space-y-4">
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Past 7 Days Water Discharge Logs</h4>
                          <p className="text-[9px] text-slate-500 font-mono">Actual volumetric deliveries versus crop demand thresholds</p>
                        </div>
                        <div className="h-44 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                              <defs>
                                <linearGradient id="colorRequested" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                              <XAxis dataKey="day" stroke="#475569" fontSize={9} />
                              <YAxis stroke="#475569" fontSize={9} />
                              <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', fontSize: 10 }} />
                              <Legend wrapperStyle={{ fontSize: 9 }} />
                              <Area type="monotone" dataKey="requested" name="Demand (m³)" stroke="#ef4444" fillOpacity={1} fill="url(#colorRequested)" />
                              <Area type="monotone" dataKey="delivered" name="Actual Flow (m³)" stroke="#06b6d4" fillOpacity={1} fill="url(#colorDelivered)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* WATER WASTAGE PERCENTAGES (Real-world efficiency indicators) */}
                      <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 space-y-3.5">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                          <div>
                            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Hydraulic Losses &amp; Wastage Breakdown</h4>
                            <p className="text-[9px] text-slate-500 font-mono">Analysis of wasted canal flow volume for the latest cycle</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 font-mono">DELIVERY EFFICIENCY</span>
                            <h3 className="text-lg font-black text-emerald-400 font-mono">{latestHistory.efficiencyPercent}%</h3>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          
                          {/* Seepage Losses */}
                          <div className="bg-slate-950/40 p-3.5 rounded-lg border border-slate-850 space-y-1.5">
                            <div className="flex justify-between items-center text-[10px] font-mono">
                              <span className="text-amber-500 font-bold">Seepage Losses</span>
                              <span className="text-white font-extrabold">{seepagePct}%</span>
                            </div>
                            <h3 className="text-xs font-black text-white font-mono">{latestHistory.wastedM3.seepage.toLocaleString()} m³</h3>
                            <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500" style={{ width: `${seepagePct}%` }} />
                            </div>
                            <p className="text-[8.5px] text-slate-500 leading-normal">Lost due to soil infiltration along unlined canal segments.</p>
                          </div>

                          {/* Evaporation Losses */}
                          <div className="bg-slate-950/40 p-3.5 rounded-lg border border-slate-850 space-y-1.5">
                            <div className="flex justify-between items-center text-[10px] font-mono">
                              <span className="text-orange-400 font-bold">Evaporation Losses</span>
                              <span className="text-white font-extrabold">{evapPct}%</span>
                            </div>
                            <h3 className="text-xs font-black text-white font-mono">{latestHistory.wastedM3.evaporation.toLocaleString()} m³</h3>
                            <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                              <div className="h-full bg-orange-400" style={{ width: `${evapPct}%` }} />
                            </div>
                            <p className="text-[8.5px] text-slate-500 leading-normal">Lost to sun heat transpiration across open water feeds.</p>
                          </div>

                          {/* Theft & Leakages */}
                          <div className="bg-slate-950/40 p-3.5 rounded-lg border border-slate-850 space-y-1.5">
                            <div className="flex justify-between items-center text-[10px] font-mono">
                              <span className="text-rose-400 font-bold">Theft / Siphoning</span>
                              <span className="text-white font-extrabold">{theftPct}%</span>
                            </div>
                            <h3 className="text-xs font-black text-white font-mono">{latestHistory.wastedM3.theftOrOther.toLocaleString()} m³</h3>
                            <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                              <div className="h-full bg-rose-400" style={{ width: `${theftPct}%` }} />
                            </div>
                            <p className="text-[8.5px] text-slate-500 leading-normal">Estimated unauthorized siphoning or structural leakages.</p>
                          </div>

                        </div>
                      </div>

                      {/* Active Grid Notices & Warnings */}
                      <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                          <BellRing className="w-4 h-4 text-cyan-400 animate-pulse" />
                          Official Advisories &amp; Warnings for {activeVill.name}
                        </h4>
                        
                        <div className="space-y-2.5 max-h-48 overflow-y-auto">
                          {notices.filter(n => n.blockId === 'All' || n.blockId === activeVill.id).length === 0 ? (
                            <div className="text-center py-6 text-slate-500 text-xs">
                              No active warning bulletins for this sector.
                            </div>
                          ) : (
                            notices.filter(n => n.blockId === 'All' || n.blockId === activeVill.id).map((notice) => (
                              <div key={notice.id} className="bg-slate-950/50 p-3 rounded-lg border border-cyan-500/10 space-y-1">
                                <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                                  <span className="text-cyan-400">{notice.title}</span>
                                  <span className="text-slate-500">{notice.date}</span>
                                </div>
                                <p className="text-xs text-slate-400 leading-normal">{notice.message}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                    </div>

                    {/* RIGHT PANEL (5 Columns): Crop Advisory Matrix & Interactive Input Calculator */}
                    <div className="lg:col-span-5 space-y-4">
                      
                      {/* Calculator Config */}
                      <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
                        <div>
                          <span className="text-[9px] text-cyan-400 font-mono font-bold uppercase tracking-wider">Interactive Solver</span>
                          <h4 className="text-sm font-extrabold text-white">Smart Crop &amp; Chemical Advisory</h4>
                          <p className="text-[10px] text-slate-500 font-medium">Input your acreage to calculate chemical weight, certified seeds, and volumetric water needs.</p>
                        </div>

                        <div className="space-y-3.5">
                          {/* Acres / Hectares input */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Total Cultivated Area (Hectares)</label>
                            <input 
                              type="number"
                              step="0.5"
                              min="0.5"
                              max="100"
                              value={calcHectares}
                              onChange={(e) => setCalcHectares(parseFloat(e.target.value) || 1)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
                            />
                          </div>

                          {/* Crop selection */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Target Crop Cultivated</label>
                            <select 
                              value={calcCrop}
                              onChange={(e) => setCalcCrop(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                            >
                              <option value="Basmati Rice">🇮🇳 Basmati Rice (Standing water loam)</option>
                              <option value="Wheat">🇮🇳 Wheat (CRI cycle crop)</option>
                              <option value="Sugarcane">🇮🇳 Sugarcane (Year-long water-heavy feed)</option>
                              <option value="Cotton">🇮🇳 Cotton (Volcanic black cotton clay)</option>
                              <option value="Pulses & Maize">🇮🇳 Pulses &amp; Maize (High-aeration loam)</option>
                              <option value="Mustard">🇮🇳 Mustard (Rajasthan sand loam)</option>
                            </select>
                          </div>
                        </div>

                        {/* Suitability Formula Index */}
                        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850/60 space-y-1 text-[10px]">
                          <span className="font-mono text-slate-500 font-bold uppercase block tracking-wider">Land Suitability Guidelines</span>
                          <p className="text-slate-400 leading-normal font-sans font-medium">{advisory.landSuitabilityDesc}</p>
                        </div>
                      </div>

                      {/* Calculator Outputs */}
                      <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 space-y-4">
                        <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider border-b border-slate-800 pb-2">
                          Calculated Resource Outputs
                        </h4>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                            <span className="text-[8.5px] text-slate-500 font-mono font-bold block">RECOMMENDED SEED WEIGHT</span>
                            <span className="text-sm font-black text-cyan-400 font-mono">{computedSeedsReq.toLocaleString()} Kg</span>
                            <span className="text-[8px] text-slate-500 font-mono block mt-0.5">({advisory.seedsRequiredKgPerHectare} Kg/Ha)</span>
                          </div>

                          <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                            <span className="text-[8.5px] text-slate-500 font-mono font-bold block">ESTIMATED WATER VOLUME</span>
                            <span className="text-sm font-black text-cyan-400 font-mono">{computedWaterReq.toLocaleString()} m³</span>
                            <span className="text-[8px] text-slate-500 font-mono block mt-0.5">({advisory.waterRequiredM3PerHectare.toLocaleString()} m³/Ha)</span>
                          </div>
                        </div>

                        {/* Fertilizers ratios */}
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-2">
                          <span className="text-[8.5px] text-slate-500 font-mono font-bold block">RECOMMENDED N-P-K CHEMICAL CONSTITUENTS (Kg)</span>
                          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono font-bold">
                            <div className="bg-slate-900/50 p-1.5 rounded">
                              <span className="text-[8.5px] text-slate-500 block">NITROGEN</span>
                              <span className="text-emerald-400 font-black">{computedNitrogen.toFixed(1)}</span>
                            </div>
                            <div className="bg-slate-900/50 p-1.5 rounded">
                              <span className="text-[8.5px] text-slate-500 block">PHOSPHORUS</span>
                              <span className="text-emerald-400 font-black">{computedPhosphorus.toFixed(1)}</span>
                            </div>
                            <div className="bg-slate-900/50 p-1.5 rounded">
                              <span className="text-[8.5px] text-slate-500 block">POTASSIUM</span>
                              <span className="text-emerald-400 font-black">{computedPotassium.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Pesticides list */}
                        <div className="space-y-1.5">
                          <span className="text-[9px] text-slate-500 font-mono font-bold uppercase">Government Approved Pesticides</span>
                          <div className="flex flex-wrap gap-1.5">
                            {advisory.pesticidesRecommended.map((pest, i) => (
                              <span key={i} className="text-[9.5px] bg-cyan-950/30 border border-cyan-500/10 text-cyan-300 font-semibold px-2 py-0.5 rounded-md">
                                {pest}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Sourcing / Purchasing Checklist */}
                        <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-850 space-y-2">
                          <span className="text-[9px] text-slate-500 font-mono font-bold uppercase block tracking-wider">Required Sourcing Shopping List</span>
                          <ul className="text-[10px] text-slate-300 space-y-1 list-disc list-inside">
                            {advisory.thingsToBuy.map((item, i) => (
                              <li key={i} className="font-semibold">{item}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Rotation Canal Release */}
                        <div className="bg-cyan-950/20 p-3 rounded-lg border border-cyan-500/10 text-center text-xs space-y-1">
                          <span className="text-[9px] text-cyan-400 font-mono font-bold uppercase tracking-widest block">FEEDER ROTATIONAL FREQUENCY</span>
                          <p className="text-white font-extrabold">Next scheduled discharge in {advisory.waterReleaseFrequencyDays} days</p>
                          <p className="text-[9px] text-slate-400 font-medium leading-tight">Rotation conforms strictly to Participatory Irrigation Management (PIM) cycle directives.</p>
                        </div>

                      </div>

                    </div>

                  </div>
                );
              })()}

              {/* ICAR CSSRI Scientifically-backed Soil Health & Crop Rotation Advisor */}
              <SoilHealthVisualizer selectedVillageId={selectedFarmerVillage} villages={villages} />
            </div>
          )}

          {activeTab === 'gov_dashboard' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-extrabold text-white">Command &amp; Operations Room</h2>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">District Collector &amp; Ministry administration audit authority panel</p>
              </div>

              {/* Macro stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'RESERVOIR VOLUME', value: `${reservoir.currentStorage} MCM`, sub: '69.4% Capacity', color: 'text-cyan-400' },
                  { title: 'DAILY WATER DEMAND', value: `${villages.reduce((acc, v) => acc + v.waterDemand, 0).toLocaleString()} m³`, sub: '100 Villages combined', color: 'text-blue-400' },
                  { title: 'SCADA INFLOW AT HEAD', value: `${customInflow} m³/s`, sub: 'Regulator aperture normal', color: 'text-indigo-400' },
                  { title: 'REGISTERED FARMERS', value: `${registeredFarmers.length} Profiles`, sub: 'Verified by district Panchayat', color: 'text-emerald-400' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 space-y-1 shadow-sm">
                    <span className="text-[9px] text-slate-500 font-bold uppercase font-mono">{item.title}</span>
                    <h3 className={`text-lg font-extrabold ${item.color} font-mono`}>{item.value}</h3>
                    <p className="text-[9px] text-slate-400 font-sans font-medium">{item.sub}</p>
                  </div>
                ))}
              </div>

              {/* SECURE REGISTERED FARMER LEDGER - ADMIN ONLY ACCESS */}
              <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2 text-rose-500">
                      <ShieldAlert className="w-4 h-4" />
                      <h3 className="text-sm font-extrabold text-white">Registered Farmers Directory (🔒 Admin Access Only)</h3>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">Participatory Irrigation ledger containing active agronomic profiles</p>
                  </div>
                  <span className="text-[9px] bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                    Secured by Jal Shakti clearance L4
                  </span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-850 bg-slate-950/40">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-mono text-[9px] uppercase tracking-wider">
                        <th className="p-3">Farmer Name</th>
                        <th className="p-3">Block ID</th>
                        <th className="p-3">Acreage (Ha)</th>
                        <th className="p-3">Crop Registered</th>
                        <th className="p-3">Contact Mobile</th>
                        <th className="p-3 text-right">Verification Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 text-slate-300 font-sans">
                      {registeredFarmers.map((farmer, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/10 transition-colors">
                          <td className="p-3 font-bold text-slate-200">{farmer.name}</td>
                          <td className="p-3 font-mono font-bold text-cyan-400">{farmer.villageId}</td>
                          <td className="p-3 font-mono text-slate-400">{farmer.landHectares} Ha</td>
                          <td className="p-3 text-slate-300 font-medium">{farmer.cropType || 'N/A'}</td>
                          <td className="p-3 font-mono text-slate-400">{farmer.contact}</td>
                          <td className="p-3 text-right">
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                              ● VERIFIED
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-[9px] text-slate-500 leading-normal font-sans border-t border-slate-850 pt-2.5 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shrink-0" />
                  <p><b>Data Privacy Compliance:</b> All registered farmer profiles are encrypted at rest under Ministry security standards. Farmer records are invisible to public modules and are only auditable by Grid Administrators.</p>
                </div>
              </div>

              {/* Emergency SOS & Broadcast controller */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Broadcast notice form */}
                <div className="lg:col-span-5 bg-slate-900/30 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Broadcast District Advisory</h4>
                    <p className="text-[10px] text-slate-500 font-mono">Send alert notifications directly to active canal village dashboards</p>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!newNoticeTitle || !newNoticeMsg) return;
                    const newId = `N-${Date.now()}`;
                    setNotices(prev => [
                      { id: newId, title: newNoticeTitle, blockId: newNoticeBlock, message: newNoticeMsg, date: systemDate },
                      ...prev
                    ]);
                    setNewNoticeTitle('');
                    setNewNoticeMsg('');
                    showToast(`Advisory successfully broadcasted to Block ${newNoticeBlock}!`);
                  }} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Advisory Title</label>
                      <input 
                        type="text"
                        value={newNoticeTitle}
                        onChange={(e) => setNewNoticeTitle(e.target.value)}
                        required
                        placeholder="e.g. Silt clean scheduled, dry rotation alert"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 placeholder:text-slate-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Target block</label>
                      <select 
                        value={newNoticeBlock}
                        onChange={(e) => setNewNoticeBlock(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                      >
                        <option value="All">All Blocks (Global announcement)</option>
                        {villages.map(v => <option key={v.id} value={v.id}>{v.name} ({v.id})</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Message body</label>
                      <textarea 
                        value={newNoticeMsg}
                        onChange={(e) => setNewNoticeMsg(e.target.value)}
                        required
                        rows={3}
                        placeholder="Provide details about recommended rotation or safety instructions..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 placeholder:text-slate-700"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs py-2 rounded-lg transition-all shadow-md shadow-cyan-600/15"
                    >
                      📡 DISPATCH ADVISORY BULLETIN
                    </button>
                  </form>
                </div>

                {/* SCADA Radial Audit Logs */}
                <div className="lg:col-span-7 bg-slate-900/30 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">SCADA Decision Audit Logs</h4>
                    <p className="text-[9px] text-slate-500 font-mono">Algorithmic allocation and flow balancing log audit trails</p>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-slate-850 bg-slate-950/40">
                    <table className="w-full text-left text-[10px] font-mono">
                      <thead>
                        <tr className="border-b border-slate-850 bg-slate-900/20 text-slate-500 font-bold uppercase text-[9px]">
                          <th className="p-3">TIMESTAMP</th>
                          <th className="p-3">AUDIT ID</th>
                          <th className="p-3">SYSTEM INPUT OBJECTIVE</th>
                          <th className="p-3 text-right">FAIRNESS (GINI)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850 text-slate-300">
                        {decisionLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-900/10">
                            <td className="p-3 text-slate-400">{log.timestamp}</td>
                            <td className="p-3 text-cyan-400 font-bold">{log.id}</td>
                            <td className="p-3">{log.inputSummary}</td>
                            <td className="p-3 text-right font-extrabold text-emerald-400">{log.fairnessIndex}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-[9.5px] text-slate-500 italic pt-2 font-mono">
                    Audit logs comply with the National Canal SCADA and river-basin routing regulations (Sec 12.A).
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'knowledge_centre' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 animate-fadeIn">
                <div>
                  <h2 className="text-lg font-extrabold text-white">Sustainability Hub &amp; Academy</h2>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">Designed by KVSP Praneeth | Real-world resource indicators &amp; 10 dynamic educational modules</p>
                </div>
                <span className="text-[9px] bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-bold px-2 py-1 rounded font-mono uppercase tracking-wider">
                  ● ACTIVE SUSTAINABILITY METRICS
                </span>
              </div>

              {/* SECTION 1: AQUASETU SUSTAINABILITY COMPASS (6 Required Indicators) */}
              <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 border-b border-slate-850 pb-2.5">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                    AquaSetu Sustainability Compass
                  </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
                  {/* Indicator 1 */}
                  <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-850 space-y-1 shadow-sm">
                    <span className="text-[8px] text-slate-500 font-mono font-bold block uppercase">Water Saved Today</span>
                    <span className="text-sm font-black text-emerald-400 font-mono">145,000 Litres</span>
                    <p className="text-[7.5px] text-slate-400 font-sans leading-none">Via lining seepage control</p>
                  </div>
                  {/* Indicator 2 */}
                  <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-850 space-y-1 shadow-sm">
                    <span className="text-[8px] text-slate-500 font-mono font-bold block uppercase">Fairness Index</span>
                    <span className="text-sm font-black text-cyan-400 font-mono">93% Gini</span>
                    <p className="text-[7.5px] text-slate-400 font-sans leading-none">Balanced Nash equilibrium</p>
                  </div>
                  {/* Indicator 3 */}
                  <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-850 space-y-1 shadow-sm">
                    <span className="text-[8px] text-slate-500 font-mono font-bold block uppercase">Villages Served</span>
                    <span className="text-sm font-black text-blue-400 font-mono">5 / 5 Blocks</span>
                    <p className="text-[7.5px] text-slate-400 font-sans leading-none">Fully active sub-segments</p>
                  </div>
                  {/* Indicator 4 */}
                  <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-850 space-y-1 shadow-sm">
                    <span className="text-[8px] text-slate-500 font-mono font-bold block uppercase">Irrigation Efficiency</span>
                    <span className="text-sm font-black text-indigo-400 font-mono">87% Aggregate</span>
                    <p className="text-[7.5px] text-slate-400 font-sans leading-none">Drip &amp; AWD adoption</p>
                  </div>
                  {/* Indicator 5 */}
                  <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-850 space-y-1 shadow-sm">
                    <span className="text-[8px] text-slate-500 font-mono font-bold block uppercase">Reservoir Status</span>
                    <span className="text-sm font-black text-emerald-400 font-mono">Healthy</span>
                    <p className="text-[7.5px] text-slate-400 font-sans leading-none">69.4% Current Capacity</p>
                  </div>
                  {/* Indicator 6 */}
                  <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-850 space-y-1 shadow-sm">
                    <span className="text-[8px] text-slate-500 font-mono font-bold block uppercase">Scarcity Risk</span>
                    <span className="text-sm font-black text-amber-500 font-mono">Moderate</span>
                    <p className="text-[7.5px] text-slate-400 font-sans leading-none">Pessimistic parameter safe</p>
                  </div>
                </div>

                {/* Sustainability Goals High-contrast Indicator Dot Modules */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-850 text-xs">
                  <div className="bg-emerald-950/20 border border-emerald-500/15 p-3 rounded-lg flex items-start gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse mt-1 shrink-0" />
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-200 block">Goal: Clean Water Management</span>
                      <p className="text-[10px] text-slate-400 leading-normal">Ensuring non-negotiable domestic potable demands are fully reserved under worst-case pessimistic inflows before agricultural and industrial distribution.</p>
                    </div>
                  </div>

                  <div className="bg-cyan-950/20 border border-cyan-500/15 p-3 rounded-lg flex items-start gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse mt-1 shrink-0" />
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-200 block">Goal: Climate Resilience</span>
                      <p className="text-[10px] text-slate-400 leading-normal">Dynamic adaptive forecasting models allow pre-allocation of water defenses prior to crop stress, mitigating transpiration failure in drought weeks.</p>
                    </div>
                  </div>

                  <div className="bg-indigo-950/20 border border-indigo-500/15 p-3 rounded-lg flex items-start gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse mt-1 shrink-0" />
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-200 block">Goal: Resource Optimization</span>
                      <p className="text-[10px] text-slate-400 leading-normal">Real-time seepage calculations based on soil type profiles combined with game-theoretic Nash solutions to balance fairness with aggregate transport loss.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: THE 10 INTERACTIVE EDUCATIONAL SECTIONS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 10 Topic buttons side selector - 3D Styled Buttons! */}
                <div className="lg:col-span-4 bg-slate-900/30 border border-slate-800 rounded-xl p-4 space-y-2 flex flex-col justify-between shadow-lg">
                  <div className="space-y-2">
                    <span className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider block">Academy Curriculum</span>
                    <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider border-b border-slate-850 pb-2">
                      Interactive Water Modules
                    </h3>

                    <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                      {[
                        { label: 'Water Conservation', icon: '💧' },
                        { label: 'Canal Systems', icon: '🚰' },
                        { label: 'Reservoir Operations', icon: '🏔️' },
                        { label: 'Rainwater Harvesting', icon: '🌧️' },
                        { label: 'Watershed Management', icon: '🌱' },
                        { label: 'Groundwater Recharge', icon: '⛲' },
                        { label: 'Irrigation Best Practices', icon: '🌾' },
                        { label: 'Crop Water Efficiency', icon: '🌽' },
                        { label: 'Flood Preparedness', icon: '🛡️' },
                        { label: 'Drought Preparedness', icon: '🌵' },
                      ].map((topic, idx) => {
                        const isSelected = selectedAcademyTopic === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedAcademyTopic(idx)}
                            className={`w-full text-left px-3 py-2 text.5 text-[11px] font-bold font-mono rounded-lg transition-all flex items-center justify-between cursor-pointer border-b-4 active:border-b-0 active:translate-y-[4px] ${
                              isSelected 
                                ? 'bg-cyan-600 border-cyan-800 text-slate-950 shadow-inner' 
                                : 'bg-slate-950/60 border-slate-850/80 text-slate-300 hover:bg-slate-900 hover:border-slate-800'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span>{topic.icon}</span>
                              <span>{idx + 1}. {topic.label}</span>
                            </span>
                            {isSelected && <span className="text-[10px]">▶</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-[9px] text-slate-500 font-mono mt-2 leading-relaxed">
                    <span>Curated by <b>kvsp praneeth</b>. Clicking a topic loads its live, interactive mathematical physics simulator inside the viewport.</span>
                  </div>
                </div>

                {/* Module Viewport */}
                <div className="lg:col-span-8 bg-slate-900/30 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between shadow-lg">
                  {selectedAcademyTopic === 0 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="border-b border-slate-850 pb-2 flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-mono text-cyan-400 font-bold">MODULE 1 • SUSTAINABLE UTILITIES</span>
                          <h4 className="text-sm font-extrabold text-white">Water Conservation Dynamics</h4>
                        </div>
                        <span className="text-xl">💧</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Domestic water conservation directly lowers pressure on critical reserves. Increasing public awareness indexes can reduce municipal consumption by up to 35% during extreme drought events.
                      </p>

                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-3">
                        <h5 className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider">Awareness Slider Simulator</h5>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-slate-400">Public Awareness level:</span>
                            <span className="text-cyan-400 font-extrabold">{academyConservationAwareness}%</span>
                          </div>
                          <input 
                            type="range"
                            min="10"
                            max="100"
                            value={academyConservationAwareness}
                            onChange={(e) => setAcademyConservationAwareness(Number(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] font-mono border-t border-slate-900">
                          <div>
                            <span className="text-slate-500 block">MUNICIPAL DEMAND SAVINGS</span>
                            <span className="text-xs text-emerald-400 font-extrabold">
                              {Math.round(25000 * (academyConservationAwareness / 100) * 0.35).toLocaleString()} m³/Day
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">PEOPLE SUSTAINABLE BUFFER</span>
                            <span className="text-xs text-cyan-400 font-extrabold">
                              {Math.round(1200000 * (academyConservationAwareness / 100)).toLocaleString()} Citizens
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 leading-normal font-sans bg-slate-950/20 p-3 rounded border border-slate-850">
                        <b>Conservation Rule:</b> Low flow aerators, rainwater capture credits, and tiered pricing loops are the primary physical tools used by administrative entities to regulate residential pressure.
                      </div>
                    </div>
                  )}

                  {selectedAcademyTopic === 1 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="border-b border-slate-850 pb-2 flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-mono text-cyan-400 font-bold">MODULE 2 • HYDRAULIC GEOMETRY</span>
                          <h4 className="text-sm font-extrabold text-white">Canal Open-Channel Seepage Loss</h4>
                        </div>
                        <span className="text-xl">🚰</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Unlined earthen canals lose up to 40% of their volumetric flow directly to seepage. Lining sections with high-density concrete tiles dramatically reduces transportation coefficients, preserving headworks pressure.
                      </p>

                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-3">
                        <h5 className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider">Channel Seepage Simulator</h5>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-slate-400">Canal Unlined Seepage Factor:</span>
                            <span className="text-rose-400 font-extrabold">{academyCanalSeepagePct}% Seepage Loss</span>
                          </div>
                          <input 
                            type="range"
                            min="5"
                            max="45"
                            value={academyCanalSeepagePct}
                            onChange={(e) => setAcademyCanalSeepagePct(Number(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] font-mono border-t border-slate-900">
                          <div>
                            <span className="text-slate-500 block">EVAPORATIVE SEEPAGE LOSS</span>
                            <span className="text-xs text-rose-400 font-extrabold">
                              {Math.round(145000 * (academyCanalSeepagePct / 100)).toLocaleString()} m³ / Day
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">LINED CHANNEL EFFICIENCY</span>
                            <span className="text-xs text-emerald-400 font-extrabold">
                              {100 - academyCanalSeepagePct}% Effective
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 leading-normal font-sans bg-slate-950/20 p-3 rounded border border-slate-850">
                        <b>Canal Design Rule:</b> Seepage loss is a function of wetted perimeter surface area, soil hydraulic conductivity, and flow velocity. High hydraulic radii yield lower transport resistance.
                      </div>
                    </div>
                  )}

                  {selectedAcademyTopic === 2 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="border-b border-slate-850 pb-2 flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-mono text-cyan-400 font-bold">MODULE 3 • RESERVOIR MASS BALANCING</span>
                          <h4 className="text-sm font-extrabold text-white">Reservoir Inflow-Outflow Balancing</h4>
                        </div>
                        <span className="text-xl">🏔️</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Reservoir operation is governed by the mass continuity equation: dV/dt = Inflow - Outflow - Losses. If outflow exceeds natural replenishment during summer periods, storage volume depletes linearly.
                      </p>

                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-3">
                        <h5 className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider">Outflow Gate Controller</h5>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-slate-400">Regulator Discharge Gate Rate:</span>
                            <span className="text-cyan-400 font-extrabold">{academyReservoirOutflow} m³/s (Cumecs)</span>
                          </div>
                          <input 
                            type="range"
                            min="20"
                            max="250"
                            value={academyReservoirOutflow}
                            onChange={(e) => setAcademyReservoirOutflow(Number(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] font-mono border-t border-slate-900">
                          <div>
                            <span className="text-slate-500 block">RESERVOIR RETENTION SPAN</span>
                            <span className="text-xs text-cyan-400 font-extrabold">
                              {academyReservoirOutflow > 120 ? `${Math.round(420 / (academyReservoirOutflow / 120))} Days Buffer` : 'Optimal Safety Buffer'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">DOWNSTREAM FLOOD RISK</span>
                            <span className="text-xs text-amber-400 font-extrabold">
                              {academyReservoirOutflow > 180 ? 'HIGH SURGE HAZARD' : 'SAFE BANK CONFINEMENT'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 leading-normal font-sans bg-slate-950/20 p-3 rounded border border-slate-850">
                        <b>Operations Rule:</b> Spillway gates are dynamically adjusted based on telemetry sensors upstream. A margin of safety is always maintained to prevent overtopping risks during high cloudburst runs.
                      </div>
                    </div>
                  )}

                  {selectedAcademyTopic === 3 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="border-b border-slate-850 pb-2 flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-mono text-cyan-400 font-bold">MODULE 4 • DECENTRALIZED STORAGE</span>
                          <h4 className="text-sm font-extrabold text-white">Rainwater Harvesting &amp; Local Storage</h4>
                        </div>
                        <span className="text-xl">🌧️</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Rainwater harvesting converts standard impervious roof surfaces into localized clean catchment basins. Collecting runoff mitigates soil saturation and provides independent water security to small holdings.
                      </p>

                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-3">
                        <h5 className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider">Rooftop Catchment Area Calculator</h5>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-slate-400">Total Impervious Catchment Area:</span>
                            <span className="text-cyan-400 font-extrabold">{academyRooftopArea} m²</span>
                          </div>
                          <input 
                            type="range"
                            min="50"
max="500"
                            value={academyRooftopArea}
                            onChange={(e) => setAcademyRooftopArea(Number(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] font-mono border-t border-slate-900">
                          <div>
                            <span className="text-slate-500 block">ANNUAL CAPTURE RUNOFF</span>
                            <span className="text-xs text-emerald-400 font-extrabold">
                              {Math.round(academyRooftopArea * 0.8 * 850).toLocaleString()} Litres / Year
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">RUNOFF COEFFICIENT</span>
                            <span className="text-xs text-cyan-400 font-extrabold">
                              0.80 (Standard Concrete Slab)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 leading-normal font-sans bg-slate-950/20 p-3 rounded border border-slate-850">
                        <b>Harvesting Formula:</b> Water Yield (L) = Catchment Area (m²) × Rainfall (mm) × Runoff Coefficient (0.80-0.90 for smooth roofs). Filter loops are required to remove organic silt on initial runs.
                      </div>
                    </div>
                  )}

                  {selectedAcademyTopic === 4 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="border-b border-slate-850 pb-2 flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-mono text-cyan-400 font-bold">MODULE 5 • HYDROLOGY RESILIENCE</span>
                          <h4 className="text-sm font-extrabold text-white">Watershed Forest &amp; Runoff Regulation</h4>
                        </div>
                        <span className="text-xl">🌱</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Forest canopy and roots anchor topsoil, increasing the concentration time of rainfall events. Deforested lands face instant flash runoff, filling canals with choking silt.
                      </p>

                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-3">
                        <h5 className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider">Afforestation Coverage Simulator</h5>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-slate-400">Total Forest Canopy Coverage:</span>
                            <span className="text-cyan-400 font-extrabold">{academyForestCover}% Area</span>
                          </div>
                          <input 
                            type="range"
                            min="5"
                            max="90"
                            value={academyForestCover}
                            onChange={(e) => setAcademyForestCover(Number(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] font-mono border-t border-slate-900">
                          <div>
                            <span className="text-slate-500 block">SEDIMENT SILT CONTROL</span>
                            <span className="text-xs text-emerald-400 font-extrabold">
                              {Math.round(academyForestCover * 0.95)}% Less Sedimentation
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">SOIL INFILTRATION RATE</span>
                            <span className="text-xs text-cyan-400 font-extrabold">
                              {(12 + (academyForestCover * 0.15)).toFixed(1)} mm / Hour
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 leading-normal font-sans bg-slate-950/20 p-3 rounded border border-slate-850">
                        <b>Watershed Rule:</b> Soil erosion rate increases exponentially on mountain gradients when vegetation density falls below a critical 30% coverage value.
                      </div>
                    </div>
                  )}

                  {selectedAcademyTopic === 5 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="border-b border-slate-850 pb-2 flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-mono text-cyan-400 font-bold">MODULE 6 • SUBSURFACE STORAGE</span>
                          <h4 className="text-sm font-extrabold text-white">Aquifer Dynamics &amp; Groundwater Recharge</h4>
                        </div>
                        <span className="text-xl">⛲</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Excessive groundwater pumping without artificial recharge creates permanent cone-of-depression drawdowns. Building dedicated infiltration recharge shafts returns surface canal surplus back to subsurface aquifers.
                      </p>

                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-3">
                        <h5 className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider">Tube Well Drilling Simulator</h5>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-slate-400">Borewell Depth Index:</span>
                            <span className="text-cyan-400 font-extrabold">{academyTubeWellDepth} Feet Depth</span>
                          </div>
                          <input 
                            type="range"
                            min="50"
                            max="300"
                            value={academyTubeWellDepth}
                            onChange={(e) => setAcademyTubeWellDepth(Number(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] font-mono border-t border-slate-900">
                          <div>
                            <span className="text-slate-500 block">AQUIFER STATIC WATER TABLE</span>
                            <span className="text-xs text-cyan-400 font-extrabold">
                              {academyTubeWellDepth > 200 ? 'Depleting (Critical Drawdown)' : 'Stable Saturated Zone'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">RECHARGE PUMP ENERGY</span>
                            <span className="text-xs text-rose-400 font-extrabold">
                              {Math.round(academyTubeWellDepth * 1.8)} KWh / MCM Lift
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 leading-normal font-sans bg-slate-950/20 p-3 rounded border border-slate-850">
                        <b>Groundwater Safety Rule:</b> Static level is monitored relative to Mean Sea Level (MSL). Rapid saline ingress occurs if seaside water tables sink below baseline zero.
                      </div>
                    </div>
                  )}

                  {selectedAcademyTopic === 6 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="border-b border-slate-850 pb-2 flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-mono text-cyan-400 font-bold">MODULE 7 • PRECISION AGRONOMY</span>
                          <h4 className="text-sm font-extrabold text-white">Irrigation Efficiency Comparison</h4>
                        </div>
                        <span className="text-xl">🌾</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Flood basin irrigation results in massive water losses to evaporation and percolation beyond roots. Standardizing micro-drip networks supplies precise water molecules directly to soil-crop root zones.
                      </p>

                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-3">
                        <h5 className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider">Methodology Selector</h5>
                        <div className="grid grid-cols-3 gap-2">
                          {['Flood Basin', 'Sprinkler', 'Drip'].map((type) => {
                            const isSel = academyIrrigationType === type;
                            return (
                              <button
                                key={type}
                                onClick={() => setAcademyIrrigationType(type)}
                                className={`px-2 py-2 text-[10px] font-mono font-bold border rounded-md transition-all cursor-pointer ${
                                  isSel ? 'bg-cyan-600 border-cyan-800 text-slate-950' : 'bg-slate-950/40 border-slate-850 text-slate-400'
                                }`}
                              >
                                {type}
                              </button>
                            );
                          })}
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] font-mono border-t border-slate-900">
                          <div>
                            <span className="text-slate-500 block">APPLICATION EFFICIENCY</span>
                            <span className="text-xs text-emerald-400 font-extrabold">
                              {academyIrrigationType === 'Flood Basin' ? '45%' : academyIrrigationType === 'Sprinkler' ? '75%' : '92%'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">SURFACE RUNOFF COEFFICIENT</span>
                            <span className="text-xs text-cyan-400 font-extrabold">
                              {academyIrrigationType === 'Flood Basin' ? '0.35' : academyIrrigationType === 'Sprinkler' ? '0.12' : '0.02'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 leading-normal font-sans bg-slate-950/20 p-3 rounded border border-slate-850">
                        <b>Irrigation Best Practices:</b> Drip networks operate on low working pressures (1.0-1.5 bars), lowering electrical pumping loads while avoiding deep percolation nutrient wash-outs.
                      </div>
                    </div>
                  )}

                  {selectedAcademyTopic === 7 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="border-b border-slate-850 pb-2 flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-mono text-cyan-400 font-bold">MODULE 8 • CROP PHYSIOLOGY</span>
                          <h4 className="text-sm font-extrabold text-white">Rice Sowing &amp; Alternate Wetting and Drying (AWD)</h4>
                        </div>
                        <span className="text-xl">🌽</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Traditional basmati rice is kept continuously flooded. Under Alternate Wetting and Drying (AWD), fields are allowed to dry until soil moisture reaches critical tension before next irrigation, saving up to 30% water without yield penalty.
                      </p>

                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-3">
                        <h5 className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider">AWD Management Selector</h5>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'CF', name: 'Continuous Flooding (Traditional)' },
                            { id: 'AWD', name: 'Alternate Wetting/Drying (Smart)' },
                          ].map((item) => {
                            const isSel = academyRiceMethod === item.id;
                            return (
                              <button
                                key={item.id}
                                onClick={() => setAcademyRiceMethod(item.id)}
                                className={`px-2 py-2 text-[10px] font-mono font-bold border rounded-md text-left transition-all cursor-pointer ${
                                  isSel ? 'bg-cyan-600 border-cyan-800 text-slate-950' : 'bg-slate-950/40 border-slate-850 text-slate-400'
                                }`}
                              >
                                {item.name}
                              </button>
                            );
                          })}
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] font-mono border-t border-slate-900">
                          <div>
                            <span className="text-slate-500 block">WATER REQUIREMENT RATION</span>
                            <span className="text-xs text-emerald-400 font-extrabold">
                              {academyRiceMethod === 'CF' ? '12,500 m³ / Ha' : '8,750 m³ / Ha (Saved 30%)'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">SOIL METHANE (CH4) EMISSION</span>
                            <span className="text-xs text-cyan-400 font-extrabold">
                              {academyRiceMethod === 'CF' ? 'Baseline High' : 'Reduced by 48%'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 leading-normal font-sans bg-slate-950/20 p-3 rounded border border-slate-850">
                        <b>AWD Methodology:</b> Perforated field tubes (Pani Pipe) are inserted to monitor underground perched water table levels. Irrigating only when underground depth drops below 15cm is highly optimized.
                      </div>
                    </div>
                  )}

                  {selectedAcademyTopic === 8 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="border-b border-slate-850 pb-2 flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-mono text-cyan-400 font-bold">MODULE 9 • EMERGENCY STABILIZATION</span>
                          <h4 className="text-sm font-extrabold text-white">Flood Preparedness &amp; SCADA Safety</h4>
                        </div>
                        <span className="text-xl">🛡️</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Flood events occur when upstream catchment releases exceed embankment design heights. Safe operation requires real-time regulatory gate open/close schedules to shunt surge flows into secondary dry basins.
                      </p>

                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-3">
                        <h5 className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider">Embankment Crest Level Height</h5>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-slate-400">Spillway Embankment Safety Freeboard:</span>
                            <span className="text-cyan-400 font-extrabold">{academyEmbankmentHeight.toFixed(1)} Metres</span>
                          </div>
                          <input 
                            type="range"
                            min="1.5"
                            max="5.5"
                            step="0.5"
                            value={academyEmbankmentHeight}
                            onChange={(e) => setAcademyEmbankmentHeight(Number(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] font-mono border-t border-slate-900">
                          <div>
                            <span className="text-slate-500 block">PEAK SURGE CAPACITY STRESS</span>
                            <span className="text-xs text-cyan-400 font-extrabold">
                              {academyEmbankmentHeight < 2.5 ? 'CRITICAL BANK OVERFLOW' : 'SAFE CONFINEMENT FLOW'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">SAFETY RETRIBUTION FACTOR</span>
                            <span className="text-xs text-emerald-400 font-extrabold">
                              {(academyEmbankmentHeight * 20).toFixed(0)}% Flood Resilience
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 leading-normal font-sans bg-slate-950/20 p-3 rounded border border-slate-850">
                        <b>Flood Rule:</b> Early warning radars upstream provide lead-time indicators. Gate adjustment routines must be executed prior to peak volume arrival at canal headworks regulators.
                      </div>
                    </div>
                  )}

                  {selectedAcademyTopic === 9 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="border-b border-slate-850 pb-2 flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-mono text-cyan-400 font-bold">MODULE 10 • SCARCITY RISK RESILIENCE</span>
                          <h4 className="text-sm font-extrabold text-white">Drought Preparedness &amp; Soil Mulching</h4>
                        </div>
                        <span className="text-xl">🌵</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Mulch covers topsoil with plant residues or biodegradeable membranes, slowing evaporation rates significantly. Combined with the Legal Priority Layer, mulching guarantees crop survival across drought periods.
                      </p>

                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-3">
                        <h5 className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider">Mulch Cover Implementation</h5>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-xs">Apply Biodegradeable Mulch Layers:</span>
                          <button
                            onClick={() => setAcademyMulchApplied(!academyMulchApplied)}
                            className={`px-4 py-1.5 text-[11px] font-mono font-bold rounded-lg border-b-4 active:border-b-0 active:translate-y-[4px] cursor-pointer transition-all ${
                              academyMulchApplied 
                                ? 'bg-cyan-600 border-cyan-800 text-slate-950' 
                                : 'bg-slate-950 border-slate-850 text-slate-400'
                            }`}
                          >
                            {academyMulchApplied ? '● MULCHING ACTIVE' : '○ MULCHING INACTIVE'}
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] font-mono border-t border-slate-900">
                          <div>
                            <span className="text-slate-500 block">SOIL MOISTURE RETENTION DAYS</span>
                            <span className="text-xs text-emerald-400 font-extrabold">
                              {academyMulchApplied ? '12 Days Retention' : '4 Days Retention'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">EVAPORATIVE STRESS REDUCTION</span>
                            <span className="text-xs text-cyan-400 font-extrabold">
                              {academyMulchApplied ? 'Reduced by 60%' : 'High Evaporative Strain'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 leading-normal font-sans bg-slate-950/20 p-3 rounded border border-slate-850">
                        <b>Drought Defense Rule:</b> Prioritizing high-stress crops with organic mulches is the absolute fastest and most cost-effective method to survive engineered drought weeks.
                      </div>
                    </div>
                  )}

                  {/* FAQ trigger button / extra 3D styled elements */}
                  <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-950/40 p-4 rounded-lg border border-slate-850 gap-4 mt-2">
                    <div className="space-y-0.5 text-left">
                      <span className="text-[8px] font-mono text-cyan-400 font-bold block uppercase font-mono">Need Additional Guidance?</span>
                      <p className="text-[11px] text-slate-400 font-medium">Read FAQs and explore water system documentation details</p>
                    </div>
                    <button 
                      onClick={() => {
                        showToast("Opening AquaSetu Full Documentation PDF Reference... (Downloaded)");
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-[10px] font-mono rounded-lg border-b-4 border-slate-950 hover:border-slate-900 active:border-b-0 active:translate-y-[4px] cursor-pointer transition-all uppercase"
                    >
                      📖 View Complete Academy Blueprint
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

        </main>
      </div>

      {/* Persistent floating / SOS modals */}
      <SOSButton 
        isOpen={isSosOpen} 
        onClose={() => setIsSosOpen(false)} 
        onSubmitReport={handleAddEmergencyReport}
      />

      {/* Interactive Crop Advisor Chatbot */}
      <CropAdvisorBot />

      {/* Global Command Footer */}
      <Footer />
    </div>
  );
}

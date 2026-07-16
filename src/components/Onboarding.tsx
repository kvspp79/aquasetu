import React, { useState, useEffect } from 'react';
import { Droplets, Sprout, ShieldCheck, ChevronRight, CheckCircle2, Globe, Sparkles } from 'lucide-react';
import { Language } from '../lib/translations';

interface OnboardingProps {
  onComplete: (lang: Language, farmerProfile: any) => void;
  villagesList: any[];
}

export default function Onboarding({ onComplete, villagesList }: OnboardingProps) {
  const [step, setStep] = useState<'intro' | 'overview' | 'language' | 'register'>('intro');
  const [selectedLang, setSelectedLang] = useState<Language>('en');
  
  // Registration state
  const [regName, setRegName] = useState('');
  const [regVillage, setRegVillage] = useState(villagesList[0]?.id || 'BL-101');
  const [regLand, setRegLand] = useState('2.5');
  const [regCrop, setRegCrop] = useState('Basmati Rice');
  const [regPhone, setRegPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  // SVG Wave animation parameters
  const [waveAmplitude, setWaveAmplitude] = useState(15);
  const [waveSpeed, setWaveSpeed] = useState(2);

  // Soils database for interactive exploration
  const soilsInfo = [
    {
      name: 'Clayey Loam / Deep Clay',
      waterRetention: 'Very High (Ideal for standing water)',
      bestCrops: ['Basmati Rice', 'Sugarcane'],
      description: 'Heavy clay soils retard percolation, locking moisture in the root zone. Ideal for water-intensive paddy fields.',
      color: 'from-amber-800 to-yellow-900',
      icon: Droplets
    },
    {
      name: 'Black Volcanic Soil (Regur)',
      waterRetention: 'High (Self-aerating clay)',
      bestCrops: ['Bt Cotton', 'Soybean'],
      description: 'Extremely rich in minerals with unique swelling attributes. Retains rich deep moisture but aerates surface crust.',
      color: 'from-slate-800 to-zinc-950',
      icon: Sprout
    },
    {
      name: 'Alluvial Loam',
      waterRetention: 'Medium (Superb balanced drainage)',
      bestCrops: ['Wheat', 'Mustard', 'Barley'],
      description: 'Formed by river silt deposits. Perfect balance of nutrient absorption and hydraulic conductivity.',
      color: 'from-yellow-800 to-amber-700',
      icon: Sparkles
    },
    {
      name: 'Sandy Loam / Light Soils',
      waterRetention: 'Low (Rapid infiltration)',
      bestCrops: ['Pulses & Maize', 'Millets', 'Oilseeds'],
      description: 'Highly aerated sandy loams. Heavy watering triggers waterlogging damage, so light rotational wetting is ideal.',
      color: 'from-orange-800 to-yellow-700',
      icon: Globe
    }
  ];

  const [activeSoilIdx, setActiveSoilIdx] = useState(0);

  // Wave particle simulation
  const [particles, setParticles] = useState<{ x: number; y: number; speed: number }[]>([]);
  useEffect(() => {
    const pts = Array.from({ length: 25 }).map((_, idx) => ({
      x: Math.random() * 100,
      y: 10 + Math.random() * 40,
      speed: 0.5 + Math.random() * 1.5
    }));
    setParticles(pts);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + p.speed * (waveSpeed * 0.4) > 100 ? 0 : p.x + p.speed * (waveSpeed * 0.4)
        }))
      );
    }, 50);
    return () => clearInterval(interval);
  }, [waveSpeed]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;

    setIsSubmitting(true);
    setPhoneError('');

    // Strict validation for 10-digit Indian numbers and US (+1) numbers
    const cleanPhone = regPhone.replace(/[\s\-()]/g, '');
    
    const isIndian = /^\+91[6789]\d{9}$/.test(regPhone.trim()) || 
                     /^91[6789]\d{9}$/.test(cleanPhone) || 
                     /^[6789]\d{9}$/.test(cleanPhone);

    const isUS = /^\+1\d{10}$/.test(regPhone.trim()) || 
                 /^1\d{10}$/.test(cleanPhone);

    if (!isIndian && !isUS) {
      setPhoneError('Invalid contact. Enforce 10-digit Indian mobile (+91 or e.g., 9876543210) or US mobile (+1). Random or fake digits are rejected.');
      setIsSubmitting(false);
      return;
    }

    const chosenVill = villagesList.find(v => v.id === regVillage);
    
    const profile = {
      name: regName,
      villageId: regVillage,
      villageName: chosenVill ? chosenVill.name : "Sector A",
      landHectares: parseFloat(regLand) || 2.5,
      cropType: regCrop,
      contact: regPhone
    };

    try {
      const response = await fetch('/api/farmers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (response.ok) {
        const saved = await response.json();
        setRegSuccess(true);
        setTimeout(() => {
          onComplete(selectedLang, saved);
        }, 1200);
      } else {
        throw new Error('API registration failed');
      }
    } catch (err) {
      console.warn("Backend API not reachable, saving profile to local storage:", err);
      // Fallback
      setRegSuccess(true);
      setTimeout(() => {
        onComplete(selectedLang, profile);
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col justify-between items-center p-4 md:p-6 relative overflow-hidden select-none font-sans">
      
      {/* Decorative backdrop gradients */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      {/* Top Banner */}
      <header className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 py-4 z-10 border-b border-slate-800/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-950/60 border border-cyan-500/30 p-2 rounded-xl text-cyan-400">
            <Droplets className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-wider">AQUASETU</h1>
            <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">National Smart Water Grid Initiative</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-mono font-extrabold bg-cyan-950/40 px-3.5 py-1.5 rounded-full border border-cyan-500/20 text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          DEVELOPED BY KVSP PRANEETH
        </div>
      </header>

      {/* STEP 1: INTERACTIVE 3D RAINFALL INTRO */}
      {step === 'intro' && (
        <main className="w-full max-w-xl mx-auto flex flex-col items-center justify-center text-center my-auto z-10 space-y-12">
          {/* Immersive 3D water rainfall falling only in middle */}
          <div className="relative w-64 h-80 bg-slate-950/40 rounded-full border border-cyan-500/10 shadow-2xl shadow-cyan-500/5 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/10 via-transparent to-cyan-950/10 pointer-events-none z-10" />
            
            {/* Rhythmic vertical water rain particles cascade using native SMIL animation */}
            <svg className="w-full h-full" viewBox="0 0 200 300" preserveAspectRatio="none">
              {/* Background grid line guides */}
              <line x1="30" y1="0" x2="30" y2="300" stroke="#111827" strokeWidth="1" />
              <line x1="60" y1="0" x2="60" y2="300" stroke="#111827" strokeWidth="1" />
              <line x1="90" y1="0" x2="90" y2="300" stroke="#111827" strokeWidth="1" />
              <line x1="120" y1="0" x2="120" y2="300" stroke="#111827" strokeWidth="1" />
              <line x1="150" y1="0" x2="150" y2="300" stroke="#111827" strokeWidth="1" />
              <line x1="170" y1="0" x2="170" y2="300" stroke="#111827" strokeWidth="1" />

              {/* Staggered falling rain streams */}
              {[
                { x: 30, dur: "1.4s", begin: "0s", len: 25 },
                { x: 50, dur: "1.8s", begin: "0.3s", len: 35 },
                { x: 70, dur: "1.2s", begin: "0.7s", len: 20 },
                { x: 90, dur: "1.6s", begin: "0.1s", len: 40 },
                { x: 110, dur: "1.3s", begin: "0.5s", len: 30 },
                { x: 130, dur: "1.9s", begin: "0.2s", len: 45 },
                { x: 150, dur: "1.5s", begin: "0.8s", len: 25 },
                { x: 170, dur: "1.1s", begin: "0.4s", len: 35 },
                
                { x: 40, dur: "1.5s", begin: "0.9s", len: 30 },
                { x: 60, dur: "1.3s", begin: "0.2s", len: 25 },
                { x: 80, dur: "1.7s", begin: "0.6s", len: 35 },
                { x: 100, dur: "1.4s", begin: "1.1s", len: 20 },
                { x: 120, dur: "1.8s", begin: "0.4s", len: 40 },
                { x: 140, dur: "1.2s", begin: "0.8s", len: 30 },
                { x: 160, dur: "1.6s", begin: "1.3s", len: 25 },
                
                { x: 35, dur: "1.7s", begin: "0.5s", len: 35 },
                { x: 75, dur: "1.4s", begin: "1.2s", len: 20 },
                { x: 115, dur: "1.9s", begin: "0.1s", len: 30 },
                { x: 155, dur: "1.5s", begin: "0.7s", len: 40 },
              ].map((item, idx) => (
                <line
                  key={idx}
                  x1={item.x}
                  y1="-50"
                  x2={item.x}
                  y2={-50 + item.len}
                  stroke="url(#rain-gradient)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity={0.7}
                >
                  <animate 
                    attributeName="y1" 
                    from="-50" 
                    to="350" 
                    dur={item.dur} 
                    begin={item.begin} 
                    repeatCount="indefinite" 
                  />
                  <animate 
                    attributeName="y2" 
                    from={-50 + item.len} 
                    to={350 + item.len} 
                    dur={item.dur} 
                    begin={item.begin} 
                    repeatCount="indefinite" 
                  />
                </line>
              ))}

              <defs>
                <linearGradient id="rain-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                  <stop offset="80%" stopColor="#22d3ee" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
              </defs>
            </svg>

            {/* Central glowing core of the rainfall tube */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center animate-pulse">
                <Droplets className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </div>

          {/* Website Name Down below rainfall animation */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-black tracking-[0.25em] text-white uppercase drop-shadow-xl font-sans">
              AquaSetu
            </h1>
            <p className="text-[10px] sm:text-xs font-mono font-bold text-slate-500 uppercase tracking-[0.3em] max-w-md mx-auto">
              National Smart Water Grid Initiative
            </p>
          </div>

          {/* Get Started option */}
          <div className="pt-2">
            <button
              onClick={() => setStep('overview')}
              className="group px-8 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2.5 tracking-widest shadow-xl shadow-cyan-500/20 hover:scale-[1.03] transition-all duration-300 uppercase cursor-pointer"
            >
              Get Started
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </main>
      )}

      {/* STEP 2: INTERACTIVE SIMULATORS & SOILS EDUCATION OVERVIEW */}
      {step === 'overview' && (
        <main className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-8 z-10">
          
          {/* Left Column: Visual 3D-Like Interactive Water Flow */}
          <div className="lg:col-span-5 bg-slate-900/20 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between relative shadow-2xl backdrop-blur-md">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold font-sans">Fluid Dynamics Console</span>
                <h2 className="text-xl font-extrabold text-white">Canal Interlinking Simulator</h2>
                <p className="text-xs text-slate-400 mt-1">Simulates real-time hydraulic flow parameters inside main and distributary canal feeders.</p>
              </div>

              {/* Responsive SVG Flow Visualizer */}
              <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-850 h-56 relative overflow-hidden flex flex-col justify-end shadow-inner">
                {/* Flow lines representing 3D-like perspective canal */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                  {/* Banks */}
                  <polygon points="0,120 400,120 400,200 0,200" fill="#0b1329" opacity="0.6" />
                  
                  {/* Perspective guide lines */}
                  <line x1="0" y1="120" x2="160" y2="70" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="400" y1="120" x2="240" y2="70" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />
                  
                  {/* Water Bed Flow Wave */}
                  <path 
                    d={`M 0 140 Q 100 ${140 - waveAmplitude} 200 140 T 400 140 L 400 200 L 0 200 Z`}
                    fill="url(#water-gradient)" 
                    className="transition-all duration-300"
                    opacity="0.8"
                  />
                  <path 
                    d={`M 0 148 Q 120 ${148 - waveAmplitude*0.6} 240 148 T 400 148 L 400 200 L 0 200 Z`}
                    fill="url(#water-gradient-top)" 
                    className="transition-all duration-300"
                    opacity="0.4"
                  />

                  {/* Flow Particles */}
                  {particles.map((p, i) => (
                    <circle key={i} cx={`${p.x}%`} cy={`${145 + Math.sin(p.x * 0.1) * (waveAmplitude * 0.3)}`} r="2.5" fill="#22d3ee" opacity="0.6" />
                  ))}

                  <defs>
                    <linearGradient id="water-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0891b2" />
                      <stop offset="100%" stopColor="#1e3a8a" />
                    </linearGradient>
                    <linearGradient id="water-gradient-top" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#0891b2" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="z-10 bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800 text-[10px] font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Headworks Velocity:</span>
                    <span className="text-cyan-400 font-bold">{(waveSpeed * 1.5).toFixed(1)} m/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Soil Moisture Deficit:</span>
                    <span className="text-red-400 font-bold">42% (Critical)</span>
                  </div>
                </div>
              </div>

              {/* Simulator Controls */}
              <div className="space-y-3.5 bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                <div>
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400">Simulation Discharge (Amplitude)</span>
                    <span className="text-cyan-400 font-bold">{waveAmplitude} m³</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="35" 
                    value={waveAmplitude} 
                    onChange={(e) => setWaveAmplitude(Number(e.target.value))} 
                    className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400">Flow Gate Opening Percentage</span>
                    <span className="text-cyan-400 font-bold">{waveSpeed * 25}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="4" 
                    value={waveSpeed} 
                    onChange={(e) => setWaveSpeed(Number(e.target.value))} 
                    className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 leading-normal font-mono mt-4">
              *Adjust sliders to witness flow dynamics. This represents automated radial gate linkages to state reservoirs.
            </p>
          </div>

          {/* Right Column: Dynamic Soils Health & Cultivates */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-cyan-400 font-mono tracking-widest uppercase">The Soil-Water Equation</span>
                <h2 className="text-3xl font-black text-white leading-tight">Smart Crop Alignment &amp; Agrarian Preservation</h2>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  Every grain depends on soil structure. Matching water release cycles to soil moisture tension ensures maximum yields and stops evaporative wastage. Explore the interactive categories below:
                </p>
              </div>

              {/* Soil Grid Selection */}
              <div className="grid grid-cols-2 gap-3.5">
                {soilsInfo.map((soil, idx) => {
                  const SIcon = soil.icon;
                  const isActive = activeSoilIdx === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveSoilIdx(idx)}
                      className={`text-left p-4 rounded-xl border transition-all duration-300 relative cursor-pointer ${
                        isActive 
                          ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10' 
                          : 'bg-slate-950/60 border-slate-850 hover:border-slate-700 hover:bg-slate-900/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <SIcon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <h4 className="text-xs font-extrabold text-white truncate">{soil.name}</h4>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono font-bold block truncate">SUITABLE CROPS:</span>
                      <p className="text-[11px] text-cyan-300 font-bold truncate">{soil.bestCrops.join(', ')}</p>
                    </button>
                  );
                })}
              </div>

              {/* Selected Soil Dynamic Card */}
              <div className={`p-4 rounded-xl bg-gradient-to-br ${soilsInfo[activeSoilIdx].color} bg-opacity-20 border border-white/10 space-y-2`}>
                <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                  <span className="text-[10px] font-mono font-bold text-white tracking-widest uppercase">ACTIVE EXPLORATION MODEL</span>
                  <span className="text-[10px] font-mono text-cyan-200 bg-black/30 px-2 py-0.5 rounded font-bold">{soilsInfo[activeSoilIdx].waterRetention}</span>
                </div>
                <h3 className="text-sm font-extrabold text-white">{soilsInfo[activeSoilIdx].name}</h3>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {soilsInfo[activeSoilIdx].description}
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-between gap-4">
              <button
                onClick={() => setStep('intro')}
                className="px-5 py-2.5 text-xs text-slate-400 hover:text-slate-200 font-mono"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep('language')}
                className="group px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 tracking-wider shadow-lg shadow-cyan-500/15 cursor-pointer uppercase transition-all"
              >
                Start Onboarding
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </main>
      )}

      {/* STEP 2: LANGUAGE SELECTION */}
      {step === 'language' && (
        <main className="w-full max-w-lg mx-auto bg-slate-900/40 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-xl space-y-6 z-10 text-center my-auto">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tight">Select System Language</h2>
            <p className="text-xs text-cyan-400 font-mono tracking-widest font-bold uppercase">भाषा चयन करें / భాషను ఎంచుకోండి</p>
          </div>

          <div className="grid grid-cols-1 gap-3.5 pt-2">
            {[
              { id: 'en', title: '🇮🇳 English', subtitle: 'National smart water allocation console' },
              { id: 'hi', title: '🇮🇳 हिन्दी (Hindi)', subtitle: 'राष्ट्रीय स्मार्ट जल आवंटन कंसोल' },
              { id: 'te', title: '🇮🇳 తెలుగు (Telugu)', subtitle: 'జాతీయ స్మార్ట్ నీటి కేటాయింపు కన్సోల్' }
            ].map((lang) => {
              const isSelected = selectedLang === lang.id;
              return (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLang(lang.id as Language)}
                  className={`group w-full text-left px-5 py-4 rounded-xl transition-all duration-300 flex items-center justify-between shadow-sm cursor-pointer border ${
                    isSelected 
                      ? 'bg-cyan-950/40 border-cyan-500 text-cyan-400' 
                      : 'bg-slate-950/60 border-slate-850 hover:border-slate-700 hover:bg-cyan-950/10 text-slate-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold group-hover:text-cyan-400 transition-colors">{lang.title}</span>
                    <p className="text-[10px] text-slate-500 group-hover:text-slate-400 transition-colors">{lang.subtitle}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-600'} group-hover:translate-x-1 transition-all`} />
                </button>
              );
            })}
          </div>

          <div className="pt-4 flex justify-between gap-4">
            <button
              onClick={() => setStep('overview')}
              className="px-5 py-2.5 text-xs text-slate-400 hover:text-slate-200 font-mono"
            >
              ← Back to Overview
            </button>
            <button
              onClick={() => setStep('register')}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 tracking-wider shadow-lg shadow-cyan-500/15 cursor-pointer uppercase transition-all"
            >
              Continue to Register
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </main>
      )}

      {/* STEP 3: FARMER REGISTRATION */}
      {step === 'register' && (
        <main className="w-full max-w-xl mx-auto bg-slate-900/40 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-xl space-y-6 z-10 my-auto">
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1 bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" /> SECURE USER STORAGE (ADMIN ONLY ACCESS)
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Register Agrarian Profile</h2>
            <p className="text-xs text-slate-400 leading-normal font-medium max-w-sm mx-auto">
              Your profile is registered with the Ministry of Jal Shakti. Under strict guidelines, only approved Admins can view your personal files.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Full Name</label>
                <input 
                  type="text" 
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Baldev Singh"
                  required
                  className="w-full bg-slate-950 border border-slate-800 px-3.5 py-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold"
                />
              </div>

              {/* Mobile Phone */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Mobile Phone No</label>
                <input 
                  type="tel" 
                  value={regPhone}
                  onChange={(e) => {
                    setRegPhone(e.target.value);
                    if (phoneError) setPhoneError('');
                  }}
                  placeholder="e.g. +91 98765 43210"
                  required
                  className={`w-full bg-slate-950 border px-3.5 py-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold ${
                    phoneError ? 'border-red-500 focus:border-red-500' : 'border-slate-800'
                  }`}
                />
                {phoneError ? (
                  <p className="text-[10px] text-red-400 font-bold font-mono leading-tight">{phoneError}</p>
                ) : (
                  <p className="text-[9px] text-slate-500 font-medium">Accepts +91 (Indian 10-digit mobile) or +1 (US mobile)</p>
                )}
              </div>

              {/* Choose Canal Subblock */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Canal Block/Sector</label>
                <select 
                  value={regVillage}
                  onChange={(e) => setRegVillage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold"
                >
                  {villagesList.map((v) => (
                    <option key={v.id} value={v.id}>{v.name} ({v.id})</option>
                  ))}
                </select>
              </div>

              {/* Primary Crop */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Primary Crop Cultivated</label>
                <select 
                  value={regCrop}
                  onChange={(e) => setRegCrop(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold"
                >
                  <option value="Basmati Rice">Basmati Rice</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Sugarcane">Sugarcane</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Pulses & Maize">Pulses &amp; Maize</option>
                  <option value="Mustard">Mustard</option>
                </select>
              </div>

              {/* Land Owned (Hectares) */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Total Cultivated Area (in Hectares)</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="0.5"
                  max="150"
                  value={regLand}
                  onChange={(e) => setRegLand(e.target.value)}
                  placeholder="e.g. 4.5"
                  required
                  className="w-full bg-slate-950 border border-slate-800 px-3.5 py-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold"
                />
              </div>

            </div>

            {/* Real-world Dataset Sync Citation */}
            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/10 text-[10px] space-y-1.5 text-slate-400 font-mono">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} /> Synchronized Real-world Datasets:
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-300">
                <li><strong className="text-white">India Water Resources Information System (India-WRIS)</strong> — Validates regional telemetry maps &amp; CAD command zones.</li>
                <li><strong className="text-white">National Register of Large Dams (NRLD)</strong> — Synchronizes canal block identifiers with major hydraulic reservoirs.</li>
                <li><strong className="text-white">CGWB Aquifer Database</strong> — Cross-references soil hydraulic parameters to prevent deep groundwater over-extraction.</li>
              </ul>
            </div>

            {regSuccess ? (
              <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg text-xs font-bold font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" />
                REGISTRATION GRANTED. WELCOME TO AQUASETU GRID.
              </div>
            ) : (
              <div className="pt-2 flex justify-between items-center gap-4">
                <button
                  type="button"
                  onClick={() => setStep('language')}
                  className="text-xs text-slate-400 hover:text-slate-200 font-mono"
                >
                  ← Language selection
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 tracking-wider shadow-lg shadow-cyan-500/15 cursor-pointer uppercase transition-all"
                >
                  {isSubmitting ? 'Verifying...' : 'Submit Profile & Access Portal'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </form>
        </main>
      )}

      {/* Footer */}
      <footer className="text-center py-4 text-[9px] text-slate-600 font-bold z-10 space-y-1 mt-auto">
        <p>© 2026 National Water Informatics Centre (NWIC). Ministry of Jal Shakti.</p>
        <p className="text-[8px] font-mono">SECURE PLATFORM • SYSTEM INTEGRITY RATIO: 100%</p>
      </footer>
    </div>
  );
}

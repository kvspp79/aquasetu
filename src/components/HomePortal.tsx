import React from 'react';
import { ArrowRight, HelpCircle, ShieldAlert, Cpu, BarChart3, Users, Droplets } from 'lucide-react';
import { Language, translations } from '../lib/translations';
import ThreeBackground from './ThreeBackground';

interface HomePortalProps {
  onSelectTab: (tab: string) => void;
  activeSosCount: number;
  currentLanguage: Language;
}

export default function HomePortal({ onSelectTab, activeSosCount, currentLanguage }: HomePortalProps) {
  const t = translations[currentLanguage] || translations.en;

  const stats = [
    { label: t.metrics.canals, value: '4 Main, 28 Distributaries', icon: Droplets, color: 'text-amber-800' },
    { label: t.metrics.villages, value: '100 Active Blocks', icon: Users, color: 'text-amber-700' },
    { label: t.metrics.waterSaved, value: '34,200 m³ (Avg 14%)', icon: Cpu, color: 'text-amber-800' },
    { label: t.metrics.disputes, value: '82% Reduction', icon: BarChart3, color: 'text-yellow-800' }
  ];

  const featuresLocal = {
    en: [
      {
        title: 'Explainable AI (XAI)',
        desc: 'No black-box decisions. Generates plain-language legal & environmental justifications for every gate adjustments, tailored to local dialects.',
        icon: HelpCircle
      },
      {
        title: 'Fair Allocation Engine',
        desc: 'Implements game-theoretic Nash Cooperative Bargaining to model village water needs as active bidding agents during shortages.',
        icon: Cpu
      },
      {
        title: 'Jal Shakti Government Ready',
        desc: 'Designed strictly under Command Area Development and Participatory Irrigation Management (PIM) guidelines.',
        icon: ShieldAlert
      },
      {
        title: 'Real-Time SCADA Control',
        desc: 'Monitors radial gate telemetry and provides SCADA digital override controls for district collectors and engineers.',
        icon: Droplets
      }
    ],
    hi: [
      {
        title: 'व्याख्या योग्य एआई (XAI)',
        desc: 'कोई ब्लैक-बॉक्स निर्णय नहीं। स्थानीय बोलियों के अनुकूल, प्रत्येक गेट समायोजन के लिए स्पष्ट कानूनी और पर्यावरणीय स्पष्टीकरण उत्पन्न करता है।',
        icon: HelpCircle
      },
      {
        title: 'निष्पक्ष आवंटन इंजन',
        desc: 'कमी के दौरान ग्राम जल आवश्यकताओं को सक्रिय बोलीदाताओं के रूप में मॉडल करने के लिए नैश सहकारी सौदेबाजी सिद्धांत लागू करता है।',
        icon: Cpu
      },
      {
        title: 'जल शक्ति सरकार हेतु तैयार',
        desc: 'कमांड एरिया डेवलपमेंट और सहभागी सिंचाई प्रबंधन (PIM) के राष्ट्रीय दिशानिर्देशों के तहत निर्मित।',
        icon: ShieldAlert
      },
      {
        title: 'वास्तविक समय स्काडा नियंत्रण',
        desc: 'रेडियल गेट टेलीमेट्री की निगरानी करता है और जिला कलेक्टरों और अभियंताओं के लिए स्काडा डिजिटल नियंत्रण प्रदान करता है।',
        icon: Droplets
      }
    ],
    te: [
      {
        title: 'వివరణాత్మక AI (XAI)',
        desc: 'బ్లాక్-బాక్స్ నిర్ణయాలు లేవు. ప్రతి గేట్ సర్దుబాట్లకు స్థానిక భాషలలో వివరణాత్మక చట్టపరమైన మరియు పర్యావరణ సమర్థనలను ఉత్పత్తి చేస్తుంది.',
        icon: HelpCircle
      },
      {
        title: 'సమగ్ర కేటాయింపు ఇంజిన్',
        desc: 'నీటి కొరత సమయంలో గ్రామ నీటి అవసరాలను బిడ్డింగ్ ఏజెంట్లుగా రూపొందించడానికి నాష్ సహకార బేరసారాల సిద్ధాంతాన్ని అమలు చేస్తుంది.',
        icon: Cpu
      },
      {
        title: 'జల శక్తి ప్రభుత్వ ప్రమాణాలకు అనుగుణంగా',
        desc: 'కమాండ్ ఏరియా డెవలప్‌మెంట్ మరియు భాగస్వామ్య నీటి పారుదల నిర్వహణ (PIM) జాతీయ మార్గదర్శకాల ప్రకారం రూపొందించబడింది.',
        icon: ShieldAlert
      },
      {
        title: 'రియల్ టైమ్ SCADA నియంత్రణ',
        desc: 'రేడియల్ గేట్ టెలిమెట్రీని పర్యవేక్షిస్తుంది మరియు జిల్లా కలెక్టర్లు మరియు ఇంజనీర్ల కోసం డిజిటల్ ఓవర్‌రైడ్ నియంత్రణలను అందిస్తుంది.',
        icon: Droplets
      }
    ]
  };

  const features = featuresLocal[currentLanguage] || featuresLocal.en;

  const stepsLocal = {
    en: [
      { step: '1', title: 'Collect Data', desc: 'Moisture sensors & satellite Kc index updates.' },
      { step: '2', title: 'Fetch Demands', desc: 'Farmers submit crop water requirements.' },
      { step: '3', title: 'Run Multi-Agent', desc: 'Agents model priority based on soil deficit.' },
      { step: '4', title: 'Optimize Alloc', desc: 'Linear GLOP solver outputs flow quotas.' },
      { step: '5', title: 'Officer Sign-off', desc: 'Canal Engineers review & approve schedule.' },
      { step: '6', title: 'SCADA Dispatch', desc: 'Radial gates adjust flows automatically.' }
    ],
    hi: [
      { step: '1', title: 'डेटा संग्रह', desc: 'नमी सेंसर और उपग्रह केसी सूचकांक अपडेट।' },
      { step: '2', title: 'मांग का संकलन', desc: 'किसान फसल जल आवश्यकताओं को जमा करते हैं।' },
      { step: '3', title: 'मल्टी-एजेंट विश्लेषण', desc: 'एजेंट मिट्टी की कमी के आधार पर प्राथमिकता तय करते हैं।' },
      { step: '4', title: 'आवंटन अनुकूलन', desc: 'रैखिक ग्लोप सॉल्वर प्रवाह कोटा जारी करता है।' },
      { step: '5', title: 'अधिकारी अनुमोदन', desc: 'नहर इंजीनियर शेड्यूल की समीक्षा और अनुमोदन करते हैं।' },
      { step: '6', title: 'स्काडा प्रेषण', desc: 'रेडियल गेट स्वचालित रूप से प्रवाह को समायोजित करते हैं।' }
    ],
    te: [
      { step: '1', title: 'డేటా సేకరణ', desc: 'తేమ సెన్సార్లు మరియు ఉపగ్రహ Kc ఇండెక్స్ నవీకరణలు.' },
      { step: '2', title: 'డిమాండ్ల సేకరణ', desc: 'రైతులు పంట నీటి అవసరాలను సమర్పిస్తారు.' },
      { step: '3', title: 'మల్టీ-ఏజెంట్ రన్', desc: 'నేల కొరత ఆధారంగా ఏజెంట్లు ప్రాధాన్యతను మోడల్ చేస్తారు.' },
      { step: '4', title: 'ఆప్టిమైజ్ కేటాయింపు', desc: 'లీనియర్ GLOP సాల్వర్ ఫ్లో కోటాలను అవుట్‌పుట్ చేస్తుంది.' },
      { step: '5', title: 'అధికారి సంతకం', desc: 'కాలువ ఇంజనీర్లు షెడ్యూల్‌ను సమీక్షించి ఆమోదిస్తారు.' },
      { step: '6', title: 'SCADA పంపిణీ', desc: 'రేడియల్ గేట్లు స్వయంచాలకంగా ప్రవాహాన్ని సర్దుబాటు చేస్తాయి.' }
    ]
  };

  const steps = stepsLocal[currentLanguage] || stepsLocal.en;

  return (
    <div className="relative space-y-8 min-h-screen z-10 text-amber-950">
      <ThreeBackground />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-100/60 to-yellow-100/40 border border-amber-200/80 rounded-xl p-6 md:p-10 shadow-lg shadow-amber-200/5 backdrop-blur-md">
        {/* Animated river simulation inside Hero */}
        <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-0 w-full h-24 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 blur-2xl rounded-full animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(#b45309_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900 bg-yellow-200/60 border border-yellow-400/40 px-2.5 py-0.5 rounded-full shadow-xs">
            National Smart Water Grid Mission
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-amber-950 leading-tight font-sans">
            {t.welcomeTitle}
          </h1>
          <p className="text-xs md:text-sm text-amber-900/80 max-w-2xl leading-relaxed font-semibold">
            {t.welcomeSubtitle}
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              id="hero-go-engine-btn"
              onClick={() => onSelectTab('decision_engine')}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-md shadow-amber-500/10 flex items-center gap-1.5 transition-all cursor-pointer border border-amber-700"
            >
              {t.launchEngine}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              id="hero-go-about-btn"
              onClick={() => onSelectTab('knowledge_centre')}
              className="bg-amber-100/60 hover:bg-amber-200/60 text-amber-900 hover:text-amber-950 border border-amber-200 font-bold text-xs px-5 py-2.5 rounded-lg transition-all cursor-pointer shadow-sm"
            >
              {t.learnMore}
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="space-y-3">
        <div className="px-1">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-800/85 font-mono">
            Command Area National Metrics
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 shadow-sm hover:border-amber-300 transition-all flex flex-col justify-between h-28 backdrop-blur-md">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-amber-800/80 font-bold">{stat.label}</span>
                  <div className="p-1.5 rounded-lg bg-yellow-100 border border-yellow-200 text-amber-800 shadow-xs">
                    <Icon className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                </div>
                <div className="text-sm md:text-base font-black text-amber-950 font-mono">{stat.value}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-amber-100/35 border border-amber-200/80 rounded-xl p-5 space-y-4 backdrop-blur-md">
        <div>
          <h3 className="text-xs font-black text-amber-950 mb-0.5 uppercase tracking-wider">
            {currentLanguage === 'hi' ? 'अनुकूली जल प्रेषण चक्र' : currentLanguage === 'te' ? 'అనుకూల నీటి పంపిణీ చక్రం' : 'Adaptive Water Dispatch Cycle'}
          </h3>
          <p className="text-[10px] text-amber-800/80 font-mono">
            {currentLanguage === 'hi' ? 'कमांड क्षेत्रों में दैनिक रूप से निष्पादित 6-चरणीय एल्गोरिथम लूप' : currentLanguage === 'te' ? 'కమాండ్ జోన్‌లలో ప్రతిరోజూ అమలు చేయబడే 6-దశల అల్గోరిథమిక్ లూప్' : 'The 6-stage algorithmic loop executing daily across command zones'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
          {steps.map((item, idx) => (
            <div key={idx} className="bg-amber-50/70 p-3 rounded-lg border border-amber-200/80 flex flex-col justify-between space-y-2 relative h-32 backdrop-blur-xs">
              <span className="text-xl font-black text-amber-500/10 font-mono absolute top-1 right-2">0{item.step}</span>
              <div>
                <h4 className="font-bold text-amber-950 mb-0.5 text-xs">{item.title}</h4>
                <p className="text-amber-900/80 leading-normal text-[10px] font-semibold">{item.desc}</p>
              </div>
              {idx < 5 && (
                <div className="hidden lg:block absolute right-[-8px] top-1/2 -translate-y-1/2 z-10 text-amber-400 font-black text-xs">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-3">
        <div className="px-1">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-800/85 font-mono">
            Technological Capabilities
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 shadow-sm flex items-start gap-3 backdrop-blur-md">
                <div className="bg-yellow-100 p-2.5 rounded-lg border border-yellow-200 text-amber-800 shrink-0 shadow-xs">
                  <Icon className="w-4 h-4 text-amber-700" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-amber-950">{feat.title}</h4>
                  <p className="text-[11px] text-amber-900/80 leading-normal font-semibold">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

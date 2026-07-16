import { 
  Home, BrainCircuit, Sprout, Building2, BookOpen
} from 'lucide-react';
import { Language, translations } from '../lib/translations';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  currentRole: string;
  currentLanguage: Language;
}

export default function Sidebar({ activeTab, onSelectTab, currentRole, currentLanguage }: SidebarProps) {
  const t = translations[currentLanguage] || translations.en;

  // Streamlined and highly simplified primary modules for pristine navigation without clutter
  const navItems = [
    { id: 'home', label: currentLanguage === 'hi' ? 'मुख्य राष्ट्रीय पोर्टल' : currentLanguage === 'te' ? 'జాతీయ ప్రధాన పోర్టల్' : 'National Grid Portal', icon: Home, roles: ['all'] },
    { id: 'decision_engine', label: currentLanguage === 'hi' ? 'एआई निर्णय अनुकूलक' : currentLanguage === 'te' ? 'AI నిర్ణయ ఆప్టిమైజర్' : 'AI Decision Optimizer', icon: BrainCircuit, roles: ['all'] },
    { id: 'farmer_dashboard', label: currentLanguage === 'hi' ? 'स्मार्ट किसान सलाहकार' : currentLanguage === 'te' ? 'స్మార్ట్ రైతు సలహాదారు' : 'Smart Farmer Advisor', icon: Sprout, roles: ['all'] },
    { id: 'gov_dashboard', label: currentLanguage === 'hi' ? 'कमांड और ऑपरेशन्स' : currentLanguage === 'te' ? 'కమాండ్ & ఆపరేషన్స్' : 'Command & Operations Room', icon: Building2, roles: ['all'] },
    { id: 'knowledge_centre', label: currentLanguage === 'hi' ? 'इंटरैक्टिव सहायता और अकादमी' : currentLanguage === 'te' ? 'ఇంటరాక్టివ్ సహాయం & అకాడమీ' : 'Interactive Help & Academy', icon: BookOpen, roles: ['all'] }
  ];

  return (
    <aside className="w-80 bg-amber-50/85 border-r border-amber-200/80 flex flex-col justify-between shrink-0 h-[calc(100vh-64px)] overflow-y-auto backdrop-blur-md relative shadow-sm z-30">
      {/* Navigation Links */}
      <div className="p-5 flex-1 space-y-2">
        <div className="px-4 mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-800/90 font-mono">
            National Grid Modules
          </span>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const hasAccess = item.roles.includes('all') || item.roles.includes(currentRole);
            const isSelected = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-4 px-4.5 py-3.5 rounded-xl text-[12px] font-bold border transition-all relative cursor-pointer select-none bubble-shake-hover ${
                  !hasAccess ? 'opacity-35 cursor-not-allowed hover:bg-transparent border-transparent' : ''
                } ${
                  isSelected
                    ? 'bg-amber-100/75 text-amber-950 border-amber-300 shadow-sm shadow-amber-200/10'
                    : 'text-amber-800 border-transparent'
                }`}
                disabled={!hasAccess}
                title={!hasAccess ? `Access restricted. Switch portal role to access.` : ''}
              >
                {/* Active Indicator Strip */}
                {isSelected && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-3/5 rounded-r-md bg-amber-600 shadow-sm" />
                )}
                
                <Icon className={`w-5 h-5 shrink-0 transition-colors duration-200 ${isSelected ? 'text-amber-800' : 'text-amber-600/70'}`} />
                <span className="truncate leading-none">{item.label}</span>
                
                {isSelected && (
                  <span className="absolute right-4 w-1.5 h-1.5 rounded-full bg-amber-600 shadow-sm shadow-amber-700/40" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Role Notice */}
      <div className="p-5 border-t border-amber-200/80 bg-amber-100/15 font-mono text-[9px] text-amber-800 flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-amber-900">
          <span className="font-extrabold tracking-wider text-[9.5px]">GRID CO-ORDINATION</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
            LIVE
          </span>
        </div>
        <p className="leading-relaxed mt-1 text-[8.5px] text-amber-700/90 font-medium">
          Nash Bargaining Model: <span className="text-amber-950 font-bold">ACTIVE</span><br />
          Canal Blocks Connected: <span className="text-amber-950 font-bold">100 Blocks</span><br />
          Govt Approval Status: <span className="text-amber-950 font-bold">IN PROCESS</span>
        </p>
      </div>
    </aside>
  );
}


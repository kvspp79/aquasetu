import { Droplets, Clock, AlertOctagon, Languages, Calendar, FastForward } from 'lucide-react';
import { Language, translations } from '../lib/translations';

interface NavbarProps {
  currentRole: string;
  onChangeRole: (role: string) => void;
  activeSosCount: number;
  onOpenSosModal: () => void;
  currentLanguage: Language;
  onChangeLanguage: (lang: Language) => void;
  systemDate: string;
  onAdvanceDate: () => void;
}

export default function Navbar({ 
  currentRole, 
  onChangeRole, 
  activeSosCount, 
  onOpenSosModal,
  currentLanguage,
  onChangeLanguage,
  systemDate,
  onAdvanceDate
}: NavbarProps) {
  
  const t = translations[currentLanguage] || translations.en;

  // Streamlined, clean, and real-world roles removing all developer jargon & clutter
  const roles = [
    { id: 'gov_admin', name: currentLanguage === 'hi' ? 'ग्रिड प्रशासक' : currentLanguage === 'te' ? 'గ్రిడ్ అడ్మినిస్ట్రేటర్' : 'Grid Administrator', desc: 'District Collector & Jal Shakti officer oversight' },
    { id: 'village_representative', name: currentLanguage === 'hi' ? 'स्मार्ट किसान' : currentLanguage === 'te' ? 'స్మార్ట్ రైతు' : 'Smart Farmer', desc: 'Local Panchayat representative & agrarian block monitor' }
  ];

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-amber-200/80 bg-amber-50/90 px-6 backdrop-blur-xl text-amber-950 shadow-sm shadow-amber-100/40">
      {/* Brand Logo and Name */}
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600 shadow-lg shadow-amber-500/20 shrink-0">
          <Droplets className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight text-amber-950 font-sans">
              AquaSetu
            </span>
            <span className="text-[9px] bg-yellow-500/20 border border-yellow-400/30 text-amber-800 font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
              Grid Live
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-amber-700 font-bold block">
            {t.ministryName}
          </span>
        </div>
      </div>

      {/* Center - Role Switcher (styled elegantly like a government dashboard controller) */}
      <div className="hidden lg:flex items-center bg-amber-100/50 p-1 rounded-lg border border-amber-200">
        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 px-3 font-mono shrink-0">Portal Access</span>
        <div className="flex gap-1">
          {roles.map((role) => {
            const isActive = currentRole === role.id;
            return (
              <button
                key={role.id}
                id={`role-btn-${role.id}`}
                onClick={() => onChangeRole(role.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap border ${
                  isActive
                    ? 'bg-yellow-200/70 text-amber-950 shadow-sm border-yellow-400/50 font-black'
                    : 'text-amber-800 hover:bg-amber-100 hover:text-amber-950 border-transparent'
                }`}
                title={role.desc}
              >
                {role.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-4">
        {/* Mobile Role selector */}
        <div className="lg:hidden">
          <select
            id="mobile-role-selector"
            value={currentRole}
            onChange={(e) => onChangeRole(e.target.value)}
            className="bg-amber-50 text-amber-950 border border-amber-200 text-xs rounded px-2 py-1 font-semibold focus:outline-none"
          >
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Simulation Calendar Control (date updates automatically) */}
        <div className="flex items-center gap-2 bg-yellow-100/50 px-3 py-1.5 rounded-lg border border-yellow-300/60 font-mono text-xs">
          <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span className="text-amber-900 font-bold">{systemDate}</span>
          <span className="text-[8px] bg-yellow-500/20 border border-yellow-500/30 text-amber-800 px-1.5 py-0.5 rounded flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-amber-600 animate-pulse" />
            AUTO
          </span>
        </div>

        {/* Language Select Dropdown */}
        <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200/80">
          <Languages className="w-3.5 h-3.5 text-amber-700" />
          <select
            id="language-selector-dropdown"
            value={currentLanguage}
            onChange={(e) => onChangeLanguage(e.target.value as Language)}
            className="bg-transparent text-amber-950 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
          >
            <option value="en" className="bg-amber-50 text-amber-950">🇮🇳 EN</option>
            <option value="hi" className="bg-amber-50 text-amber-950">🇮🇳 हिन्दी</option>
            <option value="te" className="bg-amber-50 text-amber-950">🇮🇳 తెలుగు</option>
          </select>
        </div>

        {/* Red SOS Flag Tracker */}
        <button
          id="nav-sos-alert-button"
          onClick={onOpenSosModal}
          className="relative flex items-center gap-2 bg-red-100 border border-red-300/80 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-all duration-300 font-bold text-xs shadow-sm shadow-red-100"
        >
          <AlertOctagon className="w-3.5 h-3.5 text-red-600 animate-pulse" />
          <span className="tracking-wide text-[10px] uppercase font-bold">{t.emergencySos}</span>
          {activeSosCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-amber-50 shadow-md animate-bounce">
              {activeSosCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

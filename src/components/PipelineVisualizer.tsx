import { 
  Database, Scale, Settings, Calculator, FileCheck, Brain, ArrowDown, HelpCircle 
} from 'lucide-react';

export default function PipelineVisualizer() {
  const steps = [
    {
      id: 1,
      title: 'Collect Water Data',
      desc: 'Moisture sensors, Sentinel-2 satellite index, IMD localized weather forecasts, and reservoir storage levels.',
      icon: Database,
      badge: 'SCADA Telemetry',
      color: 'border-blue-500/30 text-blue-400 bg-blue-950/20 shadow-blue-950/10'
    },
    {
      id: 2,
      title: 'Water Demand Agents',
      desc: 'Each village has a crop-agent modeling its water priority. Wheat, rice, pulses negotiate for maximum yield retention.',
      icon: Brain,
      badge: 'Multi-Agent Bidding',
      color: 'border-purple-500/30 text-purple-400 bg-purple-950/20 shadow-purple-950/10'
    },
    {
      id: 3,
      title: 'Legal & Soil Rules',
      desc: 'Validates static water rights, minimum critical survival flow quotas (20%), and ecological river preservation guidelines.',
      icon: Scale,
      badge: 'Static Policy Check',
      color: 'border-amber-500/30 text-amber-400 bg-amber-950/20 shadow-amber-950/10'
    },
    {
      id: 4,
      title: 'Nash Bargaining Solver',
      desc: 'Runs GLOP linear solver to calculate the Nash Equilibrium, balancing Gini fairness with total command area yield.',
      icon: Calculator,
      badge: 'OR-Tools Optimization',
      color: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20 shadow-cyan-950/10'
    },
    {
      id: 5,
      title: 'Audit Ledger Balancing',
      desc: 'Subtracts or credits Water Debts. Under-allocated villages receive future priority boosts directly logged in the Supabase ledger.',
      icon: FileCheck,
      badge: 'Water Debt Ledger',
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20 shadow-emerald-950/10'
    },
    {
      id: 6,
      title: 'Officer Recommendation',
      desc: 'Generates explainable rationale in local dialect & English, prompting the Canal Officer to approve, reject, or SCADA-override.',
      icon: Settings,
      badge: 'Explainable AI (XAI)',
      color: 'border-indigo-500/30 text-indigo-400 bg-indigo-950/20 shadow-indigo-950/10'
    }
  ];

  return (
    <div className="bg-slate-900/30 border border-slate-800 p-4 rounded-lg relative overflow-hidden">
      {/* Background neon dots */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1.5">
          <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded">
            INTELLIGENT DECISION GRID
          </span>
          <h2 className="text-lg font-extrabold text-white">AquaSetu Multi-Agent Decision Pipeline</h2>
          <p className="text-[11px] text-slate-400 max-w-lg mx-auto leading-relaxed">
            How our explainable algorithm translates agricultural SCADA data into equitable river diversion plans daily.
          </p>
        </div>

        {/* Pipeline Map: Staggered flowing cards */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Central Connecting Flow Line */}
          <div className="absolute top-0 left-1/2 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/40 via-cyan-500/40 to-emerald-500/40 hidden md:block -translate-x-1/2" />

          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div 
                key={step.id} 
                className={`relative flex flex-col justify-between p-3.5 rounded-lg border ${step.color} transition-all duration-300 hover:border-slate-700 hover:translate-y-[-2px]`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 shrink-0 shadow-md">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono text-slate-500 font-bold">STAGE {step.id}</span>
                      <span className="text-[9px] font-mono bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded font-medium text-slate-400">
                        {step.badge}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white">{step.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-normal font-sans mt-0.5">{step.desc}</p>
                  </div>
                </div>

                {/* Flow indicators */}
                {idx < steps.length - 1 && (
                  <div className="absolute bottom-[-14px] left-1/2 -translate-x-1/2 z-10 md:hidden flex items-center justify-center">
                    <div className="bg-slate-900 border border-slate-800 p-0.5 rounded text-slate-500">
                      <ArrowDown className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Algorithm details notice */}
        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/60 flex items-start gap-2.5 text-[11px] text-slate-400">
          <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1">
            <h5 className="font-semibold text-slate-300">Explainable Recourse Policy</h5>
            <p className="leading-relaxed">
              If an allocation triggers a critical water deficit (allocated volume &lt; 50% of demand) for any block/village, the multi-agent coordinator automatically initiates a negotiation session using the **Nash Co-operative Bargaining** ledger. The deficit is recorded as a dynamic liability, assuring the local community of prioritized supply during the next canal recharge cycle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

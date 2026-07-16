import { Village, CanalGate, Reservoir, Allocation, EmergencyReport, DecisionLog, KnowledgeArticle } from '../types';

export const initialVillages: Village[] = [
  {
    id: 'V1',
    name: 'Rampur',
    cropType: 'Basmati Rice',
    cropStage: 'Flowering (Critical)',
    population: 3400,
    irrigatedArea: 420,
    waterDemand: 8400,
    soilMoisture: 38,
    distanceFromHead: 4.5,
    priorityScore: 88,
    waterDebt: -1200 // negative means they were underserved recently
  },
  {
    id: 'V2',
    name: 'Kalyanpur',
    cropType: 'Sugarcane',
    cropStage: 'Vegetative Growth',
    population: 2800,
    irrigatedArea: 380,
    waterDemand: 5700,
    soilMoisture: 45,
    distanceFromHead: 12.2,
    priorityScore: 72,
    waterDebt: 200
  },
  {
    id: 'V3',
    name: 'Shivpur',
    cropType: 'Cotton',
    cropStage: 'Yield Formation',
    population: 4100,
    irrigatedArea: 510,
    waterDemand: 7650,
    soilMoisture: 32,
    distanceFromHead: 18.0,
    priorityScore: 92,
    waterDebt: -3400 // high water debt, priority is boosted
  },
  {
    id: 'V4',
    name: 'Daulatpur',
    cropType: 'Wheat (Pre-sowing)',
    cropStage: 'Sowing Preparation',
    population: 1900,
    irrigatedArea: 250,
    waterDemand: 3000,
    soilMoisture: 52,
    distanceFromHead: 24.5,
    priorityScore: 54,
    waterDebt: 400
  },
  {
    id: 'V5',
    name: 'Harigarh',
    cropType: 'Pulses & Maize',
    cropStage: 'Vegetative Growth',
    population: 3100,
    irrigatedArea: 310,
    waterDemand: 4650,
    soilMoisture: 41,
    distanceFromHead: 31.8,
    priorityScore: 68,
    waterDebt: -800
  }
];

export const initialReservoir: Reservoir = {
  name: 'Ganga-Yamuna Link Canal Headworks (Nanak Sagar Reservoir)',
  capacity: 450, // MCM
  currentStorage: 312.4, // MCM (69.4% full)
  inflowRate: 120, // m³/s
  outflowRate: 85, // m³/s
  alertLevel: 'Normal'
};

export const initialGates: CanalGate[] = [
  { id: 'G1', name: 'Main Regulator Gate 1', canalSegment: 'Head Regulator (0.0 km)', currentFlowRate: 85.0, targetFlowRate: 85.0, gateOpeningPercent: 70, status: 'Open' },
  { id: 'G2', name: 'Distributary Gate D-1', canalSegment: 'Rampur Offtake (4.2 km)', currentFlowRate: 15.4, targetFlowRate: 15.4, gateOpeningPercent: 45, status: 'Open' },
  { id: 'G3', name: 'Distributary Gate D-2', canalSegment: 'Kalyanpur Offtake (11.8 km)', currentFlowRate: 11.2, targetFlowRate: 11.2, gateOpeningPercent: 35, status: 'Open' },
  { id: 'G4', name: 'Distributary Gate D-3', canalSegment: 'Shivpur Offtake (17.5 km)', currentFlowRate: 14.8, targetFlowRate: 14.8, gateOpeningPercent: 55, status: 'Open' },
  { id: 'G5', name: 'Distributary Gate D-4', canalSegment: 'Tail-End Regulator (31.0 km)', currentFlowRate: 8.5, targetFlowRate: 8.5, gateOpeningPercent: 25, status: 'Throttled' }
];

export const initialAllocations: Allocation[] = [
  {
    id: 'A1',
    villageId: 'V1',
    villageName: 'Rampur',
    requestedAmount: 8400,
    allocatedAmount: 7800,
    timeSlot: '06:00 AM - 12:00 PM',
    fairnessScore: 92,
    reason: 'BASM-A Agent: Basmati crop is in flowering stage. Slight deficit applied due to overall reservoir conservation, compensated by Rampur\'s low tail-end losses.',
    status: 'Approved'
  },
  {
    id: 'A2',
    villageId: 'V2',
    villageName: 'Kalyanpur',
    requestedAmount: 5700,
    allocatedAmount: 4200,
    timeSlot: '12:00 PM - 06:00 PM',
    fairnessScore: 85,
    reason: 'SUGR-B Agent: Kalyanpur soil moisture is stable at 45%. Water diversion redirected to tail-end Shivpur V3 due to critical cotton vegetative stress.',
    status: 'Approved'
  },
  {
    id: 'A3',
    villageId: 'V3',
    villageName: 'Shivpur',
    requestedAmount: 7650,
    allocatedAmount: 7650,
    timeSlot: '06:00 AM - 12:00 PM',
    fairnessScore: 98,
    reason: 'COTT-C Agent: Maximum priority allocated. Shivpur soil moisture fell to 32% (below wilting coefficient) with crop in yield formation. Prior water debt of -3400 m³ cleared.',
    status: 'Approved'
  },
  {
    id: 'A4',
    villageId: 'V4',
    villageName: 'Daulatpur',
    requestedAmount: 3000,
    allocatedAmount: 1800,
    timeSlot: '06:00 PM - 12:00 AM',
    fairnessScore: 78,
    reason: 'WHEA-D Agent: Wheat is in early sowing preparation stage. Temporary supply rationing implemented; scheduled rainfall forecast (14mm) in next 36 hours will cover deficit.',
    status: 'Approved'
  },
  {
    id: 'A5',
    villageId: 'V5',
    villageName: 'Harigarh',
    requestedAmount: 4650,
    allocatedAmount: 3900,
    timeSlot: '12:00 AM - 06:00 AM',
    fairnessScore: 89,
    reason: 'PULS-E Agent: Distal gate losses are higher (31.8km). Allocation optimized with night-flow scheduling to minimize evaporative losses by 18%.',
    status: 'Approved'
  }
];

export const initialEmergencyReports: EmergencyReport[] = [
  {
    id: 'E1',
    type: 'Canal Breach',
    location: 'Segment 4 (Near Rampur Regulator, km 5.2)',
    description: 'Minor piping observed along left dyke bank. Outflow is pooling into nearby fallow land. Immediate geo-bag wall stabilization required.',
    priority: 'High',
    reportedAt: '2026-07-15T06:12:00',
    status: 'Assigned',
    coordinates: { x: 28, y: 35 }
  },
  {
    id: 'E2',
    type: 'Illegal Diversion',
    location: 'Segment 12 (Kalyanpur Offtake, km 13.5)',
    description: 'Unauthorized diesel pump installation detected drawing water directly from main canal during Kalyanpur offtake lockdown.',
    priority: 'Medium',
    reportedAt: '2026-07-15T07:45:00',
    status: 'Reported',
    coordinates: { x: 48, y: 55 }
  }
];

export const sampleDecisionLogs: DecisionLog[] = [
  {
    id: 'DL-1092',
    timestamp: '2026-07-15 06:00 AM',
    inputSummary: 'Inflow: 120 m³/s | Soil stress critical at V3 (Shivpur) | Predicted rainfall: 2.1mm',
    optimizationObjective: 'Max Gini Fairness Index + Min Crop Loss Penalty Vector',
    explainabilityText: 'The multi-agent coordinator executed Nash Bargaining equilibrium. V3 (Shivpur) priority score was raised to 92 due to accumulated water debt (-3400 m³). Gate opening for D-3 increased by 15% for the morning cycle.',
    fairnessIndex: 0.94,
    approvedBy: 'District Irrigation Engineer K. V. Sharma'
  },
  {
    id: 'DL-1091',
    timestamp: '2026-07-14 06:00 AM',
    inputSummary: 'Inflow: 115 m³/s | Dry cycle, high heat coefficient (38°C)',
    optimizationObjective: 'Max Crop Stress Minimization (OR-Tools Linear Optimization)',
    explainabilityText: 'Optimized morning flows. Kalyanpur (V2) was throttled to divert flow to tail-end Harigarh (V5) which was experiencing mild vegetative crop stress. Evaporative loss modeling adjusted optimal velocities.',
    fairnessIndex: 0.91,
    approvedBy: 'AI Autopilot (Auto-Approval Threshold Met)'
  }
];

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: 'K1',
    title: 'The Ganga-Yamuna Link Canal and Reservoir Interlinking Dynamics',
    category: 'Infrastructure',
    content: `The Ganga-Yamuna Canal Link system constitutes a pinnacle of hydraulic engineering in northern India, designed to distribute river basin flows into water-stressed agricultural districts of western Uttar Pradesh and Haryana. Under the command area development program, water is channeled via feeder canals controlled by mechanical and automated radial gates.
    
    Efficient allocation requires balancing the tail-end deficit syndrome, where distal villages (like Harigarh, situated 31.8km from headworks) receive significantly less water due to percolation losses, evaporation, and upstream over-abstraction. Modern multi-agent AI systems model these segments as connected hydraulic systems, optimizing gate heights dynamically to balance head-to-tail equity.`,
    tags: ['Feeder Canals', 'Tail-End Deficit', 'Radial Gates', 'Command Area']
  },
  {
    id: 'K2',
    title: 'Micro-Climatic Watershed Management in Semiarid India',
    category: 'Watersheds',
    content: `In semiarid agricultural basins, watershed management transcends mere water delivery. It requires monitoring parameters such as soil moisture tension, crop evapotranspiration coefficients (Kc), and soil infiltration capacities.
    
    Basmati Rice (V1) requires constant saturated soils during flowering, with Kc values peaking at 1.20, making it extremely sensitive to moisture deficits. In contrast, Pulses (V5) grown in the tail-end can tolerate moderate dry spells during early vegetative growth. AquaSetu's decision engine leverages these biological crop stages to defer non-critical allocations while safeguarding high-yield cash crops.`,
    tags: ['Evapotranspiration', 'Basmati Kc', 'Soil Moisture Tension', 'Infiltration']
  },
  {
    id: 'K3',
    title: 'Participatory Irrigation Management (PIM) and Water Rights Ledgers',
    category: 'Conservation',
    content: `Under Participatory Irrigation Management (PIM) guidelines from the Ministry of Jal Shakti, Water User Associations (WUAs) comprised of local village representatives hold statutory rights to water allocations. 
    
    AquaSetu translates PIM into the digital era through a transparent 'Water Debt Ledger'. If a village yields its water quota during an acute shortage to a neighboring village with more critical crops, the system logs this as a 'Water Credit'. This credit guarantees them first-priority priority during the next supply surplus, preventing political disputes and building trust among farming communities.`,
    tags: ['Jal Shakti', 'Water User Association', 'Water Debt Ledger', 'PIM']
  }
];

// Historical supply demand data for Recharts (last 7 days)
export const historicalUsageData = [
  { day: 'Mon', Inflow: 110, Demand: 125, Allocated: 105, Fairness: 84 },
  { day: 'Tue', Inflow: 115, Demand: 128, Allocated: 110, Fairness: 87 },
  { day: 'Wed', Inflow: 125, Demand: 130, Allocated: 118, Fairness: 91 },
  { day: 'Thu', Inflow: 120, Demand: 135, Allocated: 115, Fairness: 90 },
  { day: 'Fri', Inflow: 118, Demand: 132, Allocated: 112, Fairness: 89 },
  { day: 'Sat', Inflow: 122, Demand: 125, Allocated: 118, Fairness: 93 },
  { day: 'Sun', Inflow: 120, Demand: 129, Allocated: 121, Fairness: 94 }
];

export const villageDeficitData = [
  { name: 'Rampur', Requested: 8400, Allocated: 7800, SoilMoisture: 38 },
  { name: 'Kalyanpur', Requested: 5700, Allocated: 4200, SoilMoisture: 45 },
  { name: 'Shivpur', Requested: 7650, Allocated: 7650, SoilMoisture: 32 },
  { name: 'Daulatpur', Requested: 3000, Allocated: 1800, SoilMoisture: 52 },
  { name: 'Harigarh', Requested: 4650, Allocated: 3900, SoilMoisture: 41 }
];

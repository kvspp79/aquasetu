import { Village } from '../types';

export interface CropAdvisory {
  cropName: string;
  bestSoilType: string;
  landSuitabilityDesc: string;
  waterRequiredM3PerHectare: number;
  seedsRequiredKgPerHectare: number;
  fertilizersRequiredKgPerHectare: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  pesticidesRecommended: string[];
  thingsToBuy: string[];
  growthCycleDays: number;
  bestTemperatureCelsius: string;
  waterReleaseFrequencyDays: number;
}

export interface HistoricalUsage {
  villageId: string;
  date: string;
  requestedM3: number;
  deliveredM3: number;
  efficiencyPercent: number; // e.g., 85%
  wastedM3: {
    evaporation: number;
    seepage: number;
    theftOrOther: number;
  };
  cultivatedHectares: number;
}

// Comprehensive Crop Advisory database strictly based on official Indian agricultural research guidelines
export const cropAdvisoryDb: Record<string, CropAdvisory> = {
  'Basmati Rice': {
    cropName: 'Basmati Rice',
    bestSoilType: 'Clayey Loam / Clay',
    landSuitabilityDesc: 'Heavy soils with high water retention capacity. Flat terrain with poor drainage is ideal to facilitate prolonged flooding cycles.',
    waterRequiredM3PerHectare: 12000,
    seedsRequiredKgPerHectare: 25,
    fertilizersRequiredKgPerHectare: { nitrogen: 120, phosphorus: 60, potassium: 40 },
    pesticidesRecommended: ['Cartap Hydrochloride 4G (Stem Borer)', 'Tricyclazole 75% WP (Blast disease)', 'Neem Seed Kernel Extract'],
    thingsToBuy: ['High-yield Basmati seeds (Pusa 1121)', 'Urea & Di-Ammonium Phosphate (DAP)', 'Radial gate float markers', 'Soil moisture tensiometers'],
    growthCycleDays: 145,
    bestTemperatureCelsius: '22°C - 32°C',
    waterReleaseFrequencyDays: 4 // continuous shallow flooding, release rotation every 4 days
  },
  'Wheat': {
    cropName: 'Wheat',
    bestSoilType: 'Well-drained Fertile Loam',
    landSuitabilityDesc: 'Medium-textured loamy soils with high organic matter. Gently sloping to flat terrain with excellent drainage works best.',
    waterRequiredM3PerHectare: 4500,
    seedsRequiredKgPerHectare: 100,
    fertilizersRequiredKgPerHectare: { nitrogen: 150, phosphorus: 60, potassium: 40 },
    pesticidesRecommended: ['Propiconazole 25% EC (Yellow rust)', 'Chlorpyriphos 20% EC (Termites)'],
    thingsToBuy: ['Certified HD-2967 or HD-3086 seed varieties', 'NPK Complex fertilizer', 'Broadband weedicides (Clodinafop-propargyl)', 'Seed drilling attachments'],
    growthCycleDays: 130,
    bestTemperatureCelsius: '15°C - 24°C',
    waterReleaseFrequencyDays: 14 // Crown Root Initiation (CRI) cycle, critical irrigations at 21, 42, 65, and 85 days post-sowing
  },
  'Sugarcane': {
    cropName: 'Sugarcane',
    bestSoilType: 'Deep Rich Alluvial Loam / Black Soil',
    landSuitabilityDesc: 'Deep, well-aerated fertile soils with good water-holding capacity and high clay content. Heavy river basin basins are superior.',
    waterRequiredM3PerHectare: 20000,
    seedsRequiredKgPerHectare: 6000, // as cane setts
    fertilizersRequiredKgPerHectare: { nitrogen: 250, phosphorus: 80, potassium: 80 },
    pesticidesRecommended: ['Monocrotophos 36% SL (Early shoot borer)', 'Bavistin (Red rot treatment)'],
    thingsToBuy: ['Disease-free seed setts (Co-86032 / Co-0238)', 'Potash & Single Super Phosphate (SSP)', 'Inter-row cultivators', 'Subsurface drip emitters'],
    growthCycleDays: 365,
    bestTemperatureCelsius: '20°C - 35°C',
    waterReleaseFrequencyDays: 10 // Year-round massive demand, frequent rotational deliveries every 10 days
  },
  'Cotton': {
    cropName: 'Cotton',
    bestSoilType: 'Deep Black Cotton Soil (Regur)',
    landSuitabilityDesc: 'Highly clayey volcanic soils with self-plowing attributes. Requires slow moisture percolation but strictly high surface aeration.',
    waterRequiredM3PerHectare: 7000,
    seedsRequiredKgPerHectare: 15,
    fertilizersRequiredKgPerHectare: { nitrogen: 100, phosphorus: 50, potassium: 50 },
    pesticidesRecommended: ['Imidacloprid 17.8% SL (Sucking pests/whiteflies)', 'Spinosad 45% SC (Bollworm control)'],
    thingsToBuy: ['Bt-Cotton Hybrid Seeds (BG-II)', 'Magnesium Sulphate foliar spray', 'Pheromone traps (pink bollworm)', 'Irrigation siphon tubes'],
    growthCycleDays: 180,
    bestTemperatureCelsius: '21°C - 30°C',
    waterReleaseFrequencyDays: 12 // Critical square formation and boll-burst phases, water release every 12 days
  },
  'Pulses & Maize': {
    cropName: 'Pulses & Maize',
    bestSoilType: 'Sandy Loam to Clayey Loam',
    landSuitabilityDesc: 'Light to medium-textured soil with superb drainage. Excess moisture is highly toxic to root nodulation; slightly elevated uplands are ideal.',
    waterRequiredM3PerHectare: 3500,
    seedsRequiredKgPerHectare: 20,
    fertilizersRequiredKgPerHectare: { nitrogen: 30, phosphorus: 60, potassium: 30 }, // legumes fix nitrogen themselves
    pesticidesRecommended: ['Dimethoate 30% EC (Aphids)', 'Rhizobium Culture inoculant'],
    thingsToBuy: ['High-yield Gram/Pigeonpea seeds', 'Single Super Phosphate (SSP)', 'Gypsum soil conditioner', 'Rotary weeding implements'],
    growthCycleDays: 110,
    bestTemperatureCelsius: '18°C - 27°C',
    waterReleaseFrequencyDays: 20 // Drought resistant, needs light watering every 20 days
  },
  'Mustard': {
    cropName: 'Mustard',
    bestSoilType: 'Alluvial Loam / Light Loam',
    landSuitabilityDesc: 'Light loam with neutral pH. Highly tolerant to dry weather, performs well in semi-arid plains of Rajasthan and Haryana.',
    waterRequiredM3PerHectare: 2500,
    seedsRequiredKgPerHectare: 5,
    fertilizersRequiredKgPerHectare: { nitrogen: 80, phosphorus: 40, potassium: 20 },
    pesticidesRecommended: ['Oxydemeton-methyl (Mustard aphid control)', 'Mancozeb 75% WP (Alternaria blight)'],
    thingsToBuy: ['Pusa Bold or Giriraj seeds', 'Sulphur-containing fertilizers (Gypsum)', 'Sprinkler pipe segments', 'Soil pH test kit'],
    growthCycleDays: 115,
    bestTemperatureCelsius: '15°C - 25°C',
    waterReleaseFrequencyDays: 18 // Highly efficient, needs only 2 primary water releases during flowering and pod filling
  }
};

// Programmatic Generator for exactly 100 distinct sub-blocks along the canal network
export function generate100Villages(): Village[] {
  const cropTypes = ['Basmati Rice', 'Wheat', 'Sugarcane', 'Cotton', 'Pulses & Maize', 'Mustard'];
  const stages = ['Sowing Preparation', 'Vegetative Growth', 'Flowering (Critical)', 'Yield Formation', 'Harvesting Ready'];
  
  const villages: Village[] = [];
  
  // High-fidelity local agricultural regional blocks (names reflecting authentic irrigation sectors in India)
  const prefixNames = [
    'Rampur', 'Kalyanpur', 'Shivpur', 'Daulatpur', 'Harigarh', 
    'Bilaspur', 'Nanakpur', 'Gauripur', 'Sardarnagar', 'Ganganagar', 
    'Hanumangarh', 'Fazilka', 'Muktsar', 'Ferozepur', 'Bathinda', 
    'Rohtak', 'Sonipat', 'Panipat', 'Karnal', 'Kurukshetra',
    'Ambala', 'Yamunanagar', 'Kaithal', 'Jind', 'Hisar',
    'Sirsa', 'Bhiwani', 'Mahendragarh', 'Rewari', 'Jhajjar'
  ];

  const sectorSuffix = ['Sector A', 'Sector B', 'Sub-block 1', 'Sub-block 2', 'Canal Left', 'Canal Right', 'Tail End D-3', 'Head works D-1'];

  for (let i = 1; i <= 100; i++) {
    const prefIndex = (i - 1) % prefixNames.length;
    const suffIndex = Math.floor((i - 1) / prefixNames.length) % sectorSuffix.length;
    const baseName = `${prefixNames[prefIndex]} ${sectorSuffix[suffIndex]}`;
    
    // Determine crop based on index to ensure balanced distribution
    const crop = cropTypes[i % cropTypes.length];
    
    // Correlate crop stage with crop characteristics
    let stage = stages[2]; // default flowering
    if (i % 5 === 0) stage = stages[0];
    else if (i % 5 === 1) stage = stages[1];
    else if (i % 5 === 3) stage = stages[3];
    else if (i % 5 === 4) stage = stages[4];

    const irrigatedArea = 100 + (i * 7) % 450; // 100 to 550 hectares
    
    // Water demand matches crop requirements: Rice/Sugarcane have much higher demand
    let baseDemandPerHa = 15; // m3/day
    if (crop === 'Basmati Rice') baseDemandPerHa = 80;
    else if (crop === 'Sugarcane') baseDemandPerHa = 95;
    else if (crop === 'Cotton') baseDemandPerHa = 45;
    else if (crop === 'Wheat') baseDemandPerHa = 35;

    const waterDemand = Math.round(irrigatedArea * baseDemandPerHa);
    const population = 1200 + (i * 37) % 3800;
    
    // Soil moisture is dynamically correlated with distance from head works and crop stage
    const distanceFromHead = parseFloat((1.2 + (i * 0.35)).toFixed(1)); // 1.2km to 36km
    
    // Distal blocks have less moisture and higher soil stress
    let soilMoisture = Math.max(18, Math.round(55 - (distanceFromHead * 0.9) + (i % 7)));
    if (crop === 'Basmati Rice' && stage === 'Flowering (Critical)') {
      soilMoisture = Math.max(22, soilMoisture - 5); // Rice transpires fast
    }

    // High soil stress boost priority score
    let priorityScore = Math.min(99, Math.max(30, Math.round(100 - soilMoisture + (distanceFromHead * 0.4))));
    if (distanceFromHead > 25) {
      priorityScore = Math.min(99, priorityScore + 10); // Tail-end penalty adjustment
    }

    // Past water debt accumulates for blocks receiving less than demand
    const waterDebt = distanceFromHead > 20 ? -Math.round(waterDemand * 0.45) : Math.round(waterDemand * 0.1);

    villages.push({
      id: `BL-${100 + i}`,
      name: baseName,
      cropType: crop,
      cropStage: stage,
      population,
      irrigatedArea,
      waterDemand,
      soilMoisture,
      distanceFromHead,
      priorityScore,
      waterDebt
    });
  }

  return villages;
}

// Generate past 14-day historical records for all 100 villages, detailing actual flow, seepages, and evaporations
export function generateHistoricalUsage(villages: Village[]): HistoricalUsage[] {
  const history: HistoricalUsage[] = [];
  const dates = [
    '2026-07-14', '2026-07-13', '2026-07-12', '2026-07-11', 
    '2026-07-10', '2026-07-09', '2026-07-08', '2026-07-07'
  ];

  villages.forEach((village, vIdx) => {
    dates.forEach((date, dIdx) => {
      // Deeper canals and closer blocks have better delivery efficiency
      const distModifier = village.distanceFromHead * 0.8;
      const efficiency = Math.max(55, Math.min(96, Math.round(92 - distModifier + (vIdx % 5))));
      
      const requested = village.waterDemand;
      // Closer blocks get more flow; distal gets less unless high priority
      const deliveredPct = distanceFromHeadFactor(village.distanceFromHead, village.priorityScore, dIdx);
      const delivered = Math.round(requested * deliveredPct);
      
      const lossM3 = Math.round(delivered * (1 - efficiency / 100));
      // Seepage is higher for sandy, evaporative is higher for hot days
      const evaporationPct = 0.3 + (dIdx % 3) * 0.1; // 30% - 50% of losses
      const seepagePct = 1 - evaporationPct - 0.05; // remaining is seepage and slight leakage
      
      history.push({
        villageId: village.id,
        date,
        requestedM3: requested,
        deliveredM3: delivered,
        efficiencyPercent: efficiency,
        wastedM3: {
          evaporation: Math.round(lossM3 * evaporationPct),
          seepage: Math.round(lossM3 * seepagePct),
          theftOrOther: Math.round(lossM3 * 0.05)
        },
        cultivatedHectares: village.irrigatedArea
      });
    });
  });

  return history;
}

function distanceFromHeadFactor(distance: number, priority: number, dayIdx: number): number {
  if (priority > 85) return 0.95; // high priority bypasses distance penalty
  if (distance < 8) return 0.9 - (dayIdx * 0.02); // close gets steady flow
  if (distance < 20) return 0.75 - (dayIdx * 0.03); // mid gets decent flow
  return 0.55 - (dayIdx * 0.04); // distal blocks experience highest rotation deficit
}

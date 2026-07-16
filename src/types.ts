export interface Village {
  id: string;
  name: string;
  cropType: string;
  cropStage: string; // Sowing, Vegetative, Flowering, Yield Formation, Harvesting
  population: number;
  irrigatedArea: number; // in hectares
  waterDemand: number; // in Cubic Metres (m³) per day
  soilMoisture: number; // percentage
  distanceFromHead: number; // in km along the canal
  priorityScore: number; // calculated priority
  waterDebt: number; // m³ owed to them from previous deficit allocations
}

export interface CanalGate {
  id: string;
  name: string;
  canalSegment: string;
  currentFlowRate: number; // m³/s
  targetFlowRate: number; // m³/s
  gateOpeningPercent: number;
  status: 'Open' | 'Closed' | 'Throttled' | 'Maintenance';
}

export interface Reservoir {
  name: string;
  capacity: number; // Million Cubic Metres (MCM)
  currentStorage: number; // MCM
  inflowRate: number; // m³/s
  outflowRate: number; // m³/s
  alertLevel: 'Normal' | 'Warning' | 'Critical';
}

export interface Allocation {
  id: string;
  villageId: string;
  villageName: string;
  requestedAmount: number; // m³
  allocatedAmount: number; // m³
  timeSlot: string; // e.g., "06:00 AM - 12:00 PM"
  fairnessScore: number; // 0 - 100
  reason: string; // Agent explanation
  status: 'Draft' | 'Approved' | 'Dispatched' | 'Overridden';
}

export interface EmergencyReport {
  id: string;
  type: 'Canal Breach' | 'Flood' | 'Illegal Diversion' | 'Water Theft' | 'Gate Failure' | 'Canal Blockage' | 'Dam Emergency';
  location: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  reportedAt: string;
  status: 'Reported' | 'Assigned' | 'Resolved';
  coordinates: { x: number; y: number }; // percentage on interactive map
}

export interface DecisionLog {
  id: string;
  timestamp: string;
  inputSummary: string;
  optimizationObjective: string;
  explainabilityText: string;
  fairnessIndex: number;
  approvedBy: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string; // Rivers, Conservation, Watersheds, Infrastructure
  content: string;
  tags: string[];
}

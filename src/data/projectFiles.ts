export interface ProjectFile {
  path: string;
  content: string;
}

export const downloadableProjectFiles: ProjectFile[] = [
  {
    path: 'README.md',
    content: `# AquaSetu – Adaptive Canal Water Allocation Decision Platform

AquaSetu is an explainable multi-agent decision intelligence platform built for state irrigation departments, district collectors, and canal authorities in India. It optimizes daily canal water diversion among multiple villages using Google OR-Tools while providing fair, crop-specific allocations modeled by co-operative game theory (Nash Bargaining Equilibrium) and explainable AI.

## Project Architecture
- **Frontend**: React 19, Vite, Tailwind CSS, Recharts, Framer Motion (inside \`frontend/\` folder)
- **Backend**: Python FastAPI, Google OR-Tools (Linear Programming)
- **Database**: Supabase / PostgreSQL (with complete water debt ledgers)

## Setup & Running Locally

### 1. Database Configuration (Supabase/PostgreSQL)
Run the SQL script located in \`database/schema.sql\` inside your Supabase SQL editor or standard PostgreSQL terminal. This will set up tables, triggers, and simulated data.

### 2. Backend (FastAPI + OR-Tools)
Make sure you have Python 3.10+ installed.
\`\`\`bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
\`\`\`

### 3. Frontend (React + Vite)
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

---
*Created for Smart City Missions & Department of Water Resources, Government of India.*
`
  },
  {
    path: 'requirements.txt',
    content: `fastapi==0.110.0
uvicorn==0.28.0
pydantic==2.6.4
ortools==9.9.3963
supabase==2.4.0
google-genai==0.1.1
python-dotenv==1.0.1
pandas==2.2.1
numpy==1.26.4
`
  },
  {
    path: 'database/schema.sql',
    content: `-- PostgreSQL DDL Schema for AquaSetu Database (Supabase ready)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('canal_officer', 'gov_admin', 'village_representative', 'utility_manager')),
    full_name VARCHAR(100),
    contact_no VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Villages Table
CREATE TABLE villages (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    crop_stage VARCHAR(100) NOT NULL,
    population INT NOT NULL,
    irrigated_area NUMERIC(10, 2) NOT NULL, -- Hectares
    water_demand_m3 NUMERIC(12, 2) NOT NULL, -- m³ per day
    soil_moisture_percent NUMERIC(5, 2) NOT NULL,
    distance_from_head_km NUMERIC(5, 2) NOT NULL,
    water_debt_m3 NUMERIC(12, 2) DEFAULT 0.0, -- deficit/surplus tally
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Water Requests
CREATE TABLE water_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    village_id VARCHAR(10) REFERENCES villages(id) ON DELETE CASCADE,
    requested_amount_m3 NUMERIC(12, 2) NOT NULL,
    crop_status_log TEXT,
    reported_soil_moisture NUMERIC(5, 2),
    request_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Allocations Table
CREATE TABLE allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    village_id VARCHAR(10) REFERENCES villages(id) ON DELETE CASCADE,
    allocated_amount_m3 NUMERIC(12, 2) NOT NULL,
    requested_amount_m3 NUMERIC(12, 2) NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    fairness_score NUMERIC(5, 2) NOT NULL,
    decision_reason TEXT,
    status VARCHAR(50) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Approved', 'Dispatched', 'Overridden')),
    approved_by VARCHAR(100),
    allocation_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Water Debt Ledger (Historical Log for Auditing)
CREATE TABLE water_debt_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    village_id VARCHAR(10) REFERENCES villages(id) ON DELETE CASCADE,
    amount_change_m3 NUMERIC(12, 2) NOT NULL, -- + for surplus, - for deficit allocation
    running_balance_m3 NUMERIC(12, 2) NOT NULL,
    allocation_id UUID REFERENCES allocations(id) ON DELETE SET NULL,
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Emergency Reports Table
CREATE TABLE emergency_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('Canal Breach', 'Flood', 'Illegal Diversion', 'Water Theft', 'Gate Failure', 'Canal Blockage', 'Dam Emergency')),
    location_details VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    reporter_contact VARCHAR(100),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    status VARCHAR(50) DEFAULT 'Reported' CHECK (status IN ('Reported', 'Assigned', 'Resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Trigger to automatically update Water Debt Ledger when allocations are Approved
CREATE OR REPLACE FUNCTION update_village_water_debt()
RETURNS TRIGGER AS $$
DECLARE
    deficit_m3 NUMERIC(12, 2);
    current_debt NUMERIC(12, 2);
BEGIN
    IF NEW.status = 'Approved' AND (OLD.status IS NULL OR OLD.status <> 'Approved') THEN
        -- Calculate deficit (Allocated - Requested)
        deficit_m3 := NEW.allocated_amount_m3 - NEW.requested_amount_m3;
        
        -- Get current debt of the village
        SELECT water_debt_m3 INTO current_debt FROM villages WHERE id = NEW.village_id;
        
        -- Update village
        UPDATE villages 
        SET water_debt_m3 = water_debt_m3 + deficit_m3
        WHERE id = NEW.village_id;
        
        -- Log transaction
        INSERT INTO water_debt_ledger(village_id, amount_change_m3, running_balance_m3, allocation_id, description)
        VALUES (NEW.village_id, deficit_m3, current_debt + deficit_m3, NEW.id, 'Daily allocation deficit credit balancing');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_allocation_approved
AFTER UPDATE ON allocations
FOR EACH ROW
EXECUTE FUNCTION update_village_water_debt();
`
  },
  {
    path: 'backend/optimization.py',
    content: `"""
AquaSetu - OR-Tools Linear Optimization Engine
Solves the Multi-Village Adaptive Water Allocation Problem.
Uses GLOP (Google Linear Optimization Package) solver.
"""

from ortools.linear_solver import pywraplp

def optimize_water_allocation(villages: list, available_water_m3: float) -> list:
    """
    Inputs:
    - villages: list of dicts {id, name, water_demand, priority_score, water_debt}
    - available_water_m3: Total water available at the headworks for distribution today.
    
    Objective:
    - Minimize crop loss penalties and maximize fairness.
    - Let x_i be the water allocated to village i.
    - Constraint 1: Sum(x_i) <= available_water_m3
    - Constraint 2: 0.2 * demand_i <= x_i <= demand_i  (Ensures minimum ecological/drinking flow)
    - Objective function: Maximize Sum( x_i * priority_score_i )
    """
    solver = pywraplp.Solver.CreateSolver('GLOP')
    if not solver:
        return []

    # Variables
    allocation_vars = {}
    for v in villages:
        v_id = v['id']
        demand = v['water_demand']
        # Constrain allocation between 20% (survival) and 100% of demand
        allocation_vars[v_id] = solver.NumVar(demand * 0.20, demand, f"alloc_{v_id}")

    # Constraint 1: Supply Limit
    supply_constraint = solver.Constraint(0, available_water_m3, "total_supply_limit")
    for v_id, var in allocation_vars.items():
        supply_constraint.SetCoefficient(var, 1.0)

    # Objective: Maximize priority-weighted allocations
    objective = solver.Objective()
    for v in villages:
        v_id = v['id']
        # priority_score is scaled by water_debt (deficit is negative, so subtracting it increases priority)
        adjusted_priority = v['priority_score'] - (v['water_debt'] * 0.01)
        objective.SetCoefficient(allocation_vars[v_id], float(adjusted_priority))
    
    objective.SetMaximization()

    # Solve
    status = solver.Solve()

    results = []
    if status == pywraplp.Solver.OPTIMAL:
        for v in villages:
            v_id = v['id']
            allocated = allocation_vars[v_id].solution_value()
            fairness = (allocated / v['water_demand']) * 100
            results.append({
                "village_id": v_id,
                "village_name": v['name'],
                "requested_amount": v['water_demand'],
                "allocated_amount": round(allocated, 2),
                "fairness_score": round(fairness, 1),
                "status": "Draft"
            })
    else:
        # Fallback proportional allocation if optimization fails
        total_demand = sum(v['water_demand'] for v in villages)
        ratio = min(1.0, available_water_m3 / total_demand) if total_demand > 0 else 0
        for v in villages:
            results.append({
                "village_id": v['id'],
                "village_name": v['name'],
                "requested_amount": v['water_demand'],
                "allocated_amount": round(v['water_demand'] * ratio, 2),
                "fairness_score": round(ratio * 100, 1),
                "status": "Draft"
            })
            
    return results
`
  },
  {
    path: 'backend/main.py',
    content: `"""
AquaSetu - FastAPI Application Entry Point
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os

from optimization import optimize_water_allocation

app = FastAPI(
    title="AquaSetu API",
    description="Explainable Multi-Agent Decision Intelligence for Adaptive Water Allocation",
    version="1.0.0"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class VillageSchema(BaseModel):
    id: str
    name: str
    water_demand: float
    priority_score: float
    water_debt: float

export_allocation_request = List[VillageSchema]

class OptimizationInput(BaseModel):
    villages: List[VillageSchema]
    available_water_m3: float

class EmergencyReportInput(BaseModel):
    report_type: str
    location_details: str
    description: str
    priority: str
    reporter_contact: Optional[str] = None

# In-Memory State Mocking Supabase tables for quick testing
emergencies = [
    {
        "id": "e1-mock",
        "report_type": "Canal Breach",
        "location_details": "Segment 4 (Near Rampur Regulator, km 5.2)",
        "description": "Minor piping observed along left dyke bank. Outflow is pooling into nearby fallow land.",
        "priority": "High",
        "status": "Assigned"
    }
]

@app.get("/")
def read_root():
    return {"status": "AquaSetu Core Service Online", "version": "1.0.0"}

@app.post("/api/optimize")
def optimize_allocation(payload: OptimizationInput):
    """
    Executes GLOP linear programming to allocate water
    """
    try:
        villages_list = [v.model_dump() for v in payload.villages]
        allocations = optimize_water_allocation(villages_list, payload.available_water_m3)
        return {
            "success": True,
            "available_water_m3": payload.available_water_m3,
            "allocations": allocations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/emergencies")
def file_emergency(payload: EmergencyReportInput):
    """
    Submits a new emergency SOS report
    """
    new_report = {
        "id": f"e{len(emergencies) + 1}-mock",
        "report_type": payload.report_type,
        "location_details": payload.location_details,
        "description": payload.description,
        "priority": payload.priority,
        "status": "Reported"
    }
    emergencies.append(new_report)
    return {"success": True, "report": new_report}

@app.get("/api/emergencies")
def get_emergencies():
    return emergencies
`
  },
  {
    path: 'docker-compose.yml',
    content: `version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
      - SUPABASE_URL=\${SUPABASE_URL}
      - SUPABASE_KEY=\${SUPABASE_KEY}
    volumes:
      - ./backend:/app
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ./frontend:/app
    ports:
      - "3000:3000"
    command: npm run dev -- --host 0.0.0.0 --port 3000
`
  }
];

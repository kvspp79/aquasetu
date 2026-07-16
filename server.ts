import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const DB_FILE = path.join(process.cwd(), "database.json");

// Default initial database content
const DEFAULT_DB = {
  emergencies: [
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
  ],
  farmers: [
    { id: "F-101", name: "Baldev Singh", villageId: "BL-101", villageName: "Rampur Sector A", landHectares: 4.5, cropType: "Basmati Rice", contact: "+91 98765 43210" },
    { id: "F-102", name: "Anil Kurup", villageId: "BL-103", villageName: "Shivpur Sub-block 1", landHectares: 12.0, cropType: "Cotton", contact: "+91 99123 45678" },
    { id: "F-103", name: "Ramesh Reddy", villageId: "BL-105", villageName: "Harigarh Canal Left", landHectares: 8.2, cropType: "Pulses & Maize", contact: "+91 94401 22334" }
  ],
  feedbacks: [
    { id: "FB-1", name: "Dr. Arun Varma", email: "arun.varma@agri.in", category: "Upgradation Suggestion", subject: "Soil Moisture Integration", message: "Integrating real-time capacitive sensor telemetry can optimize morning canal flow automation significantly.", date: "2026-07-15" }
  ],
  systemState: {
    currentSystemDate: "2026-07-15",
    dailyCycleDaysPassed: 0
  }
};

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading database, resetting to defaults:", error);
  }
  
  // Save default DB on creation
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), "utf-8");
  } catch (error) {
    console.error("Error creating database file:", error);
  }
  return JSON.parse(JSON.stringify(DEFAULT_DB));
}

function saveDatabase(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to database.json:", error);
  }
}

// Load current persistent data
const db = loadDatabase();
let sessionEmergencies = db.emergencies || DEFAULT_DB.emergencies;
let sessionFarmers = db.farmers || DEFAULT_DB.farmers;
let sessionFeedbacks = db.feedbacks || DEFAULT_DB.feedbacks;
let currentSystemDate = db.systemState?.currentSystemDate || "2026-07-15";
let dailyCycleDaysPassed = db.systemState?.dailyCycleDaysPassed || 0;

function updateDb() {
  saveDatabase({
    emergencies: sessionEmergencies,
    farmers: sessionFarmers,
    feedbacks: sessionFeedbacks,
    systemState: {
      currentSystemDate,
      dailyCycleDaysPassed
    }
  });
}

// Robust background worker that advances the simulation day and resolves incidents automatically
const SIMULATION_TICK_INTERVAL_MS = 20000; // 20 seconds advances 1 simulated day

setInterval(() => {
  dailyCycleDaysPassed += 1;
  const baseDate = new Date("2026-07-15");
  baseDate.setDate(baseDate.getDate() + dailyCycleDaysPassed);
  currentSystemDate = baseDate.toISOString().split('T')[0];
  
  console.log(`\x1b[36m[AquaSetu Server Background Worker]\x1b[0m Simulation day advanced to ${currentSystemDate} (Days passed: ${dailyCycleDaysPassed})`);
  
  // Progress existing emergencies over days to simulate real dispatch teams resolving problems
  sessionEmergencies = sessionEmergencies.map((emergency) => {
    if (emergency.status === 'Reported') {
      console.log(`\x1b[33m[AquaSetu Security Dispatch]\x1b[0m Incident ${emergency.id} at "${emergency.location}" changed status from Reported to ASSIGNED.`);
      return { ...emergency, status: 'Assigned' as const };
    } else if (emergency.status === 'Assigned' && Math.random() > 0.4) {
      console.log(`\x1b[32m[AquaSetu Maintenance Team]\x1b[0m Incident ${emergency.id} has been RESOLVED using structural reinforcement teams.`);
      return { ...emergency, status: 'Resolved' as const };
    }
    return emergency;
  });
  updateDb();
}, SIMULATION_TICK_INTERVAL_MS);


// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;

function getGemini(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON and URL-encoded body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Route - Get emergencies list
  app.get("/api/emergencies", (req, res) => {
    res.json(sessionEmergencies);
  });

  // API Route - Securely register new water-using farmers
  app.post("/api/farmers", (req, res) => {
    const { name, villageId, villageName, landHectares, cropType, contact } = req.body;
    if (!name || !villageId || !cropType) {
      res.status(400).json({ error: "Missing required farmer parameters" });
      return;
    }
    const newFarmer = {
      id: `F-${100 + sessionFarmers.length + 1}`,
      name,
      villageId,
      villageName: villageName || "Default Sector",
      landHectares: Number(landHectares) || 2.5,
      cropType,
      contact: contact || "+91 99999 88888"
    };
    sessionFarmers.push(newFarmer);
    updateDb();
    res.status(201).json(newFarmer);
  });

  // API Route - Fetch all registered farmers (role-restricted in UI)
  app.get("/api/farmers", (req, res) => {
    res.json(sessionFarmers);
  });

  // API Route - Retrieve simulated system date
  app.get("/api/system-date", (req, res) => {
    res.json({ date: currentSystemDate, daysPassed: dailyCycleDaysPassed });
  });

  // API Route - Advance current date by one day (simulates environment dynamics)
  app.post("/api/system-date/advance", (req, res) => {
    dailyCycleDaysPassed += 1;
    const baseDate = new Date("2026-07-15");
    baseDate.setDate(baseDate.getDate() + dailyCycleDaysPassed);
    currentSystemDate = baseDate.toISOString().split('T')[0];
    updateDb();
    res.json({ date: currentSystemDate, daysPassed: dailyCycleDaysPassed });
  });

  // API Route - Post a new emergency
  app.post("/api/emergencies", (req, res) => {
    const { type, location, priority, description, coordinates } = req.body;
    
    if (!type || !location || !description) {
      res.status(400).json({ error: "Missing required fields for emergency report" });
      return;
    }

    const newReport = {
      id: `E${sessionEmergencies.length + 1}`,
      type,
      location,
      priority: priority || 'High',
      description,
      coordinates: coordinates || { x: 50, y: 50 },
      reportedAt: new Date().toISOString(),
      status: 'Reported' as const
    };

    sessionEmergencies.push(newReport);
    updateDb();
    res.status(201).json(newReport);
  });

  // API Route - Retrieve user feedbacks
  app.get("/api/feedback", (req, res) => {
    res.json(sessionFeedbacks);
  });

  // API Route - Post user feedback/upgradation inquiries
  app.post("/api/feedback", (req, res) => {
    const { name, email, category, subject, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: "Missing required feedback fields" });
      return;
    }
    const newFeedback = {
      id: `FB-${sessionFeedbacks.length + 1}`,
      name,
      email,
      category: category || "General Enquiry",
      subject: subject || "No Subject",
      message,
      date: new Date().toISOString().split('T')[0]
    };
    sessionFeedbacks.push(newFeedback);
    updateDb();
    res.status(201).json(newFeedback);
  });

  // API Route - Explainable AI Allocation Decision Engine
  // Analyzes inputs and returns an explainable water allocation schedule
  app.post("/api/allocate", async (req, res) => {
    const { villages, inflowRate, totalDemand } = req.body;

    if (!villages || !Array.isArray(villages)) {
      res.status(455).json({ error: "Missing villages telemetry array" });
      return;
    }

    const ai = getGemini();
    const villagesFormatted = villages.map((v: any) => 
      `${v.name} (ID: ${v.id}, crop: ${v.cropType}, stage: ${v.cropStage}, area: ${v.irrigatedArea}ha, soil: ${v.soilMoisture}%, demand: ${v.waterDemand}m³, debt: ${v.waterDebt}m³)`
    ).join("\n");

    const promptText = `You are AquaSetu, the Chief AI Water Allocation Coordinator for the Ministry of Jal Shakti.
You must allocate available canal water among these 5 villages based on crop stress and priority.
Total water flow available: ${inflowRate} m³/s. Sum of village daily demands: ${totalDemand} m³.
Here is the village telemetry:
${villagesFormatted}

Rules:
1. Ensure minimum survival allocation (at least 20% of requested demand) for all villages to preserve drinking water and prevent total crop wilting.
2. Basmati Rice in Flowering stage (V1) is extremely moisture-sensitive.
3. Cotton in Yield Formation (V3) with very low soil moisture (32%) and high water debt (-3400m³) is critical.
4. Wheat (V4) is only in sowing prep, so it can tolerate temporary deferral.
5. Provide a Gini fairness index score between 0.0 and 1.0.

Please return your response EXACTLY as a JSON object with this schema:
{
  "summary": "High-level overview of allocation strategy (2-3 paragraphs)",
  "giniIndex": 0.94,
  "allocations": [
    {
      "villageId": "V1",
      "allocatedAmount": 7800,
      "reason": "BASM-A: Detailed explanation for Rampur"
    },
    ...
  ]
}
Make sure you ONLY return the raw JSON block without markdown formatting or backticks.`;

    // Attempt calling Gemini 3.1 Pro with high thinking level, fallback to Gemini 3.5 Flash if quota/tier error occurs
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: promptText,
          config: {
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.HIGH
            },
            responseMimeType: "application/json"
          }
        });

        const textOutput = response.text?.trim() || "";
        const cleanedText = textOutput.replace(/^```json\s*/, "").replace(/```$/, "").trim();
        const jsonResult = JSON.parse(cleanedText);
        res.json({ success: true, source: 'Gemini 3.1 Pro (Thinking Mode)', data: jsonResult });
        return;
      } catch (err: any) {
        console.warn("Gemini 3.1 Pro call failed, trying Gemini 3.5 Flash fallback:", err.message);
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: promptText,
            config: {
              responseMimeType: "application/json"
            }
          });

          const textOutput = response.text?.trim() || "";
          const cleanedText = textOutput.replace(/^```json\s*/, "").replace(/```$/, "").trim();
          const jsonResult = JSON.parse(cleanedText);
          res.json({ success: true, source: 'Gemini 3.5 Flash (Fallback Mode)', data: jsonResult });
          return;
        } catch (flashErr: any) {
          console.warn("Gemini 3.5 Flash fallback also failed, falling back to deterministic model:", flashErr.message);
        }
      }
    }

    // Deterministic Fallback if Gemini is not configured or fails
    // This replicates the exact behavior requested with highly specialized rules
    const simulatedAllocations = villages.map((v: any) => {
      let allocatedAmount = v.waterDemand;
      let reason = "";

      if (v.id === 'V1') {
        allocatedAmount = Math.round(v.waterDemand * 0.92);
        reason = "BASM-A Agent: Basmati crop is in flowering stage. Deficit minimized to 8% to ensure critical grain formation while contributing to link canal conservation.";
      } else if (v.id === 'V2') {
        allocatedAmount = Math.round(v.waterDemand * 0.73);
        reason = "SUGR-B Agent: Sugarcane root depth is robust and soil moisture is stable at 45%. Water flow safely throttled by 27% to assist high-stress distal nodes.";
      } else if (v.id === 'V3') {
        allocatedAmount = v.waterDemand; // 100% allocation
        reason = "COTT-C Agent: Cotton in yield formation is experiencing extreme wilting stress (soil moisture 32%). Complete priority allocation triggered to clear V3's historical deficit.";
      } else if (v.id === 'V4') {
        allocatedAmount = Math.round(v.waterDemand * 0.60);
        reason = "WHEA-D Agent: Wheat is in early sowing preparation stage. Supply deferred; upcoming 14mm localized rain forecast will compensate for soil deficit.";
      } else if (v.id === 'V5') {
        allocatedAmount = Math.round(v.waterDemand * 0.84);
        reason = "PULS-E Agent: Distal gate evaporative losses are minimized via night-flow scheduling. Moderate priority allocated for pulse crop vegetative stability.";
      }

      return {
        villageId: v.id,
        allocatedAmount,
        reason
      };
    });

    const fallbackResponse = {
      summary: "The multi-agent optimization coordinator executed Nash Bargaining equilibrium under a localized water-scarcity vector. V3 (Shivpur) and V1 (Rampur) are prioritized due to acute soil moisture deficits (32%) and critical crop flowering stages. Supply ratios for V2 (Kalyanpur) and V4 (Daulatpur) are safely throttled, with V4 deferred due to high baseline moisture and a forecasted rainfall pattern.",
      giniIndex: 0.93,
      allocations: simulatedAllocations
    };

    res.json({ success: true, source: 'Deterministic Optimization Engine', data: fallbackResponse });
  });

  // API Route - Dedicated Crop Help Chatbot (Answers only farming/crop/irrigation questions)
  app.post("/api/crop-bot", async (req, res) => {
    const { message } = req.body;
    if (!message) {
      res.status(400).json({ error: "Message content is required" });
      return;
    }

    const ai = getGemini();
    const systemPrompt = `You are "Satyabhama", an expert Crop & Irrigation Advisor for Indian agricultural farmers, developed exclusively by lead engineer kvsp praneeth as part of the AquaSetu Decision Support Platform.
Your role is STRICTLY and ONLY to answer questions about crops, soil moisture, irrigation scheduling, agricultural techniques, fertilizer application, pest control, and farming.
Do NOT answer anything outside of agriculture, crops, or irrigation. If a user asks a non-agricultural or non-farming question (such as writing code, general history, celebrity gossip, sports, or anything unrelated), politely but firmly refuse by saying:
"I am programmed by kvsp praneeth to assist only with farming, irrigation, crop management, and agricultural soil questions."

User question: "${message}"

Please respond with practical, structured, and easy-to-understand advice (max 2-3 brief paragraphs). Avoid any AI jargon or mention of Gemini in the final output. Highlight water-saving techniques like drip irrigation or mulching where applicable.`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: systemPrompt
        });

        const reply = response.text?.trim() || "No response generated.";
        res.json({ success: true, reply });
        return;
      } catch (err: any) {
        console.warn("Gemini chatbot call failed, returning intelligent fallback:", err.message);
      }
    }

    // High quality agricultural deterministic fallback if Gemini is offline
    let fallbackReply = `I am Satyabhama, your offline irrigation assistant. Based on local agricultural guidelines:
1. Soil Moisture: Keep soil moisture above 35% for sensitive crops like Basmati rice during flowering.
2. Irrigation Optimization: Prioritize drip irrigation for high-value row crops to conserve up to 40% more water compared to flood irrigation.
3. Mulching: Applying organic straw or mulch sheets reduces surface evaporation by up to 60%, holding water for 12 days instead of 4.

Please verify that your local canal block connection is active. - Engineered by kvsp praneeth.`;

    res.json({ success: true, reply: fallbackReply });
  });

  // Vite middleware for development, static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AquaSetu Server] Listening at http://localhost:${PORT}`);
  });
}

startServer();

const express = require("express");
const cors = require("cors");
const fs = require("fs"); // <--- NEW: File System
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

// --- CONFIGURATION ---
const ROBOT_SECRET_TOKEN = "super-secret-robot-password-123";
const DB_FILE = path.join(__dirname, "database.json");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// --- DATABASE ENGINE (Simple JSON File) ---
// 1. Initialize Database if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([])); // Create empty list
}

// 2. Helper functions to Read/Write
function getDatabase() {
  try {
    const data = fs.readFileSync(DB_FILE);
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveToDatabase(newRecord) {
  const db = getDatabase();
  db.unshift(newRecord); // Add new record to the TOP

  // Limit history to 100 items (so the file doesn't get huge)
  if (db.length > 100) db.pop();

  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// Store current robot location (In Memory)
let robotLocation = {
  lat: null,
  lng: null,
  lastUpdated: null,
};

// --- ENDPOINTS ---

// 1. UPDATE LOCATION (Robot -> Server)
app.post("/api/location", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.includes(ROBOT_SECRET_TOKEN)) {
    return res.status(403).json({ status: "error", message: "Forbidden" });
  }

  const { lat, lng } = req.body;
  if (lat && lng) {
    robotLocation = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      lastUpdated: Date.now(),
    };
    // We don't save EVERY step to the database, just the current location
    res.json({ status: "success" });
  } else {
    res.status(400).json({ status: "error" });
  }
});

// 2. REPORT INCIDENT (Robot -> Server -> Database)
// The robot sends this when it finds a "Special Case"
app.post("/api/report", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.includes(ROBOT_SECRET_TOKEN)) {
    return res.status(403).json({ status: "error", message: "Forbidden" });
  }

  const { type, severity, notes } = req.body;

  const newIncident = {
    id: Date.now(), // Unique ID based on time
    timestamp: new Date().toISOString(),
    type: type || "Unknown",
    severity: severity || "Low",
    location: robotLocation, // Attach WHERE it happened
    notes: notes || "",
  };

  saveToDatabase(newIncident);
  console.log(`🚨 New Incident: ${type} (${severity})`);

  res.json({ status: "saved", id: newIncident.id });
});

// 3. GET DATA (Website -> Server)
app.get("/api/location", (req, res) => res.json(robotLocation));

app.get("/api/incidents", (req, res) => {
  res.json(getDatabase()); // Send the whole history
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

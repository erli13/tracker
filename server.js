const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path'); 


// --- SECURITY CONFIGURATION ---
// In a real production app, use process.env.ROBOT_SECRET
// For now, we hardcode it for simplicity.
const ROBOT_SECRET_TOKEN = "super-secret-robot-password-123"; 

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Store robot location
let robotLocation = {
    lat: null,
    lng: null,
    lastUpdated: null
};

// 1. SECURE ENDPOINT (POST)
// The Robot MUST send the correct token to update location
app.post('/api/location', (req, res) => {
    // A. Check for the Authorization header
    const authHeader = req.headers['authorization'];

    // B. Verify the token
    // We expect the header to look like: "Bearer super-secret-robot-password-123"
    // or just the token itself. Let's support both for simplicity.
    if (!authHeader || (authHeader !== ROBOT_SECRET_TOKEN && authHeader !== `Bearer ${ROBOT_SECRET_TOKEN}`)) {
        console.log("🛑 Unauthorized attempt to update location!");
        return res.status(403).json({ status: 'error', message: 'Forbidden: Invalid Token' });
    }

    // C. Process the update (Only if token is correct)
    const { lat, lng } = req.body;
    if (lat && lng) {
        robotLocation = { 
            lat: parseFloat(lat), 
            lng: parseFloat(lng),
            lastUpdated: Date.now()
        };
        console.log(`📍 Robot at: ${lat}, ${lng}`);
        res.json({ status: 'success' });
    } else {
        res.status(400).json({ status: 'error', message: 'Missing coordinates' });
    }
});

// 2. PUBLIC ENDPOINT (GET)
// The Web App does NOT need a token to VIEW the location
app.get('/api/location', (req, res) => {
    res.json(robotLocation);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
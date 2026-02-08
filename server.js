const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Store robot location (Default: 0,0)
let robotLocation = {
    lat: null,
    lng: null,
    lastUpdated: null
};

// 1. Robot sends data here (POST)
app.post('/api/location', (req, res) => {
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
        res.status(400).json({ status: 'error' });
    }
});

// 2. Web App asks for data here (GET)
app.get('/api/location', (req, res) => {
    res.json(robotLocation);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
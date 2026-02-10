import requests
import time
import random

# --- CONFIGURATION ---
# Use 127.0.0.1 if running on the server, or the real URL if running on laptop
# SERVER_URL = "http://127.0.0.1:3000" 
SERVER_URL = "https://mini.erli.lol"

HEADERS = {
    "Authorization": "super-secret-robot-password-123", 
    "Content-Type": "application/json"
}

# Medical Scenarios for Demo
EMERGENCIES = [
    {"type": "Arrest Kardiak", "severity": "Kritike", "notes": "Pacienti pa puls."},
    {"type": "Dehidratim", "severity": "Mesatare", "notes": "Humbje ndjenjash."},
    {"type": "Thyerje Kocke", "severity": "Lartë", "notes": "Rrëzim nga lartësia."},
    {"type": "Sulm Paniku", "severity": "Ulët", "notes": "Vështirësi në frymëmarrje."},
    {"type": "Dhimbje gjoksi", "severity": "Ulët", "notes": "upupupupupu"}
]

lat = 41.3120
lng = 19.4790

print(f"🤖 Robot 2.0 Started...")
print(f"📡 Server: {SERVER_URL}")

while True:
    try:
        # 1. Update Location
        loc_payload = {"lat": lat, "lng": lng}
        requests.post(f"{SERVER_URL}/api/location", json=loc_payload, headers=HEADERS)

        # 2. Simulate Random Incident (5% chance every step)
        if random.random() < 1:
            # emergency = random.choice(EMERGENCIES)
            emergency = EMERGENCIES[4]
            
            report_payload = {
                "type": emergency["type"],
                "severity": emergency["severity"],
                "notes": emergency["notes"]
            }
            
            resp = requests.post(f"{SERVER_URL}/api/report", json=report_payload, headers=HEADERS)
            if resp.status_code == 200:
                print(f"🚨 SENT REPORT: {emergency['type']}")

        # 3. Walk
        lat -= 0.0001
        lng += 0.0001
        print(f"✅ Walking... {lat:.4f}")
        
        time.sleep(2)

    except Exception as e:
        print(f"❌ Error: {e}")
        time.sleep(2)
import requests
import time

# --- CONFIGURATION ---
# 1. Choose your target (Uncomment the one you want to use)
# SERVER_URL = "http://localhost:3000/api/location"
SERVER_URL = "https://mini.erli.lol/api/location"

# 2. THE SECRET PASSWORD (Must match server.js)
HEADERS = {
    "Authorization": "super-secret-robot-password-123", 
    "Content-Type": "application/json"
}

# 3. Starting Position (Durrës Beach)
current_lat = 41.3120
current_lng = 19.4790

print(f"🤖 Robot Walking Simulation Started...")
print(f"📡 Connecting to: {SERVER_URL}")
print("Press CTRL+C to stop.")

while True:
    try:
        # Create the data payload with current coordinates
        payload = {
            "lat": current_lat,
            "lng": current_lng
        }

        # Send the POST request with HEADERS (Security)
        response = requests.post(SERVER_URL, json=payload, headers=HEADERS, timeout=2)

        if response.status_code == 200:
            print(f"✅ Moved to: {current_lat:.5f}, {current_lng:.5f}")
        elif response.status_code == 403:
            print("🛑 ACCESS DENIED! Your password doesn't match server.js")
        else:
            print(f"⚠️ Server Error: {response.status_code}")

        # --- THE WALKING LOGIC ---
        # Move South-East slightly
        current_lat -= 0.0001 
        current_lng += 0.0001 

        # Wait 2 seconds before next step
        time.sleep(2)

    except requests.exceptions.ConnectionError:
        print("❌ Connection Failed. Is the server running?")
        time.sleep(2)
    except Exception as e:
        print(f"❌ Error: {e}")
        time.sleep(2)
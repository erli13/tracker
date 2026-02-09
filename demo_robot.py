import requests
import time
import random
import math

# We use 'localhost' because this script runs ON the server
SERVER_URL = "http://localhost:3000/api/location"

# Starting point (Example: Near your school in Tirana)
# You can change these to match your exact school location if you want
lat = 41.3275
lng = 19.8187

print(f"🤖 Demo Robot Started! Targeting: {SERVER_URL}")

while True:
    # 1. Simulate movement (Random walk)
    lat += random.uniform(-0.0001, 0.0001)
    lng += random.uniform(-0.0001, 0.0001)

    payload = {
        "lat": lat,
        "lng": lng,
        "status": "active"
    }

    try:
        # 2. Send data to the app
        response = requests.post(SERVER_URL, json=payload)
        if response.status_code == 200:
            print(f"✅ Moved to: {lat:.5f}, {lng:.5f}")
        else:
            print(f"⚠️ Server Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Connection Failed: {e}")

    # 3. Wait 2 seconds before next move
    time.sleep(2)
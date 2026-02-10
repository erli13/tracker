# 1. Start with a lightweight Node.js operating system
FROM node:18-slim

# 2. Install Python 3 and Pip (So the robot can live here too)
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

# 3. Create the folder inside the box
WORKDIR /app

# 4. Copy the dependency list first (for caching speed)
COPY package*.json ./

# 5. Install Node libraries
RUN npm install

# 6. Install Python libraries
RUN pip3 install requests --break-system-packages

# 7. Copy the rest of your code into the box
COPY . .

# 8. Open the door for the website
EXPOSE 3000

# 9. The Command: Start the Server AND the Robot at the same time
# We use a simple shell trick (&) to run them together
CMD ["sh", "-c", "node server.js & python3 demo_robot.py"]
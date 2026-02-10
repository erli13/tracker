# --- CONFIGURATION ---
$ServerIP = "3.68.136.106"
$KeyFile = "key.pem"

# 1. Save changes to GitHub
Write-Host "🚀 Saving to GitHub..." -ForegroundColor Cyan
git add .
git commit -m "Fast Update"
git push

# 2. Tell AWS to update
Write-Host "⚡ Connecting to AWS..." -ForegroundColor Cyan

# UPDATED COMMAND:
# 1. 'source ~/.bashrc' loads the tools (npm, node, etc.)
# 2. We removed 'sudo' so it shares the same list as your robot demo
ssh -i $KeyFile -o StrictHostKeyChecking=no bitnami@$ServerIP "source /home/bitnami/.bashrc && cd tracker && git fetch origin && git reset --hard origin/main && npm install && pm2 restart robot-tracker"

Write-Host "✅ DONE! Site updated." -ForegroundColor Green
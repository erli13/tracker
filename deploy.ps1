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
# We manually add the Bitnami Node path (/opt/bitnami/node/bin) so the script finds 'npm' and 'pm2'
ssh -i $KeyFile -o StrictHostKeyChecking=no bitnami@$ServerIP "export PATH=/opt/bitnami/node/bin:`$PATH && cd tracker && git fetch origin && git reset --hard origin/main && npm install && pm2 restart robot-tracker"

Write-Host "✅ DONE! Site updated." -ForegroundColor Green
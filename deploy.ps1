# --- CONFIGURATION ---
$ServerIP = "3.68.136.106"  # <--- PUT YOUR AWS IP HERE
$KeyFile = "key.pem" # <--- YOUR KEY NAME HERE

# 1. Save changes to GitHub
Write-Host "🚀 Saving to GitHub..." -ForegroundColor Cyan
git add .
git commit -m "Fast Update"
git push

# 2. Tell AWS to update
Write-Host "⚡ Connecting to AWS..." -ForegroundColor Cyan
ssh -i $KeyFile -o StrictHostKeyChecking=no bitnami@$ServerIP "cd tracker && git pull && npm install && sudo pm2 restart robot-tracker"

Write-Host "✅ DONE! Site updated." -ForegroundColor Green
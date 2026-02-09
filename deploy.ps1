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

# We use 'git reset --hard' to force the update even if files were modified on the server
# We keeps Nginx running (it doesn't need a restart, it just forwards traffic)
ssh -i $KeyFile -o StrictHostKeyChecking=no bitnami@$ServerIP "cd tracker && git fetch origin && git reset --hard origin/main && npm install && sudo pm2 restart robot-tracker"

Write-Host "✅ DONE! Site updated. (Nginx is handling the SSL automatically)" -ForegroundColor Green
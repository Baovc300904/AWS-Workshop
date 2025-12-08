# Quick Deploy Script - Run this to deploy to EC2
# Make sure you have updated the EC2_KEY path first!

param(
    [string]$KeyPath = "D:\AWS\keys\game-store-backend-key.pem",
    [string]$EC2Host = "47.129.108.163"
)

Write-Host "=" -ForegroundColor Cyan
Write-Host "🚀 Quick Deploy to EC2" -ForegroundColor Cyan
Write-Host "=" -ForegroundColor Cyan

# 1. Build
Write-Host "`n📦 Step 1: Building..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# 2. Upload dist
Write-Host "`n📤 Step 2: Uploading dist..." -ForegroundColor Yellow
scp -i $KeyPath -r dist/* "ubuntu@$EC2Host:/home/ubuntu/game-store-frontend/"

# 3. Upload nginx config
Write-Host "`n⚙️ Step 3: Uploading nginx config..." -ForegroundColor Yellow
scp -i $KeyPath docker/nginx.conf "ubuntu@$EC2Host:/home/ubuntu/game-store-frontend/"

# 4. Setup nginx
Write-Host "`n🔧 Step 4: Setting up nginx..." -ForegroundColor Yellow
ssh -i $KeyPath "ubuntu@$EC2Host" @"
sudo cp /home/ubuntu/game-store-frontend/nginx.conf /etc/nginx/sites-available/game-store
sudo sed -i 's|/usr/share/nginx/html|/home/ubuntu/game-store-frontend|g' /etc/nginx/sites-available/game-store
sudo ln -sf /etc/nginx/sites-available/game-store /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx
"@

Write-Host "`n✅ Deploy complete!" -ForegroundColor Green
Write-Host "🌐 Visit: http://$EC2Host" -ForegroundColor Cyan

# Deploy Frontend to EC2 - PowerShell Script
# Usage: .\deploy-ec2.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Deploying Frontend to EC2..." -ForegroundColor Cyan

# Configuration
$EC2_USER = "ubuntu"
$EC2_HOST = "47.129.108.163"  # Your EC2 public IP from screenshot
$EC2_KEY = "D:\AWS\keys\game-store-backend-key.pem"
$APP_NAME = "game-store-frontend"
$REMOTE_DIR = "/home/ubuntu/game-store-frontend"

# Build Frontend
Write-Host "📦 Building Frontend..." -ForegroundColor Blue
npm run build

if (-not (Test-Path "dist")) {
    Write-Host "❌ Build failed - dist directory not found" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful" -ForegroundColor Green

# Upload to EC2
Write-Host "📤 Uploading to EC2..." -ForegroundColor Blue

# Create remote directory
ssh -i $EC2_KEY "$EC2_USER@$EC2_HOST" "mkdir -p $REMOTE_DIR"

# Upload dist folder
scp -i $EC2_KEY -r dist/* "$EC2_USER@$EC2_HOST`:$REMOTE_DIR/"

# Upload nginx config
scp -i $EC2_KEY docker/nginx.conf "$EC2_USER@$EC2_HOST`:$REMOTE_DIR/"

Write-Host "🔧 Configuring Nginx on EC2..." -ForegroundColor Blue

# Configure Nginx
$nginxSetup = @'
# Install nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    sudo apt-get update
    sudo apt-get install -y nginx
fi

# Copy nginx config
sudo cp /home/ubuntu/game-store-frontend/nginx.conf /etc/nginx/sites-available/game-store

# Update nginx config with correct paths
sudo sed -i 's|/usr/share/nginx/html|/home/ubuntu/game-store-frontend|g' /etc/nginx/sites-available/game-store

# Enable site
sudo ln -sf /etc/nginx/sites-available/game-store /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "✅ Nginx configured and restarted"
'@

ssh -i $EC2_KEY "$EC2_USER@$EC2_HOST" $nginxSetup

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Frontend is now running at: http://$EC2_HOST" -ForegroundColor Yellow
Write-Host "📝 Make sure your EC2 Security Group allows inbound traffic on port 80" -ForegroundColor Yellow

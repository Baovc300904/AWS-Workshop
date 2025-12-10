# 🚀 Deploy Backend with MoMo Fix to EC2
# PowerShell script for Windows

$ErrorActionPreference = "Stop"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host " 🚀 Deploying Backend to EC2 with MoMo Fix" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

$EC2_USER = "ec2-user"
$EC2_HOST = "13.212.125.86"
$BACKEND_DIR = "/home/ec2-user/backend"
$LOCAL_JAR = "target\ShopGameManagement-0.0.1-SNAPSHOT.jar"
$SSH_KEY = "D:\AWS\keys\game-store-backend-key.pem"

Write-Host ""
Write-Host "[1/6] Checking local JAR file..." -ForegroundColor Yellow
if (-not (Test-Path $LOCAL_JAR)) {
    Write-Host "❌ JAR file not found: $LOCAL_JAR" -ForegroundColor Red
    Write-Host "   Please run: mvn clean package -DskipTests" -ForegroundColor Red
    exit 1
}
Write-Host "✅ JAR file found" -ForegroundColor Green

Write-Host ""
Write-Host "[2/6] Stopping backend service on EC2..." -ForegroundColor Yellow
& ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "${EC2_USER}@${EC2_HOST}" @"
# Try systemd service first
if sudo systemctl status game-store-backend > /dev/null 2>&1; then
    sudo systemctl stop game-store-backend
    echo '   ✅ Systemd service stopped'
else
    # Kill java process manually
    pkill -f 'ShopGameManagement' && echo '   ✅ Java process killed' || echo '   ℹ️  No running process found'
fi
"@

Write-Host ""
Write-Host "[3/6] Uploading JAR to EC2..." -ForegroundColor Yellow
& scp -i "$SSH_KEY" -o StrictHostKeyChecking=no $LOCAL_JAR "${EC2_USER}@${EC2_HOST}:${BACKEND_DIR}/"
Write-Host "✅ JAR uploaded" -ForegroundColor Green

Write-Host ""
Write-Host "[4/6] Setting up environment variables..." -ForegroundColor Yellow
& ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "${EC2_USER}@${EC2_HOST}" @"
# Create .env file for backend
cat > /home/ec2-user/backend/.env << 'ENVEOF'
# Spring Profile
SPRING_PROFILES_ACTIVE=ec2

# MoMo Payment Configuration
MOMO_PARTNER_CODE=MOMOLRJZ20181206
MOMO_ACCESS_KEY=mTCKt9W3eU1m39TW
MOMO_SECRET_KEY=SetA5RDnLHvt51AULf51DyauxUo3kDU6
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
MOMO_REDIRECT_URL=https://www.awstestgamexyz.space/payment/callback
MOMO_IPN_URL=https://www.awstestgamexyz.space/payment/momo/ipn
ENVEOF

# Add to ~/.bashrc
grep -q 'MOMO_REDIRECT_URL' ~/.bashrc || cat >> ~/.bashrc << 'BASHEOF'

# MoMo Payment URLs
export MOMO_REDIRECT_URL='https://www.awstestgamexyz.space/payment/callback'
export MOMO_IPN_URL='https://www.awstestgamexyz.space/payment/momo/ipn'
BASHEOF

source ~/.bashrc
echo '   ✅ Environment variables configured'
"@

Write-Host ""
Write-Host "[5/6] Creating/Updating systemd service..." -ForegroundColor Yellow
& ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "${EC2_USER}@${EC2_HOST}" @"
sudo bash -c 'cat > /etc/systemd/system/game-store-backend.service << \"SERVICEEOF\"
[Unit]
Description=Game Store Backend Service
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/backend
Environment=\"SPRING_PROFILES_ACTIVE=ec2\"
Environment=\"MOMO_PARTNER_CODE=MOMOLRJZ20181206\"
Environment=\"MOMO_ACCESS_KEY=mTCKt9W3eU1m39TW\"
Environment=\"MOMO_SECRET_KEY=SetA5RDnLHvt51AULf51DyauxUo3kDU6\"
Environment=\"MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create\"
Environment=\"MOMO_REDIRECT_URL=https://www.awstestgamexyz.space/payment/callback\"
Environment=\"MOMO_IPN_URL=https://www.awstestgamexyz.space/payment/momo/ipn\"
ExecStart=/usr/bin/java -jar /home/ec2-user/backend/ShopGameManagement-0.0.1-SNAPSHOT.jar
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SERVICEEOF'

sudo systemctl daemon-reload
sudo systemctl enable game-store-backend
echo '   ✅ Systemd service configured'
"@

Write-Host ""
Write-Host "[6/6] Starting backend service..." -ForegroundColor Yellow
& ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "${EC2_USER}@${EC2_HOST}" @"
sudo systemctl start game-store-backend
sleep 3

if sudo systemctl is-active --quiet game-store-backend; then
    echo '   ✅ Backend service started successfully'
    echo ''
    echo '   Service status:'
    sudo systemctl status game-store-backend --no-pager -l | head -15
else
    echo '   ❌ Failed to start backend service'
    echo ''
    echo '   Checking logs:'
    sudo journalctl -u game-store-backend -n 50 --no-pager
    exit 1
fi
"@

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host " ✅ Backend Deployment Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend is now running with:" -ForegroundColor Cyan
Write-Host "  📍 URL: https://www.awstestgamexyz.space" -ForegroundColor White
Write-Host "  🔄 MoMo Redirect: https://www.awstestgamexyz.space/payment/callback" -ForegroundColor White
Write-Host "  📥 MoMo IPN: https://www.awstestgamexyz.space/payment/momo/ipn" -ForegroundColor White
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  View logs:    ssh ${EC2_USER}@${EC2_HOST} 'sudo journalctl -u game-store-backend -f'" -ForegroundColor Gray
Write-Host "  Restart:      ssh ${EC2_USER}@${EC2_HOST} 'sudo systemctl restart game-store-backend'" -ForegroundColor Gray
Write-Host "  Stop:         ssh ${EC2_USER}@${EC2_HOST} 'sudo systemctl stop game-store-backend'" -ForegroundColor Gray
Write-Host "  Status:       ssh ${EC2_USER}@${EC2_HOST} 'sudo systemctl status game-store-backend'" -ForegroundColor Gray
Write-Host ""

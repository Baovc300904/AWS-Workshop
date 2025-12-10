# ⚡ Quick Fix MoMo URLs on EC2 (Safe Format)
$ErrorActionPreference = "Stop"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host " ⚡ Quick Fix: MoMo URLs on EC2" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

$EC2_USER = "ec2-user"
$EC2_HOST = "13.212.125.86"

Write-Host "Target: $EC2_HOST"
Write-Host "Updating URLs to HTTPS domain..."
Write-Host ""

# --- BLOCK 1: UPDATE BASHRC ---
Write-Host "[1/3] Updating environment variables..." -ForegroundColor Yellow
$sshCommand1 = @'
grep -q 'MOMO_REDIRECT_URL' ~/.bashrc && sed -i '/MOMO_REDIRECT_URL/d' ~/.bashrc
grep -q 'MOMO_IPN_URL' ~/.bashrc && sed -i '/MOMO_IPN_URL/d' ~/.bashrc
cat >> ~/.bashrc << 'BASHEOF'
export MOMO_REDIRECT_URL='https://www.awstestgamexyz.space/payment/callback'
export MOMO_IPN_URL='https://www.awstestgamexyz.space/payment/momo/ipn'
BASHEOF
source ~/.bashrc
echo '✅ Environment variables updated'
'@
# LƯU Ý: Dòng '@ phía trên phải sát lề trái
ssh "${EC2_USER}@${EC2_HOST}" $sshCommand1


# --- BLOCK 2: UPDATE SERVICE ---
Write-Host ""
Write-Host "[2/3] Updating systemd service..." -ForegroundColor Yellow
$sshCommand2 = @'
if [ -f /etc/systemd/system/game-store-backend.service ]; then
sudo bash -c 'cat > /etc/systemd/system/game-store-backend.service << "SERVICEEOF"
[Unit]
Description=Game Store Backend Service
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/backend
Environment="SPRING_PROFILES_ACTIVE=ec2"
Environment="MOMO_PARTNER_CODE=MOMOLRJZ20181206"
Environment="MOMO_ACCESS_KEY=mTCKt9W3eU1m39TW"
Environment="MOMO_SECRET_KEY=SetA5RDnLHvt51AULf51DyauxUo3kDU6"
Environment="MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create"
Environment="MOMO_REDIRECT_URL=https://www.awstestgamexyz.space/payment/callback"
Environment="MOMO_IPN_URL=https://www.awstestgamexyz.space/payment/momo/ipn"
ExecStart=/usr/bin/java -jar /home/ec2-user/backend/ShopGameManagement-0.0.1-SNAPSHOT.jar
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SERVICEEOF'
sudo systemctl daemon-reload
echo '✅ Systemd service updated'
else
echo '⚠️  Systemd service not found'
fi
'@
# LƯU Ý: Dòng '@ phía trên phải sát lề trái
ssh "${EC2_USER}@${EC2_HOST}" $sshCommand2


# --- BLOCK 3: RESTART BACKEND ---
Write-Host ""
Write-Host "[3/3] Restarting backend..." -ForegroundColor Yellow
$sshCommand3 = @'
if sudo systemctl status game-store-backend > /dev/null 2>&1; then
sudo systemctl restart game-store-backend
sleep 5
if sudo systemctl is-active --quiet game-store-backend; then
echo '✅ Backend restarted successfully'
else
echo '❌ Failed to restart backend'
fi
else
pkill -f 'ShopGameManagement'
cd /home/ec2-user/backend
export MOMO_REDIRECT_URL='https://www.awstestgamexyz.space/payment/callback'
export MOMO_IPN_URL='https://www.awstestgamexyz.space/payment/momo/ipn'
nohup java -jar -Dspring.profiles.active=ec2 ShopGameManagement-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
echo '✅ Backend started manually'
fi
'@
# LƯU Ý: Dòng '@ phía trên phải sát lề trái
ssh "${EC2_USER}@${EC2_HOST}" $sshCommand3


Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host " ✅ DONE!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Check logs command:" -ForegroundColor Yellow
# In lệnh ra biến riêng để tránh lỗi cú pháp
$logCmd = "ssh ec2-user@13.212.125.86 'sudo journalctl -u game-store-backend -f | grep -i momo'"
Write-Host $logCmd -ForegroundColor Gray
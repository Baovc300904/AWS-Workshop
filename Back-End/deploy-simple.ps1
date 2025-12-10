# Simple EC2 Backend Deployment
$ErrorActionPreference = "Stop"

$EC2_USER = "ec2-user"
$EC2_HOST = "13.212.125.86"
$SSH_KEY = "D:\AWS\keys\game-store-backend-key.pem"
$LOCAL_JAR = "target\ShopGameManagement-0.0.1-SNAPSHOT.jar"

Write-Host "🚀 Deploying Backend to EC2..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop service
Write-Host "[1/4] Stopping service..." -ForegroundColor Yellow
& ssh -i "$SSH_KEY" "${EC2_USER}@${EC2_HOST}" "sudo systemctl stop game-store-backend 2>/dev/null || pkill -f ShopGameManagement || true"

# Step 2: Upload JAR
Write-Host "[2/4] Uploading JAR..." -ForegroundColor Yellow
& scp -i "$SSH_KEY" $LOCAL_JAR "${EC2_USER}@${EC2_HOST}:/home/ec2-user/backend/"
Write-Host "✅ Uploaded" -ForegroundColor Green

# Step 3: Create systemd service
Write-Host "[3/4] Creating service..." -ForegroundColor Yellow
$serviceContent = @'
[Unit]
Description=Game Store Backend
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/backend
Environment="SPRING_PROFILES_ACTIVE=ec2"
Environment="GOOGLE_CLIENT_ID=dummy-client-id"
Environment="GOOGLE_CLIENT_SECRET=dummy-client-secret"
ExecStart=/usr/bin/java -jar /home/ec2-user/backend/ShopGameManagement-0.0.1-SNAPSHOT.jar
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
'@

$tempFile = [System.IO.Path]::GetTempFileName()
$serviceContent | Out-File -FilePath $tempFile -Encoding ascii -NoNewline

& scp -i "$SSH_KEY" $tempFile "${EC2_USER}@${EC2_HOST}:/tmp/game-store-backend.service"
& ssh -i "$SSH_KEY" "${EC2_USER}@${EC2_HOST}" "sudo mv /tmp/game-store-backend.service /etc/systemd/system/ && sudo systemctl daemon-reload && sudo systemctl enable game-store-backend"

Remove-Item $tempFile

# Step 4: Start service
Write-Host "[4/4] Starting service..." -ForegroundColor Yellow
& ssh -i "$SSH_KEY" "${EC2_USER}@${EC2_HOST}" "sudo systemctl start game-store-backend && sleep 2 && sudo systemctl status game-store-backend --no-pager"

Write-Host ""
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "Check logs: ssh -i `"$SSH_KEY`" ${EC2_USER}@${EC2_HOST} 'sudo journalctl -u game-store-backend -f'" -ForegroundColor Cyan

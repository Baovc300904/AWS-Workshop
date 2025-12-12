# ============================================
# Deploy Frontend to EC2 Instance (PowerShell)
# ============================================

param(
    [string]$KeyFile = "D:\AWS\keys\game-store-backend-key.pem",
    [string]$EC2Host = "13.212.125.86",
    [string]$EC2User = "ec2-user",
    [string]$Domain = "www.awstestgamexyz.space"
)

$ErrorActionPreference = "Stop"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Deploying Frontend to EC2" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check build
Write-Host "[1/5] Checking build files..." -ForegroundColor Yellow
if (-not (Test-Path "dist")) {
    Write-Host "[ERROR] dist folder not found! Run 'npm run build' first" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Build files found" -ForegroundColor Green
Write-Host ""

# Step 2: Prepare remote directory
Write-Host "[2/5] Preparing remote directory..." -ForegroundColor Yellow
ssh -i $KeyFile "${EC2User}@${EC2Host}" "mkdir -p /home/ec2-user/frontend"
Write-Host "[OK] Remote directory ready" -ForegroundColor Green
Write-Host ""

# Step 3: Upload files
Write-Host "[3/5] Uploading files to EC2..." -ForegroundColor Yellow
scp -i $KeyFile -r dist/* "${EC2User}@${EC2Host}:/home/ec2-user/frontend/"
Write-Host "[OK] Files uploaded" -ForegroundColor Green
Write-Host ""

# Step 4: Install Nginx
Write-Host "[4/5] Installing and configuring Nginx..." -ForegroundColor Yellow
ssh -i $KeyFile "${EC2User}@${EC2Host}" "sudo yum install -y nginx"
Write-Host "[OK] Nginx installed" -ForegroundColor Green
Write-Host ""

# Step 5: Configure Nginx with domain
Write-Host "[5/5] Configuring Nginx for $Domain..." -ForegroundColor Yellow

# Create Nginx config
$nginxConfig = @"
# Backend API reverse proxy
server {
    listen 80;
    server_name $Domain;
    
    # Frontend files
    location / {
        root /home/ec2-user/frontend;
        try_files `$uri `$uri/ /index.html;
        index index.html;
    }
    
    # Backend API proxy
    location /identity/ {
        proxy_pass http://localhost:8080/identity/;
        proxy_set_header Host `$host;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
    }
}
"@

# Upload nginx config
$tempConfig = [System.IO.Path]::GetTempFileName()
$nginxConfig | Out-File -FilePath $tempConfig -Encoding ASCII
scp -i $KeyFile $tempConfig "${EC2User}@${EC2Host}:/tmp/game-store.conf"
Remove-Item $tempConfig

# Apply nginx config
ssh -i $KeyFile "${EC2User}@${EC2Host}" @"
sudo mv /tmp/game-store.conf /etc/nginx/conf.d/game-store.conf
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
"@

Write-Host "[OK] Nginx configured" -ForegroundColor Green
Write-Host ""

# Step 6: Setup SSL
Write-Host "[6/6] Setting up SSL certificate..." -ForegroundColor Yellow
Write-Host "  - Installing Certbot..." -ForegroundColor Gray
ssh -i $KeyFile "${EC2User}@${EC2Host}" "sudo yum install -y certbot python3-certbot-nginx"

Write-Host "  - Requesting SSL certificate..." -ForegroundColor Gray
$sslResult = ssh -i $KeyFile "${EC2User}@${EC2Host}" "sudo certbot --nginx -d $Domain --non-interactive --agree-tos --email khoaphanconghon62@gmail.com --redirect 2>&1"
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] SSL configured successfully!" -ForegroundColor Green
} else {
    Write-Host "[WARNING] SSL setup had issues (this is OK if DNS is not ready yet)" -ForegroundColor Yellow
    Write-Host "SSL output: $sslResult" -ForegroundColor Gray
}
Write-Host ""

Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Deployment Complete!" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "URLs:" -ForegroundColor Yellow
Write-Host "  Frontend: " -NoNewline
Write-Host "https://$Domain" -ForegroundColor Green
Write-Host "  Backend API: " -NoNewline
Write-Host "https://$Domain/identity" -ForegroundColor Green
Write-Host ""
Write-Host "Important:" -ForegroundColor Yellow
Write-Host "  - Ensure DNS points $Domain to $EC2Host" -ForegroundColor Gray
Write-Host "  - Security Group must allow ports: 22, 80, 443, 8080" -ForegroundColor Gray
Write-Host "  - If SSL failed, run certbot manually after DNS is ready" -ForegroundColor Gray
Write-Host ""

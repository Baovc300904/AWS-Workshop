# Deploy Frontend to EC2
$ErrorActionPreference = "Stop"

$EC2_USER = "ec2-user"
$EC2_HOST = "13.212.125.86"
$SSH_KEY = "D:\AWS\keys\game-store-backend-key.pem"
$FRONTEND_DIR = "/home/ec2-user/frontend"

Write-Host "🎨 Deploying Frontend to EC2..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Build frontend
Write-Host "[1/5] Building frontend..." -ForegroundColor Yellow
cd ..\Front-End
npm run build
cd ..\Back-End

# Step 2: Create tar archive
Write-Host "[2/5] Creating archive..." -ForegroundColor Yellow
$distPath = "..\Front-End\dist"
if (Test-Path "$distPath\frontend.tar.gz") {
    Remove-Item "$distPath\frontend.tar.gz"
}
tar -czf "$distPath\frontend.tar.gz" -C $distPath .
Write-Host "✅ Archive created" -ForegroundColor Green

# Step 3: Upload to EC2
Write-Host "[3/5] Uploading to EC2..." -ForegroundColor Yellow
& ssh -i "$SSH_KEY" "${EC2_USER}@${EC2_HOST}" "mkdir -p $FRONTEND_DIR"
& scp -i "$SSH_KEY" "$distPath\frontend.tar.gz" "${EC2_USER}@${EC2_HOST}:${FRONTEND_DIR}/"
Write-Host "✅ Uploaded" -ForegroundColor Green

# Step 4: Extract on EC2
Write-Host "[4/5] Extracting files..." -ForegroundColor Yellow
& ssh -i "$SSH_KEY" "${EC2_USER}@${EC2_HOST}" "cd /home/ec2-user/frontend && rm -rf assets index.html *.js *.css 2>/dev/null && tar -xzf frontend.tar.gz && rm frontend.tar.gz"
Write-Host "✅ Extracted" -ForegroundColor Green

# Step 5: Setup nginx
Write-Host "[5/5] Setting up nginx..." -ForegroundColor Yellow
$nginxConfig = @'
server {
    listen 5173;
    server_name _;
    
    root /home/ec2-user/frontend;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /identity {
        proxy_pass http://localhost:8080/identity;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
'@

$tempFile = [System.IO.Path]::GetTempFileName()
$nginxConfig | Out-File -FilePath $tempFile -Encoding ascii -NoNewline

& scp -i "$SSH_KEY" $tempFile "${EC2_USER}@${EC2_HOST}:/tmp/game-store-frontend.conf"
& ssh -i "$SSH_KEY" "${EC2_USER}@${EC2_HOST}" @"
sudo mv /tmp/game-store-frontend.conf /etc/nginx/conf.d/
sudo nginx -t && sudo systemctl restart nginx
"@

Remove-Item $tempFile
Write-Host "✅ Nginx configured" -ForegroundColor Green

Write-Host ""
Write-Host "✅ Frontend Deployment Complete!" -ForegroundColor Green
Write-Host "Access at: http://13.212.125.86:5173" -ForegroundColor Cyan

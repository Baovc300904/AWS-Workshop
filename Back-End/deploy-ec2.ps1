# ============================================
# Deploy Backend to EC2 Instance (PowerShell)
# ============================================

param(
    [string]$KeyFile = "D:\AWS\keys\game-store-backend-key.pem",
    [string]$EC2Host = "13.212.125.86",
    [string]$EC2User = "ec2-user"
)

$ErrorActionPreference = "Stop"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Deploying Backend to EC2" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build project
Write-Host "[1/5] Building project with Maven..." -ForegroundColor Yellow
& .\mvnw.cmd clean package -DskipTests
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Maven build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Build successful" -ForegroundColor Green
Write-Host ""

# Step 2: Check files
Write-Host "[2/5] Checking required files..." -ForegroundColor Yellow
if (-not (Test-Path $KeyFile)) {
    Write-Host "[ERROR] Key file not found: $KeyFile" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path "target\ShopGameManagement-0.0.1-SNAPSHOT.jar")) {
    Write-Host "[ERROR] JAR file not found!" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path ".env.aws")) {
    Write-Host "[ERROR] Environment file not found: .env.aws" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] All required files found" -ForegroundColor Green
Write-Host ""

# Step 3: Test EC2 connection
Write-Host "[3/5] Testing EC2 connection..." -ForegroundColor Yellow
Write-Host "Note: If this is your first connection, you may need to accept the host key" -ForegroundColor Gray
$testConnection = ssh -i $KeyFile -o ConnectTimeout=10 "${EC2User}@${EC2Host}" "echo 'Connection successful'" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Cannot connect to EC2!" -ForegroundColor Red
    Write-Host "Please check:" -ForegroundColor Red
    Write-Host "  - Key file permissions" -ForegroundColor Red
    Write-Host "  - Security group allows SSH (port 22) from your IP" -ForegroundColor Red
    Write-Host "  - EC2 instance is running" -ForegroundColor Red
    Write-Host "  - Public IP is correct: $EC2Host" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] EC2 connection successful" -ForegroundColor Green
Write-Host ""

# Step 4: Prepare remote directory
Write-Host "[4/5] Preparing remote directory..." -ForegroundColor Yellow
ssh -i $KeyFile "${EC2User}@${EC2Host}" "mkdir -p /home/ec2-user/backend"
Write-Host "[OK] Remote directory ready" -ForegroundColor Green
Write-Host ""

# Step 5: Upload files
Write-Host "[5/5] Uploading files to EC2..." -ForegroundColor Yellow

Write-Host "  - Uploading JAR file..." -ForegroundColor Gray
scp -i $KeyFile "target\ShopGameManagement-0.0.1-SNAPSHOT.jar" "${EC2User}@${EC2Host}:/home/ec2-user/backend/app.jar"

Write-Host "  - Uploading environment file..." -ForegroundColor Gray
scp -i $KeyFile ".env.aws" "${EC2User}@${EC2Host}:/home/ec2-user/backend/.env"

Write-Host "  - Uploading application config..." -ForegroundColor Gray
scp -i $KeyFile "src\main\resources\application-ec2.yaml" "${EC2User}@${EC2Host}:/home/ec2-user/backend/application-ec2.yaml"

Write-Host "[OK] Files uploaded" -ForegroundColor Green
Write-Host ""

# Step 6: Start application
Write-Host "[6/6] Starting application on EC2..." -ForegroundColor Yellow

# Stop old process
Write-Host "  - Stopping old process..." -ForegroundColor Gray
ssh -i $KeyFile "${EC2User}@${EC2Host}" "cd /home/ec2-user/backend && if [ -f app.pid ]; then kill `$(cat app.pid) 2>/dev/null || true; rm app.pid; fi"

# Load env and start new process
Write-Host "  - Starting new application..." -ForegroundColor Gray
ssh -i $KeyFile "${EC2User}@${EC2Host}" "cd /home/ec2-user/backend && export `$(cat .env | xargs) && nohup java -jar app.jar --spring.profiles.active=ec2 --spring.config.location=file:./application-ec2.yaml > app.log 2>&1 & echo `$! > app.pid"

Write-Host "  - Waiting for startup..." -ForegroundColor Gray
Start-Sleep -Seconds 10

# Check status
$status = ssh -i $KeyFile "${EC2User}@${EC2Host}" "cd /home/ec2-user/backend && if ps -p `$(cat app.pid 2>/dev/null) > /dev/null 2>&1; then echo 'RUNNING'; tail -n 10 app.log; else echo 'FAILED'; cat app.log; fi"
if ($status -match "RUNNING") {
    Write-Host "[OK] Application is running" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Application failed to start" -ForegroundColor Red
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Deployment Complete!" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "API Endpoint: " -NoNewline
Write-Host "http://13.212.125.86:8080/identity" -ForegroundColor Green
Write-Host "Health Check: " -NoNewline
Write-Host "http://13.212.125.86:8080/identity/actuator/health" -ForegroundColor Green
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  View logs:    ssh -i $KeyFile ${EC2User}@${EC2Host} 'tail -f /home/ec2-user/backend/app.log'" -ForegroundColor Gray
Write-Host "  Stop app:     ssh -i $KeyFile ${EC2User}@${EC2Host} 'kill `$(cat /home/ec2-user/backend/app.pid)'" -ForegroundColor Gray
Write-Host "  Check status: ssh -i $KeyFile ${EC2User}@${EC2Host} 'ps -p `$(cat /home/ec2-user/backend/app.pid)'" -ForegroundColor Gray
Write-Host ""


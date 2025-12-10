# Setup SSL for keygamezspace.space
$ErrorActionPreference = "Stop"

$EC2_USER = "ec2-user"
$EC2_HOST = "13.212.125.86"
$SSH_KEY = "D:\AWS\keys\game-store-backend-key.pem"
$DOMAIN = "keygamezspace.space"
$EMAIL = "huynhvuminhkhoi157@gmail.com"  # Email cho Let's Encrypt

Write-Host "🔐 Setting up SSL for $DOMAIN..." -ForegroundColor Cyan
Write-Host ""

# Upload SSL setup script
Write-Host "[1/3] Uploading SSL setup script..." -ForegroundColor Yellow
& scp -i "$SSH_KEY" "setup-ssl.sh" "${EC2_USER}@${EC2_HOST}:/tmp/"

# Make executable and run
Write-Host "[2/3] Installing certbot and getting SSL certificate..." -ForegroundColor Yellow
& ssh -i "$SSH_KEY" "${EC2_USER}@${EC2_HOST}" "chmod +x /tmp/setup-ssl.sh && sudo sed -i 's/your-email@example.com/$EMAIL/g' /tmp/setup-ssl.sh && sudo bash /tmp/setup-ssl.sh"

Write-Host "[3/3] Verifying SSL..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "✅ SSL Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Verify DNS: nslookup keygamezspace.space" -ForegroundColor White
Write-Host "2. Test HTTPS: https://keygamezspace.space" -ForegroundColor White
Write-Host "3. Update MoMo Dashboard với callback URLs mới" -ForegroundColor White
Write-Host ""
Write-Host "MoMo Callback URLs:" -ForegroundColor Yellow
Write-Host "  Payment IPN: https://keygamezspace.space/identity/payment/momo/callback" -ForegroundColor White
Write-Host "  Payment Redirect: https://keygamezspace.space/checkout/result" -ForegroundColor White
Write-Host "  Topup IPN: https://keygamezspace.space/identity/topup/momo/callback" -ForegroundColor White
Write-Host "  Topup Redirect: https://keygamezspace.space/profile/topup-callback" -ForegroundColor White

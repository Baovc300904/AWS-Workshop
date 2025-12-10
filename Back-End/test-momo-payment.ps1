# Test MoMo Payment Integration
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Testing MoMo Payment Integration" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Get token first (you need to login)
Write-Host "[1/3] Please provide your login token:" -ForegroundColor Yellow
Write-Host "  1. Login at https://www.awstestgamexyz.space/login" -ForegroundColor Gray
Write-Host "  2. Open Browser Console (F12)" -ForegroundColor Gray
Write-Host "  3. Run: localStorage.getItem('wgs_token')" -ForegroundColor Gray
Write-Host "  4. Copy the token and paste here" -ForegroundColor Gray
Write-Host ""
$token = Read-Host "Enter token"

if (!$token) {
    Write-Host "[ERROR] Token is required!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2/3] Creating MoMo payment..." -ForegroundColor Yellow

# Create MoMo payment request
$body = @{
    cartItems = @(
        @{
            gameId = "1"
            quantity = 1
        }
    )
    totalAmount = 100000
    paymentMethod = "MOMO"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "https://www.awstestgamexyz.space/identity/payment/momo/create" `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -ErrorAction Stop

    Write-Host "[OK] Payment created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "[3/3] MoMo Payment Details:" -ForegroundColor Yellow
    Write-Host "  Payment URL: $($response.payUrl)" -ForegroundColor Cyan
    Write-Host "  Order ID: $($response.orderId)" -ForegroundColor Gray
    Write-Host "  Request ID: $($response.requestId)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Testing redirect URL pattern..." -ForegroundColor Yellow
    if ($response.payUrl -match "www\.awstestgamexyz\.space") {
        Write-Host "[✓] Redirect URL is CORRECT (uses domain)" -ForegroundColor Green
    } elseif ($response.payUrl -match "13\.212\.125\.86") {
        Write-Host "[✗] Redirect URL is WRONG (uses IP address)" -ForegroundColor Red
        Write-Host "    Expected: https://www.awstestgamexyz.space/payment/callback" -ForegroundColor Red
        Write-Host "    Got: $($response.payUrl)" -ForegroundColor Red
    } else {
        Write-Host "[?] Redirect URL pattern unclear: $($response.payUrl)" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Open this URL in browser: $($response.payUrl)" -ForegroundColor Gray
    Write-Host "  2. Complete MoMo payment" -ForegroundColor Gray
    Write-Host "  3. Verify redirect to: https://www.awstestgamexyz.space/payment/callback" -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] Failed to create payment!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}

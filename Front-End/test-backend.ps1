# Test Backend API Connectivity

Write-Host "Testing Backend API at http://localhost:8080/identity" -ForegroundColor Cyan
Write-Host ""

# Test 1: Games list (public endpoint)
Write-Host "[1/4] Testing GET /games (public)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/identity/games" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ /games OK - Status: $($response.StatusCode)" -ForegroundColor Green
        $json = $response.Content | ConvertFrom-Json
        Write-Host "  Response has 'result' field: $($json.result -ne $null)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ /games FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Games by price asc (public endpoint)
Write-Host "[2/4] Testing GET /games/by-price-asc (public)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/identity/games/by-price-asc" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ /games/by-price-asc OK - Status: $($response.StatusCode)" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ /games/by-price-asc FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Category list (public endpoint)
Write-Host "[3/4] Testing GET /category (public)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/identity/category" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ /category OK - Status: $($response.StatusCode)" -ForegroundColor Green
        $json = $response.Content | ConvertFrom-Json
        Write-Host "  Response has 'result' field: $($json.result -ne $null)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ /category FAILED - $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  This is the endpoint causing 401 errors in screenshot" -ForegroundColor Magenta
}
Write-Host ""

# Test 4: Search games (public endpoint)
Write-Host "[4/4] Testing GET /games/search?keyword=game (public)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/identity/games/search?keyword=game" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ /games/search OK - Status: $($response.StatusCode)" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ /games/search FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "If you see 401 errors above, possible causes:" -ForegroundColor Yellow
Write-Host "1. Backend not running (mvn spring-boot:run)" -ForegroundColor Gray
Write-Host "2. MySQL not running or DB 'identity_service' missing" -ForegroundColor Gray
Write-Host "3. SecurityConfig CORS not applied (restart backend)" -ForegroundColor Gray
Write-Host "4. Frontend sending stale Authorization header on public endpoints" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "- Ensure backend is running: cd Back-End && mvn spring-boot:run" -ForegroundColor Gray
Write-Host "- Check MySQL: mysql -u root -p (database: identity_service)" -ForegroundColor Gray
Write-Host "- Clear browser cache / localStorage and retry frontend" -ForegroundColor Gray

# 🧪 TEST MOMO & DEPLOYMENT - EC2

## ✅ TRẠNG THÁI HIỆN TẠI

### Backend
- **URL**: http://13.212.125.86:8080/identity
- **Status**: ✅ Running
- **Profile**: ec2
- **Database**: RDS MySQL connected

### Frontend  
- **URL**: http://13.212.125.86:5173
- **Status**: ⚠️ Need to open port 5173 in Security Group
- **Nginx**: ✅ Configured
- **Files**: ✅ Deployed

---

## 🔧 BƯỚC 1: MỞ PORT TRONG SECURITY GROUP

### AWS Console
1. Vào **EC2 Console** → **Security Groups**
2. Tìm Security Group của instance `13.212.125.86`
3. **Edit Inbound Rules** → Add:
   - **Type**: Custom TCP
   - **Port**: 5173
   - **Source**: 0.0.0.0/0 (hoặc My IP để bảo mật hơn)
   - **Description**: Frontend React App

4. **Save rules**

---

## 🧪 BƯỚC 2: TEST BACKEND API

### Test 1: Health Check
```powershell
curl http://13.212.125.86:8080/identity/actuator/health
```
**Expected**: `{"code":1006,"message":"Unauthenticated"}` (OK - endpoint cần auth)

### Test 2: Create Account
```powershell
$body = @{
    username = "testuser"
    email = "test@example.com"
    password = "Test@123"
    firstName = "Test"
    lastName = "User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://13.212.125.86:8080/identity/users" -Method POST -Body $body -ContentType "application/json"
```

### Test 3: Login
```powershell
$loginBody = @{
    username = "testuser"
    password = "Test@123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://13.212.125.86:8080/identity/auth/token" -Method POST -Body $loginBody -ContentType "application/json"
$token = $response.result.token
Write-Host "Token: $token"
```

---

## 💳 BƯỚC 3: TEST MOMO TOPUP

### Cấu hình MoMo hiện tại:
- **Partner Code**: MOMOLRJZ20181206
- **Endpoint**: https://test-payment.momo.vn/v2/gateway/api/create
- **Redirect URL**: http://13.212.125.86:5173/profile/topup-callback
- **IPN URL**: http://13.212.125.86:8080/identity/topup/momo/callback

### Test Topup Flow:
1. **Tạo topup request**:
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

$topupBody = @{
    amount = 100000
    description = "Test topup"
} | ConvertTo-Json

$topupResponse = Invoke-RestMethod -Uri "http://13.212.125.86:8080/identity/topup/momo" -Method POST -Headers $headers -Body $topupBody -ContentType "application/json"

Write-Host "MoMo Payment URL: $($topupResponse.result.payUrl)"
```

2. **Mở URL trong browser** → Thanh toán
3. **Check logs** để xem callback:
```powershell
ssh -i "D:\AWS\keys\game-store-backend-key.pem" ec2-user@13.212.125.86 'sudo journalctl -u game-store-backend -f | grep -i momo'
```

4. **Verify balance đã tăng**:
```powershell
Invoke-RestMethod -Uri "http://13.212.125.86:8080/identity/topup/balance" -Headers $headers
```

---

## 🎮 BƯỚC 4: TEST MOMO PAYMENT GAME

### Cấu hình MoMo Payment:
- **Redirect URL**: http://13.212.125.86:5173/checkout/result
- **IPN URL**: http://13.212.125.86:8080/identity/payment/momo/callback

### Test Payment Flow:
1. **Tạo order**:
```powershell
$cartBody = @{
    items = @(
        @{
            gameId = 1
            quantity = 1
        }
    )
} | ConvertTo-Json

$orderResponse = Invoke-RestMethod -Uri "http://13.212.125.86:8080/identity/payment/momo/create-with-items" -Method POST -Headers $headers -Body $cartBody -ContentType "application/json"

Write-Host "Order ID: $($orderResponse.result.orderId)"
Write-Host "Payment URL: $($orderResponse.result.payUrl)"
```

2. **Mở payment URL** → Thanh toán

3. **Check order status**:
```powershell
$orderId = $orderResponse.result.orderId
Invoke-RestMethod -Uri "http://13.212.125.86:8080/identity/payment/momo/status/$orderId" -Headers $headers
```

Expected: Status chuyển PENDING → PROCESSING

4. **Check logs**:
```powershell
ssh -i "D:\AWS\keys\game-store-backend-key.pem" ec2-user@13.212.125.86 'sudo journalctl -u game-store-backend -n 50 | grep -A5 -B5 "Payment\|MoMo"'
```

---

## 🎨 BƯỚC 5: TEST FRONTEND

### Sau khi mở port 5173:
1. **Truy cập**: http://13.212.125.86:5173
2. **Test features**:
   - ✅ Register account
   - ✅ Login
   - ✅ Browse games
   - ✅ Add to cart
   - ✅ MoMo topup (Profile → Topup)
   - ✅ MoMo checkout (Cart → Checkout)

---

## 🔍 TROUBLESHOOTING

### Issue 1: Port 5173 không accessible
**Solution**: Mở port trong AWS Security Group (xem Bước 1)

### Issue 2: MoMo callback không được gọi
**Check**:
1. IPN URL phải accessible từ internet
2. EC2 Security Group mở port 8080 cho 0.0.0.0/0
3. Backend logs: `sudo journalctl -u game-store-backend -f`

### Issue 3: Balance không tăng sau topup
**Check logs**:
```powershell
ssh -i "D:\AWS\keys\game-store-backend-key.pem" ec2-user@13.212.125.86 'sudo journalctl -u game-store-backend | grep -i "topup\|balance"'
```

Look for:
- ✅ `Processing topup callback: orderId=xxx, resultCode=0`
- ✅ `Topup successful for user: xxx, amount: 100000`
- ❌ Any error messages

### Issue 4: Order không chuyển PROCESSING
**Check**:
```powershell
ssh -i "D:\AWS\keys\game-store-backend-key.pem" ec2-user@13.212.125.86 'sudo journalctl -u game-store-backend | grep -i "payment.*callback\|order.*processing"'
```

---

## 📊 VERIFICATION CHECKLIST

- [ ] Backend running on http://13.212.125.86:8080/identity
- [ ] Frontend accessible at http://13.212.125.86:5173
- [ ] MoMo topup callback returns "success"
- [ ] Balance increases after successful topup
- [ ] MoMo payment callback returns "success"
- [ ] Order status: PENDING → PROCESSING after payment
- [ ] Email "processing" sent to user
- [ ] No errors in backend logs

---

## 🚀 COMMANDS REFERENCE

### Restart Backend
```powershell
ssh -i "D:\AWS\keys\game-store-backend-key.pem" ec2-user@13.212.125.86 'sudo systemctl restart game-store-backend'
```

### View Backend Logs (live)
```powershell
ssh -i "D:\AWS\keys\game-store-backend-key.pem" ec2-user@13.212.125.86 'sudo journalctl -u game-store-backend -f'
```

### View Backend Logs (last 100 lines)
```powershell
ssh -i "D:\AWS\keys\game-store-backend-key.pem" ec2-user@13.212.125.86 'sudo journalctl -u game-store-backend -n 100 --no-pager'
```

### Restart Nginx
```powershell
ssh -i "D:\AWS\keys\game-store-backend-key.pem" ec2-user@13.212.125.86 'sudo systemctl restart nginx'
```

### Check Nginx Status
```powershell
ssh -i "D:\AWS\keys\game-store-backend-key.pem" ec2-user@13.212.125.86 'sudo systemctl status nginx'
```

---

## 📝 NOTES

- MoMo Sandbox chỉ hoạt động với account test của MoMo
- Callback URLs phải accessible từ internet (không dùng localhost)
- Frontend và Backend đều chạy trên cùng EC2 instance
- Database là RDS MySQL độc lập

**IP EC2**: 13.212.125.86
**Backend**: Port 8080
**Frontend**: Port 5173

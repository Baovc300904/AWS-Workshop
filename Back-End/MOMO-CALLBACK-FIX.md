# 🚨 URGENT FIX: MoMo Redirect URL Issue

## ❌ Vấn đề hiện tại

MoMo đang redirect về: `http://13.212.125.86:3000/payment/callback`

**Sai vì:**
- ❌ Dùng IP thay vì domain
- ❌ Port 3000 (không tồn tại)
- ❌ Không có HTTPS

**Đúng phải là:** `https://www.awstestgamexyz.space/payment/callback`

---

## ✅ GIẢI PHÁP - Fix ngay lập tức

### **Bước 1: SSH vào EC2**

```bash
ssh -i "your-keypair.pem" ec2-user@13.212.125.86
```

Nếu không có keypair, dùng EC2 Instance Connect từ AWS Console.

---

### **Bước 2: Set Environment Variables**

```bash
# Export biến môi trường
export MOMO_REDIRECT_URL="https://www.awstestgamexyz.space/payment/callback"
export MOMO_IPN_URL="https://www.awstestgamexyz.space/payment/momo/ipn"

# Thêm vào ~/.bashrc để persistent
cat >> ~/.bashrc << 'EOF'

# MoMo Payment URLs
export MOMO_REDIRECT_URL="https://www.awstestgamexyz.space/payment/callback"
export MOMO_IPN_URL="https://www.awstestgamexyz.space/payment/momo/ipn"
EOF

# Load lại
source ~/.bashrc
```

---

### **Bước 3: Restart Backend**

#### **Option A: Nếu dùng systemd service**

```bash
# Check service tồn tại không
sudo systemctl status game-store-backend

# Nếu có, restart
sudo systemctl restart game-store-backend

# Xem logs
sudo journalctl -u game-store-backend -f
```

#### **Option B: Nếu chạy manual bằng java -jar**

```bash
# Kill process hiện tại
pkill -f "ShopGameManagement"

# Chạy lại với env vars
cd /home/ec2-user/backend

nohup java -jar \
  -Dspring.profiles.active=ec2 \
  -Dmomo.redirectUrl=https://www.awstestgamexyz.space/payment/callback \
  -Dmomo.ipnUrl=https://www.awstestgamexyz.space/payment/momo/ipn \
  ShopGameManagement-0.0.1-SNAPSHOT.jar \
  > app.log 2>&1 &

# Check logs
tail -f app.log
```

---

### **Bước 4: Verify Configuration**

```bash
# Check environment variables
echo "MOMO_REDIRECT_URL: $MOMO_REDIRECT_URL"
echo "MOMO_IPN_URL: $MOMO_IPN_URL"

# Test backend API
curl -X GET http://localhost:8080/actuator/health

# Check logs for MoMo config
grep -i "momo" /home/ec2-user/backend/app.log | tail -20
```

---

## 🧪 Test Payment Flow

### **1. Test từ Frontend**

1. Go to: https://www.awstestgamexyz.space/store
2. Add game to cart
3. Go to Checkout
4. Select MoMo payment
5. Enter phone: `0987654321`
6. Click "Thanh toán"

### **2. Verify MoMo Request**

Check backend logs để thấy request gửi tới MoMo:

```bash
tail -f /home/ec2-user/backend/app.log | grep -i "redirecturl"
```

**Phải thấy:**
```
redirectUrl=https://www.awstestgamexyz.space/payment/callback
```

**KHÔNG được thấy:**
```
redirectUrl=http://13.212.125.86:3000/payment/callback  ❌
redirectUrl=http://localhost:5173/checkout/result       ❌
```

### **3. Complete Payment**

1. Scan QR MoMo (hoặc dùng MoMo Sandbox)
2. Complete payment
3. Should redirect to: `https://www.awstestgamexyz.space/payment/callback?resultCode=0&...`
4. See success page with "Thanh toán thành công!"
5. Order được tạo trong database với status PROCESSING

---

## 🔍 Troubleshooting

### **Backend vẫn dùng localhost URLs**

**Nguyên nhân:** Spring không load environment variables

**Fix:**

```bash
# Thêm vào systemd service file
sudo nano /etc/systemd/system/game-store-backend.service

# Thêm dòng này vào [Service] section:
Environment="MOMO_REDIRECT_URL=https://www.awstestgamexyz.space/payment/callback"
Environment="MOMO_IPN_URL=https://www.awstestgamexyz.space/payment/momo/ipn"
Environment="SPRING_PROFILES_ACTIVE=ec2"

# Save và reload
sudo systemctl daemon-reload
sudo systemctl restart game-store-backend
```

### **MoMo trả về error "Invalid signature"**

**Nguyên nhân:** redirectUrl trong request không match với registered URL

**Fix:** Contact MoMo support để update registered callback URL thành:
- `https://www.awstestgamexyz.space/payment/callback`

### **Không thấy Order sau khi thanh toán**

**Kiểm tra:**

1. Browser Console có errors không?
2. Backend API `/orders` có hoạt động không?

```bash
# Test create order API
curl -X POST http://localhost:8080/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [{"gameId":"123","gameName":"Test","quantity":1,"unitPrice":100000,"finalPrice":100000}],
    "paymentMethod": "MOMO",
    "status": "PROCESSING"
  }'
```

---

## 📋 Checklist

Sau khi fix, verify:

- [ ] Backend logs show correct redirectUrl (domain, not IP)
- [ ] MoMo payment redirects to HTTPS domain
- [ ] PaymentCallbackPage hiển thị success message
- [ ] Order được tạo với status PROCESSING
- [ ] Order hiển thị trong Admin Orders page
- [ ] User thấy order trong My Orders page

---

## 🎯 Files đã sửa

### **Backend**
```
✅ application.yaml              - redirectUrl: /payment/callback
✅ application-aws.yaml          - Default credentials + correct URLs
✅ application-ec2.yaml          - Sử dụng env vars ${MOMO_REDIRECT_URL}
```

### **Frontend**
```
✅ PaymentCallbackPage.tsx       - New page xử lý callback
✅ PaymentCallbackPage.css       - Styling
✅ App.tsx                        - Added route /payment/callback
✅ AdminOrdersPage.tsx            - Added Payment Method column
```

---

## ⚡ Quick Commands Cheat Sheet

```bash
# SSH to EC2
ssh -i keypair.pem ec2-user@13.212.125.86

# Set MoMo URLs
export MOMO_REDIRECT_URL="https://www.awstestgamexyz.space/payment/callback"
export MOMO_IPN_URL="https://www.awstestgamexyz.space/payment/momo/ipn"

# Restart backend
sudo systemctl restart game-store-backend

# View logs
sudo journalctl -u game-store-backend -f

# Test health
curl http://localhost:8080/actuator/health
```

---

**Last Updated:** December 9, 2025  
**Status:** ✅ Frontend Deployed | ⚠️ Backend Needs Restart with Env Vars

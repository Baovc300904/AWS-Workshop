# 📊 Backend vs Frontend API Integration Status

## ✅ ĐÃ TÍCH HỢP (Already Integrated)

### 1. **Authentication APIs** ✅
| Endpoint | Method | Frontend Implementation | Status |
|----------|--------|------------------------|--------|
| `/auth/log-in` | POST | `login()` trong `client.ts` | ✅ Done |
| `/auth/introspect` | POST | `introspect()` trong `client.ts` | ✅ Done |
| `/auth/google-login` | POST | `googleAuth.ts` service | ✅ Done |
| `/auth/logout` | POST | ❌ Chưa có | ⚠️ Missing |
| `/auth/refresh` | POST | ❌ Chưa có | ⚠️ Missing |

### 2. **User Management APIs** ✅
| Endpoint | Method | Frontend Implementation | Status |
|----------|--------|------------------------|--------|
| `/users` (register) | POST | `register()` trong `client.ts` | ✅ Done |
| `/users/myInfo` | GET | `getMyInfo()` trong `client.ts` | ✅ Done |
| `/users/{userId}` | PUT | `updateMyInfo()` trong `client.ts` | ✅ Done |
| `/users/{userId}` | GET | `getMyInfo()` trong `client.ts` | ✅ Done |
| `/users/forgot-password` | POST | `forgotPassword()` trong `client.ts` | ✅ Done |
| `/users/request-phone-otp` | POST | `requestPhoneOtp()` trong `client.ts` | ✅ Done |
| `/users/forgot-password/email/request` | POST | ❌ Chưa có | ⚠️ Missing |
| `/users/forgot-password/email/confirm` | POST | ❌ Chưa có | ⚠️ Missing |
| `/users` (get all) | GET | ❌ Chưa có (admin only) | ⚠️ Missing |
| `/users/{userId}` | DELETE | ❌ Chưa có (admin only) | ⚠️ Missing |

### 3. **Game Management APIs** ✅
| Endpoint | Method | Frontend Implementation | Status |
|----------|--------|------------------------|--------|
| `/games/by-price-asc` | GET | `fetchGamesByPrice('asc')` | ✅ Done |
| `/games/by-price-desc` | GET | `fetchGamesByPrice('desc')` | ✅ Done |
| `/games/search` | GET | `searchGames(keyword)` | ✅ Done |
| `/games/{gameName}` | GET | `fetchGame(id)` | ✅ Done |
| `/games` | POST | `createGame(payload)` | ✅ Done (Admin) |
| `/games/{gameId}` | PUT | `updateGame(id, payload)` | ✅ Done (Admin) |
| `/games/{gameId}` | DELETE | `deleteGame(id)` | ✅ Done (Admin) |
| `/games/{gameId}/upload-image` | POST | `uploadImageToS3()` + manual update | ⚠️ Partial |
| `/games/{gameId}/upload-cover` | POST | ❌ Chưa có endpoint riêng | ⚠️ Missing |
| `/games/{gameId}/upload-video` | POST | ❌ Chưa có endpoint riêng | ⚠️ Missing |

### 4. **Category APIs** ✅
| Endpoint | Method | Frontend Implementation | Status |
|----------|--------|------------------------|--------|
| `/category` | GET | `fetchCategories()` | ✅ Done |
| `/category` | POST | `createCategory()` | ✅ Done (Admin) |
| `/category/{categoryName}` | GET | ❌ Chưa có | ⚠️ Missing |
| `/category/{categoryId}` | PUT | ❌ Chưa có (Admin) | ⚠️ Missing |
| `/category/{categoryId}` | DELETE | ❌ Chưa có (Admin) | ⚠️ Missing |

### 5. **Payment APIs (MoMo)** ✅
| Endpoint | Method | Frontend Implementation | Status |
|----------|--------|------------------------|--------|
| `/payment/momo/create` | POST | `createMoMoPayment()` | ✅ Done |
| `/payment/momo/create-with-items` | POST | ❌ Chưa có | ⚠️ Missing |
| `/payment/momo/callback` | POST | Backend only (IPN) | N/A |
| `/payment/momo/test-success/{orderId}` | POST | ❌ Chưa có | ⚠️ Missing |

### 6. **Cart APIs** ⚠️
| Endpoint | Method | Frontend Implementation | Status |
|----------|--------|------------------------|--------|
| `/cart/add` | POST | Context only (localStorage) | ⚠️ Local Only |

---

## ❌ CHƯA TÍCH HỢP (Not Yet Integrated)

### 1. **Email APIs** ❌
| Endpoint | Method | Backend Exists | Frontend Status |
|----------|--------|----------------|-----------------|
| `/email/request-otp` | POST | ✅ | ✅ Done (`requestEmailOtp()`) |
| `/email/send-forgot-password` | POST | ✅ | ❌ Missing |

### 2. **Game Rating APIs** ❌
Backend có `GameRatingController` nhưng frontend **HOÀN TOÀN CHƯA CÓ**:
- `/ratings/**` - Tất cả endpoints về đánh giá game

### 3. **Admin APIs** ❌
Backend có `AdminController` nhưng frontend chưa integrate:
- `/admin/**` - Tất cả admin management endpoints

### 4. **Role & Permission APIs** ❌
| Endpoint | Method | Frontend Status |
|----------|--------|-----------------|
| `/roles/**` | ALL | ❌ Chưa có |
| `/permissions/**` | ALL | ❌ Chưa có |

### 5. **S3 Upload APIs** ⚠️
| Endpoint | Method | Frontend Implementation | Status |
|----------|--------|------------------------|--------|
| `/s3/upload` | POST | `uploadImageToS3()` | ✅ Done |
| Game image/cover/video uploads | POST | ⚠️ Dùng chung `/s3/upload` | Partial |

### 6. **VNPay APIs** ❌
Backend có `VNPayController` nhưng frontend **CHƯA CÓ**:
- `/payment/vnpay/**` - Tất cả VNPay endpoints

### 7. **Maintenance APIs** ❌
Backend có `MaintenanceController` nhưng frontend **CHƯA CÓ**:
- `/maintenance/**` - System maintenance endpoints

---

## 🔴 THIẾU Ở BACKEND (Missing in Backend)

### 1. **System Requirements Field** ❌
**Backend Game Entity KHÔNG CÓ systemRequirements:**
```java
// Backend Game.java - THIẾU field này
// Frontend đã có type definition:
systemRequirements?: {
  minimum?: { os, cpu, ram, gpu, storage, network };
  recommended?: { os, cpu, ram, gpu, storage, network };
}
```

**❗ CẦN BỔ SUNG:**
- Thêm field `systemRequirements` vào `Game` entity (dạng JSON hoặc embedded object)
- Update `GameCreationRequest` và `GameUpdateRequest`
- Update `GameResponse`

### 2. **Order Management APIs** ⚠️
Frontend có type definitions nhưng **CHƯA CÓ ENDPOINTS**:
- `fetchOrderSummary()` → `/orders/summary` ❌
- `fetchRecentOrders()` → `/orders/recent` ❌
- `fetchMonthlySales()` → `/orders/monthly-sales` ❌

Backend có `OrderService` nhưng thiếu các endpoints cho dashboard.

---

## 📊 TỔNG KẾT

### ✅ **Hoàn thiện tốt:**
- ✅ Authentication (login, register, introspect, google login)
- ✅ Game CRUD cơ bản (list, search, create, update, delete)
- ✅ Category basic operations
- ✅ User profile management
- ✅ MoMo payment creation
- ✅ S3 file upload

### ⚠️ **Cần cải thiện:**
1. **Logout & Refresh Token** - Backend có nhưng frontend chưa dùng
2. **Cart Management** - Frontend chỉ dùng localStorage, chưa sync với backend
3. **Email OTP for forgot password** - Backend có flow riêng chưa integrate
4. **Game media uploads** - Backend có 3 endpoints riêng (image/cover/video) nhưng frontend dùng chung S3
5. **Category full CRUD** - Thiếu update/delete ở frontend

### ❌ **Chưa có hoàn toàn:**
1. **Game Rating System** - Backend có controller đầy đủ, frontend 100% chưa có
2. **Admin Panel APIs** - Backend có, frontend chưa integrate
3. **Role & Permission Management** - Backend có, frontend chưa có
4. **VNPay Payment** - Backend có controller, frontend chưa có
5. **Order Dashboard APIs** - Frontend có types nhưng backend thiếu endpoints
6. **System Requirements** - Frontend có types nhưng **BACKEND THIẾU FIELD NÀY** ❗

---

## 🎯 ƯU TIÊN PHÁT TRIỂN

### High Priority (Cần làm ngay):
1. ⭐ **Thêm `systemRequirements` vào Backend Game entity** - Frontend đã sẵn sàng
2. ⭐ **Game Rating System** - UX quan trọng, backend đã có
3. ⭐ **Logout & Token Refresh** - Security cơ bản
4. ⭐ **Cart Backend Integration** - Hiện tại chỉ local, cần sync với server

### Medium Priority:
5. 📊 **Order Dashboard APIs** - Admin cần xem báo cáo
6. 🔐 **Role & Permission Management** - Admin panel cần
7. 📧 **Email OTP Forgot Password** - UX tốt hơn phone OTP

### Low Priority:
8. 💳 **VNPay Integration** - Alternative payment method
9. 🖼️ **Separate Game Media Upload Endpoints** - Hiện tại dùng chung S3 upload OK
10. 🛠️ **Maintenance APIs** - Admin tools

---

## 📝 NOTES

### Frontend có sẵn nhưng backend chưa implement:
- ✅ `systemRequirements` type definition
- ✅ Google OAuth callback handler
- ✅ Currency context (VND/USD switching)
- ✅ Wishlist context (localStorage only)

### Backend có sẵn nhưng frontend chưa dùng:
- ❌ GameRating endpoints
- ❌ Admin management endpoints
- ❌ VNPay payment
- ❌ Role/Permission CRUD
- ❌ Logout endpoint
- ❌ Refresh token endpoint
- ❌ Email forgot password flow

### Cả 2 đều thiếu:
- ❌ Order summary/dashboard (frontend có types, backend thiếu endpoints)
- ❌ Reviews management system (hiện tại hardcode 2 reviews)

---

## 🚀 RECOMMENDED NEXT STEPS

1. **Backend:** Thêm `systemRequirements` field vào Game entity
2. **Frontend:** Integrate Game Rating APIs để users có thể rate games
3. **Frontend:** Implement logout & refresh token
4. **Backend:** Tạo Order dashboard endpoints
5. **Frontend:** Sync cart với backend thay vì chỉ dùng localStorage

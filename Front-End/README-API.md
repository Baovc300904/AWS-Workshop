# Backend API Integration

## Cấu trúc Backend (Spring Boot)
- **Base URL**: `http://localhost:8080/identity`
- **Database**: MySQL (port 3306, database: `identity_service`)
- **Authentication**: JWT Bearer tokens

## Endpoints chính

### Authentication (`/auth`)
- `POST /auth/log-in` - Đăng nhập (body: `{ username, password }`)
- `POST /auth/logout` - Đăng xuất (body: `{ token }`)
- `POST /auth/refresh` - Refresh token (body: `{ token }`)
- `POST /auth/introspect` - Verify token (body: `{ token }`)

### Users (`/users`)
- `POST /users` - Tạo user mới
- `GET /users` - Lấy danh sách tất cả users (yêu cầu auth)
- `GET /users/{userId}` - Lấy chi tiết user
- `GET /users/myInfo` - Lấy thông tin user hiện tại (từ token)
- `PUT /users/{userId}` - Cập nhật user
- `DELETE /users/{userId}` - Xóa user
- `POST /users/forgot-password` - Quên mật khẩu
- `POST /users/reset-password` - Reset mật khẩu

### Games (`/games`)
- `GET /games` - Lấy tất cả games
- `GET /games/{gameName}` - Lấy game theo tên
- `GET /games/search?keyword=...` - Tìm kiếm games
- `GET /games/by-price-asc` - Lấy games sắp xếp giá tăng dần
- `GET /games/by-price-desc` - Lấy games sắp xếp giá giảm dần
- `POST /games` - Tạo game mới (admin)
- `PUT /games/{gameId}` - Cập nhật game
- `DELETE /games/{gameId}` - Xóa game

## Response Format
Backend trả về cấu trúc:
```json
{
  "code": 1000,
  "message": "Success",
  "result": { ... }
}
```

Frontend API client tự động unwrap `result`.

## Cách chạy

### 1. Khởi động Backend
```bash
cd d:\GitHub\Workshop-AWS\Back-End
# Đảm bảo MySQL đang chạy (port 3306)
# Database: identity_service
# User: root / Pass: 123456
mvn spring-boot:run
```
Backend sẽ chạy tại: http://localhost:8080/identity

### 2. Khởi động Frontend
```bash
cd d:\GitHub\Workshop-AWS\Front-End
npm install
npm run dev
```
Frontend chạy tại: http://localhost:5173
- Vite proxy `/identity` → `http://localhost:8080`

### 3. Test API
```powershell
# Health check
curl http://localhost:8080/identity/games

# Login
curl -X POST http://localhost:8080/identity/auth/log-in `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","password":"admin"}'

# Get my info (thay {TOKEN} bằng token từ login)
curl http://localhost:8080/identity/users/myInfo `
  -H "Authorization: Bearer {TOKEN}"
```

## Biến môi trường (.env)
```env
VITE_API_BASE=http://localhost:8080/identity
```

## Authentication Flow
1. User login → nhận `token`
2. Lưu token vào `localStorage.setItem('wgs_token', token)`
3. Mọi API call tự động thêm header: `Authorization: Bearer {token}`
4. Backend verify JWT và trả data

## Mapping Frontend ↔ Backend

| Frontend Old | Backend Endpoint |
|-------------|-----------------|
| `/api/games` | `/identity/games` |
| `/api/games/:id` | `/identity/games/{gameName}` |
| `/api/users` | `/identity/users` |
| Login logic | `/identity/auth/log-in` |

## Lưu ý
- Backend dùng `gameName` thay vì numeric `id` cho game lookup
- Cần start MySQL trước khi chạy backend
- Token hết hạn sẽ trả 401 → frontend cần handle logout/refresh
- Trong production, đổi `VITE_API_BASE` sang domain thật

## Troubleshooting
- **CORS error**: Backend đã config CORS? Kiểm tra `SecurityConfig.java`
- **401 Unauthorized**: Token hết hạn hoặc không valid
- **404**: Kiểm tra context-path (`/identity`) có đúng không
- **Connection refused**: MySQL hoặc backend chưa chạy

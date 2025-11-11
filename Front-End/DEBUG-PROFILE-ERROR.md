# 🔍 Debug Lỗi Profile "Unauthenticated"

## Bước 1: Kiểm tra Login Status

### Mở Console (F12):

1. Nhấn `F12` để mở DevTools
2. Chọn tab **Console**
3. Xem có lỗi gì màu đỏ không
4. Tìm các log sau:
   ```
   [ProfilePage] Error loading user info: ...
   [API] 401 Unauthorized ...
   ```

### Kiểm tra localStorage:

Trong Console, gõ:
```javascript
localStorage.getItem('wgs_token')
localStorage.getItem('token')
localStorage.getItem('username')
```

**Nếu tất cả đều `null`** → Bạn chưa login!

---

## Bước 2: Login Lại

### Nếu chưa login:

1. **Vào trang login:**
   ```
   http://localhost:5174/login
   ```

2. **Nhập thông tin:**
   - Username: (tài khoản backend của bạn)
   - Password: (mật khẩu của bạn)

3. **Click "Đăng nhập"**

4. **Kiểm tra Console:**
   ```
   [Login] Received token: YES
   [Login] JWT payload: { ... }
   [Login] User roles: [...]
   ```

5. **Sau khi login thành công** → Vào lại `/profile`

---

## Bước 3: Kiểm tra Backend

### Backend có đang chạy không?

**Test API endpoint:**

Mở terminal mới, gõ:
```bash
curl http://localhost:8080/identity/auth/introspect -X POST -H "Content-Type: application/json" -d "{\"token\":\"YOUR_TOKEN_HERE\"}"
```

**Hoặc dùng PowerShell:**
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/identity/auth/introspect" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"token":"test"}'
```

**Kết quả mong đợi:**
- ✅ Status 200 → Backend OK
- ❌ Connection refused → Backend chưa chạy
- ❌ 404 Not Found → Endpoint sai

---

## Bước 4: Kiểm tra Network Tab

### Trong DevTools:

1. Chọn tab **Network**
2. Reload trang `/profile`
3. Xem request nào bị lỗi:

**Các request sẽ có:**
- `/auth/introspect` - Kiểm tra token
- `/users/myInfo` - Lấy thông tin user

**Nếu thấy màu đỏ (401, 403, 500):**
- Click vào request đó
- Xem tab **Response** để đọc error message
- Xem tab **Headers** để check Authorization header

---

## Bước 5: Temporary Fix (Nếu Backend Chưa Có)

### Nếu backend chưa có endpoint `/users/myInfo`:

**Tạm thời mock data trong ProfilePage:**

```tsx
// Trong useEffect, thay vì:
const data = await getMyInfo();

// Dùng mock data:
const data = {
  id: 'mock-123',
  username: localStorage.getItem('username') || 'TestUser',
  firstName: 'Nguyễn',
  lastName: 'Văn A',
  email: 'test@example.com',
  phone: '0987654321',
  dob: '1990-01-15'
};
console.log('[ProfilePage] Using MOCK data:', data);
```

---

## Common Issues & Solutions

### ❌ Issue 1: "401 Unauthorized"

**Nguyên nhân:** Token không hợp lệ hoặc đã hết hạn

**Fix:**
1. Logout
2. Login lại
3. Token mới sẽ được lưu

### ❌ Issue 2: "Connection refused"

**Nguyên nhân:** Backend không chạy

**Fix:**
```bash
# Start backend (Java Spring Boot)
cd /path/to/backend
./mvnw spring-boot:run
# hoặc
java -jar target/your-app.jar
```

### ❌ Issue 3: "404 Not Found on /users/myInfo"

**Nguyên nhân:** Backend chưa có endpoint này

**Fix:** 
- Thêm endpoint vào backend
- Hoặc dùng mock data tạm thời (xem Bước 5)

### ❌ Issue 4: "CORS error"

**Nguyên nhân:** Backend chưa config CORS

**Fix Backend (Spring Boot):**
```java
@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:5174")
                    .allowedMethods("*")
                    .allowedHeaders("*");
            }
        };
    }
}
```

---

## Quick Debug Script

Paste vào Console để debug:

```javascript
// Check login status
console.log('=== DEBUG INFO ===');
console.log('Token (wgs_token):', localStorage.getItem('wgs_token'));
console.log('Token (token):', localStorage.getItem('token'));
console.log('Username:', localStorage.getItem('username'));
console.log('User:', localStorage.getItem('user'));

// Test API
const token = localStorage.getItem('wgs_token') || localStorage.getItem('token');
if (token) {
  fetch('http://localhost:8080/identity/auth/introspect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  })
  .then(r => r.json())
  .then(d => console.log('Introspect result:', d))
  .catch(e => console.error('Introspect error:', e));
  
  fetch('http://localhost:8080/identity/users/myInfo', {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  .then(r => r.json())
  .then(d => console.log('MyInfo result:', d))
  .catch(e => console.error('MyInfo error:', e));
} else {
  console.error('❌ No token found - Please login first!');
}
```

---

## Next Steps

1. ✅ Mở Console (F12)
2. ✅ Kiểm tra có token không
3. ✅ Nếu không có → Login lại
4. ✅ Nếu có → Chạy debug script
5. ✅ Xem error message cụ thể
6. ✅ Report lại cho tôi kết quả

---

**Bạn hãy làm theo các bước trên và cho tôi biết:**
1. Console có log gì?
2. localStorage có token không?
3. Đã login chưa?
4. Backend có chạy không?

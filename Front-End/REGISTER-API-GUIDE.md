# Register API Documentation

## 📋 Backend API Specification

### Endpoint
```
POST /identity/users
```

### Request Body (UserCreationRequest)

```typescript
{
  username: string;      // Required, min 3 chars
  password: string;      // Required, min 8 chars
  firstName?: string;    // Optional
  lastName?: string;     // Optional
  dob?: string;          // Optional, format: yyyy-MM-dd, must be 12+ years old
  email?: string;        // Optional, must be valid email format
  emailOtp?: string;     // Optional, OTP code sent to email
  phone?: string;        // Optional, pattern: +84XXXXXXXXX or 0XXXXXXXXX
}
```

### Backend Validation Rules

| Field | Constraint | Error Code | Vietnamese Message |
|-------|-----------|------------|-------------------|
| username | Min 3 chars | USERNAME_INVALID | "Username phải có ít nhất 3 ký tự" |
| password | Min 8 chars | INVALID_PASSWORD | "Mật khẩu phải có ít nhất 8 ký tự" |
| dob | 12+ years old | INVALID_DOB | "Ngày sinh không hợp lệ (phải từ 12 tuổi trở lên)" |
| email | Valid email | INVALID_EMAIL | "Email không hợp lệ" |
| phone | VN format | INVALID_PHONE | "Số điện thoại không hợp lệ" |
| username | Unique | USER_EXISTED | "Username đã tồn tại, vui lòng chọn tên khác" |

### Response

**Success (200):**
```json
{
  "code": 1000,
  "message": "Success",
  "result": {
    "id": "uuid-string",
    "username": "user123",
    "firstName": "Nguyen",
    "lastName": "Van A",
    "dob": "2005-01-15",
    "email": "user@example.com",
    "phone": "0901234567",
    "roles": []
  }
}
```

**Error (400):**
```json
{
  "code": 1003,
  "message": "USERNAME_INVALID"
}
```

---

## 🎨 Frontend UI Updates

### New Features

#### 1. **Field-Level Validation**
- ✅ Real-time validation on submit
- ✅ Individual error messages below each field
- ✅ Red border for invalid fields
- ✅ Error icon (⚠) prefix

#### 2. **Email Field**
- ✅ Added email input field
- ✅ Email format validation
- ✅ Optional field (can be left empty)

#### 3. **Enhanced Password Field**
- ✅ Minimum 8 characters (updated from 6)
- ✅ Eye icon toggle (👁️ / 👁️‍🗨️)
- ✅ Password confirmation check

#### 4. **Date of Birth Validation**
- ✅ Max date = 12 years ago (prevents underage)
- ✅ Helper text: "Phải từ 12 tuổi trở lên"
- ✅ Age calculation on submit

#### 5. **Phone Number Validation**
- ✅ Vietnam format: `0XXXXXXXXX` or `+84XXXXXXXXX`
- ✅ Validates before sending OTP
- ✅ Improved OTP button with emoji icons

#### 6. **Required Field Indicators**
- ✅ Red asterisk (*) for required fields
- ✅ Only username, password, confirm password are required

#### 7. **Better Error Messages**
- ✅ Backend error code mapping to Vietnamese
- ✅ Network error detection
- ✅ Success message with username
- ✅ All messages have emoji prefixes (✅, ❌, ⚠️, 📱)

#### 8. **Improved Button States**
- ✅ Loading state with ⏳ icon
- ✅ Disabled opacity when submitting
- ✅ Rocket emoji 🚀 on submit button

---

## 🧪 Testing Checklist

### Valid Registration
```
✅ Username: user123 (min 3 chars)
✅ Password: password123 (min 8 chars)
✅ Confirm: password123 (must match)
✅ First Name: Nguyen (optional)
✅ Last Name: Van A (optional)
✅ DOB: 2005-01-15 (12+ years old)
✅ Email: user@example.com (valid format)
✅ Phone: 0901234567 (VN format)
```

### Validation Tests

#### Username Validation
- ❌ Empty → "Username là bắt buộc"
- ❌ "ab" (2 chars) → "Username tối thiểu 3 ký tự"
- ✅ "abc" → Valid

#### Password Validation
- ❌ Empty → "Mật khẩu là bắt buộc"
- ❌ "pass" (4 chars) → "Mật khẩu tối thiểu 8 ký tự"
- ❌ Mismatch → "Xác nhận mật khẩu không khớp"
- ✅ "password123" + match → Valid

#### Email Validation
- ✅ Empty → Valid (optional)
- ❌ "notanemail" → "Email không hợp lệ"
- ❌ "test@" → "Email không hợp lệ"
- ✅ "user@example.com" → Valid

#### Phone Validation
- ✅ Empty → Valid (optional)
- ❌ "123" → "Số điện thoại không hợp lệ"
- ❌ "123456789012" → Invalid
- ✅ "0901234567" → Valid
- ✅ "+84901234567" → Valid

#### DOB Validation
- ✅ Empty → Valid (optional)
- ❌ 2024-01-01 (0 years old) → "Bạn phải ít nhất 12 tuổi"
- ❌ 2015-01-01 (10 years old) → "Bạn phải ít nhất 12 tuổi"
- ✅ 2005-01-01 (20 years old) → Valid

### Backend Error Scenarios

#### Duplicate Username
**Request:**
```json
{ "username": "existinguser", "password": "password123" }
```
**Response:**
```json
{ "code": 1002, "message": "USER_EXISTED" }
```
**UI Display:** "Username đã tồn tại, vui lòng chọn tên khác"

#### Invalid Password
**Request:**
```json
{ "username": "newuser", "password": "short" }
```
**Response:**
```json
{ "code": 1003, "message": "INVALID_PASSWORD" }
```
**UI Display:** "Mật khẩu phải có ít nhất 8 ký tự"

#### Network Error
**Scenario:** Backend not running
**UI Display:** "❌ Không thể kết nối tới server. Vui lòng kiểm tra backend đang chạy."

---

## 📱 OTP Flow

### Email OTP (Backend xác thực qua email)

**Lưu ý:** Backend sử dụng **EMAIL OTP** chứ không phải phone OTP.

1. User nhập email: `user@example.com`
2. Backend tự động gửi OTP đến email (qua mail server)
3. User check email inbox và lấy mã OTP
4. Nhập mã OTP vào field "Mã OTP (từ email)"
5. Submit form với `emailOtp` field
6. Backend validates OTP và tạo account
7. Success: "✅ Đăng ký thành công! Chào mừng user123..."
8. Auto-redirect to `/login` after 1.5s

### Flow Diagram
```
User enters email
       ↓
Backend sends OTP to email
       ↓
User checks email inbox
       ↓
User enters OTP code in form
       ↓
Submit registration with emailOtp
       ↓
Backend validates OTP
       ↓
Success → Redirect to login
```

**Không còn Phone OTP button** - đã xóa để match với backend API.

---

## 🎯 UX Improvements Summary

### Before
- Basic validation (6 char password)
- No field-level errors
- Generic error messages
- No email field
- No visual feedback for errors

### After
- ✅ Strict validation (8 char password, 12+ age)
- ✅ Individual field errors with icons
- ✅ Vietnamese error messages
- ✅ Email field added
- ✅ Red borders for invalid fields
- ✅ Required field indicators (*)
- ✅ Helper text for complex fields
- ✅ Emoji icons for visual clarity
- ✅ Network error detection
- ✅ Success message with username

---

## 🔧 Code Highlights

### Client-Side Validation
```typescript
const errors: Record<string, string> = {};

if (username.length < 3) {
  errors.username = 'Username tối thiểu 3 ký tự';
}

if (password.length < 8) {
  errors.password = 'Mật khẩu tối thiểu 8 ký tự';
}

if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  errors.email = 'Email không hợp lệ';
}

if (phone && !/^(?:\+?84|0)?[0-9]{9,10}$/.test(phone)) {
  errors.phone = 'Số điện thoại không hợp lệ';
}

const birthDate = new Date(dob);
const age = today.getFullYear() - birthDate.getFullYear();
if (age < 12) {
  errors.dob = 'Bạn phải ít nhất 12 tuổi';
}
```

### Backend Error Mapping
```typescript
const errorMap: Record<string, string> = {
  'USERNAME_INVALID': 'Username phải có ít nhất 3 ký tự',
  'INVALID_PASSWORD': 'Mật khẩu phải có ít nhất 8 ký tự',
  'INVALID_DOB': 'Ngày sinh không hợp lệ (phải từ 12 tuổi trở lên)',
  'INVALID_EMAIL': 'Email không hợp lệ',
  'INVALID_PHONE': 'Số điện thoại không hợp lệ',
  'USER_EXISTED': 'Username đã tồn tại, vui lòng chọn tên khác',
};
```

### Field Error Display
```tsx
<input 
  className={fieldErrors.username ? 'error' : ''}
  ref={usernameRef}
/>
{fieldErrors.username && (
  <span className="fieldError">{fieldErrors.username}</span>
)}
```

---

## 📝 Files Changed

### Updated:
- ✅ `src/pages/RegisterPage.tsx` - Enhanced validation, field errors, email field
- ✅ `src/pages/RegisterPage.css` - Error styling, required indicators, hints

### CSS Classes Added:
- `.fieldError` - Individual field error messages
- `.fieldHint` - Helper text below fields
- `.required` - Red asterisk for required fields
- `.error` - Red border for invalid inputs

---

## 🚀 Next Steps

1. **Test registration flow**:
   ```bash
   cd Front-End
   npm run dev
   ```
   Navigate to `http://localhost:5173/register`

2. **Test with backend running**:
   ```bash
   cd Back-End
   mvn spring-boot:run
   ```

3. **Test scenarios**:
   - ✅ Valid registration
   - ❌ Short username (< 3 chars)
   - ❌ Short password (< 8 chars)
   - ❌ Invalid email format
   - ❌ Invalid phone format
   - ❌ Underage DOB (< 12 years)
   - ❌ Password mismatch
   - ❌ Duplicate username
   - ❌ Backend offline

4. **Verify success flow**:
   - Register successfully
   - See success message with username
   - Auto-redirect to login
   - Login with new credentials

---

Happy Registration! 🎉

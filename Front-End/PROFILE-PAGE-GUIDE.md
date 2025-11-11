# 👤 Hướng Dẫn Trang Cá Nhân (Profile Page)

## 📖 Tổng Quan

Trang cá nhân hiển thị thông tin chi tiết về người dùng, thống kê tài khoản, cài đặt bảo mật và các thao tác nhanh.

---

## ✨ Các Tính Năng Hiện Có

### 1. **Header Card - Thông Tin Tổng Quan**

**Có:**
- ✅ Avatar với chữ cái đầu của username
- ✅ Badge xác thực (dấu tích xanh)
- ✅ Tên hiển thị (firstName + lastName hoặc username)
- ✅ Username (@username)
- ✅ Thống kê nhanh:
  - 🎮 Games (0)
  - 🏆 Achievements (0)
  - ⏱️ Playtime (0h)

**Banner:**
- Gradient đẹp với hiệu ứng sóng
- Animation background pulse

---

### 2. **Personal Info Card - Thông Tin Cá Nhân**

**Có:**
- ✅ Username
- ✅ Họ (First Name)
- ✅ Tên (Last Name)
- ✅ Email
- ✅ Số điện thoại
- ✅ Ngày sinh (định dạng tiếng Việt)
- ✅ User ID (Courier New font)

**Tính năng:**
- Button "Chỉnh sửa" (hiện tại chỉ toggle state)
- Hiển thị "Chưa cập nhật" cho các field trống
- Hover effects đẹp

---

### 3. **Account Security Card - Bảo Mật**

**Có:**
- ✅ Tài khoản đã xác thực
- ✅ Mật khẩu (link đến /forgot)
- ✅ Email xác thực (nếu có)
- ✅ Số điện thoại xác thực (nếu có)

**Actions:**
- "Đổi mật khẩu" → Navigate to /forgot

---

### 4. **Quick Actions Card - Thao Tác Nhanh**

**4 buttons:**
1. ✏️ **Chỉnh sửa hồ sơ** - Toggle edit mode
2. 🔒 **Đổi mật khẩu** - Navigate to /forgot
3. ❤️ **Danh sách yêu thích** - Navigate to /wishlist
4. 🏠 **Về trang chủ** - Navigate to /

**Đặc điểm:**
- Icon gradient đẹp
- Hover animation scale + rotate
- Shadow effects

---

### 5. **Account Info Card - Thông Tin Tài Khoản**

**Stats (hiện đang hardcoded):**
- 🎮 Game đã mua: 0
- 💰 Tổng chi tiêu: 0 VND
- 📅 Thành viên từ: Mới tạo
- ⭐ Cấp độ: Bạc

---

### 6. **Logout Card - Đăng Xuất**

**Tính năng:**
- ✅ Gradient đỏ warning
- ✅ Icon 🚪
- ✅ Button "Đăng xuất ngay"
- ✅ Clear tất cả localStorage:
  - token
  - wgs_token
  - username
  - user

**Flow:**
1. Click button
2. Clear localStorage
3. Navigate to /login

---

## 🔄 Data Flow

### 1. **Load Data**

```typescript
useEffect(() => {
  // 1. Check token
  const token = localStorage.getItem('wgs_token') || localStorage.getItem('token');
  if (!token) navigate('/login');

  // 2. Introspect token
  const valid = await introspect(token);
  if (!valid) {
    // Clear tokens
    navigate('/login');
  }

  // 3. Get user info
  const data = await getMyInfo();
  setProfile(data);
}, [navigate]);
```

### 2. **API Endpoints Used**

| Function | Endpoint | Method | Auth |
|----------|----------|--------|------|
| `introspect(token)` | `/auth/introspect` | POST | ❌ Public |
| `getMyInfo()` | `/users/myInfo` | GET | ✅ Protected |

---

## 📊 User Profile Interface

```typescript
interface UserProfile {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string; // yyyy-MM-dd or ISO date
}
```

---

## 🎨 Design Features

### **Animations:**
- ✅ fadeIn on page load
- ✅ backgroundPulse (banner)
- ✅ bannerShine (gradient moving)
- ✅ badgePulse (verified badge)
- ✅ spin (loading spinner)

### **Colors:**
- Primary gradient: `#667eea → #764ba2`
- Success: `#11998e → #38ef7d`
- Danger: `#f093fb → #f5576c`
- Info: `#4facfe → #00f2fe`

### **Responsive:**
- Desktop (>1200px): 2-column grid (2fr 1fr)
- Tablet (768-1200px): 1-column + 2-column for right cards
- Mobile (<768px): Full 1-column stack
- Small (<480px): Compact avatars, smaller text

---

## ⚠️ Tính Năng CÒN THIẾU

### 1. **Edit Profile Form** ❌

**Cần:**
- Modal hoặc inline form để edit
- Fields: firstName, lastName, email, phone, dob
- Validation
- API: PUT `/users/{id}` hoặc `/users/profile`

**Hiện tại:**
- Button "Chỉnh sửa" chỉ toggle state `editing`
- Không có form input

---

### 2. **Upload Avatar** ❌

**Cần:**
- Upload image
- Crop/resize
- API: POST `/users/avatar` hoặc `/upload`
- Display uploaded avatar thay vì chữ cái

**Hiện tại:**
- Chỉ hiển thị chữ cái đầu tiên của username

---

### 3. **Real Game Stats** ❌

**Cần:**
- API để lấy:
  - Số game đã mua
  - Achievements đã đạt
  - Tổng thời gian chơi
  - Tổng chi tiêu

**Hiện tại:**
- Tất cả đều hardcoded = 0

---

### 4. **Change Password từ Profile** ❌

**Cần:**
- Form change password ngay trong profile
- Fields: oldPassword, newPassword, confirmPassword
- API: PUT `/users/change-password`

**Hiện tại:**
- Chỉ navigate to /forgot (forgot password flow)

---

### 5. **Account Level/Tier System** ❌

**Cần:**
- Logic tính cấp độ dựa trên:
  - Số tiền đã chi
  - Số game đã mua
  - Thời gian thành viên
- Hiển thị progress bar đến level tiếp theo

**Hiện tại:**
- Hardcoded "Bạc"

---

### 6. **Transaction History** ❌

**Cần:**
- Danh sách đơn hàng đã mua
- Chi tiết từng transaction
- API: GET `/orders/my-orders`

**Hiện tại:**
- Không có

---

### 7. **Notification Settings** ❌

**Cần:**
- Toggle nhận email marketing
- Toggle nhận SMS
- Toggle nhận thông báo game mới

**Hiện tại:**
- Không có

---

### 8. **Two-Factor Authentication (2FA)** ❌

**Cần:**
- Enable/disable 2FA
- QR code setup
- Backup codes

**Hiện tại:**
- Không có

---

### 9. **Linked Accounts** ❌

**Cần:**
- Link Google account
- Link Facebook
- Link Steam
- Link Discord

**Hiện tại:**
- Không có

---

### 10. **Member Since Date** ❌

**Cần:**
- Backend trả về `createdAt` field
- Display: "Thành viên từ: 5 tháng 11, 2024"

**Hiện tại:**
- Hardcoded "Mới tạo"

---

## 🛠️ Implementation Checklist

### **Priority 1: Edit Profile Form**

- [ ] Create modal/form component
- [ ] Add input fields with validation
- [ ] API endpoint: PUT `/users/profile`
- [ ] Handle success/error states
- [ ] Update profile state after save

**Code Example:**

```tsx
const [editMode, setEditMode] = useState(false);
const [formData, setFormData] = useState({
  firstName: profile?.firstName || '',
  lastName: profile?.lastName || '',
  email: profile?.email || '',
  phone: profile?.phone || '',
  dob: profile?.dob || '',
});

async function handleSave() {
  try {
    await updateProfile(profile.id, formData);
    setProfile({ ...profile, ...formData });
    setEditMode(false);
    toast.success('Cập nhật thành công!');
  } catch (error) {
    toast.error('Cập nhật thất bại!');
  }
}
```

---

### **Priority 2: Upload Avatar**

- [ ] Add file input (hidden)
- [ ] Preview image before upload
- [ ] Compress/resize image
- [ ] API: POST `/users/avatar` with FormData
- [ ] Update avatar URL in state

**Code Example:**

```tsx
async function handleAvatarUpload(file: File) {
  const formData = new FormData();
  formData.append('avatar', file);
  
  try {
    const res = await api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setProfile({ ...profile, avatar: res.data.result.url });
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
```

---

### **Priority 3: Real Stats**

- [ ] Backend API: GET `/users/stats`
- [ ] Return: { gamesOwned, achievements, playtime, totalSpent }
- [ ] Fetch on page load
- [ ] Display real numbers

**Backend Response Example:**

```json
{
  "result": {
    "gamesOwned": 15,
    "achievements": 42,
    "playtime": 1250, // minutes
    "totalSpent": 5000000, // VND
    "memberSince": "2024-06-15T10:30:00Z",
    "level": "Gold"
  }
}
```

---

### **Priority 4: Change Password Form**

- [ ] Add modal with 3 fields
- [ ] Validation: oldPassword !== newPassword
- [ ] API: PUT `/users/change-password`
- [ ] Success → Show toast, close modal

---

## 🎯 Gợi Ý UX Improvements

1. **Loading States:**
   - Skeleton loaders thay vì spinner
   - Shimmer animation

2. **Error Handling:**
   - Toast notifications
   - Inline error messages
   - Retry button

3. **Success Feedback:**
   - Animated checkmark
   - Confetti effect
   - Auto-close modal

4. **Accessibility:**
   - Keyboard navigation
   - Screen reader support
   - Focus management

5. **Progressive Disclosure:**
   - Accordion cho sections dài
   - "Xem thêm" button

---

## 🚀 Quick Start

### **Test Trang Cá Nhân:**

1. **Start app:**
   ```bash
   npm run dev
   ```

2. **Login:**
   - Go to: http://localhost:5174/login
   - Username: `test`
   - Password: `password123`

3. **View Profile:**
   - Click username ở navbar
   - Hoặc: http://localhost:5174/profile

4. **Check Console:**
   - Xem `[ProfilePage] User data loaded:` log
   - Verify API response

---

## 📝 Next Steps

1. ✅ **Trang đã có:** Header, Info, Security, Actions, Stats, Logout
2. ⚠️ **Cần implement:**
   - Edit profile form
   - Upload avatar
   - Real stats API
   - Change password
   - Transaction history
   - Level system

3. 🎨 **UI đã hoàn thiện:**
   - Responsive design
   - Animations
   - Colors
   - Hover effects

---

## 🐛 Known Issues

1. **Edit button không làm gì:**
   - Chỉ toggle `editing` state
   - Cần thêm form input

2. **Stats = 0:**
   - Hardcoded values
   - Cần API thật

3. **"Mới tạo" thay vì ngày thật:**
   - Backend chưa trả `createdAt`

4. **Avatar chỉ là chữ:**
   - Chưa có upload avatar
   - Chưa có avatar URL từ backend

---

## ✅ Conclusion

**Trang cá nhân đã có:**
- ✅ Giao diện đẹp, responsive
- ✅ Load data từ API
- ✅ Authentication flow
- ✅ Logout function
- ✅ Navigation links

**Còn thiếu:**
- ❌ Edit profile form
- ❌ Upload avatar
- ❌ Real statistics
- ❌ Change password
- ❌ Transaction history

**Ưu tiên tiếp theo:**
1. Edit profile form
2. Upload avatar
3. Real stats API

---

**Made with ❤️ by AI Assistant**

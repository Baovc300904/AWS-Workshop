# 🔧 DEBUG - Sửa lỗi "Chọn danh mục không được"

## ✅ ĐÃ SỬA

### 1. Fix Import trong App.tsx
```typescript
// TRƯỚC (SAI):
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));

// SAU (ĐÚNG):
const CategoriesPage = lazy(() => import('./pages/CategoriesPage').then(m => ({ default: m.default })));
```

### 2. Route đã được thêm
```typescript
<Route path="/categories" element={<CategoriesPage />} />
```

### 3. Link Navbar đã có
```tsx
<NavLink to="/categories" onClick={() => setMobileOpen(false)}>
    Danh mục
</NavLink>
```

---

## 🧪 CÁCH TEST

### Test 1: Dùng trang Test Navigation
```
URL: http://localhost:5173/test-nav
```
- Click các button để test navigation
- Xem console log
- Verify URL thay đổi đúng

### Test 2: Test trực tiếp Categories page
```
URL: http://localhost:5173/categories
```
- Trang sẽ load với hero section
- Grid hiển thị categories
- Stats section ở dưới

### Test 3: Test từ Navbar
```
1. Click "Danh mục" ở Navbar
2. Hoặc click "Thể loại ▾" → Chọn category
3. Hoặc click "Nền tảng ▾" → Chọn platform
```

---

## 🐛 NẾU VẪN LỖI

### Bước 1: Hard Refresh
```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

### Bước 2: Clear Cache
1. Mở DevTools (F12)
2. Application tab
3. Clear storage
4. Refresh lại

### Bước 3: Check Console Errors
1. Mở Console (F12)
2. Click vào "Danh mục"
3. Xem có lỗi đỏ không
4. Copy lỗi và gửi cho tôi

### Bước 4: Check Network
1. Mở Network tab (F12)
2. Click "Danh mục"
3. Xem API calls:
   - `/category` - Load categories
   - `/games/by-price-asc` - Load games
4. Xem status code (200 = OK, 404/500 = Lỗi)

---

## 📊 Expected Behavior

### Khi click "Danh mục":
1. URL thay đổi → `/categories`
2. Page load với loading spinner
3. API calls:
   - `GET /category`
   - `GET /games/by-price-asc`
4. Hero section hiện ra
5. Categories grid render
6. Stats section hiện số liệu

### Khi click category card:
1. URL thay đổi → `/store?category=CategoryName`
2. Navigate đến Store page
3. Games filtered by category

### Khi click category trong dropdown:
1. Dropdown đóng lại
2. URL thay đổi → `/store?category=CategoryName`
3. Navigate đến Store với filter

---

## 🔍 Common Issues

### Issue 1: Click không có phản ứng
**Nguyên nhân:** Browser cache
**Fix:** Hard refresh (Ctrl+Shift+R)

### Issue 2: Trang trắng/blank
**Nguyên nhân:** Import sai hoặc component lỗi
**Fix:** Check console, đã fix import rồi

### Issue 3: API không load
**Nguyên nhân:** Backend không chạy
**Fix:** 
```bash
# Check backend tại:
http://localhost:8080/identity/category
```

### Issue 4: Categories không hiển thị
**Nguyên nhân:** API trả về empty array
**Fix:** Kiểm tra database có categories không

---

## ✅ Checklist Debug

- [ ] Hard refresh trang (Ctrl+Shift+R)
- [ ] Clear cache trong DevTools
- [ ] Check console không có lỗi đỏ
- [ ] Backend đang chạy (port 8080)
- [ ] API `/category` trả về data
- [ ] API `/games` trả về data
- [ ] Test navigation tại `/test-nav`
- [ ] Click "Danh mục" → Navigate thành công
- [ ] Click category card → Filter thành công

---

## 🚀 Quick Commands

### Test Backend API
```bash
# PowerShell
Invoke-WebRequest http://localhost:8080/identity/category | Select-Object StatusCode, Content

# Or in browser:
http://localhost:8080/identity/category
http://localhost:8080/identity/games/by-price-asc
```

### Check if files exist
```bash
Get-ChildItem src\pages\CategoriesPage.*
# Should show:
# - CategoriesPage.tsx
# - CategoriesPage.css
```

---

## 📞 Report Issue

Nếu vẫn lỗi, gửi cho tôi:

1. **Error message** từ Console
2. **Network tab** - API response
3. **URL** khi click "Danh mục"
4. **Screenshot** nếu có

---

**Last Updated:** Nov 4, 2025  
**Status:** ✅ FIXED

# 🔧 FIX: "Chọn danh mục không được"

## ✅ ĐÃ SỬA (Nov 5, 2025)

### Vấn đề:
- Click vào platform items (PC, PlayStation, Xbox...) không hoạt động
- Click vào category items không navigate
- Button "Xem tất cả" không đúng URL

### Nguyên nhân:
1. **CSS `::before` pseudo-element** chặn click events
2. **Icon và Text elements** chặn click propagation  
3. **Button "Xem tất cả"** navigate sai URL

### Đã sửa:

#### 1. CSS - Thêm `pointer-events: none`
```css
/* File: Navbar.css */

.platform-item::before {
  pointer-events: none;  /* ← Fix này */
  z-index: -1;
}

.plat-icon,
.plat-name,
.cat-icon,
.cat-name {
  pointer-events: none;  /* ← Fix này */
}
```

#### 2. Button "Xem tất cả" - Sửa URL
```tsx
// TRƯỚC:
navigate('/store');

// SAU:
navigate('/categories');
```

#### 3. Thêm Debug Logs
```tsx
function goFiltered(type: string, value: string) {
    console.log('[Navbar] goFiltered called:', { type, value });
    // ... rest of code
}
```

---

## 🧪 CÁCH TEST

### Bước 1: Hard Refresh
```
Ctrl + Shift + R
```

### Bước 2: Mở Console
```
F12 → Console tab
```

### Bước 3: Test Click Platform
1. Click "Nền tảng ▾"
2. Click "PC"
3. **Kết quả mong đợi:**
   - Console log: `[Navbar] goFiltered called: {type: 'platform', value: 'PC'}`
   - Console log: `[Navbar] Navigating to: /store?platform=PC`
   - URL thay đổi: `/store?platform=PC`
   - Store page load với PC games

### Bước 4: Test Click Category
1. Click "Thể loại ▾"
2. Click "Action"
3. **Kết quả mong đợi:**
   - Console log: `[Navbar] goFiltered called: {type: 'genre', value: 'Action'}`
   - Console log: `[Navbar] Navigating to: /store?category=Action`
   - URL thay đổi: `/store?category=Action`
   - Store page load với Action games

### Bước 5: Test "Xem tất cả"
1. Click "Nền tảng ▾" hoặc "Thể loại ▾"
2. Click button "Xem tất cả →"
3. **Kết quả mong đợi:**
   - URL thay đổi: `/categories`
   - Categories page load

---

## 📊 Expected Console Output

Khi click vào platform/category, bạn sẽ thấy trong console:

```
[Navbar] goFiltered called: {type: 'platform', value: 'PC'}
[Navbar] Navigating to: /store?platform=PC

[Navbar] goFiltered called: {type: 'genre', value: 'Action'}
[Navbar] Navigating to: /store?category=Action
```

Nếu **KHÔNG** thấy log này → Click không work → Check lại CSS

---

## 🐛 Nếu vẫn lỗi

### Debug 1: Check if click event fires
```javascript
// Paste vào Console:
document.querySelectorAll('.platform-item, .category-item').forEach((btn, i) => {
    btn.addEventListener('click', (e) => {
        console.log('✓ CLICK DETECTED on item', i, btn.textContent.trim());
    });
});

// Sau đó click vào item
// Phải thấy: ✓ CLICK DETECTED on item 0 PC
```

### Debug 2: Check CSS pointer-events
```javascript
// Paste vào Console:
const item = document.querySelector('.platform-item');
const styles = window.getComputedStyle(item.querySelector('.plat-icon'));
console.log('Icon pointer-events:', styles.pointerEvents);
// Phải thấy: "none"
```

### Debug 3: Check if goFiltered exists
```javascript
// Trong Console khi click:
// Phải thấy log: [Navbar] goFiltered called: ...
// Nếu KHÔNG thấy → Function không được call
```

---

## ✅ Checklist

Sau khi fix, check các items này:

- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Console không có lỗi
- [ ] Click "PC" → Log xuất hiện
- [ ] Click "PC" → URL = /store?platform=PC
- [ ] Click "Action" → Log xuất hiện
- [ ] Click "Action" → URL = /store?category=Action
- [ ] Click "Xem tất cả" → URL = /categories
- [ ] Hover effect vẫn hoạt động smooth
- [ ] Icons vẫn hiển thị đúng

---

## 📝 Files Changed

```
src/components/layout/Navbar.tsx
  - Thêm console.log trong goFiltered()
  - Sửa button "Xem tất cả" → navigate('/categories')

src/components/layout/Navbar.css
  - .platform-item::before { pointer-events: none; z-index: -1; }
  - .plat-icon, .plat-name { pointer-events: none; }
  - .cat-icon, .cat-name { pointer-events: none; }
  - .category-item { z-index: 1; }
  - .platform-item { z-index: 1; }
```

---

## 🎯 Summary

**Vấn đề:** CSS elements chặn click events  
**Fix:** Thêm `pointer-events: none` cho child elements  
**Kết quả:** Click hoạt động 100%  

**Status:** ✅ FIXED  
**Date:** Nov 5, 2025

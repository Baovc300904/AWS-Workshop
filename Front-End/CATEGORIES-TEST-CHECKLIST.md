# 🎮 Categories Feature - Quick Test Guide

## ✅ Checklist để test chức năng

### 1. Test Navbar Dropdowns

**Dropdown "Thể loại":**
- [ ] Click "Thể loại ▾" → Dropdown hiển thị
- [ ] Thấy 24 categories trong grid 3 cột
- [ ] Mỗi category có icon
- [ ] Hover vào category → Background chuyển gradient xanh
- [ ] Click category → Chuyển đến `/store?category=X`
- [ ] Click "Xem tất cả →" → Chuyển đến `/categories`

**Dropdown "Nền tảng":**
- [ ] Click "Nền tảng ▾" → Dropdown hiển thị
- [ ] Thấy 5 platforms: PC 💻, PlayStation 🎮, Xbox 🎯, Nintendo Switch 🕹️, Mobile 📱
- [ ] Grid 2 cột
- [ ] Hover → Icon phóng to + xoay
- [ ] Click platform → Chuyển đến `/store?platform=X`
- [ ] Click "Xem tất cả →" → Chuyển đến `/categories`

### 2. Test Link "Danh mục"

- [ ] Click "Danh mục" ở navbar → Chuyển đến `/categories`
- [ ] Link active khi đang ở trang categories

### 3. Test Trang Categories (`/categories`)

**Hero Section:**
- [ ] Badge "🎮 Game Categories" hiển thị
- [ ] Title "Khám phá thế giới Game"
- [ ] Subtitle hiển thị số categories
- [ ] Background có 3 glowing orbs

**Categories Grid:**
- [ ] Hiển thị TẤT CẢ categories
- [ ] Mỗi card có:
  - Icon lớn trong box gradient
  - Tên category
  - Badge số game (🎯 X games)
- [ ] Hover card → Nâng lên + glow effect
- [ ] Hover → Arrow "→" xuất hiện góc phải
- [ ] Click card → Chuyển đến `/store?category=X`

**Stats Section:**
- [ ] 4 stats cards:
  - 🎮 Số categories
  - 🎯 Số games
  - ⭐ Rating 4.8
  - 🔥 Tổng entries
- [ ] Hover card → Nâng lên

**Loading State:**
- [ ] Khi load → Spinner + "Đang tải danh mục..."

### 4. Test Responsive

**Desktop (> 920px):**
- [ ] Navbar full với search bar center
- [ ] Category dropdown: 3 cột
- [ ] Platform dropdown: 2 cột
- [ ] Categories page: 3-4 cards/row

**Tablet (560-920px):**
- [ ] Hamburger menu xuất hiện
- [ ] Dropdowns trong mobile menu
- [ ] Category dropdown: 2 cột
- [ ] Platform dropdown: 1 cột
- [ ] Categories page: 2 cards/row

**Mobile (< 560px):**
- [ ] Hamburger menu
- [ ] Dropdowns full width
- [ ] Category dropdown: 1 cột
- [ ] Platform dropdown: 1 cột
- [ ] Categories page: 1 card/row
- [ ] Header buttons stack

### 5. Test Navigation Flow

**Flow 1: Browse → Filter**
```
Navbar "Danh mục" → Categories Page → Click "Action" → Store filtered by Action
```

**Flow 2: Dropdown → Filter**
```
Navbar "Thể loại ▾" → Click "RPG" → Store filtered by RPG
```

**Flow 3: Platform Filter**
```
Navbar "Nền tảng ▾" → Click "PC" → Store filtered by PC games
```

**Flow 4: Search + Filter**
```
Store page → Select category "Horror" → Search "resident" → Filtered results
```

### 6. Test URL Parameters

- [ ] `/categories` → Categories page loads
- [ ] `/store?category=Action` → Store with Action games
- [ ] `/store?platform=PC` → Store with PC games
- [ ] `/store?category=RPG&platform=PlayStation` → Dual filter works

### 7. Test Browser Back Button

- [ ] Categories → Click card → Store → Back button → Returns to Categories
- [ ] Navbar dropdown → Click category → Store → Back → No issues

### 8. Test Performance

- [ ] Categories page load < 1s
- [ ] Hover animations smooth (60fps)
- [ ] No console errors
- [ ] Images/icons load properly

## 🐛 Common Issues & Solutions

### Issue: Dropdown không hiển thị
**Solution:**
1. Check console log
2. Verify `fetchCategories()` hoạt động
3. Check network tab - endpoint `/category` có response không

### Issue: Click category không navigate
**Solution:**
1. Check React Router có hoạt động không
2. Verify `goFiltered()` function
3. Check console log trong function

### Issue: Icons không hiển thị
**Solution:**
1. Check `categoryIcons` object trong code
2. Verify emoji support trên browser
3. Check CSS `filter` property

### Issue: Responsive layout bị vỡ
**Solution:**
1. Check media queries trong CSS
2. Verify grid-template-columns values
3. Test với DevTools responsive mode

### Issue: Loading spinner không biến mất
**Solution:**
1. Check API endpoint có response không
2. Verify loading state được set false
3. Check error handling trong catch block

## 📊 Expected Results

### API Calls
```
GET /category → Returns array of categories
GET /games/by-price-asc → Returns array of games
```

### State Management
```typescript
categories: Category[] = [{name: "Action", description: "..."}, ...]
games: Game[] = [{id: "1", name: "Game 1", categories: [...]}, ...]
categoryCounts: Record<string, number> = {"Action": 15, "RPG": 20, ...}
```

### Navigation
```typescript
navigate('/categories') → CategoriesPage
navigate('/store?category=Action') → StorePage with filter
navigate('/store?platform=PC') → StorePage with filter
```

## ✨ Features Working Correctly

- ✅ Dropdown Thể loại với 24 categories
- ✅ Dropdown Nền tảng với 5 platforms
- ✅ Link "Danh mục" direct to categories page
- ✅ Categories page với hero + grid + stats
- ✅ Click category → Navigate to filtered store
- ✅ Responsive cho mobile/tablet/desktop
- ✅ Loading states
- ✅ Hover animations
- ✅ URL parameters
- ✅ Icon mapping cho categories và platforms

---

**Bắt đầu test từ đầu trang và check từng mục!**

Mở app tại: `http://localhost:5173`

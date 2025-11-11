# 🎮 Hướng dẫn sử dụng Chức năng Danh mục

## 📋 Tổng quan

Hệ thống danh mục đã được nâng cấp hoàn chỉnh với các tính năng sau:

### ✨ Các tính năng chính

1. **Dropdown Thể loại (Categories)** - Navbar
   - 24 categories hiển thị trong grid 3 cột
   - Mỗi category có icon riêng
   - Hover effect với animation
   - Click để lọc game theo thể loại
   - Nút "Xem tất cả" → chuyển đến trang Categories

2. **Dropdown Nền tảng (Platforms)** - Navbar
   - 5 platforms: PC, PlayStation, Xbox, Nintendo Switch, Mobile
   - Grid 2 cột với icon lớn
   - Hover animation với shine effect
   - Click để lọc game theo nền tảng

3. **Trang Categories** (`/categories`)
   - Hero section với gradient background
   - Grid responsive hiển thị TẤT CẢ categories
   - Mỗi card hiển thị:
     * Icon category
     * Tên category
     * Mô tả (nếu có)
     * Số lượng game
   - Stats section: tổng categories, games, ratings
   - Loading state với spinner

4. **Link Danh mục** - Navbar
   - Link trực tiếp đến trang `/categories`
   - Active state khi đang ở trang đó

## 🎯 Cách sử dụng

### 1. Lọc game theo Thể loại

**Cách 1: Dùng Dropdown**
```
Navbar → Click "Thể loại ▾" → Chọn category → Chuyển đến Store với filter
```

**Cách 2: Dùng trang Categories**
```
Navbar → Click "Danh mục" → Click vào category card → Chuyển đến Store với filter
```

**Cách 3: Dropdown "Xem tất cả"**
```
Navbar → Click "Thể loại ▾" → Click "Xem tất cả →" → Trang Categories
```

### 2. Lọc game theo Nền tảng

```
Navbar → Click "Nền tảng ▾" → Chọn platform → Chuyển đến Store với filter
```

### 3. Browse tất cả Categories

```
Navbar → Click "Danh mục" 
HOẶC
Navbar → "Thể loại ▾" → "Xem tất cả →"
```

## 🎨 Giao diện

### Dropdown Thể loại
- **Layout**: 3 cột grid
- **Max height**: 400px (scrollable)
- **Hiển thị**: 24 categories đầu tiên
- **Responsive**: 
  - Desktop: 3 cột
  - Tablet: 2 cột
  - Mobile: 1 cột

### Dropdown Nền tảng
- **Layout**: 2 cột grid
- **Platforms**: 5 items
- **Responsive**: Mobile → 1 cột

### Trang Categories
- **Hero**: Full width với glowing effects
- **Grid**: Auto-fill với min 320px/card
- **Responsive**: Desktop 3-4 cột → Mobile 1 cột
- **Stats**: 4 metrics (categories, games, ratings, total entries)

## 🔧 Technical Details

### Routes
```tsx
/categories - Trang browse tất cả categories
/store?category=Action - Store filtered by category
/store?platform=PC - Store filtered by platform
```

### Components
```
src/components/layout/Navbar.tsx - Navigation với dropdowns
src/pages/CategoriesPage.tsx - Trang categories
src/pages/StorePage.tsx - Store với filters
```

### Styling
```
src/components/layout/Navbar.css - Navbar + dropdowns
src/pages/CategoriesPage.css - Categories page
```

### API Endpoints
```typescript
fetchCategories() - Lấy danh sách categories
fetchGamesByPrice('asc'|'desc') - Lấy games
```

## 📱 Responsive Breakpoints

- **Desktop**: > 920px - Full layout
- **Tablet**: 560px - 920px - 2 columns
- **Mobile**: < 560px - 1 column, stacked

## 🎮 Category Icons Mapping

```typescript
Action: 🎯
Adventure: 🗺️
RPG: 🧙
Strategy: ♟️
Sports: ⚽
Racing: 🏎️
Simulation: 🛠️
Horror: 👻
Puzzle: 🧩
Shooter: 🔫
... và 18+ icons khác
```

## 💡 Tips

1. **Hover effects**: Di chuột qua category/platform cards để xem animations
2. **Keyboard navigation**: Tab qua các items, Enter để chọn
3. **Mobile**: Dùng hamburger menu để access dropdowns
4. **Search**: Kết hợp filter category/platform với search bar
5. **URL sharing**: Copy URL từ Store để share filtered results

## 🐛 Troubleshooting

### Dropdown không hiển thị
- Kiểm tra console log có lỗi không
- Verify `fetchCategories()` đang work
- Check responsive breakpoint (có thể đang ở mobile mode)

### Categories không load
- Kiểm tra backend đang chạy: `http://localhost:8080/identity`
- Test endpoint: `GET /category`
- Xem Network tab trong DevTools

### Click category không navigate
- Verify React Router đang hoạt động
- Check console log trong `goFiltered()` function
- Kiểm tra URL params có được set không

## 🚀 Performance

- **Lazy loading**: Categories page lazy loaded
- **Memoization**: Platform list memoized
- **Optimized renders**: useEffect dependencies được optimize
- **CSS animations**: GPU-accelerated transforms
- **Loading states**: Skeleton/spinner cho UX tốt hơn

## 📊 Stats Display

Trang Categories hiển thị:
- 🎮 Tổng số categories
- 🎯 Tổng số games
- ⭐ Rating trung bình (4.8)
- 🔥 Tổng entries (category × games)

## 🎨 Design System

### Colors
- Primary: `#3b82f6`, `#2563eb` (Blue)
- Background: `#0f172a`, `#1e293b` (Dark)
- Accent: `#60a5fa` (Light blue)
- Success: Green gradient
- Danger: Red gradient

### Animations
- `fadeInUp`: 0.6s ease
- `fadeInDown`: 0.6s ease
- `float`: 8s infinite
- `spin`: 1s linear
- Hover: 0.4s cubic-bezier

### Spacing
- Card gap: 1.5rem
- Padding: 2rem (desktop), 1rem (mobile)
- Border radius: 16-20px (cards), 10-12px (buttons)

---

**Version**: 1.0  
**Last Updated**: Nov 4, 2025  
**Author**: AI Assistant

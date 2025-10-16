## Frontend React (Vite)

### Chạy dự án
```bash
cd frontend
npm i
npm run dev
```
Mặc định chạy tại `http://localhost:5173`.

### Cấu hình API
- Tạo file `.env` trong thư mục `frontend` (tùy chọn):
```
VITE_API_BASE=http://localhost:8080/identity
```
Nếu không khai báo, mặc định dùng `http://localhost:8080/identity`.

### Tính năng hiện có
- Trang chủ: hiển thị danh sách game, sắp xếp theo giá (tăng/giảm), ô tìm kiếm theo tên.
- Gọi các endpoint public của backend:
  - `GET /games/by-price-asc`
  - `GET /games/by-price-desc`
  - `GET /games/search?keyword=...`

### Kế hoạch mở rộng
- Trang chi tiết game, phân trang, lọc theo category/khoảng giá.
- Đăng nhập để hiển thị các tính năng yêu cầu token.
- UI/UX nâng cao (theme giống Steam, responsive hoàn chỉnh, skeleton loading).



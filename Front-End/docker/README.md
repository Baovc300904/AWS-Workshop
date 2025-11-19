# Docker Setup cho Game Store Frontend

## 📋 Tổng quan

Dự án có 2 cấu hình Docker:
- **Production**: Nginx serving static files (Port 80 trong container, 3000 trên host)
- **Development**: Vite dev server với hot-reload (Port 5173)

## 🚀 Cách sử dụng

### 1. Build và chạy Production (Nginx)

```bash
# Build image
docker build -t game-store-frontend .

# Chạy container
docker run -d -p 3000:80 --name frontend game-store-frontend

# Hoặc dùng docker-compose
docker-compose up frontend-prod -d
```

Truy cập: http://localhost:3000

### 2. Chạy Development mode (Hot reload)

```bash
# Chạy với docker-compose
docker-compose up frontend-dev

# Hoặc build riêng
docker build -f docker/Dockerfile.dev -t game-store-frontend-dev .
docker run -d -p 5173:5173 -v ${PWD}:/app --name frontend-dev game-store-frontend-dev
```

Truy cập: http://localhost:5173

### 3. Chạy cả Frontend và Backend cùng nhau

Nếu bạn có backend ở folder `Back-End`, tạo file `docker-compose.yml` ở root workspace:

```yaml
version: '3.8'

services:
  backend:
    build: ./Back-End
    ports:
      - "8080:8080"
    networks:
      - game-store-network

  frontend:
    build: ./Front-End
    ports:
      - "3000:80"
    networks:
      - game-store-network
    depends_on:
      - backend

networks:
  game-store-network:
    driver: bridge
```

## 🔧 Port Configuration

| Môi trường | Container Port | Host Port | Mô tả |
|-----------|----------------|-----------|-------|
| Production | 80 | 3000 | Nginx serving static files |
| Development | 5173 | 5173 | Vite dev server |
| Backend | 8080 | 8080 | Spring Boot API |

### Tại sao chọn port này?

- **Port 80**: Port mặc định của HTTP trong container (Nginx)
- **Port 3000**: Port phổ biến cho frontend app trên host
- **Port 5173**: Port mặc định của Vite
- **Port 8080**: Port mặc định của Spring Boot

Bạn có thể thay đổi host port bằng cách sửa trong `docker-compose.yml`:
```yaml
ports:
  - "8000:80"  # Truy cập qua localhost:8000
```

## 🛠 Các lệnh Docker hữu ích

```bash
# Xem logs
docker-compose logs -f frontend-prod

# Stop containers
docker-compose down

# Rebuild image
docker-compose build --no-cache frontend-prod

# Xem containers đang chạy
docker ps

# Remove container
docker rm -f game-store-frontend-prod

# Remove image
docker rmi game-store-frontend
```

## 📝 Lưu ý

1. Đảm bảo file `.dockerignore` có đầy đủ để giảm kích thước image
2. Production build dùng multi-stage để tối ưu kích thước (~50MB)
3. Development mode mount volumes để hot-reload hoạt động
4. Cấu hình API URL trong environment variables nếu cần

## 🔐 Environment Variables

Tạo file `.env` nếu cần:

```env
VITE_API_URL=http://localhost:8080
VITE_API_TIMEOUT=30000
```

Thêm vào `docker-compose.yml`:
```yaml
env_file:
  - .env
```

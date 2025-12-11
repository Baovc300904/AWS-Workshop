## Dịch vụ Identity & Catalog Game (Spring Boot)

Dịch vụ Spring Boot 3 cung cấp: xác thực/ủy quyền (user/role/permission với JWT) và catalog đơn giản cho danh mục (category) và game. Claim `scope` trong JWT được tạo từ role và permission của user, dùng cho phân quyền.

### Công nghệ
- Java 21, Spring Boot 3.5
- Spring Data JPA (Hibernate)
- Spring Security (Resource Server, JWT)
- MySQL
- MapStruct, Lombok
- Docker/Docker Compose

### Cấu trúc dự án (khái quát)
- `src/main/java/com/se182393/baidautien`
  - `configuration/`: cấu hình bảo mật, custom JWT decoder
  - `controller/`: các REST controller cho auth, user, role, permission, category, game
  - `dto/`: model request/response
  - `entity/`: JPA entities: `User`, `Role`, `Permission`, `InvalidatedToken`, `PasswordResetToken`, `Category`, `Game`
  - `exception/`: enum mã lỗi và handler
  - `mapper/`: MapStruct mapper
  - `repository/`: Spring Data repositories
  - `service/`: service nghiệp vụ (auth, user, role, permission, category, game)
- `src/main/resources/application.yaml`: cấu hình ứng dụng
- `Dockerfile`, `docker-compose.yml`

### Cấu hình
File `src/main/resources/application.yaml` mặc định:
- Server: `http://localhost:8080/identity` (context-path `/identity`)
- MySQL (local): `jdbc:mysql://localhost:3306/identity_service` (user/pass: root/root)
- JPA: `ddl-auto=update`, `show-sql=true`
- JWT signer key: HS512 trong `jwt.signerKey`

Khi chạy bằng Docker Compose, app đọc biến môi trường để trỏ đến service `db` (`jdbc:mysql://db:3306/mydb`). Cần đồng bộ lại tên DB/credentials giữa compose và `application.yaml` cho thống nhất.

### Chạy local (không Docker)
1) Khởi chạy MySQL và tạo DB `identity_service` (hoặc chỉnh `application.yaml`).
2) Build và chạy:
```
./mvnw spring-boot:run
```
App chạy tại `http://localhost:8080/identity`.

### Chạy bằng Docker Compose
1) Build jar:
```
./mvnw -DskipTests package
```
2) Khởi chạy compose:
```
docker compose up --build
```
App: `http://localhost:8080/identity`, MySQL: `localhost:3306` (container `db`).

### Mô hình bảo mật (tóm tắt)
- JWT được tạo trong `AuthenticationService.generateToken`
  - Claims gồm `sub` (username), `exp`, `jti`, `scope`
  - `scope` là chuỗi cách nhau bởi dấu cách, gồm:
    - `ROLE_{roleName}` cho từng role của user
    - toàn bộ `permission.name` thuộc các role đó
- Resource server: cấu hình trong `SecurityConfig`
  - `JwtGrantedAuthoritiesConverter` đọc authorities từ claim `scope` (không prefix)
  - Endpoint public: `POST /users`, `POST /auth/log-in`, `POST /auth/introspect`, `POST /auth/logout`, `POST /auth/refresh`, `POST /users/forgot-password`, `POST /users/reset-password`
  - Các endpoint khác yêu cầu xác thực
- Đăng xuất: đưa `jti` vào blacklist bằng `InvalidatedToken`

### Endpoint chính (tiền tố `/identity`)
- Auth (`/auth`)
  - `POST /log-in`: lấy JWT
  - `POST /introspect`: kiểm tra token
  - `POST /logout`: thu hồi token (blacklist theo `jti`)
  - `POST /refresh`: thu hồi token cũ và cấp token mới

- Users (`/users`)
  - `POST /`: đăng ký user
  - `GET /`: danh sách user (ADMIN)
  - `GET /{userId}`: chi tiết user
  - `GET /myInfo`: thông tin user hiện tại
  - `PUT /{userId}`: cập nhật user (có thể gán danh sách role theo tên)
  - `DELETE /{userId}`: xóa user
  - `POST /forgot-password`: yêu cầu token reset
  - `POST /reset-password`: xác nhận reset
  - `POST /grant-permissions/{username}` (ADMIN): thêm permissions vào TẤT CẢ các role hiện có của user; body: mảng JSON tên permission, ví dụ `["APP_POST"]`

- Roles (`/roles`)
  - `POST /`: tạo role (body có `permissions: ["PERM"]`)
  - `GET /`: danh sách role
  - `DELETE /{role}`: xóa role

- Permissions (`/permission`)
  - `POST /`: tạo permission
  - `GET /`: danh sách permission
  - `DELETE /{permission}`: xóa permission

- Categories (`/category`)
  - `POST /`, `GET /`, `GET /{categoryName}`, `PUT /{categoryId}`, `DELETE /{categoryId}`

- Games (`/games`)
  - `POST /`, `GET /`, `GET /{gameName}`, `PUT /{gameId}`, `DELETE /{gameId}`
  - `GET /search?keyword=...`: tìm theo tên hoặc category

### Lưu ý quan trọng về JWT scope & permission
- Scope được tính tại thời điểm đăng nhập/refresh dựa trên quan hệ DB hiện tại. Sau khi thay đổi role/permission cần cấp token mới.
- Converter đã đọc authorities từ claim `scope`.
- `UserRepository.findByUsername` dùng `@EntityGraph("roles","roles.permissions")` để load eager permissions phục vụ build scope.

### Thiếu sót / Việc cần làm (TODO)
- Chưa đồng bộ cấu hình DB giữa local (`identity_service`) và Docker Compose (`mydb`). Cần thống nhất tên DB/credentials.
- Chưa có tài liệu API (OpenAPI/Swagger).
- Validation DTO chưa đầy đủ; bổ sung ràng buộc Bean Validation.
- Xử lý lỗi: mở rộng `GlobalExceptionHandler` cho response đồng nhất.
- Tính năng auth nâng cao: xác minh email, 2FA (tùy chọn), token rotation, cấu hình TTL.
- Authorization chi tiết: annotation @PreAuthorize theo permission ở controller/service.
- Migration: dùng Flyway/Liquibase thay cho `ddl-auto=update`.
- Test: unit/integration/security/repository.
- Phân trang/sắp xếp cho các list endpoint.
- CORS cho frontend.
- Observability: log chuẩn hóa, metrics, tracing; log sự kiện auth.
- Rate limiting & khóa tài khoản khi thất bại đăng nhập nhiều lần.
- CI/CD và hardening image container.

### Gợi ý phát triển
- Context path là `/identity` → ví dụ: `POST http://localhost:8080/identity/auth/log-in`
- Sau khi cập nhật role/permission, hãy đăng nhập lại để JWT có scope mới.
- Dùng endpoint `grant-permissions` để thêm nhanh permission vào các role hiện có của user khi test.

### License
Dự án nội bộ/phục vụ học tập.



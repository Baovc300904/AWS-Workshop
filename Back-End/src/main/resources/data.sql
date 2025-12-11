-- Tạo các role mẫu
INSERT INTO role (name, description) VALUES ('ADMIN', 'Quản trị hệ thống');
INSERT INTO role (name, description) VALUES ('USER', 'Người dùng thông thường');
INSERT INTO role (name, description) VALUES ('MOD', 'Quản lý nội dung');

-- Tạo các user mẫu với password bcrypt hợp lệ cho '123456'
INSERT INTO user (id, username, password, first_name, last_name, dob, phone) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFGjO6aqmqW9P6WMBb0Y8fKS', 'Admin', 'System', '1990-01-01', '0900000001'),
  ('22222222-2222-2222-2222-222222222222', 'user1@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFGjO6aqmqW9P6WMBb0Y8fKS', 'User', 'One', '1995-05-05', '0900000002'),
  ('33333333-3333-3333-3333-333333333333', 'mod1@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFGjO6aqmqW9P6WMBb0Y8fKS', 'Mod', 'One', '1992-02-02', '0900000003');

-- Gán role cho user
INSERT INTO user_roles (user_id, roles_name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'ADMIN'),
  ('22222222-2222-2222-2222-222222222222', 'USER'),
  ('33333333-3333-3333-3333-333333333333', 'MOD');

-- Tạo các permission mẫu
INSERT INTO permission (name, description) VALUES
    ('USER_READ', 'Quyền xem thông tin người dùng'),
    ('USER_CREATE', 'Quyền tạo người dùng mới'),
    ('USER_UPDATE', 'Quyền cập nhật thông tin người dùng'),
    ('USER_DELETE', 'Quyền xóa người dùng'),
    ('ROLE_READ', 'Quyền xem danh sách vai trò'),
    ('ROLE_CREATE', 'Quyền tạo vai trò mới'),
    ('ROLE_UPDATE', 'Quyền cập nhật vai trò'),
    ('ROLE_DELETE', 'Quyền xóa vai trò'),
    ('PERMISSION_READ', 'Quyền xem danh sách quyền'),
    ('PERMISSION_ASSIGN', 'Quyền gán quyền cho vai trò');

-- Gán permission cho role ADMIN
INSERT INTO role_permissions (role_name, permissions_name) VALUES
    ('ADMIN', 'USER_READ'),
    ('ADMIN', 'USER_CREATE'),
    ('ADMIN', 'USER_UPDATE'),
    ('ADMIN', 'USER_DELETE'),
    ('ADMIN', 'ROLE_READ'),
    ('ADMIN', 'ROLE_CREATE'),
    ('ADMIN', 'ROLE_UPDATE'),
    ('ADMIN', 'ROLE_DELETE'),
    ('ADMIN', 'PERMISSION_READ'),
    ('ADMIN', 'PERMISSION_ASSIGN');

-- Gán permission cho role MOD
INSERT INTO role_permissions (role_name, permissions_name) VALUES
    ('MOD', 'USER_READ'),
    ('MOD', 'USER_UPDATE'),
    ('MOD', 'ROLE_READ');


INSERT INTO permission (permission_name, description) VALUES
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







-- Thêm role ADMIN
INSERT INTO role (role_name, description) VALUES
    ('ADMIN', 'Quản trị hệ thống');


INSERT INTO role_permissions (role_name, permission_name) VALUES
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





INSERT INTO user_roles (roles_role_name, user_id) VALUES
    ('ADMIN', 'acdc5009-f25c-42fd-8010-78a0ab560125');
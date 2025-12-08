import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import './AdminUsersPage.css';

type User = {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  avatarUrl?: string;
  balance?: number;
  roles?: Array<{ name: string }>;
  createdAt?: string;
};

export function AdminUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/users');
      const usersData = response.data.result || [];
      setUsers(usersData);
    } catch (err: any) {
      console.error('[AdminUsersPage] Error loading users:', err);
      setError('Không thể tải danh sách người dùng. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const search = searchTerm.toLowerCase();
    return (
      (user.username || '').toLowerCase().includes(search) ||
      (user.email || '').toLowerCase().includes(search) ||
      (user.firstName || '').toLowerCase().includes(search) ||
      (user.lastName || '').toLowerCase().includes(search) ||
      (user.phone || '').includes(search)
    );
  });

  const getUserRoles = (user: User): string[] => {
    if (!user.roles) return [];
    return user.roles.map(r => r.name);
  };

  if (loading) {
    return (
      <div className="adminUsersContainer">
        <div className="adminUsersLoading">
          <div className="spinner"></div>
          <p>Đang tải danh sách người dùng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="adminUsersContainer">
      <div className="adminUsersHeader">
        <div className="headerTop">
          <button className="btnBack" onClick={() => navigate('/admin')}>
            ← Quay lại Dashboard
          </button>
          <h1>👥 Quản lý người dùng</h1>
        </div>
        <div className="headerActions">
          <div className="searchBox">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btnAddUser" onClick={() => alert('Chức năng thêm user đang phát triển')}>
            ➕ Thêm người dùng
          </button>
        </div>
      </div>

      {error && (
        <div className="adminUsersError">
          <span>⚠️</span>
          <p>{error}</p>
          <button onClick={loadUsers}>🔄 Thử lại</button>
        </div>
      )}

      {!error && (
        <div className="adminUsersContent">
          <div className="usersStats">
            <div className="statCard">
              <div className="statIcon">👥</div>
              <div className="statInfo">
                <h3>Tổng người dùng</h3>
                <p className="statValue">{users.length}</p>
              </div>
            </div>
            <div className="statCard">
              <div className="statIcon">🔐</div>
              <div className="statInfo">
                <h3>Admin</h3>
                <p className="statValue">{users.filter(u => getUserRoles(u).includes('ADMIN')).length}</p>
              </div>
            </div>
            <div className="statCard">
              <div className="statIcon">⚡</div>
              <div className="statInfo">
                <h3>Moderator</h3>
                <p className="statValue">{users.filter(u => getUserRoles(u).includes('MOD')).length}</p>
              </div>
            </div>
            <div className="statCard">
              <div className="statIcon">👤</div>
              <div className="statInfo">
                <h3>User</h3>
                <p className="statValue">{users.filter(u => getUserRoles(u).includes('USER')).length}</p>
              </div>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="noUsers">
              <div className="noUsersIcon">🔍</div>
              <h3>Không tìm thấy người dùng</h3>
              <p>Thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            <div className="usersTable">
              <table>
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Điện thoại</th>
                    <th>Số dư</th>
                    <th>Vai trò</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="userCell">
                          <div className="userAvatarContainer">
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt={user.username} className="userAvatarImg" />
                            ) : (
                              <div className="userAvatar">
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="userInfo">
                            <strong>{user.username}</strong>
                            <span className="userId">ID: {user.id.substring(0, 8)}...</span>
                          </div>
                        </div>
                      </td>
                      <td>{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '—'}</td>
                      <td>{user.email || '—'}</td>
                      <td>{user.phone || '—'}</td>
                      <td>
                        <span className="balanceCell">
                          {user.balance !== undefined ? `${user.balance.toLocaleString('vi-VN')}đ` : '0đ'}
                        </span>
                      </td>
                      <td>
                        <div className="rolesCell">
                          {getUserRoles(user).map((role) => (
                            <span key={role} className={`roleBadge ${role.toLowerCase()}`}>
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="actionsCell">
                          <button 
                            className="btnView" 
                            onClick={() => alert(`View details: ${user.username}`)}
                            title="Xem chi tiết"
                          >
                            👁️
                          </button>
                          <button 
                            className="btnEdit" 
                            onClick={() => alert(`Edit user: ${user.username}`)}
                            title="Chỉnh sửa"
                          >
                            ✏️
                          </button>
                          <button 
                            className="btnDelete" 
                            onClick={() => {
                              if (confirm(`Bạn có chắc muốn xóa user ${user.username}?`)) {
                                alert('Chức năng xóa user đang phát triển');
                              }
                            }}
                            title="Xóa"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="featureNote">
            <div className="noteIcon">ℹ️</div>
            <div className="noteContent">
              <h4>Chức năng đang phát triển</h4>
              <p>
                Trang quản lý người dùng đã sẵn sàng UI. Backend cần cung cấp các endpoint:
              </p>
              <ul>
                <li><code>GET /users</code> - Lấy danh sách tất cả users (Admin only)</li>
                <li><code>DELETE /users/:id</code> - Xóa user (Admin only)</li>
                <li><code>PUT /users/:id/roles</code> - Cập nhật roles (Admin only)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import './AdminUsersManagement.css';

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

export default function AdminUsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRoles, setEditingRoles] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/users');
      setUsers(Array.isArray(response.data?.result) ? response.data.result : []);
    } catch (err: any) {
      console.error('Error loading users:', err);
      setError(err?.response?.data?.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const getUserRoles = (user: User): string[] => {
    if (!user?.roles || !Array.isArray(user.roles)) return [];
    return user.roles.map(r => r?.name || '').filter(Boolean);
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Bạn có chắc muốn xóa người dùng "${user.username}"?\n\nHành động này KHÔNG thể hoàn tác!`)) {
      return;
    }

    setActionLoading(true);
    try {
      await api.delete(`/users/${user.id}`);
      alert(`✅ Đã xóa người dùng ${user.username}`);
      await loadUsers();
    } catch (err: any) {
      alert(`❌ Lỗi xóa người dùng:\n${err?.response?.data?.message || err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditRoles = (user: User) => {
    setSelectedUser(user);
    setEditingRoles(getUserRoles(user));
    setShowEditModal(true);
  };

  const toggleRole = (role: string) => {
    setEditingRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleSaveRoles = async () => {
    if (!selectedUser) return;

    setActionLoading(true);
    try {
      await api.put(`/users/${selectedUser.id}/roles`, {
        roles: editingRoles
      });
      alert(`✅ Cập nhật vai trò cho ${selectedUser.username} thành công`);
      setShowEditModal(false);
      await loadUsers();
    } catch (err: any) {
      alert(`❌ Lỗi cập nhật vai trò:\n${err?.response?.data?.message || err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    setActionLoading(true);
    try {
      // Assuming there's an API to enable/disable user
      await api.put(`/users/${user.id}/status`, {
        enabled: !(user as any).enabled
      });
      alert(`✅ Cập nhật trạng thái cho ${user.username}`);
      await loadUsers();
    } catch (err: any) {
      alert(`❌ Lỗi cập nhật trạng thái:\n${err?.response?.data?.message || err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = (users || []).filter(user => {
    const search = (searchTerm || '').toLowerCase();
    return (
      user?.username?.toLowerCase().includes(search) ||
      user?.email?.toLowerCase().includes(search) ||
      user?.firstName?.toLowerCase().includes(search) ||
      user?.lastName?.toLowerCase().includes(search) ||
      user?.phone?.includes(search)
    );
  });

  const stats = {
    total: (users || []).length,
    admins: (users || []).filter(u => getUserRoles(u).includes('ADMIN')).length,
    mods: (users || []).filter(u => getUserRoles(u).includes('MOD')).length,
    regular: (users || []).filter(u => {
      const roles = getUserRoles(u);
      return !roles.includes('ADMIN') && !roles.includes('MOD');
    }).length,
  };

  if (loading) {
    return (
      <div className="userManagementContainer">
        <div className="loading">
          <div className="spinner">⏳</div>
          <p>Đang tải danh sách người dùng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="userManagementContainer">
      <div className="managementHeader">
        <h2>👥 Quản lý người dùng</h2>
        <button className="btn btn-refresh" onClick={loadUsers} disabled={actionLoading}>
          🔄 Làm mới
        </button>
      </div>

      <div className="statsGrid">
        <div className="statCard">
          <div className="statIcon">👥</div>
          <div className="statValue">{stats.total}</div>
          <div className="statLabel">Tổng người dùng</div>
        </div>
        <div className="statCard admin">
          <div className="statIcon">🔐</div>
          <div className="statValue">{stats.admins}</div>
          <div className="statLabel">Admin</div>
        </div>
        <div className="statCard mod">
          <div className="statIcon">⚡</div>
          <div className="statValue">{stats.mods}</div>
          <div className="statLabel">Moderator</div>
        </div>
        <div className="statCard user">
          <div className="statIcon">👤</div>
          <div className="statValue">{stats.regular}</div>
          <div className="statLabel">User</div>
        </div>
      </div>

      <div className="searchBar">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm theo username, email, tên, SĐT..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="searchInput"
        />
      </div>

      {error && (
        <div className="errorBox">
          ⚠️ {error}
          <button onClick={loadUsers}>Thử lại</button>
        </div>
      )}

      {(filteredUsers || []).length === 0 ? (
        <div className="emptyState">
          <div className="emptyIcon">🔍</div>
          <h3>Không tìm thấy người dùng</h3>
          <p>Thử tìm kiếm với từ khóa khác</p>
        </div>
      ) : (
        <div className="usersTableWrapper">
          <table className="usersTable">
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Thông tin</th>
                <th>Số dư</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {(filteredUsers || []).map((user) => (
                <tr key={user?.id || Math.random()}>
                  <td>
                    <div className="userCell">
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.username} className="userAvatar" />
                      ) : (
                        <div className="userAvatarPlaceholder">
                          {(user?.username || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="userName">{user?.username || 'Unknown'}</div>
                        <div className="userId">{user?.id?.substring(0, 8) || 'N/A'}...</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="userInfoCell">
                      <div>
                        👤 {user?.firstName && user?.lastName 
                          ? `${user.firstName} ${user.lastName}` 
                          : '—'}
                      </div>
                      <div>📧 {user?.email || '—'}</div>
                      <div>📱 {user?.phone || '—'}</div>
                    </div>
                  </td>
                  <td>
                    <span className="balance">
                      {typeof user?.balance === 'number' 
                        ? `${user.balance.toLocaleString('vi-VN')}₫`
                        : '0₫'}
                    </span>
                  </td>
                  <td>
                    <div className="rolesCell">
                      {(getUserRoles(user) || []).map((role) => (
                        <span key={role} className={`roleBadge ${(role || '').toLowerCase()}`}>
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('vi-VN')
                      : '—'}
                  </td>
                  <td>
                    <div className="actionsCell">
                      <button 
                        className="btn btn-sm btn-edit"
                        onClick={() => handleEditRoles(user)}
                        disabled={actionLoading}
                        title="Chỉnh sửa vai trò"
                      >
                        ✏️ Roles
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteUser(user)}
                        disabled={actionLoading}
                        title="Xóa người dùng"
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

      {showEditModal && selectedUser && (
        <div className="modal" onClick={() => setShowEditModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>Chỉnh sửa vai trò</h3>
              <button className="modalClose" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            
            <div className="modalBody">
              <div className="userPreview">
                <div className="userPreviewAvatar">
                  {selectedUser.avatarUrl ? (
                    <img src={selectedUser.avatarUrl} alt={selectedUser.username} />
                  ) : (
                    selectedUser.username.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h4>{selectedUser.username}</h4>
                  <p>{selectedUser.email || 'No email'}</p>
                </div>
              </div>

              <div className="rolesSelector">
                <h4>Vai trò:</h4>
                <div className="roleOptions">
                  {['USER', 'MOD', 'ADMIN'].map(role => (
                    <label key={role} className="roleOption">
                      <input
                        type="checkbox"
                        checked={editingRoles.includes(role)}
                        onChange={() => toggleRole(role)}
                      />
                      <span className={`roleBadge ${role.toLowerCase()}`}>{role}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="modalFooter">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowEditModal(false)}
                disabled={actionLoading}
              >
                Hủy
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSaveRoles}
                disabled={actionLoading}
              >
                {actionLoading ? 'Đang lưu...' : '💾 Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

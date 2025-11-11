import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyInfo, introspect, updateMyInfo, UpdateProfilePayload } from '../api/client';
import './ProfilePage.css';

interface UserProfile {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('account'); // 'account', 'topup', 'inventory', 'points', 'history', 'voucher', 'wishlist'
  const [formData, setFormData] = useState<UpdateProfilePayload>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
  });
  const [passwordConfirm, setPasswordConfirm] = useState(''); // Password for confirmation

  useEffect(() => {
    const token = localStorage.getItem('wgs_token') || localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const checkAuth = async () => {
      try {
        // Verify token first
        const valid = await introspect(token);
        if (!valid) {
          localStorage.removeItem('token');
          localStorage.removeItem('wgs_token');
          navigate('/login');
          return;
        }

        // Load user profile from API
        const data = await getMyInfo();
        setProfile(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          dob: data.dob || '',
        });
      } catch (err: any) {
        const errorMsg = err?.response?.data?.message || err?.message || 'Không thể tải thông tin người dùng';
        setError(errorMsg);
        
        // If 401, redirect to login
        if (err?.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('wgs_token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('wgs_token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleEdit = () => {
    if (editing) {
      // Cancel edit - reset form data and password
      setFormData({
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        dob: profile?.dob || '',
      });
      setPasswordConfirm('');
    }
    setEditing(!editing);
  };

  const handleSave = async () => {
    if (!profile) return;
    
    // Validate password confirmation
    if (!passwordConfirm || passwordConfirm.trim() === '') {
      alert('⚠️ Vui lòng nhập mật khẩu hiện tại để xác nhận thay đổi!');
      return;
    }
    
    setSaving(true);
    setError(null);
    try {
      // Include username and password in the update request
      const updatePayload = {
        username: profile.username,
        password: passwordConfirm, // Send current password to preserve it
        ...formData
      };
      
      const updated = await updateMyInfo(updatePayload as any);
      setProfile(updated);
      setEditing(false);
      setPasswordConfirm(''); // Clear password field
      
      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'toast-success';
      successMsg.textContent = '✅ Cập nhật thông tin thành công!';
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
      
    } catch (err: any) {
      let errorMsg = err?.response?.data?.message || err?.message || 'Cập nhật thất bại';
      
      // Check if error is due to wrong password
      if (err?.response?.status === 401 || errorMsg.toLowerCase().includes('password')) {
        errorMsg = 'Mật khẩu không đúng! Vui lòng thử lại.';
      }
      
      setError(errorMsg);
      
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'toast-error';
      errorDiv.textContent = `❌ ${errorMsg}`;
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof UpdateProfilePayload, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="profileContainer">
        <div className="profileLoading">
          <div className="spinner"></div>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="profileContainer">
        <div className="profileError">
          <h2>⚠️ Lỗi</h2>
          <p>{error || 'Không thể tải thông tin người dùng'}</p>
          <button onClick={() => navigate('/')} className="profileButton">
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profilePageContainer">
      {/* Left Sidebar */}
      <div className="profileSidebar">
        <div className="sidebarHeader">
          <div className="sidebarAvatar">
            <span className="sidebarAvatarText">{profile.username.charAt(0).toUpperCase()}</span>
          </div>
          <div className="sidebarUserInfo">
            <h3 className="sidebarUserName">
              {profile.firstName || profile.lastName
                ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
                : profile.username}
            </h3>
            <p className="sidebarUsername">@{profile.username}</p>
          </div>
        </div>

        <nav className="sidebarNav">
          <button 
            className={`sidebarNavItem ${activeSection === 'account' ? 'active' : ''}`}
            onClick={() => setActiveSection('account')}
          >
            <span className="navItemIcon">👤</span>
            <span className="navItemText">Tài khoản của tôi</span>
          </button>
          
          <button 
            className={`sidebarNavItem ${activeSection === 'topup' ? 'active' : ''}`}
            onClick={() => setActiveSection('topup')}
          >
            <span className="navItemIcon">💰</span>
            <span className="navItemText">Nạp tiền</span>
          </button>
          
          <button 
            className={`sidebarNavItem ${activeSection === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveSection('inventory')}
          >
            <span className="navItemIcon">📦</span>
            <span className="navItemText">Kho hàng</span>
          </button>
          
          <button 
            className={`sidebarNavItem ${activeSection === 'points' ? 'active' : ''}`}
            onClick={() => setActiveSection('points')}
          >
            <span className="navItemIcon">💎</span>
            <span className="navItemText">Đổi điểm</span>
          </button>
          
          <button 
            className={`sidebarNavItem ${activeSection === 'history' ? 'active' : ''}`}
            onClick={() => setActiveSection('history')}
          >
            <span className="navItemIcon">📜</span>
            <span className="navItemText">Lịch sử</span>
          </button>
          
          <button 
            className={`sidebarNavItem ${activeSection === 'voucher' ? 'active' : ''}`}
            onClick={() => setActiveSection('voucher')}
          >
            <span className="navItemIcon">🎟️</span>
            <span className="navItemText">Kho Voucher</span>
          </button>
          
          <button 
            className={`sidebarNavItem ${activeSection === 'wishlist' ? 'active' : ''}`}
            onClick={() => navigate('/wishlist')}
          >
            <span className="navItemIcon">❤️</span>
            <span className="navItemText">Yêu thích</span>
          </button>
          
          <button 
            className="sidebarNavItem danger"
            onClick={handleLogout}
          >
            <span className="navItemIcon">🚪</span>
            <span className="navItemText">Đăng xuất</span>
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="profileMainContent">
        {/* Account Section */}
        {activeSection === 'account' && (
          <div className="contentSection">
            <div className="sectionHeader">
              <h1 className="sectionTitle">
                <span className="sectionIcon">👤</span>
                Tài khoản của tôi
              </h1>
              <button className="editToggleBtn" onClick={handleEdit}>
                <span className="editIcon">{editing ? '❌' : '✏️'}</span>
                {editing ? 'Hủy' : 'Chỉnh sửa'}
              </button>
            </div>

            <div className="contentGrid">
              {/* Personal Information Card */}
              <div className="contentCard">
                <div className="cardHeader">
                  <h2 className="cardTitle">
                    <span className="titleIcon">📋</span>
                    Thông tin cá nhân
                  </h2>
                </div>
                <div className="cardBody">
                  <div className="infoList">
                    <div className="infoRow">
                      <div className="infoLabel">
                        <span className="labelIcon">🏷️</span>
                        <span className="labelText">Username</span>
                      </div>
                      <div className="infoValue">{profile.username}</div>
                    </div>
                    
                    <div className="infoRow">
                      <div className="infoLabel">
                        <span className="labelIcon">👨</span>
                        <span className="labelText">Họ</span>
                      </div>
                      <div className="infoValue">
                        {editing ? (
                          <input
                            type="text"
                            className="editInput"
                            value={formData.firstName}
                            onChange={(e) => handleChange('firstName', e.target.value)}
                            placeholder="Nhập họ..."
                          />
                        ) : (
                          profile.firstName || <span className="emptyValue">Chưa cập nhật</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="infoRow">
                      <div className="infoLabel">
                        <span className="labelIcon">📝</span>
                        <span className="labelText">Tên</span>
                      </div>
                      <div className="infoValue">
                        {editing ? (
                          <input
                            type="text"
                            className="editInput"
                            value={formData.lastName}
                            onChange={(e) => handleChange('lastName', e.target.value)}
                            placeholder="Nhập tên..."
                          />
                        ) : (
                          profile.lastName || <span className="emptyValue">Chưa cập nhật</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="infoRow">
                      <div className="infoLabel">
                        <span className="labelIcon">📧</span>
                        <span className="labelText">Email</span>
                      </div>
                      <div className="infoValue">
                        {editing ? (
                          <input
                            type="email"
                            className="editInput"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            placeholder="email@example.com"
                          />
                        ) : (
                          profile.email || <span className="emptyValue">Chưa cập nhật</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="infoRow">
                      <div className="infoLabel">
                        <span className="labelIcon">📱</span>
                        <span className="labelText">Số điện thoại</span>
                      </div>
                      <div className="infoValue">
                        {editing ? (
                          <input
                            type="tel"
                            className="editInput"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            placeholder="0123456789"
                          />
                        ) : (
                          profile.phone || <span className="emptyValue">Chưa cập nhật</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="infoRow">
                      <div className="infoLabel">
                        <span className="labelIcon">🎂</span>
                        <span className="labelText">Ngày sinh</span>
                      </div>
                      <div className="infoValue">
                        {editing ? (
                          <input
                            type="date"
                            className="editInput"
                            value={formData.dob}
                            onChange={(e) => handleChange('dob', e.target.value)}
                            placeholder="YYYY-MM-DD"
                            aria-label="Ngày sinh"
                          />
                        ) : (
                          profile.dob 
                            ? new Date(profile.dob).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })
                            : <span className="emptyValue">Chưa cập nhật</span>
                        )}
                      </div>
                    </div>

                    <div className="infoRow">
                      <div className="infoLabel">
                        <span className="labelIcon">🆔</span>
                        <span className="labelText">User ID</span>
                      </div>
                      <div className="infoValue userId">{profile.id}</div>
                    </div>
                  </div>

                  {editing && (
                    <>
                      <div className="passwordConfirmSection">
                        <div className="passwordConfirmHeader">
                          <span className="warningIcon">🔐</span>
                          <h3>Xác nhận mật khẩu</h3>
                        </div>
                        <p className="passwordConfirmNote">
                          Để bảo mật tài khoản, vui lòng nhập mật khẩu hiện tại của bạn để xác nhận thay đổi.
                        </p>
                        <div className="passwordConfirmInput">
                          <input
                            type="password"
                            className="editInput"
                            placeholder="Nhập mật khẩu hiện tại..."
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="editActions">
                        <button 
                          className="saveButton" 
                          onClick={handleSave}
                          disabled={saving}
                        >
                          <span className="saveIcon">💾</span>
                          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                        <button 
                          className="cancelButton" 
                          onClick={handleEdit}
                          disabled={saving}
                        >
                          <span className="cancelIcon">🚫</span>
                          Hủy bỏ
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Account Security Card */}
              <div className="contentCard">
                <div className="cardHeader">
                  <h2 className="cardTitle">
                    <span className="titleIcon">🔒</span>
                    Bảo mật tài khoản
                  </h2>
                </div>
                <div className="cardBody">
                  <div className="securityList">
                    <div className="securityItem">
                      <div className="securityIcon verified">✓</div>
                      <div className="securityContent">
                        <h3>Tài khoản đã xác thực</h3>
                        <p>Tài khoản của bạn đã được xác thực</p>
                      </div>
                    </div>
                    
                    <div className="securityItem">
                      <div className="securityIcon">🔑</div>
                      <div className="securityContent">
                        <h3>Mật khẩu</h3>
                        <p>Được cập nhật gần đây</p>
                      </div>
                      <button className="securityAction" onClick={() => navigate('/forgot')}>
                        Đổi mật khẩu
                      </button>
                    </div>
                    
                    {profile.email && (
                      <div className="securityItem">
                        <div className="securityIcon verified">📧</div>
                        <div className="securityContent">
                          <h3>Email xác thực</h3>
                          <p>{profile.email}</p>
                        </div>
                      </div>
                    )}
                    
                    {profile.phone && (
                      <div className="securityItem">
                        <div className="securityIcon verified">📱</div>
                        <div className="securityContent">
                          <h3>Số điện thoại xác thực</h3>
                          <p>{profile.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Stats Card */}
              <div className="contentCard">
                <div className="cardHeader">
                  <h2 className="cardTitle">
                    <span className="titleIcon">📊</span>
                    Thống kê tài khoản
                  </h2>
                </div>
                <div className="cardBody">
                  <div className="statsGrid">
                    <div className="statBox">
                      <div className="statBoxIcon">🎮</div>
                      <div className="statBoxValue">0</div>
                      <div className="statBoxLabel">Game đã mua</div>
                    </div>
                    
                    <div className="statBox">
                      <div className="statBoxIcon">💰</div>
                      <div className="statBoxValue">0đ</div>
                      <div className="statBoxLabel">Tổng chi tiêu</div>
                    </div>
                    
                    <div className="statBox">
                      <div className="statBoxIcon">⭐</div>
                      <div className="statBoxValue">Bạc</div>
                      <div className="statBoxLabel">Cấp độ</div>
                    </div>
                    
                    <div className="statBox">
                      <div className="statBoxIcon">🏆</div>
                      <div className="statBoxValue">0</div>
                      <div className="statBoxLabel">Thành tựu</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Topup Section */}
        {activeSection === 'topup' && (
          <div className="contentSection">
            <div className="sectionHeader">
              <h1 className="sectionTitle">
                <span className="sectionIcon">💰</span>
                Nạp tiền
              </h1>
            </div>
            <div className="contentCard">
              <div className="cardBody">
                <div className="emptyState">
                  <div className="emptyStateIcon">💳</div>
                  <h3>Chức năng nạp tiền</h3>
                  <p>Tính năng này đang được phát triển</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Section */}
        {activeSection === 'inventory' && (
          <div className="contentSection">
            <div className="sectionHeader">
              <h1 className="sectionTitle">
                <span className="sectionIcon">📦</span>
                Kho hàng
              </h1>
            </div>
            <div className="contentCard">
              <div className="cardBody">
                <div className="emptyState">
                  <div className="emptyStateIcon">🎮</div>
                  <h3>Kho hàng trống</h3>
                  <p>Bạn chưa có game nào trong kho</p>
                  <button className="emptyStateBtn" onClick={() => navigate('/store')}>
                    Khám phá Store
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Points Section */}
        {activeSection === 'points' && (
          <div className="contentSection">
            <div className="sectionHeader">
              <h1 className="sectionTitle">
                <span className="sectionIcon">💎</span>
                Đổi điểm
              </h1>
            </div>
            <div className="contentCard">
              <div className="cardBody">
                <div className="emptyState">
                  <div className="emptyStateIcon">✨</div>
                  <h3>Chương trình đổi điểm</h3>
                  <p>Tính năng này đang được phát triển</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Section */}
        {activeSection === 'history' && (
          <div className="contentSection">
            <div className="sectionHeader">
              <h1 className="sectionTitle">
                <span className="sectionIcon">📜</span>
                Lịch sử giao dịch
              </h1>
            </div>
            <div className="contentCard">
              <div className="cardBody">
                <div className="emptyState">
                  <div className="emptyStateIcon">📋</div>
                  <h3>Chưa có giao dịch</h3>
                  <p>Lịch sử giao dịch của bạn sẽ hiển thị ở đây</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Voucher Section */}
        {activeSection === 'voucher' && (
          <div className="contentSection">
            <div className="sectionHeader">
              <h1 className="sectionTitle">
                <span className="sectionIcon">🎟️</span>
                Kho Voucher
              </h1>
            </div>
            <div className="contentCard">
              <div className="cardBody">
                <div className="emptyState">
                  <div className="emptyStateIcon">🎁</div>
                  <h3>Chưa có voucher</h3>
                  <p>Các voucher của bạn sẽ hiển thị ở đây</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;

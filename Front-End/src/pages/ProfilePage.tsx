import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyInfo, introspect, updateMyInfo, UpdateProfilePayload, uploadAvatar, getBalance, createMoMoTopup, getTransactionHistory } from '../api/client';
import './ProfilePage.css';

interface UserProfile {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  avatarUrl?: string;
  balance?: number;
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
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [balance, setBalance] = useState<number>(0);
  const [topupAmount, setTopupAmount] = useState<string>('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

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

        // Load balance
        try {
          const balanceData = await getBalance();
          setBalance(balanceData.balance || 0);
        } catch (balanceErr) {
          console.error('Failed to load balance:', balanceErr);
        }
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
    
    setSaving(true);
    setError(null);
    try {
      // Update profile info WITHOUT sending password
      // Password should only be sent when explicitly changing password
      const updatePayload = {
        ...formData
      };
      
      console.log('🔄 Step 1: Preparing update with:', updatePayload);
      console.log('🔄 Step 2: Calling updateMyInfo...');
      
      const updated = await updateMyInfo(updatePayload as any);
      
      console.log('✅ Step 3: Got response:', updated);
      
      setProfile(updated);
      // IMPORTANT: Update formData with new values too!
      setFormData({
        firstName: updated.firstName || '',
        lastName: updated.lastName || '',
        email: updated.email || '',
        phone: updated.phone || '',
        dob: updated.dob || '',
      });
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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('⚠️ Vui lòng chọn file ảnh!');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('⚠️ Kích thước ảnh không được vượt quá 5MB!');
      return;
    }

    setAvatarUploading(true);
    try {
      const updatedUser = await uploadAvatar(file);
      
      // Update local state with new avatar URL (includes timestamp from backend)
      setProfile(prev => prev ? { ...prev, avatarUrl: updatedUser.avatarUrl } : null);
      
      // Update navbar avatar - trigger event
      window.dispatchEvent(new CustomEvent('avatar-updated', { detail: updatedUser.avatarUrl }));
      
      const successMsg = document.createElement('div');
      successMsg.className = 'toast-success';
      successMsg.textContent = '✅ Upload avatar thành công!';
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
    } catch (err: any) {
      console.error('Failed to upload avatar:', err);
      alert('❌ Upload avatar thất bại: ' + (err.message || 'Unknown error'));
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleTopup = async () => {
    const amount = parseFloat(topupAmount);
    if (!amount || amount <= 0) {
      alert('⚠️ Vui lòng nhập số tiền hợp lệ!');
      return;
    }

    if (amount < 10000) {
      alert('⚠️ Số tiền nạp tối thiểu là 10,000 VNĐ!');
      return;
    }

    try {
      const result = await createMoMoTopup({ amount });
      
      if (result.payUrl) {
        // Redirect to MoMo payment page
        window.location.href = result.payUrl;
      } else {
        alert('❌ Không thể tạo link thanh toán');
      }
    } catch (err: any) {
      console.error('Failed to create topup:', err);
      alert('❌ Tạo yêu cầu nạp tiền thất bại');
    }
  };

  const loadTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const data = await getTransactionHistory();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Load transactions when switching to history section
  useEffect(() => {
    if (activeSection === 'history') {
      loadTransactions();
    }
  }, [activeSection]);

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
          <div className="sidebarAvatar sidebarAvatarClickable" onClick={handleAvatarClick}>
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" className="sidebarAvatarImage" />
            ) : (
              <span className="sidebarAvatarText">{profile.username.charAt(0).toUpperCase()}</span>
            )}
            {avatarUploading && <div className="avatarUploading">...</div>}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="avatarFileInput"
            onChange={handleAvatarChange}
            aria-label="Upload avatar"
          />
          <div className="sidebarUserInfo">
            <h3 className="sidebarUserName">
              {profile.firstName || profile.lastName
                ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
                : profile.username}
            </h3>
            <p className="sidebarUsername">@{profile.username}</p>
          <div className="sidebarBalance">
              <svg className="balanceIcon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="balanceAmount">{balance.toLocaleString('vi-VN')}đ</span>
          </div>
          </div>
        </div>

        <nav className="sidebarNav">
          <button 
            className={`sidebarNavItem ${activeSection === 'account' ? 'active' : ''}`}
            onClick={() => setActiveSection('account')}
          >
            <svg className="navItemIcon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="navItemText">Tài khoản của tôi</span>
          </button>
          
          <button 
            className={`sidebarNavItem ${activeSection === 'topup' ? 'active' : ''}`}
            onClick={() => setActiveSection('topup')}
          >
            <svg className="navItemIcon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="navItemText">Nạp tiền</span>
          </button>
          
          <button 
            className={`sidebarNavItem ${activeSection === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveSection('inventory')}
          >
            <svg className="navItemIcon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="navItemText">Kho hàng</span>
          </button>
          
          <button 
            className={`sidebarNavItem ${activeSection === 'points' ? 'active' : ''}`}
            onClick={() => setActiveSection('points')}
          >
            <svg className="navItemIcon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="navItemText">Đổi điểm</span>
          </button>
          
          <button 
            className={`sidebarNavItem ${activeSection === 'history' ? 'active' : ''}`}
            onClick={() => setActiveSection('history')}
          >
            <svg className="navItemIcon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="navItemText">Lịch sử</span>
          </button>
          
          <button 
            className={`sidebarNavItem ${activeSection === 'voucher' ? 'active' : ''}`}
            onClick={() => setActiveSection('voucher')}
          >
            <svg className="navItemIcon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="navItemText">Kho Voucher</span>
          </button>
          
          <button 
            className={`sidebarNavItem ${activeSection === 'wishlist' ? 'active' : ''}`}
            onClick={() => navigate('/wishlist')}
          >
            <svg className="navItemIcon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="navItemText">Yêu thích</span>
          </button>
          
          <button 
            className="sidebarNavItem danger"
            onClick={handleLogout}
          >
            <svg className="navItemIcon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
                <svg className="sectionIcon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Tài khoản của tôi
              </h1>
              <button className="editToggleBtn" onClick={handleEdit}>
                {editing ? (
                  <svg className="editIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg className="editIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
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
              <div className="cardHeader">
                <h2 className="cardTitle">
                  <span className="titleIcon">💳</span>
                  Số dư hiện tại
                </h2>
              </div>
              <div className="cardBody">
                <div className="balanceDisplay">
                  <div className="balanceAmount">{balance.toLocaleString('vi-VN')} VNĐ</div>
                </div>
              </div>
            </div>

            <div className="contentCard">
              <div className="cardHeader">
                <h2 className="cardTitle">
                  <span className="titleIcon">💸</span>
                  Nạp tiền qua MoMo
                </h2>
              </div>
              <div className="cardBody">
                <div className="topupForm">
                  <div className="formGroup">
                    <label htmlFor="topupAmount">Số tiền nạp (VNĐ)</label>
                    <input
                      id="topupAmount"
                      type="number"
                      className="editInput"
                      value={topupAmount}
                      onChange={(e) => setTopupAmount(e.target.value)}
                      placeholder="Nhập số tiền (tối thiểu 10,000đ)"
                      min="10000"
                      step="10000"
                    />
                  </div>
                  
                  <div className="quickAmounts">
                    <button className="quickAmountBtn" onClick={() => setTopupAmount('50000')}>
                      50,000đ
                    </button>
                    <button className="quickAmountBtn" onClick={() => setTopupAmount('100000')}>
                      100,000đ
                    </button>
                    <button className="quickAmountBtn" onClick={() => setTopupAmount('200000')}>
                      200,000đ
                    </button>
                    <button className="quickAmountBtn" onClick={() => setTopupAmount('500000')}>
                      500,000đ
                    </button>
                  </div>

                  <button className="topupButton" onClick={handleTopup}>
                    <span className="topupIcon">💳</span>
                    Nạp tiền qua MoMo
                  </button>

                  <div className="topupNote">
                    <p>💡 Bạn sẽ được chuyển đến trang thanh toán MoMo</p>
                    <p>💡 Số tiền nạp tối thiểu: 10,000 VNĐ</p>
                  </div>
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
              <button className="refreshButton" onClick={loadTransactions}>
                🔄 Làm mới
              </button>
            </div>
            
            <div className="contentCard">
              <div className="cardBody">
                {loadingTransactions ? (
                  <div className="loadingState">
                    <div className="spinner"></div>
                    <p>Đang tải...</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="emptyState">
                    <div className="emptyStateIcon">📋</div>
                    <h3>Chưa có giao dịch</h3>
                    <p>Lịch sử giao dịch của bạn sẽ hiển thị ở đây</p>
                  </div>
                ) : (
                  <div className="transactionList">
                    {transactions.map((tx) => (
                      <div key={tx.id} className={`transactionItem ${tx.status.toLowerCase()}`}>
                        <div className="transactionIcon">
                          {tx.type === 'TOPUP' ? '💰' : tx.type === 'PURCHASE' ? '🎮' : '🔄'}
                        </div>
                        <div className="transactionDetails">
                          <div className="transactionTitle">{tx.description}</div>
                          <div className="transactionMeta">
                            <span className="transactionDate">
                              {new Date(tx.createdAt).toLocaleString('vi-VN')}
                            </span>
                            <span className="transactionMethod">{tx.paymentMethod}</span>
                          </div>
                        </div>
                        <div className="transactionAmount">
                          <span className={tx.type === 'TOPUP' ? 'positive' : 'negative'}>
                            {tx.type === 'TOPUP' ? '+' : '-'}
                            {tx.amount.toLocaleString('vi-VN')}đ
                          </span>
                          <span className={`transactionStatus ${tx.status.toLowerCase()}`}>
                            {tx.status === 'SUCCESS' ? '✅ Thành công' : 
                             tx.status === 'PENDING' ? '⏳ Đang xử lý' : 
                             tx.status === 'FAILED' ? '❌ Thất bại' : '🚫 Đã hủy'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

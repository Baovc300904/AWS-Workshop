import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ModeratorPage.css';

const ModeratorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="modPageRoot">
      <div className="modPageHeader">
        <h2>⚡ Moderator Dashboard</h2>
        <p>Quản lý hệ thống và người dùng</p>
      </div>
      
      <div className="modPageGrid">
        <div className="modCard" onClick={() => navigate('/admin')}>
          <div className="modCardIcon">🎮</div>
          <h3>Quản lý Games</h3>
          <p>Thêm, sửa, xóa games và danh mục</p>
        </div>
        
        <div className="modCard" onClick={() => navigate('/admin/users')}>
          <div className="modCardIcon">👥</div>
          <h3>Quản lý Users</h3>
          <p>Xem danh sách và quản lý người dùng</p>
        </div>
        
        <div className="modCard" onClick={() => alert('Chức năng đang phát triển')}>
          <div className="modCardIcon">📊</div>
          <h3>Thống kê</h3>
          <p>Xem báo cáo và phân tích dữ liệu</p>
        </div>
        
        <div className="modCard" onClick={() => alert('Chức năng đang phát triển')}>
          <div className="modCardIcon">⚙️</div>
          <h3>Cài đặt</h3>
          <p>Cấu hình hệ thống</p>
        </div>
      </div>
    </div>
  );
};

export default ModeratorPage;

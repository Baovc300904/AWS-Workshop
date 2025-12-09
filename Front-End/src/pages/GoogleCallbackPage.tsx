import { useEffect } from 'react';
import { handleGoogleCallback } from '../services/googleAuth';

/**
 * Google OAuth Callback Page
 * This page handles the redirect from Google OAuth
 */
const GoogleCallbackPage: React.FC = () => {
  useEffect(() => {
    handleGoogleCallback();
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #16202D 0%, #1B2838 50%, #16202D 100%)',
      color: '#e0e7ff',
      textAlign: 'center',
      padding: '20px',
    }}>
      <div>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔄</div>
        <h2>Đang xử lý đăng nhập Google...</h2>
        <p>Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;

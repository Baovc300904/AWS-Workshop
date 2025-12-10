import { useState } from 'react';
import './ZaloButton.css';

export default function ZaloButton() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="zalo-button-container">
      <button 
        className="zalo-main-button"
        onClick={() => setShowMenu(!showMenu)}
        aria-label="Zalo support"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </button>
      
      {showMenu && (
        <div className="zalo-menu">
          <a 
            href="https://zalo.me/0937839123" 
            target="_blank" 
            rel="noopener noreferrer"
            className="zalo-menu-item"
          >
            <span className="zalo-icon">💬</span>
            <span>Chat với chúng tôi</span>
          </a>
          <a 
            href="https://zalo.me/g/YOUR_GROUP_ID" 
            target="_blank" 
            rel="noopener noreferrer"
            className="zalo-menu-item"
          >
            <span className="zalo-icon">👥</span>
            <span>Tham gia nhóm</span>
          </a>
        </div>
      )}
    </div>
  );
}

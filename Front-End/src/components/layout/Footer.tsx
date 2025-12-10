import './Footer.css';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>Devteria Game Store</h3>
            <p>Nền tảng mua bán game uy tín hàng đầu</p>
          </div>
          <div className="footer-links">
            <div className="link-col">
              <h4>Cửa hàng</h4>
              <a href="/">Trang chủ</a>
              <a href="/checkout">Giỏ hàng</a>
            </div>
            <div className="link-col">
              <h4>Tài khoản</h4>
              <a href="/login">Đăng nhập</a>
              <a href="/register">Đăng ký</a>
            </div>
            <div className="link-col">
              <h4>Hỗ trợ</h4>
              <a href="#">FAQ</a>
              <a href="https://zalo.me/0937839123" target="_blank" rel="noopener noreferrer" className="zalo-link">
                <span>💬</span> Chat Zalo hỗ trợ
              </a>
              <a href="https://zalo.me/g/YOUR_GROUP_ID" target="_blank" rel="noopener noreferrer" className="zalo-link">
                <span>👥</span> Nhóm Zalo
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Devteria. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

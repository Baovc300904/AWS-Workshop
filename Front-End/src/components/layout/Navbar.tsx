import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useMemo, useState, useRef, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { fetchCategories, Category, setAuthToken } from '../../api/client';

export default function Navbar() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<{ username: string } | null>(() => {
    try {
      const username = localStorage.getItem('username');
      return username ? { username } : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    fetchCategories()
      .then((cats) => setCategories(cats || []))
      .catch(() => {});
  }, []);

  const platforms = useMemo(() => ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'], []);

  const [openMenu, setOpenMenu] = useState<'cat' | 'plat' | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpenMenu(null);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [openMenu]);

  function goFiltered(type: string, value: string) {
    if (type === 'genre') navigate(`/?category=${encodeURIComponent(value)}`);
    if (type === 'platform') navigate(`/?platform=${encodeURIComponent(value)}`);
    setOpenMenu(null);
    setMobileOpen(false);
  }

  function handleSearchGo(inputEl: HTMLInputElement | null) {
    if (!inputEl) return;
    const val = inputEl.value.trim();
    if (val) {
      navigate(`/?search=${encodeURIComponent(val)}`);
      setMobileOpen(false);
    }
  }

  function handleLogout() {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('user');
      setAuthToken(null as any);
      setUser(null);
      navigate('/login');
    } catch {}
  }

  return (
    <header className="app-header" role="banner">
      <nav className="app-nav container" aria-label="Main navigation">
        <div className="nav-left">
          <div
            className="brand"
            onClick={() => navigate('/')}
            tabIndex={0}
            role="link"
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate('/');
            }}
          >
            Devteria
          </div>
          <button
            className={'hamburger' + (mobileOpen ? ' open' : '')}
            aria-label="Mở / đóng menu"
            aria-expanded={mobileOpen ? 'true' : 'false'}
            aria-controls="primary-nav"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
          <ul id="primary-nav" className={'primary' + (mobileOpen ? ' show' : '')}>
            <li>
              <NavLink to="/" end onClick={() => setMobileOpen(false)}>
                Trang chủ
              </NavLink>
            </li>
            <li>
              <NavLink to="/checkout" onClick={() => setMobileOpen(false)}>
                Thanh toán
              </NavLink>
            </li>
            <li className="has-sub" ref={menuRef}>
              <button
                type="button"
                className="menu-trigger"
                aria-haspopup="true"
                aria-expanded={openMenu === 'cat' ? 'true' : 'false'}
                onClick={() => setOpenMenu((m) => (m === 'cat' ? null : 'cat'))}
              >
                Danh mục ▾
              </button>
              {openMenu === 'cat' && (
                <div className="dropdown">
                  {categories.slice(0, 20).map((c) => (
                    <button key={c.name} className="dd-item" onClick={() => goFiltered('genre', c.name)}>
                      {c.name}
                    </button>
                  ))}
                  {categories.length > 20 && <div className="dd-more">… {categories.length - 20} mục khác</div>}
                </div>
              )}
            </li>
            <li className="has-sub">
              <button
                type="button"
                className="menu-trigger"
                aria-haspopup="true"
                aria-expanded={openMenu === 'plat' ? 'true' : 'false'}
                onClick={() => setOpenMenu((m) => (m === 'plat' ? null : 'plat'))}
              >
                Nền tảng ▾
              </button>
              {openMenu === 'plat' && (
                <div className="dropdown">
                  {platforms.map((p) => (
                    <button key={p} className="dd-item" onClick={() => goFiltered('platform', p)}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </div>
        <div className="nav-center">
          <div className="search-bar" role="search">
            <input
              type="text"
              placeholder="Tìm kiếm game..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchGo(e.currentTarget);
              }}
              aria-label="Tìm kiếm game"
            />
            <button
              type="button"
              className="go"
              aria-label="Tìm"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                handleSearchGo(input);
              }}
            >
              🔍
            </button>
          </div>
        </div>
        <div className="nav-right">
          {user ? (
            <div className="user-box">
              <span className="user-name" title={user.username}>
                {user.username}
              </span>
              <button type="button" className="logout-btn" onClick={handleLogout} aria-label="Đăng xuất">
                ⏻
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                className="login-btn"
                onClick={() => {
                  navigate('/login');
                  setMobileOpen(false);
                }}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                className="register-btn"
                onClick={() => {
                  navigate('/register');
                  setMobileOpen(false);
                }}
              >
                Đăng ký
              </button>
            </>
          )}
          <button
            className="cart-btn"
            onClick={() => {
              navigate('/checkout');
              setMobileOpen(false);
            }}
            aria-label="Tới giỏ hàng"
          >
            🛒 <span>{cart.length}</span>
          </button>
        </div>
      </nav>
    </header>
  );
}

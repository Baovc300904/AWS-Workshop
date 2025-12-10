import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useMemo, useState, useRef, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { fetchCategories, Category, setAuthToken, logout as apiLogout, getMyInfo, getBalance } from '../../api/client';

export default function Navbar() {
    const { cart } = useCart();
    const { wishlist } = useWishlist();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [balance, setBalance] = useState<number>(0);
    const [user, setUser] = useState<{ username: string; avatarUrl?: string; roles?: string[] } | null>(() => {
        try {
            const username = localStorage.getItem('username');
            return username ? { username } : null;
        } catch {
            return null;
        }
    });

    // Category icons mapping
    const categoryIcons: Record<string, string> = {
        'Action': '🎯',
        'Adventure': '🗺️',
        'RPG': '🧙',
        'Strategy': '♟️',
        'Sports': '⚽',
        'Racing': '🏎️',
        'Simulation': '🛠️',
        'Horror': '👻',
        'Puzzle': '🧩',
        'Shooter': '🔫',
        '3D': '🎮',
        'Abilities': '⚡',
        'Action-Adventure': '🎬',
        'Battle Royale': '🎖️',
        'Blood Types': '🩸',
        'Boss Rushes': '👹',
        'Casual': '🎲',
        'Co-op': '🤝',
        'Competitive': '🏆',
        'Fighting': '🥊',
        'FPS': '🎯',
        'MMORPG': '🌍',
        'Platformer': '🪜',
        'Sandbox': '🏗️',
        'Survival': '🔥',
        'Stealth': '🕵️',
        'Tower Defense': '🗼',
        'VR': '🥽'
    };

    const getCategoryIcon = (categoryName: string): string => {
        return categoryIcons[categoryName] || '🎮';
    };

    useEffect(() => {
        fetchCategories()
            .then((cats) => setCategories(cats || []))
            .catch(() => { });
    }, []);

    // Load user profile with avatar and roles
    useEffect(() => {
        if (user && user.username && !user.roles) {
            getMyInfo()
                .then((profile) => {
                    if (profile) {
                        const roles = profile.roles?.map((r: any) => r.name) || [];
                        setUser({ username: profile.username, avatarUrl: profile.avatarUrl, roles });
                    }
                })
                .catch(() => { });
        }
    }, [user]);

    // Fetch user balance
    useEffect(() => {
        if (user && user.username) {
            getBalance()
                .then((data) => {
                    setBalance(data.balance || 0);
                })
                .catch(() => {
                    setBalance(0);
                });
        }
    }, [user]);

    const platforms = useMemo(() => [
        { name: 'PC', icon: '💻' },
        { name: 'PlayStation', icon: '🎮' },
        { name: 'Xbox', icon: '🎯' },
        { name: 'Nintendo Switch', icon: '🕹️' },
        { name: 'Mobile', icon: '📱' }
    ], []);

    const [openMenu, setOpenMenu] = useState<'cat' | 'plat' | 'profile' | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const menuRef = useRef<HTMLLIElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onDoc(e: MouseEvent) {
            if (!menuRef.current && !profileRef.current) return;
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                if (openMenu === 'cat' || openMenu === 'plat') setOpenMenu(null);
            }
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                if (openMenu === 'profile') setOpenMenu(null);
            }
        }
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, [openMenu]);

    useEffect(() => {
        setMobileOpen(false);
    }, [openMenu]);

    function goFiltered(type: string, value: string) {
        console.log('[Navbar] goFiltered called:', { type, value });
        if (type === 'genre') {
            const url = `/store?category=${encodeURIComponent(value)}`;
            console.log('[Navbar] Navigating to:', url);
            navigate(url);
        }
        if (type === 'platform') {
            const url = `/store?platform=${encodeURIComponent(value)}`;
            console.log('[Navbar] Navigating to:', url);
            navigate(url);
        }
        setOpenMenu(null);
        setMobileOpen(false);
    }

    function handleSearchGo(inputEl: HTMLInputElement | null) {
        if (!inputEl) return;
        const val = inputEl.value.trim();
        if (val) {
            navigate(`/store?search=${encodeURIComponent(val)}`);
            inputEl.value = '';
            setMobileOpen(false);
        }
    }

    async function handleLogout() {
        try {
            const token = localStorage.getItem('wgs_token') || localStorage.getItem('token');
            
            // Call backend logout API if token exists
            if (token) {
                try {
                    await apiLogout(token);
                } catch (err) {
                    console.error('[Navbar] Logout API error:', err);
                    // Continue with local cleanup even if API fails
                }
            }
            
            // Get current username before clearing
            const username = user?.username || 'unknown';
            
            // Clear user-specific cart/wishlist
            localStorage.removeItem(`cart_${username}`);
            localStorage.removeItem(`wishlist_${username}`);
            
            // Clear old shared data
            localStorage.removeItem('demo_cart');
            localStorage.removeItem('wishlist_ids');
            
            // Clear local storage
            localStorage.removeItem('wgs_token');
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('username');
            localStorage.removeItem('user');
            setAuthToken(null);
            setUser(null);
            navigate('/login');
        } catch (err) {
            console.error('[Navbar] Logout error:', err);
        }
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
                            <NavLink to="/store" onClick={() => setMobileOpen(false)}>
                                Cửa hàng
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/categories" onClick={() => setMobileOpen(false)}>
                                Danh mục
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
                                Thể loại ▾
                            </button>
                            {openMenu === 'cat' && (
                                <div className="dropdown category-dropdown">
                                    <div className="dd-header">
                                        <span className="dd-title">🎮 Thể loại Game</span>
                                        <button 
                                            className="dd-view-all"
                                            onClick={() => {
                                                navigate('/categories');
                                                setOpenMenu(null);
                                                setMobileOpen(false);
                                            }}
                                        >
                                            Xem tất cả →
                                        </button>
                                    </div>
                                    <div className="dd-grid">
                                        {categories.slice(0, 24).map((c) => (
                                            <button 
                                                key={c.name} 
                                                className="dd-item category-item" 
                                                onClick={() => goFiltered('genre', c.name)}
                                            >
                                                <span className="cat-icon">{getCategoryIcon(c.name)}</span>
                                                <span className="cat-name">{c.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                    {categories && categories.length > 24 && (
                                        <div className="dd-footer">
                                            <span className="dd-more">
                                                và {(categories || []).length - 24} thể loại khác...
                                            </span>
                                        </div>
                                    )}
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
                                <div className="dropdown platform-dropdown">
                                    <div className="dd-header">
                                        <span className="dd-title">🎮 Nền tảng Gaming</span>
                                        <button 
                                            className="dd-view-all"
                                            onClick={() => {
                                                navigate('/categories');
                                                setOpenMenu(null);
                                                setMobileOpen(false);
                                            }}
                                        >
                                            Xem tất cả →
                                        </button>
                                    </div>
                                    <div className="platform-grid">
                                        {platforms.map((p) => (
                                            <button 
                                                key={p.name} 
                                                className="dd-item platform-item" 
                                                onClick={() => goFiltered('platform', p.name)}
                                            >
                                                <span className="plat-icon">{p.icon}</span>
                                                <span className="plat-name">{p.name}</span>
                                            </button>
                                        ))}
                                    </div>
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
                        <div className="user-box" ref={profileRef}>
                            <button 
                                type="button" 
                                className="profile-btn" 
                                onClick={() => setOpenMenu(m => m === 'profile' ? null : 'profile')}
                                title="Menu người dùng"
                                aria-label="Menu người dùng"
                                aria-expanded={openMenu === 'profile'}
                            >
                                {user.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="Avatar" className="avatar-circle" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <span className="avatar-circle">👤</span>
                                )}
                                <span className="user-name-inline">
                                    {user.username}
                                    {user.roles?.includes('ADMIN') && <span style={{ marginLeft: '4px', padding: '2px 6px', background: '#ff4444', color: 'white', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>ADMIN</span>}
                                    {user.roles?.includes('MOD') && !user.roles?.includes('ADMIN') && <span style={{ marginLeft: '4px', padding: '2px 6px', background: '#4CAF50', color: 'white', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>MOD</span>}
                                </span>
                            </button>
                            {openMenu === 'profile' && (
                                <div className="profile-dropdown">
                                    <div className="profile-dropdown-header">
                                        <div className="balance-box">
                                            <span className="balance-label">Số dư</span>
                                            <span className="balance-amount">
                                                <span className="coin-icon">🪙</span> {balance.toLocaleString('vi-VN')}đ
                                            </span>
                                        </div>
                                        <button className="topup-btn" onClick={() => {
                                            navigate('/topup');
                                            setOpenMenu(null);
                                        }}>
                                            Nạp tiền
                                        </button>
                                    </div>
                                    <div className="profile-dropdown-body">
                                        <div className="dropdown-grid">
                                            <button 
                                                className="dropdown-grid-item"
                                                onClick={() => {
                                                    navigate('/profile');
                                                    setOpenMenu(null);
                                                    setMobileOpen(false);
                                                }}
                                            >
                                                <span className="grid-item-icon">👤</span>
                                                <span className="grid-item-text">Tài khoản của tôi</span>
                                            </button>
                                            <button 
                                                className="dropdown-grid-item"
                                                onClick={() => {
                                                    navigate('/topup');
                                                    setOpenMenu(null);
                                                    setMobileOpen(false);
                                                }}
                                            >
                                                <span className="grid-item-icon">💰</span>
                                                <span className="grid-item-text">Nạp tiền</span>
                                            </button>
                                            <button 
                                                className="dropdown-grid-item"
                                                onClick={() => {
                                                    navigate('/orders');
                                                    setOpenMenu(null);
                                                    setMobileOpen(false);
                                                }}
                                            >
                                                <span className="grid-item-icon">📦</span>
                                                <span className="grid-item-text">Đơn hàng của tôi</span>
                                            </button>
                                            <button 
                                                className="dropdown-grid-item"
                                                onClick={() => {
                                                    navigate('/store');
                                                    setOpenMenu(null);
                                                    setMobileOpen(false);
                                                }}
                                            >
                                                <span className="grid-item-icon">🎁</span>
                                                <span className="grid-item-text">Kho hàng</span>
                                            </button>
                                            <button 
                                                className="dropdown-grid-item"
                                                onClick={() => {
                                                    alert('Chức năng đổi điểm đang phát triển');
                                                    setOpenMenu(null);
                                                }}
                                            >
                                                <span className="grid-item-icon">💎</span>
                                                <span className="grid-item-text">Đổi điểm</span>
                                            </button>
                                            <button 
                                                className="dropdown-grid-item"
                                                onClick={() => {
                                                    navigate('/orders');
                                                    setOpenMenu(null);
                                                    setMobileOpen(false);
                                                }}
                                            >
                                                <span className="grid-item-icon">📝</span>
                                                <span className="grid-item-text">Đơn hàng của tôi</span>
                                            </button>
                                            <button 
                                                className="dropdown-grid-item"
                                                onClick={() => {
                                                    alert('Chức năng kho voucher đang phát triển');
                                                    setOpenMenu(null);
                                                }}
                                            >
                                                <span className="grid-item-icon">🎫</span>
                                                <span className="grid-item-text">Kho Voucher</span>
                                            </button>
                                            <button 
                                                className="dropdown-grid-item"
                                                onClick={() => {
                                                    navigate('/wishlist');
                                                    setOpenMenu(null);
                                                    setMobileOpen(false);
                                                }}
                                            >
                                                <span className="grid-item-icon">❤️</span>
                                                <span className="grid-item-text">Yêu thích</span>
                                            </button>
                                            <button 
                                                className="dropdown-grid-item danger"
                                                onClick={() => {
                                                    handleLogout();
                                                    setOpenMenu(null);
                                                }}
                                            >
                                                <span className="grid-item-icon">🚪</span>
                                                <span className="grid-item-text">Đăng xuất</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
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

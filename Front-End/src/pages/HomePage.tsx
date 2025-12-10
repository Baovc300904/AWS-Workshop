import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchGamesByPrice, searchGames, Game, getMyInfo, Me, setAuthToken, fetchCategories, Category } from '../api/client';
import './HomePage.css';

export function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [catShowAll, setCatShowAll] = useState(false);
  const phasmoBase = 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2023_12_22_638388544972449475_phasmophobia-thum.jpg';
  const repoBase = 'https://cdn.dlcompare.com/game_tetiere/upload/gameimage/file/r-e-p-o-file-207303896c.jpg.webp';
  const peakBase = 'https://tamhongame.net/storage/games/peak-online-multiplayer/peak-online-multiplayer-vertical_photo-6QMXdTk37H4F0uqXhKQ2.jpeg';
  const palworldBase = 'https://tamhongame.net/storage/games/palworld/palworld-horizontal_photo-HdHSYiLAMsEe6LAWrRyV.jpeg';
  const codBase = 'https://tamhongame.net/storage/games/call-of-duty-black-ops-6/call-of-duty-black-ops-6-horizontal_photo-vw2Mptr6ftK6otZbrzka.jpeg';
  const rematchBase = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfH7I1Um-tl2dzd370WKP2dlP4Fgl6sDNQnQ&s';
  const cupheadBase = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyVQ8pbT1GsxKiONB0nw0zpbHlTuDuiLi7tQ&s';
  const cupheadLocal = `${import.meta.env.BASE_URL}assets/cuphead.jpg`;
  const vRisingBase = 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/game-v-rising-thumb.jpg';

  const getTags = (name?: string): string[] => {
    const n = (name || '').toLowerCase();
    if (n.includes('phasmophobia')) return ['Horror', 'Co-op', 'Multiplayer'];
    if (n.includes('palworld') || n.includes('palword')) return ['Survival', 'Open World', 'Creature'];
    if (n.includes('repo')) return ['Action', 'Adventure'];
    if (n.includes('peak')) return ['Multiplayer', 'Casual'];
    if (n.includes('call of duty') || n.includes('cod')) return ['Shooter', 'Action'];
    return [];
  };
  const [playPhasmo, setPlayPhasmo] = useState(false);
  const [playRepo, setPlayRepo] = useState(false);
  const [playPeak, setPlayPeak] = useState(false);
  const [playPal, setPlayPal] = useState(false);
  const [playCod, setPlayCod] = useState(false);
  const [playRematch, setPlayRematch] = useState(false);
  const [playCup, setPlayCup] = useState(false);
  const [playVRising, setPlayVRising] = useState(false);
  const phasmoEmbed = 'https://www.youtube-nocookie.com/embed/sRa9oeo5KiY?autoplay=1&mute=1&loop=1&playlist=sRa9oeo5KiY&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&showinfo=0&fs=0&title=0';
  const repoEmbed = 'https://www.youtube-nocookie.com/embed/oSfoK8eSeD8?autoplay=1&mute=1&loop=1&playlist=oSfoK8eSeD8&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&showinfo=0&fs=0&title=0';
  const peakEmbed = 'https://www.youtube-nocookie.com/embed/jrlUVhLBjG0?autoplay=1&mute=1&loop=1&playlist=jrlUVhLBjG0&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&showinfo=0&fs=0&title=0';
  const palworldEmbed = 'https://www.youtube-nocookie.com/embed/D9w97KSEAOo?autoplay=1&mute=1&loop=1&playlist=D9w97KSEAOo&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&showinfo=0&fs=0&title=0';
  const codEmbed = 'https://www.youtube-nocookie.com/embed/9txkGBj_trg?autoplay=1&mute=1&loop=1&playlist=9txkGBj_trg&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&showinfo=0&fs=0&title=0';
  const rematchEmbed = 'https://www.youtube-nocookie.com/embed/mo_RL_K891U?autoplay=1&mute=1&loop=1&playlist=mo_RL_K891U&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&showinfo=0&fs=0&title=0';
  const cupheadEmbed = 'https://www.youtube-nocookie.com/embed/NN-9SQXoi50?autoplay=1&mute=1&loop=1&playlist=NN-9SQXoi50&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&showinfo=0&fs=0&title=0';
  const vRisingEmbed = 'https://www.youtube-nocookie.com/embed/iCEpBpJ3paQ?autoplay=1&mute=1&loop=1&playlist=iCEpBpJ3paQ&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&showinfo=0&fs=0&title=0';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchGamesByPrice(order)
      .then((data) => {
        if (!cancelled) setGames(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message ?? 'Failed to load');
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [order]);

  // load categories once
  useEffect(() => {
    let cancelled = false;
    fetchCategories().then((arr)=>{ if(!cancelled) setCategories(arr||[]); }).catch(()=>{});
    return ()=>{ cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    // Try to get raw token from 'token' or from JSON stored in 'user'
    let token: string | null = localStorage.getItem('token');
    if (!token) {
      try {
        const raw = localStorage.getItem('user');
        if (raw) token = JSON.parse(raw)?.token ?? null;
      } catch {}
    }
    if (!token) {
      // no token: try to show cached username so user still sees the header
      const u = localStorage.getItem('username') || (() => { try { return JSON.parse(localStorage.getItem('user')||'{}')?.username; } catch { return null; } })();
      if (u && !cancelled) setMe({ id: 'me', username: u });
      return () => { cancelled = true; };
    }
    // Ensure Authorization header is present before calling API
    try { setAuthToken(token); } catch {}
    getMyInfo()
      .then((data) => { if (!cancelled) setMe(data); })
      .catch(() => {
        // fallback: use username from localStorage if API fails (e.g., CORS or token desync)
        const u = localStorage.getItem('username') || (() => { try { return JSON.parse(localStorage.getItem('user')||'{}')?.username; } catch { return null; } })();
        if (u && !cancelled) setMe({ id: 'me', username: u });
      });
    return () => { cancelled = true; };
  }, []);

<<<<<<< HEAD
  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await (keyword.trim() ? searchGames(keyword.trim()) : fetchGamesByPrice(order));
      setGames(data);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to search');
    } finally {
      setLoading(false);
    }
  };

  // states used by header and hover video controls
  const [unmute, setUnmute] = useState(false);
  // cart badge state must be declared BEFORE header uses it
  const [cartCount, setCartCount] = useState(0);
  // wishlist state (persisted in localStorage as 'wishlist_ids')
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('wishlist_ids')||'[]'); } catch { return []; }
  });
  const [showWishlist, setShowWishlist] = useState(false);
  const isWished = (id: string) => wishlist.includes(id);
  const toggleWish = (id: string) => {
    setWishlist((prev) => {
      const next = prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id];
      try { localStorage.setItem('wishlist_ids', JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const computeCartQty = () => {
    try {
      const raw = localStorage.getItem('demo_cart') || '[]';
      const arr = JSON.parse(raw) as { id: string; name: string; price: number; qty: number }[];
      return arr.reduce((s, it) => s + (Number(it.qty) || 0), 0);
    } catch { return 0; }
  };
  useEffect(() => { setCartCount(computeCartQty()); }, []);

  const header = useMemo(() => (
    <div className="steamNavbar">
      <div className="steamNavbarInner">
        <div className="brand">Devteria</div>
        <nav className="navLinks">
          <span className="navLink" onClick={()=>{ setShowWishlist(false); window.scrollTo({ top:0, behavior:'smooth' }); }}>Store</span>
          <span className="navLink" onClick={()=>{ setShowWishlist(true); window.scrollTo({ top:0, behavior:'smooth' }); }}>Wishlist</span>
          <div className="relativePos" ref={catRef}>
            <span className="navLink" role="button" onClick={(e)=>{ e.stopPropagation(); setCatOpen(v=>!v); }}>Categories ▾</span>
            {catOpen && (
            <div className="catMenu" role="menu" aria-label="Categories menu" onClick={(e)=> e.stopPropagation()}>
            <div role="menuitem" tabIndex={0} className="catBtn" onClick={()=>{ setSelectedCategory(null); setCatOpen(false); }}>All</div>
                  {(catShowAll ? categories : categories.slice(0,8)).map((c)=> (
                    <div key={c.name} role="menuitem" tabIndex={0} className="catBtn" onClick={()=>{ setSelectedCategory(c.name); setCatOpen(false); setShowWishlist(false); window.scrollTo({ top:0, behavior:'smooth' }); }}>{c.name}</div>
                  ))}
                {categories.length > 8 && !catShowAll && (
                  <div role="menuitem" tabIndex={0} className="catBtn viewAll" onClick={()=> setCatShowAll(true)}>View All…</div>
                )}
                {categories.length > 8 && catShowAll && (
                  <div role="menuitem" tabIndex={0} className="catBtn viewAll" onClick={()=> setCatShowAll(false)}>Collapse</div>
                )}
              </div>
            )}
          </div>
        </nav>
        <div className="searchRow">
          <form onSubmit={onSearch} className="searchForm">
            <input className="searchInput" placeholder="Search games..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            <select className="orderSelect" aria-label="Sort by price" value={order} onChange={(e) => setOrder(e.target.value as any)}>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
            <button className="searchBtn" type="submit">Search</button>
          </form>
          <button className="cartBtn" onClick={() => { window.location.href = '/checkout'; }} aria-label="cart">
            <span className="cartIcon">🛒</span>
            <span className="cartText">Cart</span>
            <span className="cartBadge">{cartCount}</span>
          </button>
          {(me || localStorage.getItem('username') || (()=>{ try { return JSON.parse(localStorage.getItem('user')||'{}')?.username; } catch { return null; } })()) ? (
            <div className="relativePos" ref={userRef}>
              <div className="userCompact" tabIndex={0} onClick={(e)=>{ e.stopPropagation(); setMenuOpen((v)=>!v); }} onKeyDown={(e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); e.stopPropagation(); setMenuOpen((v)=>!v); } }}>
                <img className="avatar" src={localStorage.getItem('avatarUrl') || '/assets/avatar-default.png'} alt="avatar" />
                <span className="userName">{me?.username || localStorage.getItem('username') || (()=>{ try { return JSON.parse(localStorage.getItem('user')||'{}')?.username; } catch { return ''; } })()}</span>
                <button className="userMenuBtn" onClick={(e) => { e.stopPropagation(); setMenuOpen((v)=>!v); }} aria-label="User menu">▾</button>
              </div>
              {menuOpen && (
                <div className="userMenu" role="menu" ref={menuRef} onClick={(e) => e.stopPropagation()}>
                  <button role="menuitem" onClick={() => { alert('View My Profile (coming soon)'); }}>View My Profile</button>
                  <button role="menuitem" onClick={() => { localStorage.removeItem('token'); setAuthToken(null as any); window.location.href = '/login'; }}>Change Account…</button>
                  <button role="menuitem" onClick={() => { localStorage.removeItem('token'); setAuthToken(null as any); window.location.href = '/login'; }}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <button className="searchBtn loginBtn" onClick={() => { window.location.href = '/login'; }}>Login</button>
          )}
        </div>
        {/* user compact rendered after the search form below */}
      </div>
    </div>
  ), [keyword, order, menuOpen, me, showWishlist, catOpen, categories, selectedCategory]);
=======
  const visibleCats = (categories || []).slice(0, catLimit);
  const canMoreCat = categories && categories.length > catLimit;

  // Hero carousel: top 8 games with highest discount
  const heroSlides = useMemo(() => (
    [...(games || [])]
      .filter(g => g.salePercent && g.salePercent > 0)
      .sort((a,b) => (b.salePercent || 0) - (a.salePercent || 0))
      .slice(0, 8)
  ), [games]);
  
  const [heroIndex, setHeroIndex] = useState(0);
  const hero = heroSlides[heroIndex] || games[0]; // Fallback to first game
  const heroTimer = useRef<number | null>(null);
  const AUTO_MS = 5200;

  function nextHero(){ 
    setHeroIndex(i => (i+1) % Math.max(1, (heroSlides || []).length)); 
  }
  
  function prevHero(){ 
    setHeroIndex(i => (i-1 + (heroSlides || []).length) % Math.max(1, (heroSlides || []).length)); 
  }
>>>>>>> origin/main

  // close user menu and category menu on outside click or on scroll
  useEffect(() => {
<<<<<<< HEAD
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedInsideMenu = menuRef.current?.contains(target);
      const clickedOnUser = userRef.current?.contains(target);
      const clickedOnCat = catRef.current?.contains(target);
      if (!clickedInsideMenu && !clickedOnUser) setMenuOpen(false);
      if (!clickedOnCat) setCatOpen(false);
=======
    if (!heroSlides || heroSlides.length === 0) return;
    
    function clear(){ 
      if(heroTimer.current) { 
        clearTimeout(heroTimer.current); 
        heroTimer.current = null; 
      } 
    }
    function schedule(){ 
      clear(); 
      heroTimer.current = window.setTimeout(() => nextHero(), AUTO_MS); 
    }
    
    if(document.visibilityState === 'visible') schedule();
    
    const vis = () => { 
      if(document.visibilityState === 'visible') schedule(); 
      else clear(); 
>>>>>>> origin/main
    };
    const onScroll = () => setMenuOpen(false);
    document.addEventListener('click', onDocClick);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('click', onDocClick);
      window.removeEventListener('scroll', onScroll);
    };
<<<<<<< HEAD
  }, []);

  const withMute = (url: string, muted: boolean) => url.replace(/mute=\d/, `mute=${muted ? 1 : 0}`);

  // helpers for cart/stock
  const getCartQtyFor = (id: string) => {
    try {
      const raw = localStorage.getItem('demo_cart') || '[]';
      const arr = JSON.parse(raw) as { id: string; qty: number }[];
      return arr.find((it) => it.id === id)?.qty || 0;
    } catch { return 0; }
  };
  const getAvailable = (g: Game) => Math.max(0, (Number(g.quantity) || 0) - getCartQtyFor(g.id));
  const getSalePct = (g: Game) => {
    // Prefer backend-provided salePercent
    const backendPct = (g as any).salePercent;
    if (typeof backendPct === 'number' && backendPct > 0) return Math.max(0, Math.min(100, backendPct));
    try {
      // demo: allow setting sale percent in localStorage under key `sale_<id>` or `sale_name_<lowercase>`
      const fromId = localStorage.getItem(`sale_${g.id}`);
      if (fromId) return Math.max(0, Math.min(100, Number(fromId)));
      const fromName = localStorage.getItem(`sale_name_${(g.name||'').toLowerCase()}`);
      if (fromName) return Math.max(0, Math.min(100, Number(fromName)));
    } catch {}
    // fallback: check categories for a tag like SALE_20
    const tag = (g as any).categories?.find((c:any)=>/^sale_\d{1,2}$/i.test(c.name || ''))?.name || '';
    if (tag) return Number(tag.split('_')[1]);
    return 0;
  };
  const getDiscounted = (g: Game) => {
    const pct = getSalePct(g);
    const price = Number(g.price) || 0;
    return pct > 0 ? Math.round(price * (100 - pct) / 100) : price;
  };

  // cartTick removed (was only used to force re-render). We update cartCount directly instead.

  const addToCart = (g: Game) => {
    try {
      const available = getAvailable(g);
      if (available <= 0) { alert('Out of stock'); return; }
      const qtyStr = prompt(`Add to Cart\n\n${g.name}\nIn stock: ${available}\nEnter quantity (1-${Math.min(99, available)}):`, '1');
      if (qtyStr === null) return; // user cancelled
      let qty = parseInt(qtyStr as string, 10);
      if (Number.isNaN(qty) || qty <= 0) qty = 1;
      if (qty > 99) qty = 99;
      if (qty > available) qty = available;
      const raw = localStorage.getItem('demo_cart') || '[]';
      const arr = JSON.parse(raw) as { id: string; name: string; price: number; qty: number; stock?: number; salePercent?: number }[];
      const idx = arr.findIndex(it => it.id === g.id);
      if (idx >= 0) {
        const max = arr[idx].stock ?? Number(g.quantity) ?? 0;
        arr[idx].qty = Math.min(max, arr[idx].qty + qty);
      } else {
        arr.push({ id: g.id, name: g.name, price: g.price as any, qty, stock: Number(g.quantity) || 0, salePercent: getSalePct(g) });
      }
      localStorage.setItem('demo_cart', JSON.stringify(arr));
      const totalLine = (g.price as any) * qty;
      // update cartCount so UI refreshes
      setCartCount(computeCartQty());
      if (confirm(`${g.name}  x${qty}\nAdded to cart (≈ ${totalLine.toLocaleString('vi-VN', { style:'currency', currency:'VND' })}).\n\nContinue shopping?\nChoose Cancel to view cart.`)) {
        // continue shopping -> stay
      } else {
        window.location.href = '/checkout';
      }
    } catch {}
  };
=======
  }, [heroIndex, heroSlides?.length]);

  // Game sections
  const featured = useMemo(() => (heroSlides || []).slice(0, 4), [heroSlides]);
  
  const bestSellers = useMemo(() => (
    [...(games || [])]
      .sort((a,b) => {
        const scoreA = (a.salePercent || 0) * 2 - (Number(a.price) || 0) / 1000;
        const scoreB = (b.salePercent || 0) * 2 - (Number(b.price) || 0) / 1000;
        return scoreB - scoreA;
      })
      .slice(0, 8)
  ), [games]);

  const deepDiscount = useMemo(() => (
    (games || []).filter(g => (g.salePercent || 0) >= 30)
      .sort((a,b) => (b.salePercent || 0) - (a.salePercent || 0))
      .slice(0, 8)
  ), [games]);

  const freeToPlay = useMemo(() => (
    (games || []).filter(g => Number(g.price) === 0).slice(0, 8)
  ), [games]);

  const newArrivals = useMemo(() => (
    [...(games || [])].slice(0, 8)
  ), [games]);
>>>>>>> origin/main

  const buyNow = (g: Game) => {
    const items = [{ id: g.id, name: g.name, price: g.price as any, qty: 1 }];
    localStorage.setItem('checkout_items', JSON.stringify(items));
    window.location.href = '/checkout';
  };

<<<<<<< HEAD
  // Featured (carousel) shows only the first 6 games; the rest go to Famous Game
  const filteredByCategory = selectedCategory ? games.filter(g => (g as any).categories?.some((c:any)=> c.name?.toLowerCase() === selectedCategory?.toLowerCase())) : games;
  const featuredGames = filteredByCategory.slice(0, 6);
  // moreGames removed (not used)
  const numSlides = Math.max(1, Math.ceil(featuredGames.length / 3));
  const slideIdxArray = Array.from({ length: numSlides }, (_, i) => i);

  // apply carousel transform via DOM to avoid inline style in JSX
  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${page * 100}%)`;
    }
  }, [page]);

  return (
    <div className="steamRoot">
      {header}
      {/* Hero video section (moved above featured) */}
      <section className="hero">
        <div className="heroInner">
          <div className="heroBanner">
            <iframe
              className="croppedFrame"
              src="https://www.youtube-nocookie.com/embed/LembwKDo1Dk?autoplay=1&mute=1&loop=1&playlist=LembwKDo1Dk&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&showinfo=0&fs=0"
              title="Video"
              allow="autoplay; encrypted-media"
=======
  if (loading && (!games || games.length === 0)) {
    return (
      <div className="home-model">
        <div className="hm-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải games...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && (!games || games.length === 0)) {
    return (
      <div className="home-model">
        <div className="hm-container">
          <div className="error-state-page">
            <div className="error-icon-wrapper">
              <svg className="error-icon-svg" width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
              </svg>
              <div className="error-glow"></div>
            </div>
            
            <h2>Không thể tải dữ liệu</h2>
            <p className="error-description">
              Rất tiếc, chúng tôi không thể kết nối đến máy chủ lúc này. 
              Vui lòng thử lại sau hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp diễn.
            </p>
            
            <div className="error-actions">
              <button 
                className="btn-retry primary"
                onClick={() => window.location.reload()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"/>
                </svg>
                Thử lại
              </button>
              <button 
                className="btn-retry secondary"
                onClick={() => navigate('/store')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/>
                </svg>
                Xem cửa hàng
              </button>
            </div>
            
            <div className="error-footer">
              <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="home-model">
      <div className="hm-container">
        <div className="hm-top">
          {/* Left Sidebar - Categories */}
          <aside className="hm-side-left">
            <div className="cat-head">Danh mục sản phẩm</div>
            <ul className="cat-nav">
              {(visibleCats || []).map(c => (
                <li key={c.id || c.name}>
                  <button 
                    type="button" 
                    onClick={() => navigate(`/store?category=${encodeURIComponent(c.name)}`)}
                  >
                    <span className="ic">{CATEGORY_ICONS[c.name] || '🎮'}</span>
                    <span className="label">{c.name}</span>
                  </button>
                </li>
              ))}
            </ul>
            {(canMoreCat || (categories && categories.length > 10)) && (
              <div className="cat-more">
                {canMoreCat ? (
                  <button className="link-more" onClick={() => setCatLimit(l => l + 8)}>
                    + Xem thêm
                  </button>
                ) : (
                  <button className="link-more" onClick={() => setCatLimit(10)}>
                    Thu gọn
                  </button>
                )}
              </div>
            )}
          </aside>

          {/* Center - Hero Carousel */}
          <section className="hm-hero" aria-label="Khuyến mãi nổi bật" ref={heroAreaRef}>
            {hero && (
              <div className="hero-slide">
                <Link to={`/game/${hero.id}`} className="hero-media" aria-label={hero.name}>
                  <img 
                    src={getGameImage(hero)} 
                    alt={hero.name} 
                    loading="lazy" 
                  />
                  <div className="hero-overlay">
                    <h1>{hero.name}</h1>
                    {hero.salePercent && hero.salePercent > 0 && (
                      <span className="disc-badge">-{hero.salePercent}%</span>
                    )}
                    <p className="hero-mini">Ưu đãi hấp dẫn – click để xem chi tiết.</p>
                    <div className="hero-price-line">
                      {Number(hero.price) === 0 ? (
                        <span className="free-tag">Miễn phí</span>
                      ) : hero.salePercent && hero.salePercent > 0 ? (
                        <>
                          <span className="old-price">{formatPrice(Number(hero.price), currency)}</span>
                          <span className="new-price">{formatPrice(getDiscountedPrice(hero), currency)}</span>
                        </>
                      ) : (
                        <span className="new-price solo">{formatPrice(Number(hero.price), currency)}</span>
                      )}
                    </div>
                  </div>
                </Link>
                {heroSlides && heroSlides.length > 1 && (
                  <>
                    <button className="hero-nav prev" onClick={prevHero} aria-label="Trước">
                      ‹
                    </button>
                    <button className="hero-nav next" onClick={nextHero} aria-label="Sau">
                      ›
                    </button>
                    <div className="hero-dots">
                      {(heroSlides || []).map((slide, i) => (
                        <button 
                          key={slide.id} 
                          className={i === heroIndex ? 'dot active' : 'dot'} 
                          aria-label={`Slide ${i+1}`} 
                          onClick={() => setHeroIndex(i)} 
                        />
                      ))}
                      <span className="hero-progress" aria-hidden="true" />
                    </div>
                  </>
                )}
              </div>
            )}
          </section>

          {/* Right Sidebar - Promo boxes */}
          <aside className="hm-side-right">
            <div className="promo-box gradient">
              <h3>Thủ thuật & Tin tức</h3>
              <p>Cập nhật nhanh xu hướng game.</p>
              <button className="btn-sm outline" onClick={() => navigate('/store')}>
                Xem ngay
              </button>
            </div>
            <div className="promo-box alt">
              <h3>Liên hệ hợp tác</h3>
              <p>Email: partner@example.com</p>
              <button className="btn-sm primary">Gửi</button>
            </div>
            <div className="promo-box soft">
              <h3>Thanh toán</h3>
              <p>Ví điện tử, Thẻ, COD</p>
            </div>
            <div className="promo-box video-box">
              <h3>Video nổi bật</h3>
              <div className="video-wrap">
                <iframe 
                  src={VIDEO_URL} 
                  title="Promo video"
                  allow="autoplay; encrypted-media"
                  className="promo-video"
                />
              </div>
              <p className="video-caption">Xem trailer & highlights.</p>
            </div>
          </aside>
        </div>

        {/* Section Navigation */}
        {sections.length > 0 && (
          <div className="section-nav">
            <ul>
              {(sections || []).map(s => (
                <li key={s.id}>
                  <a href={`#sec-${s.id}`}>{s.title}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Game Sections */}
        <div className="hm-sections">
          {error && <div className="error-state">{error}</div>}
          {(sections || []).map(s => (
            <SectionShelf 
              key={s.id} 
              id={`sec-${s.id}`} 
              title={s.title} 
              items={s.items} 
              currency={currency} 
>>>>>>> origin/main
            />
            <div className="heroOverlay">
              <div>
                <h1 className="heroTitle">AUTUMN SALE</h1>
                <p className="heroSubtitle">NOW THRU OCT 6TH @ 10 AM PT</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Big Carousel (moved below hero) */}
      <section className="featured">
        <div className="carousel">
          <div className="track" ref={trackRef}>
            {slideIdxArray.map((i) => (
              <div className="slide" key={i}>
                <div className="bigGrid">
                  {((showWishlist ? featuredGames.filter(g=>isWished(g.id)) : featuredGames).slice(i*3, i*3+3).length ? (showWishlist ? featuredGames.filter(g=>isWished(g.id)) : featuredGames).slice(i*3, i*3+3) : (showWishlist ? featuredGames.filter(g=>isWished(g.id)) : featuredGames).slice(0,3)).map((g, idx) => (
                    <article key={`${g.id}-${idx}`} className="bigCard">
                      <button className="wishBtn" data-pressed={isWished(g.id) ? 'true' : 'false'} title={isWished(g.id)?'Remove from wishlist':'Add to wishlist'} onClick={(e)=>{ e.stopPropagation(); toggleWish(g.id); }}>{isWished(g.id) ? '★' : '☆'}</button>
                      <div className="bigThumb" onMouseEnter={() => { 
                        const name = g.name?.toLowerCase() || '';
                        if (name.includes('phasmophobia')) setPlayPhasmo(true);
                        if (name.includes('repo')) setPlayRepo(true);
                        if (name.includes('peak')) setPlayPeak(true);
                        if (name.includes('palworld') || name.includes('palword')) setPlayPal(true);
                        if (name.includes('call of duty') || name.includes('call of duty black ops 6') || name.includes('cod')) setPlayCod(true);
                        if (name.includes('rematch')) setPlayRematch(true);
                        if (name.includes('cuphead')) setPlayCup(true);
                      }} onMouseLeave={() => { setPlayPhasmo(false); setPlayRepo(false); setPlayPeak(false); setPlayPal(false); setPlayCod(false); setPlayRematch(false); setPlayCup(false); setUnmute(false); }}>
                        {g.name?.toLowerCase().includes('phasmophobia') ? (
                          <>
                            {!playPhasmo && (
                              <img
                                src={phasmoBase}
                                alt="phasmophobia"
                                onError={(e)=>{
                                  const img = e.currentTarget as HTMLImageElement;
                                  if (!(img as any).dataset.triedPng) {
                                    (img as any).dataset.triedPng = '1';
                                    img.src = (typeof window !== 'undefined' && localStorage.getItem('phasmophobiaUrlPng')) || `${import.meta.env.BASE_URL}assets/phasmophobia.png`;
                                  } else {
                                    img.style.display='none';
                                  }
                                }}
                              />
                            )}
                            {playPhasmo && (
                              <>
                                <iframe className="cardVideo" src={`${withMute(phasmoEmbed, !unmute)}&controls=0&modestbranding=1&rel=0`} title="Phasmophobia Trailer" allow="autoplay; encrypted-media" />
                                {!unmute && (<button className="unmuteBtn" onClick={(e)=>{ e.stopPropagation(); setUnmute(true); }}>🔊</button>)}
                              </>
                            )}
                          </>
                        ) : g.name?.toLowerCase().includes('repo') ? (
                          <>
                            {!playRepo && (
                              <img
                                src={repoBase}
                                alt="repo"
                                onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                              />
                            )}
                            {playRepo && (
                              <>
                                <iframe className="cardVideo" src={withMute(repoEmbed, !unmute)} title="Repo Trailer" allow="autoplay; encrypted-media" />
                                {!unmute && (<button className="unmuteBtn" onClick={(e)=>{ e.stopPropagation(); setUnmute(true); }}>🔊</button>)}
                              </>
                            )}
                          </>
                        ) : g.name?.toLowerCase().includes('peak') ? (
                          <>
                            {!playPeak && (
                              <img
                                src={peakBase}
                                alt="peak"
                                onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                              />
                            )}
                            {playPeak && (
                              <>
                                <iframe className="cardVideo" src={withMute(peakEmbed, !unmute)} title="Peak Trailer" allow="autoplay; encrypted-media" />
                                {!unmute && (<button className="unmuteBtn" onClick={(e)=>{ e.stopPropagation(); setUnmute(true); }}>🔊</button>)}
                              </>
                            )}
                          </>
                        ) : (g.name?.toLowerCase().includes('palworld') || g.name?.toLowerCase().includes('palword')) ? (
                          <>
                            {!playPal && (
                              <img
                                src={palworldBase}
                                alt="palworld"
                                onError={(e)=>{
                                  const img = e.currentTarget as HTMLImageElement;
                                  const tried = (img as any).dataset.triedAlt || '';
                                  if (!tried.includes('webp')) {
                                    (img as any).dataset.triedAlt = (tried + ' webp').trim();
                                    img.src = palworldBase.replace(/\.[a-zA-Z0-9]+$/, '.webp');
                                  } else if (!tried.includes('png')) {
                                    (img as any).dataset.triedAlt = (tried + ' png').trim();
                                    img.src = palworldBase.replace(/\.[a-zA-Z0-9]+$/, '.png');
                                  } else {
                                    img.style.display='none';
                                  }
                                }}
                              />
                            )}
                            {playPal && (
                              <>
                                <iframe className="cardVideo" src={withMute(palworldEmbed, !unmute)} title="Palworld Trailer" allow="autoplay; encrypted-media" />
                                {!unmute && (<button className="unmuteBtn" onClick={(e)=>{ e.stopPropagation(); setUnmute(true); }}>🔊</button>)}
                              </>
                            )}
                          </>
                        ) : (g.name?.toLowerCase().includes('call of duty') || g.name?.toLowerCase().includes('call of duty black ops 6') || g.name?.toLowerCase().includes('cod')) ? (
                          <>
                            {!playCod && (
                              <img
                                src={codBase}
                                alt="call of duty"
                                onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                              />
                            )}
                            {playCod && (
                              <>
                                <iframe className="cardVideo" src={withMute(codEmbed, !unmute)} title="COD Trailer" allow="autoplay; encrypted-media" />
                                {!unmute && (<button className="unmuteBtn" onClick={(e)=>{ e.stopPropagation(); setUnmute(true); }}>🔊</button>)}
                              </>
                            )}
                          </>
                        ) : g.name?.toLowerCase().includes('rematch') ? (
                          <>
                            {!playRematch && (
                              <img
                                src={rematchBase}
                                alt="rematch"
                                onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                              />
                            )}
                            {playRematch && (
                              <>
                                <iframe className="cardVideo" src={withMute(rematchEmbed, !unmute)} title="Rematch Trailer" allow="autoplay; encrypted-media" />
                                {!unmute && (<button className="unmuteBtn" onClick={(e)=>{ e.stopPropagation(); setUnmute(true); }}>🔊</button>)}
                              </>
                            )}
                          </>
                        ) : g.name?.toLowerCase().includes('cuphead') ? (
                          <>
                            {!playCup && (
                              <img
                                src={cupheadLocal}
                                alt="cuphead"
                                onError={(e)=>{
                                  const img = e.currentTarget as HTMLImageElement;
                                  const tried = (img as any).dataset.triedAlt || '';
                                  if (!tried.includes('ext')) {
                                    (img as any).dataset.triedAlt = (tried + ' ext').trim();
                                    img.src = cupheadBase;
                                  } else {
                                    img.style.display='none';
                                  }
                                }}
                              />
                            )}
                            {playCup && (
                              <>
                                <iframe className="cardVideo" src={withMute(cupheadEmbed, !unmute)} title="Cuphead Trailer" allow="autoplay; encrypted-media" />
                                {!unmute && (<button className="unmuteBtn" onClick={(e)=>{ e.stopPropagation(); setUnmute(true); }}>🔊</button>)}
                              </>
                            )}
                          </>
                        ) : (
                          <span>{g.name?.slice(0,1) || 'G'}</span>
                        )}
                      </div>
                      <div className="bigInfo">
                        <div className="gameName gameName16">{g.name}</div>
                        <div className="bigMeta">
                          {(g as any).categories?.map((c:any) => (<span key={c.name} className="tag">{c.name}</span>))
                            || getTags(g.name).map(t => (<span key={t} className="tag">{t}</span>))}
                        </div>
                        <div className="priceRow">
                          <div>
                            {getSalePct(g) > 0 ? (
                              <>
                                <div className="bigPrice">{getDiscounted(g).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} <span className="saleBadge">-{getSalePct(g)}%</span></div>
                                <div className="oldPrice">{g.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                              </>
                            ) : (
                              <div className="bigPrice">{g.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                            )}
                            <div className="stock">In stock: {Number(g.quantity) || 0}</div>
                          </div>
                          <div className="actions">
                            <button className="btn add" onClick={() => addToCart(g)}>Add to Cart</button>
                            <button className="btn buy" onClick={() => buyNow(g)}>Buy Now</button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="navBtn navLeft" onClick={() => setPage((p) => Math.max(0, p-1))}>{'<'}</button>
          <button className="navBtn navRight" onClick={() => setPage((p) => Math.min(numSlides-1, p+1))}>{'>'}</button>
        </div>
      </section>
      <main className="content">
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
        <h3 className="sectionTitle">{showWishlist ? 'Your Wishlist' : 'Famous Game'}</h3>
        <div className="gridRow">
          {((showWishlist ? games.filter(g=>isWished(g.id)) : games).slice(0,4)).map((g) => (
            <article key={g.id} className="card">
              <button className="wishBtn small" data-pressed={isWished(g.id) ? 'true' : 'false'} title={isWished(g.id)?'Remove from wishlist':'Add to wishlist'} onClick={(e)=>{ e.stopPropagation(); toggleWish(g.id); }}>{isWished(g.id) ? '★' : '☆'}</button>
              <div className="thumb" onMouseEnter={() => { 
                const name = g.name?.toLowerCase() || '';
                if (name.includes('phasmophobia')) setPlayPhasmo(true);
                if (name.includes('repo')) setPlayRepo(true);
                if (name.includes('peak')) setPlayPeak(true);
                if (name.includes('palworld') || name.includes('palword')) setPlayPal(true);
                if (name.includes('call of duty') || name.includes('call of duty black ops 6') || name.includes('cod')) setPlayCod(true);
                if (name.includes('rematch')) setPlayRematch(true);
                if (name.includes('cuphead')) setPlayCup(true);
                if (name.includes('v rising') || name.includes('v-rising') || name.includes('vrising')) setPlayVRising(true);
              }} onMouseLeave={() => { setPlayPhasmo(false); setPlayRepo(false); setPlayPeak(false); setPlayPal(false); setPlayCod(false); setPlayRematch(false); setPlayCup(false); setPlayVRising(false); }}>
                {g.name?.toLowerCase().includes('phasmophobia') ? (
                  <>
                    {!playPhasmo && (
                      <img
                        src={phasmoBase}
                        alt="phasmophobia"
                        onError={(e)=>{
                          const img = e.currentTarget as HTMLImageElement;
                          if (!(img as any).dataset.triedPng) {
                            (img as any).dataset.triedPng = '1';
                            img.src = (typeof window !== 'undefined' && localStorage.getItem('phasmophobiaUrlPng')) || `${import.meta.env.BASE_URL}assets/phasmophobia.png`;
                          } else {
                            img.style.display='none';
                          }
                        }}
                      />
                    )}
                    {playPhasmo && (
                      <iframe className="cardVideo" src={`${withMute(phasmoEmbed, false)}&controls=0&modestbranding=1&rel=0`} title="Phasmophobia Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : g.name?.toLowerCase().includes('repo') ? (
                  <>
                    {!playRepo && (
                      <img
                        src={repoBase}
                        alt="repo"
                        onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                      />
                    )}
                    {playRepo && (
                      <iframe className="cardVideo" src={withMute(repoEmbed, false)} title="Repo Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : g.name?.toLowerCase().includes('cuphead') ? (
                  <>
                    {!playCup && (
                      <img
                        src={cupheadLocal}
                        alt="cuphead"
                        onError={(e)=>{
                          const img = e.currentTarget as HTMLImageElement;
                          const tried = (img as any).dataset.triedAlt || '';
                          if (!tried.includes('ext')) {
                            (img as any).dataset.triedAlt = (tried + ' ext').trim();
                            img.src = cupheadBase;
                          } else {
                            img.style.display='none';
                          }
                        }}
                      />
                    )}
                    {playCup && (
                      <iframe className="cardVideo" src={withMute(cupheadEmbed, false)} title="Cuphead Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : g.name?.toLowerCase().includes('peak') ? (
                  <>
                    {!playPeak && (
                      <img
                        src={peakBase}
                        alt="peak"
                        onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                      />
                    )}
                    {playPeak && (
                      <iframe className="cardVideo" src={withMute(peakEmbed, false)} title="Peak Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : (g.name?.toLowerCase().includes('palworld') || g.name?.toLowerCase().includes('palword')) ? (
                  <>
                    {!playPal && (
                      <img
                        src={palworldBase}
                        alt="palworld"
                        onError={(e)=>{
                          const img = e.currentTarget as HTMLImageElement;
                          const tried = (img as any).dataset.triedAlt || '';
                          if (!tried.includes('webp')) {
                            (img as any).dataset.triedAlt = (tried + ' webp').trim();
                            img.src = palworldBase.replace(/\.[a-zA-Z0-9]+$/, '.webp');
                          } else if (!tried.includes('png')) {
                            (img as any).dataset.triedAlt = (tried + ' png').trim();
                            img.src = palworldBase.replace(/\.[a-zA-Z0-9]+$/, '.png');
                          } else {
                            img.style.display='none';
                          }
                        }}
                      />
                    )}
                    {playPal && (
                      <iframe className="cardVideo" src={withMute(palworldEmbed, false)} title="Palworld Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : (g.name?.toLowerCase().includes('call of duty') || g.name?.toLowerCase().includes('call of duty black ops 6') || g.name?.toLowerCase().includes('cod')) ? (
                  <>
                    {!playCod && (
                      <img
                        src={codBase}
                        alt="call of duty"
                        onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                      />
                    )}
                    {playCod && (
                      <iframe className="cardVideo" src={withMute(codEmbed, false)} title="COD Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : g.name?.toLowerCase().includes('rematch') ? (
                  <>
                    {!playRematch && (
                      <img
                        src={rematchBase}
                        alt="rematch"
                        onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                      />
                    )}
                    {playRematch && (
                      <iframe className="cardVideo" src={withMute(rematchEmbed, false)} title="Rematch Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : (g.name?.toLowerCase().includes('v rising') || g.name?.toLowerCase().includes('v-rising') || g.name?.toLowerCase().includes('vrising')) ? (
                  <>
                    {!playVRising && (
                      <img
                        src={vRisingBase}
                        alt="v rising"
                        onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                      />
                    )}
                    {playVRising && (
                      <iframe className="cardVideo" src={withMute(vRisingEmbed, false)} title="V Rising Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : (
                  <div className="thumbInner">{g.name?.slice(0, 1) || 'G'}</div>
                )}
              </div>
              <div className="cardBody">
                <div className="gameName">{g.name}</div>
                <div className="tagInline">{getTags(g.name).map(t => (<span key={t} className="tag">{t}</span>))}</div>
                <div className="priceRow">
                  <div>
                    {getSalePct(g) > 0 ? (
                      <>
                        <div className="price">{getDiscounted(g).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} <span className="saleBadge">-{getSalePct(g)}%</span></div>
                        <div className="oldPrice">{g.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                      </>
                    ) : (
                      <div className="price">{g.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                    )}
                    <div className="stock">In stock: {Number(g.quantity) || 0}</div>
                  </div>
                  <div className="actions">
                    <button className="btn add" onClick={() => addToCart(g)}>Add to Cart</button>
                    <button className="btn buy" onClick={() => buyNow(g)}>Buy Now</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
<<<<<<< HEAD
        <div className="gridRow">
          {((showWishlist ? games.filter(g=>isWished(g.id)) : games).slice(4,8)).map((g) => (
            <article key={g.id} className="card">
              <button className="wishBtn small" data-pressed={isWished(g.id) ? 'true' : 'false'} title={isWished(g.id)?'Remove from wishlist':'Add to wishlist'} onClick={(e)=>{ e.stopPropagation(); toggleWish(g.id); }}>{isWished(g.id) ? '★' : '☆'}</button>
              <div className="thumb" onMouseEnter={() => { 
                const name = g.name?.toLowerCase() || '';
                if (name.includes('phasmophobia')) setPlayPhasmo(true);
                if (name.includes('repo')) setPlayRepo(true);
                if (name.includes('peak')) setPlayPeak(true);
                if (name.includes('palworld') || name.includes('palword')) setPlayPal(true);
                if (name.includes('call of duty') || name.includes('call of duty black ops 6') || name.includes('cod')) setPlayCod(true);
                if (name.includes('rematch')) setPlayRematch(true);
                if (name.includes('cuphead')) setPlayCup(true);
                if (name.includes('v rising') || name.includes('v-rising') || name.includes('vrising')) setPlayVRising(true);
              }} onMouseLeave={() => { setPlayPhasmo(false); setPlayRepo(false); setPlayPeak(false); setPlayPal(false); setPlayCod(false); setPlayRematch(false); setPlayCup(false); setPlayVRising(false); }}>
                {g.name?.toLowerCase().includes('phasmophobia') ? (
                  <>
                    {!playPhasmo && (
                      <img
                        src={phasmoBase}
                        alt="phasmophobia"
                        onError={(e)=>{
                          const img = e.currentTarget as HTMLImageElement;
                          if (!(img as any).dataset.triedPng) {
                            (img as any).dataset.triedPng = '1';
                            img.src = (typeof window !== 'undefined' && localStorage.getItem('phasmophobiaUrlPng')) || `${import.meta.env.BASE_URL}assets/phasmophobia.png`;
                          } else {
                            img.style.display='none';
                          }
                        }}
                      />
                    )}
                    {playPhasmo && (
                      <iframe className="cardVideo" src={`${phasmoEmbed}&controls=0&modestbranding=1&rel=0`} title="Phasmophobia Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : g.name?.toLowerCase().includes('repo') ? (
                  <>
                    {!playRepo && (
                      <img
                        src={repoBase}
                        alt="repo"
                        onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                      />
                    )}
                    {playRepo && (
                      <iframe className="cardVideo" src={repoEmbed} title="Repo Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : g.name?.toLowerCase().includes('peak') ? (
                  <>
                    {!playPeak && (
                      <img
                        src={peakBase}
                        alt="peak"
                        onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                      />
                    )}
                    {playPeak && (
                      <iframe className="cardVideo" src={peakEmbed} title="Peak Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : (g.name?.toLowerCase().includes('palworld') || g.name?.toLowerCase().includes('palword')) ? (
                  <>
                    {!playPal && (
                      <img
                        src={palworldBase}
                        alt="palworld"
                        onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                      />
                    )}
                    {playPal && (
                      <iframe className="cardVideo" src={palworldEmbed} title="Palworld Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : (g.name?.toLowerCase().includes('call of duty') || g.name?.toLowerCase().includes('call of duty black ops 6') || g.name?.toLowerCase().includes('cod')) ? (
                  <>
                    {!playCod && (
                      <img
                        src={codBase}
                        alt="call of duty"
                        onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                      />
                    )}
                    {playCod && (
                      <iframe className="cardVideo" src={codEmbed} title="COD Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : g.name?.toLowerCase().includes('rematch') ? (
                  <>
                    {!playRematch && (
                      <img
                        src={rematchBase}
                        alt="rematch"
                        onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                      />
                    )}
                    {playRematch && (
                      <iframe className="cardVideo" src={withMute(rematchEmbed, false)} title="Rematch Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : g.name?.toLowerCase().includes('cuphead') ? (
                  <>
                    {!playCup && (
                      <img
                        src={cupheadLocal}
                        alt="cuphead"
                        onError={(e)=>{
                          const img = e.currentTarget as HTMLImageElement;
                          const tried = (img as any).dataset.triedAlt || '';
                          if (!tried.includes('ext')) {
                            (img as any).dataset.triedAlt = (tried + ' ext').trim();
                            img.src = cupheadBase;
                          } else {
                            img.style.display='none';
                          }
                        }}
                      />
                    )}
                    {playCup && (
                      <iframe className="cardVideo" src={withMute(cupheadEmbed, false)} title="Cuphead Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : (g.name?.toLowerCase().includes('v rising') || g.name?.toLowerCase().includes('v-rising') || g.name?.toLowerCase().includes('vrising')) ? (
                  <>
                    {!playVRising && (
                      <img
                        src={vRisingBase}
                        alt="v rising"
                        onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                      />
                    )}
                    {playVRising && (
                      <iframe className="cardVideo" src={withMute(vRisingEmbed, false)} title="V Rising Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : (
                  <div className="thumbInner">{g.name?.slice(0, 1) || 'G'}</div>
                )}
              </div>
              <div className="cardBody">
                <div className="gameName">{g.name}</div>
                <div className="tagInline">{((g as any).categories?.map((c:any)=>c.name) || getTags(g.name)).map((t:string)=> (<span key={t} className="tag">{t}</span>))}</div>
                <div className="priceRow">
                  <div>
                    {getSalePct(g) > 0 ? (
                      <>
                        <div className="price">{getDiscounted(g).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} <span className="saleBadge">-{getSalePct(g)}%</span></div>
                        <div className="oldPrice">{g.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                      </>
                    ) : (
                      <div className="price">{g.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                    )}
                    <div className="stock">In stock: {Number(g.quantity) || 0}</div>
                  </div>
                  <div className="actions">
                    <button className="btn add" onClick={() => addToCart(g)}>Add to Cart</button>
                    <button className="btn buy" onClick={() => buyNow(g)}>Buy Now</button>
                  </div>
=======
      </div>
    </main>
  );
}

// Section Shelf Component
interface SectionShelfProps {
  id: string;
  title: string;
  items: Game[];
  currency: string;
}

function SectionShelf({ title, items, id, currency }: SectionShelfProps){
  return (
    <section className="shelf" id={id}>
      <header className="shelf-head">
        <h2>{title}</h2>
        <Link to="/store" className="link-more">Xem tất cả →</Link>
      </header>
      <div className="shelf-grid">
        {(items || []).map((g) => {
          const hasDiscount = g.salePercent && g.salePercent > 0;
          const finalPrice = getDiscountedPrice(g);
          const percent = g.salePercent || 0;
          const free = Number(g.price) === 0;
          
          return (
            <Link
              key={g.id}
              to={`/game/${g.id}`}
              className="shelf-item"
              title={g.name}
            >
              <div className="si-media">
                <img 
                  src={getGameImage(g)} 
                  alt={g.name} 
                  loading="lazy" 
                />
                {hasDiscount && <span className="si-badge disc">-{percent}%</span>}
              </div>
              <div className="si-body">
                <span className="si-title">{g.name}</span>
                
                {/* Rating */}
                {g.averageRating && g.averageRating > 0 && (
                  <div className="si-rating">
                    {renderStars(g.averageRating, g.ratingCount)}
                  </div>
                )}
                
                <div className="si-meta">
                  <span className="genres">
                    {g.categories && g.categories.length > 0 
                      ? (g.categories || []).slice(0, 2).map(c => c.name).join(', ')
                      : 'Game'}
                  </span>
                  {g.releaseDate && (
                    <>
                      <span className="meta-sep">•</span>
                      <span className="release-date">{formatReleaseDate(g.releaseDate)}</span>
                    </>
                  )}
                </div>
                
                <div className="si-price-row">
                  {free ? (
                    <span className="free-tag">Miễn phí</span>
                  ) : hasDiscount ? (
                    <>
                      <span className="old">{formatPrice(Number(g.price), currency)}</span>
                      <span className="final">{formatPrice(finalPrice, currency)}</span>
                    </>
                  ) : (
                    <span className="final solo">{formatPrice(Number(g.price), currency)}</span>
                  )}
>>>>>>> origin/main
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="gridRow">
          {((showWishlist ? games.filter(g=>isWished(g.id)) : games).slice(8,12)).map((g) => (
            <article key={g.id} className="card">
              <button className="wishBtn small" data-pressed={isWished(g.id) ? 'true' : 'false'} title={isWished(g.id)?'Remove from wishlist':'Add to wishlist'} onClick={(e)=>{ e.stopPropagation(); toggleWish(g.id); }}>{isWished(g.id) ? '★' : '☆'}</button>
              <div className="thumb" onMouseEnter={() => { 
                const name = g.name?.toLowerCase() || '';
                if (name.includes('phasmophobia')) setPlayPhasmo(true);
                if (name.includes('repo')) setPlayRepo(true);
                if (name.includes('peak')) setPlayPeak(true);
                if (name.includes('palworld') || name.includes('palword')) setPlayPal(true);
                if (name.includes('call of duty') || name.includes('call of duty black ops 6') || name.includes('cod')) setPlayCod(true);
                if (name.includes('cuphead')) setPlayCup(true);
              }} onMouseLeave={() => { setPlayPhasmo(false); setPlayRepo(false); setPlayPeak(false); setPlayPal(false); setPlayCod(false); }}>
                {g.name?.toLowerCase().includes('phasmophobia') ? (
                  <>
                    {!playPhasmo && (
                      <img
                        src={phasmoBase}
                        alt="phasmophobia"
                        onError={(e)=>{
                          const img = e.currentTarget as HTMLImageElement;
                          if (!(img as any).dataset.triedPng) {
                            (img as any).dataset.triedPng = '1';
                            img.src = (typeof window !== 'undefined' && localStorage.getItem('phasmophobiaUrlPng')) || `${import.meta.env.BASE_URL}assets/phasmophobia.png`;
                          } else {
                            img.style.display='none';
                          }
                        }}
                      />
                    )}
                    {playPhasmo && (
                      <iframe className="cardVideo" src={`${phasmoEmbed}&controls=0&modestbranding=1&rel=0`} title="Phasmophobia Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : g.name?.toLowerCase().includes('repo') ? (
                  <>
                    {!playRepo && (
                      <img
                        src={repoBase}
                        alt="repo"
                        onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                      />
                    )}
                    {playRepo && (
                      <iframe className="cardVideo" src={repoEmbed} title="Repo Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : g.name?.toLowerCase().includes('repo') ? (
                  <img
                    src={repoBase}
                    alt="repo"
                    onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                  />
                ) : g.name?.toLowerCase().includes('peak') ? (
                  <>
                    {!playPeak && (
                      <img
                        src={peakBase}
                        alt="peak"
                        onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                      />
                    )}
                    {playPeak && (
                      <iframe className="cardVideo" src={peakEmbed} title="Peak Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : (g.name?.toLowerCase().includes('palworld') || g.name?.toLowerCase().includes('palword')) ? (
                  <>
                    {!playPal && (
                      <img
                        src={palworldBase}
                        alt="palworld"
                        onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                      />
                    )}
                    {playPal && (
                      <iframe className="cardVideo" src={palworldEmbed} title="Palworld Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : (g.name?.toLowerCase().includes('call of duty') || g.name?.toLowerCase().includes('call of duty black ops 6') || g.name?.toLowerCase().includes('cod')) ? (
                  <>
                    {!playCod && (
                      <img
                        src={codBase}
                        alt="call of duty"
                        onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                      />
                    )}
                    {playCod && (
                      <iframe className="cardVideo" src={codEmbed} title="COD Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : g.name?.toLowerCase().includes('cuphead') ? (
                  <>
                    {!playCup && (
                      <img
                        src={cupheadBase}
                        alt="cuphead"
                        onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                      />
                    )}
                    {playCup && (
                      <iframe className="cardVideo" src={cupheadEmbed} title="Cuphead Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : (
                  <div className="thumbInner">{g.name?.slice(0, 1) || 'G'}</div>
                )}
              </div>
              <div className="cardBody">
                <div className="gameName">{g.name}</div>
                <div className="priceRow">
                  <div>
                    <div className="price">{g.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                    <div className="stock">In stock: {Number(g.quantity) || 0}</div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="gridRow">
          {(games.slice(8,12)).map((g) => (
            <article key={g.id} className="card">
              <div className="thumb" onMouseEnter={() => { 
                const name = g.name?.toLowerCase() || '';
                if (name.includes('phasmophobia')) setPlayPhasmo(true);
                if (name.includes('repo')) setPlayRepo(true);
                if (name.includes('peak')) setPlayPeak(true);
                if (name.includes('palworld') || name.includes('palword')) setPlayPal(true);
                if (name.includes('call of duty') || name.includes('call of duty black ops 6') || name.includes('cod')) setPlayCod(true);
                if (name.includes('v rising') || name.includes('v-rising') || name.includes('vrising')) setPlayVRising(true);
              }} onMouseLeave={() => { setPlayPhasmo(false); setPlayRepo(false); setPlayPeak(false); setPlayPal(false); setPlayCod(false); }}>
                {g.name?.toLowerCase().includes('phasmophobia') ? (
                  <>
                    {!playPhasmo && (
                      <img
                        src={phasmoBase}
                        alt="phasmophobia"
                        onError={(e)=>{
                          const img = e.currentTarget as HTMLImageElement;
                          if (!(img as any).dataset.triedPng) {
                            (img as any).dataset.triedPng = '1';
                            img.src = (typeof window !== 'undefined' && localStorage.getItem('phasmophobiaUrlPng')) || `${import.meta.env.BASE_URL}assets/phasmophobia.png`;
                          } else {
                            img.style.display='none';
                          }
                        }}
                      />
                    )}
                    {playPhasmo && (
                      <iframe className="cardVideo" src={`${phasmoEmbed}&controls=0&modestbranding=1&rel=0`} title="Phasmophobia Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : g.name?.toLowerCase().includes('repo') ? (
                  <>
                    {!playRepo && (
                      <img
                        src={repoBase}
                        alt="repo"
                        onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                      />
                    )}
                    {playRepo && (
                      <iframe className="cardVideo" src={repoEmbed} title="Repo Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : g.name?.toLowerCase().includes('peak') ? (
                  <>
                    {!playPeak && (
                      <img
                        src={peakBase}
                        alt="peak"
                        onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                      />
                    )}
                    {playPeak && (
                      <iframe className="cardVideo" src={peakEmbed} title="Peak Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : (g.name?.toLowerCase().includes('palworld') || g.name?.toLowerCase().includes('palword')) ? (
                  <>
                    {!playPal && (
                      <img
                        src={palworldBase}
                        alt="palworld"
                        onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                      />
                    )}
                    {playPal && (
                      <iframe className="cardVideo" src={palworldEmbed} title="Palworld Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : (g.name?.toLowerCase().includes('call of duty') || g.name?.toLowerCase().includes('call of duty black ops 6') || g.name?.toLowerCase().includes('cod')) ? (
                  <>
                    {!playCod && (
                      <img
                        src={codBase}
                        alt="call of duty"
                        onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                      />
                    )}
                    {playCod && (
                      <iframe className="cardVideo" src={codEmbed} title="COD Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : g.name?.toLowerCase().includes('cuphead') ? (
                  <>
                    {!playCup && (
                      <img
                        src={cupheadBase}
                        alt="cuphead"
                        onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                      />
                    )}
                    {playCup && (
                      <iframe className="cardVideo" src={cupheadEmbed} title="Cuphead Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : (g.name?.toLowerCase().includes('v rising') || g.name?.toLowerCase().includes('v-rising') || g.name?.toLowerCase().includes('vrising')) ? (
                  <>
                    {!playVRising && (
                      <img
                        src={vRisingBase}
                        alt="v rising"
                        onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}
                      />
                    )}
                    {playVRising && (
                      <iframe className="cardVideo" src={vRisingEmbed} title="V Rising Trailer" allow="autoplay; encrypted-media" />
                    )}
                  </>
                ) : (
                  <div className="thumbInner">{g.name?.slice(0, 1) || 'G'}</div>
                )}
              </div>
              <div className="cardBody">
                <div className="gameName">{g.name}</div>
                <div className="priceRow">
                  <div>
                {getSalePct(g) > 0 ? (
                  <>
                    <div className="price">{getDiscounted(g).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} <span className="saleBadge">-{getSalePct(g)}%</span></div>
                    <div className="oldPrice">{g.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                  </>
                ) : (
                <div className="price">{g.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                )}
                    <div className="stock">In stock: {Number(g.quantity) || 0}</div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}



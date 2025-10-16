import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchGamesByPrice, fetchCategories, Game, Category } from '../api/client';
import { useCurrency } from '../context/CurrencyContext';
import './HomePage.css';

// Category icons
const CATEGORY_ICONS: Record<string, string> = {
  Action:'🎯', Adventure:'🗺️', Strategy:'♟️', RPG:'🧙', Sports:'⚽', 
  Racing:'🏎️', Simulation:'🛠️', Horror:'👻', Puzzle:'🧩', Shooter:'🔫'
};

// Video URL
const VIDEO_URL = 'https://www.youtube-nocookie.com/embed/LembwKDo1Dk?autoplay=1&mute=1&loop=1&playlist=LembwKDo1Dk&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&showinfo=0&fs=0';

// Placeholder images for games (you can replace with real images from backend)
const GAME_PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=450&fit=crop',
];

function getGameImage(gameName: string, index: number): string {
  // Return placeholder based on game name hash
  const hash = gameName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return GAME_PLACEHOLDERS[hash % GAME_PLACEHOLDERS.length];
}

function formatPrice(price: number, currency: string = 'VND'): string {
  if (currency === 'USD') {
    return `$${(price / 25000).toFixed(2)}`;
  }
  return `${price.toLocaleString('vi-VN')}₫`;
}

function getDiscountedPrice(game: Game): number {
  const price = Number(game.price) || 0;
  const salePercent = (game.salePercent) || 0;
  if (salePercent > 0) {
    return Math.round(price * (100 - salePercent) / 100);
  }
  return price;
}

export function HomePage(){
  const { currency } = useCurrency();
  const navigate = useNavigate();
  
  // State
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [catLimit, setCatLimit] = useState(10);

  // Load games
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchGamesByPrice('asc')
      .then((data) => {
        if (!cancelled) setGames(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message ?? 'Failed to load games');
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  // Load categories
  useEffect(() => {
    let cancelled = false;
    fetchCategories()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const visibleCats = categories.slice(0, catLimit);
  const canMoreCat = categories.length > catLimit;

  // Hero carousel: top 8 games with highest discount
  const heroSlides = useMemo(() => (
    [...games]
      .filter(g => g.salePercent && g.salePercent > 0)
      .sort((a,b) => (b.salePercent || 0) - (a.salePercent || 0))
      .slice(0, 8)
  ), [games]);
  
  const [heroIndex, setHeroIndex] = useState(0);
  const hero = heroSlides[heroIndex] || games[0]; // Fallback to first game
  const heroTimer = useRef<number | null>(null);
  const AUTO_MS = 5200;

  function nextHero(){ 
    setHeroIndex(i => (i+1) % Math.max(1, heroSlides.length)); 
  }
  
  function prevHero(){ 
    setHeroIndex(i => (i-1 + heroSlides.length) % Math.max(1, heroSlides.length)); 
  }

  // Autoplay with pause on hover
  const heroAreaRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (heroSlides.length === 0) return;
    
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
    };
    document.addEventListener('visibilitychange', vis);
    
    const area = heroAreaRef.current;
    const pause = () => clear();
    const resume = () => schedule();
    area?.addEventListener('mouseenter', pause);
    area?.addEventListener('mouseleave', resume);
    
    return () => {
      clear();
      document.removeEventListener('visibilitychange', vis);
      area?.removeEventListener('mouseenter', pause);
      area?.removeEventListener('mouseleave', resume);
    };
  }, [heroIndex, heroSlides.length]);

  // Game sections
  const featured = useMemo(() => heroSlides.slice(0, 4), [heroSlides]);
  
  const bestSellers = useMemo(() => (
    [...games]
      .sort((a,b) => {
        const scoreA = (a.salePercent || 0) * 2 - (Number(a.price) || 0) / 1000;
        const scoreB = (b.salePercent || 0) * 2 - (Number(b.price) || 0) / 1000;
        return scoreB - scoreA;
      })
      .slice(0, 8)
  ), [games]);

  const deepDiscount = useMemo(() => (
    games.filter(g => (g.salePercent || 0) >= 30)
      .sort((a,b) => (b.salePercent || 0) - (a.salePercent || 0))
      .slice(0, 8)
  ), [games]);

  const freeToPlay = useMemo(() => (
    games.filter(g => Number(g.price) === 0).slice(0, 8)
  ), [games]);

  const newArrivals = useMemo(() => (
    [...games].slice(0, 8)
  ), [games]);

  const sections = useMemo(() => {
    const allSections = [
      { id:'best', title:'Bán chạy nhất', items: bestSellers },
      { id:'discount', title:'Giảm giá sâu (≥30%)', items: deepDiscount },
      { id:'featured', title:'Nổi bật', items: featured },
      { id:'free', title:'Miễn phí', items: freeToPlay },
      { id:'new', title:'Mới ra mắt', items: newArrivals },
    ];
    return allSections.filter(s => s.items && s.items.length > 0);
  }, [bestSellers, deepDiscount, featured, freeToPlay, newArrivals]);

  if (loading && games.length === 0) {
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

  return (
    <main className="home-model">
      <div className="hm-container">
        <div className="hm-top">
          {/* Left Sidebar - Categories */}
          <aside className="hm-side-left">
            <div className="cat-head">Danh mục sản phẩm</div>
            <ul className="cat-nav">
              {visibleCats.map(c => (
                <li key={c.id}>
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
            {(canMoreCat || categories.length > 10) && (
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
                    src={getGameImage(hero.name, 0)} 
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
                {heroSlides.length > 1 && (
                  <>
                    <button className="hero-nav prev" onClick={prevHero} aria-label="Trước">
                      ‹
                    </button>
                    <button className="hero-nav next" onClick={nextHero} aria-label="Sau">
                      ›
                    </button>
                    <div className="hero-dots">
                      {heroSlides.map((_, i) => (
                        <button 
                          key={i} 
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
              {sections.map(s => (
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
          {sections.map(s => (
            <SectionShelf 
              key={s.id} 
              id={`sec-${s.id}`} 
              title={s.title} 
              items={s.items} 
              currency={currency} 
            />
          ))}
        </div>
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
        {items.map((g, idx) => {
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
                  src={getGameImage(g.name, idx)} 
                  alt={g.name} 
                  loading="lazy" 
                />
                {hasDiscount && <span className="si-badge disc">-{percent}%</span>}
              </div>
              <div className="si-body">
                <span className="si-title">{g.name}</span>
                <div className="si-meta">
                  <span className="genres">
                    {g.categories && g.categories.length > 0 
                      ? g.categories.slice(0, 2).map(c => c.name).join(', ')
                      : 'Game'}
                  </span>
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
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

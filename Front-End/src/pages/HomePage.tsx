import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchGamesByPrice, fetchCategories, Game, Category } from '../api/client';
import { useCurrency } from '../context/CurrencyContext';
import { getGameImage as getGameImageUtil } from '../utils/imageUtils';
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

function getGameImage(game: Game): string {
  return getGameImageUtil(game);
}

function formatPrice(price: number, currency: string = 'VND'): string {
  if (currency === 'USD') {
    return `$${(price / 25000).toFixed(2)}`;
  }
  return `${price.toLocaleString('vi-VN')}₫`;
}

function formatReleaseDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

function renderStars(rating?: number, count?: number): JSX.Element | null {
  if (!rating || rating === 0) return null;
  
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="rating-stars" title={`${rating.toFixed(1)} / 5.0${count ? ` (${count} đánh giá)` : ''}`}>
      {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`} className="star full">★</span>)}
      {hasHalfStar && <span className="star half">★</span>}
      {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="star empty">☆</span>)}
      {count && count > 0 && <span className="rating-count">({count})</span>}
    </div>
  );
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
        if (!cancelled) {
          // Check if it's a network/connection error
          if (!err.response) {
            setError('Không thể kết nối tới server. Vui lòng kiểm tra backend đang chạy.');
          } else if (err.response.status >= 500) {
            setError('Server đang gặp sự cố. Vui lòng thử lại sau.');
          } else {
            setError(err?.response?.data?.message ?? 'Không thể tải danh sách games. Vui lòng thử lại.');
          }
        }
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
  const hero = heroSlides[heroIndex] || (games.length > 0 ? games[0] : null); // Safe fallback
  const heroTimer = useRef<number | null>(null);
  const AUTO_MS = 5200;

  function nextHero(){ 
    setHeroIndex(i => (i+1) % Math.max(1, (heroSlides || []).length)); 
  }
  
  function prevHero(){ 
    setHeroIndex(i => (i-1 + (heroSlides || []).length) % Math.max(1, (heroSlides || []).length)); 
  }

  // Autoplay with pause on hover
  const heroAreaRef = useRef<HTMLElement>(null);
  useEffect(() => {
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
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

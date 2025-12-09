import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchGamesByPrice, fetchCategories, searchGames, Game, Category } from '../api/client';
import { useCurrency, formatPrice } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getGameImage as getGameImageUtil } from '../utils/imageUtils';
import './StorePage.css';

// Platform list
const PLATFORMS = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];

// Placeholder images
const GAME_PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=225&fit=crop',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=225&fit=crop',
  'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=225&fit=crop',
];

function getGameImage(game: Game): string {
  return getGameImageUtil(game);
}

function getDiscountedPrice(game: Game): number {
  const price = Number(game.price) || 0;
  const salePercent = game.salePercent || 0;
  return salePercent > 0 ? price * (1 - salePercent / 100) : price;
}

export function StorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currency } = useCurrency();
  const { add: addToCart } = useCart();
  const { toggle: toggleWishlist, isInWishlist } = useWishlist();

  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const category = searchParams.get('category');
  const platform = searchParams.get('platform');
  const search = searchParams.get('search');
  const sortBy = searchParams.get('sort') || 'price-asc';
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const onlyFree = searchParams.get('free') === 'true';
  const onlySale = searchParams.get('sale') === 'true';

  // Load games
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const loadGames = async () => {
      try {
        let data: Game[];
        if (search) {
          data = await searchGames(search);
        } else {
          const order = sortBy === 'price-desc' ? 'desc' : 'asc';
          data = await fetchGamesByPrice(order);
        }
        if (!cancelled) setGames(data);
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.response?.data?.message || 'Không thể tải danh sách games');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadGames();
    return () => { cancelled = true; };
  }, [search, sortBy]);

  // Load categories
  useEffect(() => {
    let cancelled = false;
    fetchCategories()
      .then((data) => { if (!cancelled) setCategories(data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Filter games
  const filteredGames = useMemo(() => {
    let result = [...games];

    // Filter by category
    if (category) {
      result = result.filter(g => 
        g.categories?.some(c => c.name.toLowerCase() === category.toLowerCase())
      );
    }

    // Filter by platform (mock - backend doesn't have platform field)
    if (platform) {
      // This is a placeholder - backend needs platform field
      // For now, we'll just return all games
    }

    // Filter by price range
    if (minPrice !== null) {
      const min = Number(minPrice);
      if (!isNaN(min)) {
        result = result.filter(g => {
          const price = getDiscountedPrice(g);
          return price >= min;
        });
      }
    }

    if (maxPrice !== null) {
      const max = Number(maxPrice);
      if (!isNaN(max)) {
        result = result.filter(g => {
          const price = getDiscountedPrice(g);
          return price <= max;
        });
      }
    }

    // Filter by free games
    if (onlyFree) {
      result = result.filter(g => Number(g.price) === 0);
    }

    // Filter by on sale games
    if (onlySale) {
      result = result.filter(g => g.salePercent && g.salePercent > 0);
    }

    return result;
  }, [games, category, platform, minPrice, maxPrice, onlyFree, onlySale]);

  // Stats
  const totalGames = (filteredGames || []).length;
  const onSaleGames = (filteredGames || []).filter(g => g.salePercent && g.salePercent > 0).length;

  const handleClearFilters = () => {
    setSearchParams({});
  };

  const handleSortChange = (newSort: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', newSort);
    setSearchParams(newParams);
  };

  const handleCategoryFilter = (cat: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === cat) {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handlePlatformFilter = (plat: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (platform === plat) {
      newParams.delete('platform');
    } else {
      newParams.set('platform', plat);
    }
    setSearchParams(newParams);
  };

  const handlePriceFilter = (min: string, max: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (min) {
      newParams.set('minPrice', min);
    } else {
      newParams.delete('minPrice');
    }
    if (max) {
      newParams.set('maxPrice', max);
    } else {
      newParams.delete('maxPrice');
    }
    setSearchParams(newParams);
  };

  const handleToggleFree = () => {
    const newParams = new URLSearchParams(searchParams);
    if (onlyFree) {
      newParams.delete('free');
    } else {
      newParams.set('free', 'true');
      newParams.delete('sale'); // Can't be both free and on sale
    }
    setSearchParams(newParams);
  };

  const handleToggleSale = () => {
    const newParams = new URLSearchParams(searchParams);
    if (onlySale) {
      newParams.delete('sale');
    } else {
      newParams.set('sale', 'true');
      newParams.delete('free'); // Can't be both free and on sale
    }
    setSearchParams(newParams);
  };

  return (
    <div className="storeContainer">
      <div className="storeHeader">
        <div className="container">
          <h1>🎮 Cửa hàng Game</h1>
          <p className="storeSubtitle">
            Khám phá {totalGames} games {category && `trong thể loại ${category}`}
            {platform && ` trên nền tảng ${platform}`}
          </p>
          <div className="storeStats">
            <span className="stat">📦 {totalGames} sản phẩm</span>
            <span className="stat">🔥 {onSaleGames} đang giảm giá</span>
          </div>
        </div>
      </div>

      <div className="storeMain container">
        {/* Sidebar Filters */}
        <aside className="storeSidebar">
          <div className="filterSection">
            <div className="filterHeader">
              <h3>🔍 Bộ lọc</h3>
              {(category || platform || search || minPrice || maxPrice || onlyFree || onlySale) && (
                <button className="clearFilters" onClick={handleClearFilters}>
                  Xóa bộ lọc
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="filterGroup">
              <h4>Sắp xếp</h4>
              <select 
                value={sortBy} 
                onChange={(e) => handleSortChange(e.target.value)}
                className="sortSelect"
                aria-label="Sắp xếp theo"
                title="Sắp xếp theo"
              >
                <option value="price-asc">Giá: Thấp đến cao</option>
                <option value="price-desc">Giá: Cao đến thấp</option>
                <option value="name">Tên A-Z</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="filterGroup">
              <h4>Khoảng giá</h4>
              <div className="priceRange">
                <input
                  type="number"
                  placeholder="Tối thiểu"
                  value={minPrice || ''}
                  onChange={(e) => handlePriceFilter(e.target.value, maxPrice || '')}
                  className="priceInput"
                  min="0"
                />
                <span className="priceSeparator">-</span>
                <input
                  type="number"
                  placeholder="Tối đa"
                  value={maxPrice || ''}
                  onChange={(e) => handlePriceFilter(minPrice || '', e.target.value)}
                  className="priceInput"
                  min="0"
                />
              </div>
            </div>

            {/* Special Filters */}
            <div className="filterGroup">
              <h4>Đặc biệt</h4>
              <div className="filterList">
                <button
                  className={`filterBtn ${onlyFree ? 'active' : ''}`}
                  onClick={handleToggleFree}
                >
                  🎁 Miễn phí
                  {onlyFree && ' ✓'}
                </button>
                <button
                  className={`filterBtn ${onlySale ? 'active' : ''}`}
                  onClick={handleToggleSale}
                >
                  🔥 Đang giảm giá
                  {onlySale && ' ✓'}
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="filterGroup">
              <h4>Thể loại</h4>
              <div className="filterList">
                {(categories || []).map(cat => (
                  <button
                    key={cat.id || cat.name}
                    className={`filterBtn ${category === cat.name ? 'active' : ''}`}
                    onClick={() => handleCategoryFilter(cat.name)}
                  >
                    {cat.name}
                    {category === cat.name && ' ✓'}
                  </button>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div className="filterGroup">
              <h4>Nền tảng</h4>
              <div className="filterList">
                {PLATFORMS.map(plat => (
                  <button
                    key={plat}
                    className={`filterBtn ${platform === plat ? 'active' : ''}`}
                    onClick={() => handlePlatformFilter(plat)}
                  >
                    {plat}
                    {platform === plat && ' ✓'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Games Grid */}
        <div className="storeContent">
          {loading && (
            <div className="storeLoading">
              <div className="spinner"></div>
              <p>Đang tải games...</p>
            </div>
          )}

          {error && (
            <div className="storeError">
              <h2>⚠️ Lỗi</h2>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredGames.length === 0 && (
            <div className="storeEmpty">
              <h2>🔍 Không tìm thấy game nào</h2>
              <p>Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
              <button className="btnPrimary" onClick={handleClearFilters}>
                Xóa bộ lọc
              </button>
            </div>
          )}

          {!loading && !error && filteredGames.length > 0 && (
            <div className="gamesGrid">
              {(filteredGames || []).map(game => {
                const finalPrice = getDiscountedPrice(game);
                const isFree = Number(game.price) === 0;
                const hasDiscount = game.salePercent && game.salePercent > 0;
                const inWishlist = isInWishlist(game.id);

                return (
                  <div key={game.id} className="gameCard">
                    <Link to={`/game/${game.id}`} className="gameCardLink">
                      <div className="gameCardImage">
                        <img src={getGameImage(game)} alt={game.name} />
                        {hasDiscount && (
                          <div className="discountBadge">-{game.salePercent}%</div>
                        )}
                        {game.video && (
                          <div className="videoIcon" title="Có video giới thiệu">
                            🎬
                          </div>
                        )}
                      </div>
                      <div className="gameCardContent">
                        <h3 className="gameCardTitle">{game.name}</h3>
                        {game.categories && game.categories.length > 0 && (
                          <div className="gameCardTags">
                            {(game.categories || []).slice(0, 2).map(cat => (
                              <span key={cat.name} className="tag">{cat.name}</span>
                            ))}
                          </div>
                        )}
                        <div className="gameCardFooter">
                          <div className="gameCardPrice">
                            {isFree ? (
                              <span className="free">Miễn phí</span>
                            ) : hasDiscount ? (
                              <>
                                <span className="oldPrice">{formatPrice(Number(game.price), currency)}</span>
                                <span className="newPrice">{formatPrice(finalPrice, currency)}</span>
                              </>
                            ) : (
                              <span className="price">{formatPrice(Number(game.price), currency)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="gameCardActions">
                      <button 
                        className="btnCart" 
                        onClick={() => addToCart(game)}
                        title="Thêm vào giỏ"
                      >
                        🛒
                      </button>
                      <button 
                        className={`btnWishlist ${inWishlist ? 'active' : ''}`}
                        onClick={() => toggleWishlist(game)}
                        title={inWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                      >
                        {inWishlist ? '❤️' : '🤍'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

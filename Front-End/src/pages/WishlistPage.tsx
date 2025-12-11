import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useCurrency, formatPrice } from '../context/CurrencyContext';
import { useEffect, useState } from 'react';
import { Game as GameResponse, fetchGame } from '../api/client';
<<<<<<< HEAD
import { getGameImage } from '../utils/imageUtils';
=======
>>>>>>> origin/main
import './WishlistPage.css';

const WishlistPage = () => {
    const navigate = useNavigate();
    const { wishlist, remove } = useWishlist();
    const { add } = useCart();
    const { currency } = useCurrency();
    const [games, setGames] = useState<GameResponse[]>([]);
    const [loading, setLoading] = useState(true);
<<<<<<< HEAD
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'discount' | 'date'>('date');
    const [showOnSaleOnly, setShowOnSaleOnly] = useState(false);
=======
>>>>>>> origin/main

    useEffect(() => {
        const fetchWishlistGames = async () => {
            if (wishlist.length === 0) {
                setGames([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // Fetch each game by ID
                const gamePromises = wishlist.map((id: string) => 
                    fetchGame(id).catch(() => null)
                );
                const results = await Promise.all(gamePromises);
                const validGames = results.filter((g: any): g is GameResponse => g !== null);
                setGames(validGames);
            } catch (error) {
                console.error('Error fetching wishlist games:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlistGames();
    }, [wishlist]);

    const handleAddToCart = (game: GameResponse) => {
        add(game as any);
    };

<<<<<<< HEAD


    // Filter and sort games
    const getFilteredAndSortedGames = () => {
        let result = [...games];

        // Filter by sale
        if (showOnSaleOnly) {
            result = result.filter(g => (g.salePercent ?? 0) > 0);
        }

        // Sort
        switch (sortBy) {
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price':
                result.sort((a, b) => {
                    const priceA = a.salePercent ? a.price * (1 - a.salePercent / 100) : a.price;
                    const priceB = b.salePercent ? b.price * (1 - b.salePercent / 100) : b.price;
                    return priceA - priceB;
                });
                break;
            case 'discount':
                result.sort((a, b) => (b.salePercent ?? 0) - (a.salePercent ?? 0));
                break;
            case 'date':
                // Already in chronological order (most recently added)
                break;
        }

        return result;
    };

    const displayGames = getFilteredAndSortedGames();

=======
    const getGameImage = (game: GameResponse) => {
        return game.image || game.cover || 'https://placehold.co/300x400/1a2332/4facfe?text=No+Image';
    };

>>>>>>> origin/main
    if (loading) {
        return (
            <div className="wishlist-page">
                <div className="wishlist-container">
                    <div className="wishlist-header">
                        <h1>Danh sách yêu thích</h1>
                    </div>
                    <div className="loading-state">
                        <p>Đang tải...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (games.length === 0) {
        return (
            <div className="wishlist-page">
                <div className="wishlist-container">
                    <div className="wishlist-header">
                        <h1>Danh sách yêu thích</h1>
                        <p className="wishlist-subtitle">Quản lý các game bạn quan tâm</p>
                    </div>
                    <div className="empty-state">
                        <div className="empty-icon">❤️</div>
                        <h2>Danh sách yêu thích trống</h2>
                        <p>Bạn chưa thêm game nào vào danh sách yêu thích</p>
                        <button 
                            className="btn-primary"
                            onClick={() => navigate('/store')}
                        >
                            Khám phá game
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <div className="wishlist-container">
                <div className="wishlist-header">
<<<<<<< HEAD
                    <div className="header-top">
                        <div>
                            <h1>❤️ Danh sách yêu thích</h1>
                            <p className="wishlist-subtitle">
                                {displayGames.length} {displayGames.length !== games.length ? `/ ${games.length}` : ''} game trong danh sách
                            </p>
                        </div>
                        <button 
                            className="btn-back"
                            onClick={() => navigate('/store')}
                        >
                            ← Quay lại Store
                        </button>
                    </div>

                    <div className="wishlist-controls">
                        <div className="control-group">
                            <label htmlFor="sortBy">Sắp xếp theo:</label>
                            <select 
                                id="sortBy"
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="control-select"
                            >
                                <option value="date">Mới nhất</option>
                                <option value="name">Tên A-Z</option>
                                <option value="price">Giá thấp đến cao</option>
                                <option value="discount">Giảm giá nhiều nhất</option>
                            </select>
                        </div>

                        <div className="control-group">
                            <label className="checkbox-label">
                                <input 
                                    type="checkbox"
                                    checked={showOnSaleOnly}
                                    onChange={(e) => setShowOnSaleOnly(e.target.checked)}
                                />
                                <span>🏷️ Chỉ hiện game đang giảm giá</span>
                            </label>
                        </div>
                    </div>
                </div>

                {displayGames.length === 0 && games.length > 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h2>Không tìm thấy game</h2>
                        <p>Không có game nào phù hợp với bộ lọc hiện tại</p>
                        <button 
                            className="btn-primary"
                            onClick={() => setShowOnSaleOnly(false)}
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                ) : (
                    <div className="wishlist-list">
                        {displayGames.map((game) => {
=======
                    <h1>❤️ Danh sách yêu thích</h1>
                    <p className="wishlist-subtitle">{games.length} game trong danh sách của bạn</p>
                </div>

                <div className="wishlist-list">
                    {games.map((game) => {
>>>>>>> origin/main
                        const salePercent = game.salePercent ?? 0;
                        const finalPrice = salePercent > 0 
                            ? game.price * (1 - salePercent / 100) 
                            : game.price;
                        const hasDiscount = salePercent > 0;
                        const isFree = game.price === 0;

                        return (
                            <div key={game.id} className="wishlist-item">
                                <div 
                                    className="item-image-wrapper" 
                                    onClick={() => navigate(`/game/${game.id}`)}
                                >
                                    <img 
                                        src={getGameImage(game)} 
                                        alt={game.name}
                                        className="item-image"
                                    />
                                    {hasDiscount && (
                                        <div className="item-discount-badge">
                                            -{game.salePercent}%
                                        </div>
                                    )}
                                    {game.video && (
                                        <div className="video-indicator">
                                            🎬 Video
                                        </div>
                                    )}
                                </div>
                                
                                <div className="item-details">
                                    <h3 
                                        className="item-name" 
                                        onClick={() => navigate(`/game/${game.id}`)}
                                    >
                                        {game.name}
                                    </h3>
                                    
                                    {game.categories && game.categories.length > 0 && (
                                        <div className="item-categories">
                                            {game.categories.map((cat) => (
                                                <span key={cat.name} className="item-category-tag">
                                                    {cat.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="item-meta">
                                        {game.releaseDate && (
                                            <span className="item-meta-item">
                                                📅 {new Date(game.releaseDate).toLocaleDateString('vi-VN')}
                                            </span>
                                        )}
                                        {game.averageRating && (
                                            <span className="item-rating">
                                                ⭐ {game.averageRating.toFixed(1)}
                                                {game.ratingCount && ` (${game.ratingCount})`}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="item-actions">
                                    <div className="item-price-section">
                                        {isFree ? (
                                            <span className="item-price-free">Miễn phí</span>
                                        ) : hasDiscount ? (
                                            <>
                                                <span className="item-price-original">
                                                    {formatPrice(game.price, currency)}
                                                </span>
                                                <span className="item-price-current">
                                                    {formatPrice(finalPrice, currency)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="item-price-current">
                                                {formatPrice(game.price, currency)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="item-buttons">
                                        <button
                                            className="btn-add-cart"
                                            onClick={() => handleAddToCart(game)}
                                            title="Thêm vào giỏ hàng"
                                        >
                                            🛒 Thêm vào giỏ
                                        </button>
                                        <button
                                            className="btn-remove-wishlist"
                                            onClick={() => remove(game.id)}
                                            title="Xóa khỏi yêu thích"
                                        >
                                            🗑️ Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
<<<<<<< HEAD
                    </div>
                )}

                {displayGames.length > 0 && (
                    <div className="wishlist-actions">
                        <button 
                            className="btn-secondary"
                            onClick={() => navigate('/store')}
                        >
                            ← Tiếp tục mua sắm
                        </button>
                        <div className="actions-right">
                            <span className="total-info">
                                Tổng giá trị: {formatPrice(
                                    displayGames.reduce((sum, g) => {
                                        const price = g.salePercent ? g.price * (1 - g.salePercent / 100) : g.price;
                                        return sum + price;
                                    }, 0),
                                    currency
                                )}
                            </span>
                            <button 
                                className="btn-primary"
                                onClick={() => {
                                    displayGames.forEach((game) => add(game as any));
                                    navigate('/checkout');
                                }}
                            >
                                🛒 Thêm tất cả vào giỏ hàng ({displayGames.length})
                            </button>
                        </div>
                    </div>
                )}
=======
                </div>

                <div className="wishlist-actions">
                    <button 
                        className="btn-secondary"
                        onClick={() => navigate('/store')}
                    >
                        ← Tiếp tục mua sắm
                    </button>
                    <button 
                        className="btn-primary"
                        onClick={() => {
                            games.forEach((game) => add(game as any));
                            navigate('/checkout');
                        }}
                    >
                        🛒 Thêm tất cả vào giỏ hàng ({games.length})
                    </button>
                </div>
>>>>>>> origin/main
            </div>
        </div>
    );
};

export default WishlistPage;

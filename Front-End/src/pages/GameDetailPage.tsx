import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, Game } from '../api/client';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency, formatPrice } from '../context/CurrencyContext';
import './GameDetailPage.css';

export function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { add: addToCart } = useCart();
  const { toggle: toggleWishlist, isInWishlist } = useWishlist();
  const { currency } = useCurrency();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'system' | 'reviews'>('overview');
  const [suggestedGames, setSuggestedGames] = useState<Game[]>([]);

  useEffect(() => {
    if (!id) {
      setError('ID game không hợp lệ');
      setLoading(false);
      return;
    }

    const fetchGame = async () => {
      try {
        setLoading(true);
        
        // Workaround: Get all games and find by ID since /games/{id} returns 404
        const response = await api.get('/games');
        const allGames = response.data.result as Game[];
        const foundGame = allGames.find(g => g.id === id);
        
        if (foundGame) {
          setGame(foundGame);
        } else {
          setError('Game không tồn tại hoặc đã bị xóa');
          // Set suggested games (exclude current game if found)
          setSuggestedGames(allGames.filter(g => g.id !== id).slice(0, 4));
        }
      } catch (err: any) {
        console.error('[GameDetailPage] Error fetching game:', err);
        setError(err?.response?.data?.message || 'Không thể tải thông tin game');
        
        // Fetch suggested games when there's an error
        try {
          const suggestedResponse = await api.get('/games');
          const allGames = suggestedResponse.data.result as Game[];
          setSuggestedGames(allGames.slice(0, 4));
        } catch (suggestErr) {
          console.error('[GameDetailPage] Error fetching suggested games:', suggestErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  const getDiscountedPrice = (game: Game) => {
    const price = Number(game.price) || 0;
    const salePercent = game.salePercent || 0;
    return salePercent > 0 ? price * (1 - salePercent / 100) : price;
  };

  const getGameImage = (game: Game) => {
    return game.image || game.cover || `https://via.placeholder.com/800x450/4eb8dd/ffffff?text=${encodeURIComponent(game.name)}`;
  };

  const handleAddToCart = () => {
    if (game) {
      addToCart(game);
    }
  };

  const handleBuyNow = () => {
    if (game) {
      const success = addToCart(game);
      if (success) navigate('/checkout');
    }
  };

  const handleToggleWishlist = () => {
    if (game) {
      toggleWishlist(game);
    }
  };

  if (loading) {
    return (
      <div className="gameDetailContainer">
        <div className="gameDetailLoading">
          <div className="spinner"></div>
          <p>Đang tải thông tin game...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="gameDetailContainer">
        <div className="gameDetailError">
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚠️</div>
          <h2>Lỗi</h2>
          <p style={{ marginBottom: '24px', fontSize: '18px', color: '#ff6b6b' }}>
            {error || 'Không tìm thấy game'}
          </p>
          <p style={{ marginBottom: '24px', color: '#8b9bb4' }}>
            Game này có thể đã bị xóa hoặc ID không chính xác.
            <br />
            Vui lòng quay lại trang chủ để tìm game khác.
          </p>
          <button onClick={() => navigate('/')} className="primaryButton">
            🏠 Về trang chủ
          </button>

          {/* Suggested Games */}
          {suggestedGames.length > 0 && (
            <div style={{ marginTop: '48px', maxWidth: '900px' }}>
              <h3 style={{ fontSize: '20px', color: '#1d4e63', marginBottom: '20px', fontWeight: '700' }}>
                🎮 Có thể bạn quan tâm
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                gap: '16px' 
              }}>
                {suggestedGames.map((suggestedGame) => (
                  <div
                    key={suggestedGame.id}
                    onClick={() => navigate(`/game/${suggestedGame.id}`)}
                    style={{
                      cursor: 'pointer',
                      background: '#fff',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid #e0ecf1',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <img
                      src={suggestedGame.image || suggestedGame.cover || `https://via.placeholder.com/200x150/4eb8dd/ffffff?text=${encodeURIComponent(suggestedGame.name)}`}
                      alt={suggestedGame.name}
                      style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '12px' }}>
                      <h4 style={{ 
                        margin: '0 0 8px', 
                        fontSize: '14px', 
                        fontWeight: '700', 
                        color: '#1d4e63',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {suggestedGame.name}
                      </h4>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '16px', 
                        fontWeight: '700', 
                        color: '#2a90b3' 
                      }}>
                        {formatPrice(Number(suggestedGame.price), currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const hasDiscount = game.salePercent && game.salePercent > 0;
  const finalPrice = getDiscountedPrice(game);
  const isFree = Number(game.price) === 0;
  const inWishlist = isInWishlist(game.id);

  return (
    <div className="gameDetailContainer">
      <div className="gameDetailHero">
        <div className="heroImage">
          <img src={getGameImage(game)} alt={game.name} />
          {hasDiscount && (
            <div className="discountBadge">-{game.salePercent}%</div>
          )}
        </div>
        <div className="heroOverlay"></div>
      </div>

      <div className="gameDetailContent">
        <div className="gameDetailMain">
          <div className="gameHeader">
            <div className="gameTitle">
              <h1>{game.name}</h1>
              {game.categories && game.categories.length > 0 && (
                <div className="gameTags">
                  {game.categories.map((cat) => (
                    <span key={cat.name} className="tag">
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="gamePriceSection">
              <div className="priceBox">
                {isFree ? (
                  <span className="freeTag">Miễn phí</span>
                ) : hasDiscount ? (
                  <>
                    <span className="originalPrice">{formatPrice(Number(game.price), currency)}</span>
                    <span className="discountPrice">{formatPrice(finalPrice, currency)}</span>
                  </>
                ) : (
                  <span className="regularPrice">{formatPrice(Number(game.price), currency)}</span>
                )}
              </div>

              <div className="actionButtons">
                <button className="btnBuyNow" onClick={handleBuyNow}>
                  🛒 Mua ngay
                </button>
                <button className="btnAddCart" onClick={handleAddToCart}>
                  Thêm vào giỏ
                </button>
                <button
                  className={`btnWishlist ${inWishlist ? 'active' : ''}`}
                  onClick={handleToggleWishlist}
                  title={inWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                >
                  {inWishlist ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
          </div>

          <div className="gameTabs">
            <button
              className={`tab ${selectedTab === 'overview' ? 'active' : ''}`}
              onClick={() => setSelectedTab('overview')}
            >
              📝 Tổng quan
            </button>
            <button
              className={`tab ${selectedTab === 'system' ? 'active' : ''}`}
              onClick={() => setSelectedTab('system')}
            >
              💻 Cấu hình
            </button>
            <button
              className={`tab ${selectedTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setSelectedTab('reviews')}
            >
              ⭐ Đánh giá
            </button>
          </div>

          <div className="gameTabContent">
            {selectedTab === 'overview' && (
              <div className="tabPane">
                {/* Detailed Game Info Section */}
                <div className="gameInfoSection">
                  <div className="gameInfoHeader">
                    <h2>📖 Thông tin chi tiết về {game.name}</h2>
                    <div className="gameMetaTags">
                      {game.categories && game.categories.length > 0 && (
                        game.categories.map((cat) => (
                          <span key={cat.name} className="metaTag">
                            {cat.name}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Game Description */}
                  <div className="gameDescriptionCard">
                    <div className="descriptionHeader">
                      <span className="descIcon">📝</span>
                      <h3>Mô tả game</h3>
                    </div>
                    <div className="descriptionContent">
                      <p className="mainDescription">
                        <strong>{game.name}</strong> là một trò chơi tuyệt vời mang đến trải nghiệm giải trí đỉnh cao 
                        với đồ họa đẹp mắt, gameplay hấp dẫn và cốt truyện cuốn hút. Game được thiết kế đặc biệt 
                        để mang đến những phút giây thư giãn và giải trí tuyệt vời cho người chơi.
                      </p>
                      <p>
                        Với {game.name}, bạn sẽ được trải nghiệm một thế giới game phong phú, đa dạng với 
                        nhiều tính năng độc đáo và thú vị. Game phù hợp cho mọi lứa tuổi và mọi trình độ 
                        người chơi, từ người mới bắt đầu cho đến game thủ chuyên nghiệp.
                      </p>
                    </div>
                  </div>

                  {/* Video Showcase */}
                  {game.video && (
                    <div className="gameVideoSection">
                      <div className="videoHeader">
                        <span className="videoIcon">🎬</span>
                        <h3>Video giới thiệu gameplay</h3>
                      </div>
                      <div className="videoContainer">
                        <div className="videoWrapper">
                          <iframe
                            src={game.video}
                            title={`${game.name} - Video giới thiệu`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                        <div className="videoCaption">
                          <p>💡 Xem video để hiểu rõ hơn về gameplay và đồ họa của game</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Detailed Features Grid */}
                  <div className="detailedFeaturesSection">
                    <div className="featuresHeader">
                      <span className="featIcon">✨</span>
                      <h3>Đặc điểm nổi bật</h3>
                    </div>
                    <div className="detailedFeaturesGrid">
                      {/* Category Feature */}
                      <div className="detailedFeatureCard primary">
                        <div className="featureCardIcon">🎮</div>
                        <div className="featureCardContent">
                          <h4>Thể loại game</h4>
                          <p className="featureValue">
                            {game.categories?.map(c => c.name).join(' • ') || 'Game'}
                          </p>
                          <p className="featureDesc">
                            Phân loại chi tiết giúp bạn dễ dàng tìm kiếm game phù hợp
                          </p>
                        </div>
                      </div>

                      {/* Stock Feature */}
                      <div className={`detailedFeatureCard ${game.quantity > 0 ? 'success' : 'warning'}`}>
                        <div className="featureCardIcon">📦</div>
                        <div className="featureCardContent">
                          <h4>Tồn kho</h4>
                          <p className="featureValue">
                            {game.quantity > 0 ? `${game.quantity} key` : 'Hết hàng'}
                          </p>
                          <p className="featureDesc">
                            {game.quantity > 0 
                              ? `Còn ${game.quantity} key sẵn sàng giao ngay lập tức`
                              : 'Vui lòng quay lại sau hoặc đăng ký nhận thông báo'}
                          </p>
                        </div>
                      </div>

                      {/* Status Feature */}
                      <div className={`detailedFeatureCard ${game.quantity > 0 ? 'success' : 'danger'}`}>
                        <div className="featureCardIcon">💎</div>
                        <div className="featureCardContent">
                          <h4>Trạng thái</h4>
                          <p className="featureValue">
                            {game.quantity > 0 ? '✓ Còn hàng' : '✗ Hết hàng'}
                          </p>
                          <p className="featureDesc">
                            {game.quantity > 0 
                              ? 'Sẵn sàng để mua và kích hoạt ngay'
                              : 'Tạm thời hết hàng, sẽ cập nhật sớm'}
                          </p>
                        </div>
                      </div>

                      {/* Release Date Feature */}
                      {game.releaseDate && (
                        <div className="detailedFeatureCard info">
                          <div className="featureCardIcon">📅</div>
                          <div className="featureCardContent">
                            <h4>Ngày phát hành</h4>
                            <p className="featureValue">
                              {new Date(game.releaseDate).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                            <p className="featureDesc">
                              Ra mắt chính thức trên thị trường
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Rating Feature */}
                      <div className="detailedFeatureCard accent">
                        <div className="featureCardIcon">⭐</div>
                        <div className="featureCardContent">
                          <h4>Đánh giá</h4>
                          <p className="featureValue">
                            {game.averageRating?.toFixed(1) || 'N/A'} / 5.0
                          </p>
                          <p className="featureDesc">
                            Từ {game.ratingCount || 0} người chơi đã đánh giá
                          </p>
                        </div>
                      </div>

                      {/* Price Feature */}
                      <div className={`detailedFeatureCard ${hasDiscount ? 'sale' : 'primary'}`}>
                        <div className="featureCardIcon">💰</div>
                        <div className="featureCardContent">
                          <h4>Giá bán</h4>
                          <p className="featureValue">
                            {isFree ? 'Miễn phí' : formatPrice(finalPrice, currency)}
                          </p>
                          {hasDiscount && (
                            <p className="featureDesc discount">
                              Tiết kiệm {game.salePercent}% 
                              ({formatPrice(Number(game.price) - finalPrice, currency)})
                            </p>
                          )}
                          {!hasDiscount && !isFree && (
                            <p className="featureDesc">
                              Giá niêm yết chính thức
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="keyFeaturesSection">
                    <div className="keyFeaturesHeader">
                      <span className="keyIcon">🎯</span>
                      <h3>Tính năng chính</h3>
                    </div>
                    <div className="keyFeaturesList">
                      <div className="keyFeatureItem">
                        <div className="keyFeatureIconBox">🎨</div>
                        <div className="keyFeatureText">
                          <h4>Đồ họa đẹp mắt</h4>
                          <p>Hình ảnh sắc nét, màu sắc rực rỡ, hiệu ứng đẹp mắt</p>
                        </div>
                      </div>
                      <div className="keyFeatureItem">
                        <div className="keyFeatureIconBox">🎮</div>
                        <div className="keyFeatureText">
                          <h4>Gameplay hấp dẫn</h4>
                          <p>Lối chơi đa dạng, nhiều chế độ game khác nhau</p>
                        </div>
                      </div>
                      <div className="keyFeatureItem">
                        <div className="keyFeatureIconBox">🌍</div>
                        <div className="keyFeatureText">
                          <h4>Thế giới mở rộng</h4>
                          <p>Khám phá bản đồ rộng lớn với nhiều khu vực đa dạng</p>
                        </div>
                      </div>
                      <div className="keyFeatureItem">
                        <div className="keyFeatureIconBox">👥</div>
                        <div className="keyFeatureText">
                          <h4>Chơi đa người</h4>
                          <p>Hỗ trợ chơi cùng bạn bè hoặc thi đấu online</p>
                        </div>
                      </div>
                      <div className="keyFeatureItem">
                        <div className="keyFeatureIconBox">🏆</div>
                        <div className="keyFeatureText">
                          <h4>Thành tựu phong phú</h4>
                          <p>Hệ thống nhiệm vụ và phần thưởng hấp dẫn</p>
                        </div>
                      </div>
                      <div className="keyFeatureItem">
                        <div className="keyFeatureIconBox">🔄</div>
                        <div className="keyFeatureText">
                          <h4>Cập nhật thường xuyên</h4>
                          <p>Nội dung mới liên tục, sửa lỗi nhanh chóng</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Purchase Info */}
                  <div className="purchaseInfoSection">
                    <div className="purchaseInfoCard">
                      <div className="purchaseIcon">💳</div>
                      <div className="purchaseContent">
                        <h3>Thông tin mua hàng</h3>
                        <ul className="purchaseList">
                          <li>✅ Giao key tự động qua email ngay lập tức sau khi thanh toán</li>
                          <li>✅ Key chính hãng 100%, kích hoạt vĩnh viễn</li>
                          <li>✅ Hỗ trợ kích hoạt 24/7 qua Live Chat</li>
                          <li>✅ Đổi trả trong vòng 7 ngày nếu key lỗi</li>
                          <li>✅ Bảo hành trọn đời cho tất cả sản phẩm</li>
                          <li>✅ Hướng dẫn kích hoạt chi tiết kèm theo</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'system' && (
              <div className="tabPane">
                <h2>Cấu hình hệ thống</h2>
                <div className="systemReqs">
                  <div className="reqColumn">
                    <h3>Tối thiểu</h3>
                    <ul>
                      <li><strong>OS:</strong> Windows 10 64-bit</li>
                      <li><strong>CPU:</strong> Intel Core i5-6600K / AMD Ryzen 5 1600</li>
                      <li><strong>RAM:</strong> 8 GB</li>
                      <li><strong>GPU:</strong> NVIDIA GTX 1060 / AMD RX 580</li>
                      <li><strong>Storage:</strong> 50 GB available space</li>
                    </ul>
                  </div>
                  <div className="reqColumn">
                    <h3>Khuyến nghị</h3>
                    <ul>
                      <li><strong>OS:</strong> Windows 11 64-bit</li>
                      <li><strong>CPU:</strong> Intel Core i7-8700K / AMD Ryzen 7 3700X</li>
                      <li><strong>RAM:</strong> 16 GB</li>
                      <li><strong>GPU:</strong> NVIDIA RTX 3070 / AMD RX 6800 XT</li>
                      <li><strong>Storage:</strong> 50 GB SSD</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="tabPane">
                <h2>Đánh giá từ người chơi</h2>
                <div className="reviewsSection">
                  <div className="reviewsSummary">
                    <div className="ratingBig">{game.averageRating?.toFixed(1) || 'N/A'}</div>
                    <div className="ratingStars">
                      {game.averageRating ? '⭐'.repeat(Math.round(game.averageRating)) : '⭐⭐⭐⭐⭐'}
                    </div>
                    <p>Dựa trên {game.ratingCount || 0} đánh giá</p>
                  </div>
                  <div className="reviewsList">
                    {game.ratingCount && game.ratingCount > 0 ? (
                      <>
                        <div className="reviewItem">
                          <div className="reviewHeader">
                            <strong>GamePlayer123</strong>
                            <span className="reviewDate">2 ngày trước</span>
                          </div>
                          <div className="reviewStars">⭐⭐⭐⭐⭐</div>
                          <p>Game rất hay! Đồ họa đẹp, gameplay cuốn hút. Đáng tiền!</p>
                        </div>
                        <div className="reviewItem">
                          <div className="reviewHeader">
                            <strong>ProGamer99</strong>
                            <span className="reviewDate">5 ngày trước</span>
                          </div>
                          <div className="reviewStars">⭐⭐⭐⭐</div>
                          <p>Khá ổn, có vài bug nhỏ nhưng nhìn chung rất tốt.</p>
                        </div>
                      </>
                    ) : (
                      <p className="noReviews">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="gameDetailSidebar">
          <div className="sidebarCard">
            <h3>🎯 Thông tin</h3>
            <div className="infoList">
              <div className="infoRow">
                <span className="infoLabel">Giá gốc</span>
                <span className="infoValue">{formatPrice(Number(game.price), currency)}</span>
              </div>
              {hasDiscount && (
                <div className="infoRow highlight">
                  <span className="infoLabel">Giảm giá</span>
                  <span className="infoValue">-{game.salePercent}%</span>
                </div>
              )}
              <div className="infoRow">
                <span className="infoLabel">Số lượng</span>
                <span className="infoValue">{game.quantity}</span>
              </div>
            </div>
          </div>

          <div className="sidebarCard">
            <h3>🏷️ Danh mục</h3>
            <div className="categoryList">
              {game.categories && game.categories.length > 0 ? (
                game.categories.map((cat) => (
                  <span key={cat.name} className="categoryBadge">
                    {cat.name}
                  </span>
                ))
              ) : (
                <span className="categoryBadge">Game</span>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

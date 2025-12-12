import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGame as apiFetchGame, fetchGamesByPrice, Game } from '../api/client';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency, formatPrice } from '../context/CurrencyContext';
import { GameRating } from '../components/common/GameRating';
import { getGameImage as getGameImageUtil } from '../utils/imageUtils';
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

    const loadGameDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch game by ID, fallback to list if 404
        let gameData: Game | null = null;
        
        try {
          gameData = await apiFetchGame(id);
        } catch (fetchError: any) {
          // If 404 (backend issue), fallback to fetching from list
          if (fetchError?.response?.status === 404 || fetchError?.response?.data?.code === 1009) {
            console.warn('[GameDetailPage] Game detail endpoint returned 404, falling back to list');
            const allGames = await fetchGamesByPrice('asc');
            gameData = allGames.find((g: Game) => g.id === id) || null;
            
            if (!gameData) {
              throw new Error('Game không tồn tại');
            }
          } else {
            throw fetchError;
          }
        }
        
        setGame(gameData);
        
        // Load suggested games
        try {
          const suggested = await fetchGamesByPrice('asc');
          setSuggestedGames(suggested.filter(g => g.id !== id).slice(0, 4));
        } catch (suggestErr) {
          console.error('[GameDetailPage] Error fetching suggested games:', suggestErr);
        }
      } catch (err: any) {
        console.error('[GameDetailPage] Error fetching game:', err);
        const errorMessage = err?.message || err?.response?.data?.message || 'Không thể tải thông tin game';
        setError(errorMessage);
        
        // Load suggested games even when main game fails
        try {
          const suggested = await fetchGamesByPrice('asc');
          setSuggestedGames(suggested.slice(0, 4));
        } catch (suggestErr) {
          console.error('[GameDetailPage] Error fetching suggested games:', suggestErr);
        }
      } finally {
        setLoading(false);
      }
    };

    loadGameDetail();
  }, [id]);

  const getDiscountedPrice = (game: Game) => {
    const price = Number(game.price) || 0;
    const salePercent = game.salePercent || 0;
    return salePercent > 0 ? price * (1 - salePercent / 100) : price;
  };

  const getGameImage = (game: Game) => {
    return getGameImageUtil(game);
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
                {(suggestedGames || []).map((suggestedGame) => (
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
                  {(game.categories || []).map((cat) => (
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
                        (game.categories || []).map((cat) => (
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
                {game.systemRequirements ? (
                  <div className="systemReqsModern">
                    {/* Minimum Requirements */}
                    {game.systemRequirements.minimum && (
                      <div className="reqCard minimum">
                        <div className="reqCardHeader">
                          <h3>💻 Cấu hình tối thiểu</h3>
                          <span className="reqBadge">Minimum</span>
                        </div>
                        <ul className="reqList">
                          {game.systemRequirements.minimum.os && (
                            <li>
                              <div className="reqIcon">💾</div>
                              <div className="reqDetails">
                                <strong>Hệ điều hành:</strong>
                                <span>{game.systemRequirements.minimum.os}</span>
                              </div>
                            </li>
                          )}
                          {game.systemRequirements.minimum.cpu && (
                            <li>
                              <div className="reqIcon">🔧</div>
                              <div className="reqDetails">
                                <strong>Bộ xử lý:</strong>
                                <span>{game.systemRequirements.minimum.cpu}</span>
                              </div>
                            </li>
                          )}
                          {game.systemRequirements.minimum.ram && (
                            <li>
                              <div className="reqIcon">🧠</div>
                              <div className="reqDetails">
                                <strong>Bộ nhớ RAM:</strong>
                                <span>{game.systemRequirements.minimum.ram}</span>
                              </div>
                            </li>
                          )}
                          {game.systemRequirements.minimum.gpu && (
                            <li>
                              <div className="reqIcon">🎮</div>
                              <div className="reqDetails">
                                <strong>Card đồ họa:</strong>
                                <span>{game.systemRequirements.minimum.gpu}</span>
                              </div>
                            </li>
                          )}
                          {game.systemRequirements.minimum.storage && (
                            <li>
                              <div className="reqIcon">💿</div>
                              <div className="reqDetails">
                                <strong>Dung lượng:</strong>
                                <span>{game.systemRequirements.minimum.storage}</span>
                              </div>
                            </li>
                          )}
                          {game.systemRequirements.minimum.network && (
                            <li>
                              <div className="reqIcon">🌐</div>
                              <div className="reqDetails">
                                <strong>Mạng:</strong>
                                <span>{game.systemRequirements.minimum.network}</span>
                              </div>
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                    
                    {/* Recommended Requirements */}
                    {game.systemRequirements.recommended && (
                      <div className="reqCard recommended">
                        <div className="reqCardHeader">
                          <h3>⚡ Cấu hình khuyến nghị</h3>
                          <span className="reqBadge">Recommended</span>
                        </div>
                        <ul className="reqList">
                          {game.systemRequirements.recommended.os && (
                            <li>
                              <div className="reqIcon">💾</div>
                              <div className="reqDetails">
                                <strong>Hệ điều hành:</strong>
                                <span>{game.systemRequirements.recommended.os}</span>
                              </div>
                            </li>
                          )}
                          {game.systemRequirements.recommended.cpu && (
                            <li>
                              <div className="reqIcon">🔧</div>
                              <div className="reqDetails">
                                <strong>Bộ xử lý:</strong>
                                <span>{game.systemRequirements.recommended.cpu}</span>
                              </div>
                            </li>
                          )}
                          {game.systemRequirements.recommended.ram && (
                            <li>
                              <div className="reqIcon">🧠</div>
                              <div className="reqDetails">
                                <strong>Bộ nhớ RAM:</strong>
                                <span>{game.systemRequirements.recommended.ram}</span>
                              </div>
                            </li>
                          )}
                          {game.systemRequirements.recommended.gpu && (
                            <li>
                              <div className="reqIcon">🎮</div>
                              <div className="reqDetails">
                                <strong>Card đồ họa:</strong>
                                <span>{game.systemRequirements.recommended.gpu}</span>
                              </div>
                            </li>
                          )}
                          {game.systemRequirements.recommended.storage && (
                            <li>
                              <div className="reqIcon">💿</div>
                              <div className="reqDetails">
                                <strong>Dung lượng:</strong>
                                <span>{game.systemRequirements.recommended.storage}</span>
                              </div>
                            </li>
                          )}
                          {game.systemRequirements.recommended.network && (
                            <li>
                              <div className="reqIcon">🌐</div>
                              <div className="reqDetails">
                                <strong>Mạng:</strong>
                                <span>{game.systemRequirements.recommended.network}</span>
                              </div>
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="noSystemReqs">
                    <div className="noSystemReqsIcon">💻</div>
                    <h3>Chưa có thông tin cấu hình</h3>
                    <p>Thông tin cấu hình hệ thống sẽ được cập nhật sớm</p>
                  </div>
                )}

                {/* Performance Tips */}
                <div className="performanceTips">
                  <div className="tipsHeader">
                    <span className="tipsIcon">💡</span>
                    <h3>Lời khuyên tối ưu hiệu suất</h3>
                  </div>
                  <div className="tipsGrid">
                    <div className="tipCard">
                      <div className="tipIconBox">🚀</div>
                      <h4>Tối ưu FPS</h4>
                      <p>Đóng các ứng dụng chạy nền để giải phóng RAM và CPU, tăng hiệu suất game</p>
                    </div>
                    <div className="tipCard">
                      <div className="tipIconBox">🎯</div>
                      <h4>Cập nhật Driver</h4>
                      <p>Luôn cập nhật driver card đồ họa mới nhất để tận dụng tối đa hiệu năng</p>
                    </div>
                    <div className="tipCard">
                      <div className="tipIconBox">⚙️</div>
                      <h4>Cài đặt đồ họa</h4>
                      <p>Điều chỉnh cài đặt đồ họa phù hợp với cấu hình máy của bạn</p>
                    </div>
                    <div className="tipCard">
                      <div className="tipIconBox">❄️</div>
                      <h4>Làm mát hệ thống</h4>
                      <p>Đảm bảo hệ thống tản nhiệt tốt để duy trì hiệu năng ổn định</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="tabPane">
                <GameRating 
                  gameId={game.id} 
                  onRatingChange={() => {
                    // Reload game data to update average rating
                    apiFetchGame(game.id).then(setGame).catch(console.error);
                  }}
                />
              </div>
            )}
          </div>

          {/* Suggested Games Section */}
          {suggestedGames.length > 0 && (
            <div className="suggestedGamesSection">
              <div className="suggestedHeader">
                <h2>🎮 Game liên quan</h2>
                <p>Các game tương tự bạn có thể quan tâm</p>
              </div>
              <div className="suggestedGamesGrid">
                {(suggestedGames || []).map((suggestedGame) => {
                  const suggestedHasDiscount = suggestedGame.salePercent && suggestedGame.salePercent > 0;
                  const suggestedFinalPrice = getDiscountedPrice(suggestedGame);
                  const suggestedIsFree = Number(suggestedGame.price) === 0;

                  return (
                    <div
                      key={suggestedGame.id}
                      className="suggestedGameCard"
                      onClick={() => navigate(`/game/${suggestedGame.id}`)}
                    >
                      <div className="suggestedGameImage">
                        <img
                          src={getGameImage(suggestedGame)}
                          alt={suggestedGame.name}
                        />
                        {suggestedHasDiscount && (
                          <div className="suggestedDiscountBadge">
                            -{suggestedGame.salePercent}%
                          </div>
                        )}
                      </div>
                      <div className="suggestedGameInfo">
                        <h4>{suggestedGame.name}</h4>
                        <div className="suggestedGameMeta">
                          {suggestedGame.categories && suggestedGame.categories.length > 0 && (
                            <span className="suggestedCategory">
                              {suggestedGame.categories[0].name}
                            </span>
                          )}
                          {suggestedGame.averageRating && (
                            <span className="suggestedRating">
                              ⭐ {suggestedGame.averageRating.toFixed(1)}
                            </span>
                          )}
                        </div>
                        <div className="suggestedGamePrice">
                          {suggestedIsFree ? (
                            <span className="suggestedFreeTag">Miễn phí</span>
                          ) : suggestedHasDiscount ? (
                            <>
                              <span className="suggestedOriginalPrice">
                                {formatPrice(Number(suggestedGame.price), currency)}
                              </span>
                              <span className="suggestedDiscountPrice">
                                {formatPrice(suggestedFinalPrice, currency)}
                              </span>
                            </>
                          ) : (
                            <span className="suggestedRegularPrice">
                              {formatPrice(Number(suggestedGame.price), currency)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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

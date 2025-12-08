import { useState, useEffect } from 'react';
import { 
  GameRating as GameRatingType, 
  getGameRatings, 
  getMyRatingForGame, 
  createGameRating, 
  updateGameRating, 
  deleteGameRating 
} from '../../api/client';
import './GameRating.css';

type Props = {
  gameId: string;
  onRatingChange?: () => void;
};

export function GameRating({ gameId, onRatingChange }: Props) {
  const [ratings, setRatings] = useState<GameRatingType[]>([]);
  const [myRating, setMyRating] = useState<GameRatingType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem('wgs_token') || localStorage.getItem('token');
  const isLoggedIn = Boolean(token);

  useEffect(() => {
    loadRatings();
  }, [gameId]);

  const loadRatings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allRatings = await getGameRatings(gameId);
      setRatings(allRatings);
      
      if (isLoggedIn) {
        const myRatingData = await getMyRatingForGame(gameId);
        setMyRating(myRatingData);
        if (myRatingData) {
          setSelectedRating(myRatingData.rating);
          setComment(myRatingData.comment || '');
        }
      }
    } catch (err: any) {
      console.error('[GameRating] Error loading ratings:', err);
      setError('Không thể tải đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async () => {
    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập để đánh giá');
      return;
    }

    try {
      setSubmitting(true);
      
      if (myRating) {
        // Update existing rating
        await updateGameRating(myRating.id, { rating: selectedRating, comment });
      } else {
        // Create new rating
        await createGameRating({ gameId, rating: selectedRating, comment });
      }
      
      setIsEditing(false);
      await loadRatings();
      onRatingChange?.();
    } catch (err: any) {
      console.error('[GameRating] Error submitting rating:', err);
      alert('Không thể gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRating = async () => {
    if (!myRating) return;
    
    if (!confirm('Bạn có chắc muốn xóa đánh giá của mình?')) return;

    try {
      setSubmitting(true);
      await deleteGameRating(myRating.id);
      setMyRating(null);
      setSelectedRating(5);
      setComment('');
      setIsEditing(false);
      await loadRatings();
      onRatingChange?.();
    } catch (err: any) {
      console.error('[GameRating] Error deleting rating:', err);
      alert('Không thể xóa đánh giá. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, size: 'small' | 'medium' | 'large' = 'small') => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${size} ${i <= rating ? 'filled' : 'empty'} ${interactive ? 'interactive' : ''}`}
          onClick={interactive ? () => setSelectedRating(i) : undefined}
        >
          {i <= rating ? '⭐' : '☆'}
        </span>
      );
    }
    return <div className="stars-container">{stars}</div>;
  };

  const averageRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : 'N/A';

  if (loading) {
    return (
      <div className="gameRatingContainer">
        <div className="ratingLoading">
          <div className="spinner"></div>
          <p>Đang tải đánh giá...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gameRatingContainer">
      {/* Rating Summary */}
      <div className="ratingSummary">
        <div className="summaryLeft">
          <div className="averageRating">{averageRating}</div>
          <div className="averageStars">{renderStars(Math.round(Number(averageRating)), false, 'medium')}</div>
          <p className="ratingCount">
            {ratings.length} {ratings.length === 1 ? 'đánh giá' : 'đánh giá'}
          </p>
        </div>
        
        {isLoggedIn && (
          <div className="summaryRight">
            {!isEditing && !myRating && (
              <button className="btnWriteReview" onClick={() => setIsEditing(true)}>
                ✍️ Viết đánh giá
              </button>
            )}
            {!isEditing && myRating && (
              <div className="myRatingActions">
                <button className="btnEditReview" onClick={() => setIsEditing(true)}>
                  ✏️ Sửa đánh giá
                </button>
                <button className="btnDeleteReview" onClick={handleDeleteRating}>
                  🗑️ Xóa
                </button>
              </div>
            )}
          </div>
        )}
        
        {!isLoggedIn && (
          <div className="summaryRight">
            <p className="loginPrompt">Đăng nhập để đánh giá game này</p>
          </div>
        )}
      </div>

      {/* Rating Form */}
      {isEditing && isLoggedIn && (
        <div className="ratingForm">
          <div className="formHeader">
            <h3>{myRating ? 'Chỉnh sửa đánh giá' : 'Đánh giá của bạn'}</h3>
          </div>
          
          <div className="formGroup">
            <label>Xếp hạng:</label>
            {renderStars(selectedRating, true, 'large')}
            <span className="ratingText">{selectedRating} / 5 sao</span>
          </div>
          
          <div className="formGroup">
            <label>Nhận xét (tùy chọn):</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về game này..."
              rows={4}
              maxLength={500}
            />
            <span className="charCount">{comment.length}/500 ký tự</span>
          </div>
          
          <div className="formActions">
            <button 
              className="btnSubmit" 
              onClick={handleSubmitRating}
              disabled={submitting}
            >
              {submitting ? 'Đang gửi...' : myRating ? '💾 Cập nhật' : '📤 Gửi đánh giá'}
            </button>
            <button 
              className="btnCancel" 
              onClick={() => {
                setIsEditing(false);
                if (myRating) {
                  setSelectedRating(myRating.rating);
                  setComment(myRating.comment || '');
                } else {
                  setSelectedRating(5);
                  setComment('');
                }
              }}
              disabled={submitting}
            >
              ❌ Hủy
            </button>
          </div>
        </div>
      )}

      {/* Ratings List */}
      <div className="ratingsList">
        {error && <div className="ratingError">{error}</div>}
        
        {ratings.length === 0 && !error && (
          <div className="noRatings">
            <div className="noRatingsIcon">💭</div>
            <p>Chưa có đánh giá nào</p>
            <p className="noRatingsSubtext">Hãy là người đầu tiên đánh giá game này!</p>
          </div>
        )}
        
        {ratings.map((rating) => (
          <div key={rating.id} className={`ratingItem ${myRating?.id === rating.id ? 'myRating' : ''}`}>
            <div className="ratingHeader">
              <div className="ratingUser">
                <div className="userAvatar">👤</div>
                <div className="userInfo">
                  <strong>{rating.userName || 'Người chơi'}</strong>
                  {myRating?.id === rating.id && <span className="myBadge">Của bạn</span>}
                </div>
              </div>
              <div className="ratingMeta">
                {renderStars(rating.rating, false, 'small')}
                {rating.createdAt && (
                  <span className="ratingDate">
                    {new Date(rating.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                )}
              </div>
            </div>
            {rating.comment && (
              <div className="ratingComment">
                <p>{rating.comment}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

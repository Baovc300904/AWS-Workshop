import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { checkMoMoPaymentStatus } from '../api/client';
import './MoMoCallbackPage.css';

export default function MoMoCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clear } = useCart();
  const [status, setStatus] = useState<'checking' | 'success' | 'failed'>('checking');
  const [message, setMessage] = useState('Đang xác thực thanh toán...');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get parameters from URL
        const resultCode = searchParams.get('resultCode');
        const orderId = searchParams.get('orderId');
        const message = searchParams.get('message');

        if (!orderId) {
          setStatus('failed');
          setMessage('Không tìm thấy thông tin đơn hàng');
          return;
        }

        // Check payment status from backend
        try {
          const paymentStatus = await checkMoMoPaymentStatus(orderId);
          
          if (paymentStatus.resultCode === 0 || paymentStatus.status === 'SUCCESS') {
            setStatus('success');
            setMessage('Thanh toán thành công! Mã kích hoạt game đã được gửi đến email của bạn.');
            
            // Clear cart
            clear();
            
            // Clear pending order
            localStorage.removeItem('pending_order');
            
            // Redirect to home after 3 seconds
            setTimeout(() => {
              navigate('/');
            }, 3000);
          } else {
            throw new Error(paymentStatus.message || 'Thanh toán thất bại');
          }
        } catch (apiError: any) {
          // Fallback: Check URL params if API fails
          if (resultCode === '0') {
            setStatus('success');
            setMessage('Thanh toán thành công! Mã kích hoạt game đã được gửi đến email của bạn.');
            clear();
            localStorage.removeItem('pending_order');
            setTimeout(() => navigate('/'), 3000);
          } else {
            throw new Error(message || 'Thanh toán không thành công');
          }
        }
      } catch (error: any) {
        setStatus('failed');
        setMessage(error?.message || 'Có lỗi xảy ra trong quá trình xác thực thanh toán');
      }
    };

    verifyPayment();
  }, [searchParams, navigate, clear]);

  const handleRetry = () => {
    navigate('/checkout');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="momoCallbackPage">
      <div className="momoCallbackContainer">
        <div className="momoCallbackCard">
          {status === 'checking' && (
            <>
              <div className="momoSpinner"></div>
              <h2>Đang xác thực thanh toán</h2>
              <p>Vui lòng đợi trong giây lát...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="momoIcon success">✓</div>
              <h2>Thanh toán thành công!</h2>
              <p>{message}</p>
              <div className="momoActions">
                <button className="primaryBtn" onClick={handleGoHome}>
                  Về trang chủ
                </button>
              </div>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="momoIcon failed">✕</div>
              <h2>Thanh toán thất bại</h2>
              <p>{message}</p>
              <div className="momoActions">
                <button className="primaryBtn" onClick={handleRetry}>
                  Thử lại
                </button>
                <button className="secondaryBtn" onClick={handleGoHome}>
                  Về trang chủ
                </button>
              </div>
            </>
          )}
        </div>

        <div className="momoInfo">
          <p>
            <strong>💡 Lưu ý:</strong> Nếu bạn đã thanh toán thành công nhưng chưa nhận được mã kích hoạt,
            vui lòng kiểm tra email hoặc liên hệ hỗ trợ.
          </p>
        </div>
      </div>
    </div>
  );
}

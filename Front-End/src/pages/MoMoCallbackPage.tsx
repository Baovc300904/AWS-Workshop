import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { confirmMoMoPayment, confirmTopupPayment, getMyInfo } from '../api/client';
import './MoMoCallbackPage.css';

export default function MoMoCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clear } = useCart();
  const { showSuccess, showError } = useToast();
  const [status, setStatus] = useState<'checking' | 'success' | 'failed'>('checking');
  const [message, setMessage] = useState('Đang xác thực thanh toán...');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get parameters from URL
        const resultCode = searchParams.get('resultCode');
        const orderId = searchParams.get('orderId');
        const amount = searchParams.get('amount');
        const message = searchParams.get('message');
        const demo = searchParams.get('demo');

        console.log('[MoMoCallback] Received params:', { resultCode, orderId, amount, message, demo });

        if (!orderId) {
          setStatus('failed');
          setMessage('Không tìm thấy thông tin đơn hàng');
          showError('Không tìm thấy thông tin đơn hàng');
          return;
        }

        // Check if this is a topup transaction
        const isTopup = orderId.startsWith('TOPUP_');

        // Handle DEMO mode - still confirm with backend to update balance
        if (demo === '1') {
          try {
            if (isTopup) {
              // Confirm topup to update balance
              await confirmTopupPayment(orderId, { 
                resultCode: '0',
                message: 'DEMO: Nạp tiền thành công'
              });
              
              // Refresh user balance
              const updatedUser = await getMyInfo();
              localStorage.setItem('user', JSON.stringify(updatedUser));
              window.dispatchEvent(new Event('storage'));
              
              const successMsg = `✨ DEMO MODE: Nạp tiền thành công! Số tiền ${amount ? parseInt(amount).toLocaleString('vi-VN') : ''} VNĐ đã được cộng vào ví.`;
              setStatus('success');
              setMessage(successMsg);
              showSuccess(successMsg);
<<<<<<< HEAD
              
              // Trigger balance update in navbar
              window.dispatchEvent(new Event('balance-updated'));
=======
>>>>>>> origin/main
            } else {
              // Confirm game purchase
              await confirmMoMoPayment(orderId, { 
                resultCode: '0',
                message: 'DEMO: Thanh toán thành công'
              });
              
              const successMsg = '✨ DEMO MODE: Thanh toán thành công! Mã game đã được gửi đến email.';
              setStatus('success');
              setMessage(successMsg);
              showSuccess(successMsg);
              clear();
              localStorage.removeItem('pending_order');
            }
            
            setTimeout(() => navigate('/profile'), 3000);
          } catch (error) {
            console.error('Demo mode confirm error:', error);
            setStatus('failed');
            setMessage('Lỗi xác nhận demo payment');
          }
          return;
        }

        // Confirm payment/topup with backend
        if (resultCode === '0') {
          try {
            if (isTopup) {
              // Topup transaction
              await confirmTopupPayment(orderId, { 
                resultCode: resultCode,
                message: message || 'Nạp tiền thành công'
              });
              
              setStatus('success');
              const successMsg = `Nạp tiền thành công! Số tiền ${amount ? parseInt(amount).toLocaleString('vi-VN') : ''} VNĐ đã được cộng vào ví của bạn.`;
              setMessage(successMsg);
              showSuccess(successMsg);
<<<<<<< HEAD
              
              // Trigger balance update in navbar
              window.dispatchEvent(new Event('balance-updated'));
=======
>>>>>>> origin/main
            } else {
              // Game purchase
              await confirmMoMoPayment(orderId, { 
                resultCode: resultCode,
                message: message || 'Thanh toán thành công'
              });
              
              setStatus('success');
              const successMsg = 'Thanh toán thành công! Mã kích hoạt game đã được gửi đến email của bạn.';
              setMessage(successMsg);
              showSuccess(successMsg);
              
<<<<<<< HEAD
              // Trigger balance update in navbar
              window.dispatchEvent(new Event('balance-updated'));
              
=======
>>>>>>> origin/main
              // Clear cart for purchases
              clear();
              localStorage.removeItem('pending_order');
            }
            
            // Redirect to profile page after 3 seconds
            setTimeout(() => {
              navigate('/profile');
            }, 3000);
          } catch (apiError: any) {
            console.error('Error confirming payment:', apiError);
            const errorMsg = `Lỗi xác nhận ${isTopup ? 'nạp tiền' : 'thanh toán'} với server`;
            showError(errorMsg);
            throw new Error(errorMsg);
          }
        } else {
          // Payment failed
          try {
            if (isTopup) {
              await confirmTopupPayment(orderId, { 
                resultCode: resultCode || '1',
                message: message || 'Nạp tiền thất bại'
              });
            } else {
              await confirmMoMoPayment(orderId, { 
                resultCode: resultCode || '1',
                message: message || 'Thanh toán thất bại'
              });
            }
          } catch (err) {
            console.error('Error updating failed payment:', err);
          }
          
          const failMsg = message || `${isTopup ? 'Nạp tiền' : 'Thanh toán'} không thành công`;
          showError(failMsg);
          throw new Error(failMsg);
        }
      } catch (error: any) {
        setStatus('failed');
        const errorMsg = error?.message || 'Có lỗi xảy ra trong quá trình xác thực thanh toán';
        setMessage(errorMsg);
        showError(errorMsg);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, clear, showSuccess, showError]);

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
                <button className="primaryBtn" onClick={() => navigate('/profile')}>
                  Xem tài khoản
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

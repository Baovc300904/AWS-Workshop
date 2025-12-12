import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getBalance, checkTopupStatus } from '../api/client';
import './MoMoCallbackPage.css';

export default function TopupCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'checking' | 'success' | 'failed'>('checking');
  const [message, setMessage] = useState('Đang xác thực thanh toán...');
  const [amount, setAmount] = useState<number>(0);
  const [newBalance, setNewBalance] = useState<number>(0);

  useEffect(() => {
    const verifyTopup = async () => {
      try {
        // Get parameters from URL
        const resultCode = searchParams.get('resultCode');
        const orderId = searchParams.get('orderId');
        const amountStr = searchParams.get('amount');
        const messageParam = searchParams.get('message');

        if (!orderId) {
          setStatus('failed');
          setMessage('Không tìm thấy thông tin giao dịch');
          return;
        }

        // Parse amount
        if (amountStr) {
          setAmount(parseInt(amountStr));
        }

        // Check transaction status from backend
        try {
          const statusData = await checkTopupStatus(orderId);
          
          if (statusData.resultCode === 0 || statusData.status === 'SUCCESS') {
            // Payment successful
            setStatus('success');
            setMessage('Nạp tiền thành công! Số dư của bạn đã được cập nhật.');
            setAmount(statusData.amount || parseInt(amountStr || '0'));

            // Fetch updated balance
            try {
              const balanceData = await getBalance();
              setNewBalance(balanceData.balance || 0);
            } catch (balanceErr) {
              console.error('Failed to load balance:', balanceErr);
            }

            // Redirect to profile after 3 seconds
            setTimeout(() => {
              navigate('/profile?section=topup', { replace: true });
            }, 3000);
          } else {
            // Payment failed
            setStatus('failed');
            setMessage(statusData.message || messageParam || 'Giao dịch không thành công. Vui lòng thử lại.');
          }
        } catch (apiError: any) {
          // Fallback: Check URL params if API fails
          if (resultCode === '0') {
            setStatus('success');
            setMessage('Nạp tiền thành công! Số dư của bạn đã được cập nhật.');
            
            try {
              const balanceData = await getBalance();
              setNewBalance(balanceData.balance || 0);
            } catch (balanceErr) {
              console.error('Failed to load balance:', balanceErr);
            }
            
            setTimeout(() => {
              navigate('/profile?section=topup', { replace: true });
            }, 3000);
          } else {
            setStatus('failed');
            setMessage(messageParam || 'Giao dịch không thành công. Vui lòng thử lại.');
          }
        }
      } catch (error: any) {
        setStatus('failed');
        setMessage(error?.message || 'Có lỗi xảy ra trong quá trình xác thực thanh toán');
      }
    };

    verifyTopup();
  }, [searchParams, navigate]);

  const handleRetry = () => {
    navigate('/profile?section=topup');
  };

  const handleGoToProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="momoCallbackPage">
      <div className="momoCallbackContainer">
        <div className="momoCallbackCard">
          {status === 'checking' && (
            <>
              <div className="momoSpinner"></div>
              <h2>Đang xác thực giao dịch</h2>
              <p>Vui lòng đợi trong giây lát...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="momoIcon success">✓</div>
              <h2>Nạp tiền thành công!</h2>
              <p>{message}</p>
              
              {amount > 0 && (
                <div className="topupDetails">
                  <div className="topupRow">
                    <span className="topupLabel">Số tiền nạp:</span>
                    <span className="topupValue highlight">+{amount.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  {newBalance > 0 && (
                    <div className="topupRow">
                      <span className="topupLabel">Số dư mới:</span>
                      <span className="topupValue">{newBalance.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="momoActions">
                <button className="primaryBtn" onClick={handleGoToProfile}>
                  Về trang cá nhân
                </button>
              </div>
              
              <p className="redirectNote">Tự động chuyển trang sau 3 giây...</p>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="momoIcon failed">✕</div>
              <h2>Nạp tiền thất bại</h2>
              <p>{message}</p>
              <div className="momoActions">
                <button className="primaryBtn" onClick={handleRetry}>
                  Thử lại
                </button>
                <button className="secondaryBtn" onClick={handleGoToProfile}>
                  Về trang cá nhân
                </button>
              </div>
            </>
          )}
        </div>

        <div className="momoInfo">
          <p>
            <strong>💡 Lưu ý:</strong> Giao dịch có thể mất vài phút để được xử lý. 
            Nếu tiền chưa được cập nhật, vui lòng kiểm tra lại sau ít phút hoặc 
            liên hệ bộ phận hỗ trợ.
          </p>
        </div>
      </div>
    </div>
  );
}

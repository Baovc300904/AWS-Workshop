import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createOrder } from '../api/client';
import './PaymentCallbackPage.css';

export default function PaymentCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');
  const [orderInfo, setOrderInfo] = useState<{
    orderId?: string;
    amount?: string;
    transId?: string;
    orderInfo?: string;
  }>({});

  useEffect(() => {
    const processPayment = async () => {
      // Parse URL parameters
      const resultCode = searchParams.get('resultCode');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');
      const transId = searchParams.get('transId');
      const orderInfoParam = searchParams.get('orderInfo');
      const messageParam = searchParams.get('message');

      console.log('MoMo Callback:', { resultCode, orderId, amount, transId, orderInfo: orderInfoParam, message: messageParam });

      // Store order info
      setOrderInfo({
        orderId: orderId || undefined,
        amount: amount || undefined,
        transId: transId || undefined,
        orderInfo: orderInfoParam ? decodeURIComponent(orderInfoParam) : undefined,
      });

      // Check result code (0 = success)
      if (resultCode === '0') {
        // Success - Create order in database
        try {
          // Get pending order from localStorage
          const pendingOrderStr = localStorage.getItem('pending_order');
          console.log('Pending order:', pendingOrderStr);
          
          if (pendingOrderStr && orderId && !orderId.includes('TOPUP')) {
            const pendingOrder = JSON.parse(pendingOrderStr);
            
            // Create order in backend
            console.log('Creating order with:', pendingOrder);
            const orderResponse = await createOrder(
              (pendingOrder.cart || []).map((item: any) => ({
                gameId: item.id,
                gameName: item.name,
                quantity: item.quantity || 1,
                unitPrice: Number(item.price) || 0,
                salePercent: item.salePercent || 0,
                finalPrice: item.salePercent 
                  ? Number(item.price) * (1 - item.salePercent / 100) 
                  : Number(item.price)
              })),
              'MOMO'
            );
            console.log('Order created:', orderResponse);

            // Clear pending order and cart
            localStorage.removeItem('pending_order');
            localStorage.removeItem('wgs_cart');
            
            // Dispatch cart clear event
            window.dispatchEvent(new Event('cart-updated'));
          } else if (!pendingOrderStr) {
            console.warn('No pending order found in localStorage');
          }
        } catch (err: any) {
          console.error('Failed to create order:', err);
          console.error('Error details:', err?.response?.data);
          // Still show success since payment was successful
          // Admin can manually create order from MoMo transaction log
        }

        setStatus('success');
        setMessage(messageParam ? decodeURIComponent(messageParam) : 'Thanh toán thành công! Đơn hàng đã được tạo.');
      } else {
        // Failed
        setStatus('failed');
        setMessage(messageParam ? decodeURIComponent(messageParam) : `Thanh toán thất bại (Code: ${resultCode})`);
      }
    };

    processPayment();
  }, [searchParams]);

  const handleGoToOrders = () => {
    navigate('/orders');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  const handleRetry = () => {
    navigate('/checkout');
  };

  if (status === 'loading') {
    return (
      <div className="paymentCallbackPage">
        <div className="callbackContainer">
          <div className="spinner">⏳</div>
          <h2>Đang xử lý thanh toán...</h2>
          <p>Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  return (
    <div className="paymentCallbackPage">
      <div className="callbackContainer">
        <div className={`callbackCard ${status}`}>
          {status === 'success' ? (
            <>
              <div className="iconSuccess">✅</div>
              <h1 className="title">Thanh toán thành công!</h1>
              <p className="message">{message}</p>
              
              {orderInfo.orderId && (
                <div className="orderDetails">
                  <div className="detailRow">
                    <span className="label">Mã đơn hàng:</span>
                    <span className="value">{orderInfo.orderId}</span>
                  </div>
                  {orderInfo.transId && (
                    <div className="detailRow">
                      <span className="label">Mã giao dịch:</span>
                      <span className="value">{orderInfo.transId}</span>
                    </div>
                  )}
                  {orderInfo.amount && (
                    <div className="detailRow">
                      <span className="label">Số tiền:</span>
                      <span className="value amount">
                        {parseInt(orderInfo.amount).toLocaleString()}₫
                      </span>
                    </div>
                  )}
                  {orderInfo.orderInfo && (
                    <div className="detailRow">
                      <span className="label">Nội dung:</span>
                      <span className="value">{orderInfo.orderInfo}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="infoBox success">
                <p>
                  {orderInfo.orderId?.includes('TOPUP') 
                    ? '💰 Số dư đã được cập nhật vào tài khoản của bạn'
                    : '🎮 Đơn hàng đang được xử lý. Bạn sẽ nhận được mã game sớm nhất có thể.'
                  }
                </p>
              </div>

              <div className="actions">
                {!orderInfo.orderId?.includes('TOPUP') && (
                  <button className="btn btn-primary" onClick={handleGoToOrders}>
                    📦 Xem đơn hàng
                  </button>
                )}
                <button className="btn btn-secondary" onClick={handleGoToHome}>
                  🏠 Về trang chủ
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="iconFailed">❌</div>
              <h1 className="title">Thanh toán thất bại</h1>
              <p className="message">{message}</p>

              {orderInfo.orderId && (
                <div className="orderDetails">
                  <div className="detailRow">
                    <span className="label">Mã đơn hàng:</span>
                    <span className="value">{orderInfo.orderId}</span>
                  </div>
                </div>
              )}

              <div className="infoBox failed">
                <p>
                  ⚠️ Giao dịch chưa được hoàn tất. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
                </p>
              </div>

              <div className="actions">
                <button className="btn btn-primary" onClick={handleRetry}>
                  🔄 Thử lại
                </button>
                <button className="btn btn-secondary" onClick={handleGoToHome}>
                  🏠 Về trang chủ
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

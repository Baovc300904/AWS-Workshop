import { useEffect, useState } from 'react';
import { fetchUserOrders, Order } from '../api/client';
import { useCurrency, formatPrice } from '../context/CurrencyContext';
import './MyOrdersPage.css';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currency } = useCurrency();
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to load orders:', err);
      setError(err?.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, orderId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedOrderId(orderId);
      setTimeout(() => setCopiedOrderId(null), 2000);
    });
  };

  const downloadLicenseKey = (order: Order) => {
    const content = `
Game Order - ${order.id}
Order Date: ${new Date(order.createdAt).toLocaleString()}
Total Amount: ${formatPrice(order.totalAmount, currency)}

ITEMS:
${(order.items || []).map((item, idx) => 
  `${idx + 1}. ${item.gameName} - ${item.quantity}x ${formatPrice(item.unitPrice, currency)}`
).join('\n')}

LICENSE KEY:
${order.license_key || 'N/A'}

${order.delivery_content ? `\nADDITIONAL INSTRUCTIONS:\n${order.delivery_content}` : ''}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order-${order.id}-license.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      PROCESSING: { label: 'Đang xử lý', className: 'statusProcessing' },
      COMPLETED: { label: 'Hoàn thành', className: 'statusCompleted' },
      CANCELLED: { label: 'Đã hủy', className: 'statusCancelled' },
    };
    const s = statusMap[status as keyof typeof statusMap] || { label: status, className: 'statusProcessing' };
    return <span className={`statusBadge ${s.className}`}>{s.label}</span>;
  };

  if (loading) {
    return (
      <div className="myOrdersPage">
        <div className="myOrdersContainer">
          <div className="loading">Đang tải đơn hàng...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="myOrdersPage">
        <div className="myOrdersContainer">
          <div className="error">❌ {error}</div>
          <button className="retryBtn" onClick={loadOrders}>Thử lại</button>
        </div>
      </div>
    );
  }

  if ((orders || []).length === 0) {
    return (
      <div className="myOrdersPage">
        <div className="myOrdersContainer">
          <div className="emptyOrders">
            <div className="emptyIcon">📦</div>
            <h2>Chưa có đơn hàng</h2>
            <p>Bạn chưa có đơn hàng nào. Hãy khám phá và mua game yêu thích của bạn!</p>
            <button className="shopBtn" onClick={() => window.location.href = '/store'}>
              Mua game ngay
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="myOrdersPage">
      <div className="myOrdersContainer">
        <div className="ordersHeader">
          <h1>Đơn hàng của tôi</h1>
          <p className="ordersSubtitle">Quản lý và theo dõi đơn hàng của bạn</p>
        </div>

        <div className="ordersList">
          {(orders || []).map((order) => (
            <div key={order.id} className="orderCard">
              <div className="orderCardHeader">
                <div className="orderInfo">
                  <span className="orderId">#{order.id}</span>
                  {getStatusBadge(order.status)}
                </div>
                <div className="orderDate">
                  {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              <div className="orderItems">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="orderItem">
                    <div className="itemName">{item.gameName}</div>
                    <div className="itemDetails">
                      {item.quantity}x {formatPrice(item.unitPrice, currency)}
                      {(item.salePercent || 0) > 0 && (
                        <span className="itemSale"> (-{item.salePercent}%)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="orderFooter">
                <div className="orderTotal">
                  <span className="totalLabel">Tổng tiền:</span>
                  <span className="totalAmount">{formatPrice(order.totalAmount, currency)}</span>
                </div>

                {order.status === 'PROCESSING' && (
                  <div className="processingMessage">
                    <span className="processingIcon">⏳</span>
                    <span>Đơn hàng đang được xử lý. Bạn sẽ nhận được mã kích hoạt sớm nhất.</span>
                  </div>
                )}

                {order.status === 'COMPLETED' && order.license_key && (
                  <div className="licenseKeySection">
                    <div className="licenseLabel">🎮 Mã kích hoạt game:</div>
                    <div className="licenseKey">
                      <code>{order.license_key}</code>
                      <button
                        className="copyBtn"
                        onClick={() => copyToClipboard(order.license_key || '', order.id)}
                        title="Sao chép"
                      >
                        {copiedOrderId === order.id ? '✓ Đã copy' : '📋 Copy'}
                      </button>
                    </div>
                    {order.delivery_content && (
                      <div className="deliveryContent">
                        <div className="deliveryLabel">📝 Hướng dẫn:</div>
                        <p>{order.delivery_content}</p>
                      </div>
                    )}
                    <button
                      className="downloadBtn"
                      onClick={() => downloadLicenseKey(order)}
                    >
                      💾 Tải xuống
                    </button>
                  </div>
                )}

                {order.status === 'CANCELLED' && (
                  <div className="cancelledMessage">
                    <span className="cancelledIcon">❌</span>
                    <span>Đơn hàng đã bị hủy.</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

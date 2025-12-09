import { useState, useEffect } from 'react';
import { fetchAllOrders, completeOrder, Order } from '../../api/client';
import './AdminOrdersPage.css';

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [licenseKey, setLicenseKey] = useState('');
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to load orders:', err);
      setError(err?.response?.data?.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = async () => {
    if (!selectedOrder || !licenseKey.trim()) {
      alert('Please enter a license key');
      return;
    }

    try {
      setCompleting(true);
      await completeOrder(selectedOrder.id, licenseKey.trim());
      alert('Order completed successfully!');
      setSelectedOrder(null);
      setLicenseKey('');
      await loadOrders();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to complete order');
    } finally {
      setCompleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      PROCESSING: { bg: '#fef3c7', text: '#92400e' },
      COMPLETED: { bg: '#d1fae5', text: '#065f46' },
      CANCELLED: { bg: '#fee2e2', text: '#991b1b' },
    };
    const style = styles[status] || styles.PROCESSING;
    return (
      <span style={{ 
        padding: '4px 12px', 
        borderRadius: '12px', 
        fontSize: '12px', 
        fontWeight: 'bold',
        background: style.bg,
        color: style.text
      }}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="adminOrdersContainer">
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="adminOrdersContainer">
        <div className="error">{error}</div>
        <button onClick={loadOrders} className="btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="adminOrdersContainer">
      <div className="ordersHeader">
        <h2>Order Management</h2>
        <button onClick={loadOrders} className="btn">🔄 Refresh</button>
      </div>

      <div className="ordersStats">
        <div className="statCard">
          <div className="statLabel">Total Orders</div>
          <div className="statValue">{(orders || []).length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Processing</div>
          <div className="statValue">{(orders || []).filter(o => o.status === 'PROCESSING').length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Completed</div>
          <div className="statValue">{(orders || []).filter(o => o.status === 'COMPLETED').length}</div>
        </div>
      </div>

      {(orders || []).length === 0 ? (
        <div className="emptyState">No orders found</div>
      ) : (
        <div className="ordersTable">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(orders || []).map((order) => (
                <tr key={order?.id || Math.random()}>
                  <td>{order?.id?.substring(0, 8) || 'N/A'}</td>
                  <td>{order?.username || order?.userId || 'Unknown'}</td>
                  <td>
                    {(order?.items || []).map((item, idx) => (
                      <div key={idx} className="orderItem">
                        {item?.gameName || 'Unknown'} x{item?.quantity || 0}
                      </div>
                    ))}
                  </td>
                  <td>{(order?.totalAmount || 0).toLocaleString()}₫</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      background: order?.paymentMethod === 'MOMO' ? '#D82D8B' : '#e2e8f0',
                      color: order?.paymentMethod === 'MOMO' ? 'white' : '#475569'
                    }}>
                      {order?.paymentMethod || 'N/A'}
                    </span>
                  </td>
                  <td>{getStatusBadge(order?.status || 'PROCESSING')}</td>
                  <td>{order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    {order?.status === 'PROCESSING' && (
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="btn btn-primary"
                      >
                        Fulfill Order
                      </button>
                    )}
                    {order?.status === 'COMPLETED' && order?.license_key && (
                      <span className="completedText">✓ Code: {order.license_key.substring(0, 10)}...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <div className="modal" onClick={() => setSelectedOrder(null)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3>Complete Order #{selectedOrder?.id?.substring(0, 8) || 'N/A'}</h3>
            
            <div className="orderDetails">
              <p><strong>User:</strong> {selectedOrder?.username || selectedOrder?.userId || 'Unknown'}</p>
              <p><strong>Amount:</strong> {(selectedOrder?.totalAmount || 0).toLocaleString()}₫</p>
              
              <div className="orderItems">
                <strong>Items:</strong>
                {(selectedOrder?.items || []).map((item, idx) => (
                  <div key={idx} className="orderItem">
                    {item?.gameName || 'Unknown'} x{item?.quantity || 0} - {(item?.finalPrice || 0).toLocaleString()}₫
                  </div>
                ))}
              </div>
            </div>

            <div className="formGroup">
              <label htmlFor="licenseKey">Game Code / License Key:</label>
              <textarea
                id="licenseKey"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="Enter game codes (one per line for multiple items)"
                rows={4}
                className="input"
              />
            </div>

            <div className="modalActions">
              <button 
                onClick={handleCompleteOrder} 
                disabled={completing || !licenseKey.trim()}
                className="btn btn-primary"
              >
                {completing ? 'Processing...' : 'Complete Order'}
              </button>
              <button 
                onClick={() => {
                  setSelectedOrder(null);
                  setLicenseKey('');
                }}
                className="btn"
                disabled={completing}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminOrdersPage;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import './AdminOrdersPage.css';

type OrderItem = {
  id: string;
  gameId: string;
  gameName?: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  userId: string;
  username?: string;
  userEmail?: string;
  totalPrice: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'PROCESSING';
  items?: OrderItem[];
  createdAt: string;
  updatedAt?: string;
};

export function AdminOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Note: Adjust endpoint when OrderController is implemented
      const response = await api.get('/orders');
      const ordersData = response.data.result || [];
      setOrders(ordersData);
    } catch (err: any) {
      console.error('[AdminOrdersPage] Error loading orders:', err);
      // For now, use mock data if endpoint doesn't exist
      setOrders([]);
      setError('Order management coming soon. Backend OrderController not yet implemented.');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      order.id.toLowerCase().includes(search) ||
      (order.username || '').toLowerCase().includes(search) ||
      (order.userEmail || '').toLowerCase().includes(search);
    
    const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Order['status']) => {
    const badges = {
      PENDING: { class: 'status-pending', label: 'Pending', icon: '⏳' },
      PROCESSING: { class: 'status-processing', label: 'Processing', icon: '🔄' },
      COMPLETED: { class: 'status-completed', label: 'Completed', icon: '✅' },
      CANCELLED: { class: 'status-cancelled', label: 'Cancelled', icon: '❌' }
    };
    const badge = badges[status] || badges.PENDING;
    return (
      <span className={`orderStatus ${badge.class}`}>
        <span className="statusIcon">{badge.icon}</span>
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    processing: orders.filter(o => o.status === 'PROCESSING').length,
    completed: orders.filter(o => o.status === 'COMPLETED').length,
    cancelled: orders.filter(o => o.status === 'CANCELLED').length,
    revenue: orders
      .filter(o => o.status === 'COMPLETED')
      .reduce((sum, o) => sum + o.totalPrice, 0)
  };

  return (
    <div className="adminOrdersPage">
      {/* Header */}
      <div className="ordersHeader">
        <div className="headerTop">
          <button className="backButton" onClick={() => navigate('/admin')}>
            <span className="backIcon">←</span>
            Back to Dashboard
          </button>
          <h1 className="pageTitle">
            <span className="titleIcon">📦</span>
            Order Management
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="statsGrid">
          <div className="statCard total">
            <div className="statIcon">📊</div>
            <div className="statContent">
              <div className="statLabel">Total Orders</div>
              <div className="statValue">{stats.total}</div>
            </div>
          </div>
          
          <div className="statCard pending">
            <div className="statIcon">⏳</div>
            <div className="statContent">
              <div className="statLabel">Pending</div>
              <div className="statValue">{stats.pending}</div>
            </div>
          </div>
          
          <div className="statCard processing">
            <div className="statIcon">🔄</div>
            <div className="statContent">
              <div className="statLabel">Processing</div>
              <div className="statValue">{stats.processing}</div>
            </div>
          </div>
          
          <div className="statCard completed">
            <div className="statIcon">✅</div>
            <div className="statContent">
              <div className="statLabel">Completed</div>
              <div className="statValue">{stats.completed}</div>
            </div>
          </div>
          
          <div className="statCard revenue">
            <div className="statIcon">💰</div>
            <div className="statContent">
              <div className="statLabel">Total Revenue</div>
              <div className="statValue">{formatPrice(stats.revenue)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="ordersControls">
        <div className="searchBox">
          <span className="searchIcon">🔍</span>
          <input
            type="text"
            placeholder="Search by order ID, username, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="searchInput"
          />
        </div>

        <div className="filterBox">
          <label className="filterLabel">Status:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filterSelect"
          >
            <option value="ALL">All Orders</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="ordersContent">
        {loading ? (
          <div className="loadingState">
            <div className="spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : error ? (
          <div className="errorState">
            <div className="errorIcon">⚠️</div>
            <h3>Unable to Load Orders</h3>
            <p>{error}</p>
            <button className="retryButton" onClick={loadOrders}>
              Try Again
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">📦</div>
            <h3>No Orders Found</h3>
            <p>
              {searchTerm || filterStatus !== 'ALL' 
                ? 'Try adjusting your filters or search term'
                : 'No orders have been placed yet'}
            </p>
          </div>
        ) : (
          <div className="ordersTable">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="orderRow">
                    <td className="orderId">
                      <span className="idBadge">#{order.id.substring(0, 8)}</span>
                    </td>
                    <td className="customerInfo">
                      <div className="customerName">{order.username || 'N/A'}</div>
                      {order.userEmail && (
                        <div className="customerEmail">{order.userEmail}</div>
                      )}
                    </td>
                    <td className="itemsCount">
                      {order.items?.length || 0} items
                    </td>
                    <td className="orderTotal">
                      <span className="priceValue">{formatPrice(order.totalPrice)}</span>
                    </td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td className="orderDate">{formatDate(order.createdAt)}</td>
                    <td className="orderActions">
                      <button className="actionBtn view" title="View Details">
                        👁️
                      </button>
                      <button className="actionBtn edit" title="Edit Order">
                        ✏️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrdersPage;

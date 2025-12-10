import { useState, useEffect } from 'react';
import { getTransactionHistory } from '../../api/client';
import './AdminTransactionsPage.css';

type Transaction = {
  id: string;
  userId: string;
  username?: string;
  amount: number;
  type: 'TOPUP' | 'PURCHASE' | 'REFUND';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  description?: string;
  createdAt: string;
  orderId?: string;
};

export function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'TOPUP' | 'PURCHASE' | 'REFUND'>('ALL');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTransactionHistory();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to load transactions:', err);
      setError(err?.response?.data?.message || 'Failed to load transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = filter === 'ALL' 
    ? transactions 
    : transactions.filter(t => t.type === filter);

  const totalAmount = filteredTransactions.reduce((sum, t) => {
    if (t.type === 'TOPUP' && t.status === 'COMPLETED') return sum + t.amount;
    if (t.type === 'PURCHASE' && t.status === 'COMPLETED') return sum - t.amount;
    return sum;
  }, 0);

  const getTypeBadge = (type: string) => {
    const styles: Record<string, { bg: string; text: string; icon: string }> = {
      TOPUP: { bg: '#d1fae5', text: '#065f46', icon: '💰' },
      PURCHASE: { bg: '#fee2e2', text: '#991b1b', icon: '🛒' },
      REFUND: { bg: '#fef3c7', text: '#92400e', icon: '↩️' },
    };
    const style = styles[type] || styles.TOPUP;
    return (
      <span style={{ 
        padding: '4px 12px', 
        borderRadius: '12px', 
        fontSize: '12px', 
        fontWeight: 'bold',
        background: style.bg,
        color: style.text
      }}>
        {style.icon} {type}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      PENDING: { bg: '#fef3c7', text: '#92400e' },
      COMPLETED: { bg: '#d1fae5', text: '#065f46' },
      FAILED: { bg: '#fee2e2', text: '#991b1b' },
    };
    const style = styles[status] || styles.PENDING;
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
      <div className="adminTransactionsContainer">
        <div className="loading">Đang tải giao dịch...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="adminTransactionsContainer">
        <div className="error">{error}</div>
        <button onClick={loadTransactions} className="btn">Thử lại</button>
      </div>
    );
  }

  return (
    <div className="adminTransactionsContainer">
      <div className="transactionsHeader">
        <h2>📊 Lịch sử giao dịch</h2>
        <button onClick={loadTransactions} className="btn">🔄 Làm mới</button>
      </div>

      <div className="transactionsStats">
        <div className="statCard">
          <div className="statLabel">Tổng giao dịch</div>
          <div className="statValue">{transactions.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Hoàn thành</div>
          <div className="statValue">
            {transactions.filter(t => t.status === 'COMPLETED').length}
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Đang xử lý</div>
          <div className="statValue">
            {transactions.filter(t => t.status === 'PENDING').length}
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Tổng dòng tiền</div>
          <div className="statValue">
            {totalAmount.toLocaleString('vi-VN')}đ
          </div>
        </div>
      </div>

      <div className="transactionsFilters">
        <button 
          className={`filterBtn ${filter === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          Tất cả
        </button>
        <button 
          className={`filterBtn ${filter === 'TOPUP' ? 'active' : ''}`}
          onClick={() => setFilter('TOPUP')}
        >
          💰 Nạp tiền
        </button>
        <button 
          className={`filterBtn ${filter === 'PURCHASE' ? 'active' : ''}`}
          onClick={() => setFilter('PURCHASE')}
        >
          🛒 Mua hàng
        </button>
        <button 
          className={`filterBtn ${filter === 'REFUND' ? 'active' : ''}`}
          onClick={() => setFilter('REFUND')}
        >
          ↩️ Hoàn tiền
        </button>
      </div>

      <div className="transactionsTable">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Người dùng</th>
              <th>Loại</th>
              <th>Số tiền</th>
              <th>Trạng thái</th>
              <th>Mô tả</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                  Không có giao dịch nào
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.id.substring(0, 8)}...</td>
                  <td>{tx.username || tx.userId}</td>
                  <td>{getTypeBadge(tx.type)}</td>
                  <td style={{ 
                    color: tx.type === 'TOPUP' ? '#065f46' : tx.type === 'PURCHASE' ? '#991b1b' : '#92400e',
                    fontWeight: 'bold'
                  }}>
                    {tx.type === 'TOPUP' ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')}đ
                  </td>
                  <td>{getStatusBadge(tx.status)}</td>
                  <td>{tx.description || '-'}</td>
                  <td>{new Date(tx.createdAt).toLocaleString('vi-VN')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminTransactionsPage;

import { useEffect, useState } from 'react';
import type { OrderSummary, RecentOrder } from '../../api/client';
import { fetchOrderSummary, fetchRecentOrders } from '../../api/client';

export function DashboardSection() {
  const [summary, setSummary] = useState<OrderSummary | null>(null);
  const [recent, setRecent] = useState<RecentOrder[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true); setErr(null);
      try {
        const [s, r] = await Promise.all([
          fetchOrderSummary().catch(()=>null),
          fetchRecentOrders(12).catch(()=>[]),
        ]);
        if (!cancelled) {
          setSummary(s);
          setRecent(r || []);
        }
      } catch (e:any) {
        if (!cancelled) setErr(e?.response?.data?.message || 'Failed to load dashboard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);
  // Dashboard uses API totals only; no synthetic fallbacks

  // No synthetic fallbacks for totals/recent; rely on API and show states instead

  return (
    <>
      <section className="panel">
        <div className="metricsGrid">
          <div className="metricCard">
            <div className="metricLabel">🎮 Total Keys Sold</div>
            <div className="metricValue">
              {summary && typeof summary.totalSold === 'number' 
                ? summary.totalSold.toLocaleString() 
                : (loading ? '⏳' : '0')}
            </div>
          </div>
          <div className="metricCard">
            <div className="metricLabel">💰 Total Revenue</div>
            <div className="metricValue">
              {summary && typeof summary.revenue === 'number'
                ? `$${summary.revenue.toLocaleString()}`
                : (loading ? '⏳' : '$0')}
            </div>
          </div>
          <div className="metricCard">
            <div className="metricLabel">📊 Average Price</div>
            <div className="metricValue">
              {summary && typeof summary.avgPrice === 'number'
                ? `$${Math.round(summary.avgPrice).toLocaleString()}`
                : (loading ? '⏳' : '$0')}
            </div>
          </div>
          <div className="metricCard">
            <div className="metricLabel">🏆 Top Selling Game</div>
            <div className="metricValue small">{summary?.topGameName ?? (loading ? '⏳' : '—')}</div>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <h3 className="panelTitle">📈 Recent Sales</h3>
        </div>
        {recent && recent.length ? (
          <div className="tableWrap">
            <table className="salesTable">
              <thead>
                <tr>
                  <th>📅 Date</th>
                  <th>🎮 Game</th>
                  <th>📦 Qty</th>
                  <th>💵 Amount</th>
                  <th>✅ Status</th>
                </tr>
              </thead>
              <tbody>
                {(recent || []).map((r) => (
                  <tr key={r?.id || Math.random()}>
                    <td>{r?.date || 'N/A'}</td>
                    <td>{r?.gameName || 'Unknown'}</td>
                    <td>{r?.qty || 0}</td>
                    <td>
                      ${typeof r?.amount === 'number' ? r.amount.toLocaleString() : '0'}
                    </td>
                    <td>
                      <span className={`badge ${r?.status==='Completed'?'ok':''}`}>
                        {r?.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="loading">{loading ? 'Loading...' : (err || 'No sales yet.')}</div>
        )}
      </section>
    </>
  );
}

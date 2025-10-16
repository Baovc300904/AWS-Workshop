import { useEffect, useMemo, useState } from 'react';

type LineItem = { id: string; name: string; price: number; qty: number; salePercent?: number };

function getSalePctByStorage(id: string, name: string): number {
  try {
    const fromId = localStorage.getItem(`sale_${id}`);
    if (fromId) return Math.max(0, Math.min(100, Number(fromId)));
    const fromName = localStorage.getItem(`sale_name_${(name||'').toLowerCase()}`);
    if (fromName) return Math.max(0, Math.min(100, Number(fromName)));
  } catch {}
  return 0;
}

export default function CheckoutPage() {
  const [tick, setTick] = useState(0);
  const items: (LineItem & { stock?: number })[] = useMemo(() => {
    try {
      const fromBuyNow = localStorage.getItem('checkout_items');
      if (fromBuyNow) return JSON.parse(fromBuyNow);
      const raw = localStorage.getItem('demo_cart') || '[]';
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }, [tick]);

  const total = useMemo(() => items.reduce((s, it) => {
    const pctFromCart = typeof it.salePercent === 'number' ? it.salePercent : null;
    const pct = pctFromCart !== null ? pctFromCart : getSalePctByStorage(it.id, it.name);
    const unit = pct > 0 ? Math.round((Number(it.price)||0) * (100 - pct) / 100) : Number(it.price)||0;
    return s + unit * (Number(it.qty) || 0);
  }, 0), [items]);
  useEffect(() => { /* trigger re-render when storage changed externally */
    const onStorage = () => setTick((v) => v + 1);
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const writeCart = (arr: any[]) => localStorage.setItem('demo_cart', JSON.stringify(arr));
  const updateQty = (id: string, delta: number) => {
    const arr = items.map(i => ({...i}));
    const idx = arr.findIndex(i => i.id === id);
    if (idx < 0) return;
    const max = arr[idx].stock ?? 9999;
    arr[idx].qty = Math.min(max, Math.max(1, arr[idx].qty + delta));
    writeCart(arr);
    setTick(v=>v+1);
  };
  const setQty = (id: string, qty: number) => {
    const arr = items.map(i => ({...i}));
    const idx = arr.findIndex(i => i.id === id);
    if (idx < 0) return;
    const max = arr[idx].stock ?? 9999;
    const next = Math.min(max, Math.max(1, Math.floor(qty || 0)));
    arr[idx].qty = next;
    writeCart(arr);
    setTick(v=>v+1);
  };
  const removeItem = (id: string) => {
    const arr = items.filter(i => i.id !== id);
    writeCart(arr);
    setTick(v=>v+1);
  };

  return (
    <div style={{ maxWidth: 900, margin: '24px auto', padding: 16, color: '#e6f7ff' }}>
      <h2 style={{ marginBottom: 12 }}>Checkout</h2>
      {items.length === 0 ? (
        <div>Cart is empty.</div>
      ) : (
        <div style={{ background: '#101820', border: '1px solid #1f2c36', borderRadius: 12 }}>
          {items.map((it) => (
            <div key={it.id} style={{ display: 'grid', gridTemplateColumns:'1fr auto auto auto', alignItems:'center', gap:16, padding: '12px 16px', borderBottom: '1px solid #1f2c36' }}>
              <div style={{ fontWeight: 700 }}>{it.name}</div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <button onClick={()=>updateQty(it.id,-1)} style={{ background:'#2a475e', color:'#e6f7ff', border:'1px solid #2a3b4d', width:28, height:28, borderRadius:6, cursor:'pointer' }}>-</button>
                <input
                  type="number"
                  min={1}
                  max={it.stock ?? 9999}
                  value={it.qty}
                  onChange={(e)=>setQty(it.id, Number(e.target.value))}
                  onBlur={(e)=>setQty(it.id, Number(e.target.value))}
                  onKeyDown={(e)=>{ if (e.key==='Enter') setQty(it.id, Number((e.target as HTMLInputElement).value)); }}
                  style={{ width:64, textAlign:'center', fontWeight:800, background:'#101820', color:'#e6f7ff', border:'1px solid #1f2c36', borderRadius:6, padding:'6px 8px' }}
                />
                <button onClick={()=>updateQty(it.id,1)} style={{ background:'#2a475e', color:'#e6f7ff', border:'1px solid #2a3b4d', width:28, height:28, borderRadius:6, cursor:'pointer' }}>+</button>
              </div>
              <div style={{ fontWeight: 800, color: '#8be28b' }}>{(it.price * it.qty).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
              <button onClick={()=>removeItem(it.id)} style={{ background:'#a33', color:'#fff', border:'1px solid #2a3b4d', padding:'6px 10px', borderRadius:8, cursor:'pointer', fontWeight:700 }}>Remove</button>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
            <div style={{ fontWeight: 900 }}>Total</div>
            <div style={{ fontWeight: 900, color: '#8be28b' }}>{total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button onClick={() => { localStorage.removeItem('checkout_items'); window.location.href = '/'; }} style={{ background:'#2a475e', color:'#e6f7ff', border:'1px solid #2a3b4d', padding:'8px 12px', borderRadius:8, cursor:'pointer', fontWeight:700 }}>Continue Shopping</button>
        <button onClick={() => { alert('Payment flow not implemented in demo'); }} style={{ background:'#66c0f4', color:'#0b141a', border:'1px solid #2a3b4d', padding:'8px 12px', borderRadius:8, cursor:'pointer', fontWeight:800 }}>Pay Now</button>
      </div>
    </div>
  );
}



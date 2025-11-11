import { useEffect, useMemo, useState } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    }
  }, [navigate]);

  const getGameImage = (item: any) => {
    return item.image || item.cover || `https://via.placeholder.com/300x169/1a2332/4facfe?text=${encodeURIComponent(item.name)}`;
  };

  const getDiscountedPrice = (item: any) => {
    const price = Number(item.price) || 0;
    const salePercent = item.salePercent || 0;
    return salePercent > 0 ? price * (1 - salePercent / 100) : price;
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      alert('Thanh toán thành công! (Demo)');
      clear();
      setIsProcessing(false);
      navigate('/');
    }, 1500);
  };

  const subtotal = cart.reduce((sum, item) => {
    return sum + Number(item.price) * item.quantity;
  }, 0);

  const discount = subtotal - totalRaw;

  if (cart.length === 0) {
    return (
      <div className="checkoutPage">
        <div className="checkoutContainer">
          <div className="emptyCart">
            <div className="emptyIcon">🛒</div>
            <h2>Giỏ hàng trống</h2>
            <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
            <button className="emptyBtn" onClick={() => navigate('/store')}>
              Khám phá game ngay
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkoutPage">
      <div className="checkoutContainer">
        <div className="checkoutHeader">
          <h1>🛒 Giỏ hàng của bạn</h1>
          <p>{cart.length} sản phẩm đang chờ thanh toán</p>
        </div>

        <div className="checkoutContent">
          <div className="cartSection">
            {cart.map((item) => {
              const finalPrice = getDiscountedPrice(item);
              const hasDiscount = item.salePercent && item.salePercent > 0;

              return (
                <div key={item.id} className="cartItem">
                  <div className="itemImage">
                    <img src={getGameImage(item)} alt={item.name} />
                  </div>

                  <div className="itemDetails">
                    <h3 className="itemName">{item.name}</h3>
                    <div className="itemMeta">
                      {item.categories && item.categories.length > 0 && (
                        <span className="itemCategory">{item.categories[0].name}</span>
                      )}
                      {hasDiscount && (
                        <span className="itemDiscount">-{item.salePercent}%</span>
                      )}
                    </div>
                    <div className="itemPrice">
                      {hasDiscount && (
                        <span className="itemOriginalPrice">
                          {formatPrice(Number(item.price), currency)}
                        </span>
                      )}
                      <span className="itemCurrentPrice">
                        {formatPrice(finalPrice, currency)}
                      </span>
                    </div>
                  </div>

                  <div className="itemActions">
                    <div className="qtyControl">
                      <button 
                        className="qtyBtn" 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        className="qtyInput"
                        value={item.quantity}
                        min={1}
                        max={item.quantity || 99}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          updateQuantity(item.id, Math.max(1, val));
                        }}
                        title="Số lượng"
                        aria-label="Số lượng sản phẩm"
                      />
                      <button 
                        className="qtyBtn" 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button className="removeBtn" onClick={() => remove(item.id)}>
                      Xóa
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="orderSummary">
            <h2 className="summaryTitle">Tổng đơn hàng</h2>
            
            <div className="summaryRow">
              <span className="summaryLabel">Tạm tính ({cart.length} sản phẩm)</span>
              <span className="summaryValue">{formatPrice(subtotal, currency)}</span>
            </div>

            {discount > 0 && (
              <div className="summaryRow">
                <span className="summaryLabel">Giảm giá</span>
                <span className="summaryValue summaryDiscount">
                  -{formatPrice(discount, currency)}
                </span>
              </div>
            )}

            <div className="summaryRow">
              <span className="summaryLabel">Phí vận chuyển</span>
              <span className="summaryValue">Miễn phí</span>
            </div>

            <div className="summaryRow">
              <span className="summaryLabel summaryLabelTotal">
                Tổng cộng
              </span>
              <span className="summaryTotal">{formatPrice(totalRaw, currency)}</span>
            </div>

            <button 
              className="checkoutBtn" 
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? '⏳ Đang xử lý...' : '💳 Thanh toán ngay'}
            </button>

            <button className="continueBtn" onClick={() => navigate('/store')}>
              ← Tiếp tục mua sắm
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}



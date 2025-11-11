import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency, formatPrice } from '../context/CurrencyContext';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, updateQuantity, remove, totalRaw, clear } = useCart();
  const { currency } = useCurrency();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Kiểm tra đăng nhập khi vào trang checkout
  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('wgs_token');
    if (!token) {
      localStorage.setItem('redirect_after_login', '/checkout');
      navigate('/login', { replace: true });
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

  const totalRaw = cart.reduce((sum, item) => {
    const finalPrice = getDiscountedPrice(item);
    return sum + finalPrice * item.quantity;
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

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency, formatPrice } from '../context/CurrencyContext';
import { getGameImage as getGameImageUtil } from '../utils/imageUtils';
import { createMoMoPaymentWithItems, getBalance, createOrderWithBalance } from '../api/client';
import './CheckoutPage.css';

type PaymentMethod = 'balance' | 'momo';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, updateQuantity, remove, clear } = useCart();
  const { currency } = useCurrency();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'cart' | 'payment'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('balance');
  const [userBalance, setUserBalance] = useState<number>(0);
  
  // Payment form fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [momoPhone, setMomoPhone] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Kiểm tra đăng nhập khi vào trang checkout
  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('wgs_token');
    if (!token) {
      localStorage.setItem('redirect_after_login', '/checkout');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Fetch user balance
  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('wgs_token');
    if (token) {
      getBalance()
        .then((data) => {
          setUserBalance(data.balance || 0);
        })
        .catch(() => {
          setUserBalance(0);
        });
    }
  }, []);

  const getGameImage = (item: any) => {
    return item.image || item.cover || `https://via.placeholder.com/300x169/1a2332/4facfe?text=${encodeURIComponent(item.name)}`;
  };

  const getDiscountedPrice = (item: any) => {
    const price = Number(item.price) || 0;
    const salePercent = item.salePercent || 0;
    return salePercent > 0 ? price * (1 - salePercent / 100) : price;
  };

  const handleCheckout = async () => {
    if (step === 'cart') {
      setStep('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Validate payment info
    const newErrors: Record<string, string> = {};

    // Check balance if using balance payment
    if (paymentMethod === 'balance') {
      if (userBalance < totalRaw) {
        newErrors.balance = `Số dư không đủ. Bạn cần thêm ${formatPrice(totalRaw - userBalance, currency)}`;
      }
    }

    if (paymentMethod === 'momo') {
      if (!momoPhone || !/^(0|\+84)[0-9]{9,10}$/.test(momoPhone.replace(/\s/g, ''))) {
        newErrors.momoPhone = 'Số điện thoại MoMo không hợp lệ';
      }
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (phone && !/^[0-9]{9,11}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsProcessing(true);
    setErrors({});

    // Handle Balance payment
    if (paymentMethod === 'balance') {
      try {
        const orderData = {
          items: cart.map(item => ({
            gameId: item.id,
            quantity: item.quantity,
          })),
          email,
          phone,
        };

        const response = await createOrderWithBalance(orderData);
        
        alert(`✅ Thanh toán thành công!\n\nSố tiền: ${formatPrice(totalRaw, currency)}\nĐã trừ từ tài khoản của bạn.\n\nMã đơn hàng: ${response.orderId || 'N/A'}`);
        clear();
        setIsProcessing(false);
        navigate('/orders');
        return;
      } catch (error: any) {
        setIsProcessing(false);
        const errorMsg = error?.response?.data?.message || error?.message || 'Không thể thanh toán bằng số dư';
        alert(`❌ Lỗi thanh toán:\n\n${errorMsg}`);
        return;
      }
    }

    // Handle MoMo payment
    if (paymentMethod === 'momo') {
      try {
        const gameNames = cart.map(item => item.name).join(', ');
        const orderInfo = `Mua game: ${gameNames.slice(0, 100)}${gameNames.length > 100 ? '...' : ''}`;
        const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        try {
          // Use new API with items
          const momoResponse = await createMoMoPaymentWithItems({
            orderId,
            amount: totalRaw,
            orderInfo,
            items: cart.map(item => ({
              gameId: item.id,
              gameName: item.name,
              unitPrice: Number(item.price),
              quantity: item.quantity,
              salePercent: item.salePercent || 0,
            })),
          });

          // Save order info to localStorage for callback
          localStorage.setItem('pending_order', JSON.stringify({
            orderId: momoResponse.orderId,
            amount: totalRaw,
            cart,
            email,
            phone,
            timestamp: Date.now(),
          }));

          // Redirect to MoMo payment page
          if (momoResponse.payUrl) {
            // Open MoMo deeplink if on mobile, otherwise use payUrl
            if (momoResponse.deeplink && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
              window.location.href = momoResponse.deeplink;
            } else {
              window.location.href = momoResponse.payUrl;
            }
            return;
          }
        } catch (apiError: any) {
          console.error('MoMo API error:', apiError);
          setIsProcessing(false);
          
          const errorDetail = apiError?.response?.data?.message || apiError?.message || 'Không rõ lỗi';
          alert(
            `❌ Lỗi kết nối MoMo API\n\n` +
            `Chi tiết: ${errorDetail}\n\n` +
            `Vui lòng kiểm tra:\n` +
            `- Backend đã chạy chưa?\n` +
            `- MoMo credentials đã đúng chưa?\n` +
            `- Kết nối mạng ổn định không?`
          );
          return;
        }
        
        throw new Error('Không nhận được URL thanh toán từ MoMo');
      } catch (error: any) {
        setIsProcessing(false);
        const errorMsg = error?.response?.data?.message || error?.message || 'Không thể tạo giao dịch MoMo';
        alert(`❌ Lỗi thanh toán MoMo:\n\n${errorMsg}\n\nVui lòng thử lại hoặc chọn phương thức thanh toán khác.`);
      }
      return;
    }
  };

  // Calculate totals
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

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19); // 16 digits + 3 spaces
  };

  // Format expiry date
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <div className="checkoutPage">
      <div className="checkoutContainer">
        <div className="checkoutHeader">
          <button className="backBtn" onClick={() => step === 'payment' ? setStep('cart') : navigate('/store')}>
            ← {step === 'payment' ? 'Quay lại giỏ hàng' : 'Tiếp tục mua sắm'}
          </button>
          <h1>{step === 'cart' ? '🛒 Giỏ hàng của bạn' : '💳 Thanh toán'}</h1>
          <p>{step === 'cart' ? `${cart.length} sản phẩm` : 'Hoàn tất đơn hàng'}</p>
        </div>

        <div className="checkoutContent">
          {step === 'cart' ? (
            // STEP 1: Cart Review
            <>
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
                          🗑️ Xóa
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
                  <span className="summaryLabel summaryLabelTotal">Tổng cộng</span>
                  <span className="summaryTotal">{formatPrice(totalRaw, currency)}</span>
                </div>

                <button 
                  className="checkoutBtn" 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  Tiếp tục thanh toán →
                </button>
              </div>
            </>
          ) : (
            // STEP 2: Payment
            <>
              <div className="paymentSection">
                <div className="paymentMethods">
                  <h3>Chọn phương thức thanh toán</h3>
                  <div className="methodGrid">
                    <button
                      className={`methodCard ${paymentMethod === 'balance' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('balance')}
                    >
                      <div className="methodIcon">🪙</div>
                      <div className="methodName">Số dư tài khoản</div>
                      <div className="methodDesc">
                        Số dư: {formatPrice(userBalance, currency)}
                      </div>
                      {userBalance < totalRaw && (
                        <div className="methodWarning">
                          ⚠️ Số dư không đủ
                        </div>
                      )}
                    </button>

                    <button
                      className={`methodCard ${paymentMethod === 'momo' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('momo')}
                    >
                      <div className="momoIconWrapper">M</div>
                      <div className="methodName">Ví MoMo</div>
                      <div className="methodDesc">Thanh toán qua MoMo</div>
                    </button>
                  </div>
                </div>

                {paymentMethod === 'balance' && (
                  <div className="paymentForm balanceForm">
                    <div className="balanceHeader">
                      <div className="balanceIcon">🪙</div>
                      <h3>Thanh toán bằng số dư tài khoản</h3>
                    </div>

                    <div className="balanceInfo">
                      <div className="balanceRow">
                        <span>Số dư hiện tại:</span>
                        <span className="balanceValue">{formatPrice(userBalance, currency)}</span>
                      </div>
                      <div className="balanceRow">
                        <span>Tổng đơn hàng:</span>
                        <span className="balanceValue">{formatPrice(totalRaw, currency)}</span>
                      </div>
                      <div className="balanceRow highlight">
                        <span>Số dư sau thanh toán:</span>
                        <span className={`balanceValue ${userBalance - totalRaw < 0 ? 'negative' : ''}`}>
                          {formatPrice(userBalance - totalRaw, currency)}
                        </span>
                      </div>
                    </div>

                    {errors.balance && <div className="errorText">{errors.balance}</div>}

                    {userBalance < totalRaw && (
                      <div className="insufficientBalance">
                        <p>⚠️ Số dư không đủ. Vui lòng nạp thêm {formatPrice(totalRaw - userBalance, currency)}</p>
                        <button 
                          className="topupButton"
                          onClick={() => navigate('/topup')}
                        >
                          Nạp tiền ngay
                        </button>
                      </div>
                    )}

                    <div className="formGroup">
                      <label>Email nhận hóa đơn *</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {errors.email && <span className="errorText">{errors.email}</span>}
                    </div>

                    <div className="formGroup">
                      <label>Số điện thoại (tuỳ chọn)</label>
                      <input
                        type="tel"
                        placeholder="0901234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      {errors.phone && <span className="errorText">{errors.phone}</span>}
                    </div>
                  </div>
                )}

                {paymentMethod === 'momo' && (
                      onClick={() => setPaymentMethod('banking')}
                    >
                      <div className="methodIcon">🏦</div>
                      <div className="methodName">Chuyển khoản</div>
                      <div className="methodDesc">Internet Banking</div>
                    </button>
                  </div>
                </div>

                {paymentMethod === 'momo' && (
                  <div className="paymentForm momoForm">
                    <div className="momoHeader">
                      <div className="momoLogo">M</div>
                      <h3>Thanh toán qua MoMo</h3>
                      <p>Quét mã QR hoặc nhập số điện thoại MoMo để thanh toán</p>
                    </div>

                    <div className="momoQR">
                      <div className="momoQRCode">
                        <div className="icon">📱</div>
                        <div className="label">Mã QR MoMo</div>
                      </div>
                      <p>Mở ứng dụng MoMo → Quét mã → Thanh toán</p>
                    </div>

                    <div className="momoDivider">HOẶC</div>

                    <div className="formGroup">
                      <label>Số điện thoại MoMo *</label>
                      <input
                        type="tel"
                        placeholder="0901234567"
                        value={momoPhone}
                        onChange={(e) => setMomoPhone(e.target.value.replace(/\D/g, ''))}
                        className={errors.momoPhone ? 'error' : ''}
                        maxLength={11}
                      />
                      {errors.momoPhone && <span className="errorText">{errors.momoPhone}</span>}
                      <small>Nhập số điện thoại đăng ký MoMo của bạn</small>
                    </div>

                    <div className="momoFeatures">
                      <div className="title">✨ Ưu đãi với MoMo:</div>
                      <ul>
                        <li>Hoàn tiền 10% cho đơn hàng đầu tiên</li>
                        <li>Tích điểm MoMo sau mỗi giao dịch</li>
                        <li>Thanh toán an toàn, bảo mật tuyệt đối</li>
                      </ul>
                    </div>
                  </div>
                )}

                {paymentMethod === 'credit_card' && (
                  <div className="paymentForm">
                    <h3>Thông tin thẻ</h3>
                    
                    <div className="formGroup">
                      <label>Số thẻ *</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        className={errors.cardNumber ? 'error' : ''}
                        maxLength={19}
                      />
                      {errors.cardNumber && <span className="errorText">{errors.cardNumber}</span>}
                    </div>

                    <div className="formGroup">
                      <label>Tên chủ thẻ *</label>
                      <input
                        type="text"
                        placeholder="NGUYEN VAN A"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        className={errors.cardName ? 'error' : ''}
                      />
                      {errors.cardName && <span className="errorText">{errors.cardName}</span>}
                    </div>

                    <div className="formRow">
                      <div className="formGroup">
                        <label>Ngày hết hạn *</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          className={errors.cardExpiry ? 'error' : ''}
                          maxLength={5}
                        />
                        {errors.cardExpiry && <span className="errorText">{errors.cardExpiry}</span>}
                      </div>

                      <div className="formGroup">
                        <label>CVV *</label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          className={errors.cardCvv ? 'error' : ''}
                          maxLength={3}
                        />
                        {errors.cardCvv && <span className="errorText">{errors.cardCvv}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="paymentInfo">
                    <div className="infoBox">
                      <p>🅿️ Bạn sẽ được chuyển đến trang PayPal để hoàn tất thanh toán.</p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'banking' && (
                  <div className="paymentInfo">
                    <div className="infoBox">
                      <h4>Thông tin chuyển khoản</h4>
                      <p><strong>Ngân hàng:</strong> Vietcombank</p>
                      <p><strong>Số tài khoản:</strong> 1234567890</p>
                      <p><strong>Chủ tài khoản:</strong> CONG TY GAME STORE</p>
                      <p><strong>Số tiền:</strong> {formatPrice(totalRaw, currency)}</p>
                      <p><strong>Nội dung:</strong> Thanh toan don hang</p>
                    </div>
                  </div>
                )}

                <div className="contactForm">
                  <h3>Thông tin liên hệ</h3>
                  
                  <div className="formGroup">
                    <label>Email *</label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="errorText">{errors.email}</span>}
                    <small>Mã kích hoạt game sẽ được gửi đến email này</small>
                  </div>

                  <div className="formGroup">
                    <label>Số điện thoại</label>
                    <input
                      type="tel"
                      placeholder="0901234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className={errors.phone ? 'error' : ''}
                      maxLength={11}
                    />
                    {errors.phone && <span className="errorText">{errors.phone}</span>}
                  </div>
                </div>
              </div>

              <div className="orderSummary">
                <h2 className="summaryTitle">Đơn hàng của bạn</h2>
                
                {cart.map((item) => {
                  const finalPrice = getDiscountedPrice(item);
                  return (
                    <div key={item.id} className="summaryItem">
                      <div className="summaryItemInfo">
                        <span className="summaryItemName">{item.name}</span>
                        <span className="summaryItemQty">x{item.quantity}</span>
                      </div>
                      <span className="summaryItemPrice">
                        {formatPrice(finalPrice * item.quantity, currency)}
                      </span>
                    </div>
                  );
                })}

                <div className="summaryDivider"></div>

                <div className="summaryRow">
                  <span className="summaryLabel">Tạm tính</span>
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
                  <span className="summaryLabel summaryLabelTotal">Tổng cộng</span>
                  <span className="summaryTotal">{formatPrice(totalRaw, currency)}</span>
                </div>

                <button 
                  className="checkoutBtn" 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? '⏳ Đang xử lý...' : '🔒 Thanh toán ngay'}
                </button>

                <div className="securityInfo">
                  <p>🔒 Thông tin của bạn được bảo mật</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

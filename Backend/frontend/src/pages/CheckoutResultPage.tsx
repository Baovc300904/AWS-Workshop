import { useEffect, useMemo } from 'react';

function toMoMoQrData(payUrl: string) {
  // Nhiều payUrl của MoMo là deeplink chứa params. Ta hiển thị trực tiếp payUrl thành QR để sandbox quét giả lập.
  return payUrl;
}

export default function CheckoutResultPage() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const resultCode = params.get('resultCode');
  const message = params.get('message');
  const orderId = params.get('orderId');
  const amount = params.get('amount');
  const payUrl = params.get('payUrl') || '';

  useEffect(() => {
    // Clear temp checkout storage after redirect
    try { localStorage.removeItem('checkout_items'); } catch {}
  }, []);

  return (
    <div style={{ maxWidth: 720, margin: '48px auto', padding: 16 }}>
      <h2>Kết quả thanh toán</h2>
      <div style={{ marginTop: 12 }}>
        <div><b>Order ID:</b> {orderId || '-'}</div>
        <div><b>Amount:</b> {amount || '-'}</div>
        <div><b>Code:</b> {resultCode || '-'}</div>
        <div><b>Message:</b> {message || '-'}</div>
      </div>
      {payUrl && (
        <div style={{ marginTop: 24 }}>
          <div style={{ marginBottom: 8 }}><b>Quét QR (sandbox)</b></div>
          <img
            alt="QR"
            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(toMoMoQrData(payUrl))}`}
            style={{ border: '1px solid #ddd', padding: 8, background: '#fff' }}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>Hoặc mở link: <a href={payUrl} target="_blank" rel="noreferrer">{payUrl}</a></div>
        </div>
      )}
      <div style={{ marginTop: 16 }}>
        <a href="/">Về trang chủ</a>
      </div>
    </div>
  );
}



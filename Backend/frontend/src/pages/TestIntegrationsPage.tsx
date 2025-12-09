import React, { useState } from 'react';
import { requestEmailOtp, createMomoPayment } from '../api/client';

export default function TestIntegrationsPage() {
  const [email, setEmail] = useState('');
  const [otpStatus, setOtpStatus] = useState<string>('');

  const [amount, setAmount] = useState<number>(10000);
  const [orderId, setOrderId] = useState<string>('ORDER_' + Date.now());
  const [momoUrl, setMomoUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const sendEmailOtp = async () => {
    setError(''); setOtpStatus(''); setLoading(true);
    try {
      await requestEmailOtp(email);
      setOtpStatus('Đã gửi OTP tới email.');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Gửi OTP thất bại');
    } finally { setLoading(false); }
  };

  const createMomo = async () => {
    setError(''); setMomoUrl(''); setLoading(true);
    try {
      const res = await createMomoPayment(orderId, Number(amount)||0, 'Thanh toan test');
      const url = res?.payUrl || res?.deeplink || '';
      if (url) {
        setMomoUrl(url);
        window.open(url, '_blank');
      } else {
        setError('MoMo trả về không có payUrl');
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Tạo thanh toán MoMo thất bại');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Test Integrations</h2>
      <section style={{ marginBottom: 24 }}>
        <h3>Email OTP</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="email" placeholder="your@gmail.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <button onClick={sendEmailOtp} disabled={loading || !email}>Gửi OTP</button>
        </div>
        {otpStatus && <div style={{ color: 'green', marginTop: 8 }}>{otpStatus}</div>}
      </section>

      <section>
        <h3>MoMo Sandbox</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="text" placeholder="ORDER_ID" value={orderId} onChange={(e)=>setOrderId(e.target.value)} />
          <input type="number" placeholder="Amount" value={amount} onChange={(e)=>setAmount(Number(e.target.value)||0)} />
          <button onClick={createMomo} disabled={loading || !orderId || !amount}>Tạo thanh toán</button>
          {momoUrl && <a href={momoUrl} target="_blank" rel="noreferrer">Open payUrl</a>}
        </div>
      </section>

      {error && <div style={{ color: 'crimson', marginTop: 16 }}>{error}</div>}
    </div>
  );
}



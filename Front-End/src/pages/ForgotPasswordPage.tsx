import { useState } from 'react';
import { forgotPhoneRequest, forgotPhoneConfirm } from '../api/client';
import { useNavigate } from 'react-router-dom';

export function ForgotPasswordPage() {
  const [step, setStep] = useState<'username' | 'otp'>('username');
  const [username, setUsername] = useState('');
  const [maskedPhone, setMaskedPhone] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const navigate = useNavigate();

  const onRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      await forgotPhoneRequest(username);
      // For UX, show masked form hint; since backend does not return it, we just show generic text
      setMaskedPhone('Số điện thoại đã đăng ký (đã ẩn)');
      setInfo('Đã gửi mã OTP tới số điện thoại đã đăng ký.');
      setStep('otp');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Không thể gửi OTP');
    } finally {
      setLoading(false);
    }
  };

  const onConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      await forgotPhoneConfirm(username, otp, newPassword);
      setInfo('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Xác nhận OTP thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      {step === 'username' && (
        <form onSubmit={onRequest} style={{ width: 420, padding: 24, border: '1px solid #e5e7eb', borderRadius: 12 }}>
          <h2 style={{ marginTop: 0, marginBottom: 16 }}>Quên mật khẩu</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <button type="submit" disabled={loading}>Gửi OTP</button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {info && <div style={{ color: '#2563eb' }}>{info}</div>}
            <button type="button" onClick={() => navigate('/login')} style={{ background: 'transparent', border: 'none', color: '#2563eb', textDecoration: 'underline', cursor: 'pointer' }}>Back to sign in</button>
          </div>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={onConfirm} style={{ width: 420, padding: 24, border: '1px solid #e5e7eb', borderRadius: 12 }}>
          <h2 style={{ marginTop: 0, marginBottom: 16 }}>Xác nhận OTP</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {maskedPhone && <div style={{ color: '#475569', fontSize: 14 }}>{maskedPhone}</div>}
            <input placeholder="Mã OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            <input placeholder="Mật khẩu mới" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <button type="submit" disabled={loading}>Đổi mật khẩu</button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {info && <div style={{ color: '#2563eb' }}>{info}</div>}
            <button type="button" onClick={() => navigate('/login')} style={{ background: 'transparent', border: 'none', color: '#2563eb', textDecoration: 'underline', cursor: 'pointer' }}>Back to sign in</button>
          </div>
        </form>
      )}
    </div>
  );
}



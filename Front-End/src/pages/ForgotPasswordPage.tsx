import { useState } from 'react';
import { forgotPhoneRequest, forgotPhoneConfirm } from '../api/client';
import { useNavigate, Link } from 'react-router-dom';
import { ErrorModal } from '../components/common/ErrorModal';
import './ForgotPasswordPage.css';

export function ForgotPasswordPage() {
  const [step, setStep] = useState<'username' | 'otp'>('username');
  const [username, setUsername] = useState('');
  const [maskedPhone, setMaskedPhone] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>('');
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
      setModalMessage(`📱 Mã OTP đã được gửi tới số điện thoại đã đăng ký của bạn.\n\nVui lòng kiểm tra tin nhắn và nhập mã OTP để tiếp tục.`);
      setShowSuccessModal(true);
      setStep('otp');
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message ?? 'Không thể gửi OTP. Vui lòng kiểm tra username và thử lại.';
      setError(errorMsg);
      setModalMessage(errorMsg);
      setShowErrorModal(true);
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
      setModalMessage(`🎉 Đổi mật khẩu thành công!\n\nBạn có thể đăng nhập với mật khẩu mới ngay bây giờ.`);
      setShowSuccessModal(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message ?? 'Xác nhận OTP thất bại. Vui lòng kiểm tra lại mã OTP.';
      setError(errorMsg);
      setModalMessage(errorMsg);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgotPasswordContainer">
      <div className="forgotPasswordCard">
        {step === 'username' && (
          <form onSubmit={onRequest} className="forgotPasswordForm">
            <div className="forgotPasswordHeader">
              <h2 className="forgotPasswordTitle">🔒 Quên mật khẩu</h2>
              <p className="forgotPasswordSubtitle">Nhập username để nhận mã OTP qua điện thoại</p>
            </div>
            <div className="forgotPasswordBody">
              <div className="forgotPasswordField">
                <label htmlFor="username" className="forgotPasswordLabel">Username</label>
                <input
                  id="username"
                  className="forgotPasswordInput"
                  placeholder="Nhập username của bạn"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              {error && <div className="forgotPasswordError">⚠️ {error}</div>}
              {info && <div className="forgotPasswordInfo">✅ {info}</div>}
            </div>
            <div className="forgotPasswordActions">
              <button type="submit" className="forgotPasswordButton" disabled={loading}>
                {loading ? '⏳ Đang gửi...' : '📧 Gửi mã OTP'}
              </button>
              <Link to="/login" className="forgotPasswordBackLink">
                ← Quay lại đăng nhập
              </Link>
            </div>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={onConfirm} className="forgotPasswordForm">
            <div className="forgotPasswordHeader">
              <h2 className="forgotPasswordTitle">🔐 Xác nhận OTP</h2>
              <p className="forgotPasswordSubtitle">Nhập mã OTP và mật khẩu mới</p>
            </div>
            <div className="forgotPasswordBody">
              {maskedPhone && <div className="forgotPasswordInfo">📱 {maskedPhone}</div>}
              <div className="forgotPasswordField">
                <label htmlFor="otp" className="forgotPasswordLabel">Mã OTP</label>
                <input
                  id="otp"
                  className="forgotPasswordInput"
                  placeholder="Nhập mã OTP 6 chữ số"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
              <div className="forgotPasswordField">
                <label htmlFor="newPassword" className="forgotPasswordLabel">Mật khẩu mới</label>
                <input
                  id="newPassword"
                  className="forgotPasswordInput"
                  placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
              {error && <div className="forgotPasswordError">⚠️ {error}</div>}
              {info && <div className="forgotPasswordInfo">✅ {info}</div>}
            </div>
            <div className="forgotPasswordActions">
              <button type="submit" className="forgotPasswordButton" disabled={loading}>
                {loading ? '⏳ Đang xác nhận...' : '🔑 Đổi mật khẩu'}
              </button>
              <Link to="/login" className="forgotPasswordBackLink">
                ← Quay lại đăng nhập
              </Link>
            </div>
          </form>
        )}
      </div>

      {/* Error Modal */}
      <ErrorModal 
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Đã xảy ra lỗi"
        message={modalMessage}
        type="error"
      />

      {/* Success Modal */}
      <ErrorModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={step === 'username' ? 'OTP đã được gửi' : 'Đổi mật khẩu thành công'}
        message={modalMessage}
        type="success"
      />
    </div>
  );
}




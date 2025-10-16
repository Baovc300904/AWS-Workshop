import React, { useCallback, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as apiRegister, requestPhoneOtp, RegisterPayload } from '../api/client';
import './RegisterPage.css';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  // Refs for inputs
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confirmRef = useRef<HTMLInputElement | null>(null);
  const firstNameRef = useRef<HTMLInputElement | null>(null);
  const lastNameRef = useRef<HTMLInputElement | null>(null);
  const dobRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const otpRef = useRef<HTMLInputElement | null>(null);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const onRequestOtp = useCallback(async () => {
    setError(null);
    setInfo(null);
    const phone = phoneRef.current?.value?.trim() || '';
    if (!phone) { setError('Vui lòng nhập số điện thoại trước khi nhận OTP'); return; }
    try {
      setSendingOtp(true);
      const code = await requestPhoneOtp(phone);
      // For demo: backend returns code. In production you would not show this.
      setInfo(`OTP đã gửi. Mã (demo): ${code}`);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Gửi OTP thất bại');
    } finally {
      setSendingOtp(false);
    }
  }, []);

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setInfo(null);

    const username = usernameRef.current?.value?.trim() || '';
    const password = passwordRef.current?.value || '';
    const confirm = confirmRef.current?.value || '';
    const firstName = firstNameRef.current?.value?.trim();
    const lastName = lastNameRef.current?.value?.trim();
    const dob = dobRef.current?.value || undefined; // yyyy-MM-dd from input[type=date]
    const phone = phoneRef.current?.value?.trim();
    const phoneOtp = otpRef.current?.value?.trim();

    if (!username) { setError('Vui lòng nhập username'); return; }
    if (!password) { setError('Vui lòng nhập mật khẩu'); return; }
    if (password.length < 6) { setError('Mật khẩu tối thiểu 6 ký tự'); return; }
    if (password !== confirm) { setError('Xác nhận mật khẩu không khớp'); return; }

    const payload: RegisterPayload = {
      username,
      password,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      dob: dob || undefined,
      phone: phone || undefined,
      phoneOtp: phoneOtp || undefined,
    };

    try {
      setSubmitting(true);
      await apiRegister(payload);
      setInfo('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
      setTimeout(() => navigate('/login'), 900);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Đăng ký thất bại');
    } finally {
      setSubmitting(false);
    }
  }, [navigate, submitting]);

  return (
    <div className="registerContainer">
      <div className="registerCard">
        <div className="registerLeft">
          <div className="registerFace">
            <svg width="160" height="160" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <circle cx="60" cy="60" r="56" fill="#bfe4f5" />
              <circle cx="45" cy="55" r="6" fill="#2f5672" />
              <circle cx="75" cy="55" r="6" fill="#2f5672" />
              <path d="M 42 78 Q 60 92 78 78" stroke="#2f5672" strokeWidth="4" fill="none" />
            </svg>
          </div>
          <div className="registerIntro">
            <h3>Tạo tài khoản</h3>
            <p>Nhanh chóng và miễn phí. Bắt đầu trải nghiệm ngay hôm nay.</p>
          </div>
        </div>
        <div className="registerRight">
          <form className="registerForm" onSubmit={onSubmit}>
            <div className="registerHeader">
              <h2 className="registerTitle">Đăng ký</h2>
              <p className="registerSubtitle">Điền thông tin bên dưới để tạo tài khoản mới</p>
            </div>

            <div className="registerGrid">
              <div className="fieldGroup fullRow">
                <label htmlFor="username" className="fieldLabel">Username</label>
                <input id="username" ref={usernameRef} type="text" autoComplete="username" placeholder="nhập username" maxLength={256} />
              </div>

              <div className="fieldGroup">
                <label htmlFor="password" className="fieldLabel">Mật khẩu</label>
                <div className="inlineFieldRow">
                  <input id="password" ref={passwordRef} type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="mật khẩu" />
                  <button type="button" className="inlineBtn" onClick={() => setShowPassword(v => !v)}>
                    {showPassword ? 'Ẩn' : 'Hiện'}
                  </button>
                </div>
              </div>

              <div className="fieldGroup">
                <label htmlFor="confirm" className="fieldLabel">Xác nhận mật khẩu</label>
                <input id="confirm" ref={confirmRef} type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="nhập lại mật khẩu" />
              </div>

              <div className="fieldGroup">
                <label className="fieldLabel" htmlFor="firstName">Họ</label>
                <input id="firstName" ref={firstNameRef} type="text" placeholder="Họ (tùy chọn)" />
              </div>

              <div className="fieldGroup">
                <label className="fieldLabel" htmlFor="lastName">Tên</label>
                <input id="lastName" ref={lastNameRef} type="text" placeholder="Tên (tùy chọn)" />
              </div>

              <div className="fieldGroup">
                <label htmlFor="dob" className="fieldLabel">Ngày sinh</label>
                <input id="dob" ref={dobRef} type="date" />
              </div>

              <div className="fieldGroup">
                <label htmlFor="phone" className="fieldLabel">Số điện thoại</label>
                <div className="inlineFieldRow">
                  <input id="phone" ref={phoneRef} type="tel" inputMode="tel" placeholder="VD: 0901234567" />
                  <button type="button" className="inlineBtn" onClick={onRequestOtp} disabled={sendingOtp}>
                    {sendingOtp ? 'Đang gửi' : 'Nhận OTP'}
                  </button>
                </div>
              </div>

              <div className="fieldGroup fullRow">
                <label htmlFor="otp" className="fieldLabel">Mã OTP</label>
                <input id="otp" ref={otpRef} type="text" inputMode="numeric" placeholder="Nhập mã OTP (nếu có)" />
              </div>

              {error && <div className="regError fullRow" role="alert">{error}</div>}
              {info && <div className="regInfo fullRow">{info}</div>}
            </div>

            <div className="actions">
              <button className="primaryBtn" type="submit" disabled={submitting}>
                {submitting ? 'Đang đăng ký...' : 'Tạo tài khoản'}
              </button>
              <div className="secondaryActions">
                <span>Đã có tài khoản?</span>
                <Link to="/login" className="registerLink">Đăng nhập</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
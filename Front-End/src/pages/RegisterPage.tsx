import React, { useCallback, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as apiRegister, requestEmailOtp, RegisterPayload } from '../api/client';
import { ErrorModal } from '../components/common/ErrorModal';
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
  const emailRef = useRef<HTMLInputElement | null>(null);
  const emailOtpRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>('');

  const onRequestEmailOtp = useCallback(async () => {
    setError(null);
    setInfo(null);
    const email = emailRef.current?.value?.trim() || '';
    
    if (!email) { 
      setError('❌ Vui lòng nhập email trước khi nhận OTP'); 
      return; 
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('❌ Email không hợp lệ');
      return;
    }
    
    try {
      setSendingOtp(true);
      const code = await requestEmailOtp(email);
      // For demo: show code. In production, email would be sent by backend
      setInfo(`📧 OTP đã gửi đến ${email}. Mã demo: ${code} (Kiểm tra console log)`);
      setModalMessage(`📧 OTP đã được gửi đến ${email}.\n\nMã xác thực: ${code}\n\n(Trong môi trường production, mã này sẽ được gửi qua email)`);
      setShowSuccessModal(true);
    } catch (err: any) {
      const errorMsg = !err.response 
        ? 'Không thể gửi OTP. Vui lòng kiểm tra kết nối mạng và thử lại.'
        : (err?.response?.data?.message ?? err?.message ?? 'Gửi OTP thất bại');
      setError(errorMsg);
      setModalMessage(errorMsg);
      setShowErrorModal(true);
    } finally {
      setSendingOtp(false);
    }
  }, []);

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setInfo(null);
    setFieldErrors({});

    const username = usernameRef.current?.value?.trim() || '';
    const password = passwordRef.current?.value || '';
    const confirm = confirmRef.current?.value || '';
    const firstName = firstNameRef.current?.value?.trim();
    const lastName = lastNameRef.current?.value?.trim();
    const dob = dobRef.current?.value || undefined; // yyyy-MM-dd from input[type=date]
    const email = emailRef.current?.value?.trim();
    const emailOtp = emailOtpRef.current?.value?.trim();
    const phone = phoneRef.current?.value?.trim();

    // Client-side validation
    const errors: Record<string, string> = {};
    
    if (!username) {
      errors.username = 'Username là bắt buộc';
    } else if (username.length < 3) {
      errors.username = 'Username tối thiểu 3 ký tự';
    }

    if (!password) {
      errors.password = 'Mật khẩu là bắt buộc';
    } else if (password.length < 8) {
      errors.password = 'Mật khẩu tối thiểu 8 ký tự';
    }

    if (password !== confirm) {
      errors.confirm = 'Xác nhận mật khẩu không khớp';
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Email không hợp lệ';
    }

    if (phone && !/^(?:\+?84|0)?[0-9]{9,10}$/.test(phone)) {
      errors.phone = 'Số điện thoại không hợp lệ (VD: 0901234567)';
    }

    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 12) {
        errors.dob = 'Bạn phải ít nhất 12 tuổi';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Vui lòng kiểm tra lại thông tin');
      return;
    }

    const payload: RegisterPayload = {
      username,
      password,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      dob: dob || undefined,
      phone: phone || undefined,
      email: email || undefined,
      emailOtp: emailOtp || undefined,
    };

    try {
      setSubmitting(true);
      const result = await apiRegister(payload);
      setInfo(`✅ Đăng ký thành công! Chào mừng ${result.username}. Đang chuyển đến trang đăng nhập...`);
      setModalMessage(`🎉 Đăng ký thành công!\n\nChào mừng ${result.username} đến với cộng đồng của chúng tôi.\n\nBạn sẽ được chuyển đến trang đăng nhập sau giây lát...`);
      setShowSuccessModal(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      // Parse backend error messages
      const errorMsg = err?.response?.data?.message;
      let displayError = '';
      
      if (errorMsg) {
        // Map backend error codes to Vietnamese
        const errorMap: Record<string, string> = {
          'USERNAME_INVALID': 'Username phải có ít nhất 3 ký tự',
          'INVALID_PASSWORD': 'Mật khẩu phải có ít nhất 8 ký tự',
          'INVALID_DOB': 'Ngày sinh không hợp lệ (phải từ 12 tuổi trở lên)',
          'INVALID_EMAIL': 'Email không hợp lệ',
          'INVALID_PHONE': 'Số điện thoại không hợp lệ',
          'USER_EXISTED': 'Username đã tồn tại, vui lòng chọn tên khác',
        };
        displayError = errorMap[errorMsg] || errorMsg || 'Đăng ký thất bại';
      } else if (!err.response) {
        displayError = 'Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng và thử lại.';
      } else {
        displayError = err?.message || 'Đăng ký thất bại';
      }
      
      setError(displayError);
      setModalMessage(displayError);
      setShowErrorModal(true);
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
                <label htmlFor="username" className="fieldLabel">
                  Username <span className="required">*</span>
                </label>
                <input 
                  id="username" 
                  ref={usernameRef} 
                  type="text" 
                  autoComplete="username" 
                  placeholder="Tối thiểu 3 ký tự" 
                  maxLength={256}
                  className={fieldErrors.username ? 'error' : ''}
                />
                {fieldErrors.username && (
                  <span className="fieldError">{fieldErrors.username}</span>
                )}
              </div>

              <div className="fieldGroup">
                <label htmlFor="password" className="fieldLabel">
                  Mật khẩu <span className="required">*</span>
                </label>
                <div className="inlineFieldRow">
                  <input 
                    id="password" 
                    ref={passwordRef} 
                    type={showPassword ? 'text' : 'password'} 
                    autoComplete="new-password" 
                    placeholder="Tối thiểu 8 ký tự"
                    className={fieldErrors.password ? 'error' : ''}
                  />
                  <button type="button" className="inlineBtn" onClick={() => setShowPassword(v => !v)}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {fieldErrors.password && (
                  <span className="fieldError">{fieldErrors.password}</span>
                )}
              </div>

              <div className="fieldGroup">
                <label htmlFor="confirm" className="fieldLabel">
                  Xác nhận mật khẩu <span className="required">*</span>
                </label>
                <input 
                  id="confirm" 
                  ref={confirmRef} 
                  type={showPassword ? 'text' : 'password'} 
                  autoComplete="new-password" 
                  placeholder="Nhập lại mật khẩu"
                  className={fieldErrors.confirm ? 'error' : ''}
                />
                {fieldErrors.confirm && (
                  <span className="fieldError">{fieldErrors.confirm}</span>
                )}
              </div>

              <div className="fieldGroup">
                <label className="fieldLabel" htmlFor="firstName">Họ</label>
                <input id="firstName" ref={firstNameRef} type="text" placeholder="VD: Nguyễn" />
              </div>

              <div className="fieldGroup">
                <label className="fieldLabel" htmlFor="lastName">Tên</label>
                <input id="lastName" ref={lastNameRef} type="text" placeholder="VD: Văn A" />
              </div>

              <div className="fieldGroup">
                <label htmlFor="dob" className="fieldLabel">
                  📅 Ngày sinh
                </label>
                <input 
                  id="dob" 
                  ref={dobRef} 
                  type="date" 
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 12)).toISOString().split('T')[0]}
                  className={fieldErrors.dob ? 'error' : ''}
                  placeholder="dd/mm/yyyy"
                />
                {fieldErrors.dob && (
                  <span className="fieldError">{fieldErrors.dob}</span>
                )}
                <span className="fieldHint">Phải từ 12 tuổi trở lên</span>
              </div>

              <div className="fieldGroup fullRow">
                <label htmlFor="email" className="fieldLabel">
                  Email
                </label>
                <div className="inlineFieldRow">
                  <input 
                    id="email" 
                    ref={emailRef} 
                    type="email" 
                    placeholder="example@email.com"
                    className={fieldErrors.email ? 'error' : ''}
                  />
                  <button 
                    type="button" 
                    className="inlineBtn" 
                    onClick={onRequestEmailOtp} 
                    disabled={sendingOtp}
                  >
                    {sendingOtp ? '⏳ Đang gửi' : '📧 Gửi OTP'}
                  </button>
                </div>
                {fieldErrors.email && (
                  <span className="fieldError">{fieldErrors.email}</span>
                )}
                <span className="fieldHint">Nhấn "Gửi OTP" để nhận mã xác thực qua email</span>
              </div>

              <div className="fieldGroup fullRow">
                <label htmlFor="emailOtp" className="fieldLabel">Mã OTP (từ email)</label>
                <input 
                  id="emailOtp" 
                  ref={emailOtpRef} 
                  type="text" 
                  inputMode="numeric" 
                  placeholder="Nhập mã OTP 6 chữ số từ email" 
                  maxLength={6}
                />
                <span className="fieldHint">Kiểm tra email hoặc console log để lấy mã OTP</span>
              </div>

              <div className="fieldGroup fullRow">
                <label htmlFor="phone" className="fieldLabel">Số điện thoại</label>
                <input 
                  id="phone" 
                  ref={phoneRef} 
                  type="tel" 
                  inputMode="tel" 
                  placeholder="VD: 0901234567"
                  className={fieldErrors.phone ? 'error' : ''}
                />
                {fieldErrors.phone && (
                  <span className="fieldError">{fieldErrors.phone}</span>
                )}
                <span className="fieldHint">Tùy chọn - để liên hệ khi cần</span>
              </div>

              {error && <div className="regError fullRow" role="alert">⚠️ {error}</div>}
              {info && <div className="regInfo fullRow">{info}</div>}
            </div>

            <div className="actions">
              <button className="primaryBtn" type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <span>⏳ Đang đăng ký...</span>
                  </>
                ) : (
                  <>🚀 Tạo tài khoản</>
                )}
              </button>

              <div className="divider">
                <span>hoặc</span>
              </div>

              <button 
                type="button" 
                className="googleBtn"
                onClick={() => {
                  // TODO: Implement Google OAuth registration
                  console.log('Google register clicked');
                  alert('Tính năng đăng ký Google sẽ được triển khai sớm!');
                }}
              >
                <svg className="googleIcon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Đăng ký với Google
              </button>

              <div className="secondaryActions">
                <span>Đã có tài khoản?</span>
                <Link to="/login" className="registerLink">Đăng nhập ngay</Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal 
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Đăng ký thất bại"
        message={modalMessage}
        type="error"
      />

      {/* Success Modal */}
      <ErrorModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Đăng ký thành công"
        message={modalMessage}
        type="success"
      />
    </div>
  );
};

export default RegisterPage;
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { register, requestEmailOtp } from "../api/client";
import { useNavigate } from "react-router-dom";

// MorphSVGPlugin is a GSAP paid plugin, comment/remove if unavailable
// import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
// gsap.registerPlugin(MorphSVGPlugin);

const LoginPage: React.FC = () => {
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const submitRef = useRef<SVGPathElement | null>(null);
  const armsGroup = useRef<SVGGElement | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpStatus, setOtpStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const eyes = document.querySelectorAll(".eye");
    const mouth = document.querySelector(".mouth path");

    if (!usernameRef.current || !passwordRef.current || !submitRef.current) return;

    const handleUsernameChange = () => {
      if (!usernameRef.current) return;
      const length = usernameRef.current.value.length;
      gsap.to(eyes, {
        x: length * 2,
        duration: 0.3,
        overwrite: "auto",
      });
    };

    const handlePasswordFocus = () => {
      if (armsGroup.current) {
        gsap.to(armsGroup.current, { y: -10, duration: 0.3 });
      }
    };

    const handlePasswordBlur = () => {
      if (armsGroup.current) {
        gsap.to(armsGroup.current, { y: 0, duration: 0.3 });
      }
    };

    const handleSubmitHover = () => {
      gsap.to(mouth, { scaleX: 1.2, duration: 0.2 });
    };

    const handleSubmitLeave = () => {
      gsap.to(mouth, { scaleX: 1, duration: 0.2 });
    };

    usernameRef.current.addEventListener("input", handleUsernameChange);
    passwordRef.current.addEventListener("focus", handlePasswordFocus);
    passwordRef.current.addEventListener("blur", handlePasswordBlur);
    submitRef.current.addEventListener("mouseenter", handleSubmitHover);
    submitRef.current.addEventListener("mouseleave", handleSubmitLeave);

    return () => {
      usernameRef.current?.removeEventListener("input", handleUsernameChange);
      passwordRef.current?.removeEventListener("focus", handlePasswordFocus);
      passwordRef.current?.removeEventListener("blur", handlePasswordBlur);
      submitRef.current?.removeEventListener("mouseenter", handleSubmitHover);
      submitRef.current?.removeEventListener("mouseleave", handleSubmitLeave);
    };
  }, []);

  return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-300 to-purple-400">
        <div className="relative w-80 p-6 bg-white rounded-2xl shadow-lg">
          <svg
              className="mx-auto mb-4"
              width="120"
              height="120"
              viewBox="0 0 120 120"
              xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="60" cy="60" r="50" fill="#FFD1DC" />
            <circle className="eye" cx="45" cy="55" r="5" fill="#000" />
            <circle className="eye" cx="75" cy="55" r="5" fill="#000" />
            <g className="mouth">
              <path d="M 45 75 Q 60 90 75 75" stroke="#000" fill="transparent" strokeWidth="3" />
            </g>
            <g ref={armsGroup}>
              <path d="M 30 90 Q 20 70 30 60" stroke="#000" strokeWidth="3" fill="transparent" />
              <path d="M 90 90 Q 100 70 90 60" stroke="#000" strokeWidth="3" fill="transparent" />
            </g>
          </svg>

          <form className="flex flex-col space-y-3" onSubmit={async (e)=>{
            e.preventDefault();
            if (submitting) return;
            setError(null);
            setSubmitting(true);
            try {
              const payload = {
                username: usernameRef.current?.value?.trim() || "",
                password: passwordRef.current?.value || "",
                firstName: firstName || undefined,
                lastName: lastName || undefined,
                dob: dob || undefined, // yyyy-MM-dd
                email: email || undefined,
                emailOtp: email ? emailOtp || undefined : undefined,
                phone: phone || undefined,
              } as any;
              await register(payload);
              alert("Đăng ký thành công. Vui lòng đăng nhập.");
              navigate("/login");
            } catch (err: any) {
              setError(err?.response?.data?.message || "Đăng ký thất bại");
            } finally {
              setSubmitting(false);
            }
          }}>
            <input
                ref={usernameRef}
                type="text"
                placeholder="Username"
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                required
            />
            <input
                ref={passwordRef}
                type="password"
                placeholder="Password (>= 8 ký tự)"
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                required
            />
            <div className="grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <input type="text" placeholder="First name" value={firstName} onChange={(e)=>setFirstName(e.target.value)} className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400" />
              <input type="text" placeholder="Last name" value={lastName} onChange={(e)=>setLastName(e.target.value)} className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400" />
            </div>
            <input type="date" placeholder="YYYY-MM-DD" value={dob} onChange={(e)=>setDob(e.target.value)} className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400" />
            <div className="grid" style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:8 }}>
              <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400" />
              <button type="button" onClick={async()=>{
                try { setOtpStatus(null); setError(null); if(!email) { setError("Vui lòng nhập email"); return; }
                  await requestEmailOtp(email);
                  setOtpStatus("Đã gửi OTP tới email");
                } catch (e:any) { setError(e?.response?.data?.message || "Gửi OTP thất bại"); }
              }} className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Gửi OTP</button>
            </div>
            <input type="text" placeholder="Số điện thoại (tuỳ chọn)" value={phone} onChange={(e)=>setPhone(e.target.value)} className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400" />
            {!!email && (
              <input type="text" placeholder="OTP" value={emailOtp} onChange={(e)=>setEmailOtp(e.target.value)} className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400" />
            )}
            {otpStatus && <div style={{ color:'green' }}>{otpStatus}</div>}
            {error && <div style={{ color:'crimson' }}>{error}</div>}
            <button
                ref={submitRef as React.RefObject<HTMLButtonElement>}
                type="submit"
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                disabled={submitting}
            >
              {submitting ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
            <div style={{ textAlign:'center' }}>
              <a href="/login" style={{ color:'#2563eb' }}>Đã có tài khoản? Đăng nhập</a>
            </div>
          </form>
        </div>
      </div>
  );
};

export default LoginPage;
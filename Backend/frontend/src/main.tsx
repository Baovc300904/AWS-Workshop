import './styles.css';
import './pages/LoginPage.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CheckoutResultPage from './pages/CheckoutResultPage';
import { HomePage } from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TestIntegrationsPage from './pages/TestIntegrationsPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { setAuthToken, introspect } from './api/client';
import { useEffect, useState } from 'react';

const token = localStorage.getItem('token');
setAuthToken(token);

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const [status, setStatus] = useState<'checking' | 'allowed' | 'redirect'>('checking');

  useEffect(() => {
    const tokenLS = localStorage.getItem('token');
    if (!tokenLS) {
      setStatus('redirect');
      return;
    }
    introspect(tokenLS)
      .then((valid) => setStatus(valid ? 'allowed' : 'redirect'))
      .catch(() => setStatus('redirect'));
  }, []);

  if (status === 'checking') return <div style={{ padding: 24 }}>Loading...</div>;
  if (status === 'redirect') return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }: { children: React.ReactElement }) {
  const [status, setStatus] = useState<'checking' | 'allowed' | 'redirect'>('checking');
  useEffect(() => {
    const tokenLS = localStorage.getItem('token');
    if (!tokenLS) { setStatus('redirect'); return; }
    introspect(tokenLS)
      .then((valid) => {
        if (!valid) { setStatus('redirect'); return; }
        const raw = localStorage.getItem('user');
        let isAdmin = false;
        try { const u = raw ? JSON.parse(raw) : {}; const roles = (u?.roles||u?.authorities||[]).map((r:any)=> (r?.authority||r).toString()); isAdmin = roles.includes('ROLE_ADMIN'); } catch {}
        setStatus(isAdmin ? 'allowed' : 'redirect');
      })
      .catch(() => setStatus('redirect'));
  }, []);
  if (status === 'checking') return <div style={{ padding: 24 }}>Loading...</div>;
  if (status === 'redirect') return <Navigate to="/" replace />;
  return children;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true }}>
      <Routes>
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/checkout/result" element={<CheckoutResultPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/test" element={<TestIntegrationsPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

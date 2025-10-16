import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles.css';
import './design-system.css';
import './styles/tokens.css';
import './styles/utilities.css';
import './App.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BackToTop from './components/ui/BackToTop';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { WishlistProvider } from './context/WishlistContext';
import { setAuthToken, introspect } from './api/client';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));
const ModeratorPage = lazy(() => import('./pages/ModeratorPage'));

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

  if (status === 'checking')
    return <div className="loading-screen">Đang tải...</div>;
  if (status === 'redirect') return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }: { children: React.ReactElement }) {
  const [status, setStatus] = useState<'checking' | 'allowed' | 'redirect'>('checking');
  
  useEffect(() => {
    const tokenLS = localStorage.getItem('token');
    if (!tokenLS) {
      setStatus('redirect');
      return;
    }
    introspect(tokenLS)
      .then((valid) => {
        if (!valid) {
          setStatus('redirect');
          return;
        }
        const raw = localStorage.getItem('user');
        let isAdmin = false;
        try {
          const u = raw ? JSON.parse(raw) : {};
          const roles = (u?.roles || u?.authorities || []).map((r: any) =>
            (r?.authority || r).toString()
          );
          isAdmin = roles.includes('ROLE_ADMIN');
        } catch {}
        setStatus(isAdmin ? 'allowed' : 'redirect');
      })
      .catch(() => setStatus('redirect'));
  }, []);

  if (status === 'checking')
    return <div className="loading-screen">Đang tải...</div>;
  if (status === 'redirect') return <Navigate to="/" replace />;
  return children;
}

// Set auth token on app init
const token = localStorage.getItem('token');
if (token) setAuthToken(token);

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
      <CurrencyProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="app-shell">
              <Navbar />
              <main className="app-main">
                <Suspense fallback={<div className="loading-screen">Đang tải...</div>}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <CheckoutPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot" element={<ForgotPasswordPage />} />
                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <AdminPage />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/moderator"
                      element={
                        <ProtectedRoute>
                          <ModeratorPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </main>
              <BackToTop />
              <Footer />
            </div>
          </WishlistProvider>
        </CartProvider>
      </CurrencyProvider>
    </BrowserRouter>
  );
}

export default App;

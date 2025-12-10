import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './styles.css';
import './design-system.css';
import './styles/tokens.css';
import './styles/utilities.css';
import './App.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BackToTop from './components/ui/BackToTop';
import ZaloButton from './components/ui/ZaloButton';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { introspect } from './api/client';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const StorePage = lazy(() => import('./pages/StorePage').then(m => ({ default: m.StorePage })));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage').then(m => ({ default: m.default })));
const TestCategories = lazy(() => import('./pages/TestCategories'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
<<<<<<< HEAD
const MoMoCallbackPage = lazy(() => import('./pages/MoMoCallbackPage'));
=======
>>>>>>> origin/main
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const GameDetailPage = lazy(() => import('./pages/GameDetailPage').then(m => ({ default: m.GameDetailPage })));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));
<<<<<<< HEAD
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })));
const AdminUsersManagement = lazy(() => import('./pages/admin/AdminUsersManagement'));
=======
>>>>>>> origin/main
const ModeratorPage = lazy(() => import('./pages/ModeratorPage'));
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage'));
const PaymentCallbackPage = lazy(() => import('./pages/PaymentCallbackPage'));

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const [status, setStatus] = useState<'checking' | 'allowed' | 'redirect'>('checking');

  useEffect(() => {
    const tokenLS = localStorage.getItem('wgs_token') || localStorage.getItem('token');
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
    const tokenLS = localStorage.getItem('wgs_token') || localStorage.getItem('token');
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
            (r?.authority || r).toString().toUpperCase()
          );
          isAdmin = roles.includes('ROLE_ADMIN') || roles.includes('ADMIN');
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

// Layout wrapper that conditionally shows Navbar and Footer
function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/forgot'].includes(location.pathname);

  return (
    <div className="app-shell">
      {!isAuthPage && <Navbar />}
      <main className="app-main">
        {children}
      </main>
      {!isAuthPage && <BackToTop />}
      {!isAuthPage && <ZaloButton />}
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter 
        future={{ 
          v7_startTransition: true,
          v7_relativeSplatPath: true 
        }}
      >
        <ToastProvider>
          <CurrencyProvider>
            <CartProvider>
              <WishlistProvider>
                <Layout>
                  <Suspense fallback={<div className="loading-screen">Đang tải...</div>}>
                    <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/store" element={<StorePage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/test-nav" element={<TestCategories />} />
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
<<<<<<< HEAD
                    <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
                    <Route path="/checkout/momo-callback" element={<MoMoCallbackPage />} />
                    <Route path="/payment/callback" element={<MoMoCallbackPage />} />
                    <Route path="/payment/momo/callback" element={<PaymentCallbackPage />} />
=======
>>>>>>> origin/main
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/wishlist" 
                      element={
                        <ProtectedRoute>
                          <WishlistPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/orders" 
                      element={
                        <ProtectedRoute>
                          <MyOrdersPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/game/:id" element={<GameDetailPage />} />
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
<<<<<<< HEAD
                    <Route
                      path="/admin/users"
                      element={
                        <AdminRoute>
                          <AdminUsersPage />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/users-management"
                      element={
                        <AdminRoute>
                          <AdminUsersManagement />
                        </AdminRoute>
                      }
                    />
=======
>>>>>>> origin/main
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </Layout>
            </WishlistProvider>
          </CartProvider>
        </CurrencyProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

import axios from 'axios';

// Use environment variable for API base URL
// Default to /api which nginx will proxy to backend at /identity
const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public endpoints that don't need authentication
const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/introspect',
  // NOTE: /users is handled specially in interceptor (only POST /users for registration is public)
  '/users/forgot-password',
  '/users/request-phone-otp',
  '/users/forgot-password/phone/request',
  '/users/forgot-password/phone/confirm',
  '/email/request-otp', // Email OTP endpoint
  '/games',
  '/games/by-price-asc',
  '/games/by-price-desc',
  '/games/search',
  '/category',
  '/payment/momo/confirm', // MoMo payment confirmation (after redirect)
  '/payment/momo/status', // Check payment status
  '/topup/momo/confirm', // MoMo topup confirmation
];

// Request interceptor to conditionally add auth token
api.interceptors.request.use(
  (config) => {
    const url = config.url || '';
    const method = (config.method || 'get').toUpperCase();
    
    // Check if this is a public endpoint
    let isPublicEndpoint = false;
    
    // Special case: POST /users (registration) is public
    if (url === '/users' && method === 'POST') {
      isPublicEndpoint = true;
    } else {
      // Check other public endpoints
      isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => {
        // All GET requests to /games (including /games/{id}) are public
        if (endpoint === '/games' && method === 'GET') {
          return url === '/games' || url.startsWith('/games/');
        }
        // All GET requests to /category (including /category/{id}) are public
        if (endpoint === '/category' && method === 'GET') {
          return url === '/category' || url.startsWith('/category/');
        }
        return url.startsWith(endpoint);
      });
    }

    // Only add Authorization header for protected endpoints
    if (!isPublicEndpoint) {
      const token = localStorage.getItem('wgs_token') || localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors and auto-refresh token
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      const endpoint = originalRequest?.url || '';
      
      // Don't try to refresh on login/register/public endpoints
      if (endpoint.includes('/auth/login') || 
          endpoint.includes('/auth/refresh') || 
          endpoint.includes('/users') && originalRequest.method === 'post') {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const token = localStorage.getItem('wgs_token') || localStorage.getItem('token');
      
      if (!token) {
        localStorage.removeItem('wgs_token');
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Try to refresh token
        const res = await axios.post(`${API_BASE}/auth/refresh`, { token });
        const newToken = res.data?.result?.token;
        
        if (newToken) {
          setAuthToken(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return api(originalRequest);
        } else {
          throw new Error('No new token received');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('wgs_token');
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export type Game = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string; // Main image URL
  cover?: string; // Cover image URL
  video?: string; // Video URL (YouTube, etc.)
  releaseDate?: string; // ISO date string
  averageRating?: number; // Average rating
  ratingCount?: number; // Total ratings
  salePercent?: number;
  categories?: { name: string; description?: string }[];
  systemRequirements?: {
    minimum?: {
      os?: string;
      cpu?: string;
      ram?: string;
      gpu?: string;
      storage?: string;
      network?: string;
    };
    recommended?: {
      os?: string;
      cpu?: string;
      ram?: string;
      gpu?: string;
      storage?: string;
      network?: string;
    };
  };
};

export type Category = {
  id?: string;
  name: string;
  description?: string;
};

export function setAuthToken(token: string | null) {
  // Store token in localStorage - interceptor will handle adding it to requests
  if (token) {
    localStorage.setItem('wgs_token', token);
  } else {
    localStorage.removeItem('wgs_token');
    localStorage.removeItem('token'); // Clean up old token key
  }
}

export async function fetchGamesByPrice(order: 'asc' | 'desc') {
  const url = order === 'asc' ? '/games/by-price-asc' : '/games/by-price-desc';
  const res = await api.get(url);
  return res.data.result as Game[];
}

export async function searchGames(keyword: string) {
  const res = await api.get('/games/search', { params: { keyword } });
  return res.data.result as Game[];
}

export async function fetchGame(id: string) {
  const res = await api.get(`/games/id/${id}`);
  return res.data.result as Game;
}

export async function fetchCategories() {
  const res = await api.get('/category');
  return res.data.result as Category[];
}

export async function createCategory(payload: { name: string; description?: string }) {
  const res = await api.post('/category', payload);
  return res.data.result as Category;
}

// Admin game CRUD
export type GameCreatePayload = {
  name: string;
  quantity: number;
  price: number;
  salePercent?: number | null;
  image?: string; // S3 URL or path
  cover?: string; // S3 URL or path
  video?: string; // YouTube URL or S3 URL
  categories?: string[]; // ids (optional)
  systemRequirements?: {
    minimum?: {
      os?: string;
      cpu?: string;
      ram?: string;
      gpu?: string;
      storage?: string;
      network?: string;
    };
    recommended?: {
      os?: string;
      cpu?: string;
      ram?: string;
      gpu?: string;
      storage?: string;
      network?: string;
    };
  };
};

export type GameUpdatePayload = Partial<GameCreatePayload>;

export async function createGame(payload: GameCreatePayload) {
  const res = await api.post('/games', { ...payload, categories: payload.categories ?? [] });
  return res.data.result as Game;
}

export async function updateGame(id: string, payload: GameUpdatePayload) {
  const res = await api.put(`/games/${id}`, { ...payload, categories: payload.categories });
  return res.data.result as Game;
}

export async function deleteGame(id: string) {
  await api.delete(`/games/${id}`);
}

// S3 Upload functions
export async function uploadImageToS3(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const res = await api.post('/s3/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.result.url || res.data.result; // URL của file trên S3
  } catch (error) {
    console.error('S3 upload failed:', error);
    throw error;
  }
}

export async function login(username: string, password: string) {
  // Public endpoint - interceptor will not add token
  const res = await api.post('/auth/login', { username, password });
  const token = res.data?.result?.token as string;
  if (!token) {
    throw new Error('No token received from server');
  }
  return token;
}

export async function introspect(token: string) {
  // Public endpoint - interceptor will not add token
  const res = await api.post('/auth/introspect', { token });
  return Boolean(res.data?.result?.valid);
}

export type RegisterPayload = {
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  dob?: string; // yyyy-MM-dd
  email?: string;
  emailOtp?: string;
  phone?: string;
};

export async function register(payload: RegisterPayload) {
  // Public endpoint - interceptor will not add token
  const res = await api.post('/users', payload);
  return res.data?.result as { id: string; username: string };
}

export async function forgotPassword(username: string) {
  // Public endpoint - interceptor will not add token
  const res = await api.post('/users/forgot-password', { username });
  return res.data?.result as string;
}

export async function requestPhoneOtp(phone: string) {
  // Public endpoint - interceptor will not add token
  const res = await api.post('/users/request-phone-otp', { phone });
  return res.data?.result as string;
}

// Request email OTP for registration
export async function requestEmailOtp(email: string): Promise<string> {
  // Public endpoint - interceptor will not add token
  const res = await api.post('/email/request-otp', { email });
  return res.data?.result as string; // Backend returns "OTP sent successfully" or the OTP code
}

export async function forgotPhoneRequest(username: string) {
  // Public endpoint - interceptor will not add token
  await api.post('/users/forgot-password/phone/request', { username });
}

export async function forgotPhoneConfirm(username: string, otp: string, newPassword: string) {
  // Public endpoint - interceptor will not add token
  await api.post('/users/forgot-password/phone/confirm', { username, otp, newPassword });
}

export type Me = {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string; // LocalDate from backend will be serialized as string
};

export async function getMyInfo() {
  const res = await api.get('/users/myInfo');
  return res.data?.result as Me;
}

export type UpdateProfilePayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string; // yyyy-MM-dd
};

export async function updateMyInfo(payload: UpdateProfilePayload) {
  console.log('📡 API: Getting current user ID...');
  // First get user ID from myInfo
  const currentUser = await getMyInfo();
  const userId = currentUser.id;
  console.log('📡 API: User ID =', userId);
  
  console.log('📡 API: Calling PUT /users/' + userId + ' with:', payload);
  // Then update using /users/{userId} endpoint
  const res = await api.put(`/users/${userId}`, payload);
  console.log('📡 API: PUT Response:', res.data);
  return res.data?.result as Me;
}

// Sales/Orders for dashboard (adjust endpoints to your backend)
export type OrderSummary = {
  totalSold: number;
  revenue: number;
  avgPrice: number;
  topGameName?: string;
};

export type RecentOrder = {
  id: string;
  date: string; // ISO or display
  gameName: string;
  qty: number;
  amount: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
};

// Full Order interface for order management
export interface Order {
  id: string;
  userId: string;
  username?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  license_key: string | null;
  delivery_content: string | null;
  paymentMethod?: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
}

export interface OrderItem {
  id?: string;
  gameId: string;
  gameName: string;
  quantity: number;
  unitPrice: number;
  salePercent?: number;
  finalPrice: number;
}

export async function fetchOrderSummary() {
  const res = await api.get('/orders/summary');
  return res.data?.result as OrderSummary;
}

export async function fetchRecentOrders(limit = 12) {
  const res = await api.get('/orders/recent', { params: { limit } });
  return res.data?.result as RecentOrder[];
}

export async function fetchMonthlySales() {
  const res = await api.get('/orders/monthly-sales');
  return res.data?.result as Array<{ month: string; amount: number }>;
}

// Order Management APIs
export async function fetchAllOrders() {
  const res = await api.get('/orders');
  return res.data?.result as Order[];
}

export async function fetchUserOrders() {
  const res = await api.get('/orders/my-orders');
  return res.data?.result as Order[];
}

export async function fetchOrderById(orderId: string) {
  const res = await api.get(`/orders/${orderId}`);
  return res.data?.result as Order;
}

export async function updateOrderStatus(orderId: string, status: 'PROCESSING' | 'COMPLETED' | 'CANCELLED') {
  const res = await api.patch(`/orders/${orderId}/status`, { status });
  return res.data?.result as Order;
}

export async function completeOrder(orderId: string, licenseKey: string) {
  const res = await api.patch(`/orders/${orderId}/complete`, { 
    license_key: licenseKey,
    status: 'COMPLETED' 
  });
  return res.data?.result as Order;
}

export async function createOrder(items: OrderItem[], paymentMethod: string) {
  const res = await api.post('/orders', {
    items,
    paymentMethod,
    status: 'PROCESSING'
  });
  return res.data?.result as Order;
}

// MoMo Payment API
export type MoMoPaymentRequest = {
  amount: number;
  orderInfo: string;
  returnUrl?: string;
  notifyUrl?: string;
  extraData?: string;
};

export type MoMoPaymentItem = {
  gameId: string;
  gameName: string;
  unitPrice: number;
  quantity: number;
  salePercent?: number;
};

export type MoMoPaymentWithItemsRequest = {
  orderId: string;
  amount: number;
  orderInfo: string;
  returnUrl?: string;
  notifyUrl?: string;
  items: MoMoPaymentItem[];
};

export type MoMoPaymentResponse = {
  payUrl: string;
  deeplink?: string;
  qrCodeUrl?: string;
  orderId: string;
  requestId: string;
};

export async function createMoMoPayment(request: MoMoPaymentRequest): Promise<MoMoPaymentResponse> {
  const res = await api.post('/payment/momo/create', request);
  return res.data?.result as MoMoPaymentResponse;
}

export async function createMoMoPaymentWithItems(request: MoMoPaymentWithItemsRequest): Promise<MoMoPaymentResponse> {
  const res = await api.post('/payment/momo/create-with-items', request);
  return res.data?.result as MoMoPaymentResponse;
}

export async function checkMoMoPaymentStatus(orderId: string) {
  const res = await api.get(`/payment/momo/status/${orderId}`);
  return res.data?.result;
}

export async function confirmMoMoPayment(orderId: string, payload: { resultCode: string; message?: string }) {
  const res = await api.post(`/payment/momo/confirm/${orderId}`, payload);
  return res.data?.result;
}

export async function confirmTopupPayment(transactionId: string, payload: { resultCode: string; message?: string }) {
  const res = await api.post(`/topup/momo/confirm`, { transactionId, ...payload });
  return res.data?.result;
}

// Game Rating API
export type GameRating = {
  id: string;
  gameId: string;
  userId: string;
  userName?: string;
  rating: number; // 1-5
  comment?: string;
  createdAt?: string;
};

export type CreateRatingPayload = {
  gameId: string;
  rating: number; // 1-5
  comment?: string;
};

export type UpdateRatingPayload = {
  rating?: number;
  comment?: string;
};

export async function createGameRating(payload: CreateRatingPayload): Promise<GameRating> {
  const res = await api.post('/game-ratings', payload);
  return res.data?.result as GameRating;
}

export async function updateGameRating(id: string, payload: UpdateRatingPayload): Promise<GameRating> {
  const res = await api.put(`/game-ratings/${id}`, payload);
  return res.data?.result as GameRating;
}

export async function deleteGameRating(id: string): Promise<void> {
  await api.delete(`/game-ratings/${id}`);
}

export async function getGameRatings(gameId: string): Promise<GameRating[]> {
  const res = await api.get(`/game-ratings/game/${gameId}`);
  return res.data?.result as GameRating[];
}

export async function getMyRatingForGame(gameId: string): Promise<GameRating | null> {
  try {
    const res = await api.get(`/game-ratings/my-rating/${gameId}`);
    return res.data?.result as GameRating;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

// Auth - Logout & Refresh Token
export async function logout(token: string): Promise<void> {
  await api.post('/auth/logout', { token });
  localStorage.removeItem('wgs_token');
  localStorage.removeItem('token');
}

export async function refreshToken(token: string): Promise<string> {
  const res = await api.post('/auth/refresh', { token });
  const newToken = res.data?.result?.token as string;
  if (newToken) {
    setAuthToken(newToken);
  }
  return newToken;
}

// Avatar Upload API
export async function uploadAvatar(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await api.post('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data?.result;
}

export async function deleteAvatar(): Promise<any> {
  const res = await api.delete('/users/avatar');
  return res.data?.result;
}

// Topup API
export type TopupPayload = {
  amount: number;
  description?: string;
};

export async function createMoMoTopup(payload: TopupPayload): Promise<any> {
  const res = await api.post('/topup/momo', payload);
  return res.data?.result;
}

export async function getTransactionHistory(): Promise<any[]> {
  const res = await api.get('/topup/history');
  return res.data?.result as any[];
}

export async function getBalance(): Promise<{ balance: number; username: string }> {
  const res = await api.get('/topup/balance');
  return res.data?.result;
}

// Cart API
export type AddToCartPayload = {
  gameId: string;
  quantity: number;
};

export async function addToCart(payload: AddToCartPayload): Promise<void> {
  await api.post('/cart/add', payload);
}



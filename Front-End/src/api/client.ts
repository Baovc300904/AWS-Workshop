import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080/identity';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public endpoints that don't need authentication
const PUBLIC_ENDPOINTS = [
  '/auth/log-in',
  '/auth/introspect',
  '/users', // POST /users (register)
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
];

// Request interceptor to conditionally add auth token
api.interceptors.request.use(
  (config) => {
    const url = config.url || '';
    const method = (config.method || 'get').toUpperCase();
    
    // Check if this is a public endpoint
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => {
      if (endpoint === '/users' && method === 'POST') return url.startsWith('/users') && !url.includes('/');
      if (endpoint === '/games' && method === 'GET') return url === '/games' || url.startsWith('/games/');
      if (endpoint === '/category' && method === 'GET') return url.startsWith('/category');
      return url.startsWith(endpoint);
    });

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

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const endpoint = error.config?.url || '';
      const backendMessage = error.response?.data?.message || 'Unauthorized';
      console.warn(`[API] 401 Unauthorized on ${endpoint}:`, backendMessage);
      
      // Only clear token if it's not a login endpoint (to preserve login error message)
      if (!endpoint.includes('/auth/log-in')) {
        const token = localStorage.getItem('wgs_token') || localStorage.getItem('token');
        if (token) {
          localStorage.removeItem('wgs_token');
          localStorage.removeItem('token');
        }
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
  try {
    const url = order === 'asc' ? '/games/by-price-asc' : '/games/by-price-desc';
    const res = await api.get(url);
    return res.data.result as Game[];
  } catch (error: any) {
    console.error(`[fetchGamesByPrice] Error:`, error.response?.status, error.message);
    if (error.response?.status === 401) {
      console.warn('[fetchGamesByPrice] 401 on public endpoint /games - check backend');
    }
    throw error;
  }
}

export async function searchGames(keyword: string) {
  const res = await api.get('/games/search', { params: { keyword } });
  return res.data.result as Game[];
}

export async function fetchGame(id: string) {
  const res = await api.get(`/games/${id}`);
  return res.data.result as Game;
}

export async function fetchCategories() {
  try {
    const res = await api.get('/category');
    return res.data.result as Category[];
  } catch (error: any) {
    console.error('[fetchCategories] Error:', error.response?.status, error.message);
    // If 401 and it's a public endpoint, backend might not be running or misconfigured
    if (error.response?.status === 401) {
      console.warn('[fetchCategories] 401 on public endpoint - check backend SecurityConfig');
    }
    throw error;
  }
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
  categories?: string[]; // ids (optional)
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

export async function login(username: string, password: string) {
  // Public endpoint - interceptor will not add token
  const res = await api.post('/auth/log-in', { username, password });
  const token = res.data?.result?.token as string;
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
  try {
    // Public endpoint - interceptor will not add token
    const res = await api.post('/email/request-otp', { email });
    const result = res.data?.result as string;
    console.log(`[Email OTP] Sent to ${email}. Result: ${result}`);
    return result; // Backend returns "OTP sent successfully" or the OTP code
  } catch (error: any) {
    console.error('[requestEmailOtp] Error:', error.response?.data || error.message);
    throw error;
  }
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
  const res = await api.put('/users/myInfo', payload);
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



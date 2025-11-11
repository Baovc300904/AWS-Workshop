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
      if (endpoint === '/games' && method === 'GET') return url === '/games' || url.startsWith('/games/');
      if (endpoint === '/category' && method === 'GET') return url.startsWith('/category');
      return url.startsWith(endpoint);
    });
    
    // Special check: POST /users (register) is public
    const isRegisterEndpoint = method === 'POST' && (url === '/users' || url === '/users/');
    const isFinallyPublic = isPublicEndpoint || isRegisterEndpoint;

    // Only add Authorization header for protected endpoints
    if (!isFinallyPublic) {
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
      // Clear token if exists
      const token = localStorage.getItem('wgs_token') || localStorage.getItem('token');
      if (token) {
        localStorage.removeItem('wgs_token');
        localStorage.removeItem('token');
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
  salePercent?: number;
  categories?: { name: string; description?: string }[];
};

export type Category = {
  id?: string;
  name: string;
  description?: string;
};

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
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
  // Avoid sending stale Authorization header on public auth endpoint
  const res = await api.post('/auth/log-in', { username, password }, { headers: { Authorization: undefined } });
  const token = res.data?.result?.token as string;
  return token;
}

export async function introspect(token: string) {
  // Introspect is also public; ensure no Bearer header interferes
  const res = await api.post('/auth/introspect', { token }, { headers: { Authorization: undefined } });
  return Boolean(res.data?.result?.valid);
}

export type RegisterPayload = {
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  dob?: string; // yyyy-MM-dd
  phone?: string;
  phoneOtp?: string;
};

export async function register(payload: RegisterPayload) {
  const res = await api.post('/users', payload, { headers: { Authorization: undefined } });
  return res.data?.result as { id: string; username: string };
}

export async function forgotPassword(username: string) {
  const res = await api.post('/users/forgot-password', { username }, { headers: { Authorization: undefined } });
  // backend returns token as result (per controller). We return it in case needed for demo/testing.
  return res.data?.result as string;
}

export async function requestPhoneOtp(phone: string) {
  const res = await api.post('/users/request-phone-otp', { phone }, { headers: { Authorization: undefined } });
  return res.data?.result as string; // demo returns code
}

export async function forgotPhoneRequest(username: string) {
  await api.post('/users/forgot-password/phone/request', { username }, { headers: { Authorization: undefined } });
}

export async function forgotPhoneConfirm(username: string, otp: string, newPassword: string) {
  await api.post('/users/forgot-password/phone/confirm', { username, otp, newPassword }, { headers: { Authorization: undefined } });
}

export type Me = {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
};

export async function getMyInfo() {
  const res = await api.get('/users/myInfo');
  return res.data?.result as Me;
}

<<<<<<< Updated upstream
=======
export type UpdateProfilePayload = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dob?: string; // yyyy-MM-dd
};

export async function updateMyInfo(payload: UpdateProfilePayload) {
  // First get current user info to get the userId
  const currentUser = await getMyInfo();
  
  // Remove empty/null fields from payload
  const updateData: any = {};
  if (payload.firstName) updateData.firstName = payload.firstName;
  if (payload.lastName) updateData.lastName = payload.lastName;
  if (payload.phone) updateData.phone = payload.phone;
  if (payload.dob) updateData.dob = payload.dob;
  
  const res = await api.put(`/users/${currentUser.id}`, updateData);
  return res.data?.result as Me;
}

>>>>>>> Stashed changes
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



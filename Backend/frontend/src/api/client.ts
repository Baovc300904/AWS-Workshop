import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080/identity';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000
});

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
  const res = await api.post('/admin/games', { ...payload, categories: payload.categories ?? [] });
  return res.data.result as Game;
}

export async function updateGame(id: string, payload: GameUpdatePayload) {
  const res = await api.put(`/admin/games/${id}`, { ...payload, categories: payload.categories });
  return res.data.result as Game;
}

export async function deleteGame(id: string) {
  await api.delete(`/admin/games/${id}`);
}

// Ratings
export async function submitRating(gameId: string, score: number) {
  const clientId = (() => {
    const k = 'client_id';
    let v = localStorage.getItem(k);
    if (!v) { v = crypto.randomUUID(); localStorage.setItem(k, v); }
    return v;
  })();
  await api.post(`/ratings/${gameId}`, { score, clientId }, { headers: { Authorization: undefined } });
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
  email?: string;
  emailOtp?: string;
  phone?: string; // optional capture
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

// Email OTP
export async function requestEmailOtp(email: string) {
  const res = await api.post('/email/request-otp', { email }, { headers: { Authorization: undefined } });
  return res.data?.result as string; // 'sent'
}

// MoMo create payment
export async function createMomoPayment(orderId: string, amount: number, orderInfo?: string) {
  const res = await api.post('/payment/momo/create', { orderId, amount, orderInfo: orderInfo || 'Thanh toan don hang' }, { headers: { Authorization: undefined } });
  return res.data?.result as { payUrl?: string; deeplink?: string } & Record<string, any>;
}

// MoMo create payment with items
export type PaymentItem = {
  gameId: string;
  gameName: string;
  quantity: number;
  unitPrice: number;
  salePercent?: number;
};

export async function createMomoPaymentWithItems(orderId: string, amount: number, items: PaymentItem[], orderInfo?: string) {
  const res = await api.post('/payment/momo/create-with-items', { 
    orderId, 
    amount, 
    orderInfo: orderInfo || 'Thanh toan don hang',
    items 
  }, { headers: { Authorization: undefined } });
  return res.data?.result as { payUrl?: string; deeplink?: string } & Record<string, any>;
}



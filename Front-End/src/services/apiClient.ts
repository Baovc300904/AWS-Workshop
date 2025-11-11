// Backend Spring Boot base URL (context-path: /identity)
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/identity';

// Get token from localStorage (if exists)
function getToken(): string | null {
  try { return localStorage.getItem('wgs_token'); } catch { return null; }
}

// Standard fetch with auth header and ApiResponse unwrap
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    throw new Error(err.message || `API ${res.status}`);
  }
  const data = await res.json();
  // Backend wraps in { code, message, result }
  return data.result !== undefined ? data.result : data;
}

// ---- Types ----
export interface AuthenticationResponse {
  token: string;
  authenticated: boolean;
}

export interface UserResponse {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  dob: string; // LocalDate from backend
  phone: string;
  email: string;
  roles?: any[];
}

export interface GameResponse {
  id: string;
  name: string;
  quantity: number;
  price: number;
  salePercent: number;
  image?: string;
  releaseDate?: string;
  cover?: string;
  video?: string;
  averageRating?: number;
  ratingCount?: number;
  categories?: any[];
}

export interface GameListResponse {
  total: number;
  items: GameResponse[];
}

// ---- Auth ----
export async function login(username: string, password: string): Promise<AuthenticationResponse> {
  return apiFetch<AuthenticationResponse>('/auth/log-in', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function logout(token: string): Promise<void> {
  return apiFetch<void>('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export async function refreshToken(token: string): Promise<AuthenticationResponse> {
  return apiFetch<AuthenticationResponse>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export async function introspect(token: string): Promise<any> {
  return apiFetch<any>('/auth/introspect', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

// ---- Users ----
export async function createUser(userData: any): Promise<UserResponse> {
  return apiFetch<UserResponse>('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function getMyInfo(): Promise<UserResponse> {
  return apiFetch<UserResponse>('/users/myInfo');
}

export async function getAllUsers(): Promise<UserResponse[]> {
  return apiFetch<UserResponse[]>('/users');
}

export async function getUserById(userId: string): Promise<UserResponse> {
  return apiFetch<UserResponse>(`/users/${userId}`);
}

export async function updateUser(userId: string, userData: any): Promise<UserResponse> {
  return apiFetch<UserResponse>(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
}

export async function deleteUser(userId: string): Promise<void> {
  return apiFetch<void>(`/users/${userId}`, { method: 'DELETE' });
}

export async function forgotPassword(email: string): Promise<string> {
  return apiFetch<string>('/users/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  return apiFetch<void>('/users/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}

// ---- Games ----
export async function fetchGames(params: any = {}): Promise<GameListResponse> {
  // Backend: GET /games returns all; search via /games/search?keyword=...
  let endpoint = '/games';
  if (params.q || params.search) {
    const keyword = params.q || params.search;
    endpoint = `/games/search?keyword=${encodeURIComponent(keyword)}`;
  } else if (params.sort === 'price-asc') {
    endpoint = '/games/by-price-asc';
  } else if (params.sort === 'price-desc') {
    endpoint = '/games/by-price-desc';
  }
  const items = await apiFetch<GameResponse[]>(endpoint);
  return { total: items.length, items };
}

export async function fetchGame(nameOrId: string): Promise<GameResponse> {
  return apiFetch<GameResponse>(`/games/${encodeURIComponent(nameOrId)}`);
}

export async function createGame(gameData: any): Promise<GameResponse> {
  return apiFetch<GameResponse>('/games', {
    method: 'POST',
    body: JSON.stringify(gameData),
  });
}

export async function updateGame(gameId: string, gameData: any): Promise<GameResponse> {
  return apiFetch<GameResponse>(`/games/${gameId}`, {
    method: 'PUT',
    body: JSON.stringify(gameData),
  });
}

export async function deleteGame(gameId: string): Promise<void> {
  return apiFetch<void>(`/games/${gameId}`, { method: 'DELETE' });
}

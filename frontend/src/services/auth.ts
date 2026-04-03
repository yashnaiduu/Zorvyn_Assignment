import { apiFetch } from './api';
import { StoredUser } from '../utils/token';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    access_token: string;
    refresh_token: string;
    user: StoredUser;
  };
}

export const authService = {
  login: (data: LoginPayload) => apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: data }),
  register: (data: RegisterPayload) => apiFetch<AuthResponse>('/auth/register', { method: 'POST', body: data }),
  logout: () => apiFetch<{ success: boolean; message: string }>('/auth/logout', { method: 'POST' }),
  refresh: (token: string) => apiFetch<AuthResponse>('/auth/refresh', { method: 'POST', body: { refreshToken: token } }),
};

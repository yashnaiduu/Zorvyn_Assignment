import { apiFetch } from './api';
import { StoredUser } from '../utils/token';

export interface AuthResponse {
  success: boolean;
  data: {
    access_token: string;
    refresh_token: string;
    user: StoredUser;
  };
}

export const authService = {
  login: (data: any) => apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: data }),
  register: (data: any) => apiFetch<AuthResponse>('/auth/register', { method: 'POST', body: data }),
  logout: () => apiFetch<{ success: boolean; message: string }>('/auth/logout', { method: 'POST' }),
  refresh: (token: string) => apiFetch<AuthResponse>('/auth/refresh', { method: 'POST', body: { refreshToken: token } }),
};

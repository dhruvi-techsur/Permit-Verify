import { apiClient } from './axios';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'applicant' | 'reviewer' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// POST /api/v1/auth/register — RegisterRequest → 201 AuthResponse
export const register = (data: { email: string; password: string; fullName: string }) =>
  apiClient.post<AuthResponse>('/auth/register', data).then((r) => r.data);

// POST /api/v1/auth/login — LoginRequest → 200 AuthResponse
export const login = (data: { email: string; password: string }) =>
  apiClient.post<AuthResponse>('/auth/login', data).then((r) => r.data);

// POST /api/v1/auth/refresh — RefreshRequest → 200 { accessToken, refreshToken }
export const refresh = (refreshToken: string) =>
  apiClient
    .post<{ accessToken: string; refreshToken: string }>('/auth/refresh', { refreshToken })
    .then((r) => r.data);

// POST /api/v1/auth/logout — 200 { message }
export const logout = (refreshToken: string) =>
  apiClient.post('/auth/logout', { refreshToken });

// POST /api/v1/auth/forgot-password — always 200
export const forgotPassword = (email: string) =>
  apiClient.post('/auth/forgot-password', { email });

// POST /api/v1/auth/reset-password — 200 { message }
export const resetPassword = (data: { token: string; newPassword: string; confirmPassword: string }) =>
  apiClient.post('/auth/reset-password', data).then((r) => r.data);

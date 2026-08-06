import { create } from 'zustand';
import { User, AuthResponse } from '../lib/api';
import * as api from '../lib/api';

const REFRESH_TOKEN_KEY = 'permit_refresh_token';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  // Actions
  login(data: { email: string; password: string }): Promise<void>;
  register(data: { email: string; password: string; fullName: string }): Promise<void>;
  logout(): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(data: { token: string; newPassword: string; confirmPassword: string }): Promise<void>;
  refreshAccessToken(): Promise<string>;
  clearAuth(): void;
  initialize(): Promise<void>;
}

const setAuthFromResponse = (response: AuthResponse) => {
  // Refresh token → localStorage (survives page refresh per TechArch §5.1)
  localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
  return {
    user: response.user,
    accessToken: response.accessToken,
    isAuthenticated: true,
  };
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  login: async (data) => {
    const response = await api.login(data);
    set(setAuthFromResponse(response));
  },

  register: async (data) => {
    const response = await api.register(data);
    set(setAuthFromResponse(response));
  },

  logout: async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      try {
        await api.logout(refreshToken);
      } catch {
        // Proceed with local logout even if server call fails
      }
    }
    get().clearAuth();
  },

  forgotPassword: async (email) => {
    await api.forgotPassword(email);
  },

  resetPassword: async (data) => {
    await api.resetPassword(data);
  },

  refreshAccessToken: async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) throw new Error('No refresh token');

    const response = await api.refresh(refreshToken);
    // Store new refresh token (rotation)
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    set({ accessToken: response.accessToken });
    return response.accessToken;
  },

  clearAuth: () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  // Called on app boot — restore session from refresh token if present
  initialize: async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) return;
    try {
      await get().refreshAccessToken();
      // Fetch current user profile
      const { apiClient } = await import('../lib/axios');
      const { data } = await apiClient.get<User>('/auth/me');
      set({ user: data });
    } catch {
      get().clearAuth();
    }
  },
}));

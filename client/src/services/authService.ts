import api from './api';
import { UserProfile } from '../types';

export interface RegisterData {
  fullName: string;
  rollNumber: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user: UserProfile;
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', data);
    if (res.data.token) {
      localStorage.setItem('csda_auth_token', res.data.token);
    }
    return res.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', data);
    if (res.data.token) {
      localStorage.setItem('csda_auth_token', res.data.token);
    }
    return res.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('csda_auth_token');
    }
  },

  async getMe(): Promise<{ success: boolean; user: UserProfile }> {
    const res = await api.get<{ success: boolean; user: UserProfile }>('/auth/me');
    return res.data;
  }
};

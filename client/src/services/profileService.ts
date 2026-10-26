import api from './api';
import { UserProfile } from '../types';

export interface UpdateProfileData {
  fullName: string;
  rollNumber: string;
  email: string;
  username: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const profileService = {
  async getProfile(): Promise<{ success: boolean; profile: UserProfile }> {
    const res = await api.get<{ success: boolean; profile: UserProfile }>('/profile');
    return res.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<{ success: boolean; message: string; profile: UserProfile }> {
    const res = await api.patch<{ success: boolean; message: string; profile: UserProfile }>('/profile', data);
    return res.data;
  },

  async changePassword(data: ChangePasswordData): Promise<{ success: boolean; message: string }> {
    const res = await api.patch<{ success: boolean; message: string }>('/profile/password', data);
    return res.data;
  }
};

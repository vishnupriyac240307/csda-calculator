import api from './api';
import { AdminPerformanceResponse } from '../types';

export const adminService = {
  async getStudentsPerformance(): Promise<AdminPerformanceResponse> {
    const res = await api.get<AdminPerformanceResponse>('/admin/students');
    return res.data;
  }
};

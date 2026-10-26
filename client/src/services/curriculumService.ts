import api from './api';
import { CurriculumConfig } from '../types';

export const curriculumService = {
  async getCurriculum(): Promise<{ success: boolean; curriculum: CurriculumConfig }> {
    const res = await api.get<{ success: boolean; curriculum: CurriculumConfig }>('/curriculum');
    return res.data;
  },

  async updateCurriculum(curriculum: CurriculumConfig): Promise<{ success: boolean; curriculum: CurriculumConfig }> {
    const res = await api.post<{ success: boolean; curriculum: CurriculumConfig }>('/curriculum', curriculum);
    return res.data;
  }
};

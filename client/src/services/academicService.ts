import api from './api';
import { OverallAcademicSummary, SemesterCalculationResult, SubjectMarkEntry } from '../types';

export interface AcademicResponse {
  success: boolean;
  data: {
    overallSummary: OverallAcademicSummary;
    semesterResults: SemesterCalculationResult[];
    savedRecords: any[];
  };
}

export interface SemesterResponse {
  success: boolean;
  data: {
    semester: number;
    record: any;
    calculation: SemesterCalculationResult;
  };
}

export const academicService = {
  async getAllAcademicRecords(): Promise<AcademicResponse> {
    const res = await api.get<AcademicResponse>('/academic');
    return res.data;
  },

  async getSemesterRecord(semester: number): Promise<SemesterResponse> {
    const res = await api.get<SemesterResponse>(`/academic/semesters/${semester}`);
    return res.data;
  },

  async saveSemesterMarks(semester: number, marks: SubjectMarkEntry[]): Promise<SemesterResponse> {
    const res = await api.put<SemesterResponse>(`/academic/semesters/${semester}`, { marks });
    return res.data;
  },

  async resetSemesterMarks(semester: number): Promise<{ success: boolean; message: string; calculation: SemesterCalculationResult }> {
    const res = await api.delete<{ success: boolean; message: string; calculation: SemesterCalculationResult }>(`/academic/semesters/${semester}`);
    return res.data;
  },

  async resetAllAcademicMarks(): Promise<{ success: boolean; message: string }> {
    const res = await api.delete<{ success: boolean; message: string }>('/academic');
    return res.data;
  }
};

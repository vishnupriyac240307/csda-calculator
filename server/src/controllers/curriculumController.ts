import { Request, Response } from 'express';
import { defaultCurriculum } from '../data/defaultCurriculum';
import { CurriculumConfig } from '../types';

// In-memory curriculum state that can be updated with official syllabus
let activeCurriculum: CurriculumConfig = { ...defaultCurriculum };

export function getActiveCurriculum(): CurriculumConfig {
  return activeCurriculum;
}

export function setActiveCurriculum(newCurriculum: CurriculumConfig): void {
  activeCurriculum = newCurriculum;
}

export async function getCurriculum(_req: Request, res: Response): Promise<void> {
  res.status(200).json({
    success: true,
    curriculum: activeCurriculum
  });
}

export async function updateCurriculumConfig(req: Request, res: Response): Promise<void> {
  try {
    const newConfig: CurriculumConfig = req.body;
    if (!newConfig || !newConfig.semesters || !Array.isArray(newConfig.semesters)) {
      res.status(400).json({
        success: false,
        message: 'Invalid curriculum payload. Must include semesters array.'
      });
      return;
    }

    activeCurriculum = {
      ...newConfig,
      isOfficialConfigLoaded: true,
      statusNotice: 'Official CSDA Curriculum active'
    };

    res.status(200).json({
      success: true,
      message: 'Curriculum configuration updated successfully.',
      curriculum: activeCurriculum
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update curriculum configuration'
    });
  }
}

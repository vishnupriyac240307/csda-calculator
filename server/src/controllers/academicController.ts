import { Response, NextFunction } from 'express';
import { AcademicRecord, ISubjectMark } from '../models/AcademicRecord';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { getActiveCurriculum } from './curriculumController';
import {
  calculateSemesterResults,
  calculateOverallSummary,
  validateMarks
} from '../utils/calculation';
import { calculateTotalCurriculumCredits, getSemesterSubjects } from '../data/defaultCurriculum';
import { SemesterCalculationResult } from '../types';

/**
 * GET /api/academic
 * Fetch all semester records & calculate cumulative CGPA and academic summary
 */
export async function getAllAcademicRecords(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const curriculum = getActiveCurriculum();
    const totalCurriculumCredits = calculateTotalCurriculumCredits(curriculum);

    // Fetch existing records for this student only
    const savedRecords = await AcademicRecord.find({ userId: user._id }).sort({ semester: 1 });
    const recordsMap = new Map<number, ISubjectMark[]>();
    for (const rec of savedRecords) {
      recordsMap.set(rec.semester, rec.marks);
    }

    const semesterResults: SemesterCalculationResult[] = [];

    // Calculate for all 6 semesters
    for (let semNum = 1; semNum <= 6; semNum++) {
      const subjectDefs = getSemesterSubjects(semNum, curriculum);
      const marks = recordsMap.get(semNum) || [];
      const calcResult = calculateSemesterResults(semNum, subjectDefs, marks);
      semesterResults.push(calcResult);
    }

    const overallSummary = calculateOverallSummary(semesterResults, totalCurriculumCredits);

    res.status(200).json({
      success: true,
      data: {
        overallSummary,
        semesterResults,
        savedRecords
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/academic/semesters/:semester
 * Fetch marks and calculated results for a specific semester
 */
export async function getSemesterRecord(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const semNum = parseInt(String(req.params.semester), 10);
    if (isNaN(semNum) || semNum < 1 || semNum > 6) {
      res.status(400).json({
        success: false,
        message: 'Invalid semester number. Must be between 1 and 6.'
      });
      return;
    }

    const curriculum = getActiveCurriculum();
    const subjectDefs = getSemesterSubjects(semNum, curriculum);

    const savedRecord = await AcademicRecord.findOne({
      userId: user._id,
      semester: semNum
    });

    const userMarks = savedRecord ? savedRecord.marks : [];
    const calculation = calculateSemesterResults(semNum, subjectDefs, userMarks);

    res.status(200).json({
      success: true,
      data: {
        semester: semNum,
        record: savedRecord,
        calculation
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/academic/semesters/:semester
 * Save or update marks for a semester
 */
export async function saveSemesterMarks(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const semNum = parseInt(String(req.params.semester), 10);
    if (isNaN(semNum) || semNum < 1 || semNum > 6) {
      res.status(400).json({
        success: false,
        message: 'Invalid semester number. Must be between 1 and 6.'
      });
      return;
    }

    const { marks } = req.body;
    if (!marks || !Array.isArray(marks)) {
      res.status(400).json({
        success: false,
        message: 'Invalid request body. An array of marks is required.'
      });
      return;
    }

    const curriculum = getActiveCurriculum();
    const subjectDefs = getSemesterSubjects(semNum, curriculum);
    const subjectMap = new Map(subjectDefs.map((s) => [s.id, s]));

    // Validate marks against curriculum definitions
    const validatedMarks: ISubjectMark[] = [];

    for (const item of marks) {
      const subjectDef = subjectMap.get(item.subjectId);
      if (!subjectDef) {
        continue; // Ignore subjects not belonging to this semester
      }

      const valResult = validateMarks(item.marksObtained, subjectDef.maxMarks);
      if (!valResult.isValid) {
        res.status(400).json({
          success: false,
          message: `Subject ${subjectDef.code || subjectDef.name}: ${valResult.error}`,
          subjectId: item.subjectId
        });
        return;
      }

      validatedMarks.push({
        subjectId: item.subjectId,
        marksObtained: valResult.numericValue
      });
    }

    // Perform calculation
    const calc = calculateSemesterResults(semNum, subjectDefs, validatedMarks);

    // Upsert record for this student and semester
    const updatedRecord = await AcademicRecord.findOneAndUpdate(
      { userId: user._id, semester: semNum },
      {
        userId: user._id,
        curriculumVersion: curriculum.version,
        semester: semNum,
        marks: validatedMarks,
        sgpa: calc.sgpa,
        totalEligibleCredits: calc.totalEligibleCredits,
        completedCredits: calc.completedCredits,
        totalWeightedPoints: calc.totalWeightedPoints,
        status: calc.status
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: `Semester ${semNum} marks saved successfully.`,
      data: {
        record: updatedRecord,
        calculation: calc
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/academic/semesters/:semester
 * Reset current semester marks
 */
export async function resetSemesterMarks(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const semNum = parseInt(String(req.params.semester), 10);
    if (isNaN(semNum) || semNum < 1 || semNum > 6) {
      res.status(400).json({
        success: false,
        message: 'Invalid semester number. Must be between 1 and 6.'
      });
      return;
    }

    await AcademicRecord.deleteOne({
      userId: user._id,
      semester: semNum
    });

    const curriculum = getActiveCurriculum();
    const subjectDefs = getSemesterSubjects(semNum, curriculum);
    const emptyCalc = calculateSemesterResults(semNum, subjectDefs, []);

    res.status(200).json({
      success: true,
      message: `Semester ${semNum} marks have been reset.`,
      calculation: emptyCalc
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/academic
 * Reset all academic marks for current student
 */
export async function resetAllAcademicMarks(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const result = await AcademicRecord.deleteMany({
      userId: user._id
    });

    res.status(200).json({
      success: true,
      message: `All academic marks reset successfully (${result.deletedCount} semester records cleared). Your account and profile remain intact.`
    });
  } catch (error) {
    next(error);
  }
}

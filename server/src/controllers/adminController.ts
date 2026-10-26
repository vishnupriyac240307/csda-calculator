import { Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AcademicRecord, ISubjectMark } from '../models/AcademicRecord';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { getActiveCurriculum } from './curriculumController';
import {
  calculateSemesterResults,
  calculateOverallSummary
} from '../utils/calculation';
import { calculateTotalCurriculumCredits, getSemesterSubjects } from '../data/defaultCurriculum';
import { SemesterCalculationResult, StudentSemesterOverview, StudentAdminData } from '../types';

export async function getAllStudentsPerformance(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Access denied. Administrator privileges required.'
      });
      return;
    }

    const curriculum = getActiveCurriculum();
    const totalCurriculumCredits = calculateTotalCurriculumCredits(curriculum);

    // Fetch all student accounts (exclude admin)
    const students = await User.find({ role: { $ne: 'admin' } }).sort({ rollNumber: 1 });

    const studentResults: StudentAdminData[] = [];
    let validCgpaSum = 0;
    let studentsWithCgpaCount = 0;
    let highestCgpa: number | null = null;
    let lowestCgpa: number | null = null;
    let completedDegreeCount = 0;

    for (const student of students) {
      const records = await AcademicRecord.find({ userId: student._id });
      const recordsMap = new Map<number, ISubjectMark[]>();
      for (const rec of records) {
        recordsMap.set(rec.semester, rec.marks);
      }

      const semesterResults: SemesterCalculationResult[] = [];
      const semestersOverview: Record<number, StudentSemesterOverview> = {};

      for (let semNum = 1; semNum <= 6; semNum++) {
        const subjectDefs = getSemesterSubjects(semNum, curriculum);
        const marks = recordsMap.get(semNum) || [];
        const calcResult = calculateSemesterResults(semNum, subjectDefs, marks);
        semesterResults.push(calcResult);

        semestersOverview[semNum] = {
          sgpa: calcResult.sgpa,
          displaySgpa: calcResult.displaySgpa,
          completedCredits: calcResult.completedCredits,
          totalEligibleCredits: calcResult.totalEligibleCredits,
          totalMarksObtained: calcResult.totalMarksObtained,
          totalMaxMarks: calcResult.totalMaxMarks,
          percentage: calcResult.percentage,
          displayPercentage: calcResult.displayPercentage,
          status: calcResult.status
        };
      }

      const summary = calculateOverallSummary(semesterResults, totalCurriculumCredits);

      if (summary.cgpa !== null) {
        validCgpaSum += summary.cgpa;
        studentsWithCgpaCount++;

        if (highestCgpa === null || summary.cgpa > highestCgpa) {
          highestCgpa = summary.cgpa;
        }
        if (lowestCgpa === null || summary.cgpa < lowestCgpa) {
          lowestCgpa = summary.cgpa;
        }
      }

      if (summary.isFinalCGPA) {
        completedDegreeCount++;
      }

      let overallStatus: 'Completed' | 'In Progress' | 'Not Started' = 'Not Started';
      if (summary.completedSemestersCount === 6) {
        overallStatus = 'Completed';
      } else if (summary.completedCredits > 0) {
        overallStatus = 'In Progress';
      }

      studentResults.push({
        id: student._id.toString(),
        fullName: student.fullName,
        rollNumber: student.rollNumber,
        email: student.email,
        username: student.username,
        semesters: semestersOverview,
        cgpa: summary.cgpa,
        displayCgpa: summary.displayCgpa,
        completedCredits: summary.completedCredits,
        totalEligibleCredits: summary.totalEligibleCredits,
        totalMarksObtained: summary.totalMarksObtained,
        totalMaxMarks: summary.totalMaxMarks,
        overallPercentage: summary.overallPercentage,
        displayOverallPercentage: summary.displayOverallPercentage,
        completedSemestersCount: summary.completedSemestersCount,
        isFinalCGPA: summary.isFinalCGPA,
        status: overallStatus
      });
    }

    const departmentAverage =
      studentsWithCgpaCount > 0
        ? Number((validCgpaSum / studentsWithCgpaCount).toFixed(2))
        : null;

    res.status(200).json({
      success: true,
      stats: {
        totalStudents: students.length,
        studentsWithCgpaCount,
        departmentAverageCGPA: departmentAverage,
        highestCGPA: highestCgpa,
        lowestCGPA: lowestCgpa,
        completedDegreeCount
      },
      students: studentResults
    });
  } catch (error) {
    next(error);
  }
}

import { describe, it, expect } from 'vitest';
import {
  calculateGradePoint,
  calculateWeightedPoint,
  calculateSemesterResults,
  calculateOverallSummary,
  validateMarks
} from '../src/utils/calculation';
import { defaultCurriculum, getSemesterSubjects, calculateTotalCurriculumCredits } from '../src/data/defaultCurriculum';
import { SubjectMarkEntry, SemesterCalculationResult } from '../src/types';

describe('CSDA Calculation Engine - Official Curriculum & Isolation Tests', () => {
  describe('Mark Validation with Variable Max Marks (100, 75, 50)', () => {
    it('accepts null, undefined, or empty string as valid unentered mark', () => {
      expect(validateMarks(null, 100)).toEqual({ isValid: true, numericValue: null });
      expect(validateMarks(undefined, 75)).toEqual({ isValid: true, numericValue: null });
      expect(validateMarks('', 50)).toEqual({ isValid: true, numericValue: null });
    });

    it('accepts zero (0) as a valid mark', () => {
      const res = validateMarks(0, 100);
      expect(res.isValid).toBe(true);
      expect(res.numericValue).toBe(0);
    });

    it('respects max marks = 100', () => {
      expect(validateMarks(100, 100).isValid).toBe(true);
      expect(validateMarks(101, 100)).toEqual({
        isValid: false,
        numericValue: null,
        error: 'Marks cannot exceed 100.'
      });
    });

    it('respects max marks = 75 (e.g. Skill Based / R Programming Lab)', () => {
      expect(validateMarks(75, 75).isValid).toBe(true);
      expect(validateMarks(70, 75).isValid).toBe(true);
      expect(validateMarks(76, 75)).toEqual({
        isValid: false,
        numericValue: null,
        error: 'Marks cannot exceed 75.'
      });
    });

    it('respects max marks = 50 (e.g. Labs / Allied / EVS)', () => {
      expect(validateMarks(50, 50).isValid).toBe(true);
      expect(validateMarks(51, 50)).toEqual({
        isValid: false,
        numericValue: null,
        error: 'Marks cannot exceed 50.'
      });
    });

    it('rejects negative marks', () => {
      expect(validateMarks(-5, 100)).toEqual({
        isValid: false,
        numericValue: null,
        error: 'Marks cannot be negative.'
      });
    });
  });

  describe('Official Semester I - Calculation and Excluded Subject Isolation', () => {
    const sem1Subjects = getSemesterSubjects(1, defaultCurriculum);

    it('Semester 1 has exactly 16 eligible credits (4 Core/Allied subjects)', () => {
      const included = sem1Subjects.filter((s) => s.isIncludedInGPA);
      expect(included.length).toBe(4);
      const totalCredits = included.reduce((sum, s) => sum + s.credits, 0);
      expect(totalCredits).toBe(16);
    });

    it('Calculates SGPA accurately for eligible subjects', () => {
      // Core 1 (100 max, 4 cr): 85 -> 8.5 GP * 4 = 34
      // Core 2 (100 max, 4 cr): 80 -> 8.0 GP * 4 = 32
      // Core Lab 1 (100 max, 4 cr): 90 -> 9.0 GP * 4 = 36
      // Allied 1 (100 max, 4 cr): 85 -> 8.5 GP * 4 = 34
      // Total Weighted Points = 34 + 32 + 36 + 34 = 136
      // Total Credits = 16
      // SGPA = 136 / 16 = 8.50
      const marks: SubjectMarkEntry[] = [
        { subjectId: 'CSDA101', marksObtained: 85 },
        { subjectId: 'CSDA102', marksObtained: 80 },
        { subjectId: 'CSDA103P', marksObtained: 90 },
        { subjectId: 'CSDA104A', marksObtained: 85 }
      ];

      const result = calculateSemesterResults(1, sem1Subjects, marks);
      expect(result.status).toBe('Completed');
      expect(result.isCompleted).toBe(true);
      expect(result.totalEligibleCredits).toBe(16);
      expect(result.completedCredits).toBe(16);
      expect(result.totalWeightedPoints).toBe(136);
      expect(result.sgpa).toBe(8.5);
      expect(result.displaySgpa).toBe('8.50');
    });

    it('CRITICAL: Excluded subjects (Language, English, EVS) NEVER affect SGPA or Credits', () => {
      // Eligible subjects as above (SGPA 8.50)
      // Excluded subjects given 100 marks:
      const marksWithExcluded: SubjectMarkEntry[] = [
        { subjectId: 'CSDA101', marksObtained: 85 },
        { subjectId: 'CSDA102', marksObtained: 80 },
        { subjectId: 'CSDA103P', marksObtained: 90 },
        { subjectId: 'CSDA104A', marksObtained: 85 },
        // Excluded:
        { subjectId: 'CSDA105_LANG', marksObtained: 100 },
        { subjectId: 'CSDA106_ENG', marksObtained: 100 },
        { subjectId: 'CSDA107_EVS', marksObtained: 50 }
      ];

      const result = calculateSemesterResults(1, sem1Subjects, marksWithExcluded);

      // Verify that credits and SGPA are IDENTICAL (16 credits, 136 weighted points, 8.50 SGPA)
      expect(result.totalEligibleCredits).toBe(16);
      expect(result.completedCredits).toBe(16);
      expect(result.totalWeightedPoints).toBe(136);
      expect(result.sgpa).toBe(8.5);
      expect(result.displaySgpa).toBe('8.50');
    });
  });

  describe('Official Semester V & VI - Electives Excluded by Default', () => {
    it('Semester 5 has 15 credits included, Elective I excluded by default', () => {
      const sem5Subjects = getSemesterSubjects(5, defaultCurriculum);
      const included = sem5Subjects.filter((s) => s.isIncludedInGPA);
      expect(included.length).toBe(4); // Core 8, Core 9, Core Lab 6, Skill Based 3
      const totalCredits = included.reduce((sum, s) => sum + s.credits, 0);
      expect(totalCredits).toBe(15);

      const elective = sem5Subjects.find((s) => s.id === 'CSDA505_ELE1');
      expect(elective?.isIncludedInGPA).toBe(false);
    });

    it('Semester 6 has 13 credits included, Electives II & III excluded by default', () => {
      const sem6Subjects = getSemesterSubjects(6, defaultCurriculum);
      const included = sem6Subjects.filter((s) => s.isIncludedInGPA);
      expect(included.length).toBe(4); // Core 10, Core 11 Lab, Core Lab 7, Skill Based 4
      const totalCredits = included.reduce((sum, s) => sum + s.credits, 0);
      expect(totalCredits).toBe(13);

      const ele2 = sem6Subjects.find((s) => s.id === 'CSDA605_ELE2');
      const ele3 = sem6Subjects.find((s) => s.id === 'CSDA606_ELE3');
      expect(ele2?.isIncludedInGPA).toBe(false);
      expect(ele3?.isIncludedInGPA).toBe(false);
    });
  });

  describe('Full Degree CGPA & Percentage Calculation', () => {
    it('Total degree eligible credits equals 84 credits (Core + Allied + Skill Based)', () => {
      const totalCredits = calculateTotalCurriculumCredits(defaultCurriculum);
      expect(totalCredits).toBe(84); // 16 + 12 + 15 + 13 + 15 + 13
    });

    it('calculates exact Semester 1 percentage matching Image 1: 336/400 = 84.00%', () => {
      const sem1Subjects = getSemesterSubjects(1, defaultCurriculum);
      // Image 1 inputs: 68, 88, 100, 80 (sum = 336 / 400)
      const marks: SubjectMarkEntry[] = [
        { subjectId: 'CSDA101', marksObtained: 68 },
        { subjectId: 'CSDA102', marksObtained: 88 },
        { subjectId: 'CSDA103P', marksObtained: 100 },
        { subjectId: 'CSDA104A', marksObtained: 80 }
      ];

      const result = calculateSemesterResults(1, sem1Subjects, marks);
      expect(result.isCompleted).toBe(true);
      expect(result.totalMarksObtained).toBe(336);
      expect(result.totalMaxMarks).toBe(400);
      expect(result.percentage).toBe(84.0);
      expect(result.displayPercentage).toBe('84.00%');
      expect(result.sgpa).toBe(8.4);
      expect(result.displaySgpa).toBe('8.40');
      expect(result.totalWeightedPoints).toBe(134.4);
    });

    it('CRITICAL: Excluded subjects do NOT count towards semester marks or percentage', () => {
      const sem1Subjects = getSemesterSubjects(1, defaultCurriculum);
      const marksWithExcluded: SubjectMarkEntry[] = [
        { subjectId: 'CSDA101', marksObtained: 68 },
        { subjectId: 'CSDA102', marksObtained: 88 },
        { subjectId: 'CSDA103P', marksObtained: 100 },
        { subjectId: 'CSDA104A', marksObtained: 80 },
        // Excluded:
        { subjectId: 'CSDA105_LANG', marksObtained: 95 },
        { subjectId: 'CSDA106_ENG', marksObtained: 90 },
        { subjectId: 'CSDA107_EVS', marksObtained: 45 }
      ];

      const result = calculateSemesterResults(1, sem1Subjects, marksWithExcluded);
      expect(result.totalMarksObtained).toBe(336);
      expect(result.totalMaxMarks).toBe(400);
      expect(result.percentage).toBe(84.0);
      expect(result.displayPercentage).toBe('84.00%');
    });

    it('calculates exact Overall Percentage matching Image 3: 1287/1425 = 90.32% & CGPA 9.04', () => {
      const semesters: SemesterCalculationResult[] = [
        {
          semester: 1,
          status: 'Completed',
          subjects: [],
          totalEligibleCredits: 16,
          completedCredits: 16,
          totalWeightedPoints: 134.4,
          totalMarksObtained: 336,
          totalMaxMarks: 400,
          percentage: 84.0,
          displayPercentage: '84.00%',
          sgpa: 8.4,
          displaySgpa: '8.40',
          isCompleted: true
        },
        {
          semester: 2,
          status: 'Completed',
          subjects: [],
          totalEligibleCredits: 12,
          completedCredits: 12,
          totalWeightedPoints: 111.6,
          totalMarksObtained: 279,
          totalMaxMarks: 300,
          percentage: 93.0,
          displayPercentage: '93.00%',
          sgpa: 9.3,
          displaySgpa: '9.30',
          isCompleted: true
        },
        {
          semester: 3,
          status: 'Completed',
          subjects: [],
          totalEligibleCredits: 15,
          completedCredits: 15,
          totalWeightedPoints: 136.0,
          totalMarksObtained: 340,
          totalMaxMarks: 375,
          percentage: 90.67,
          displayPercentage: '90.67%',
          sgpa: 9.07,
          displaySgpa: '9.07',
          isCompleted: true
        },
        {
          semester: 4,
          status: 'Completed',
          subjects: [],
          totalEligibleCredits: 13,
          completedCredits: 13,
          totalWeightedPoints: 124.3,
          totalMarksObtained: 332,
          totalMaxMarks: 350,
          percentage: 94.86,
          displayPercentage: '94.86%',
          sgpa: 9.56,
          displaySgpa: '9.56',
          isCompleted: true
        },
        {
          semester: 5,
          status: 'Not Started',
          subjects: [],
          totalEligibleCredits: 15,
          completedCredits: 0,
          totalWeightedPoints: 0,
          totalMarksObtained: 0,
          totalMaxMarks: 350,
          percentage: null,
          displayPercentage: '--',
          sgpa: null,
          displaySgpa: '--',
          isCompleted: false
        },
        {
          semester: 6,
          status: 'Not Started',
          subjects: [],
          totalEligibleCredits: 13,
          completedCredits: 0,
          totalWeightedPoints: 0,
          totalMarksObtained: 0,
          totalMaxMarks: 325,
          percentage: null,
          displayPercentage: '--',
          sgpa: null,
          displaySgpa: '--',
          isCompleted: false
        }
      ];

      const summary = calculateOverallSummary(semesters, 84);
      expect(summary.completedCredits).toBe(56);
      expect(summary.totalMarksObtained).toBe(1287);
      expect(summary.totalMaxMarks).toBe(1425);
      expect(summary.overallPercentage).toBe(90.32);
      expect(summary.displayOverallPercentage).toBe('90.32%');
      expect(summary.displayCgpa).toBe('9.04');
    });

    it('calculates credit-weighted CGPA across all 6 semesters', () => {
      const semesters: SemesterCalculationResult[] = [
        { semester: 1, status: 'Completed', subjects: [], totalEligibleCredits: 16, completedCredits: 16, totalWeightedPoints: 136, totalMarksObtained: 340, totalMaxMarks: 400, percentage: 85, displayPercentage: '85.00%', sgpa: 8.5, displaySgpa: '8.50', isCompleted: true },
        { semester: 2, status: 'Completed', subjects: [], totalEligibleCredits: 12, completedCredits: 12, totalWeightedPoints: 102, totalMarksObtained: 255, totalMaxMarks: 300, percentage: 85, displayPercentage: '85.00%', sgpa: 8.5, displaySgpa: '8.50', isCompleted: true },
        { semester: 3, status: 'Completed', subjects: [], totalEligibleCredits: 15, completedCredits: 15, totalWeightedPoints: 127.5, totalMarksObtained: 318.75, totalMaxMarks: 375, percentage: 85, displayPercentage: '85.00%', sgpa: 8.5, displaySgpa: '8.50', isCompleted: true },
        { semester: 4, status: 'Completed', subjects: [], totalEligibleCredits: 13, completedCredits: 13, totalWeightedPoints: 110.5, totalMarksObtained: 297.5, totalMaxMarks: 350, percentage: 85, displayPercentage: '85.00%', sgpa: 8.5, displaySgpa: '8.50', isCompleted: true },
        { semester: 5, status: 'Completed', subjects: [], totalEligibleCredits: 15, completedCredits: 15, totalWeightedPoints: 127.5, totalMarksObtained: 297.5, totalMaxMarks: 350, percentage: 85, displayPercentage: '85.00%', sgpa: 8.5, displaySgpa: '8.50', isCompleted: true },
        { semester: 6, status: 'Completed', subjects: [], totalEligibleCredits: 13, completedCredits: 13, totalWeightedPoints: 110.5, totalMarksObtained: 276.25, totalMaxMarks: 325, percentage: 85, displayPercentage: '85.00%', sgpa: 8.5, displaySgpa: '8.50', isCompleted: true }
      ];

      const summary = calculateOverallSummary(semesters, 84);
      expect(summary.isFinalCGPA).toBe(true);
      expect(summary.cgpaType).toBe('Final CGPA');
      expect(summary.completedCredits).toBe(84);
      expect(summary.cgpa).toBe(8.5);
      expect(summary.displayCgpa).toBe('8.50');
      expect(summary.overallPercentage).toBe(85);
      expect(summary.displayOverallPercentage).toBe('85.00%');
    });
  });
});

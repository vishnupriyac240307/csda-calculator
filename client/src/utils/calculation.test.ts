import { describe, it, expect } from 'vitest';
import {
  calculateGradePoint,
  calculateWeightedPoint,
  calculateSemesterResults,
  validateMarks
} from './calculation';
import { initialCurriculum, getSemesterSubjects } from '../data/curriculum';

describe('Client Calculation & Official CSDA Policy Tests', () => {
  it('validates marks on the client correctly with exact error message', () => {
    expect(validateMarks('', 100)).toEqual({ isValid: true, numericValue: null });
    expect(validateMarks('87.5', 100)).toEqual({ isValid: true, numericValue: 87.5 });
    expect(validateMarks('-1', 75)).toEqual({ isValid: false, numericValue: null, error: 'Marks cannot be negative.' });
    expect(validateMarks('76', 75)).toEqual({ isValid: false, numericValue: null, error: 'Marks cannot exceed 75.' });
    expect(validateMarks('51', 50)).toEqual({ isValid: false, numericValue: null, error: 'Marks cannot exceed 50.' });
  });

  it('calculates Grade Point and Weighted Point properly', () => {
    expect(calculateGradePoint(90, 100)).toBe(9);
    expect(calculateWeightedPoint(90, 100, 4)).toBe(36);
  });

  it('guarantees excluded subjects in Semester 1 do not affect SGPA', () => {
    const sem1Subjects = getSemesterSubjects(1, initialCurriculum);

    // Enter marks for eligible courses:
    // Core 1 (100 max, 4 cr): 80 -> 8 GP * 4 = 32
    // Core 2 (100 max, 4 cr): 80 -> 8 GP * 4 = 32
    // Core Lab 1 (100 max, 4 cr): 80 -> 8 GP * 4 = 32
    // Allied 1 (100 max, 4 cr): 80 -> 8 GP * 4 = 32
    // Total Weighted = 128 / 16 cr = 8.00 SGPA
    const userMarks = [
      { subjectId: 'CSDA101', marksObtained: 80 },
      { subjectId: 'CSDA102', marksObtained: 80 },
      { subjectId: 'CSDA103P', marksObtained: 80 },
      { subjectId: 'CSDA104A', marksObtained: 80 },
      // Excluded:
      { subjectId: 'CSDA105_LANG', marksObtained: 100 },
      { subjectId: 'CSDA106_ENG', marksObtained: 100 },
      { subjectId: 'CSDA107_EVS', marksObtained: 50 }
    ];

    const result = calculateSemesterResults(1, sem1Subjects, userMarks);
    expect(result.sgpa).toBe(8.0);
    expect(result.completedCredits).toBe(16);
    expect(result.totalWeightedPoints).toBe(128);
    // Excluded courses must not affect marks or percentage
    expect(result.totalMarksObtained).toBe(320); // 80 * 4
    expect(result.totalMaxMarks).toBe(400);
    expect(result.percentage).toBe(80.0);
    expect(result.displayPercentage).toBe('80.00%');
  });

  it('calculates Image 1 exact values: 68+88+100+80 = 336/400 (84.00%) and SGPA 8.40', () => {
    const sem1Subjects = getSemesterSubjects(1, initialCurriculum);
    const userMarks = [
      { subjectId: 'CSDA101', marksObtained: 68 },
      { subjectId: 'CSDA102', marksObtained: 88 },
      { subjectId: 'CSDA103P', marksObtained: 100 },
      { subjectId: 'CSDA104A', marksObtained: 80 }
    ];

    const result = calculateSemesterResults(1, sem1Subjects, userMarks);
    expect(result.sgpa).toBe(8.4);
    expect(result.displaySgpa).toBe('8.40');
    expect(result.totalMarksObtained).toBe(336);
    expect(result.totalMaxMarks).toBe(400);
    expect(result.percentage).toBe(84.0);
    expect(result.displayPercentage).toBe('84.00%');
    expect(result.totalWeightedPoints).toBe(134.4);
    expect(result.completedCredits).toBe(16);
  });
});

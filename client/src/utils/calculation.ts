import {
  SubjectDefinition,
  SubjectMarkEntry,
  SubjectCalculationDetail,
  SemesterCalculationResult,
  OverallAcademicSummary,
  MarkValidationResult,
  SemesterStatus
} from '../types';

export function validateMarks(
  markInput: number | string | null | undefined,
  maxMarks: number
): MarkValidationResult {
  if (markInput === null || markInput === undefined || (typeof markInput === 'string' && markInput.trim() === '')) {
    return { isValid: true, numericValue: null };
  }

  const num = typeof markInput === 'string' ? Number(markInput.trim()) : markInput;

  if (isNaN(num)) {
    return {
      isValid: false,
      numericValue: null,
      error: 'Please enter a valid number.'
    };
  }

  if (num < 0) {
    return {
      isValid: false,
      numericValue: null,
      error: 'Marks cannot be negative.'
    };
  }

  if (num > maxMarks) {
    return {
      isValid: false,
      numericValue: null,
      error: `Marks cannot exceed ${maxMarks}.`
    };
  }

  return {
    isValid: true,
    numericValue: num
  };
}

export function calculateGradePoint(mark: number, maxMarks: number): number {
  if (maxMarks <= 0) return 0;
  return (mark / maxMarks) * 10;
}

export function calculateWeightedPoint(mark: number, maxMarks: number, credits: number): number {
  const gp = calculateGradePoint(mark, maxMarks);
  return gp * credits;
}

export function calculateSemesterResults(
  semesterNumber: number,
  subjectDefs: SubjectDefinition[],
  userMarks: SubjectMarkEntry[]
): SemesterCalculationResult {
  const marksMap = new Map<string, number | null>();
  for (const entry of userMarks) {
    marksMap.set(entry.subjectId, entry.marksObtained);
  }

  let totalEligibleCredits = 0;
  let enteredEligibleCredits = 0;
  let totalWeightedPoints = 0;
  let eligibleSubjectsCount = 0;
  let enteredEligibleCount = 0;
  let totalEnteredCount = 0;
  let totalMarksObtained = 0;
  let totalMaxMarks = 0;
  let enteredEligibleMaxMarks = 0;

  const subjectsDetail: SubjectCalculationDetail[] = [];

  for (const def of subjectDefs) {
    const rawMark = marksMap.get(def.id) ?? null;
    const validation = validateMarks(rawMark, def.maxMarks);

    if (validation.numericValue !== null) {
      totalEnteredCount++;
    }

    let gradePoint: number | null = null;
    let weightedPoint: number | null = null;

    if (validation.isValid && validation.numericValue !== null) {
      gradePoint = calculateGradePoint(validation.numericValue, def.maxMarks);
      weightedPoint = calculateWeightedPoint(validation.numericValue, def.maxMarks, def.credits);
    }

    if (def.isIncludedInGPA) {
      totalEligibleCredits += def.credits;
      totalMaxMarks += def.maxMarks;
      eligibleSubjectsCount++;

      if (validation.isValid && validation.numericValue !== null) {
        enteredEligibleCredits += def.credits;
        enteredEligibleCount++;
        totalWeightedPoints += weightedPoint ?? 0;
        totalMarksObtained += validation.numericValue;
        enteredEligibleMaxMarks += def.maxMarks;
      }
    }

    subjectsDetail.push({
      subjectId: def.id,
      code: def.code,
      name: def.name,
      category: def.category,
      maxMarks: def.maxMarks,
      credits: def.credits,
      isIncludedInGPA: def.isIncludedInGPA,
      marksObtained: validation.numericValue,
      isValid: validation.isValid,
      errorMessage: validation.error,
      gradePoint: gradePoint !== null ? Number(gradePoint.toFixed(2)) : null,
      weightedPoint: weightedPoint !== null ? Number(weightedPoint.toFixed(2)) : null
    });
  }

  let status: SemesterStatus = 'Not Started';
  let isCompleted = false;

  if (totalEnteredCount === 0) {
    status = 'Not Started';
  } else if (enteredEligibleCount === eligibleSubjectsCount && eligibleSubjectsCount > 0) {
    status = 'Completed';
    isCompleted = true;
  } else {
    status = 'In Progress';
  }

  let sgpa: number | null = null;
  let displaySgpa = 'N/A';

  if (isCompleted && totalEligibleCredits > 0) {
    const rawSgpa = totalWeightedPoints / totalEligibleCredits;
    sgpa = Number(rawSgpa.toFixed(2));
    displaySgpa = sgpa.toFixed(2);
  } else if (enteredEligibleCredits > 0) {
    const provSgpa = totalWeightedPoints / enteredEligibleCredits;
    sgpa = Number(provSgpa.toFixed(2));
    displaySgpa = `${sgpa.toFixed(2)} (Prov.)`;
  }

  // Percentage Calculation
  let percentage: number | null = null;
  let displayPercentage = '--';

  if (isCompleted && totalMaxMarks > 0) {
    percentage = Number(((totalMarksObtained / totalMaxMarks) * 100).toFixed(2));
    displayPercentage = `${percentage.toFixed(2)}%`;
  } else if (enteredEligibleMaxMarks > 0) {
    percentage = Number(((totalMarksObtained / enteredEligibleMaxMarks) * 100).toFixed(2));
    displayPercentage = `${percentage.toFixed(2)}% (Prov.)`;
  }

  return {
    semester: semesterNumber,
    status,
    subjects: subjectsDetail,
    totalEligibleCredits,
    completedCredits: enteredEligibleCredits,
    totalWeightedPoints: Number(totalWeightedPoints.toFixed(2)),
    totalMarksObtained,
    totalMaxMarks,
    percentage,
    displayPercentage,
    sgpa,
    displaySgpa,
    isCompleted
  };
}

export function calculateOverallSummary(
  semesterResults: SemesterCalculationResult[],
  totalCurriculumCredits: number
): OverallAcademicSummary {
  let grandTotalWeighted = 0;
  let grandCompletedCredits = 0;
  let grandMarksObtained = 0;
  let grandMaxMarks = 0;
  let completedSemestersCount = 0;

  for (const sem of semesterResults) {
    if (sem.isCompleted) {
      completedSemestersCount++;
      grandCompletedCredits += sem.completedCredits;
      grandTotalWeighted += sem.totalWeightedPoints;
      grandMarksObtained += sem.totalMarksObtained;
      grandMaxMarks += sem.totalMaxMarks;
    } else if (sem.completedCredits > 0) {
      grandCompletedCredits += sem.completedCredits;
      grandTotalWeighted += sem.totalWeightedPoints;
      grandMarksObtained += sem.totalMarksObtained;
      const enteredSubjectsMax = sem.subjects
        .filter(s => s.isIncludedInGPA && s.marksObtained !== null)
        .reduce((sum, s) => sum + s.maxMarks, 0);
      grandMaxMarks += enteredSubjectsMax;
    }
  }

  let cgpa: number | null = null;
  let displayCgpa = 'N/A';
  let isFinalCGPA = false;
  let cgpaType: 'Current CGPA' | 'Final CGPA' | 'Not Calculable' = 'Not Calculable';
  let explanation = 'No academic marks have been entered yet.';

  const isAllSixCompleted = completedSemestersCount === 6 && semesterResults.length === 6;

  if (grandCompletedCredits > 0) {
    const rawCgpa = grandTotalWeighted / grandCompletedCredits;
    cgpa = Number(rawCgpa.toFixed(2));
    displayCgpa = cgpa.toFixed(2);

    if (isAllSixCompleted) {
      isFinalCGPA = true;
      cgpaType = 'Final CGPA';
      explanation = 'All 6 semesters completed. This is your final cumulative grade point average.';
    } else {
      isFinalCGPA = false;
      cgpaType = 'Current CGPA';
      explanation = `Calculated across ${completedSemestersCount} completed semester(s) and ${grandCompletedCredits} eligible credits earned so far.`;
    }
  }

  let overallPercentage: number | null = null;
  let displayOverallPercentage = '--';

  if (grandMaxMarks > 0) {
    overallPercentage = Number(((grandMarksObtained / grandMaxMarks) * 100).toFixed(2));
    displayOverallPercentage = `${overallPercentage.toFixed(2)}%`;
  }

  const overallProgressPercentage =
    totalCurriculumCredits > 0
      ? Number(Math.min(100, (grandCompletedCredits / totalCurriculumCredits) * 100).toFixed(1))
      : 0;

  return {
    cgpa,
    displayCgpa,
    isFinalCGPA,
    cgpaType,
    completedSemestersCount,
    totalSemestersCount: 6,
    completedCredits: grandCompletedCredits,
    totalEligibleCredits: totalCurriculumCredits,
    totalMarksObtained: grandMarksObtained,
    totalMaxMarks: grandMaxMarks,
    overallPercentage,
    displayOverallPercentage,
    overallProgressPercentage,
    totalWeightedPoints: Number(grandTotalWeighted.toFixed(2)),
    semesters: semesterResults,
    explanation
  };
}

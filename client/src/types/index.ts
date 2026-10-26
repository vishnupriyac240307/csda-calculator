export type SubjectCategory =
  | 'Core Theory'
  | 'Core Practical'
  | 'Allied Theory'
  | 'Allied Practical'
  | 'Elective'
  | 'Skill Based'
  | 'Value Added'
  | 'Non-Major Elective'
  | 'Environmental / Extension'
  | 'Configurable Subject';

export interface SubjectDefinition {
  id: string;
  semester: number; // 1 to 6
  code: string;
  name: string;
  category: SubjectCategory;
  maxMarks: number;
  credits: number;
  isIncludedInGPA: boolean;
  isPractical: boolean;
  description?: string;
}

export interface SemesterCurriculum {
  semester: number;
  title: string;
  subjects: SubjectDefinition[];
  totalEligibleCredits: number;
}

export interface CurriculumConfig {
  version: string;
  department: string;
  degree: string;
  academicYear: string;
  semestersCount: number;
  isOfficialConfigLoaded: boolean;
  statusNotice: string;
  semesters: SemesterCurriculum[];
}

export interface SubjectMarkEntry {
  subjectId: string;
  marksObtained: number | null;
}

export interface SubjectCalculationDetail {
  subjectId: string;
  code: string;
  name: string;
  category: SubjectCategory;
  maxMarks: number;
  credits: number;
  isIncludedInGPA: boolean;
  marksObtained: number | null;
  isValid: boolean;
  errorMessage?: string;
  gradePoint: number | null;
  weightedPoint: number | null;
}

export type SemesterStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface SemesterCalculationResult {
  semester: number;
  status: SemesterStatus;
  subjects: SubjectCalculationDetail[];
  totalEligibleCredits: number;
  completedCredits: number;
  totalWeightedPoints: number;
  totalMarksObtained: number;
  totalMaxMarks: number;
  percentage: number | null;
  displayPercentage: string; // e.g. "84.00%" or "--"
  sgpa: number | null;
  displaySgpa: string;
  isCompleted: boolean;
}

export interface OverallAcademicSummary {
  cgpa: number | null;
  displayCgpa: string;
  isFinalCGPA: boolean;
  cgpaType: 'Current CGPA' | 'Final CGPA' | 'Not Calculable';
  completedSemestersCount: number;
  totalSemestersCount: number;
  completedCredits: number;
  totalEligibleCredits: number;
  totalMarksObtained: number;
  totalMaxMarks: number;
  overallPercentage: number | null;
  displayOverallPercentage: string; // e.g. "90.32%" or "--"
  overallProgressPercentage: number;
  totalWeightedPoints: number;
  semesters: SemesterCalculationResult[];
  explanation: string;
}

export interface MarkValidationResult {
  isValid: boolean;
  numericValue: number | null;
  error?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  rollNumber: string;
  email: string;
  username: string;
  role?: 'student' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentSemesterOverview {
  sgpa: number | null;
  displaySgpa: string;
  completedCredits: number;
  totalEligibleCredits: number;
  totalMarksObtained: number;
  totalMaxMarks: number;
  percentage: number | null;
  displayPercentage: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

export interface StudentAdminData {
  id: string;
  fullName: string;
  rollNumber: string;
  email: string;
  username: string;
  semesters: Record<number, StudentSemesterOverview>;
  cgpa: number | null;
  displayCgpa: string;
  completedCredits: number;
  totalEligibleCredits: number;
  totalMarksObtained: number;
  totalMaxMarks: number;
  overallPercentage: number | null;
  displayOverallPercentage: string;
  completedSemestersCount: number;
  isFinalCGPA: boolean;
  status: 'Completed' | 'In Progress' | 'Not Started';
}

export interface AdminStats {
  totalStudents: number;
  studentsWithCgpaCount: number;
  departmentAverageCGPA: number | null;
  highestCGPA: number | null;
  lowestCGPA: number | null;
  completedDegreeCount: number;
}

export interface AdminPerformanceResponse {
  success: boolean;
  stats: AdminStats;
  students: StudentAdminData[];
}

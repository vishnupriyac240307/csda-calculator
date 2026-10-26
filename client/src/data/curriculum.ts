import { CurriculumConfig, SubjectDefinition } from '../types';

export const initialCurriculum: CurriculumConfig = {
  version: '2.0.0-official-csda',
  department: 'B.Sc. Computer Science with Data Analytics (CSDA)',
  degree: 'Bachelor of Science (B.Sc.)',
  academicYear: '2024 - 2027',
  semestersCount: 6,
  isOfficialConfigLoaded: true,
  statusNotice:
    'Official CSDA Curriculum Active. Rule: Core + Allied + Skill Based subjects are included in SGPA & CGPA.',
  semesters: [
    // ==========================================
    // SEMESTER I (Total Eligible Credits = 16)
    // ==========================================
    {
      semester: 1,
      title: 'Semester I',
      totalEligibleCredits: 16,
      subjects: [
        // Included
        {
          id: 'CSDA101',
          semester: 1,
          code: 'Core 1',
          name: 'Programming in C',
          category: 'Core Theory',
          maxMarks: 100,
          credits: 4,
          isIncludedInGPA: true,
          isPractical: false
        },
        {
          id: 'CSDA102',
          semester: 1,
          code: 'Core 2',
          name: 'Data Structures',
          category: 'Core Theory',
          maxMarks: 100,
          credits: 4,
          isIncludedInGPA: true,
          isPractical: false
        },
        {
          id: 'CSDA103P',
          semester: 1,
          code: 'Core Lab 1',
          name: 'Programming Lab - C',
          category: 'Core Practical',
          maxMarks: 100,
          credits: 4,
          isIncludedInGPA: true,
          isPractical: true
        },
        {
          id: 'CSDA104A',
          semester: 1,
          code: 'Allied 1',
          name: 'Introduction to Linear Algebra',
          category: 'Allied Theory',
          maxMarks: 100,
          credits: 4,
          isIncludedInGPA: true,
          isPractical: false
        },
        // Excluded
        {
          id: 'CSDA105_LANG',
          semester: 1,
          code: 'Language - I',
          name: 'Language - I',
          category: 'Non-Major Elective',
          maxMarks: 100,
          credits: 4,
          isIncludedInGPA: false,
          isPractical: false,
          description: 'Excluded from SGPA/CGPA (Language course)'
        },
        {
          id: 'CSDA106_ENG',
          semester: 1,
          code: 'English - I',
          name: 'English - I',
          category: 'Non-Major Elective',
          maxMarks: 100,
          credits: 4,
          isIncludedInGPA: false,
          isPractical: false,
          description: 'Excluded from SGPA/CGPA (Language course)'
        },
        {
          id: 'CSDA107_EVS',
          semester: 1,
          code: 'EVS',
          name: 'Environmental Studies',
          category: 'Environmental / Extension',
          maxMarks: 50,
          credits: 2,
          isIncludedInGPA: false,
          isPractical: false,
          description: 'Excluded from SGPA/CGPA (Audit course)'
        }
      ]
    },

    // ==========================================
    // SEMESTER II (Total Eligible Credits = 12)
    // ==========================================
    {
      semester: 2,
      title: 'Semester II',
      totalEligibleCredits: 12,
      subjects: [
        // Included
        {
          id: 'CSDA201',
          semester: 2,
          code: 'Core 3',
          name: 'Programming in C++',
          category: 'Core Theory',
          maxMarks: 100,
          credits: 4,
          isIncludedInGPA: true,
          isPractical: false
        },
        {
          id: 'CSDA202P',
          semester: 2,
          code: 'Core Lab 2',
          name: 'Programming Lab - C++',
          category: 'Core Practical',
          maxMarks: 50,
          credits: 2,
          isIncludedInGPA: true,
          isPractical: true
        },
        {
          id: 'CSDA203P',
          semester: 2,
          code: 'Core Lab 3',
          name: 'Internet Basics Lab',
          category: 'Core Practical',
          maxMarks: 50,
          credits: 2,
          isIncludedInGPA: true,
          isPractical: true
        },
        {
          id: 'CSDA204A',
          semester: 2,
          code: 'Allied 2',
          name: 'Discrete Mathematics',
          category: 'Allied Theory',
          maxMarks: 100,
          credits: 4,
          isIncludedInGPA: true,
          isPractical: false
        },
        // Excluded
        {
          id: 'CSDA205_LANG',
          semester: 2,
          code: 'Language - II',
          name: 'Language - II',
          category: 'Non-Major Elective',
          maxMarks: 100,
          credits: 4,
          isIncludedInGPA: false,
          isPractical: false,
          description: 'Excluded from SGPA/CGPA (Language course)'
        },
        {
          id: 'CSDA206_ENG',
          semester: 2,
          code: 'English - II',
          name: 'English - II',
          category: 'Non-Major Elective',
          maxMarks: 50,
          credits: 2,
          isIncludedInGPA: false,
          isPractical: false,
          description: 'Excluded from SGPA/CGPA (Language course)'
        },
        {
          id: 'CSDA207_NM',
          semester: 2,
          code: 'Naan Muthalvan',
          name: 'Naan/Muthalvan - Skill Course Effective English',
          category: 'Skill Based',
          maxMarks: 50,
          credits: 2,
          isIncludedInGPA: false,
          isPractical: false,
          description: 'Excluded from SGPA/CGPA per policy'
        },
        {
          id: 'CSDA208_VE',
          semester: 2,
          code: 'Value Education',
          name: 'Value Education - Human Rights',
          category: 'Value Added',
          maxMarks: 50,
          credits: 2,
          isIncludedInGPA: false,
          isPractical: false,
          description: 'Excluded from SGPA/CGPA (Audit course)'
        }
      ]
    },

    // ==========================================
    // SEMESTER III (Total Eligible Credits = 15)
    // ==========================================
    {
      semester: 3,
      title: 'Semester III',
      totalEligibleCredits: 15,
      subjects: [
        // Included
        {
          id: 'CSDA301',
          semester: 3,
          code: 'Core 4',
          name: 'JAVA Programming',
          category: 'Core Theory',
          maxMarks: 100,
          credits: 4,
          isIncludedInGPA: true,
          isPractical: false
        },
        {
          id: 'CSDA302',
          semester: 3,
          code: 'Core 5',
          name: 'Database Management Systems',
          category: 'Core Theory',
          maxMarks: 100,
          credits: 4,
          isIncludedInGPA: true,
          isPractical: false
        },
        {
          id: 'CSDA303P',
          semester: 3,
          code: 'Core Lab 4',
          name: 'JAVA Programming Lab',
          category: 'Core Practical',
          maxMarks: 50,
          credits: 2,
          isIncludedInGPA: true,
          isPractical: true
        },
        {
          id: 'CSDA304A',
          semester: 3,
          code: 'Allied 3',
          name: 'Data Communication and Networks',
          category: 'Allied Theory',
          maxMarks: 50,
          credits: 2,
          isIncludedInGPA: true,
          isPractical: false
        },
        {
          id: 'CSDA305S',
          semester: 3,
          code: 'Skill Based 1',
          name: 'Skill Based Subject 1: Data Visualization',
          category: 'Skill Based',
          maxMarks: 75,
          credits: 3,
          isIncludedInGPA: true,
          isPractical: false
        },
        // Excluded
        {
          id: 'CSDA306_LANG',
          semester: 3,
          code: 'Language - III',
          name: 'Language - III',
          category: 'Non-Major Elective',
          maxMarks: 100,
          credits: 4,
          isIncludedInGPA: false,
          isPractical: false,
          description: 'Excluded from SGPA/CGPA (Language course)'
        },
        {
          id: 'CSDA307_ENG',
          semester: 3,
          code: 'English - III',
          name: 'English - III',
          category: 'Non-Major Elective',
          maxMarks: 100,
          credits: 4,
          isIncludedInGPA: false,
          isPractical: false,
          description: 'Excluded from SGPA/CGPA (Language course)'
        },
        {
          id: 'CSDA308_NME',
          semester: 3,
          code: 'NME / Tamil',
          name: "Tamil / Advanced Tamil / Non-major elective / Women's Rights",
          category: 'Non-Major Elective',
          maxMarks: 50,
          credits: 2,
          isIncludedInGPA: false,
          isPractical: false,
          description: 'Excluded from SGPA/CGPA'
        }
      ]
    },

    // ==========================================
    // SEMESTER IV (Total Eligible Credits = 13)
    // ==========================================
    {
      semester: 4,
      title: 'Semester IV',
      totalEligibleCredits: 13,
      subjects: [
        // Included
        {
          id: 'CSDA401',
          semester: 4,
          code: 'Core 6',
          name: 'Python Programming',
          category: 'Core Theory',
          maxMarks: 100,
          credits: 4,
          isIncludedInGPA: true,
          isPractical: false
        },
        {
          id: 'CSDA402',
          semester: 4,
          code: 'Core 7',
          name: 'Data Warehousing and Data Mining',
          category: 'Core Theory',
          maxMarks: 100,
          credits: 3,
          isIncludedInGPA: true,
          isPractical: false
        },
        {
          id: 'CSDA403P',
          semester: 4,
          code: 'Core Lab 5',
          name: 'Python Programming Lab',
          category: 'Core Practical',
          maxMarks: 50,
          credits: 2,
          isIncludedInGPA: true,
          isPractical: true
        },
        {
          id: 'CSDA404A',
          semester: 4,
          code: 'Allied 4',
          name: 'Deep Learning',
          category: 'Allied Theory',
          maxMarks: 50,
          credits: 2,
          isIncludedInGPA: true,
          isPractical: false
        },
        {
          id: 'CSDA405S',
          semester: 4,
          code: 'Skill Based 2 Lab',
          name: 'Skill Based Subject 2 Lab: Capstone Project Work Phase I',
          category: 'Skill Based',
          maxMarks: 50,
          credits: 2,
          isIncludedInGPA: true,
          isPractical: true
        },
        // Excluded
        {
          id: 'CSDA406_LANG',
          semester: 4,
          code: 'Language - IV',
          name: 'Language - IV',
          category: 'Non-Major Elective',
          maxMarks: 100,
          credits: 4,
          isIncludedInGPA: false,
          isPractical: false,
          description: 'Excluded from SGPA/CGPA (Language course)'
        },
        {
          id: 'CSDA407_ENG',
          semester: 4,
          code: 'English - IV',
          name: 'English - IV',
          category: 'Non-Major Elective',
          maxMarks: 50,
          credits: 2,
          isIncludedInGPA: false,
          isPractical: false,
          description: 'Excluded from SGPA/CGPA (Language course)'
        },
        {
          id: 'CSDA408_NM',
          semester: 4,
          code: 'Naan Muthalvan',
          name: 'Naan Muthalvan - Skill Course Office Fundamentals - Lab',
          category: 'Skill Based',
          maxMarks: 50,
          credits: 2,
          isIncludedInGPA: false,
          isPractical: true,
          description: 'Excluded from SGPA/CGPA'
        },
        {
          id: 'CSDA409_NME',
          semester: 4,
          code: 'NME - II',
          name: 'Tamil / Advanced Tamil / Non-major elective - II',
          category: 'Non-Major Elective',
          maxMarks: 100,
          credits: 2,
          isIncludedInGPA: false,
          isPractical: false,
          description: 'Excluded from SGPA/CGPA'
        }
      ]
    },

    // ==========================================
    // SEMESTER V (Total Eligible Credits = 15)
    // ==========================================
    {
      semester: 5,
      title: 'Semester V',
      totalEligibleCredits: 15,
      subjects: [
        // Included
        {
          id: 'CSDA501',
          semester: 5,
          code: 'Core 8',
          name: 'R Programming',
          category: 'Core Theory',
          maxMarks: 100,
          credits: 4,
          isIncludedInGPA: true,
          isPractical: false
        },
        {
          id: 'CSDA502',
          semester: 5,
          code: 'Core 9',
          name: 'Big Data Analytics',
          category: 'Core Theory',
          maxMarks: 100,
          credits: 4,
          isIncludedInGPA: true,
          isPractical: false
        },
        {
          id: 'CSDA503P',
          semester: 5,
          code: 'Core Lab 6',
          name: 'R Programming Lab',
          category: 'Core Practical',
          maxMarks: 75,
          credits: 4,
          isIncludedInGPA: true,
          isPractical: true
        },
        {
          id: 'CSDA504S',
          semester: 5,
          code: 'Skill Based 3',
          name: 'Skill Based Subject 3: Capstone Project Work Phase II',
          category: 'Skill Based',
          maxMarks: 75,
          credits: 3,
          isIncludedInGPA: true,
          isPractical: true
        },
        // Configurable Elective (Excluded by default per Core+Allied+Skill Based policy)
        {
          id: 'CSDA505_ELE1',
          semester: 5,
          code: 'Elective I',
          name: 'Elective I: Business Data Analytics / Social Network Analysis / Artificial Neural Network and Fuzzy Systems',
          category: 'Elective',
          maxMarks: 100,
          credits: 4,
          isIncludedInGPA: false,
          isPractical: false,
          description: 'Elective - Excluded from SGPA/CGPA by default (Core + Allied + Skill Based policy). Can be enabled if required.'
        }
      ]
    },

    // ==========================================
    // SEMESTER VI (Total Eligible Credits = 13)
    // ==========================================
    {
      semester: 6,
      title: 'Semester VI',
      totalEligibleCredits: 13,
      subjects: [
        // Included
        {
          id: 'CSDA601',
          semester: 6,
          code: 'Core 10',
          name: 'Linux and Shell Programming',
          category: 'Core Theory',
          maxMarks: 100,
          credits: 4,
          isIncludedInGPA: true,
          isPractical: false
        },
        {
          id: 'CSDA602P',
          semester: 6,
          code: 'Core 11 Lab',
          name: 'Project Work Lab',
          category: 'Core Practical',
          maxMarks: 100,
          credits: 4,
          isIncludedInGPA: true,
          isPractical: true
        },
        {
          id: 'CSDA603P',
          semester: 6,
          code: 'Core Lab 7',
          name: 'Linux and Shell Programming Lab',
          category: 'Core Practical',
          maxMarks: 75,
          credits: 3,
          isIncludedInGPA: true,
          isPractical: true
        },
        {
          id: 'CSDA604S',
          semester: 6,
          code: 'Skill Based 4',
          name: 'Skill Based Subject 4: Machine Learning',
          category: 'Skill Based',
          maxMarks: 50,
          credits: 2,
          isIncludedInGPA: true,
          isPractical: false
        },
        // Excluded Electives & General Courses
        {
          id: 'CSDA605_ELE2',
          semester: 6,
          code: 'Elective II',
          name: 'Elective II: Web Application Security / Software Agents / Embedded Systems',
          category: 'Elective',
          maxMarks: 100,
          credits: 4,
          isIncludedInGPA: false,
          isPractical: false,
          description: 'Elective - Excluded by default per Core + Allied + Skill Based policy.'
        },
        {
          id: 'CSDA606_ELE3',
          semester: 6,
          code: 'Elective III',
          name: 'Elective III: Client Server Computing / Open Source Software / Principles of Secure Coding',
          category: 'Elective',
          maxMarks: 100,
          credits: 4,
          isIncludedInGPA: false,
          isPractical: false,
          description: 'Elective - Excluded by default per Core + Allied + Skill Based policy.'
        },
        {
          id: 'CSDA607_NM',
          semester: 6,
          code: 'Naan Muthalvan',
          name: 'Naan Muthalvan Skill Course',
          category: 'Skill Based',
          maxMarks: 50,
          credits: 2,
          isIncludedInGPA: false,
          isPractical: false,
          description: 'Excluded from SGPA/CGPA'
        },
        {
          id: 'CSDA608_EXT',
          semester: 6,
          code: 'Extension',
          name: 'Extension Activities',
          category: 'Environmental / Extension',
          maxMarks: 50,
          credits: 2,
          isIncludedInGPA: false,
          isPractical: false,
          description: 'Excluded from SGPA/CGPA'
        }
      ]
    }
  ]
};

export function calculateTotalCurriculumCredits(config: CurriculumConfig = initialCurriculum): number {
  let total = 0;
  for (const sem of config.semesters) {
    for (const sub of sem.subjects) {
      if (sub.isIncludedInGPA) {
        total += sub.credits;
      }
    }
  }
  return total;
}

export function getSemesterSubjects(
  semesterNumber: number,
  config: CurriculumConfig = initialCurriculum
): SubjectDefinition[] {
  const sem = config.semesters.find((s) => s.semester === semesterNumber);
  return sem ? sem.subjects : [];
}

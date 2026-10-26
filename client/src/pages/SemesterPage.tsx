import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { academicService } from '../services/academicService';
import { curriculumService } from '../services/curriculumService';
import {
  CurriculumConfig,
  SemesterCalculationResult,
  SubjectMarkEntry
} from '../types';
import { initialCurriculum, getSemesterSubjects } from '../data/curriculum';
import { calculateSemesterResults, validateMarks } from '../utils/calculation';
import { SubjectTable } from '../components/SubjectTable';
import { SGPAResult } from '../components/SGPAResult';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Loader2,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const SemesterPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const semParam = parseInt(searchParams.get('sem') || '1', 10);
  const activeSemester = isNaN(semParam) || semParam < 1 || semParam > 6 ? 1 : semParam;

  const [curriculum, setCurriculum] = useState<CurriculumConfig>(initialCurriculum);
  const [userMarks, setUserMarks] = useState<SubjectMarkEntry[]>([]);
  const [calculation, setCalculation] = useState<SemesterCalculationResult | null>(null);
  const [completedSemesters, setCompletedSemesters] = useState<Record<number, boolean>>({});

  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  // Debounce timer ref
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch all semesters completed status
  const fetchAllSemestersStatus = async () => {
    try {
      const allRes = await academicService.getAllAcademicRecords();
      if (allRes.success && allRes.data?.semesterResults) {
        const map: Record<number, boolean> = {};
        for (const sr of allRes.data.semesterResults) {
          map[sr.semester] = sr.isCompleted;
        }
        setCompletedSemesters(map);
      }
    } catch {
      // ignore
    }
  };

  // Load Curriculum and Current Semester Records
  const loadSemesterData = useCallback(async (semNum: number) => {
    try {
      setLoading(true);
      setErrorMessage(undefined);

      let activeCurr = curriculum;
      try {
        const currRes = await curriculumService.getCurriculum();
        if (currRes.success && currRes.curriculum) {
          activeCurr = currRes.curriculum;
          setCurriculum(currRes.curriculum);
        }
      } catch (e) {
        // Fallback to local official curriculum
      }

      // Fetch saved record for this semester
      const semRes = await academicService.getSemesterRecord(semNum);
      const subjectDefs = getSemesterSubjects(semNum, activeCurr);

      let marks: SubjectMarkEntry[] = [];
      if (semRes.success && semRes.data && semRes.data.record) {
        marks = semRes.data.record.marks || [];
      }

      setUserMarks(marks);
      const calc = calculateSemesterResults(semNum, subjectDefs, marks);
      setCalculation(calc);
      setCompletedSemesters((prev) => ({ ...prev, [semNum]: calc.isCompleted }));
      setSaveStatus('idle');
    } catch (err: any) {
      console.error('Failed to load semester', err);
      const subjectDefs = getSemesterSubjects(semNum, curriculum);
      const calc = calculateSemesterResults(semNum, subjectDefs, []);
      setCalculation(calc);
      setErrorMessage('Could not load existing marks from server. You can still enter and save.');
    } finally {
      setLoading(false);
    }
  }, [curriculum]);

  useEffect(() => {
    fetchAllSemestersStatus();
  }, []);

  useEffect(() => {
    loadSemesterData(activeSemester);
  }, [activeSemester]);

  // Persist marks to MongoDB backend
  const persistMarks = async (semNum: number, marksToSave: SubjectMarkEntry[]) => {
    try {
      setSaveStatus('saving');
      const res = await academicService.saveSemesterMarks(semNum, marksToSave);
      if (res.success) {
        setSaveStatus('saved');
        setTimeout(() => {
          setSaveStatus((current) => (current === 'saved' ? 'idle' : current));
        }, 3000);
      }
    } catch (err: any) {
      console.error('Save failed', err);
      setSaveStatus('error');
      setErrorMessage(err.response?.data?.message || 'Failed to save marks to database.');
    }
  };

  // Handle Mark Input Change
  const handleMarkChange = (subjectId: string, rawVal: string) => {
    const subjectDefs = getSemesterSubjects(activeSemester, curriculum);
    const subDef = subjectDefs.find((s) => s.id === subjectId);
    if (!subDef) return;

    const valResult = validateMarks(rawVal, subDef.maxMarks);

    // Update marks array
    const updatedMarks = [...userMarks];
    const existingIndex = updatedMarks.findIndex((m) => m.subjectId === subjectId);

    if (existingIndex >= 0) {
      updatedMarks[existingIndex] = {
        subjectId,
        marksObtained: valResult.numericValue
      };
    } else {
      updatedMarks.push({
        subjectId,
        marksObtained: valResult.numericValue
      });
    }

    setUserMarks(updatedMarks);

    // Live instant calculation
    const liveCalc = calculateSemesterResults(activeSemester, subjectDefs, updatedMarks);
    setCalculation(liveCalc);
    setCompletedSemesters((prev) => ({ ...prev, [activeSemester]: liveCalc.isCompleted }));

    // Debounced auto-save (800ms)
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      persistMarks(activeSemester, updatedMarks);
    }, 800);
  };

  const handleManualSave = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    persistMarks(activeSemester, userMarks);
  };

  // Reset Current Semester
  const handleResetSemester = async () => {
    try {
      setSaveStatus('saving');
      const res = await academicService.resetSemesterMarks(activeSemester);
      if (res.success) {
        setUserMarks([]);
        const subjectDefs = getSemesterSubjects(activeSemester, curriculum);
        const emptyCalc = calculateSemesterResults(activeSemester, subjectDefs, []);
        setCalculation(emptyCalc);
        setCompletedSemesters((prev) => ({ ...prev, [activeSemester]: false }));
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (err: any) {
      setSaveStatus('error');
      setErrorMessage('Failed to reset semester marks.');
    }
  };

  const switchSemester = (semNum: number) => {
    setSearchParams({ sem: semNum.toString() });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-csda-600 animate-spin" />
        <p className="text-slate-600 text-sm font-medium mt-3">
          Loading Semester {activeSemester} coursework...
        </p>
      </div>
    );
  }

  const currentSemDef = curriculum.semesters.find((s) => s.semester === activeSemester);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* User Requested Prominent Headline Banner */}
      <div className="bg-gradient-to-r from-csda-900 to-csda-800 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-csda-200 text-xs font-semibold mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            CSDA Academic Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Enter your marks. We'll calculate your SGPA and CGPA automatically.
          </h1>
          <p className="text-sm text-csda-200 mt-2">
            Grading Rule: <strong>Core + Allied + Skill Based</strong> subjects are included. Excluded subjects (Languages & General courses) do not affect your GPA.
          </p>
        </div>
      </div>

      {/* Clean 6-Semester Navigation [ Semester 1 ✓ ] [ Semester 2 ✓ ] ... matching Image 1 */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-2.5 sm:p-3 shadow-sm flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5, 6].map((sem) => {
            const isDone = completedSemesters[sem];
            const isActive = activeSemester === sem;
            return (
              <button
                key={sem}
                onClick={() => switchSemester(sem)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap inline-flex items-center gap-2 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <span>Semester {sem}</span>
                {isDone && (
                  <CheckCircle2
                    className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-500'}`}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center gap-2 pr-2">
          <button
            onClick={() => switchSemester(activeSemester - 1)}
            disabled={activeSemester <= 1}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none"
            title="Previous Semester"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => switchSemester(activeSemester + 1)}
            disabled={activeSemester >= 6}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none"
            title="Next Semester"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Prominent SGPA Result Card (Placed directly above table matching Image 1) */}
      {calculation && (
        <SGPAResult
          calculation={calculation}
          saveStatus={saveStatus}
          errorMessage={errorMessage}
          onReset={handleResetSemester}
          onManualSave={handleManualSave}
        />
      )}

      {/* Header Info Banner for Current Semester */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-2 font-medium text-slate-700">
          <span className="font-bold text-slate-900 text-sm">Semester {activeSemester} Coursework</span>
          <span>•</span>
          <span className="text-csda-700 font-bold">
            {currentSemDef?.totalEligibleCredits} Eligible Credits
          </span>
          <span>•</span>
          <span>{currentSemDef?.subjects.length} Total Registered Courses</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Excluded courses are completely isolated from SGPA/CGPA</span>
        </div>
      </div>

      {/* Subject Marks Table */}
      {calculation && (
        <SubjectTable
          subjects={calculation.subjects}
          onMarkChange={handleMarkChange}
          isSaving={saveStatus === 'saving'}
        />
      )}
    </div>
  );
};

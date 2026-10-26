import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OverallAcademicSummary, SemesterCalculationResult } from '../types';
import { Award, CheckCircle2 } from 'lucide-react';

interface CgpaDashboardBannerProps {
  summary: OverallAcademicSummary;
  semesters: SemesterCalculationResult[];
}

export const CgpaDashboardBanner: React.FC<CgpaDashboardBannerProps> = ({ summary, semesters }) => {
  const navigate = useNavigate();

  // Ensure we have entries for all 6 semesters
  const semMap = new Map<number, SemesterCalculationResult>();
  for (const s of semesters) {
    semMap.set(s.semester, s);
  }

  const allSix = [1, 2, 3, 4, 5, 6].map((num) => {
    return (
      semMap.get(num) || {
        semester: num,
        status: 'Not Started' as const,
        subjects: [],
        totalEligibleCredits: 0,
        completedCredits: 0,
        totalWeightedPoints: 0,
        totalMarksObtained: 0,
        totalMaxMarks: 0,
        percentage: null,
        displayPercentage: '--',
        sgpa: null,
        displaySgpa: '--',
        isCompleted: false
      }
    );
  });

  return (
    <div className="bg-[#0b1329] border border-blue-900/60 rounded-3xl p-6 sm:p-8 shadow-xl text-white">
      {/* Top Banner Bar matching Image 3 */}
      <div className="flex items-center justify-between border-b border-blue-900/40 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <Award className="w-5 h-5 text-blue-400" />
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
            CGPA DASHBOARD
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {summary.completedSemestersCount} of 6 Semesters Completed
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Section: CURRENT CGPA Card matching Image 3 */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-700/60 rounded-2xl p-6 sm:p-7 text-center flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-1.5 text-blue-300 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4 text-blue-400" />
            <span>CURRENT CGPA</span>
          </div>

          <div className="text-5xl sm:text-6xl font-black text-white font-mono my-3 tracking-tight">
            {summary.displayCgpa}
          </div>

          {/* Badges: Overall Percentage & Total Marks */}
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-950/70 text-emerald-400 border border-emerald-700/60 rounded-full text-xs font-bold shadow-xs">
              <span>%</span>
              <span>Overall: {summary.displayOverallPercentage}</span>
            </span>

            <span className="inline-flex items-center px-3 py-1 bg-blue-950/70 text-blue-300 border border-blue-700/60 rounded-full text-xs font-bold font-mono shadow-xs">
              Marks: {summary.totalMarksObtained}/{summary.totalMaxMarks}
            </span>
          </div>

          <div className="text-slate-400 text-xs font-medium mt-3.5">
            Credits Completed: <span className="text-slate-200 font-bold">{summary.completedCredits}</span>
          </div>
        </div>

        {/* Right Section: SEMESTER OVERVIEW & PERCENTAGE matching Image 3 */}
        <div className="lg:col-span-7">
          <h3 className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
            SEMESTER OVERVIEW & PERCENTAGE
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {allSix.map((sem) => {
              const isDone = sem.isCompleted;

              const marksLabel = isDone
                ? `${sem.totalMarksObtained}/${sem.totalMaxMarks}m`
                : sem.completedCredits > 0
                ? `${sem.totalMarksObtained}/${sem.totalMaxMarks}m`
                : '0/0m';

              const sgpaVal = isDone ? sem.displaySgpa : sem.sgpa ? sem.displaySgpa : '--';
              const percentVal = isDone
                ? sem.displayPercentage
                : sem.percentage !== null
                ? sem.displayPercentage
                : '--';

              return (
                <div
                  key={sem.semester}
                  onClick={() => navigate(`/semesters?sem=${sem.semester}`)}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                    isDone
                      ? 'bg-slate-900/90 border-slate-700/70 hover:border-blue-500 hover:bg-slate-800/90'
                      : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70 opacity-80'
                  }`}
                  title={`Click to view Semester ${sem.semester}`}
                >
                  {/* Top row: Sem X + Status Icon */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isDone ? 'text-slate-200' : 'text-slate-400'
                      }`}
                    >
                      Sem {sem.semester}
                    </span>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-700 flex-shrink-0" />
                    )}
                  </div>

                  {/* Middle row: Big SGPA */}
                  <div className="my-2">
                    <span
                      className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${
                        isDone ? 'text-white' : 'text-slate-500'
                      }`}
                    >
                      {sgpaVal}
                    </span>
                  </div>

                  {/* Bottom row: Percentage (left) and Marks (right) */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800/60">
                    <span className={isDone ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {percentVal}
                    </span>
                    <span className="text-slate-500">{marksLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

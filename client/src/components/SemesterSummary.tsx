import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SemesterCalculationResult } from '../types';
import { CheckCircle2, Clock } from 'lucide-react';

interface SemesterSummaryProps {
  semesters: SemesterCalculationResult[];
}

export const SemesterSummary: React.FC<SemesterSummaryProps> = ({ semesters }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Title & Description matching Image 2 */}
      <div className="px-6 sm:px-8 py-5 border-b border-slate-100">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          6-Semester Academic Summary
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Overview of completed credits, SGPA, total marks, and percentage by semester
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          {/* Table Headers matching Image 2 */}
          <thead className="bg-slate-50/70 text-slate-500 text-[11px] sm:text-xs uppercase font-bold tracking-wider border-b border-slate-200/80">
            <tr>
              <th className="px-6 py-4">Semester</th>
              <th className="px-6 py-4 text-center">Included Credits</th>
              <th className="px-6 py-4 text-center">Total Marks</th>
              <th className="px-6 py-4 text-center">Semester SGPA</th>
              <th className="px-6 py-4 text-center">Percentage</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
            {semesters.map((sem) => {
              const isDone = sem.isCompleted;

              // Display Included Credits matching Image 2: "16" vs "0 / 15"
              const displayCredits = isDone
                ? sem.completedCredits
                : `${sem.completedCredits} / ${sem.totalEligibleCredits}`;

              // Display Total Marks matching Image 2: "336 / 400" vs "0 / 0"
              const displayMarks = isDone
                ? `${sem.totalMarksObtained} / ${sem.totalMaxMarks}`
                : sem.completedCredits > 0
                ? `${sem.totalMarksObtained} / ${sem.totalMaxMarks}`
                : '0 / 0';

              // Display SGPA: bold blue text "8.40" vs "--"
              const displaySgpaVal = isDone ? sem.displaySgpa : sem.sgpa ? sem.displaySgpa : '--';

              // Display Percentage: bold green text "84.00%" vs "--"
              const displayPercentVal = isDone
                ? sem.displayPercentage
                : sem.percentage !== null
                ? sem.displayPercentage
                : '--';

              return (
                <tr
                  key={sem.semester}
                  onClick={() => navigate(`/semesters?sem=${sem.semester}`)}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  title={`Click to view or edit Semester ${sem.semester} marks`}
                >
                  {/* Semester with Number Circle matching Image 2 */}
                  <td className="px-6 py-4.5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        {sem.semester}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        Semester {sem.semester}
                      </span>
                    </div>
                  </td>

                  {/* Included Credits */}
                  <td className="px-6 py-4.5 text-center font-medium text-slate-700 whitespace-nowrap">
                    {displayCredits}
                  </td>

                  {/* Total Marks */}
                  <td className="px-6 py-4.5 text-center font-bold text-slate-800 whitespace-nowrap font-mono">
                    {displayMarks}
                  </td>

                  {/* Semester SGPA (Bold Blue Text) */}
                  <td className="px-6 py-4.5 text-center font-bold text-blue-600 text-base font-mono whitespace-nowrap">
                    {displaySgpaVal}
                  </td>

                  {/* Percentage (Bold Green Text) */}
                  <td className="px-6 py-4.5 text-center font-bold text-emerald-600 text-base font-mono whitespace-nowrap">
                    {displayPercentVal}
                  </td>

                  {/* Status Pill matching Image 2 */}
                  <td className="px-6 py-4.5 text-center whitespace-nowrap">
                    {isDone ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Incomplete</span>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

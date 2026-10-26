import React, { useState } from 'react';
import { SubjectCalculationDetail } from '../types';
import { SubjectRow } from './SubjectRow';
import { CheckCircle2, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';

interface SubjectTableProps {
  subjects: SubjectCalculationDetail[];
  onMarkChange: (subjectId: string, value: string) => void;
  isSaving?: boolean;
}

export const SubjectTable: React.FC<SubjectTableProps> = ({ subjects, onMarkChange, isSaving }) => {
  const [showExcluded, setShowExcluded] = useState(true);

  const includedSubjects = subjects.filter((s) => s.isIncludedInGPA);
  const excludedSubjects = subjects.filter((s) => !s.isIncludedInGPA);

  return (
    <div className="space-y-6">
      {/* Primary Included Subjects Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-csda-50/60 px-6 py-4 border-b border-csda-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Included Subjects (Core + Allied + Skill Based)</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              These subjects directly determine your official semester SGPA and cumulative CGPA.
            </p>
          </div>
          <span className="text-xs font-bold text-csda-800 bg-white border border-csda-200 px-3 py-1 rounded-full self-start sm:self-auto">
            {includedSubjects.length} Included Subjects
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 sm:px-6 py-3.5">Subject</th>
                <th className="px-4 sm:px-6 py-3.5 text-center">Max Marks</th>
                <th className="px-4 sm:px-6 py-3.5 text-center">Credits</th>
                <th className="px-4 sm:px-6 py-3.5 text-center">Your Mark</th>
                <th className="px-4 sm:px-6 py-3.5 text-center">Grade Point</th>
                <th className="px-4 sm:px-6 py-3.5 text-center">Weighted Point</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {includedSubjects.map((sub) => (
                <SubjectRow
                  key={sub.subjectId}
                  detail={sub}
                  onMarkChange={onMarkChange}
                  isSaving={isSaving}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Excluded Subjects Accordion / Section */}
      {excludedSubjects.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setShowExcluded(!showExcluded)}
            className="w-full bg-slate-50/90 hover:bg-slate-100/80 px-6 py-4 text-left border-b border-slate-200 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Excluded Subjects ({excludedSubjects.length}) — Language, English & General Courses
                </h4>
                <p className="text-xs text-slate-500">
                  Per official CSDA department policy, these courses are recorded for your transcript but do NOT affect SGPA or CGPA.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>{showExcluded ? 'Hide' : 'Show'}</span>
              {showExcluded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showExcluded && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm opacity-90">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 sm:px-6 py-3">Subject</th>
                    <th className="px-4 sm:px-6 py-3 text-center">Max Marks</th>
                    <th className="px-4 sm:px-6 py-3 text-center">Credits</th>
                    <th className="px-4 sm:px-6 py-3 text-center">Your Mark (Optional)</th>
                    <th className="px-4 sm:px-6 py-3 text-center">Grade Point</th>
                    <th className="px-4 sm:px-6 py-3 text-center">Weighted Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {excludedSubjects.map((sub) => (
                    <SubjectRow
                      key={sub.subjectId}
                      detail={sub}
                      onMarkChange={onMarkChange}
                      isSaving={isSaving}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

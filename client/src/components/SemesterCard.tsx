import React from 'react';
import { Link } from 'react-router-dom';
import { SemesterCalculationResult } from '../types';
import { CheckCircle2, Clock, AlertCircle, ChevronRight, Calculator } from 'lucide-react';

interface SemesterCardProps {
  result: SemesterCalculationResult;
}

export const SemesterCard: React.FC<SemesterCardProps> = ({ result }) => {
  const { semester, status, sgpa, displaySgpa, completedCredits, totalEligibleCredits, isCompleted } = result;

  const statusConfig = {
    Completed: {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
      border: 'hover:border-emerald-300'
    },
    'In Progress': {
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
      border: 'hover:border-amber-300'
    },
    'Not Started': {
      badge: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: <AlertCircle className="w-3.5 h-3.5 text-slate-400" />,
      border: 'hover:border-slate-300'
    }
  };

  const currentStatus = statusConfig[status];

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-5 transition-all ${currentStatus.border} hover:shadow-md flex flex-col justify-between`}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-csda-700 bg-csda-50 px-2.5 py-1 rounded-md">
            Semester {semester}
          </span>
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${currentStatus.badge}`}>
            {currentStatus.icon}
            <span>{status}</span>
          </span>
        </div>

        <div className="my-4">
          <p className="text-xs text-slate-500 font-medium">Semester SGPA</p>
          <div className="flex items-center gap-2.5 mt-1 flex-wrap">
            <span className={`text-3xl font-extrabold tracking-tight ${isCompleted ? 'text-slate-900' : sgpa ? 'text-csda-600' : 'text-slate-400'}`}>
              {displaySgpa}
            </span>
            {result.percentage !== null && (
              <span className="inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                <span>%</span>
                <span>{result.displayPercentage}</span>
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
          <div className="flex justify-between">
            <span className="text-slate-500">Credits Completed:</span>
            <span className="font-semibold text-slate-800">
              {completedCredits} / {totalEligibleCredits}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Marks:</span>
            <span className="font-semibold text-slate-800 font-mono">
              {result.totalMarksObtained} / {result.totalMaxMarks}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Eligible Subjects:</span>
            <span className="font-medium text-slate-700">{result.subjects.length} Subjects</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100">
        <Link
          to={`/semesters?sem=${semester}`}
          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            isCompleted
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              : 'bg-csda-600 text-white hover:bg-csda-700 shadow-sm'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>{isCompleted ? 'View / Edit Marks' : 'Enter Marks'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

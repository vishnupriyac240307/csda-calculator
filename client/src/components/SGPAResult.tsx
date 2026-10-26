import React, { useState } from 'react';
import { SemesterCalculationResult } from '../types';
import { Calculator, CheckCircle2, Clock, RotateCcw, AlertTriangle, Save, Loader2 } from 'lucide-react';

interface SGPAResultProps {
  calculation: SemesterCalculationResult;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  errorMessage?: string;
  onReset: () => void;
  onManualSave?: () => void;
}

export const SGPAResult: React.FC<SGPAResultProps> = ({
  calculation,
  saveStatus,
  errorMessage,
  onReset,
  onManualSave
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const {
    semester,
    status,
    displaySgpa,
    completedCredits,
    totalMarksObtained,
    totalMaxMarks,
    displayPercentage,
    totalWeightedPoints,
    isCompleted
  } = calculation;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: Calculator Icon + SEMESTER X SGPA + Big SGPA + Percentage Pill */}
        <div className="flex items-start sm:items-center gap-4 sm:gap-5">
          {/* Blue Calculator Icon Box matching Image 1 */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50/90 border border-blue-200/80 flex items-center justify-center flex-shrink-0 text-blue-600 shadow-sm">
            <Calculator className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.8]" />
          </div>

          <div>
            {/* Subtitle & Status Badge */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Semester {semester} SGPA
              </span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : status === 'In Progress'
                    ? 'bg-amber-50 text-amber-700 border border-amber-300'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Completed</span>
                  </>
                ) : status === 'In Progress' ? (
                  <>
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>In Progress</span>
                  </>
                ) : (
                  <span>Not Started</span>
                )}
              </span>
            </div>

            {/* Big SGPA Number + Green Percentage Pill side-by-side matching Image 1 */}
            <div className="flex items-baseline gap-3.5 mt-1.5 flex-wrap">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-mono">
                {displaySgpa}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300/80 rounded-xl text-lg sm:text-xl font-bold font-mono shadow-xs">
                <span className="text-emerald-500 font-extrabold text-base select-none">%</span>
                <span>{displayPercentage}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: 3 Metric Stat Boxes matching Image 1 */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
          {/* Box 1: CREDITS */}
          <div className="flex-1 sm:flex-none min-w-[90px] sm:min-w-[110px] bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3 sm:p-4 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Credits
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-800 font-mono block mt-0.5">
              {completedCredits}
            </span>
          </div>

          {/* Box 2: TOTAL MARKS */}
          <div className="flex-1 sm:flex-none min-w-[120px] sm:min-w-[140px] bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3 sm:p-4 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Marks
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-800 font-mono block mt-0.5">
              {totalMarksObtained}/{totalMaxMarks}
            </span>
          </div>

          {/* Box 3: WEIGHTED PTS */}
          <div className="flex-1 sm:flex-none min-w-[120px] sm:min-w-[140px] bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3 sm:p-4 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Weighted Pts
            </span>
            <span className="text-xl sm:text-2xl font-black text-blue-600 font-mono block mt-0.5">
              {totalWeightedPoints.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Subtle Save State & Reset Controls */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {saveStatus === 'saving' && (
            <span className="text-csda-700 flex items-center gap-1.5 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Saving changes to MongoDB...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-emerald-700 flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              All changes saved
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="text-red-700 flex items-center gap-1.5 font-semibold" title={errorMessage}>
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              Failed to save marks
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onManualSave && (
            <button
              type="button"
              onClick={onManualSave}
              disabled={saveStatus === 'saving'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-csda-600 hover:bg-csda-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowConfirmReset(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium transition-colors"
            title="Reset Semester Marks"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Reset Semester {semester} Marks?</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              This will clear all entered marks for Semester {semester} from the database.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmReset(false);
                  onReset();
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 shadow-sm transition-colors"
              >
                Yes, Reset Marks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

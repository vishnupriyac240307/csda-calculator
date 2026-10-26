import React from 'react';
import { SubjectCalculationDetail } from '../types';
import { AlertCircle, FlaskConical, BookOpen, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface SubjectRowProps {
  detail: SubjectCalculationDetail;
  onMarkChange: (subjectId: string, value: string) => void;
  isSaving?: boolean;
}

export const SubjectRow: React.FC<SubjectRowProps> = ({ detail, onMarkChange }) => {
  const {
    subjectId,
    code,
    name,
    category,
    maxMarks,
    credits,
    isIncludedInGPA,
    marksObtained,
    isValid,
    errorMessage,
    gradePoint,
    weightedPoint
  } = detail;

  const isLab = category.includes('Practical') || code.toLowerCase().includes('lab');

  return (
    <tr
      className={`border-b border-slate-100 transition-colors ${
        !isValid
          ? 'bg-red-50/60'
          : !isIncludedInGPA
          ? 'bg-slate-50/70 hover:bg-slate-100/60 text-slate-500'
          : marksObtained !== null
          ? 'hover:bg-csda-50/30'
          : 'hover:bg-slate-50/60'
      }`}
    >
      {/* Subject Information */}
      <td className="px-4 sm:px-6 py-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
              !isIncludedInGPA
                ? 'bg-slate-200 text-slate-500'
                : isLab
                ? 'bg-purple-100 text-purple-700'
                : 'bg-csda-100 text-csda-700'
            }`}
          >
            {isLab ? <FlaskConical className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {code}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  !isIncludedInGPA
                    ? 'bg-slate-200 text-slate-600 border border-slate-300'
                    : isLab
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}
              >
                {category}
              </span>

              {isIncludedInGPA ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Counts for SGPA
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-amber-600" />
                  Excluded from SGPA
                </span>
              )}
            </div>
            <p className={`text-sm font-semibold mt-1 ${isIncludedInGPA ? 'text-slate-900' : 'text-slate-600'}`}>
              {name}
            </p>
          </div>
        </div>
      </td>

      {/* Maximum Marks */}
      <td className="px-4 sm:px-6 py-4 text-center font-mono text-sm text-slate-600">
        <span className="font-bold">{maxMarks}</span>
      </td>

      {/* Credits */}
      <td className="px-4 sm:px-6 py-4 text-center font-mono font-medium text-sm text-slate-700">
        <span
          className={`px-2 py-1 rounded text-xs font-bold ${
            isIncludedInGPA ? 'bg-csda-50 text-csda-800 border border-csda-200' : 'bg-slate-100 text-slate-400'
          }`}
        >
          {credits} {isIncludedInGPA ? 'Cr' : 'Cr (Audit)'}
        </span>
      </td>

      {/* Marks Obtained Input */}
      <td className="px-4 sm:px-6 py-4 text-center">
        <div className="inline-block relative">
          <input
            type="number"
            min={0}
            max={maxMarks}
            step="any"
            placeholder="Enter marks"
            value={marksObtained !== null ? marksObtained : ''}
            onChange={(e) => onMarkChange(subjectId, e.target.value)}
            className={`w-28 text-center font-mono font-bold text-sm py-1.5 px-2 rounded-lg border focus:outline-none transition-all shadow-sm ${
              !isValid
                ? 'border-red-500 bg-red-50 text-red-900 focus:ring-2 focus:ring-red-200'
                : marksObtained !== null
                ? isIncludedInGPA
                  ? 'border-csda-500 bg-csda-50/40 text-csda-950 ring-1 ring-csda-200'
                  : 'border-slate-300 bg-slate-50 text-slate-700'
                : 'border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 placeholder:font-normal placeholder:text-xs focus:border-csda-500 focus:ring-2 focus:ring-csda-100'
            }`}
          />
          {errorMessage ? (
            <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-red-600 mt-1 max-w-[140px] text-center">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          ) : marksObtained === null ? (
            <span className="block text-[10px] text-slate-400 mt-1 italic">
              {isIncludedInGPA ? 'Enter marks' : 'Optional record'}
            </span>
          ) : null}
        </div>
      </td>

      {/* Grade Point */}
      <td className="px-4 sm:px-6 py-4 text-center font-mono font-semibold text-sm">
        {gradePoint !== null ? (
          <span
            className={`px-2.5 py-1 rounded-md text-xs font-bold ${
              isIncludedInGPA ? 'text-csda-700 bg-csda-50' : 'text-slate-500 bg-slate-100'
            }`}
          >
            {gradePoint.toFixed(2)}
          </span>
        ) : (
          <span className="text-slate-300">—</span>
        )}
      </td>

      {/* Weighted Point */}
      <td className="px-4 sm:px-6 py-4 text-center font-mono font-bold text-sm">
        {weightedPoint !== null ? (
          <span
            className={`px-2.5 py-1 rounded-md text-xs font-bold ${
              isIncludedInGPA ? 'text-slate-900 bg-slate-100' : 'text-slate-400 bg-slate-100 line-through'
            }`}
            title={!isIncludedInGPA ? 'Not added to SGPA/CGPA (Excluded subject)' : undefined}
          >
            {weightedPoint.toFixed(2)}
          </span>
        ) : (
          <span className="text-slate-300">—</span>
        )}
      </td>
    </tr>
  );
};

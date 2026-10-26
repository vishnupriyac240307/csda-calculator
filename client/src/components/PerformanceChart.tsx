import React from 'react';
import { SemesterCalculationResult } from '../types';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface PerformanceChartProps {
  semesters: SemesterCalculationResult[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ semesters }) => {
  const hasAnyData = semesters.some((s) => s.completedCredits > 0 || s.sgpa !== null);

  if (!hasAnyData) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <TrendingUp className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">Academic Progression Chart</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          Enter marks for your semester courses to visualize your semester-wise SGPA trajectory.
        </p>
      </div>
    );
  }

  // Calculate highest SGPA or fallback to 10 for bar scale
  const maxScale = 10;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-csda-600" />
            <span>Semester-wise SGPA Performance</span>
          </h3>
          <p className="text-xs text-slate-500">Official 10-point scale academic progression</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-csda-600 inline-block"></span>
            <span className="text-slate-600">Completed Semester</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-400 inline-block"></span>
            <span className="text-slate-600">In Progress / Prov.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-200 inline-block"></span>
            <span className="text-slate-400">Not Started</span>
          </div>
        </div>
      </div>

      <div className="pt-8 pb-4">
        {/* Chart Bars */}
        <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-56 border-b border-slate-200 px-2 sm:px-4">
          {semesters.map((sem) => {
            const sgpaValue = sem.sgpa ?? 0;
            const heightPercent = Math.min(100, (sgpaValue / maxScale) * 100);

            let barBg = 'bg-slate-200';
            if (sem.isCompleted) {
              barBg = 'bg-gradient-to-t from-csda-700 to-csda-500 shadow-sm';
            } else if (sem.sgpa !== null) {
              barBg = 'bg-gradient-to-t from-amber-500 to-amber-300';
            }

            return (
              <div key={sem.semester} className="flex flex-col items-center h-full justify-end group">
                {/* Floating SGPA label */}
                <div className="mb-2 text-center opacity-90 group-hover:opacity-100 transition-opacity">
                  <span
                    className={`text-xs font-bold ${
                      sem.isCompleted
                        ? 'text-csda-700'
                        : sem.sgpa !== null
                        ? 'text-amber-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {sem.sgpa !== null ? sem.sgpa.toFixed(2) : '—'}
                  </span>
                  {sem.status === 'In Progress' && (
                    <span className="block text-[10px] text-amber-600 font-medium">Prov.</span>
                  )}
                </div>

                {/* The Bar */}
                <div className="w-full max-w-[48px] bg-slate-100 rounded-t-lg h-full flex items-end overflow-hidden">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-700 ${barBg}`}
                    style={{ height: sem.sgpa !== null ? `${Math.max(12, heightPercent)}%` : '4%' }}
                  />
                </div>

                {/* X-axis Label */}
                <div className="mt-3 text-center">
                  <span className="block text-xs font-bold text-slate-700">Sem {sem.semester}</span>
                  <span className="block text-[10px] text-slate-400">
                    {sem.completedCredits}/{sem.totalEligibleCredits} Cr
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
        <span className="flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-csda-600" />
          Provisional SGPA indicates semesters where some eligible course marks are still pending.
        </span>
        <span className="font-semibold text-slate-700 hidden sm:inline">Scale: 0.00 – 10.00</span>
      </div>
    </div>
  );
};

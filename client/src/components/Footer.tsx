import React from 'react';
import { GraduationCap, ShieldCheck, Database, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-auto no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-csda-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">CSDA Calculator</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Official academic performance portal exclusively designed for students of B.Sc. Computer Science with Data Analytics. Computes credit-weighted SGPA and CGPA with persistent, isolated record storage.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Academic System</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-csda-400" />
                <span>6 Semester Curriculum</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-csda-400" />
                <span>Isolated Student DB</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-csda-400" />
                <span>Credit-Weighted Formula</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Department</h4>
            <p className="text-sm text-slate-400">B.Sc. Computer Science with Data Analytics</p>
            <p className="text-xs text-slate-500 mt-1">Configurable Syllabus Framework v1.0</p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} CSDA SGPA & CGPA Calculator. All rights reserved.</p>
          <p className="text-slate-400">
            Formula: Grade Point = (Marks / Max) × 10 | CGPA = Σ(Weighted Points) / Σ(Credits)
          </p>
        </div>
      </div>
    </footer>
  );
};

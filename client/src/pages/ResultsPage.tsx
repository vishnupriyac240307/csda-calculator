import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { academicService } from '../services/academicService';
import { OverallAcademicSummary, SemesterCalculationResult } from '../types';
import {
  Printer,
  RotateCcw,
  GraduationCap,
  AlertTriangle,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<OverallAcademicSummary | null>(null);
  const [semesterResults, setSemesterResults] = useState<SemesterCalculationResult[]>([]);
  const [showResetAllModal, setShowResetAllModal] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await academicService.getAllAcademicRecords();
      if (res.success && res.data) {
        setSummary(res.data.overallSummary);
        setSemesterResults(res.data.semesterResults);
      }
    } catch (err) {
      console.error('Failed to load results', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handlePrint = () => {
    // Inject A4 Portrait styles with tight print margins and multi-page support
    const style = document.createElement('style');
    style.id = 'results-print-portrait-style';
    style.innerHTML = `
      @page {
        size: A4 portrait !important;
        margin: 0.8cm !important;
      }
      @media print {
        body {
          font-size: 9.5pt !important;
        }
        .print-container {
          padding: 0 !important;
          border: none !important;
          box-shadow: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    window.print();

    setTimeout(() => {
      const el = document.getElementById('results-print-portrait-style');
      if (el) el.remove();
    }, 1000);
  };

  const handleResetAll = async () => {
    try {
      setLoading(true);
      const res = await academicService.resetAllAcademicMarks();
      if (res.success) {
        setResetMessage(res.message);
        setShowResetAllModal(false);
        await fetchResults();
      }
    } catch (err: any) {
      alert('Failed to reset all academic marks');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-csda-600 animate-spin" />
        <p className="text-slate-600 text-sm font-medium mt-3">Compiling academic transcript...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Controls Bar (hidden during printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic Performance Transcript
          </h1>
          <p className="text-xs text-slate-500">
            Comprehensive semester-wise report and cumulative CGPA
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-csda-600 hover:bg-csda-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>

          <button
            onClick={() => setShowResetAllModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Marks</span>
          </button>
        </div>
      </div>

      {resetMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{resetMessage}</span>
        </div>
      )}

      {/* Official Academic Transcript Document Card (Formatted for Screen & Multi-Page A4 Print) */}
      <div className="print-container bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-7 print:p-0 print:border-none print:shadow-none print:space-y-5">
        {/* Document Official Header */}
        <div className="border-b-2 border-slate-900 pb-5 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-800">
              <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                Academic Grade Transcript
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-csda-800">
                Department of B.Sc. Computer Science with Data Analytics (CSDA)
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Official Credit-Weighted Semester Performance Record
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500 font-mono">
            <p>Generated: {new Date().toLocaleDateString()}</p>
            <p>Status: {summary?.isFinalCGPA ? 'Final Degree' : 'Provisional Record'}</p>
          </div>
        </div>

        {/* Student Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs print:bg-slate-50/80">
          <div>
            <span className="text-slate-500 block uppercase font-bold text-[10px]">Student Name</span>
            <span className="text-sm font-bold text-slate-900">{user?.fullName}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-bold text-[10px]">Roll Number</span>
            <span className="text-sm font-bold text-slate-900 font-mono">{user?.rollNumber}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-bold text-[10px]">Username</span>
            <span className="text-sm font-medium text-slate-800 font-mono">@{user?.username}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-bold text-[10px]">Email Address</span>
            <span className="text-sm font-medium text-slate-800 block print:whitespace-normal">
              {user?.email}
            </span>
          </div>
        </div>

        {/* Cumulative CGPA Summary Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-xl bg-csda-50/70 border border-csda-200 text-slate-900 print:bg-slate-50 print:border-slate-300">
          <div>
            <span className="text-xs font-bold uppercase text-csda-700">Cumulative CGPA</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold font-mono text-csda-900">
                {summary?.displayCgpa}
              </span>
              <span className="text-xs text-slate-500">/ 10.00</span>
            </div>
            <span className="text-[11px] font-semibold text-csda-700 block mt-0.5">
              {summary?.cgpaType}
            </span>
          </div>

          <div>
            <span className="text-xs font-bold uppercase text-slate-500">Overall Percentage</span>
            <div className="mt-1 text-2xl font-bold font-mono text-emerald-700">
              {summary?.displayOverallPercentage}
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Total Marks: {summary?.totalMarksObtained} / {summary?.totalMaxMarks}
            </span>
          </div>

          <div>
            <span className="text-xs font-bold uppercase text-slate-500">Completed Credits</span>
            <div className="mt-1 text-2xl font-bold font-mono text-slate-800">
              {summary?.completedCredits} / {summary?.totalEligibleCredits}
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Progress: {summary?.overallProgressPercentage}%
            </span>
          </div>

          <div>
            <span className="text-xs font-bold uppercase text-slate-500">Completed Semesters</span>
            <div className="mt-1 text-2xl font-bold font-mono text-slate-800">
              {summary?.completedSemestersCount} / 6
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Total Weighted: {summary?.totalWeightedPoints.toFixed(2)} pts
            </span>
          </div>
        </div>

        {/* Semester-by-Semester Breakdown (Multi-page clean print layout) */}
        <div className="space-y-6 print:space-y-5">
          {semesterResults.map((sem) => (
            <div
              key={sem.semester}
              className="print-semester-block border border-slate-200 rounded-xl overflow-hidden print:overflow-visible print:border-slate-300 shadow-2xs"
            >
              {/* Semester Header */}
              <div className="bg-slate-100/90 px-4 py-2.5 flex justify-between items-center border-b border-slate-200 print:bg-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 text-sm">
                    Semester {sem.semester}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      sem.isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : sem.status === 'In Progress'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-200 text-slate-600 border-slate-300'
                    }`}
                  >
                    {sem.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono flex-wrap">
                  <span>Marks: {sem.totalMarksObtained}/{sem.totalMaxMarks}</span>
                  <span className="font-bold text-emerald-700">
                    %: {sem.displayPercentage}
                  </span>
                  <span>Credits: {sem.completedCredits}/{sem.totalEligibleCredits}</span>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    SGPA: {sem.displaySgpa}
                  </span>
                </div>
              </div>

              {/* Subject Table (Exact percentage columns to prevent horizontal clipping) */}
              <div className="overflow-x-auto print:overflow-visible">
                <table className="w-full text-left text-xs table-fixed">
                  <colgroup>
                    <col className="w-[12%]" />
                    <col className="w-[33%]" />
                    <col className="w-[17%]" />
                    <col className="w-[7%]" />
                    <col className="w-[7%]" />
                    <col className="w-[8%]" />
                    <col className="w-[8%]" />
                    <col className="w-[8%]" />
                  </colgroup>
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 print:bg-slate-50">
                    <tr>
                      <th className="px-2.5 py-2">Code</th>
                      <th className="px-2.5 py-2">Subject Title</th>
                      <th className="px-2 py-2 text-center">Category</th>
                      <th className="px-1.5 py-2 text-center">Max</th>
                      <th className="px-1.5 py-2 text-center">Credits</th>
                      <th className="px-1.5 py-2 text-center">Marks</th>
                      <th className="px-1.5 py-2 text-center">Grade Pt</th>
                      <th className="px-1.5 py-2 text-center">Wtd Pt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px] print:text-[10px]">
                    {sem.subjects.map((sub) => (
                      <tr key={sub.subjectId} className="hover:bg-slate-50/50">
                        <td className="px-2.5 py-2 font-bold text-slate-800">{sub.code}</td>
                        <td className="px-2.5 py-2 font-sans font-medium text-slate-900 leading-tight">
                          {sub.name}
                        </td>
                        <td className="px-2 py-2 text-center font-sans text-[10px] text-slate-500">
                          {sub.category}
                        </td>
                        <td className="px-1.5 py-2 text-center text-slate-600">{sub.maxMarks}</td>
                        <td className="px-1.5 py-2 text-center font-bold text-slate-800">{sub.credits}</td>
                        <td className="px-1.5 py-2 text-center font-bold text-slate-900">
                          {sub.marksObtained !== null ? sub.marksObtained : '—'}
                        </td>
                        <td className="px-1.5 py-2 text-center text-csda-700 font-bold">
                          {sub.gradePoint !== null ? sub.gradePoint.toFixed(2) : '—'}
                        </td>
                        <td className="px-1.5 py-2 text-center text-slate-900 font-bold">
                          {sub.weightedPoint !== null ? sub.weightedPoint.toFixed(2) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Calculation Formula Footer Note */}
        <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-1 print:text-[10px]">
          <p className="font-semibold text-slate-700">Official Evaluation Criteria:</p>
          <p>• Grade Point = (Marks Obtained / Maximum Marks) × 10</p>
          <p>• Weighted Point = Grade Point × Subject Credits</p>
          <p>• SGPA / CGPA = Σ(Eligible Weighted Points) / Σ(Eligible Credits)</p>
          <p className="text-[10px] text-slate-400 mt-2">
            This document is generated by the CSDA Academic Calculator portal.
          </p>
        </div>
      </div>

      {/* Confirmation Dialog for Reset All */}
      {showResetAllModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Reset All Academic Marks?</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              This will permanently remove all entered marks across all semesters from your student account.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetAllModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetAll}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 shadow-sm transition-colors"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

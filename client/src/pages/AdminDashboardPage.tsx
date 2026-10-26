import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../services/adminService';
import { StudentAdminData, AdminStats } from '../types';
import {
  Users,
  Award,
  TrendingUp,
  FileSpreadsheet,
  Printer,
  Search,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  MinusCircle,
  Loader2,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';

type SortOption = 'gpa-desc' | 'gpa-asc' | 'alpha-asc' | 'roll-asc';

export const AdminDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentAdminData[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('gpa-desc');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminService.getStudentsPerformance();
        if (data.success) {
          setStudents(data.students);
          setStats(data.stats);
        }
      } catch (err: any) {
        console.error('Failed to load admin data', err);
        setError(err.response?.data?.message || 'Failed to load administrator portal data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // Filtered and Sorted list
  const processedStudents = useMemo(() => {
    let result = [...students];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.fullName.toLowerCase().includes(term) ||
          s.rollNumber.toLowerCase().includes(term) ||
          s.email.toLowerCase().includes(term) ||
          s.username.toLowerCase().includes(term)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOption === 'gpa-desc') {
        const aVal = a.cgpa ?? -1;
        const bVal = b.cgpa ?? -1;
        if (bVal !== aVal) return bVal - aVal;
        return a.rollNumber.localeCompare(b.rollNumber);
      }
      if (sortOption === 'gpa-asc') {
        const aVal = a.cgpa ?? 999;
        const bVal = b.cgpa ?? 999;
        if (aVal !== bVal) return aVal - bVal;
        return a.rollNumber.localeCompare(b.rollNumber);
      }
      if (sortOption === 'alpha-asc') {
        return a.fullName.localeCompare(b.fullName);
      }
      if (sortOption === 'roll-asc') {
        return a.rollNumber.localeCompare(b.rollNumber);
      }
      return 0;
    });

    return result;
  }, [students, searchTerm, sortOption]);

  // Export to Excel (CSV with UTF-8 BOM for Microsoft Excel compatibility)
  const handleExportExcel = () => {
    if (processedStudents.length === 0) return;

    const headers = [
      'Rank',
      'Roll Number',
      'Student Name',
      'Email Address',
      'Username',
      'Sem 1 SGPA',
      'Sem 1 %',
      'Sem 2 SGPA',
      'Sem 2 %',
      'Sem 3 SGPA',
      'Sem 3 %',
      'Sem 4 SGPA',
      'Sem 4 %',
      'Sem 5 SGPA',
      'Sem 5 %',
      'Sem 6 SGPA',
      'Sem 6 %',
      'Cumulative CGPA',
      'Overall %',
      'Total Marks Obtained',
      'Total Max Marks',
      'Completed Credits',
      'Total Eligible Credits',
      'Completion Status'
    ];

    const rows = processedStudents.map((s, idx) => {
      return [
        idx + 1,
        `"${s.rollNumber}"`,
        `"${s.fullName}"`,
        `"${s.email}"`,
        `"${s.username}"`,
        s.semesters[1]?.sgpa !== null ? s.semesters[1]?.sgpa?.toFixed(2) : 'N/A',
        s.semesters[1]?.displayPercentage || 'N/A',
        s.semesters[2]?.sgpa !== null ? s.semesters[2]?.sgpa?.toFixed(2) : 'N/A',
        s.semesters[2]?.displayPercentage || 'N/A',
        s.semesters[3]?.sgpa !== null ? s.semesters[3]?.sgpa?.toFixed(2) : 'N/A',
        s.semesters[3]?.displayPercentage || 'N/A',
        s.semesters[4]?.sgpa !== null ? s.semesters[4]?.sgpa?.toFixed(2) : 'N/A',
        s.semesters[4]?.displayPercentage || 'N/A',
        s.semesters[5]?.sgpa !== null ? s.semesters[5]?.sgpa?.toFixed(2) : 'N/A',
        s.semesters[5]?.displayPercentage || 'N/A',
        s.semesters[6]?.sgpa !== null ? s.semesters[6]?.sgpa?.toFixed(2) : 'N/A',
        s.semesters[6]?.displayPercentage || 'N/A',
        s.cgpa !== null ? s.cgpa.toFixed(2) : 'N/A',
        s.displayOverallPercentage || 'N/A',
        s.totalMarksObtained ?? 0,
        s.totalMaxMarks ?? 0,
        s.completedCredits,
        s.totalEligibleCredits,
        `"${s.status}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CSDA_Student_Academic_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export as PDF / Print in Full A4 Landscape
  const handlePrintPDF = () => {
    const style = document.createElement('style');
    style.id = 'admin-print-landscape-style';
    style.innerHTML = `
      @page {
        size: A4 landscape !important;
        margin: 0.6cm !important;
      }
      @media print {
        body {
          font-size: 8pt !important;
        }
        .admin-table-container {
          overflow: visible !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        .admin-print-table {
          width: 100% !important;
          table-layout: fixed !important;
        }
        .admin-print-table th,
        .admin-print-table td {
          padding: 4px 3px !important;
          font-size: 7.5pt !important;
        }
      }
    `;
    document.head.appendChild(style);

    window.print();

    setTimeout(() => {
      const el = document.getElementById('admin-print-landscape-style');
      if (el) el.remove();
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-csda-600 animate-spin" />
        <p className="text-slate-600 text-sm font-medium mt-3">
          Loading CSDA Department Academic Records...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-center space-y-2">
          <ShieldAlert className="w-8 h-8 text-red-600 mx-auto" />
          <h2 className="text-lg font-bold">Access Restricted</h2>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner (Hidden in Print) */}
      <div className="bg-gradient-to-r from-csda-950 via-csda-900 to-navy-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl no-print relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-csda-200 text-xs font-semibold mb-3 border border-white/10">
              <GraduationCap className="w-4 h-4 text-csda-300" />
              <span>Department Administrator Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              CSDA Student Academic Performance & Rankings
            </h1>
            <p className="text-xs sm:text-sm text-csda-200 mt-1">
              B.Sc. Computer Science with Data Analytics — Comprehensive Semester-wise SGPA & CGPA Ledger
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export to Excel (CSV)</span>
            </button>

            <button
              onClick={handlePrintPDF}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-csda-600 hover:bg-csda-500 text-white text-xs font-bold shadow-md transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Decorative Grid */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(#38a5f6_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-15 pointer-events-none" />
      </div>

      {/* Official Print Header (Only visible when printing A4) */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6 text-center">
        <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">
          Department of B.Sc. Computer Science with Data Analytics (CSDA)
        </h1>
        <p className="text-xs font-bold text-slate-700 mt-0.5">
          Official Student Performance, Semester-wise SGPA & CGPA Ranking Ledger
        </p>
        <p className="text-[10px] text-slate-500 mt-1 font-mono">
          Report Generated: {new Date().toLocaleDateString()} | Total Students: {students.length} | Rule: Core + Allied + Skill Based
        </p>
      </div>

      {/* Department Statistics Cards (Hidden in Print) */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 no-print">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Registered Students
              </span>
              <Users className="w-5 h-5 text-csda-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {stats.totalStudents}
              </span>
              <span className="text-xs text-slate-400">Students</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">CSDA Department Database</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Department Average CGPA
              </span>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {stats.departmentAverageCGPA !== null ? stats.departmentAverageCGPA.toFixed(2) : 'N/A'}
              </span>
              <span className="text-xs text-slate-400">/ 10.00</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Across {stats.studentsWithCgpaCount} students with active marks
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Highest Cumulative CGPA
              </span>
              <Award className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-700 font-mono">
                {stats.highestCGPA !== null ? stats.highestCGPA.toFixed(2) : 'N/A'}
              </span>
              <span className="text-xs text-slate-400">/ 10.00</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Top Academic Performer</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Completed All 6 Semesters
              </span>
              <CheckCircle2 className="w-5 h-5 text-csda-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {stats.completedDegreeCount}
              </span>
              <span className="text-xs text-slate-400">Graduates</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Degree Completion Status</p>
          </div>
        </div>
      )}

      {/* Filter and Sorting Controls (Hidden in Print) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 no-print">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by student name, roll number, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-csda-500 focus:border-csda-500"
          />
        </div>

        {/* Sorting Dropdown & Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Arrange Rank:</span>
          </span>

          <button
            onClick={() => setSortOption('gpa-desc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              sortOption === 'gpa-desc'
                ? 'bg-csda-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Highest to Lowest GPA
          </button>

          <button
            onClick={() => setSortOption('gpa-asc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              sortOption === 'gpa-asc'
                ? 'bg-csda-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Lowest to Highest GPA
          </button>

          <button
            onClick={() => setSortOption('alpha-asc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              sortOption === 'alpha-asc'
                ? 'bg-csda-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Alphabetical (A - Z)
          </button>

          <button
            onClick={() => setSortOption('roll-asc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              sortOption === 'roll-asc'
                ? 'bg-csda-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Roll Number Wise
          </button>
        </div>
      </div>

      {/* Main Students Table */}
      <div className="admin-table-container bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:overflow-visible print:border-none print:shadow-none">
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full text-left text-xs sm:text-sm admin-print-table print:table-fixed">
            <colgroup className="hidden print:table-column-group">
              <col className="w-[4%]" />
              <col className="w-[9%]" />
              <col className="w-[20%]" />
              <col className="w-[7%]" />
              <col className="w-[7%]" />
              <col className="w-[7%]" />
              <col className="w-[7%]" />
              <col className="w-[7%]" />
              <col className="w-[7%]" />
              <col className="w-[9%]" />
              <col className="w-[8%]" />
              <col className="w-[8%]" />
            </colgroup>
            <thead className="bg-slate-50 text-slate-700 text-[11px] sm:text-xs uppercase font-extrabold tracking-wider border-b border-slate-200 print:bg-slate-100">
              <tr>
                <th className="px-3 sm:px-4 py-3 sm:py-3.5 text-center">Rank</th>
                <th className="px-3 sm:px-4 py-3 sm:py-3.5">Roll No</th>
                <th className="px-3 sm:px-4 py-3 sm:py-3.5">Student Name</th>
                <th className="px-2 sm:px-4 py-3 sm:py-3.5 text-center">Sem 1</th>
                <th className="px-2 sm:px-4 py-3 sm:py-3.5 text-center">Sem 2</th>
                <th className="px-2 sm:px-4 py-3 sm:py-3.5 text-center">Sem 3</th>
                <th className="px-2 sm:px-4 py-3 sm:py-3.5 text-center">Sem 4</th>
                <th className="px-2 sm:px-4 py-3 sm:py-3.5 text-center">Sem 5</th>
                <th className="px-2 sm:px-4 py-3 sm:py-3.5 text-center">Sem 6</th>
                <th className="px-2 sm:px-4 py-3 sm:py-3.5 text-center">CGPA</th>
                <th className="px-2 sm:px-4 py-3 sm:py-3.5 text-center">Credits</th>
                <th className="px-2 sm:px-4 py-3 sm:py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {processedStudents.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-6 py-8 text-center text-slate-400 font-sans">
                    No student records found matching your search.
                  </td>
                </tr>
              ) : (
                processedStudents.map((student, idx) => {
                  const rankNumber = idx + 1;
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Rank */}
                      <td className="px-4 py-3 text-center font-bold font-mono">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                            rankNumber === 1
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 font-black'
                              : rankNumber === 2
                              ? 'bg-slate-200 text-slate-800 font-black'
                              : rankNumber === 3
                              ? 'bg-amber-50 text-amber-700 font-bold'
                              : 'text-slate-500'
                          }`}
                        >
                          {rankNumber}
                        </span>
                      </td>

                      {/* Roll Number */}
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {student.rollNumber}
                      </td>

                      {/* Student Name & Email */}
                      <td className="px-3 sm:px-4 py-3 font-sans">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">
                          {student.fullName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono truncate max-w-[180px] print:max-w-none print:whitespace-normal print:break-all">
                          {student.email}
                        </div>
                      </td>

                      {/* Sem 1 - 6 SGPAs & Percentages */}
                      {[1, 2, 3, 4, 5, 6].map((sem) => {
                        const semData = student.semesters[sem];
                        const hasSgpa = semData && semData.sgpa !== null;
                        return (
                          <td key={sem} className="px-2 py-3 text-center">
                            {hasSgpa ? (
                              <div className="flex flex-col items-center gap-0.5">
                                <span
                                  className={`px-1.5 py-0.5 rounded font-bold ${
                                    semData.status === 'Completed'
                                      ? 'bg-slate-100 text-slate-800'
                                      : 'bg-amber-50 text-amber-700 text-[10px]'
                                  }`}
                                >
                                  {semData.sgpa?.toFixed(2)}
                                </span>
                                {semData.percentage !== null && (
                                  <span className="text-[10px] text-emerald-600 font-bold font-mono">
                                    {semData.displayPercentage}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Cumulative CGPA & Overall Percentage */}
                      <td className="px-4 py-3 text-center">
                        {student.cgpa !== null ? (
                          <div className="flex flex-col items-center gap-0.5">
                            <span
                              className={`px-2.5 py-1 rounded-md font-bold text-xs ${
                                student.cgpa >= 8.5
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-black'
                                  : student.cgpa >= 7.0
                                  ? 'bg-csda-50 text-csda-900 border border-csda-200'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {student.cgpa.toFixed(2)}
                            </span>
                            {student.overallPercentage !== null && (
                              <span className="text-[10px] text-emerald-700 font-bold font-mono">
                                {student.displayOverallPercentage}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Completed Credits */}
                      <td className="px-4 py-3 text-center text-slate-600">
                        {student.completedCredits} / {student.totalEligibleCredits}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center font-sans">
                        {student.status === 'Completed' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Completed
                          </span>
                        )}
                        {student.status === 'In Progress' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            In Progress
                          </span>
                        )}
                        {student.status === 'Not Started' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                            <MinusCircle className="w-3 h-3 text-slate-400" />
                            Not Started
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Footnote Note for PDF/Print */}
      <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p>Formula: SGPA/CGPA = Σ(Eligible Weighted Points) / Σ(Eligible Credits)</p>
        <p className="font-semibold text-slate-700">Official CSDA Department Portal</p>
      </div>
    </div>
  );
};

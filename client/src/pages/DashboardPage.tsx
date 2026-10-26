import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { academicService } from '../services/academicService';
import { OverallAcademicSummary, SemesterCalculationResult } from '../types';
import { initialCurriculum } from '../data/curriculum';
import { calculateTotalCurriculumCredits } from '../data/curriculum';
import { calculateOverallSummary, calculateSemesterResults } from '../utils/calculation';
import { DashboardCard } from '../components/DashboardCard';
import { SemesterCard } from '../components/SemesterCard';
import { PerformanceChart } from '../components/PerformanceChart';
import { SemesterSummary } from '../components/SemesterSummary';
import { CgpaDashboardBanner } from '../components/CgpaDashboardBanner';
import {
  Award,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Settings,
  Calculator,
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<OverallAcademicSummary | null>(null);
  const [semesterResults, setSemesterResults] = useState<SemesterCalculationResult[]>([]);

  useEffect(() => {
    const fetchAcademicData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await academicService.getAllAcademicRecords();
        if (res.success && res.data) {
          setSummary(res.data.overallSummary);
          setSemesterResults(res.data.semesterResults);
        }
      } catch (err: any) {
        console.error('Failed to load academic records', err);
        // Fallback to local default calculation if network glitch
        const totalCredits = calculateTotalCurriculumCredits(initialCurriculum);
        const defaultSemResults = [1, 2, 3, 4, 5, 6].map((sem) =>
          calculateSemesterResults(
            sem,
            initialCurriculum.semesters.find((s) => s.semester === sem)?.subjects || [],
            []
          )
        );
        const defaultSummary = calculateOverallSummary(defaultSemResults, totalCredits);
        setSummary(defaultSummary);
        setSemesterResults(defaultSemResults);
        setError('Could not connect to database. Displaying offline framework.');
      } finally {
        setLoading(false);
      }
    };

    fetchAcademicData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-csda-600 animate-spin" />
        <p className="text-slate-600 text-sm font-medium mt-3">Loading academic records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Student Profile Header */}
      <div className="bg-gradient-to-r from-csda-900 via-csda-800 to-navy-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold text-csda-200 border border-white/10">
              <span>B.Sc. Computer Science with Data Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.fullName}!
            </h1>
            <div className="flex items-center gap-4 text-xs sm:text-sm text-csda-200">
              <span className="font-mono bg-white/10 px-2 py-0.5 rounded">
                Roll No: {user?.rollNumber}
              </span>
              <span>•</span>
              <span className="font-mono">@{user?.username}</span>
            </div>
          </div>

          {/* Header Quick Shortcuts */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to="/settings"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/15 transition-colors"
            >
              <Settings className="w-4 h-4 text-csda-300" />
              <span>Settings & Profile</span>
            </Link>

            <Link
              to="/semesters?sem=1"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-csda-500 hover:bg-csda-400 text-white text-xs font-semibold shadow-md transition-colors"
            >
              <Calculator className="w-4 h-4" />
              <span>Enter Marks</span>
            </Link>
          </div>
        </div>

        {/* Background decorative pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(#38a5f6_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Official CGPA Dashboard Banner matching Image 3 */}
      {summary && (
        <CgpaDashboardBanner summary={summary} semesters={semesterResults} />
      )}

      {/* Academic Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardCard
          title="Cumulative CGPA"
          value={summary?.displayCgpa || 'N/A'}
          subtitle={summary?.explanation}
          icon={<Award className="w-6 h-6 text-csda-600" />}
          badge={
            summary?.cgpa !== null
              ? {
                  text: summary?.isFinalCGPA ? 'Final CGPA' : 'Current CGPA',
                  variant: summary?.isFinalCGPA ? 'success' : 'info'
                }
              : undefined
          }
        />

        <DashboardCard
          title="Completed Semesters"
          value={`${summary?.completedSemestersCount || 0} / 6`}
          subtitle="All eligible subjects completed"
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
          badge={{
            text:
              summary?.completedSemestersCount === 6
                ? 'All Complete'
                : `${6 - (summary?.completedSemestersCount || 0)} Pending`,
            variant: summary?.completedSemestersCount === 6 ? 'success' : 'neutral'
          }}
        />

        <DashboardCard
          title="Earned Credits"
          value={`${summary?.completedCredits || 0} / ${summary?.totalEligibleCredits || 120}`}
          subtitle="Credit-weighted completion"
          icon={<BookOpen className="w-6 h-6 text-csda-600" />}
          progress={summary?.overallProgressPercentage}
        />

        <DashboardCard
          title="Weighted Points"
          value={summary?.totalWeightedPoints?.toFixed(2) || '0.00'}
          subtitle="Σ (Grade Point × Credits)"
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
        />
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        <Link
          to="/semesters"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-csda-300 hover:text-csda-700 text-xs font-semibold shadow-sm transition-all whitespace-nowrap"
        >
          <Calculator className="w-4 h-4 text-csda-600" />
          <span>Enter Semester Marks</span>
        </Link>

        <Link
          to="/results"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-csda-300 hover:text-csda-700 text-xs font-semibold shadow-sm transition-all whitespace-nowrap"
        >
          <FileText className="w-4 h-4 text-csda-600" />
          <span>View / Print Results</span>
        </Link>

        <Link
          to="/settings"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-csda-300 hover:text-csda-700 text-xs font-semibold shadow-sm transition-all whitespace-nowrap"
        >
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Account Settings</span>
        </Link>
      </div>

      {/* Performance Chart */}
      <PerformanceChart semesters={semesterResults} />

      {/* 6 Semester Cards Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Semester Performance Cards</h2>
            <p className="text-xs text-slate-500">Access individual semester coursework and marks</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {semesterResults.map((sem) => (
            <SemesterCard key={sem.semester} result={sem} />
          ))}
        </div>
      </div>

      {/* Semester Summary Table */}
      <SemesterSummary semesters={semesterResults} />
    </div>
  );
};

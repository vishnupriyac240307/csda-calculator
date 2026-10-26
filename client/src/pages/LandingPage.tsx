import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Calculator,
  Award,
  Database,
  Printer,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-csda-100 selection:text-csda-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-csda-50/40 to-slate-50 border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(#38a5f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Department Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-csda-50 border border-csda-200 text-csda-800 text-xs font-semibold mb-6 shadow-sm">
            <GraduationCap className="w-4 h-4 text-csda-600" />
            <span>Exclusively for B.Sc. Computer Science with Data Analytics (CSDA)</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Accurate, Credit-Weighted <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-csda-600 to-csda-800">
              SGPA & CGPA Calculation
            </span>
          </h1>

          {/* Short description */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A dedicated academic portal designed specifically for CSDA students. Securely track your semester marks, calculate credit-weighted grade points, project future CGPA, and generate official printable transcripts.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-csda-600 hover:bg-csda-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
              >
                <span>Go to Academic Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-csda-600 hover:bg-csda-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <span>Get Started — Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-sm transition-all"
                >
                  <span>Student Login</span>
                </Link>
              </>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-12 pt-8 border-t border-slate-200/80 max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl font-extrabold text-slate-900 font-mono">6</p>
              <p className="text-xs text-slate-500 font-medium">Curriculum Semesters</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 font-mono">10.0</p>
              <p className="text-xs text-slate-500 font-medium">Official Scale</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 font-mono">100%</p>
              <p className="text-xs text-slate-500 font-medium">Credit-Weighted</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 font-mono">Isolated</p>
              <p className="text-xs text-slate-500 font-medium">Encrypted Records</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-csda-700 bg-csda-50 px-3 py-1 rounded-full border border-csda-200">
              Department Architecture
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              Engineered Exclusively for CSDA Curriculum
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              Built from scratch to support the exact credit structures, practical lab weightages, and grading guidelines of our Data Analytics curriculum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-csda-100 text-csda-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Semester-wise SGPA</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enter theory and practical marks with instant validation. Live calculations of Grade Points (Marks/Max × 10) and Weighted Points for every eligible subject.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-csda-100 text-csda-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Cumulative CGPA Engine</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Never a simple average of SGPAs. Computes cumulative performance using true eligible credit weightages: Σ(Weighted Points) / Σ(Credits).
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-csda-100 text-csda-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Persistent & Isolated Records</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Backed by MongoDB with complete account isolation. Save your progress seamlessly and access your records securely across phones, tablets, or computers.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-csda-100 text-csda-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Printer className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">A4 Printable Transcripts</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Export and print clean, professional academic summary reports formatted specifically for standard A4 paper, free from web navigation controls.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-csda-100 text-csda-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Student Profile Management</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Dedicated Settings page to view and edit student details, manage roll number credentials, and update passwords with real-time verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculation Methodology Showcase */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Official CSDA Calculation Engine</h2>
          <p className="text-sm text-slate-600 mt-2">
            Fully compliant with university credit-weighting standards
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase text-csda-700 bg-csda-50 px-2 py-0.5 rounded">
                Formula 1: Grade Points
              </span>
              <p className="text-sm font-bold text-slate-900 font-mono mt-3">
                Grade Point = (Marks Obtained / Max Marks) × 10
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Weighted Point = Grade Point × Subject Credits
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase text-csda-700 bg-csda-50 px-2 py-0.5 rounded">
                Formula 2: SGPA & CGPA
              </span>
              <p className="text-sm font-bold text-slate-900 font-mono mt-3">
                SGPA / CGPA = Σ(Weighted Points) / Σ(Eligible Credits)
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Full intermediate precision preserved before rounding to 2 decimal places.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-csda-600 hover:bg-csda-700 text-white font-semibold text-sm shadow-sm transition-all"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

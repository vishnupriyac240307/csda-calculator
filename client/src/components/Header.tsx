import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  Calculator,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  const isActive = (path: string) => location.pathname === path;
  const isAdmin = user?.role === 'admin';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and App Title */}
          <Link
            to={isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/'}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-csda-600 to-csda-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-lg">CSDA</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-csda-100 text-csda-800 border border-csda-200">
                  Calculator
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                B.Sc. Computer Science with Data Analytics
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {isAdmin ? (
                /* ADMIN ONLY: Only Admin Rankings & Settings */
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-bold transition-colors ${
                    isActive('/admin')
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Admin Rankings</span>
                </Link>
              ) : (
                /* STUDENT ONLY: Dashboard, Semester Marks, Results */
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/dashboard')
                        ? 'bg-csda-50 text-csda-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    to="/semesters"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname.startsWith('/semesters')
                        ? 'bg-csda-50 text-csda-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Semester Marks</span>
                  </Link>

                  <Link
                    to="/results"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/results')
                        ? 'bg-csda-50 text-csda-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Results</span>
                  </Link>
                </>
              )}

              <div className="h-6 w-px bg-slate-200 mx-1"></div>

              {/* Settings with Gear Icon */}
              <Link
                to="/settings"
                title="Settings & Profile"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/settings')
                    ? 'bg-csda-50 text-csda-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-600" />
                <span>Settings</span>
              </Link>

              {/* User Profile Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-xs font-medium text-slate-700 ml-1">
                {isAdmin ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                ) : (
                  <UserIcon className="w-3.5 h-3.5 text-csda-600" />
                )}
                <span className="max-w-[130px] truncate font-semibold" title={user?.fullName}>
                  {user?.fullName}
                </span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-500 font-mono">
                  {isAdmin ? 'ADMIN' : user?.rollNumber}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                title="Sign out"
                className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-csda-700 hover:text-csda-800 px-4 py-2 rounded-lg hover:bg-csda-50 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold text-white bg-csda-600 hover:bg-csda-700 px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all"
              >
                Create Account
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="px-3 py-2 bg-slate-50 rounded-lg mb-3">
                <p className="text-xs text-slate-500 font-medium">Signed in as:</p>
                <p className="text-sm font-bold text-slate-900">{user?.fullName}</p>
                <p className="text-xs text-slate-500 font-mono">
                  {isAdmin ? 'Administrator' : `Roll No: ${user?.rollNumber}`}
                </p>
              </div>

              {isAdmin ? (
                /* ADMIN MOBILE MENU: Only Admin Rankings & Settings */
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold ${
                    isActive('/admin')
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Admin Rankings & Export</span>
                </Link>
              ) : (
                /* STUDENT MOBILE MENU: Dashboard, Semesters, Results */
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive('/dashboard')
                        ? 'bg-csda-50 text-csda-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-csda-600" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    to="/semesters"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      location.pathname.startsWith('/semesters')
                        ? 'bg-csda-50 text-csda-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Calculator className="w-4 h-4 text-csda-600" />
                    <span>Semester Marks</span>
                  </Link>

                  <Link
                    to="/results"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive('/results')
                        ? 'bg-csda-50 text-csda-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-csda-600" />
                    <span>Academic Results</span>
                  </Link>
                </>
              )}

              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive('/settings')
                    ? 'bg-csda-50 text-csda-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-600" />
                <span>Settings & Profile</span>
              </Link>

              <div className="pt-2 border-t border-slate-200">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-1">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 rounded-lg text-sm font-semibold text-csda-700 bg-csda-50 hover:bg-csda-100"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-csda-600 hover:bg-csda-700 shadow-sm"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

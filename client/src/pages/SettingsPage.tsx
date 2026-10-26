import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import { UserProfile } from '../types';
import { ProfileForm } from '../components/ProfileForm';
import { ChangePasswordForm } from '../components/ChangePasswordForm';
import {
  Settings,
  ShieldCheck,
  Building,
  Loader2
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await profileService.getProfile();
        if (res.success && res.profile) {
          setProfile(res.profile);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
        // Fallback to user from context
        if (user) {
          setProfile(user);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading || !profile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-csda-600 animate-spin" />
        <p className="text-slate-600 text-sm font-medium mt-3">Loading student settings...</p>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Settings Page Title */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>{isAdmin ? 'Administrator Portal' : 'Student Account'}</span>
          <span>/</span>
          <span className={isAdmin ? 'text-amber-700' : 'text-csda-700'}>Settings</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
          <Settings className={`w-6 h-6 ${isAdmin ? 'text-amber-600' : 'text-csda-600'}`} />
          <span>{isAdmin ? 'Administrator Settings & Profile' : 'Student Settings & Profile'}</span>
        </h1>
        <p className="text-xs text-slate-500">
          {isAdmin
            ? 'Manage your administrator account details, security credentials, and password'
            : 'Manage your personal details, academic credentials, and security password'}
        </p>
      </div>

      {/* Section 1 & 2: Profile Information & Edit Profile Form */}
      <ProfileForm
        initialProfile={profile}
        onProfileUpdated={(updated) => setProfile(updated)}
      />

      {/* Section 3: Security & Change Password */}
      <ChangePasswordForm />

      {/* Section 4: Account & Institutional Information */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-csda-600" />
            <span>Academic & Account Information</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            System registration and institutional affiliation
          </p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
          <div className="space-y-1">
            <span className="font-semibold text-slate-500 uppercase tracking-wider block">
              Department
            </span>
            <p className="text-sm font-bold text-slate-800">
              B.Sc. Computer Science with Data Analytics (CSDA)
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-slate-500 uppercase tracking-wider block">
              Program Duration
            </span>
            <p className="text-sm font-bold text-slate-800">
              3 Years (6 Semesters)
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-slate-500 uppercase tracking-wider block">
              Database Persistence
            </span>
            <p className="text-sm font-medium text-emerald-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>MongoDB Atlas Isolated Collection</span>
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-slate-500 uppercase tracking-wider block">
              Curriculum Version
            </span>
            <p className="text-sm font-mono font-medium text-slate-800">
              v1.0 (Modular Configurable Framework)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

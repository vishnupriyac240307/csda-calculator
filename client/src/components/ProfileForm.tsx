import React, { useState } from 'react';
import { UserProfile } from '../types';
import { profileService, UpdateProfileData } from '../services/profileService';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Hash,
  Mail,
  AtSign,
  Calendar,
  Edit3,
  Check,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ProfileFormProps {
  initialProfile: UserProfile;
  onProfileUpdated?: (updated: UserProfile) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ initialProfile, onProfileUpdated }) => {
  const { updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileData>({
    fullName: initialProfile.fullName,
    rollNumber: initialProfile.rollNumber,
    email: initialProfile.email,
    username: initialProfile.username
  });

  const [savedData, setSavedData] = useState<UserProfile>(initialProfile);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleEditClick = () => {
    setFormData({
      fullName: savedData.fullName,
      rollNumber: savedData.rollNumber,
      email: savedData.email,
      username: savedData.username
    });
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    // Discard unsaved changes and restore saved information
    setFormData({
      fullName: savedData.fullName,
      rollNumber: savedData.rollNumber,
      email: savedData.email,
      username: savedData.username
    });
    setErrorMsg(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    if (!formData.fullName.trim() || !formData.rollNumber.trim() || !formData.email.trim() || !formData.username.trim()) {
      setErrorMsg('All fields are required. Please fill in all information.');
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await profileService.updateProfile(formData);
      if (res.success && res.profile) {
        setSavedData(res.profile);
        // Instant global update in AuthContext so header, greetings, and dashboard update without re-login!
        updateUser(res.profile);
        if (onProfileUpdated) {
          onProfileUpdated(res.profile);
        }
        setSuccessMsg(res.message || 'Profile updated successfully.');
        setIsEditing(false);
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Failed to update profile. Please verify your details.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-slate-50/50">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-csda-600" />
            <span>Profile Information</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Your official CSDA student identification details
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleEditClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-csda-600 hover:bg-csda-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      <div className="p-6">
        {/* Feedback Alerts */}
        {successMsg && (
          <div className="mb-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!isEditing ? (
          /* Read-only Profile Information View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Full Name
              </span>
              <p className="text-base font-bold text-slate-900">{savedData.fullName}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                Roll Number
              </span>
              <p className="text-base font-bold text-slate-900 font-mono">{savedData.rollNumber}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email Address
              </span>
              <p className="text-base font-medium text-slate-800">{savedData.email}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <AtSign className="w-3.5 h-3.5 text-slate-400" />
                Username
              </span>
              <p className="text-base font-medium text-slate-800 font-mono">@{savedData.username}</p>
            </div>

            {savedData.createdAt && (
              <div className="space-y-1 md:col-span-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Account Registration Date
                </span>
                <p className="text-xs text-slate-600">
                  {new Date(savedData.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Editable Profile Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-csda-500 focus:border-csda-500"
                    placeholder="e.g. John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Roll Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value.toUpperCase() })}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-csda-500 focus:border-csda-500"
                    placeholder="e.g. 23CSDA042"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-csda-500 focus:border-csda-500"
                    placeholder="student@college.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <AtSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-csda-500 focus:border-csda-500"
                    placeholder="username"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleCancelClick}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-csda-600 hover:bg-csda-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

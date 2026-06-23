import { useState, useRef } from 'react';
import { useSearchParams } from 'react-router';
import {
  FiUser,
  FiUsers,
  FiShield,
  FiCamera,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiLogOut,
  FiAlertTriangle,
  FiMail,
  FiPhone,
  FiAtSign,
  FiLock,
  FiCalendar,
} from 'react-icons/fi';
import { useAuth } from '../../context/auth/AuthContext';
import ManageDocPopover from '../../components/app/rec/ManageDocPopover';
import Loading from '../../components/common/Loading';
import Error from '../../components/common/Error';
import Success from '../../components/common/Success';

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
};

/* ─────────────────────────────────────────────
   Shared card wrapper
───────────────────────────────────────────── */
const Card = ({ children, className = '' }) => (
  <div className={`rounded-[20px] border border-[#e5eaf4] bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-5">
    <h2 className="text-base font-extrabold text-[#07122f]">{title}</h2>
    {subtitle && <p className="mt-0.5 text-sm text-slate-400 font-medium">{subtitle}</p>}
  </div>
);

/* ─────────────────────────────────────────────
   Shared read-only field
───────────────────────────────────────────── */
const ReadOnlyField = ({ label, icon: Icon, value }) => (
  <div>
    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300">
        <Icon className="h-4 w-4" />
      </span>
      <div className="flex items-center w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e5eaf4] bg-[#f8fafc] text-sm text-slate-400 font-medium select-none min-h-[42px]">
        {value || '—'}
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Shared editable field
───────────────────────────────────────────── */
const EditableField = ({ label, icon: Icon, value, onChange, type = 'text', placeholder }) => (
  <div>
    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300">
        <Icon className="h-4 w-4" />
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e5eaf4] bg-white text-sm text-[#07122f] font-medium placeholder-slate-300 focus:outline-none focus:border-[#2459ff] focus:ring-1 focus:ring-[#2459ff]/30 transition"
      />
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Shared password field
───────────────────────────────────────────── */
const PasswordInput = ({ label, value, show, onToggle, onChange, placeholder }) => (
  <div>
    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300">
        <FiLock className="h-4 w-4" />
      </span>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="block w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#e5eaf4] bg-white text-sm text-[#07122f] font-medium placeholder-slate-300 focus:outline-none focus:border-[#2459ff] focus:ring-1 focus:ring-[#2459ff]/30 transition"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-300 hover:text-slate-500 transition cursor-pointer"
      >
        {show ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
      </button>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Tab 1 — Profile
───────────────────────────────────────────── */
const ProfileTab = () => {
  const { user, dispatch } = useAuth();
  const fileRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    mobileNumber: user?.mobileNumber || '',
  });

  // Modal states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);   // { heading, message }
  const [success, setSuccess] = useState(null); // { heading, message }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      setError({ heading: 'Validation Error', message: 'Full name cannot be empty.' });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to save changes.');
      dispatch({ type: 'LOGIN', payload: { user: data.user } });
      setSuccess({ heading: 'Profile Updated', message: 'Your profile information has been saved successfully.' });
    } catch (err) {
      setError({ heading: 'Update Failed', message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      fullName: user?.fullName || '',
      mobileNumber: user?.mobileNumber || '',
    });
    handleRemovePhoto();
  };

  return (
    <div className="space-y-5">
      {/* Global modals */}
      {isLoading && <Loading message="Saving your profile..." />}
      {error && <Error heading={error.heading} message={error.message} onClose={() => setError(null)} />}
      {success && <Success heading={success.heading} message={success.message} onClose={() => setSuccess(null)} />}

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#07122f] tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-slate-400 font-medium">Manage your personal information.</p>
      </div>

      {/* Avatar Card */}
      <Card>
        <SectionHeader title="Profile Picture" subtitle="Upload a photo to personalise your account." />
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            {preview || user?.profileImage ? (
              <img
                src={preview || user.profileImage}
                alt="Profile"
                className="h-20 w-20 rounded-2xl object-cover border-2 border-[#e5eaf4]"
              />
            ) : (
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#2559ff] to-[#5b5ff7] flex items-center justify-center text-white text-2xl font-black select-none shadow-[0_8px_20px_rgba(36,89,255,0.18)]">
                {getInitials(user?.fullName)}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#e5eaf4] bg-white px-3 py-2 text-xs font-bold text-[#07122f] hover:bg-slate-50 transition cursor-pointer"
              >
                <FiCamera className="h-3.5 w-3.5" /> Change Photo
              </button>
              {(preview || user?.profileImage) && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-100 transition cursor-pointer"
                >
                  <FiTrash2 className="h-3.5 w-3.5" /> Remove
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">JPG, PNG or GIF. Max 2MB recommended.</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>
        </div>
      </Card>

      {/* Personal Info */}
      <Card>
        <SectionHeader title="Personal Information" subtitle="Update your name and contact details." />
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Editable */}
            <EditableField
              label="Full Name"
              icon={FiUser}
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Jane Doe"
            />
            <EditableField
              label="Mobile Number"
              icon={FiPhone}
              type="tel"
              value={form.mobileNumber}
              onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
              placeholder="+91 98765 43210"
            />

            {/* Read-only */}
            <ReadOnlyField label="Email Address" icon={FiMail} value={user?.email} />
            <ReadOnlyField
              label="Username"
              icon={FiAtSign}
              value={user?.username ? `@${user.username}` : '—'}
            />
            <ReadOnlyField
              label="Role"
              icon={FiShield}
              value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '—'}
            />
          </div>

          {/* Actions */}
          <div className="mt-6 pt-4 border-t border-[#f1f5f9] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2.5 rounded-xl border border-[#e5eaf4] bg-white text-sm font-bold text-slate-500 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#2459ff] text-sm font-bold text-white hover:bg-[#1a44cc] transition cursor-pointer shadow-[0_4px_14px_rgba(36,89,255,0.22)]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Tab 2 — Manage Doctor
───────────────────────────────────────────── */
const DoctorTab = () => (
  <div className="space-y-5">
    <div>
      <h1 className="text-2xl font-extrabold text-[#07122f] tracking-tight">Manage Doctor</h1>
      <p className="mt-1 text-sm text-slate-400 font-medium">Link, manage, or remove your associated doctor.</p>
    </div>
    <Card>
      <ManageDocPopover isInline={true} setIsPopoverOpen={() => {}} />
    </Card>
  </div>
);

/* ─────────────────────────────────────────────
   Tab 3 — Account
───────────────────────────────────────────── */
const AccountTab = () => {
  const { user, dispatch } = useAuth();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // Modal states — password
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState(null);
  const [pwSuccess, setPwSuccess] = useState(null);

  // Modal states — logout
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState(null);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError({ heading: 'Passwords Do Not Match', message: 'Your new password and confirmation do not match. Please try again.' });
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwError({ heading: 'Password Too Short', message: 'New password must be at least 6 characters long.' });
      return;
    }
    setPwLoading(true);
    try {
      const res = await fetch('/api/auth/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update password.');
      setPwSuccess({ heading: 'Password Updated', message: 'Your password has been changed successfully.' });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwError({ heading: 'Update Failed', message: err.message });
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      if (res.ok) {
        dispatch({ type: 'LOGOUT' });
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Logout failed.');
      }
    } catch (err) {
      setLogoutError({ heading: 'Logout Failed', message: err.message });
      setLogoutLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Modals */}
      {pwLoading && <Loading message="Updating your password..." />}
      {pwError && <Error heading={pwError.heading} message={pwError.message} onClose={() => setPwError(null)} />}
      {pwSuccess && <Success heading={pwSuccess.heading} message={pwSuccess.message} onClose={() => setPwSuccess(null)} />}
      {logoutLoading && <Loading message="Signing you out..." />}
      {logoutError && <Error heading={logoutError.heading} message={logoutError.message} onClose={() => setLogoutError(null)} />}

      <div>
        <h1 className="text-2xl font-extrabold text-[#07122f] tracking-tight">Account</h1>
        <p className="mt-1 text-sm text-slate-400 font-medium">Manage your security settings and account details.</p>
      </div>

      {/* Change Password */}
      <Card>
        <SectionHeader title="Change Password" subtitle="Update your login credentials." />
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <PasswordInput
            label="Current Password"
            value={pwForm.currentPassword}
            show={showCurrent}
            onToggle={() => setShowCurrent(!showCurrent)}
            onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
            placeholder="Enter current password"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <PasswordInput
              label="New Password"
              value={pwForm.newPassword}
              show={showNew}
              onToggle={() => setShowNew(!showNew)}
              onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
              placeholder="Min. 6 characters"
            />
            <PasswordInput
              label="Confirm New Password"
              value={pwForm.confirmPassword}
              show={showConfirm}
              onToggle={() => setShowConfirm(!showConfirm)}
              onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
              placeholder="Repeat new password"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#2459ff] text-sm font-bold text-white hover:bg-[#1a44cc] transition cursor-pointer shadow-[0_4px_14px_rgba(36,89,255,0.22)]"
            >
              Update Password
            </button>
          </div>
        </form>
      </Card>

      {/* Account Information */}
      <Card>
        <SectionHeader title="Account Information" subtitle="Your account metadata." />
        <div className="divide-y divide-[#f1f5f9]">
          {[
            { label: 'Account Created', value: formatDate(user?.createdAt) },
            { label: 'Last Updated', value: formatDate(user?.updatedAt) },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3 text-slate-500">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f8fafc] border border-[#e5eaf4]">
                  <FiCalendar className="h-4 w-4 text-slate-400" />
                </span>
                <span className="text-sm font-semibold">{label}</span>
              </div>
              <span className="text-sm font-bold text-[#07122f]">{value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Danger Zone */}
      <div className="rounded-[20px] border border-red-100 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-2 mb-1">
          <FiAlertTriangle className="h-4 w-4 text-red-500" />
          <h2 className="text-base font-extrabold text-[#07122f]">Danger Zone</h2>
        </div>
        <p className="text-sm text-slate-400 font-medium mb-5">This action will end your current session immediately.</p>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-bold text-[#07122f]">Logout</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Sign out of your current session on this device.</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-100 text-sm font-bold text-red-500 hover:bg-red-100 transition cursor-pointer shrink-0"
          >
            <FiLogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Settings Page
───────────────────────────────────────────── */
const TABS = [
  { id: 'profile', label: 'Profile', icon: FiUser },
  { id: 'doctor', label: 'Manage Doctor', icon: FiUsers },
  { id: 'account', label: 'Account', icon: FiShield },
];

const SettingRec = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);

  const renderContent = () => {
    if (activeTab === 'profile') return <ProfileTab />;
    if (activeTab === 'doctor') return <DoctorTab />;
    if (activeTab === 'account') return <AccountTab />;
    return <ProfileTab />;
  };

  return (
    <div className="min-h-screen">
      {/* Mobile Tab Bar */}
      <div className="lg:hidden mb-5 overflow-x-auto scrollbar-none">
        <div className="flex gap-1 bg-white border border-[#e5eaf4] rounded-2xl p-1.5 w-max min-w-full shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeTab === id
                  ? 'bg-[#2459ff] text-white shadow-[0_4px_12px_rgba(36,89,255,0.22)]'
                  : 'text-slate-400 hover:text-[#07122f] hover:bg-slate-50'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-8">
        {/* Sidebar — desktop only */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-[20px] border border-[#e5eaf4] bg-white p-2 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
            <div className="px-3 pt-3 pb-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Settings</p>
            </div>
            <nav className="space-y-0.5">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 text-left cursor-pointer ${
                    activeTab === id
                      ? 'bg-[#eef4ff] text-[#2459ff]'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-[#07122f]'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${activeTab === id ? 'text-[#2459ff]' : 'text-slate-400'}`} />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content area */}
        <div className="min-w-0">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingRec;

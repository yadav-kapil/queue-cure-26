import { useAuth } from '../../context/auth/AuthContext';
import { FiMail, FiPhone, FiBriefcase, FiLogOut } from 'react-icons/fi';
import { useState } from 'react';

const Profile = ({ onClose }) => {
  const { user, dispatch } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const res = await fetch(`/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        dispatch({ type: 'LOGOUT' });
        onClose();
      } else {
        console.error('Failed to log out');
      }
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) return null;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).slice(0, 1).join('').toUpperCase();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 cursor-default" onClick={onClose} />

      <div className="absolute right-0 top-full mt-2.5 w-72 origin-top-right rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.08)] z-50 animate-in fade-in slide-in-from-top-3 duration-200">
        
        <div className="flex items-center gap-3 bg-slate-50/70 rounded-2xl p-3 mb-3 text-left">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#2559ff] to-[#5b5ff7] text-white font-extrabold text-base shadow-xs select-none">
            {getInitials(user.fullName)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-extrabold text-slate-800 truncate leading-tight">
              {user.fullName}
            </h3>
            <span className="mt-1 inline-flex items-center rounded-full bg-blue-50/50 px-2 py-0.5 text-[10px] font-bold text-[#2559ff] border border-blue-100/50 uppercase tracking-wider">
              {user.role}
            </span>
          </div>
        </div>

        <div className="space-y-3 px-1 py-2 text-left">
          <div className="flex items-center gap-3 text-slate-600">
            <FiMail className="h-4.5 w-4.5 text-[#2559ff]/70 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</p>
              <p className="text-sm font-bold text-slate-700 truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-600">
            <FiPhone className="h-4.5 w-4.5 text-[#2559ff]/70 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mobile Number</p>
              <p className="text-sm font-bold text-slate-700">{user.mobileNumber}</p>
            </div>
          </div>

          {user.clinicName && (
            <div className="flex items-center gap-3 text-slate-600">
              <FiBriefcase className="h-4.5 w-4.5 text-[#2559ff]/70 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Clinic Name</p>
                <p className="text-sm font-bold text-slate-700 truncate">{user.clinicName}</p>
              </div>
            </div>
          )}
        </div>

        <div className="my-2 border-t border-slate-100" />

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-rose-500 transition hover:bg-rose-50/40 disabled:opacity-50 cursor-pointer text-left"
        >
          <FiLogOut className="h-4.5 w-4.5 text-rose-500 animate-pulse" />
          <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </>
  );
};

export default Profile;

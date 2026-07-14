import { useState } from 'react'
import { NavLink } from 'react-router'
import {
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiGrid,
  FiPlus,
  FiUsers,
  FiSettings,
} from 'react-icons/fi'
import { useAuth } from '../../../context/auth/AuthContext'
import Profile from '../Profile'

const NavigationbarRec = () => {
  const { user } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const navItems = [
    { label: 'Dashboard', shortLabel: 'Dashboard', to: '/rec/dashboard', icon: FiGrid, end: true },
    { label: 'Manage Patient', shortLabel: 'Patients', to: '/rec/manage-patient', icon: FiUsers },
    { label: 'History', shortLabel: 'History', to: '/rec/history', icon: FiClock },
  ]

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).slice(0, 1).join('').toUpperCase();
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-slate-100 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <NavLink to="/rec/dashboard" viewTransition className="flex items-center gap-3" aria-label="Queue Cure receptionist dashboard">
            <span className="grid h-10 w-10 place-items-center rounded-xl border-2 border-[#4d7cfe] text-[#2459ff] shadow-[0_8px_18px_rgba(77,124,254,0.16)]">
              <FiPlus className="h-6 w-6 stroke-[3]" />
            </span>
            <span className="text-xl font-extrabold tracking-[-0.01em] text-[#07122f] sm:text-2xl">
              Queue <span className="text-[#2559ff]">Cure</span>
            </span>
          </NavLink>

          <div className="flex items-center gap-2 sm:gap-3">
            <NavLink
              to="/rec/settings"
              viewTransition
              className={({ isActive }) =>
                `grid h-9.5 w-9.5 place-items-center rounded-2xl border transition cursor-pointer ${
                  isActive
                    ? 'border-[#2459ff] bg-[#eef4ff] text-[#2459ff]'
                    : 'border-slate-200/60 bg-white text-slate-500 hover:bg-slate-50'
                }`
              }
              aria-label="Receptionist Settings"
            >
              <FiSettings className="h-5 w-5" />
            </NavLink>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 rounded-2xl border border-slate-200/60 bg-white p-1.5 transition hover:bg-slate-50 cursor-pointer shadow-xs"
                aria-label="Receptionist profile menu"
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover border border-slate-100 shadow-xs"
                  />
                ) : (
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#2559ff] to-[#5b5ff7] text-white font-extrabold text-sm select-none">
                    {getInitials(user?.fullName)}
                  </span>
                )}
                {isProfileOpen ? (
                  <FiChevronUp className="h-4 w-4 text-slate-600" />
                ) : (
                  <FiChevronDown className="h-4 w-4 text-slate-600" />
                )}
              </button>

              {isProfileOpen && (
                <Profile onClose={() => setIsProfileOpen(false)} />
              )}
            </div>
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white p-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center w-full gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                viewTransition
                className={({ isActive }) => {
                  return [
                    'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-bold transition-all duration-300',
                    isActive
                      ? 'text-[#2459ff]'
                      : 'text-slate-400 hover:text-slate-600',
                  ].join(' ')
                }}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`h-6 w-6 ${isActive ? 'fill-[#2459ff]/10' : ''}`} />
                    <span
                      className={[
                        'transition-all duration-300 font-bold tracking-wide truncate',
                        'inline-block',
                      ].join(' ')}
                    >
                      {item.shortLabel || item.label}
                    </span>
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>
    </>
  )
}

export default NavigationbarRec

import { useState } from 'react'
import { NavLink } from 'react-router'
import {
  FiBell,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiGrid,
  FiPlus,
  FiRadio,
} from 'react-icons/fi'
import { useAuth } from '../../context/auth/AuthContext'
import Profile from './Profile'

const Navigationbar = () => {
  const { user } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const navItems = [
    { label: 'Dashboard', to: '/doctor/dashboard', icon: FiGrid, end: true },
    { label: 'Live Session', to: '/doctor/live-session', icon: FiRadio },
    { label: 'History', to: '/doctor/history', icon: FiClock },
  ]

  // Get initials for profile picture placeholder (only first letter)
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).slice(0, 1).join('').toUpperCase();
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-40 px-4 pt-3 sm:px-6">
        <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between rounded-[24px] border border-white/80 bg-white/90 px-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:px-6">
          <NavLink to="/doctor/dashboard" className="flex items-center gap-3" aria-label="Queue Cure doctor dashboard">
            <span className="grid h-10 w-10 place-items-center rounded-xl border-2 border-[#4d7cfe] text-[#2459ff] shadow-[0_8px_18px_rgba(77,124,254,0.16)]">
              <FiPlus className="h-6 w-6 stroke-[3]" />
            </span>
            <span className="text-xl font-extrabold tracking-[-0.01em] text-[#07122f] sm:text-2xl">
              Queue <span className="text-[#2559ff]">Cure</span>
            </span>
          </NavLink>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              className="relative grid h-11 w-11 place-items-center rounded-2xl text-[#07122f] transition hover:bg-[#f1f5ff]"
              aria-label="Notifications"
            >
              <FiBell className="h-6 w-6" />
              <span className="absolute right-2 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#ef4444] px-1 text-[11px] font-bold text-white">
                0
              </span>
            </button>

            <div className="hidden items-center gap-2 rounded-full bg-[#ecfdf5] px-4 py-2 text-sm font-semibold text-[#16a34a] sm:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
              Ready
            </div>

            {/* Profile Dropdown Wrapper */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 rounded-2xl border border-slate-200/60 bg-white p-1.5 transition hover:bg-slate-50 cursor-pointer shadow-xs"
                aria-label="Doctor profile menu"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#2559ff] to-[#5b5ff7] text-white font-extrabold text-sm select-none">
                  {getInitials(user?.fullName)}
                </span>
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

      <nav className="fixed bottom-5 left-1/2 z-40 w-[calc(100%-2rem)] max-w-[760px] -translate-x-1/2 rounded-full border border-white/80 bg-white/92 p-2 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <div className="grid grid-cols-3 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) => {
                  return [
                    'flex h-14 items-center justify-center gap-2 rounded-full text-sm font-semibold transition sm:text-base',
                    isActive
                      ? 'bg-gradient-to-r from-[#5b5ff7] to-[#4d7cfe] text-white shadow-[0_12px_25px_rgba(77,124,254,0.26)]'
                      : 'text-[#4b5563] hover:bg-[#f1f5ff] hover:text-[#2459ff]',
                  ].join(' ')
                }}
              >
                <Icon className="h-5 w-5" />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </>
  )
}

export default Navigationbar

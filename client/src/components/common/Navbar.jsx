import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import {
  FiArrowRight,
  FiCalendar,
  FiGrid,
  FiMenu,
  FiPlus,
  FiX,
  FiHome,
  FiSearch,
} from "react-icons/fi";
import { useAuth } from "../../context/auth/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const dashboardPath = user?.role === "doctor" ? "/doctor" : "/rec";

  const navLinks = [
    { label: "Home", href: "/#home", icon: FiHome },
    { label: "Track", href: "/patient/track", icon: FiSearch },
    { label: "Features", href: "/#features", icon: FiGrid },
    { label: "How It Works", href: "/#how-it-works", icon: FiCalendar },
    { label: "Contact", href: "/#contact", icon: FiArrowRight },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        isScrolled
          ? "px-4 pt-3 sm:px-6 lg:px-8"
          : "px-0 pt-0"
      }`}
    >
      <nav
        className={`mx-auto flex items-center justify-between transition-all duration-300 ${
          isScrolled
            ? "max-w-7xl rounded-[24px] bg-white/80 border border-slate-200/50 px-5 py-3 shadow-[0_20px_50px_rgba(15,23,42,0.05)] backdrop-blur-lg md:px-7"
            : "max-w-full rounded-none bg-white/90 px-6 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] border-b border-slate-100/60 backdrop-blur-lg md:px-12"
        }`}
      >
        <NavLink
          to="/"
          className="flex items-center gap-2.5 hover:scale-[1.02] transition-transform duration-200"
          aria-label="Queue Cure home"
        >
          <span className="grid size-8 place-items-center rounded-[8px] border-2 border-[#2f75ff] text-[#2f75ff] shadow-sm">
            <FiPlus className="text-lg stroke-[3]" />
          </span>
          <span className="text-lg font-extrabold tracking-normal sm:text-xl">
            Queue <span className="text-[#2f75ff]">Cure</span>
          </span>
        </NavLink>

        <div className="hidden items-center gap-9 text-sm font-bold text-slate-650 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.href}
              className="relative py-1.5 transition-colors duration-300 hover:text-[#315cf0] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0 after:bg-[#315cf0] after:transition-all after:duration-300 hover:after:w-full select-none"
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {isAuthenticated ? (
          <NavLink
            to={dashboardPath}
            className="group hidden items-center gap-3 rounded-full bg-[#315cf0] py-2 pl-5 pr-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#204ad0] hover:scale-[1.03] hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.97] md:inline-flex cursor-pointer"
          >
            Dashboard
            <span className="grid size-8 place-items-center rounded-full bg-white text-[#315cf0] transition-all duration-300 group-hover:translate-x-0.5">
              <FiArrowRight className="text-base" />
            </span>
          </NavLink>
        ) : (
          <NavLink
            to="/auth/login"
            className="group hidden items-center gap-3 rounded-full bg-[#090d15] py-2 pl-5 pr-2 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-all duration-300 hover:bg-[#1f242d] hover:scale-[1.03] hover:shadow-lg hover:shadow-slate-900/10 active:scale-[0.97] md:inline-flex cursor-pointer"
          >
            Login
            <span className="grid size-8 place-items-center rounded-full bg-white text-[#090d15] transition-all duration-300 group-hover:translate-x-0.5">
              <FiArrowRight className="text-base" />
            </span>
          </NavLink>
        )}

        <button
          type="button"
          className="grid size-10 place-items-center rounded-full bg-[#090d15] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-[#1f242d] hover:scale-105 active:scale-95 transition-all duration-300 lg:hidden cursor-pointer"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? (
            <FiX className="text-lg" />
          ) : (
            <FiMenu className="text-lg" />
          )}
        </button>
      </nav>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm animate-fade-in lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[36px] border-t border-slate-100 bg-white/95 backdrop-blur-md p-6 pb-8 shadow-[0_-15px_40px_rgba(15,23,42,0.08)] lg:hidden animate-slide-up">
            <div className="mx-auto mb-6 h-1 w-14 rounded-full bg-slate-200" />

            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <NavLink
                    key={link.label}
                    to={link.href}
                    className="group flex items-center gap-4 rounded-2xl px-4 py-3 text-[15px] font-bold text-slate-700 transition hover:bg-blue-50/40 hover:text-[#315cf0] active:bg-slate-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="grid size-9 place-items-center rounded-xl bg-slate-50 text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-[#315cf0]">
                      <Icon className="text-lg" />
                    </span>
                    {link.label}
                  </NavLink>
                );
              })}
            </div>

            {isAuthenticated ? (
              <NavLink
                to={dashboardPath}
                className="mt-6 mx-auto flex w-fit items-center gap-3 rounded-full bg-[#315cf0] py-2 pl-5 pr-2 text-[15px] font-bold text-white shadow-md transition hover:bg-[#204ad0] hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
                <span className="grid size-8 place-items-center rounded-full bg-white text-[#315cf0]">
                  <FiArrowRight />
                </span>
              </NavLink>
            ) : (
              <NavLink
                to="/auth/login"
                className="mt-6 mx-auto flex w-fit items-center gap-3 rounded-full bg-[#090d15] py-2 pl-5 pr-2 text-[15px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition hover:bg-[#171d29] hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Login
                <span className="grid size-8 place-items-center rounded-full bg-white text-[#090d15]">
                  <FiArrowRight />
                </span>
              </NavLink>
            )}
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;

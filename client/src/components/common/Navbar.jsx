import { useState } from "react";
import {
  FiArrowRight,
  FiCalendar,
  FiGrid,
  FiMenu,
  FiPlus,
  FiX,
} from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Features", href: "#features", icon: FiGrid },
    { label: "How It Works", href: "#how-it-works", icon: FiCalendar },
    { label: "Pricing", href: "#pricing", icon: FiPlus },
    { label: "Contact", href: "#contact", icon: FiArrowRight },
  ];

  return (
    <header className="relative z-30 px-4 pt-3 sm:px-6 lg:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-[24px] bg-white/92 px-5 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur md:px-7">
        <a
          href="/"
          className="flex items-center gap-2.5"
          aria-label="Queue Cure home"
        >
          <span className="grid size-8 place-items-center rounded-[8px] border-2 border-[#2f75ff] text-[#2f75ff]">
            <FiPlus className="text-lg stroke-[3]" />
          </span>
          <span className="text-lg font-extrabold tracking-normal sm:text-xl">
            Queue <span className="text-[#2f75ff]">Cure</span>
          </span>
        </a>

        <div className="hidden items-center gap-9 text-sm font-semibold text-[#080b13] lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition hover:text-[#2f75ff]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#login"
          className="group hidden items-center gap-3 rounded-full bg-[#090d15] py-2 pl-5 pr-2 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-all duration-300 hover:bg-[#3e444f] md:inline-flex"
        >
          {" "}
          Login{" "}
          <span className="grid size-8 place-items-center rounded-full bg-white text-[#090d15] transition-all duration-300 group-hover:translate-x-1">
            {" "}
            <FiArrowRight className="text-base" />{" "}
          </span>{" "}
        </a>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-full bg-[#090d15] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] lg:hidden"
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
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs animate-fade-in lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[32px] bg-white p-6 pb-8 shadow-[0_-12px_40px_rgba(15,23,42,0.12)] lg:hidden animate-slide-up">
            {/* Drag Handle */}
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-slate-200" />

            <div className="space-y-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-4 rounded-2xl px-4 py-3.5 text-[15px] font-semibold text-slate-800 transition hover:bg-slate-50 active:bg-slate-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-600">
                      <Icon className="text-lg" />
                    </span>
                    {link.label}
                  </a>
                );
              })}
            </div>

            <a
              href="#login"
              className="mt-6 flex items-center justify-between rounded-full bg-[#090d15] py-3.5 pl-6 pr-4 text-[15px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition hover:bg-[#171d29] active:scale-[0.98]"
              onClick={() => setIsOpen(false)}
            >
              Login
              <span className="grid size-8 place-items-center rounded-full bg-white text-[#090d15]">
                <FiArrowRight />
              </span>
            </a>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;

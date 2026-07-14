import { Link } from "react-router";

const Banner = ({ setShowBanner }) => {
  return (
    <div className="w-full py-2 px-4 font-semibold text-xs sm:text-sm text-white flex flex-wrap justify-center items-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 relative shadow-md select-none">
      <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-white text-blue-600 shadow-sm">
        New
      </span>
      <span className="font-semibold text-xs sm:text-sm text-white">
        Feature: Email Alerts 
      </span>
      <Link
        to="/blog/6a3ec5d79f046a84d0b8b084"
        viewTransition
        className="px-3.5 py-1 text-xs font-bold bg-[#090d15] text-white rounded-full hover:scale-105 hover:bg-slate-900 transition-all duration-200 shadow-sm cursor-pointer no-underline border-0 outline-none"
      >
        Read More.
      </Link>
      <button
        onClick={() => setShowBanner(false)}
        className="absolute right-4 text-white/80 hover:text-white hover:scale-110 transition p-1 cursor-pointer bg-transparent border-0 outline-none"
        aria-label="Dismiss banner"
      >
        ✕
      </button>
    </div>
  );
};

export default Banner;

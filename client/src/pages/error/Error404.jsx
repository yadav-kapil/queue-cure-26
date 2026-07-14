import { Link } from "react-router";
import { motion } from "motion/react";
import { FiHome, FiSearch, FiActivity, FiClock, FiArrowLeft } from "react-icons/fi";

const Error404 = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#f8fafc] text-[#0f172a] flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#2f75ff]/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-emerald-400/8 blur-[100px] pointer-events-none" />
      
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#0f172a 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-2.5 mb-8"
        >
          <span className="grid size-8 place-items-center rounded-[8px] border-2 border-[#2f75ff] text-[#2f75ff] shadow-sm bg-white">
            <FiActivity className="text-lg stroke-[3] animate-pulse" />
          </span>
          <span className="text-lg font-extrabold tracking-tight sm:text-xl text-[#0f172a]">
            Queue <span className="text-[#2f75ff]">Cure</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          whileHover={{ y: -4 }}
          className="relative w-full bg-white rounded-3xl border border-slate-200/60 shadow-[0_20px_50px_rgba(15,23,42,0.06)] overflow-hidden"
        >
          <div className="absolute left-0 top-[60%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#f8fafc] border-r border-slate-200/60 z-20" />
          <div className="absolute right-0 top-[60%] translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#f8fafc] border-l border-slate-200/60 z-20" />

          <div className="p-6 pb-4 sm:p-8 sm:pb-5">
            <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              <span>Clinic Ticket Pass</span>
              <span className="flex items-center gap-1.5 text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                <span className="size-1.5 rounded-full bg-rose-500 animate-ping" />
                Error State
              </span>
            </div>

            <div className="mt-6 flex flex-col items-center">
              <span className="text-xs font-bold text-[#2f75ff]/80 tracking-widest uppercase mb-1">
                Token Number
              </span>
              <h1 className="text-7xl sm:text-8xl font-black tracking-tighter text-[#0f172a] select-none">
                404
              </h1>
              <p className="text-sm font-semibold text-slate-500 mt-2 text-center">
                Page Not Found or Out of Queue
              </p>
            </div>
          </div>

          <div className="relative px-6 sm:px-8">
            <div className="border-t-2 border-dashed border-slate-100 w-full" />
          </div>

          <div className="p-6 pt-5 sm:p-8 sm:pt-6 bg-slate-50/50">
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs mb-6">
              <div>
                <span className="block text-slate-400 font-medium mb-0.5">Patient Name</span>
                <span className="font-bold text-slate-700 truncate block">The Lost Visitor</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium mb-0.5">Assigned Ward</span>
                <span className="font-bold text-slate-700 truncate block">Unknown/Expired</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium mb-0.5">Queue Status</span>
                <span className="font-bold text-rose-600 block">De-registered</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium mb-0.5 flex items-center gap-1">
                  <FiClock className="text-slate-400" /> Wait Time
                </span>
                <span className="font-bold text-slate-700 block">∞ Minutes</span>
              </div>
            </div>

            <div className="w-full bg-slate-100/50 rounded-xl p-3 flex items-center justify-between gap-4 border border-slate-100">
              <div className="flex items-center gap-2">
                <FiActivity className="text-[#2f75ff] animate-pulse text-base" />
                <span className="text-[11px] font-semibold text-slate-500">Live Diagnostics</span>
              </div>
              <div className="flex-1 max-w-[200px] h-6 flex items-center">
                <svg className="w-full h-full text-slate-300" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <motion.path
                    d="M0,10 L30,10 L35,2 L40,18 L45,10 L70,10 L74,4 L78,16 L82,10 L100,10"
                    fill="none"
                    stroke="#2f75ff"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                  />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mt-6 px-4"
        >
          <h2 className="text-xl font-bold text-[#0f172a] mb-2">
            You've jumped the queue!
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            The page you are looking for has been called, checked out, or never existed in our clinic records. Let's get you back in queue.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-3 w-full mt-8 px-2"
        >
          <Link
            to="/"
            viewTransition
            className="flex items-center justify-center gap-2 w-full sm:flex-1 rounded-2xl bg-[#315cf0] py-3.5 px-6 text-sm font-semibold text-white shadow-md hover:bg-[#204ad0] hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <FiHome className="text-base" />
            Go to Reception
          </Link>
          <Link
            to="/patient/track"
            viewTransition
            className="flex items-center justify-center gap-2 w-full sm:flex-1 rounded-2xl bg-white border border-slate-200 py-3.5 px-6 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-350 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <FiSearch className="text-base" />
            Track Live Queue
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 text-xs font-semibold text-slate-400"
        >
          <Link to="/" viewTransition className="flex items-center gap-1.5 hover:text-[#2f75ff] transition-colors duration-200">
            <FiArrowLeft /> Back to home page
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Error404;

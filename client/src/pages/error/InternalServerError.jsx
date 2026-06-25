import { useState } from "react";
import { Link, useRouteError } from "react-router";
import { motion } from "motion/react";
import { FiHome, FiRefreshCw, FiActivity, FiChevronDown, FiChevronUp, FiAlertTriangle } from "react-icons/fi";

const InternalServerError = () => {
  const error = useRouteError();
  const [showDetails, setShowDetails] = useState(false);

  const handleRetry = () => {
    window.location.reload();
  };

  // Safely extract error message if there's any active RouteError
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === "string" 
      ? error 
      : error && typeof error === "object" && "statusText" in error
        ? String(error.statusText)
        : "Unknown internal server exception.";

  const errorStack = error instanceof Error ? error.stack : null;

  return (
    <div className="relative min-h-screen w-full bg-[#f8fafc] text-[#0f172a] flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-rose-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-[#2f75ff]/8 blur-[100px] pointer-events-none" />
      
      {/* Subtle Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#0f172a 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        {/* Logo Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-2.5 mb-8"
        >
          <span className="grid size-8 place-items-center rounded-[8px] border-2 border-rose-500 text-rose-500 shadow-sm bg-white">
            <FiActivity className="text-lg stroke-[3] text-rose-500 animate-pulse" />
          </span>
          <span className="text-lg font-extrabold tracking-tight sm:text-xl text-[#0f172a]">
            Queue <span className="text-[#2f75ff]">Cure</span>
          </span>
        </motion.div>

        {/* Diagnostic Monitor Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="relative w-full bg-white rounded-3xl border border-slate-200/60 shadow-[0_20px_50px_rgba(15,23,42,0.06)] overflow-hidden"
        >
          {/* Card Side Cutouts */}
          <div className="absolute left-0 top-[45%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#f8fafc] border-r border-slate-200/60 z-20" />
          <div className="absolute right-0 top-[45%] translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#f8fafc] border-l border-slate-200/60 z-20" />

          {/* Monitor Top Section */}
          <div className="p-6 pb-4 sm:p-8 sm:pb-5">
            <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              <span>System Diagnostics</span>
              <span className="flex items-center gap-1.5 text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                <span className="size-1.5 rounded-full bg-rose-500 animate-ping" />
                Critical 500
              </span>
            </div>

            <div className="mt-6 flex flex-col items-center">
              <span className="text-xs font-bold text-rose-500/85 tracking-widest uppercase mb-1 flex items-center gap-1.5">
                <FiAlertTriangle /> Code 500
              </span>
              <h1 className="text-7xl sm:text-8xl font-black tracking-tighter text-[#0f172a] select-none">
                500
              </h1>
              <p className="text-sm font-semibold text-slate-500 mt-2 text-center">
                System Heartbeat Interrupted
              </p>
            </div>
          </div>

          {/* Ticket Divider */}
          <div className="relative px-6 sm:px-8">
            <div className="border-t-2 border-dashed border-slate-100 w-full" />
          </div>

          {/* Diagnostic Details */}
          <div className="p-6 pt-5 sm:p-8 sm:pt-6 bg-slate-50/50">
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs mb-6">
              <div>
                <span className="block text-slate-400 font-medium mb-0.5">Symptom</span>
                <span className="font-bold text-slate-700 truncate block">Internal Server Error</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium mb-0.5">Diagnosis</span>
                <span className="font-bold text-slate-700 truncate block">Render or Loader Crash</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium mb-0.5">Action Taken</span>
                <span className="font-bold text-rose-650 block">Paging Developers</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium mb-0.5">Server Status</span>
                <span className="font-bold text-slate-700 block">Unresponsive</span>
              </div>
            </div>

            {/* Live Flatline Animation */}
            <div className="w-full bg-slate-100/50 rounded-xl p-3 flex items-center justify-between gap-4 border border-slate-100">
              <div className="flex items-center gap-2">
                <FiActivity className="text-rose-500 animate-pulse text-base" />
                <span className="text-[11px] font-semibold text-slate-500">ECG Flatline</span>
              </div>
              <div className="flex-1 max-w-[200px] h-6 flex items-center">
                <svg className="w-full h-full text-slate-300" viewBox="0 0 100 20" preserveAspectRatio="none">
                  {/* Real flatline with small static/noise spikes */}
                  <motion.path
                    d="M0,10 L35,10 L37,9 L39,11 L41,10 L75,10 L76,8 L77,12 L78,10 L100,10"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                  />
                </svg>
              </div>
            </div>

            {/* Error Detail Toggler */}
            {error && (
              <div className="border-t border-slate-200/50 pt-4 mt-4">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center justify-between w-full text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <span>Diagnostic Log Report</span>
                  {showDetails ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="mt-3 overflow-hidden text-left"
                  >
                    <div className="bg-slate-900 text-slate-300 rounded-xl p-4 text-[11px] font-mono leading-relaxed overflow-x-auto max-h-40 shadow-inner border border-slate-800">
                      <div className="text-rose-400 font-bold mb-1">Error: {errorMessage}</div>
                      {errorStack && <div className="opacity-70 whitespace-pre text-[10px]">{errorStack}</div>}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Message and Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mt-6 px-4"
        >
          <h2 className="text-xl font-bold text-[#0f172a] mb-2">
            The server needs a defibrillator!
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            An unexpected symptom occurred in our clinic's system. Don't worry, we are working to revive it.
          </p>
        </motion.div>

        {/* Navigation Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-3 w-full mt-8 px-2"
        >
          <button
            onClick={handleRetry}
            className="flex items-center justify-center gap-2 w-full sm:flex-1 rounded-2xl bg-rose-500 py-3.5 px-6 text-sm font-semibold text-white shadow-md hover:bg-rose-600 hover:scale-[1.02] hover:shadow-lg hover:shadow-rose-500/10 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <FiRefreshCw className="text-base" />
            Revive & Retry
          </button>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full sm:flex-1 rounded-2xl bg-white border border-slate-200 py-3.5 px-6 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-350 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <FiHome className="text-base" />
            Go to Reception
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default InternalServerError;

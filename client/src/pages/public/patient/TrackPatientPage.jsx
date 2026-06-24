import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { FiArrowRight, FiLock, FiShield, FiZap, FiClock, FiInfo } from "react-icons/fi";

const TrackPatientPage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleInputChange = (index, value) => {
    const cleanedVal = value.replace(/\D/g, "");
    if (cleanedVal.length === 0) {
      const updatedCodeArray = Array.from({ length: 4 }, (_, i) => 
        i === index ? "" : (code[i] || "")
      );
      setCode(updatedCodeArray.join(""));
      return;
    }

    const digit = cleanedVal[cleanedVal.length - 1];
    const updatedCodeArray = Array.from({ length: 4 }, (_, i) => 
      i === index ? digit : (code[i] || "")
    );
    const finalCode = updatedCodeArray.join("");
    setCode(finalCode);

    if (index < 3 && digit) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newCode = code.split("");
      
      if (newCode[index]) {
        newCode[index] = "";
        setCode(newCode.join(""));
      } else if (index > 0) {
        newCode[index - 1] = "";
        setCode(newCode.join(""));
        inputRefs[index - 1].current.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    setCode(pastedData);
    
    const focusIndex = Math.min(pastedData.length, 3);
    if (inputRefs[focusIndex]?.current) {
      inputRefs[focusIndex].current.focus();
    }
  };

  const getDigitValue = (index) => {
    return code[index] || "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!code || code.length !== 4) {
      setError("Please enter a valid 4-digit code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL || ''}/api/patient/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid OTP. Please try again.");
      } else {
        navigate(`/patient/track/${data.trackingId}`);
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#f1f5f9] via-white to-[#eff6ff] flex items-center justify-center p-4 sm:p-6 pt-20 sm:pt-24 pb-8 md:pb-12 relative overflow-hidden font-sans">
      <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md border border-slate-100 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.06)] rounded-[24px] sm:rounded-[32px] overflow-hidden relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          <div className="lg:col-span-7 p-5 sm:p-10 md:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 bg-[#fafcff]/50">
            
            <div className="relative flex items-center justify-center w-full max-w-[180px] sm:max-w-[260px] aspect-square mx-auto mb-4 sm:mb-8">
              <div className="absolute w-36 h-36 sm:w-56 sm:h-56 rounded-full bg-blue-100/50 filter blur-xl"></div>
              <div className="absolute w-28 h-28 sm:w-40 sm:h-40 rounded-full bg-indigo-50/70 filter blur-md"></div>

              <div className="absolute top-2 left-6 text-emerald-400 text-xl font-light select-none animate-pulse">+</div>
              <div className="absolute top-12 right-2 text-indigo-400 text-lg font-light select-none animate-pulse">+</div>
              <div className="absolute bottom-10 left-0 text-indigo-300 text-xl font-light select-none animate-pulse">+</div>
              <div className="absolute bottom-16 right-4 text-emerald-300 text-lg font-light select-none animate-pulse">+</div>

              <div className="relative w-28 h-40 sm:w-36 sm:h-52 bg-gradient-to-b from-[#b4c6ff] to-[#8da2fb] rounded-[18px] sm:rounded-[24px] shadow-2xl p-3 sm:p-4 flex flex-col justify-between transform -rotate-6 transition-transform duration-500 hover:rotate-0 hover:scale-105 select-none border border-white/20">
                <div className="absolute top-1/2 -left-2.5 w-5 h-5 sm:-left-3.5 sm:w-7 sm:h-7 bg-white/95 rounded-full -translate-y-1/2 shadow-inner"></div>
                <div className="absolute top-1/2 -right-2.5 w-5 h-5 sm:-right-3.5 sm:w-7 sm:h-7 bg-white/95 rounded-full -translate-y-1/2 shadow-inner"></div>

                <div className="text-center mt-1">
                  <p className="text-[7px] sm:text-[9px] tracking-[0.25em] text-indigo-950/60 font-bold uppercase">
                    Your Token
                  </p>
                </div>

                <div className="text-center my-auto">
                  <h3 className="text-3xl sm:text-5xl font-black text-indigo-950 tracking-tight">
                    #18
                  </h3>
                </div>

                <div className="space-y-1.5 opacity-40 mb-1">
                  <div className="h-1 bg-indigo-950 rounded-full w-full"></div>
                  <div className="h-1 bg-indigo-950 rounded-full w-2/3 mx-auto"></div>
                </div>

                <div className="absolute bottom-1.5 -right-1.5 sm:bottom-2.5 sm:right-[-8px] bg-emerald-500 text-white rounded-full p-1.5 sm:p-2.5 shadow-lg border-2 border-white flex items-center justify-center transform translate-x-1 translate-y-1">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="text-center max-w-sm mx-auto mb-4 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                Track Your Queue
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-2 sm:mt-3 leading-relaxed">
                Enter the 4-digit OTP shared with you to view your queue status.
              </p>
            </div>

            <div className="hidden sm:grid grid-cols-3 gap-4 pt-6 border-t border-slate-100">
              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <FiLock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Secure & Private</h4>
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Your information is safe with us.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                  <FiZap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Real-time Updates</h4>
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Get live updates on your queue status.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                  <FiClock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Save Your Time</h4>
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Plan your time better while you wait.</p>
                </div>
              </div>
            </div>

          </div>

          <div className="lg:col-span-5 p-5 sm:p-10 md:p-12 flex flex-col justify-center bg-white">
            
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight mb-4 sm:mb-6">
              Enter 4-Digit OTP
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="flex justify-around md:justify-between gap-2.5 sm:gap-4 my-1 sm:my-2">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    maxLength={1}
                    pattern="\d*"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={getDigitValue(index)}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 text-center text-lg sm:text-2xl font-extrabold border border-slate-200 rounded-xl sm:rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-50 focus:outline-none transition-all duration-200 bg-slate-50/50 focus:bg-white text-slate-800 caret-blue-600"
                  />
                ))}
              </div>

              {error && (
                <p className="text-xs text-rose-600 bg-rose-50/50 border border-rose-100 rounded-xl p-2.5 text-center animate-fade-in font-medium">
                  {error}
                </p>
              )}

              <div className="flex items-start gap-2.5 sm:gap-3 bg-blue-50/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-blue-100/40 text-blue-900/80">
                <FiShield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[10px] sm:text-[11px] leading-normal font-medium">
                  OTP is valid for your active queue only and does not expire until your session is completed.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 4}
                className={`w-full flex items-center justify-center gap-2 px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-white transition-all duration-300 ${
                  loading || code.length !== 4
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] transform cursor-pointer"
                }`}
              >
                {loading ? (
                  <svg className="animate-spin h-4 h-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <span>Track Queue</span>
                    <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center my-4 sm:my-6">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="px-3 text-[9px] sm:text-[10px] text-slate-400 font-bold tracking-widest uppercase">or</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            <div className="flex items-start gap-2.5 sm:gap-3 bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100 text-slate-600">
              <FiInfo className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-800">Don't have the OTP?</h4>
                <p className="text-[10px] sm:text-[11px] leading-normal text-slate-500 mt-0.5">
                  Please check the message sent by the clinic.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default TrackPatientPage;


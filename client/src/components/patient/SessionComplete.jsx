import React from "react";
import { useNavigate } from "react-router";
import { FiCheckCircle, FiHome, FiSearch } from "react-icons/fi";

const SessionComplete = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-outfit">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] sm:rounded-[24px] sm:px-10 text-center border border-slate-100/80">
          <div className="mx-auto h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6">
            <FiCheckCircle className="h-9 w-9 stroke-[2]" />
          </div>
          
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
            Consultation Completed!
          </h2>
          
          <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
            Thank you for visiting. Your consultation has been completed successfully. We hope you had a great experience!
          </p>
          
          <div className="space-y-3.5">
            <button
              onClick={() => navigate("/patient/track")}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition cursor-pointer"
            >
              <FiSearch className="mr-2 h-4.5 w-4.5" />
              Track Another Queue
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 bg-white hover:bg-slate-50 focus:outline-none transition cursor-pointer"
            >
              <FiHome className="mr-2 h-4.5 w-4.5" />
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionComplete;

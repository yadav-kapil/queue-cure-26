import React from "react";
import { FiUsers, FiTarget, FiHeart, FiAward, FiClock, FiActivity, FiSmile } from "react-icons/fi";

const AboutUs = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-100/50 rounded-full px-4 py-1.5 mb-6 text-blue-600 select-none shadow-sm">
          <FiUsers className="w-4 h-4" />
          <span className="text-xs font-extrabold tracking-wider uppercase">Our Vision & Journey</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
          Redefining the <br />
          <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Clinic Experience
          </span>
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          Queue Cure is dedicated to eliminating waiting room anxiety, respecting patient time, and helping healthcare providers deliver seamless, real-time care.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100/80 shadow-xs hover:shadow-xl hover:border-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-start cursor-pointer group">
          <div className="size-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <FiTarget className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Our Mission</h3>
          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            To empower clinics with smart queue technology that respects patients' time, reduces waiting room congestion, and optimizes daily medical workflows.
          </p>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100/80 shadow-xs hover:shadow-xl hover:border-indigo-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-start cursor-pointer group">
          <div className="size-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <FiAward className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Who We Are</h3>
          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            A team of passionate software designers and healthcare system architects building responsive, modern tools to improve accessibility for patients and providers.
          </p>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100/80 shadow-xs hover:shadow-xl hover:border-rose-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-start cursor-pointer group">
          <div className="size-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <FiHeart className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Our Values</h3>
          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            Uncompromising data privacy, user empathy, absolute transparency, and clean, beautiful design are the principles guiding every line of code we write.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-[44px] p-8 sm:p-12 md:p-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 shadow-xl relative overflow-hidden mb-24">
        <div className="absolute top-0 right-0 size-[400px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 size-[400px] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

        <div className="flex-1 text-left relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Our Story</h2>
          
          <p className="text-slate-300 text-sm leading-relaxed font-medium">
            Queue Cure began with a simple, personal frustration. We observed that patients frequently waste hours sitting in cold clinic waiting rooms, facing a complete lack of transparency regarding when their turn will arrive. This delay causes unnecessary stress for patients and places overwhelming friction on receptionists managing inquiries.
          </p>
          
          <p className="text-slate-300 text-sm leading-relaxed font-medium">
            We believed there was a better way to connect. Medical waiting rooms shouldn't feel like detention centers. Time is the most valuable resource for both patients and medical professionals. By introducing digital live queues, we aimed to give control back to the patient.
          </p>
          
          <p className="text-slate-300 text-sm leading-relaxed font-medium">
            With engineering precision, we designed a responsive system that processes updates in real-time. Patients check in, get a secure tracking link, and monitor their status dynamically from their phones. They are free to walk around, rest in their car, or get coffee, returning to the clinic only when their turn is genuinely close.
          </p>

          <p className="text-slate-300 text-sm leading-relaxed font-medium">
            Today, Queue Cure is used by healthcare providers to streamline patient coordination, eliminate waiting-room congestion, and elevate user satisfaction. We continue to evolve, integrating predictive analytics to calculate highly accurate estimated times, empowering clinics globally.
          </p>
        </div>

        <div className="w-full lg:w-96 shrink-0 aspect-square bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 rounded-[32px] flex flex-col items-center justify-center shadow-2xl relative z-10 border border-white/10 group overflow-hidden">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
          <span className="text-9xl font-black tracking-tighter select-none drop-shadow-lg">Q+C</span>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-200 mt-3 select-none">Established 2026</span>
        </div>
      </div>

      <div className="border border-slate-100 rounded-[40px] bg-white p-10 sm:p-12 shadow-sm text-center">
        <h3 className="text-2xl font-black text-slate-800 mb-10 tracking-tight">Queue Cure by the Numbers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="size-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <FiSmile className="w-6 h-6" />
            </div>
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">10,280+</span>
            <span className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Patients Served</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="size-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <FiClock className="w-6 h-6" />
            </div>
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">32 Mins</span>
            <span className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Avg. Time Saved</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="size-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <FiActivity className="w-6 h-6" />
            </div>
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">99.9%</span>
            <span className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Live Sync Uptime</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

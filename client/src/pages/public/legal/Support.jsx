import React, { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiHelpCircle, FiLinkedin, FiChevronDown, FiChevronUp } from "react-icons/fi";

const Support = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "How does the real-time patient tracking work?",
      a: "When a receptionist adds a patient to the queue, they receive a unique tracking link. This link loads a dynamic dashboard displaying the patient's exact position, estimated wait time, and current active status in real-time."
    },
    {
      q: "Can patients wait outside the clinic?",
      a: "Yes! Since the queue updates live via websockets, patients can monitor their turn from a nearby cafe, their car, or home, and only return to the waiting room when they see their turn is approaching."
    },
    {
      q: "How is the estimated wait time calculated?",
      a: "We calculate wait times based on the average consultation duration set by the doctor, multiplied by the number of patients ahead of you in the queue."
    },
    {
      q: "What happens if a patient misses their turn?",
      a: "The doctor or receptionist can mark the patient as 'Away' or 'Missed'. They can be easily re-activated or bumped down when they return, without disrupting the entire order."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-100/50 rounded-full px-4 py-1.5 mb-6 text-blue-600 select-none shadow-sm">
          <FiHelpCircle className="w-4 h-4" />
          <span className="text-xs font-extrabold tracking-wider uppercase">Help Center</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
          How can we help you?
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
          Find answers to common questions or reach out to our team for assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center justify-between min-h-[220px] cursor-pointer">
          <div className="flex flex-col items-center">
            <div className="size-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <FiMail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-800 mb-1">Email Us</h3>
            <p className="text-slate-500 text-xs mb-3 font-semibold">Response time: within 24 hours</p>
          </div>
          <a href="mailto:ky843622@gmail.com" className="text-blue-600 font-bold text-sm hover:underline">
            ky843622@gmail.com
          </a>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center justify-between min-h-[220px] cursor-pointer">
          <div className="flex flex-col items-center">
            <div className="size-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <FiPhone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-800 mb-1">Call Us</h3>
            <p className="text-slate-500 text-xs mb-3 font-semibold">Mon-Sat: 9 AM - 7 PM</p>
          </div>
          <a href="tel:+919560340701" className="text-indigo-600 font-bold text-sm hover:underline">
            +91-9560340701
          </a>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center justify-between min-h-[220px] cursor-pointer">
          <div className="flex flex-col items-center">
            <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <FiMapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-800 mb-1">Visit Us</h3>
            <p className="text-slate-500 text-xs mb-3 font-semibold">Our Campus</p>
          </div>
          <a 
            href="https://maps.google.com/?q=IIEST+Shibpur,+Kolkata,+West+Bengal" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-emerald-600 font-bold text-sm hover:underline leading-tight"
          >
            IIEST Shibpur, Kolkata
          </a>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center justify-between min-h-[220px] cursor-pointer">
          <div className="flex flex-col items-center">
            <div className="size-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <FiLinkedin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-800 mb-1">LinkedIn</h3>
            <p className="text-slate-500 text-xs mb-3 font-semibold">Let's connect</p>
          </div>
          <a 
            href="https://www.linkedin.com/in/kapilyadav9560/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 font-bold text-sm hover:underline"
          >
            kapilyadav9560
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 justify-center mb-10">
          <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <FiHelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden relative ${
                  isOpen 
                    ? "border-blue-500/20 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/5" 
                    : "border-slate-100/70 hover:border-slate-200 hover:shadow-md hover:shadow-slate-100/50"
                }`}
              >
                <div 
                  className={`absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-blue-600 to-indigo-600 transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`} 
                />
                
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className={`w-full pl-7 pr-6 py-5 text-left font-extrabold flex items-center justify-between transition-colors ${
                    isOpen 
                      ? "bg-gradient-to-r from-blue-50/20 via-blue-50/5 to-transparent text-blue-600" 
                      : "text-slate-800 hover:text-blue-600 hover:bg-slate-50/30"
                  }`}
                >
                  <span className="text-sm sm:text-base pr-4 leading-snug">{faq.q}</span>
                  <span className="text-slate-400 select-none shrink-0 transition-transform duration-300">
                    <FiChevronDown 
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-blue-600" : ""
                      }`} 
                    />
                  </span>
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pl-7 pr-6 pb-6 text-slate-600 text-sm leading-relaxed font-medium pt-2 border-t border-slate-50/80">
                    {faq.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Support;

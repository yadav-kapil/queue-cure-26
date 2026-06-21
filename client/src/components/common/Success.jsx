import React from 'react';

const Success = ({ heading = "Success!", message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-md transition-opacity duration-300 animate-fade-in">
      <div className="relative flex flex-col items-center p-8 bg-white border border-slate-100 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center animate-scale-fade-in">
        {/* Top-right close button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Checkmark icon with pulsing green layout */}
        <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 animate-pulse">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        
        {/* Texts */}
        <h3 className="text-xl font-bold text-slate-800">{heading}</h3>
        {message && <p className="mt-2 text-sm text-slate-500 leading-relaxed">{message}</p>}
        
        {/* Action button */}
        {onClose && (
          <button
            onClick={onClose}
            className="mt-6 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium rounded-xl shadow-sm transition-all duration-150 hover:shadow-md cursor-pointer"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default Success;

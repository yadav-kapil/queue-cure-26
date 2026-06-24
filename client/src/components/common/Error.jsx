import React from 'react';

const Error = ({ heading = "Something went wrong", message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-md transition-opacity duration-300 animate-fade-in">
      <div className="relative flex flex-col items-center p-8 bg-white border border-slate-100 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center animate-scale-fade-in">
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

        <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-rose-50 text-rose-500 border border-rose-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        
        <h3 className="text-xl font-bold text-slate-800">{heading}</h3>
        {message && <p className="mt-2 text-sm text-slate-500 leading-relaxed">{message}</p>}
        
        {onClose && (
          <button
            onClick={onClose}
            className="mt-6 w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-medium rounded-xl shadow-sm transition-all duration-150 hover:shadow-md cursor-pointer"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};

export default Error;

import { FiLoader } from "react-icons/fi";

const Loading = ({ message = "Please wait..." }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 backdrop-blur-md">
      <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-xl w-full max-w-sm mx-4">
        
        <div className="h-1.5 w-full bg-gradient-to-r from-[#315cf0] via-blue-400 to-cyan-400 animate-pulse" />

        <div className="p-8 flex flex-col items-center text-center">
          
          <div className="relative mb-5">
            <div className="size-20 rounded-full border-4 border-blue-100" />
            
            <div className="absolute inset-0 size-20 rounded-full border-4 border-transparent border-t-[#315cf0] animate-spin" />
            
            <div className="absolute inset-3 rounded-full bg-blue-50 flex items-center justify-center">
              <FiLoader className="text-[#315cf0] text-xl animate-spin" />
            </div>

            <div className="absolute inset-0 rounded-full bg-[#315cf0]/10 blur-xl animate-pulse" />
          </div>

          <h3 className="text-xl font-extrabold text-slate-900">
            Processing Request
          </h3>

          <p className="mt-2 text-sm text-slate-500 max-w-[260px] leading-relaxed">
            {message}
          </p>

          <div className="flex items-center gap-1.5 mt-5">
            <span className="size-2 rounded-full bg-[#315cf0] animate-bounce" />
            <span
              className="size-2 rounded-full bg-[#315cf0] animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="size-2 rounded-full bg-[#315cf0] animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Loading;

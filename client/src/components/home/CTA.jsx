import { FiArrowRight, FiUsers, FiClock, FiShield, FiPlus, FiBarChart2 } from "react-icons/fi";

const CTA = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      
      <div className="relative overflow-hidden rounded-[34px] bg-[radial-gradient(circle_at_76%_22%,#46b7ff_0%,#356df4_38%,#3541c9_100%)] p-8 sm:p-12 lg:p-16 text-white shadow-[0_24px_70px_rgba(33,82,230,0.22)] sm:rounded-[42px]">
        
        
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
          
          
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white/95 backdrop-blur-md">
              <span className="inline-block size-1.5 rounded-full bg-[#80f5ff] animate-pulse"></span>
              ✨ Get Started
            </div>
            
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[46px] leading-[1.15]">
              Ready to Transform <br />
              <span className="text-[#80f5ff]">Your Clinic Experience?</span>
            </h2>
            
            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-xl">
              Join clinics and hospitals already using Queue Cure to reduce waiting time, 
              simplify operations, and keep patients happy.
            </p>

            <div className="pt-2">
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pl-6 pr-2 text-sm font-medium text-black transition-all duration-350 hover:bg-[#080c14] hover:text-white hover:shadow-xl hover:shadow-black/15 cursor-pointer"
              >
                Get Started
                <span className="grid size-9 place-items-center rounded-full bg-[#080c14] text-white transition-all duration-300 group-hover:bg-white group-hover:text-[#080c14] group-hover:translate-x-0.5">
                  <FiArrowRight className="text-base" />
                </span>
              </a>
            </div>
          </div>

          
          <div className="lg:col-span-5 relative h-[360px] sm:h-[400px] w-full flex items-center justify-center overflow-visible select-none">
            
            
            <div className="absolute size-[280px] sm:size-[340px] rounded-full border border-dashed border-white/20 pointer-events-none" />
            <div className="absolute size-[180px] sm:size-[220px] rounded-full border border-dashed border-white/15 pointer-events-none" />
            
            
            <div 
              className="absolute top-[8%] right-[15%] size-11 rounded-full bg-white text-[#315cf0] flex items-center justify-center shadow-lg border border-slate-100/50 z-20 animate-float pointer-events-none"
              style={{ animationDelay: "0.5s", animationDuration: "5s" }}
            >
              <FiUsers className="text-lg" />
            </div>

            
            <div 
              className="absolute top-[35%] right-[2%] size-11 rounded-full bg-white text-[#315cf0] flex items-center justify-center shadow-lg border border-slate-100/50 z-20 animate-float pointer-events-none"
              style={{ animationDelay: "1.5s", animationDuration: "5.5s" }}
            >
              <FiBarChart2 className="text-lg" />
            </div>

            
            <div 
              className="absolute top-[38%] left-[2%] size-11 rounded-full bg-white text-[#315cf0] flex items-center justify-center shadow-lg border border-slate-100/50 z-20 animate-float pointer-events-none"
              style={{ animationDelay: "2.5s", animationDuration: "4.8s" }}
            >
              <FiClock className="text-lg" />
            </div>

            
            <div 
              className="absolute bottom-[10%] right-[20%] size-11 rounded-full bg-white text-emerald-500 flex items-center justify-center shadow-lg border border-slate-100/50 z-20 animate-float pointer-events-none"
              style={{ animationDelay: "3.5s", animationDuration: "6s" }}
            >
              <FiShield className="text-lg" />
            </div>

            
            <div className="relative w-52 h-52 sm:w-56 sm:h-56 bg-white rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.12)] border border-slate-100 flex flex-col p-4 transform -rotate-3 z-10 transition-transform duration-500 hover:rotate-0 hover:scale-[1.02]">
              
              
              <div className="absolute -top-2 left-6 flex gap-3.5 z-20">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-1.5 h-3 bg-slate-300 rounded-full shadow-inner" />
                    <div className="w-2.5 h-2 bg-slate-100 -mt-1 rounded-full border border-slate-200" />
                  </div>
                ))}
              </div>

              
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 pt-1 text-slate-800">
                <span className="text-xs font-black tracking-wider uppercase text-slate-400">June 2026</span>
                <div className="flex gap-1">
                  <span className="size-1.5 rounded-full bg-slate-200"></span>
                  <span className="size-1.5 rounded-full bg-slate-200"></span>
                </div>
              </div>

              
              <div className="grid grid-cols-7 gap-2 mt-4 text-center">
                
                {[...Array(35)].map((_, i) => {
                  const day = i - 2; 
                  const isChecked = day === 14;
                  
                  if (day <= 0 || day > 30) {
                    return <div key={i} className="size-5 sm:size-6" />;
                  }

                  if (isChecked) {
                    return (
                      <div 
                        key={i} 
                        className="size-5 sm:size-6 bg-blue-500 text-white rounded-md flex items-center justify-center text-[10px] font-black shadow-md shadow-blue-500/20"
                      >
                        ✓
                      </div>
                    );
                  }

                  return (
                    <div 
                      key={i} 
                      className={`size-5 sm:size-6 flex items-center justify-center text-[9px] font-bold ${
                        day === 13 || day === 15 ? 'text-slate-800 font-extrabold' : 'text-slate-300'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>

            
            <div className="absolute bottom-6 left-6 sm:left-10 size-24 sm:size-28 bg-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center justify-center z-15 transform rotate-6 transition-transform duration-500 hover:scale-105">
              <div className="relative size-20 sm:size-24 rounded-full border-2 border-slate-50 flex items-center justify-center">
                
                <div className="absolute size-2 bg-blue-500 rounded-full z-20" />
                
                <div className="absolute w-1 h-6 bg-slate-800 rounded-full bottom-1/2 left-1/2 origin-bottom -translate-x-1/2 rotate-[120deg]" />
                
                <div className="absolute w-0.5 h-9 bg-slate-400 rounded-full bottom-1/2 left-1/2 origin-bottom -translate-x-1/2 rotate-[10deg]" />
                
                <div className="absolute top-1 text-[8px] font-black text-slate-300">12</div>
                <div className="absolute bottom-1 text-[8px] font-black text-slate-300">6</div>
                <div className="absolute right-1 text-[8px] font-black text-slate-300">3</div>
                <div className="absolute left-1 text-[8px] font-black text-slate-300">9</div>
              </div>
            </div>

            
            <div className="absolute bottom-4 right-6 sm:right-10 size-20 sm:size-24 bg-gradient-to-tr from-[#356df4] to-[#46b7ff] text-white rounded-2xl shadow-[0_20px_45px_rgba(53,109,244,0.35)] flex flex-col items-center justify-center z-15 transform -rotate-12 transition-transform duration-500 hover:scale-105 hover:rotate-0 border border-white/20">
              <span className="size-10 sm:size-12 rounded-xl bg-white/10 text-white flex items-center justify-center shadow-inner">
                <FiPlus className="text-xl sm:text-2xl stroke-[3]" />
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default CTA;

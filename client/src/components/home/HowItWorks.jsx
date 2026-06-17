import { useState, useEffect } from "react";
import {
  FiDatabase,
  FiUser,
  FiClock,
  FiCheck,
  FiChevronRight,
  FiGrid,
  FiCheckCircle,
  FiChevronDown,
} from "react-icons/fi";

const HowItWorks = () => {
  // Animation loop state for the 4 workflow steps
  const [activeStep, setActiveStep] = useState(0);

  // Simulation states inside step mockups
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [step1BtnText, setStep1BtnText] = useState("Generate Token");
  const [generatedToken, setGeneratedToken] = useState(null); // null, then 33
  const [whatsappReceived, setWhatsappReceived] = useState(false);
  const [doctorToken, setDoctorToken] = useState(23);

  useEffect(() => {
    // 11.2-second global step loop (2.8s per step)
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2800);

    return () => clearInterval(stepInterval);
  }, []);

  // Sync specific animations with the activeStep
  useEffect(() => {
    if (activeStep === 0) {
      // Step 1: Receptionist registers patient
      // Reset everything else to default first
      setGeneratedToken(null);
      setWhatsappReceived(false);
      setDoctorToken(23);
      setPatientName("");
      setPatientPhone("");
      setStep1BtnText("Generate Token");

      // Animate typing
      const t1 = setTimeout(() => {
        setPatientName("Alice Smith");
        setPatientPhone("555-0199");
      }, 800);

      // Animate button click
      const t2 = setTimeout(() => {
        setStep1BtnText("Token Generated!");
      }, 1800);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else if (activeStep === 1) {
      // Step 2: Token generated
      setGeneratedToken(33);
    } else if (activeStep === 2) {
      // Step 3: WhatsApp received
      setWhatsappReceived(true);
    } else if (activeStep === 3) {
      // Step 4: Doctor calls next (23 -> 24)
      const t1 = setTimeout(() => {
        setDoctorToken(24);
      }, 1000);
      return () => clearTimeout(t1);
    }
  }, [activeStep]);

  return (
    <section id="how-it-works" className="bg-[#080b13] text-white overflow-hidden py-14 lg:py-20 relative">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 size-[400px] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 size-[400px] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* UPPER PART: Title + Live Sync Engine Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading and Subtitle */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-400">
              <span className="inline-block size-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              How it works
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[42px] leading-tight text-white">
              A simple workflow connecting doctors, receptionists and patients{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                in real-time.
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg">
              Every queue update happens instantly, keeping everyone in sync and your clinic running smoothly.
            </p>
          </div>

          {/* Right Column: Live Sync Engine diagram container */}
          <div className="lg:col-span-7 relative h-[400px] sm:h-[460px] w-full flex items-center justify-center">
            
            {/* SVG Interactive Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Connection paths */}
              {/* Receptionist (bottom left, ~22,80) -> Sync Engine (center, ~50,52) */}
              <path
                d="M 22 80 L 50 52"
                className="stroke-slate-700 stroke-[1] fill-none stroke-dasharray-[3,3]"
              />
              {/* Doctor (top center, ~50,20) -> Sync Engine (center, ~50,52) */}
              <path
                d="M 50 20 L 50 52"
                className="stroke-slate-700 stroke-[1] fill-none stroke-dasharray-[3,3]"
              />
              {/* Sync Engine (center, ~50,52) -> Patient (bottom right, ~78,80) */}
              <path
                d="M 50 52 L 78 80"
                className="stroke-slate-700 stroke-[1] fill-none stroke-dasharray-[3,3]"
              />

              {/* Glowing traveling dots */}
              <circle r="0.8" className="fill-purple-400">
                <animateMotion
                  dur="4s"
                  repeatCount="indefinite"
                  path="M 22 80 L 50 52"
                />
              </circle>
              <circle r="0.8" className="fill-blue-400">
                <animateMotion
                  dur="4s"
                  begin="1s"
                  repeatCount="indefinite"
                  path="M 50 20 L 50 52"
                />
              </circle>
              <circle r="0.8" className="fill-emerald-400">
                <animateMotion
                  dur="4s"
                  begin="2s"
                  repeatCount="indefinite"
                  path="M 50 52 L 78 80"
                />
              </circle>
            </svg>

            {/* Diagram Arrow labels */}
            {/* Label: Updates Queue (Receptionist -> Center) */}
            <div className="absolute top-[66%] left-[28%] -translate-x-1/2 -translate-y-1/2 bg-[#0e172a]/90 border border-slate-800 rounded-full px-2 py-0.5 text-[8px] sm:text-[10px] font-bold text-slate-400 shadow-md">
              Updates Queue
            </div>
            {/* Label: Calls Next (Center -> Doctor) */}
            <div className="absolute top-[33%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-[#0e172a]/90 border border-slate-800 rounded-full px-2 py-0.5 text-[8px] sm:text-[10px] font-bold text-slate-400 shadow-md">
              Calls Next
            </div>
            {/* Label: Sends Updates (Center -> Patient) */}
            <div className="absolute top-[66%] left-[72%] -translate-x-1/2 -translate-y-1/2 bg-[#0e172a]/90 border border-slate-800 rounded-full px-2 py-0.5 text-[8px] sm:text-[10px] font-bold text-slate-400 shadow-md">
              Sends Updates
            </div>

            {/* Node 1: Doctor Dashboard Card (Top Center) */}
            <div className="absolute top-[1%] left-1/2 -translate-x-1/2 z-10 w-[210px] sm:w-[280px] bg-[#0d1527]/95 border border-slate-800 hover:border-slate-700 rounded-2xl p-2 sm:p-3 flex items-center gap-2 sm:gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition duration-300">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150"
                alt="Doctor Avatar"
                className="size-8 sm:size-12 rounded-lg sm:rounded-xl object-cover border border-slate-700/50"
              />
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[10px] sm:text-xs font-bold text-slate-300">Doctor Dashboard</p>
                <p className="text-[8px] sm:text-[9px] text-slate-500 font-semibold mt-0.5">Current Token</p>
                <p className="text-sm sm:text-lg font-black text-blue-400 leading-none mt-1">24</p>
              </div>
              {/* Mini Sparkline Chart Widget */}
              <div className="w-12 sm:w-16 h-7 sm:h-8 shrink-0">
                <svg className="w-full h-full stroke-blue-500 stroke-[1.5] fill-none" viewBox="0 0 60 20">
                  <path d="M 0 15 Q 10 5, 20 12 T 40 4 T 60 10" />
                  <circle cx="60" cy="10" r="2.5" className="fill-blue-400 stroke-none" />
                  <circle cx="60" cy="10" r="5" className="fill-blue-500/30 stroke-none animate-ping" />
                </svg>
              </div>
            </div>

            {/* Node 2: Queue Cure Live Sync Engine (Center) */}
            <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 size-24 sm:size-28 rounded-full bg-gradient-to-br from-blue-600 to-indigo-800 flex flex-col items-center justify-center text-center shadow-[0_0_50px_rgba(49,92,240,0.5)] border border-blue-400/30">
              {/* Outer pulsing rings */}
              <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
              <div className="absolute -inset-4 rounded-full border border-indigo-500/10 pointer-events-none" />
              
              <FiDatabase className="text-xl sm:text-2xl text-white mb-1 drop-shadow-md" />
              <p className="text-[10px] sm:text-xs font-extrabold text-white leading-none">Queue Cure</p>
              <p className="text-[7px] sm:text-[8px] text-blue-200 uppercase tracking-widest font-bold mt-1">Live Sync</p>
            </div>

            {/* Node 3: Receptionist Dashboard Card (Bottom Left) */}
            <div className="absolute bottom-[2%] left-[2%] sm:left-[5%] z-10 w-[150px] sm:w-[220px] bg-[#0d1527]/95 border border-slate-800 hover:border-slate-700 rounded-2xl p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition duration-300">
              <img
                src="https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&q=80&w=150"
                alt="Receptionist Avatar"
                className="size-8 sm:size-11 rounded-lg object-cover border border-slate-700/50"
              />
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[9px] sm:text-[11px] font-bold text-slate-300 truncate">Receptionist</p>
                <p className="text-[7px] sm:text-[8px] text-slate-500 font-semibold mt-0.5 truncate">Patients Waiting</p>
                <p className="text-sm sm:text-base font-black text-purple-400 mt-0.5 leading-none">18</p>
              </div>
              <span className="size-6 sm:size-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <FiGrid className="text-xs sm:text-sm" />
              </span>
            </div>

            {/* Node 4: Patient View Card (Bottom Right) */}
            <div className="absolute bottom-[2%] right-[2%] sm:right-[5%] z-10 w-[150px] sm:w-[220px] bg-[#0d1527]/95 border border-slate-800 hover:border-slate-700 rounded-2xl p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition duration-300">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                alt="Patient Avatar"
                className="size-8 sm:size-11 rounded-lg object-cover border border-slate-700/50"
              />
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[9px] sm:text-[11px] font-bold text-slate-300 truncate">Patient View</p>
                <p className="text-[7px] sm:text-[8px] text-slate-500 font-semibold mt-0.5 truncate">Your Token</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-sm sm:text-base font-black text-blue-400 leading-none">31</span>
                  <span className="text-[6px] sm:text-[7px] text-slate-400 font-bold truncate">Est: 22m</span>
                </div>
              </div>
              <span className="size-6 sm:size-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <FiUser className="text-xs sm:text-sm" />
              </span>
            </div>

          </div>

        </div>

        {/* LOWER PART: Workflow Steps Visualizer */}
        <div className="mt-16 lg:mt-20">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <span className="inline-block size-1.5 rounded-full bg-indigo-400"></span>
              Workflow
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl text-white">
              How Queue Cure Works
            </h3>
          </div>

          {/* Steps Timeline Grid: 1 column on mobile, 2 columns on iPad, 4 columns on PC */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 items-stretch">
            
            {/* STEP 1: Receptionist Adds Patient */}
            <div className="relative flex flex-col gap-3 h-full justify-between w-full max-w-[280px] mx-auto">
              <div className="flex items-center gap-3 text-left">
                <span className={`size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shrink-0 ${
                  activeStep === 0 ? "bg-purple-500 text-white ring-4 ring-purple-500/20" : "bg-[#18233c] text-slate-400"
                }`}>
                  1
                </span>
                <div>
                  <h4 className={`text-sm font-bold transition-colors duration-300 ${activeStep === 0 ? "text-white" : "text-slate-400"}`}>
                    Receptionist Adds Patient
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-normal mt-0.5">
                    Registers patient and generates token.
                  </p>
                </div>
              </div>

              {/* Step 1 Visual Mockup */}
              <div className={`bg-white rounded-2xl p-3 shadow-lg border text-[8px] font-semibold text-slate-700 transition-all duration-500 h-[140px] flex flex-col justify-between mt-3 w-full ${
                activeStep === 0 ? "scale-[1.02] border-purple-500/50 shadow-purple-500/5 ring-1 ring-purple-500/10" : "border-slate-100 opacity-60"
              }`}>
                <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                  <span className="font-bold text-[#0d1321] text-[8.5px]">Add New Patient</span>
                  <span className="text-[6.5px] text-slate-400">Total: {activeStep >= 1 ? "33" : "32"}</span>
                </div>
                <div className="space-y-1">
                  <div>
                    <label className="text-[6px] text-slate-400 font-bold block">Patient Name</label>
                    <div className="bg-slate-50 border border-slate-100 rounded-md px-1 py-0.5 h-[18px] flex items-center text-slate-800 text-[7px] font-medium">
                      {patientName ? (
                        <span className="font-bold">{patientName}</span>
                      ) : (
                        <span className="text-slate-300">Enter patient name</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-[6px] text-slate-400 font-bold block">Phone Number</label>
                    <div className="bg-slate-50 border border-slate-100 rounded-md px-1 py-0.5 h-[18px] flex items-center text-slate-800 text-[7px] font-medium">
                      {patientPhone ? (
                        <span className="font-bold">{patientPhone}</span>
                      ) : (
                        <span className="text-slate-300">Enter phone number</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className={`w-full text-white rounded-md py-0.5 text-[7px] font-bold shadow-xs transition duration-200 ${
                    step1BtnText === "Token Generated!" ? "bg-emerald-500" : "bg-purple-600"
                  }`}
                >
                  {step1BtnText}
                </button>
              </div>

              {/* Arrow Connector to Next Step */}
              <div className="hidden lg:block absolute top-[14px] -right-3 text-slate-700 z-10">
                <FiChevronRight className="text-base" />
              </div>
              <div className="block md:hidden flex justify-center text-slate-700 py-1">
                <FiChevronDown className="text-base" />
              </div>
            </div>

            {/* STEP 2: Token Generated */}
            <div className="relative flex flex-col gap-3 h-full justify-between w-full max-w-[280px] mx-auto">
              <div className="flex items-center gap-3 text-left">
                <span className={`size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shrink-0 ${
                  activeStep === 1 ? "bg-blue-500 text-white ring-4 ring-blue-500/20" : "bg-[#18233c] text-slate-400"
                }`}>
                  2
                </span>
                <div>
                  <h4 className={`text-sm font-bold transition-colors duration-300 ${activeStep === 1 ? "text-white" : "text-slate-400"}`}>
                    Token Generated
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-normal mt-0.5">
                    Added to the live clinic queue.
                  </p>
                </div>
              </div>

              {/* Step 2 Visual Mockup */}
              <div className={`bg-white rounded-2xl p-3 shadow-lg border text-[8px] font-semibold text-slate-700 transition-all duration-500 h-[140px] flex flex-col justify-between mt-3 w-full ${
                activeStep === 1 ? "scale-[1.02] border-blue-500/50 shadow-blue-500/5 ring-1 ring-blue-500/10" : "border-slate-100 opacity-60"
              }`}>
                {generatedToken ? (
                  <div className="flex flex-col items-center justify-center h-full text-center animate-scale-fade-in">
                    <FiCheckCircle className="text-xl text-emerald-500 mb-1" />
                    <p className="text-[8px] font-extrabold text-slate-800">New Token Generated</p>
                    <p className="text-[6px] text-slate-400 mt-0.5">Your Queue Position</p>
                    
                    <div className="mt-1 size-10 rounded-full bg-blue-55 text-blue-600 flex items-center justify-center text-sm font-black border border-blue-100 shadow-inner">
                      {generatedToken}
                    </div>
                    
                    <div className="mt-1.5 flex items-center justify-between w-full border-t border-slate-100 pt-1 text-[6.5px] text-slate-500 font-bold">
                      <span>Est. Wait Time</span>
                      <span className="text-slate-850">24 min</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                    <div className="size-8 rounded-full border border-dashed border-slate-200 flex items-center justify-center mb-1 text-[10px] font-bold">
                      --
                    </div>
                    <p className="text-[7px] font-bold text-slate-400">Awaiting registration...</p>
                  </div>
                )}
              </div>

              {/* Arrow Connector to Next Step */}
              <div className="hidden lg:block absolute top-[14px] -right-3 text-slate-700 z-10">
                <FiChevronRight className="text-base" />
              </div>
              <div className="block md:hidden flex justify-center text-slate-700 py-1">
                <FiChevronDown className="text-base" />
              </div>
            </div>

            {/* STEP 3: Patients Get Updates */}
            <div className="relative flex flex-col gap-3 h-full justify-between w-full max-w-[280px] mx-auto">
              <div className="flex items-center gap-3 text-left">
                <span className={`size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shrink-0 ${
                  activeStep === 2 ? "bg-blue-500 text-white ring-4 ring-blue-500/20" : "bg-[#18233c] text-slate-400"
                }`}>
                  3
                </span>
                <div>
                  <h4 className={`text-sm font-bold transition-colors duration-300 ${activeStep === 2 ? "text-white" : "text-slate-400"}`}>
                    Patients Get Updates
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-normal mt-0.5">
                    Receive token details & live link.
                  </p>
                </div>
              </div>

              {/* Step 3 Visual Mockup */}
              <div className={`bg-white rounded-2xl p-3 shadow-lg border text-[8px] font-semibold text-slate-700 transition-all duration-500 h-[140px] flex flex-col justify-between mt-3 w-full ${
                activeStep === 2 ? "scale-[1.02] border-blue-500/50 shadow-blue-500/5 ring-1 ring-blue-500/10" : "border-slate-100 opacity-60"
              }`}>
                {whatsappReceived ? (
                  <div className="h-full flex flex-col justify-between animate-scale-fade-in text-left">
                    <div className="bg-[#075e54] text-white p-1 rounded-lg flex items-center justify-between mb-1 shadow-sm shrink-0">
                      <div className="flex items-center gap-1">
                        <span className="size-1 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                        <span className="text-[6.5px] font-bold">Queue Cure Support</span>
                      </div>
                      <span className="text-[5.5px] text-emerald-200 font-semibold">10:30 AM</span>
                    </div>

                    <div className="bg-[#dcf8c6] border border-[#c7ebae] p-1.5 rounded-lg rounded-tl-none relative shadow-xs max-w-[98%] text-left mt-0.5 flex-1 flex flex-col justify-between">
                      <p className="text-[6.5px] text-slate-800 leading-normal font-medium">
                        Your token is <strong className="text-blue-700">#33</strong>. Est. wait time is <strong>24 min</strong>. Track your queue in real-time.
                      </p>
                      
                      <span className="mt-1 block text-center bg-white border border-[#bedea3] text-[#075e54] py-0.5 rounded text-[5.5px] font-bold">
                        View Queue Status
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                    <FiClock className="text-lg text-slate-350 mb-1" />
                    <p className="text-[7px] font-bold text-slate-400">Waiting for updates...</p>
                  </div>
                )}
              </div>

              {/* Arrow Connector to Next Step */}
              <div className="hidden lg:block absolute top-[14px] -right-3 text-slate-700 z-10">
                <FiChevronRight className="text-base" />
              </div>
              <div className="block md:hidden flex justify-center text-slate-700 py-1">
                <FiChevronDown className="text-base" />
              </div>
            </div>

            {/* STEP 4: Doctor Calls Next */}
            <div className="relative flex flex-col gap-3 h-full justify-between w-full max-w-[280px] mx-auto">
              <div className="flex items-center gap-3 text-left">
                <span className={`size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shrink-0 ${
                  activeStep === 3 ? "bg-purple-500 text-white ring-4 ring-purple-500/20" : "bg-[#18233c] text-slate-400"
                }`}>
                  4
                </span>
                <div>
                  <h4 className={`text-sm font-bold transition-colors duration-300 ${activeStep === 3 ? "text-white" : "text-slate-400"}`}>
                    Doctor Calls Next
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-normal mt-0.5">
                    Updates sync instantly for everyone.
                  </p>
                </div>
              </div>

              {/* Step 4 Visual Mockup */}
              <div className={`bg-white rounded-2xl p-3 shadow-lg border text-[8px] font-semibold text-slate-700 transition-all duration-500 h-[140px] flex flex-col justify-between mt-3 w-full ${
                activeStep === 3 ? "scale-[1.02] border-purple-500/50 shadow-purple-500/5 ring-1 ring-purple-500/10" : "border-slate-100 opacity-60"
              }`}>
                <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                  <span className="font-bold text-[#0d1321] text-[8.5px]">Dr. Dashboard</span>
                  <span className="inline-flex items-center gap-0.5 text-[5.5px] bg-emerald-50 text-emerald-600 px-1 rounded-full font-bold">
                    Online
                  </span>
                </div>
                
                {/* Metric Display */}
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 text-center flex-1 flex flex-col justify-center my-1.5">
                  <p className="text-[5.5px] text-slate-400 font-bold uppercase tracking-wider">Current Token</p>
                  <p className="text-base font-black text-slate-800 leading-none mt-0.5" key={doctorToken}>
                    {doctorToken}
                  </p>
                </div>

                <button
                  type="button"
                  className={`w-full text-white bg-blue-500 hover:bg-blue-600 rounded-md py-0.5 text-[7px] font-bold shadow-xs transition duration-205 flex items-center justify-center gap-1 ${
                    activeStep === 3 && doctorToken === 24 ? "scale-[0.97] bg-blue-700 shadow-inner" : ""
                  }`}
                >
                  <FiCheck className="text-[6px]" /> Call Next
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;

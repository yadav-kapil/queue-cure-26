import { useState, useEffect } from "react";
import {
  FiActivity,
  FiBell,
  FiCheck,
  FiClock,
  FiDatabase,
  FiMonitor,
  FiPlus,
  FiUser,
  FiUsers,
} from "react-icons/fi";

const Features = () => {
  const doctorCheckmarks = [
    "Live Queue Overview",
    "Call Next / Skip",
    "Session Analytics",
    "Average Consultation Time",
  ];

  const receptionistCheckmarks = [
    "Add New Patient",
    "Generate Token",
    "Manage Queue",
    "View Doctor Status",
  ];

  // Animation States
  const [currentToken, setCurrentToken] = useState(24);
  const [peopleAhead, setPeopleAhead] = useState(7);
  const [activeRole, setActiveRole] = useState("doctor");
  const [formStep, setFormStep] = useState(0);
  const [totalTokens, setTotalTokens] = useState(32);
  const [waitingTokens, setWaitingTokens] = useState(18);
  const [tokenText, setTokenText] = useState("#32");

  // Smart Wait Time Prediction Workflow States
  const [waitStep, setWaitStep] = useState(0);
  const [waitTime, setWaitTime] = useState(0);
  const [patientsAhead, setPatientsAhead] = useState(7);
  const [ringProgress, setRingProgress] = useState(10);
  const [liveLabelVisible, setLiveLabelVisible] = useState(false);
  const [glowActive, setGlowActive] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [cardOpacity, setCardOpacity] = useState(1);

  // Original UI animations (1, 2, 3)
  useEffect(() => { 
    // 1. Live Queue Tracking Token Loop (slides/counts up every 2s)
    const queueInterval = setInterval(() => {
      setCurrentToken((prev) => {
        if (prev === 24) {
          setPeopleAhead(6);
          return 25;
        }
        if (prev === 25) {
          setPeopleAhead(5);
          return 26;
        }
        setPeopleAhead(7);
        return 24;
      });
    }, 2000);

    // 2. Multi-User Access Sequential Role Highlight Cycle (glows every 2s)
    const roleInterval = setInterval(() => {
      setActiveRole((prev) => {
        if (prev === "doctor") return "receptionist";
        if (prev === "receptionist") return "patient";
        return "doctor";
      });
    }, 2000);

    // 3. Receptionist Token Generator Cycle (auto-fills, pulses, increments every 1.5s)
    const formInterval = setInterval(() => {
      setFormStep((prev) => {
        const next = (prev + 1) % 5;
        if (next === 4) {
          // Token generated successfully
          setTotalTokens(33);
          setWaitingTokens(19);
          setTokenText("#33");
        } else if (next === 0) {
          // Reset fields
          setTotalTokens(32);
          setWaitingTokens(18);
          setTokenText("#32");
        }
        return next;
      });
    }, 1500);

    return () => {
      clearInterval(queueInterval);
      clearInterval(roleInterval);
      clearInterval(formInterval);
    };
  }, []);

  // 4. Smart Wait Time Prediction Workflow Animation timeline
  useEffect(() => {
    let timeouts = [];

    if (waitStep === 0) {
      // Stage 1: Queue Joined
      setWaitTime(0);
      setPatientsAhead(7);
      setRingProgress(10);
      setLiveLabelVisible(false);
      setGlowActive(false);
      setPulseActive(false);
      setShowCheckmark(false);
      setCardOpacity(1);

      // Animate waitTime from 0 to 15
      const duration = 800;
      const steps = 15;
      const stepTime = duration / steps;
      for (let i = 1; i <= steps; i++) {
        timeouts.push(
          setTimeout(() => {
            setWaitTime(i);
          }, i * stepTime)
        );
      }

      // Proceed to stage 2: Live Updates
      timeouts.push(
        setTimeout(() => {
          setWaitStep(1);
        }, 3500)
      );
    } else if (waitStep === 1) {
      // Stage 2: Live Prediction Updates
      setLiveLabelVisible(true);

      // 15 min -> 13 min, 5 ahead, ring progress 35%
      timeouts.push(
        setTimeout(() => {
          setWaitTime(13);
          setPatientsAhead(5);
          setRingProgress(35);
        }, 1200)
      );

      // 13 min -> 10 min, 3 ahead, ring progress 55%
      timeouts.push(
        setTimeout(() => {
          setWaitTime(10);
          setPatientsAhead(3);
          setRingProgress(55);
        }, 2700)
      );

      // Proceed to stage 3: Approaching Turn
      timeouts.push(
        setTimeout(() => {
          setWaitStep(2);
        }, 4700)
      );
    } else if (waitStep === 2) {
      // Stage 3: Approaching Turn (3 min remaining, 1 ahead, glow active)
      setWaitTime(3);
      setPatientsAhead(1);
      setRingProgress(85);
      setGlowActive(true);

      // Proceed to stage 4: Your Turn
      timeouts.push(
        setTimeout(() => {
          setWaitStep(3);
        }, 3500)
      );
    } else if (waitStep === 3) {
      // Stage 4: Your Turn (ring 100%, success checkmark, card pulse)
      setWaitTime(0);
      setPatientsAhead(0);
      setRingProgress(100);
      setShowCheckmark(true);
      setPulseActive(true);

      // Stage 5: Loop Reset (success state fades out, ring resets)
      timeouts.push(
        setTimeout(() => {
          setCardOpacity(0);
        }, 3500)
      );

      timeouts.push(
        setTimeout(() => {
          setWaitStep(0);
        }, 4000)
      );
    }

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [waitStep]);

  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      {/* Header section */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#315cf0] mb-4">
          <span className="inline-block size-1.5 rounded-full bg-[#315cf0]"></span>
          Features
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-[#080b13] sm:text-4xl lg:text-[42px] leading-tight">
          Everything You Need To Run <br className="hidden sm:inline" /> A Modern{" "}
          <span className="text-[#315cf0]">Clinic Queue</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-500 leading-relaxed">
          Powerful tools to simplify queue management, reduce waiting times, and improve patient satisfaction.
        </p>
      </div>

      {/* Grid of features */}
      <div className="mt-14 space-y-6">
        
        {/* Row 1: Live Queue Tracking & Real-Time Sync */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Card 1: Live Queue Tracking (gradient box) */}
          <div className="group relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#779dfc] via-[#3d6bf7] to-[#1f3fba] p-6 text-white shadow-lg lg:col-span-3 lg:p-8 flex flex-col justify-between min-h-[340px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(31,92,240,0.18)] cursor-pointer">
            {/* Background curvy wave line */}
            <div className="absolute bottom-0 left-0 right-0 z-0 opacity-20 pointer-events-none select-none">
              <svg viewBox="0 0 400 100" className="w-full fill-none stroke-white stroke-[2.5]">
                <path d="M 0 50 C 60 20, 100 80, 160 30 C 220 -20, 260 70, 320 40 C 360 20, 380 40, 400 35" />
                <circle cx="320" cy="40" r="5" className="fill-white" />
                <circle cx="320" cy="40" r="10" className="fill-white/30 animate-ping" />
              </svg>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-6 items-center h-full">
              {/* Left Column (Content) */}
              <div>
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-white/20 text-white shadow-inner transition-transform duration-300 group-hover:scale-110">
                  <FiActivity className="text-xl" />
                </span>
                {/* CRITICAL: ONLY LIVE indicator in the entire Features list */}
                <h3 className="mt-5 text-xl font-bold lg:text-2xl flex items-center gap-2">
                  Live Queue Tracking
                  <span className="relative flex size-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
                  </span>
                </h3>
                <p className="mt-3 text-xs lg:text-sm leading-relaxed text-white/90 font-medium">
                  Track token movement instantly across all connected devices without refreshing the page.
                </p>
              </div>

              {/* Right Column (Mockup Display) */}
              <div className="w-full transition-transform duration-300 group-hover:scale-[1.02]">
                {/* Desktop Version (Vertical List) */}
                <div className="hidden md:block bg-white rounded-2xl p-5 text-[#0d1321] shadow-[0_15px_35px_rgba(0,0,0,0.12)] border border-slate-100 max-w-[280px] mx-auto">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="text-xs font-semibold text-slate-500">Current Token</span>
                      <span key={`curr-${currentToken}`} className="text-xl font-bold text-[#315cf0] animate-slide-up-num inline-block">
                        {currentToken}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="text-xs font-semibold text-slate-500">Your Token</span>
                      <span className="text-xl font-bold text-[#3d6bf7]">31</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">People Ahead</span>
                      <span key={`ahead-${peopleAhead}`} className="text-xl font-bold text-emerald-600 animate-slide-up-num inline-block">
                        {peopleAhead}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Version (Horizontal Side-by-Side Cells) */}
                <div className="grid grid-cols-3 gap-2 bg-white/95 backdrop-blur-xs rounded-xl p-3 text-[#0d1321] text-center shadow-md border border-white/20 md:hidden">
                  <div className="flex flex-col items-center justify-center p-1.5 bg-slate-50 rounded-lg">
                    <span key={`m-curr-${currentToken}`} className="text-lg font-bold text-[#315cf0] animate-slide-up-num inline-block">
                      {currentToken}
                    </span>
                    <span className="text-[9px] text-slate-500 font-semibold mt-0.5">Current</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-1.5 bg-slate-50 rounded-lg">
                    <span className="text-lg font-bold text-[#3d6bf7]">31</span>
                    <span className="text-[9px] text-slate-500 font-semibold mt-0.5">Your Token</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-1.5 bg-slate-50 rounded-lg">
                    <span key={`m-ahead-${peopleAhead}`} className="text-lg font-bold text-emerald-600 animate-slide-up-num inline-block">
                      {peopleAhead}
                    </span>
                    <span className="text-[9px] text-slate-500 font-semibold mt-0.5">Ahead</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Real-Time Synchronization */}
          <div className="group rounded-[28px] bg-[#f3f7ff] p-6 text-[#0d1321] shadow-xs lg:col-span-2 lg:p-8 flex flex-col justify-between min-h-[340px] transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer">
            <div>
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#315cf0]/10 text-[#315cf0] transition-transform duration-300 group-hover:scale-110">
                <FiDatabase className="text-xl" />
              </span>
              <h3 className="mt-5 text-lg font-bold sm:text-xl">Real-Time Synchronization</h3>
              <p className="mt-2 text-xs lg:text-sm leading-relaxed text-slate-500 font-medium">
                Every queue update is instantly reflected for doctors, receptionists, and patients.
              </p>
            </div>

            {/* Visual Diagram */}
            <div className="mt-6 relative">
              {/* Desktop Triangular Layout */}
              <div className="hidden lg:block relative h-32 w-full">
                {/* SVGs connect nodes and animate motion of packets */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-slate-300 stroke-[1.5] pointer-events-none select-none">
                  {/* Reception to DB */}
                  <path d="M 50,23 L 50,37" className="stroke-slate-300/80 stroke-dasharray-[2,2] fill-none" />
                  {/* DB to Doctor */}
                  <path d="M 50,68 L 18,75" className="stroke-slate-300/80 stroke-dasharray-[2,2] fill-none" />
                  {/* DB to Patient */}
                  <path d="M 50,68 L 82,75" className="stroke-slate-300/80 stroke-dasharray-[2,2] fill-none" />

                  {/* Traveling packets */}
                  <circle r="1.5" className="fill-[#315cf0]">
                    <animateMotion
                      dur="3s"
                      repeatCount="indefinite"
                      path="M 50,23 L 50,37"
                    />
                  </circle>
                  <circle r="1.5" className="fill-[#3d6bf7]">
                    <animateMotion
                      dur="3s"
                      begin="1.2s"
                      repeatCount="indefinite"
                      path="M 50,68 L 18,75"
                    />
                  </circle>
                  <circle r="1.5" className="fill-emerald-500">
                    <animateMotion
                      dur="3s"
                      begin="1.2s"
                      repeatCount="indefinite"
                      path="M 50,68 L 82,75"
                    />
                  </circle>
                </svg>

                {/* Reception node */}
                <div className="absolute top-[6px] left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-full px-3 py-1 flex items-center gap-1.5 text-[10px] font-bold shadow-xs">
                  <FiUser className="text-slate-500 text-xs" /> Reception
                </div>

                {/* Center DB Icon - Glowing softly */}
                <div className="absolute top-[48px] left-1/2 -translate-x-1/2 size-10 rounded-2xl bg-[#315cf0] text-white flex items-center justify-center shadow-md animate-db-glow">
                  <FiDatabase className="text-base" />
                </div>

                {/* Doctor node */}
                <div className="absolute top-[96px] left-[18%] -translate-x-1/2 bg-white border border-slate-200 rounded-full px-3 py-1 flex items-center gap-1.5 text-[10px] font-bold shadow-xs">
                  <FiUser className="text-slate-500 text-xs" /> Doctor
                </div>

                {/* Patient node */}
                <div className="absolute top-[96px] left-[82%] -translate-x-1/2 bg-white border border-slate-200 rounded-full px-3 py-1 flex items-center gap-1.5 text-[10px] font-bold shadow-xs">
                  <FiUser className="text-slate-500 text-xs" /> Patient
                </div>
              </div>

              {/* Mobile / Tablet Linear Flow */}
              <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow-xs border border-slate-100 lg:hidden">
                <div className="flex items-center gap-1 bg-slate-50 rounded-lg px-2 py-1 text-[10px] font-bold shrink-0">
                  <FiUser className="text-slate-500" /> Rec
                </div>
                
                {/* Connector 1: Rec -> DB */}
                <div className="relative flex-1 h-0.5 bg-slate-100 mx-2 overflow-hidden">
                  <div className="absolute top-1/2 -translate-y-1/2 size-1.5 bg-[#315cf0] rounded-full animate-flow-right-mobile" />
                </div>

                <div className="size-7 bg-[#315cf0] text-white rounded-lg flex items-center justify-center relative animate-db-glow shrink-0">
                  <FiDatabase className="text-xs" />
                </div>

                {/* Connector 2: DB -> Doc */}
                <div className="relative flex-1 h-0.5 bg-slate-100 mx-2 overflow-hidden">
                  <div className="absolute top-1/2 -translate-y-1/2 size-1.5 bg-[#3d6bf7] rounded-full animate-flow-right-mobile" style={{ animationDelay: '0.5s' }} />
                </div>

                <div className="flex items-center gap-1 bg-slate-50 rounded-lg px-2 py-1 text-[10px] font-bold shrink-0">
                  <FiUser className="text-slate-500" /> Doc
                </div>

                {/* Connector 3: Doc -> Pat */}
                <div className="relative flex-1 h-0.5 bg-slate-100 mx-2 overflow-hidden">
                  <div className="absolute top-1/2 -translate-y-1/2 size-1.5 bg-emerald-500 rounded-full animate-flow-right-mobile" style={{ animationDelay: '1s' }} />
                </div>

                <div className="flex items-center gap-1 bg-slate-50 rounded-lg px-2 py-1 text-[10px] font-bold shrink-0">
                  <FiUser className="text-slate-500" /> Pat
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Row 2: AI Predictions, Alerts, and Roles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 3: Smart Wait Time Predictions */}
          <div className="group rounded-[28px] bg-[#f0faf7] p-6 text-[#0d1321] shadow-xs flex flex-col justify-between min-h-[300px] transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer border border-transparent">
            <div>
              <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
                <FiClock className="text-lg" />
              </span>
              <h3 className="mt-5 text-lg font-bold">Smart Wait Time Predictions</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 font-medium">
                AI-powered wait time estimates improve as more consultation data is collected.
              </p>
            </div>

            {/* Clock Progress Visual - Responsive layout */}
            <div
              className={`mt-4 flex flex-col items-center gap-3 transition-all duration-500 ${
                pulseActive ? "animate-card-pulse" : ""
              }`}
              style={{
                opacity: cardOpacity,
              }}
            >
              <div
                className="relative size-24 flex items-center justify-center transition-all duration-500 group-hover:scale-105"
                style={{
                  filter: glowActive ? "drop-shadow(0 0 10px rgba(16,185,129,0.7))" : "none",
                }}
              >
                {/* SVG Conic Progress */}
                <svg className="absolute inset-0 size-full -rotate-90">
                  <circle cx="48" cy="48" r="40" className="stroke-emerald-100/80 stroke-[5] fill-none" />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    className="stroke-emerald-500 stroke-[5] stroke-dasharray-[251] fill-none stroke-linecap-round"
                    style={{
                      strokeDashoffset: 251 - (251 * (ringProgress / 100)),
                      transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                </svg>
                <div className="text-center z-10 flex flex-col items-center justify-center">
                  {showCheckmark ? (
                    <span className="flex items-center justify-center size-10 rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
                      <FiCheck className="text-2.5xl" />
                    </span>
                  ) : (
                    <>
                      <span className="text-2xl font-black text-slate-800 leading-none">
                        {waitTime}
                      </span>
                      <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Min Wait</span>
                    </>
                  )}
                </div>
              </div>

              {/* Status details underneath the progress ring */}
              <div className="h-10 flex flex-col items-center justify-center text-center">
                {showCheckmark ? (
                  <div className="animate-scale-fade-in">
                    <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 justify-center">
                      <span className="inline-block size-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      It's Your Turn
                    </p>
                    <p className="text-[9px] text-slate-500 font-bold mt-0.5">Proceed to Doctor</p>
                  </div>
                ) : (
                  <>
                    <p className="text-[11px] font-bold text-slate-600">
                      {patientsAhead} {patientsAhead === 1 ? "Patient" : "Patients"} Ahead
                    </p>
                    
                    <div className={`transition-all duration-500 mt-1 ${
                      liveLabelVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-1 scale-95 pointer-events-none"
                    }`}>
                      <span className="inline-flex items-center gap-1 text-[8px] text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full font-bold">
                        Updated from live queue
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Card 4: Instant Patient Notifications */}
          <div className="group rounded-[28px] bg-[#fffcf3] p-6 text-[#0d1321] shadow-xs flex flex-col justify-between min-h-[300px] transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer">
            <div>
              <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 transition-transform duration-300 group-hover:scale-110">
                <FiBell className="text-lg" />
              </span>
              <h3 className="mt-5 text-lg font-bold">Instant Patient Notifications</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 font-medium">
                Send real-time updates via WhatsApp, SMS or Email about their queue status.
              </p>
            </div>

            {/* Notification Visual - Floating gently */}
            <div className="mt-6 w-full">
              <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-[0_8px_20px_rgba(0,0,0,0.03)] flex items-start gap-3 max-w-[230px] mx-auto transition-transform duration-300 group-hover:scale-105 animate-float">
                <div className="size-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm relative">
                  {/* Whatsapp icon */}
                  <svg className="size-3 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.975 14.076.953 11.49.953c-5.447 0-9.875 4.371-9.879 9.8.001 1.816.51 3.511 1.474 4.925L2.07 20.147l4.577-1.193z" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <p className="text-[10px] font-bold text-slate-800">Token #25</p>
                  <p className="text-[9px] text-slate-500 mt-0.5">You are next in line. Please approach the doctor.</p>
                  <span className="text-[7px] text-slate-400 font-semibold mt-1 block">Now</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Multi-User Access */}
          <div className="group rounded-[28px] bg-[#fbf7ff] p-6 text-[#0d1321] shadow-xs flex flex-col justify-between min-h-[300px] transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer">
            <div>
              <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 transition-transform duration-300 group-hover:scale-110">
                <FiUsers className="text-lg" />
              </span>
              <h3 className="mt-5 text-lg font-bold">Multi-User Access</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 font-medium">
                Role-based access for doctors, receptionists, and patients with secure login.
              </p>
            </div>

            {/* Badges Visual - Highlights active sequentially */}
            <div className="mt-6 flex flex-col gap-2.5 items-center justify-center w-full">
              <span
                className={`rounded-full border px-4 py-1.5 text-[10px] font-bold tracking-wide transition-all duration-300 w-fit ${
                  activeRole === "doctor"
                    ? "bg-blue-100 border-[#315cf0] text-[#315cf0] scale-105 shadow-[0_0_12px_rgba(49,92,240,0.24)]"
                    : "bg-slate-50/60 border-slate-100 text-slate-400"
                }`}
              >
                Doctor
              </span>
              <span
                className={`rounded-full border px-4 py-1.5 text-[10px] font-bold tracking-wide transition-all duration-300 w-fit ${
                  activeRole === "receptionist"
                    ? "bg-purple-100 border-[#7c3aed] text-[#7c3aed] scale-105 shadow-[0_0_12px_rgba(124,58,237,0.24)]"
                    : "bg-slate-50/60 border-slate-100 text-slate-400"
                }`}
              >
                Receptionist
              </span>
              <span
                className={`rounded-full border px-4 py-1.5 text-[10px] font-bold tracking-wide transition-all duration-300 w-fit ${
                  activeRole === "patient"
                    ? "bg-emerald-100 border-emerald-500 text-emerald-600 scale-105 shadow-[0_0_12px_rgba(16,163,74,0.24)]"
                    : "bg-slate-50/60 border-slate-100 text-slate-400"
                }`}
              >
                Patient
              </span>
            </div>
          </div>

        </div>

        {/* Row 3: Dashboards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card 6: Doctor Dashboard */}
          <div className="group rounded-[28px] bg-[#f3f7ff] p-6 text-[#0d1321] shadow-xs lg:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer">
            
            <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1.3fr] gap-6 items-center">
              <div>
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#315cf0]/10 text-[#315cf0] transition-transform duration-300 group-hover:scale-110">
                  <FiMonitor className="text-xl" />
                </span>
                <h3 className="mt-5 text-xl font-bold">Doctor Dashboard</h3>
                <p className="mt-2 text-xs lg:text-sm leading-relaxed text-slate-500 font-medium">
                  Manage your session, call next token, and monitor queue in real-time.
                </p>
                <ul className="mt-5 space-y-2.5">
                  {doctorCheckmarks.map((text) => (
                    <li key={text} className="flex items-center gap-2 text-[11px] font-bold text-slate-700">
                      <span className="grid size-4 place-items-center rounded-full bg-[#315cf0]/10 text-[#315cf0]">
                        <FiCheck className="text-[10px]" />
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dashboard visual mockup */}
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 text-[8px] font-semibold text-slate-700 w-full max-w-sm mx-auto transition-transform duration-300 group-hover:scale-[1.02] mt-2 md:mt-0">
                {/* Header bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <span className="font-bold text-[#0d1321] text-[9px]">Dr. Dashboard</span>
                  <span className="inline-flex items-center gap-1 text-[7px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full font-bold">
                    <span className="size-1 rounded-full bg-emerald-500"></span> Online
                  </span>
                </div>
                {/* Metric grid */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100/50">
                    <p className="text-[6px] text-slate-400 font-bold">Current Token</p>
                    <p className="text-xs font-bold text-[#0d1321] mt-0.5">24</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100/50">
                    <p className="text-[6px] text-slate-400 font-bold">Waiting</p>
                    <p className="text-xs font-bold text-[#0d1321] mt-0.5">18 Patients</p>
                  </div>
                </div>

                {/* Animated analytics widget chart */}
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100/50 mb-3">
                  <p className="text-[6px] text-slate-400 font-bold mb-1">Session Volume Analytics</p>
                  <div className="flex items-end gap-1 h-7 pt-1.5">
                    <div className="w-1.5 bg-[#315cf0] rounded-t-xs animate-grow-1" />
                    <div className="w-1.5 bg-[#3d6bf7] rounded-t-xs animate-grow-2" />
                    <div className="w-1.5 bg-[#315cf0]/75 rounded-t-xs animate-grow-3" />
                    <div className="w-1.5 bg-[#315cf0]/50 rounded-t-xs animate-grow-4" />
                    <div className="w-1.5 bg-[#3d6bf7] rounded-t-xs animate-grow-5" />
                    <div className="w-1.5 bg-emerald-500 rounded-t-xs animate-grow-6" />
                  </div>
                </div>

                {/* Patient queue table list */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between bg-slate-50/50 p-1.5 rounded-md border border-slate-100/30 animate-fade-row">
                    <span>Token #24 - John Doe</span>
                    <span className="text-[6px] bg-[#315cf0] text-white px-1.5 py-0.5 rounded font-bold">Active</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50/50 p-1.5 rounded-md border border-slate-100/30">
                    <span>Token #25 - Sarah Smith</span>
                    <span className="text-[6px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">Waiting</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Card 7: Receptionist Dashboard */}
          <div className="group rounded-[28px] bg-[#fff5f6] p-6 text-[#0d1321] shadow-xs lg:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer">
            
            <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1.3fr] gap-6 items-center">
              <div>
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-500 transition-transform duration-300 group-hover:scale-110">
                  <FiPlus className="text-xl" />
                </span>
                <h3 className="mt-5 text-xl font-bold">Receptionist Dashboard</h3>
                <p className="mt-2 text-xs lg:text-sm leading-relaxed text-slate-500 font-medium">
                  Add patients, generate tokens, and manage the daily queue efficiently.
                </p>
                <ul className="mt-5 space-y-2.5">
                  {receptionistCheckmarks.map((text) => (
                    <li key={text} className="flex items-center gap-2 text-[11px] font-bold text-slate-700">
                      <span className="grid size-4 place-items-center rounded-full bg-rose-100 text-rose-500">
                        <FiCheck className="text-[10px]" />
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dashboard Form visual mockup with Auto-typing flow */}
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-rose-100/50 text-[8px] font-semibold text-slate-700 w-full max-w-sm mx-auto transition-transform duration-300 group-hover:scale-[1.02] mt-2 md:mt-0">
                {/* Form header */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <p className="font-bold text-[#0d1321] text-[9px] shrink-0">Add New Patient</p>
                    {formStep === 4 && (
                      <span className="text-[6px] text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 font-black uppercase tracking-wider animate-slide-up-num truncate">
                        Success: {tokenText}
                      </span>
                    )}
                  </div>
                  <span className="text-[7px] text-slate-400 shrink-0">Total: {totalTokens}</span>
                </div>
                {/* Form fields */}
                <div className="space-y-2 mb-3">
                  <div>
                    <label className="text-[6px] text-slate-400 font-bold">Patient Name</label>
                    <div className="bg-slate-50 border border-slate-100 rounded-md p-1.5 text-slate-800 text-[7px] mt-0.5 h-6 flex items-center">
                      {formStep >= 1 ? (
                        <span className="animate-slide-up-num">Alice Smith</span>
                      ) : (
                        <span className="text-slate-300">Enter patient name</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-[6px] text-slate-400 font-bold">Phone Number</label>
                    <div className="bg-slate-50 border border-slate-100 rounded-md p-1.5 text-slate-800 text-[7px] mt-0.5 h-6 flex items-center">
                      {formStep >= 2 ? (
                        <span className="animate-slide-up-num">555-0199</span>
                      ) : (
                        <span className="text-slate-300">Enter phone number</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Submit button with pulse animation */}
                <button
                  type="button"
                  className={`w-full text-white rounded-md py-1.5 text-[8px] font-bold shadow-xs transition duration-200 ${
                    formStep === 3
                      ? "scale-95 bg-rose-700 shadow-inner"
                      : formStep === 4
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "bg-rose-500 hover:bg-rose-600"
                  }`}
                >
                  {formStep === 4 ? "Token Generated!" : "Generate Token"}
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Features;

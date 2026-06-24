import React, { useEffect } from "react";
import { useParams } from "react-router";
import { FiClock, FiUsers, FiUser, FiActivity, FiCheck, FiPlay, FiStar } from "react-icons/fi";
import { usePatient } from "../../../hooks/usePatient";
import NoSession from "../../../components/patient/NoSession";
import SessionEnded from "../../../components/patient/SessionEnded";
import SessionComplete from "../../../components/patient/SessionComplete";
import patientDashboardImg from "../../../assets/patient-dashboard.png";
import yourDoctorImg from "../../../assets/your-doctor.png";

const PatientDashboardPage = () => {
  const { trackingId } = useParams();
  const {
    patient,
    session,
    queue,
    isLoading,
    isSessionFound,
    isSessionEnded,
    isSessionCompleted,
    fetchPatientSession,
    connectSocket,
  } = usePatient(trackingId);

  useEffect(() => {
    let cleanupSocket = null;

    const init = async () => {
      const data = await fetchPatientSession();
      if (data && data.session && data.session.status !== "ended") {
        cleanupSocket = connectSocket(data.session._id);
      }
    };

    init();

    return () => {
      if (cleanupSocket) cleanupSocket();
    };
  }, [trackingId, fetchPatientSession, connectSocket]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-500 font-medium animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isSessionFound) {
    return <NoSession />;
  }

  if (isSessionEnded) {
    return <SessionEnded />;
  }

  if (isSessionCompleted) {
    return <SessionComplete />;
  }

  const currentToken = queue?.currentToken || 0;
  const tokenNumber = patient?.tokenNumber || 0;
  
  const patientsAhead = queue?.patients
    ? queue.patients.filter(
        (p) => !p.skipped && !p.consultationEndedAt && p.tokenNumber >= currentToken && p.tokenNumber < tokenNumber
      ).length
    : 0;

  const patientsAheadNotCalled = queue?.patients
    ? queue.patients.filter(
        (p) => !p.skipped && !p.consultationStartedAt && !p.consultationEndedAt && p.tokenNumber > currentToken && p.tokenNumber < tokenNumber
      ).length
    : 0;

  const activeServingCount = (currentToken > 0 && currentToken < tokenNumber) ? 1 : 0;
  const totalPatientsAhead = patientsAheadNotCalled + activeServingCount;

  const averageConsultationTime = (() => {
    if (!queue || !queue.averageConsultationTimeArray || queue.averageConsultationTimeArray.length === 0) return 5;

    const arr = queue.averageConsultationTimeArray;
    const sum = arr.reduce((a, b) => a + b, 0);
    const avg = sum / arr.length;
    return Number(avg.toFixed(1));
  })();

  const avgTimeForCalc = averageConsultationTime;

  const activeQueuePatients = (() => {
    if (!queue || !queue.patients) return [];
    const notDone = queue.patients.filter((p) => !p.consultationEndedAt);
    const current = notDone.find((p) => p.tokenNumber === currentToken);
    const rest = notDone.filter((p) => p.tokenNumber !== currentToken);
    rest.sort((a, b) => a.tokenNumber - b.tokenNumber);
    return current ? [current, ...rest] : rest;
  })();

  const patientIndex = activeQueuePatients.findIndex((p) => p.tokenNumber === tokenNumber);
  const isCurrentlyServing = currentToken === tokenNumber;

  const calculatedWaitTime = isCurrentlyServing
    ? 0
    : patientIndex !== -1
      ? Math.round(patientIndex * avgTimeForCalc)
      : 0;

  const waitTimeStr = `${calculatedWaitTime} Min`;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getEstimatedTimeStr = (offsetMinutes) => {
    const time = new Date();
    time.setMinutes(time.getMinutes() + offsetMinutes);
    let hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "--:--";
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) return "--:--";
    
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const getActivityList = () => {
    const list = [];
    if (!queue?.patients) return [];

    queue.patients.forEach((p) => {
      if (p.tokenNumber > tokenNumber) return;

      const isUser = p.tokenNumber === tokenNumber;

      if (p.joinedAt) {
        list.push({
          tokenNumber: p.tokenNumber,
          status: "Joined",
          time: p.joinedAt,
          isUser: false,
          type: "joined",
        });
      }

      if (isUser) {
        let turnTime = null;
        if (p.consultationStartedAt) {
          turnTime = p.consultationStartedAt;
        } else {
          const waitMin = calculatedWaitTime;
          const estTime = new Date();
          estTime.setMinutes(estTime.getMinutes() + waitMin);
          turnTime = estTime.toISOString();
        }

        list.push({
          tokenNumber: p.tokenNumber,
          status: p.consultationStartedAt ? "Your Turn" : "Upcoming",
          time: turnTime,
          isUser: true,
          type: "your-turn",
        });
      }

      if (p.consultationStartedAt) {
        list.push({
          tokenNumber: p.tokenNumber,
          status: "Called",
          time: p.consultationStartedAt,
          isUser: false,
          type: "called",
        });
      }

      if (p.consultationEndedAt) {
        list.push({
          tokenNumber: p.tokenNumber,
          status: "Completed",
          time: p.consultationEndedAt,
          isUser: false,
          type: "completed",
        });
      }
    });

    list.sort((a, b) => {
      if (a.type === "your-turn") return -1;
      if (b.type === "your-turn") return 1;

      const timeA = new Date(a.time).getTime();
      const timeB = new Date(b.time).getTime();
      if (timeA !== timeB) return timeB - timeA;

      const priority = { "completed": 3, "called": 2, "joined": 1 };
      return (priority[b.type] || 0) - (priority[a.type] || 0);
    });

    return list;
  };

  const startToken = 1;

  let progressPercent = 0;
  if (tokenNumber > 0) {
    const isFinished = patient?.consultationEndedAt || currentToken >= tokenNumber || totalPatientsAhead === 0;
    if (isFinished) {
      if (!patient?.consultationStartedAt && !patient?.consultationEndedAt) {
        progressPercent = 92;
      } else {
        progressPercent = 100;
      }
    } else if (currentToken <= startToken) {
      progressPercent = 0;
    } else {
      const range = tokenNumber - startToken;
      if (range > 0) {
        const calculatedPercent = ((currentToken - startToken) / range) * 100;
        if (!patient?.consultationStartedAt && !patient?.consultationEndedAt && calculatedPercent >= 100) {
          progressPercent = 92;
        } else {
          progressPercent = calculatedPercent;
        }
      } else {
        if (!patient?.consultationStartedAt && !patient?.consultationEndedAt) {
          progressPercent = 92;
        } else {
          progressPercent = 100;
        }
      }
    }
  }

  const doctorName = session?.doctorId?.fullName || "Dr. Yadav";
  const clinicName = session?.doctorId?.clinicName || "--";
  const doctorImageUrl = session?.doctorId?.profileImage || yourDoctorImg;
  const activityList = getActivityList();

  return (
    <div className="min-h-screen bg-slate-50/40 pb-28 pt-24 font-outfit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 xl:col-span-9 space-y-8">
            
            <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-[28px] p-6 sm:p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[290px] shadow-[0_20px_50px_rgba(37,99,235,0.15)]">
              <div className="absolute right-[-40px] top-[-40px] w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
              <div className="absolute right-[120px] bottom-[-20px] w-36 h-36 rounded-full bg-indigo-400/20 blur-2xl pointer-events-none"></div>

              <div className="w-full md:w-3/5 space-y-6 relative z-10">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {getGreeting()}, {patient?.name} 👋
                  </h2>
                  <p className="text-blue-100/80 text-sm mt-1 font-medium">
                    Your appointment is confirmed
                  </p>
                </div>

                <div className="flex items-center gap-8">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200/70">
                      Your Token
                    </span>
                    <div className="text-5xl sm:text-6xl font-black mt-1 tracking-tight">
                      #{tokenNumber}
                    </div>
                  </div>

                  <div className="w-[1px] bg-white/20 h-14 self-end hidden sm:block"></div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200/70">
                      Estimated Wait
                    </span>
                    <div className="flex items-center gap-2.5 mt-2">
                      <FiClock className="text-2xl text-blue-100" />
                      <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        {waitTimeStr}
                      </span>
                    </div>
                    <p className="text-blue-200/60 text-[11px] mt-1.5 font-medium">
                      Stay tuned, we'll notify you
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold text-white/90">
                    <span className={`h-2 w-2 rounded-full ${isCurrentlyServing ? "bg-emerald-400 animate-pulse" : "bg-blue-400"}`}></span>
                    {isCurrentlyServing ? "Serving Now" : "Waiting"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold text-white/90">
                    <FiUser className="text-xs text-blue-200" />
                    {doctorName}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold text-white/90">
                    <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                    Session Active
                  </span>
                </div>
              </div>

              <div className="hidden md:block w-72 h-64 relative z-10 select-none">
                <img 
                  src={patientDashboardImg} 
                  alt="Patient Dashboard Illustration" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-5 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.04)] transition-all duration-300">
                <div className="p-3 bg-blue-100/70 rounded-xl text-blue-600">
                  <FiUser className="text-xl stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Currently Serving</p>
                  <p className="text-2xl font-black text-slate-800 mt-0.5">
                    {currentToken > 0 ? `#${currentToken}` : "None"}
                  </p>
                  <p className="text-[11px] font-semibold text-blue-600 mt-1">In Progress</p>
                </div>
              </div>

              <div className="bg-purple-50/50 border border-purple-100/50 rounded-2xl p-5 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(124,58,237,0.04)] transition-all duration-300">
                <div className="p-3 bg-purple-100/70 rounded-xl text-purple-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Token</p>
                  <p className="text-2xl font-black text-slate-800 mt-0.5">#{tokenNumber}</p>
                  <p className="text-[11px] font-semibold text-purple-600 mt-1">You</p>
                </div>
              </div>

              <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-2xl p-5 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.04)] transition-all duration-300">
                <div className="p-3 bg-indigo-100/70 rounded-xl text-indigo-600">
                  <FiClock className="text-xl stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Wait</p>
                  <p className="text-2xl font-black text-slate-800 mt-0.5">{waitTimeStr}</p>
                  <p className="text-[11px] font-semibold text-indigo-600 mt-1">Approximate</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[300px]">
                <div className="w-full flex items-center gap-2 text-slate-800 font-bold border-b border-slate-50 pb-4 mb-4">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-sm font-semibold tracking-wide uppercase text-slate-500">Queue Progress</span>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center py-4">
                  <div className="w-full mb-6">
                    <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="w-full flex justify-between text-[11px] font-bold text-slate-400 mt-2 px-1">
                      <span>Token #{currentToken > 0 ? currentToken : 1} (current)</span>
                      <span>Token #{tokenNumber} (you)</span>
                    </div>
                  </div>

                  <div className="text-3xl font-black text-slate-800 mb-2">
                    {totalPatientsAhead} <span className="text-slate-400 text-sm font-semibold">Patients Ahead</span>
                  </div>
                  
                  <p className="text-xs font-semibold text-slate-400 text-center mb-2">
                    (Patients ahead of you who are currently waiting or being called)
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[300px]">
                <div className="w-full flex items-center gap-2 text-slate-800 font-bold border-b border-slate-50 pb-4 mb-4">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-sm font-semibold tracking-wide uppercase text-slate-500">Live Queue Activity</span>
                </div>

                <div className="flex-1 flex flex-col gap-3 justify-start py-2 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                  {activityList.map((item) => {
                    const isJoined = item.type === "joined";
                    const isCalled = item.type === "called";
                    const isCompleted = item.type === "completed";
                    const isYourTurn = item.type === "your-turn";
                    
                    return (
                      <div 
                        key={`${item.tokenNumber}-${item.type}`} 
                        className={`flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 ${
                          isYourTurn 
                            ? "bg-indigo-50/70 border border-indigo-100/50 shadow-sm" 
                            : "hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-7 w-7 rounded-full flex items-center justify-center border ${
                            isCompleted 
                              ? "bg-emerald-50 border-emerald-200 text-emerald-500" 
                              : isYourTurn
                                ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                                : isCalled
                                  ? "bg-blue-50 border-blue-200 text-blue-500"
                                  : "bg-slate-50 border-slate-200 text-slate-400"
                          }`}>
                            {isCompleted ? (
                              <FiCheck className="text-sm stroke-[3]" />
                            ) : isYourTurn ? (
                              <FiStar className="text-sm fill-white stroke-[2]" />
                            ) : isCalled ? (
                              <FiPlay className="text-xs fill-current stroke-[2] ml-0.5" />
                            ) : (
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                            )}
                          </div>

                          <span className={`text-sm font-bold ${item.isUser ? "text-indigo-900" : "text-slate-700"}`}>
                            Token #{item.tokenNumber} {item.isUser && "(You)"}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-semibold">
                          <span className={`${
                            isCompleted 
                              ? "text-slate-400" 
                              : isYourTurn
                                ? "text-indigo-600"
                                : isCalled
                                  ? "text-blue-500"
                                  : "text-slate-400"
                          }`}>
                            {item.status}
                          </span>
                          <span className="text-slate-400 font-medium min-w-[70px] text-right">
                            {formatTime(item.time)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col items-center">
              <h3 className="w-full text-left text-sm font-bold tracking-wide uppercase text-slate-400 border-b border-slate-50 pb-4 mb-6">
                Your Doctor
              </h3>

              <div className="relative group mb-4">
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-[8px] opacity-40 group-hover:opacity-70 transition-all duration-300"></div>
                <div className="h-28 w-28 rounded-full border-4 border-slate-50 overflow-hidden shadow-md relative z-10">
                  <img 
                    src={doctorImageUrl} 
                    alt={doctorName} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = yourDoctorImg;
                    }}
                  />
                </div>
              </div>

              <h4 className="text-xl font-extrabold text-slate-800 tracking-tight text-center">{doctorName}</h4>

              <div className="w-full mt-8 space-y-4">
                <div className="flex justify-between items-center py-2.5 border-b border-slate-50 text-xs font-semibold">
                  <span className="text-slate-400">Doctor Name</span>
                  <span className="text-slate-800 font-bold text-right truncate max-w-[150px]">
                    {session?.doctorId?.fullName || "--"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-slate-50 text-xs font-semibold">
                  <span className="text-slate-400">Session Started At</span>
                  <span className="text-slate-800 font-bold">
                    {formatTime(session?.startedAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5 text-xs font-semibold">
                  <span className="text-slate-400">Clinic Name</span>
                  <span className="text-slate-800 font-bold text-right truncate max-w-[150px]">
                    {session?.doctorId?.clinicName || "--"}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-y-0 -translate-x-1/2 z-20 w-[90%] max-w-sm animate-fade-in-up">
        <div className="bg-white/95 backdrop-blur-md border border-slate-100/80 shadow-[0_15px_35px_rgba(0,0,0,0.12)] rounded-full py-3.5 px-6 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div>
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Token</p>
              <p className="text-sm font-bold text-slate-800">#{tokenNumber}</p>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-slate-100"></div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FiClock className="text-sm stroke-[2.5]" />
            </div>
            <div>
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Est. Wait</p>
              <p className="text-sm font-bold text-slate-800">{waitTimeStr}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboardPage;

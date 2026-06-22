import React, { useEffect } from "react";
import { useParams } from "react-router";
import { FiClock, FiUsers, FiUser, FiActivity } from "react-icons/fi";
import { usePatient } from "../../../hooks/usePatient";
import NoSession from "../../../components/patient/NoSession";
import SessionEnded from "../../../components/patient/SessionEnded";
import patientDashboardImg from "../../../assets/patient-dashboard.png";

const PatientDashboardPage = () => {
  const { trackingId } = useParams();
  const {
    patient,
    session,
    queue,
    isLoading,
    setIsLoading,
    isSessionFound,
    isSessionEnded,
    fetchPatientSession,
    connectSocket,
  } = usePatient(trackingId);

  useEffect(() => {
    let cleanupSocket = null;

    const init = async () => {
      const data = await fetchPatientSession();
      if (data && data.session) {
        cleanupSocket = connectSocket(data.session._id);
      }
    };

    init();
    setIsLoading(false);

    return () => {
      if (cleanupSocket) cleanupSocket();
    };
  }, [trackingId, fetchPatientSession, connectSocket]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-500 font-medium animate-pulse">Loading dashboard...</p>
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

  // Calculate current queue position
  let position = 0;
  if (queue && patient) {
    // Number of unskipped patients ahead of this patient whose token is >= currentToken
    const currentToken = queue.currentToken || 0;
    position = queue.patients.filter(
      (p) => !p.skipped && !p.consultationEndedAt && p.tokenNumber >= currentToken && p.tokenNumber < patient.tokenNumber
    ).length + 1; // +1 to include themselves

    // If current token is greater than their token, they missed it or are currently being seen
    if (patient.tokenNumber < currentToken) {
        position = 0; // It's their turn or they missed it
    }
  }

  const waitTimeStr = queue?.estimatedWaitTime 
    ? `${queue.estimatedWaitTime} min` 
    : "Calculating...";

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-outfit">
      {/* Top Banner Image */}
      <div className="w-full h-64 md:h-80 relative overflow-hidden bg-blue-900">
        <img 
          src={patientDashboardImg} 
          alt="Clinic Dashboard" 
          className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          onError={(e) => {
            // Fallback gradient if image not found
            e.target.style.display = 'none';
            e.target.parentElement.classList.add('bg-gradient-to-r', 'from-blue-800', 'to-indigo-900');
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 drop-shadow-md">
            Hello, {patient?.name}
          </h1>
          <p className="text-gray-800 font-medium mt-2 text-lg drop-shadow">
            {session?.doctorId?.clinicName || "Clinic Queue Status"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* Main Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Your Token */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 flex flex-col items-center justify-center transform transition-all hover:-translate-y-1 hover:shadow-2xl">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FiUser className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-gray-500 font-medium mb-1">Your Token</p>
            <p className="text-5xl font-black text-gray-900">{patient?.tokenNumber}</p>
          </div>

          {/* Current Serving */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 flex flex-col items-center justify-center transform transition-all hover:-translate-y-1 hover:shadow-2xl">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FiActivity className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-gray-500 font-medium mb-1">Currently Serving</p>
            <p className="text-5xl font-black text-gray-900">{queue?.currentToken || '-'}</p>
          </div>

          {/* Wait Time */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 border border-blue-500 flex flex-col items-center justify-center text-white transform transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/30">
            <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
              <FiClock className="h-6 w-6 text-white" />
            </div>
            <p className="text-blue-100 font-medium mb-1">Est. Wait Time</p>
            <p className="text-4xl font-bold">{waitTimeStr}</p>
          </div>

        </div>

        {/* Doctor & Queue Info */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-5 bg-gray-50/50">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FiUsers className="mr-2 text-blue-500" />
              Queue Information
            </h3>
          </div>
          <div className="p-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Doctor</dt>
                <dd className="mt-1 text-base text-gray-900 font-medium">{session?.doctorId?.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Specialization</dt>
                <dd className="mt-1 text-base text-gray-900">{session?.doctorId?.specialization || "General"}</dd>
              </div>
              
              <div className="sm:col-span-2 mt-4">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-blue-900">Your Position</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {position === 0 
                        ? patient?.tokenNumber < (queue?.currentToken || 0) 
                          ? "You may have missed your turn." 
                          : "It is currently your turn!"
                        : `${position - 1} patients ahead of you`
                      }
                    </p>
                  </div>
                  <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-inner border-2 border-blue-200">
                    <span className="text-2xl font-black text-blue-600">#{position}</span>
                  </div>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboardPage;

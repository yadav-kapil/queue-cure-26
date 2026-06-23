import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import {
  FiActivity,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiGrid,
  FiUser,
  FiUsers,
  FiCalendar,
  FiRadio,
  FiAlertCircle,
  FiLogOut
} from 'react-icons/fi'
import recHero from '../../assets/rec-dashboard.png'
import { useAuth } from '../../context/auth/AuthContext'
import { useSession } from '../../context/session/SessionContext'
import { useRec } from '../../hooks/useRec'
import RecHandleDoc from '../../components/app/rec/RecHandleDoc'
import { fetchSession } from '../../services/sessionService'
import Loading from '../../components/common/Loading'
import ErrorDialog from '../../components/common/Error'

const DashboardRec = () => {
  const { user } = useAuth()
  const { session, queue, isSessionActive, dispatch } = useSession()
  const { leaveSession, hasHired, sessionLoading, sessionLoadingMessage } = useRec()
  const navigate = useNavigate()
  
  const [elapsedMinutes, setElapsedMinutes] = useState(0)
  const [lastSyncSeconds, setLastSyncSeconds] = useState(0)
  const [connectLoading, setConnectLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const handleConnectSession = async () => {
    try {
      setConnectLoading(true)
      setErrorMsg(null)
      const data = await fetchSession(dispatch)
      if (!data || !data.session) {
        setErrorMsg("Doctor is not active.")
      }
    } catch (err) {
      setErrorMsg("Failed to connect session. Please verify that the doctor has started the session.")
    } finally {
      setConnectLoading(false)
    }
  }

  const handleLeaveSession = async () => {
    try {
      setErrorMsg(null)
      await leaveSession()
    } catch (err) {
      setErrorMsg(err.message || "Failed to leave the session.")
    }
  }

  // Track session duration
  useEffect(() => {
    if (!isSessionActive || !session?.startedAt) return

    const start = new Date(session.startedAt).getTime()
    const updateElapsed = () => {
      const elapsed = Math.max(0, Math.floor((Date.now() - start) / 60000))
      setElapsedMinutes(elapsed)
    }

    updateElapsed()
    const timer = setInterval(updateElapsed, 30000)
    return () => clearInterval(timer)
  }, [isSessionActive, session?.startedAt])

  // Track last sync time (simulated ticker or based on session context updates)
  useEffect(() => {
    setLastSyncSeconds(0)
    const syncTimer = setInterval(() => {
      setLastSyncSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(syncTimer)
  }, [queue])

  // Filter patients: only show patients who are NOT done (consultationEndedAt is empty)
  const activeQueuePatients = useMemo(() => {
    if (!queue || !queue.patients) return []
    
    // Filter out completed consultations
    const notDone = queue.patients.filter((p) => !p.consultationEndedAt)
    
    // Arrange properly: current patient (tokenNumber === queue.currentToken) at the top
    const current = notDone.find((p) => p.tokenNumber === queue.currentToken)
    const rest = notDone.filter((p) => p.tokenNumber !== queue.currentToken)
    
    // Sort rest by token number (ascending)
    rest.sort((a, b) => a.tokenNumber - b.tokenNumber)
    
    return current ? [current, ...rest] : rest
  }, [queue])

  const currentPatient = useMemo(() => {
    if (!queue || !queue.patients) return null
    return queue.patients.find((p) => p.tokenNumber === queue.currentToken) || null
  }, [queue])

  // Next Patient is the first waiting patient in the queue
  const nextPatient = useMemo(() => {
    if (!queue || !queue.patients) return null
    
    // Next patient is the first one after the current token that is not completed and not skipped
    const waiting = queue.patients.filter(
      (p) => p.tokenNumber > queue.currentToken && !p.skipped && !p.consultationEndedAt
    )
    return waiting.length > 0 ? waiting[0] : null
  }, [queue])

  const waitingPatientsCount = useMemo(() => {
    if (!queue || !queue.patients) return 0
    return queue.patients.filter(
      (p) => p.tokenNumber > queue.currentToken && !p.skipped && !p.consultationEndedAt
    ).length
  }, [queue])

  const completedPatientsCount = useMemo(() => {
    if (!queue || !queue.patients) return 0
    return queue.patients.filter((p) => p.consultationEndedAt).length
  }, [queue])

  const averageConsultationTime = useMemo(() => {
    if (!queue || !queue.patients || queue.patients.length === 0) return null

    const completed = queue.patients.filter(
      (p) => p.consultationStartedAt && p.consultationEndedAt
    )

    if (completed.length === 0) return null

    const totalMs = completed.reduce((sum, p) => {
      const start = new Date(p.consultationStartedAt).getTime()
      const end = new Date(p.consultationEndedAt).getTime()
      return sum + Math.max(0, end - start)
    }, 0)

    const averageMs = totalMs / completed.length
    const averageMinutes = averageMs / 60000 // Convert milliseconds to minutes

    return Number(averageMinutes.toFixed(1))
  }, [queue])

  const statCards = [
    {
      title: 'Patients Waiting',
      value: !isSessionActive ? '0' : `${waitingPatientsCount}`,
      helper: 'In Queue',
      icon: FiUsers,
      color: 'text-[#5b5ff7]',
      bg: 'bg-[#f2f0ff]',
    },
    {
      title: 'Completed',
      value: !isSessionActive ? '0' : `${completedPatientsCount}`,
      helper: 'Today',
      icon: FiCheckCircle,
      color: 'text-[#22c55e]',
      bg: 'bg-[#ecfdf5]',
    },
    {
      title: 'Avg. Wait Time',
      value: !isSessionActive || averageConsultationTime === null ? '--' : `${averageConsultationTime} min`,
      helper: 'Today',
      icon: FiClock,
      color: 'text-[#f59e0b]',
      bg: 'bg-[#fff7ed]',
    },
    {
      title: 'Total Patients',
      value: !isSessionActive ? '0' : `${queue?.patients?.length || 0}`,
      helper: 'Today',
      icon: FiCalendar,
      color: 'text-[#2459ff]',
      bg: 'bg-[#eef4ff]',
    },
  ]

  const formatTime = (dateStr) => {
    if (!dateStr) return '--:--'
    const date = new Date(dateStr)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const remaining = minutes % 60
    return hours ? `${hours}h ${remaining}m` : `${remaining}m`
  }

  const doctorName = session?.doctorId?.fullName || user?.associatedDoctorId?.fullName || 'Doctor'
  const clinicName = session?.doctorId?.clinicName || user?.associatedDoctorId?.clinicName || 'Clinic'

  return (
    <>
      {connectLoading && <Loading message="Connecting to live session..." />}
      {sessionLoading && <Loading message={sessionLoadingMessage || "Leaving current session..."} />}
      {errorMsg && (
        <ErrorDialog
          heading="Connection Error"
          message={errorMsg}
          onClose={() => setErrorMsg(null)}
        />
      )}
      <section className="space-y-5 sm:space-y-6">
      <div className="grid gap-5 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Welcome Hero Banner */}
        <article className="relative min-h-[240px] sm:min-h-[280px] overflow-hidden rounded-[28px] sm:rounded-[32px] bg-gradient-to-br from-[#5b5ff7] via-[#346dff] to-[#5ab7ff] p-5 sm:p-8 text-white shadow-[0_16px_38px_rgba(77,124,254,0.18)]">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22),transparent_62%)]" />
          <div className="relative z-10 sm:max-w-[58%]">
            <p className="text-xs sm:text-sm font-semibold text-white/80">Queue Management Console</p>
            <h1 className="mt-3 sm:mt-4 text-2xl sm:text-4xl font-extrabold leading-tight">
              Good Morning,
              <span className="block mt-1 truncate pr-2">
                {user?.fullName ? `Rec. ${user.fullName.split(' ')[0]}` : 'Receptionist'}
              </span>
            </h1>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-white/90 hidden sm:block">
              Ready to manage today&apos;s appointments and guide patients smoothly through their consultation journey.
            </p>
            <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
              {!isSessionActive ? (
                <button
                  type="button"
                  onClick={handleConnectSession}
                  className="inline-flex h-10 sm:h-12 items-center gap-2 sm:gap-3 rounded-full bg-white px-4 sm:px-6 text-xs sm:text-sm font-bold text-[#2459ff] shadow-[0_12px_25px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,42,0.15)] cursor-pointer"
                >
                  <FiRadio className="h-4 w-4 sm:h-5 sm:w-5" />
                  Connect Session
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('/rec/manage-patient')}
                  className="inline-flex h-10 sm:h-12 items-center gap-2 sm:gap-3 rounded-full bg-white px-4 sm:px-6 text-xs sm:text-sm font-bold text-[#2459ff] shadow-[0_12px_25px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,42,0.15)] cursor-pointer"
                >
                  <FiUsers className="h-4 w-4 sm:h-5 sm:w-5" />
                  Manage Patients
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate('/rec/history')}
                className="inline-flex h-10 sm:h-12 items-center gap-2 sm:gap-3 rounded-full bg-white/15 px-4 sm:px-6 text-xs sm:text-sm font-bold text-white ring-1 ring-white/30 transition hover:bg-white/20 cursor-pointer"
              >
                History
                <FiArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
          <img
            src={recHero}
            alt="Receptionist illustration"
            className="absolute bottom-0 right-3 hidden h-[90%] max-w-[42%] object-cover sm:block rounded-[20px]"
          />
        </article>

        {/* Doctor Association Handler */}
        <RecHandleDoc />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <article
              key={card.title}
              className="rounded-[20px] sm:rounded-[24px] border border-[#e5eaf4] bg-white p-4 sm:p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-[#5b6478] truncate">{card.title}</p>
                  <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-extrabold text-[#07122f]">{card.value}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">{card.helper}</p>
                </div>
                <span className={`grid h-10 w-10 sm:h-12 sm:w-12 shrink-0 place-items-center rounded-xl sm:rounded-2xl ${card.bg} ${card.color} shadow-xs`}>
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
              </div>
            </article>
          )
        })}
      </div>

      {/* Main Content Layout */}
      <div className="grid gap-5 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Left Column: Current Queue Table */}
        <article className="rounded-[28px] border border-[#e5eaf4] bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef4ff] text-[#2459ff]">
                <FiActivity className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-extrabold text-[#07122f]">Current Queue</h2>
                <p className="text-xs font-semibold text-slate-400">Live clinical snapshot</p>
              </div>
            </div>
            {isSessionActive && (
              <span className="rounded-full bg-[#eef4ff] px-3.5 py-1 text-xs font-extrabold text-[#2459ff]">
                {activeQueuePatients.length} Patients Waiting
              </span>
            )}
          </div>

          {!isSessionActive ? (
            <div className="rounded-2xl border border-dashed border-[#d7e1f0] bg-[#f8fbff] py-12 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#2459ff] shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
                <FiRadio className="h-6 w-6 text-slate-400" />
              </span>
              <h3 className="mt-4 text-base font-extrabold text-[#07122f]">No Active Session</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#6b7280]">
                Once your associated doctor starts their session, you will see the active queue here.
              </p>
            </div>
          ) : activeQueuePatients.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#d7e1f0] bg-[#f8fbff] py-12 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#2459ff] shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
                <FiUsers className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-extrabold text-[#07122f]">Queue is Empty</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#6b7280]">
                Add patients to the queue from the Manage Patient tab to start the clinic session.
              </p>
              <button
                onClick={() => navigate('/rec/manage-patient')}
                className="mt-4 inline-flex h-9 items-center justify-center rounded-xl bg-[#2459ff] px-4 text-xs font-bold text-white hover:bg-[#1a44cc] transition cursor-pointer"
              >
                Add First Patient
              </button>
            </div>
          ) : (
            <div>
              {/* Mobile: Card layout */}
              <div className="space-y-3 md:hidden">
                {activeQueuePatients.map((patient, index) => {
                  const avgTimeForCalc = averageConsultationTime !== null && averageConsultationTime > 0 ? averageConsultationTime : 5
                  const isCurrent = patient.tokenNumber === queue.currentToken
                  const waitTimeEst = isCurrent ? '0 min' : `${Math.round(index * avgTimeForCalc)} min`
                  let statusText = isCurrent ? 'Next' : patient.skipped ? 'Skipped' : 'Waiting'
                  let statusClass = isCurrent ? 'bg-[#ecfdf5] text-[#16a34a]' : patient.skipped ? 'bg-red-50 text-red-600' : 'bg-[#fff7ed] text-[#f59e0b]'

                  return (
                    <div
                      key={patient.tokenNumber}
                      className={`rounded-2xl border p-3.5 transition ${
                        isCurrent ? 'border-[#c7d8ff] bg-[#f4f7ff]' : 'border-slate-100 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`text-sm font-black shrink-0 ${isCurrent ? 'text-[#2459ff]' : 'text-slate-400'}`}>
                            #{patient.tokenNumber}
                          </span>
                          <span className="text-sm font-extrabold text-[#07122f] truncate">{patient.name}</span>
                        </div>
                        <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${statusClass}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {statusText}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-500">
                        {patient.code && <span>OTP: <span className="text-[#07122f] font-bold">{patient.code}</span></span>}
                        {(patient.age || patient.gender) && <span>{patient.age ? `${patient.age}y` : ''}{patient.age && patient.gender ? ' / ' : ''}{patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : ''}</span>}
                        <span className={isCurrent ? 'text-[#16a34a] font-bold' : ''}>Wait: {waitTimeEst}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Desktop: Table layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4">Token</th>
                      <th className="py-3.5 px-4">Patient Name</th>
                      <th className="py-3.5 px-4">OTP</th>
                      <th className="py-3.5 px-4">Age / Gender</th>
                      <th className="py-3.5 px-4">Wait Time</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/60">
                    {activeQueuePatients.map((patient, index) => {
                      const avgTimeForCalc = averageConsultationTime !== null && averageConsultationTime > 0 ? averageConsultationTime : 5
                      const isCurrent = patient.tokenNumber === queue.currentToken
                      const waitTimeEst = isCurrent ? '0 min' : `${Math.round(index * avgTimeForCalc)} min`
                      let statusText = isCurrent ? 'Next' : patient.skipped ? 'Skipped' : 'Waiting'
                      let statusClass = isCurrent ? 'bg-[#ecfdf5] text-[#16a34a]' : patient.skipped ? 'bg-red-50 text-red-600' : 'bg-[#fff7ed] text-[#f59e0b]'

                      return (
                        <tr
                          key={patient.tokenNumber}
                          className={`transition hover:bg-slate-50/70 ${isCurrent ? 'bg-[#f4f7ff]/40 font-bold' : ''}`}
                        >
                          <td className="py-3.5 px-4">
                            <span className={`text-sm font-extrabold ${isCurrent ? 'text-[#2459ff]' : 'text-slate-500'}`}>#{patient.tokenNumber}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-sm font-extrabold text-[#07122f]">{patient.name}</span>
                          </td>
                          <td className="py-3.5 px-4 text-sm font-semibold text-slate-600">{patient.code || '--'}</td>
                          <td className="py-3.5 px-4">
                            <span className="text-sm font-semibold text-slate-500">
                              {patient.age ? `${patient.age} / ` : ''}{patient.gender ? (patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)) : '--'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`text-sm font-semibold ${isCurrent ? 'text-[#16a34a] font-bold' : 'text-slate-500'}`}>{waitTimeEst}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${statusClass}`}>
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {statusText}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 text-center border-t border-slate-100 pt-4">
                <button
                  onClick={() => navigate('/rec/manage-patient')}
                  className="text-sm font-extrabold text-[#2459ff] hover:text-[#1a44cc] hover:underline cursor-pointer"
                >
                  View Full Queue
                </button>
              </div>
            </div>
          )}
        </article>

        {/* Right Column: Session Overview & Next Patient */}
        <aside className="space-y-6">
          {/* Session Overview Card */}
          <article className="rounded-[28px] border border-[#e5eaf4] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            <h2 className="text-lg font-extrabold text-[#07122f] mb-4">Session Overview</h2>
            
            <div className="space-y-3.5">
              <div className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-4 py-3">
                <span className="text-sm font-bold text-[#5b6478]">Session Status</span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-extrabold ${isSessionActive ? 'bg-[#ecfdf5] text-[#16a34a]' : 'bg-slate-100 text-slate-500'}`}>
                  {isSessionActive ? 'Active' : 'Offline'}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-4 py-3">
                <span className="text-sm font-bold text-[#5b6478]">Doctor</span>
                <span className="text-sm font-extrabold text-[#07122f] truncate max-w-[180px]">
                  Dr. {doctorName.replace(/^Dr\.\s*/i, "")}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-4 py-3">
                <span className="text-sm font-bold text-[#5b6478]">Started At</span>
                <span className="text-sm font-extrabold text-[#07122f]">
                  {isSessionActive && session?.startedAt ? formatTime(session.startedAt) : '--:--'}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-4 py-3">
                <span className="text-sm font-bold text-[#5b6478]">Duration</span>
                <span className="text-sm font-extrabold text-[#07122f]">
                  {isSessionActive ? formatDuration(elapsedMinutes) : '0m'}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-4 py-3">
                <span className="text-sm font-bold text-[#5b6478]">Connected To</span>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-extrabold ${isSessionActive ? 'border-emerald-200 text-emerald-600 bg-emerald-50/20' : 'border-slate-200 text-slate-500 bg-slate-55'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${isSessionActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {isSessionActive ? 'Connected' : 'Offline'}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-4 py-3">
                <span className="text-sm font-bold text-[#5b6478]">Last Sync</span>
                <span className="text-sm font-semibold text-slate-500">
                  {lastSyncSeconds}s ago
                </span>
              </div>
            </div>

            {isSessionActive && (
              <button
                type="button"
                onClick={handleLeaveSession}
                className="mt-4 w-full flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white text-red-500 hover:bg-[#fff5f5] transition text-xs font-extrabold cursor-pointer"
              >
                <FiLogOut className="h-4 w-4" />
                Leave Session
              </button>
            )}
          </article>

          {/* Next Patient Card */}
          {isSessionActive && (
            <article className="rounded-[28px] border border-emerald-100 bg-[#f4fbf8] p-5 shadow-[0_12px_45px_rgba(34,197,94,0.04)]">
              <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-sm mb-4">
                <FiUser className="h-5 w-5" />
                <span>Next Patient</span>
              </div>
              
              {nextPatient ? (
                <div className="space-y-4">
                  <div className="text-center bg-white rounded-2xl p-4 border border-emerald-100/60 shadow-xs">
                    <span className="block text-3xl font-black text-emerald-500">
                      #{nextPatient.tokenNumber}
                    </span>
                    <h3 className="mt-2 text-lg font-black text-[#07122f] truncate">
                      {nextPatient.name}
                    </h3>
                    <p className="mt-1 text-xs font-bold text-slate-400">
                      {nextPatient.age ? `${nextPatient.age} Yrs / ` : ''}{nextPatient.gender ? (nextPatient.gender.charAt(0).toUpperCase() + nextPatient.gender.slice(1)) : '--'}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#5b6478]">
                    <FiClock className="h-4 w-4 text-emerald-500" />
                    <span>In Queue for ~{waitingPatientsCount * 5} min</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs font-bold leading-normal">
                  <FiAlertCircle className="mx-auto h-7 w-7 mb-2 text-emerald-400" />
                  No upcoming patients in queue
                </div>
              )}
            </article>
          )}
        </aside>
      </div>
    </section>
    </>
  )
}

export default DashboardRec

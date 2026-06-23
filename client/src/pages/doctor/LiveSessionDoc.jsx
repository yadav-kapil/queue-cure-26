import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  FiCheckCircle,
  FiClock,
  FiFlag,
  FiPhoneCall,
  FiPlay,
  FiRadio,
  FiSkipForward,
  FiStopCircle,
  FiUser,
  FiUsers,
  FiWifi,
} from 'react-icons/fi'
import { useSession } from '../../context/session/SessionContext'
import { useDoc } from '../../hooks/useDoc'

const LiveSessionDoc = () => {
  const { session, queue, isSessionActive } = useSession()
  const { goLive, callNextPatient, skipCurrentPatient, completeCurrentPatient, endSession } = useDoc()
  const navigate = useNavigate()

  const [elapsedMinutes, setElapsedMinutes] = useState(0)

  // Track session duration since starting
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

  // Extract receptionist details
  const receptionist = useMemo(() => {
    if (!session || !session.receptionistId) return null
    return {
      name: session.receptionistId.fullName || session.receptionistId.username,
      connectedAt: session.receptionistId.connectedAt || new Date(session.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  }, [session])

  // Map currently serving patient
  const currentPatient = useMemo(() => {
    if (!queue || !queue.patients || !queue.currentToken) return null
    const patient = queue.patients.find((p) => p.tokenNumber === queue.currentToken)
    if (!patient) return null
    
    return {
      token: patient.tokenNumber,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      arrivalTime: formatTime(patient.joinedAt),
      queuePosition: queue.patients.filter((p) => !p.consultationEndedAt && p.tokenNumber < patient.tokenNumber).length + 1,
    }
  }, [queue])

  // Map waiting patients
  const waitingPatients = useMemo(() => {
    if (!queue || !queue.patients) return []
    return queue.patients
      .filter((p) => !p.consultationStartedAt && !p.consultationEndedAt && !p.skipped)
      .map((p) => ({
        id: p.tokenNumber,
        token: p.tokenNumber,
        name: p.name,
        arrivalTime: formatTime(p.joinedAt),
        status: 'Waiting',
      }))
  }, [queue])

  // Combine current patient and waiting patients for the main queue list
  const patientsQueue = useMemo(() => {
    const list = []
    
    // Add current patient at the top of the queue if active
    if (currentPatient) {
      list.push({
        id: currentPatient.token,
        token: currentPatient.token,
        name: currentPatient.name,
        arrivalTime: currentPatient.arrivalTime,
        status: 'Serving',
        isCurrent: true,
      })
    }
    
    // Add waiting patients
    waitingPatients.forEach((p) => {
      list.push({
        ...p,
        isCurrent: false,
      })
    })
    
    return list
  }, [currentPatient, waitingPatients])

  // Map skipped patients
  const skippedPatients = useMemo(() => {
    if (!queue || !queue.patients) return []
    return queue.patients.filter((p) => p.skipped)
  }, [queue])

  // Map completed patients
  const completedPatients = useMemo(() => {
    if (!queue || !queue.patients) return []
    return queue.patients.filter((p) => p.consultationEndedAt && !p.skipped)
  }, [queue])

  // Map completed patients with time details for listing
  const completedPatientsList = useMemo(() => {
    if (!queue || !queue.patients) return []
    return queue.patients
      .filter((p) => p.consultationEndedAt && !p.skipped)
      .map((p) => ({
        id: p.tokenNumber,
        token: p.tokenNumber,
        name: p.name,
        completedTime: formatTime(p.consultationEndedAt),
        status: 'Completed',
      }))
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

  const queueSummary = useMemo(() => {
    const avgTimeForCalc = averageConsultationTime !== null && averageConsultationTime > 0 ? averageConsultationTime : 5
    const estimatedRemainingMinutes = Math.round(waitingPatients.length * avgTimeForCalc)
    const finishBy = estimatedRemainingMinutes
      ? new Date(Date.now() + estimatedRemainingMinutes * 60000).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '--:--'

    return {
      estimatedRemainingMinutes,
      finishBy,
    }
  }, [waitingPatients.length, averageConsultationTime])

  if (!isSessionActive) {
    return (
      <section className="grid min-h-[calc(100vh-180px)] place-items-center">
        <article className="w-full max-w-xl rounded-[28px] border border-[#e5eaf4] bg-white p-8 text-center shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#eef4ff] text-[#2459ff]">
            <FiRadio className="h-9 w-9" />
          </span>
          <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.01em] text-[#07122f]">
            You are currently offline.
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#6b7280]">
            Start your consultation session to begin accepting patients and managing the active queue.
          </p>
          <button
            type="button"
            onClick={goLive}
            className="mt-8 inline-flex h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#5b5ff7] to-[#4d9eff] px-10 font-bold text-white shadow-[0_14px_30px_rgba(77,124,254,0.26)] transition hover:-translate-y-0.5 cursor-pointer"
          >
            <FiPlay className="h-5 w-5" />
            Go Live
          </button>
        </article>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          {/* Top Row: Active Session & Receptionist Status */}
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Active Session Info */}
            <article className="flex flex-col justify-center rounded-[24px] border border-[#dff7e9] bg-[#f4fbf8] p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xl font-extrabold text-[#07122f]">
                    <span className="h-3 w-3 rounded-full bg-[#22c55e]" />
                    Online
                  </div>
                  <p className="mt-2 text-xs font-bold text-[#5b6478]">
                    Started {formatTime(session?.startedAt)} <span className="px-2">.</span> Duration {formatDuration(elapsedMinutes)}
                  </p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dff7e9] text-[#22c55e] shadow-[0_8px_16px_rgba(34,197,94,0.12)]">
                  <FiWifi className="h-6 w-6" />
                </span>
              </div>
            </article>

            {/* Active Receptionist Connection info */}
            <article className="flex flex-col justify-center rounded-[24px] border border-[#e5eaf4] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
              {receptionist ? (
                <div className="flex items-center gap-4 text-left">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eef4ff] text-[#2459ff] shadow-xs">
                    <FiUser className="h-8 w-8" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#5b6478]">Receptionist</p>
                    <h2 className="mt-1 text-lg font-extrabold text-[#07122f]">{receptionist.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-[#16a34a]">Online . Connected {receptionist.connectedAt}</p>
                  </div>
                </div>
              ) : (
                <EmptyState
                  compact
                  icon={FiUser}
                  title="Waiting for receptionist..."
                  text="Connection details will appear here once a receptionist joins the session."
                />
              )}
            </article>
          </div>

          {/* Current Patient Banner */}
          <article className="rounded-[28px] border border-[#e5eaf4] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="rounded-[24px] bg-gradient-to-br from-[#5b5ff7] to-[#4d9eff] p-6 text-white">
              <span className="rounded-full bg-white/18 px-3 py-1 text-xs font-bold">Current Patient</span>
              <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-extrabold">{currentPatient ? `Token #${currentPatient.token}` : 'No active patient'}</h1>
                  <p className="mt-2 text-xl font-semibold text-white/90">{currentPatient?.name || 'Call next patient when queue has arrivals'}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <InfoPill label={currentPatient?.age ? `Age ${currentPatient.age}` : 'Age --'} />
                    <InfoPill label={currentPatient?.gender ? (currentPatient.gender.charAt(0).toUpperCase() + currentPatient.gender.slice(1)) : 'Gender --'} />
                    <InfoPill label={currentPatient?.arrivalTime ? `Arrived ${currentPatient.arrivalTime}` : 'Arrival --'} />
                    <InfoPill label={currentPatient?.queuePosition ? `Position ${currentPatient.queuePosition}` : 'Position --'} />
                  </div>
                </div>
                <span className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-white/92 text-[#4d7cfe]">
                  <FiUser className="h-12 w-12" />
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-4">
              <ActionButton label="Call Next" icon={FiPhoneCall} onClick={callNextPatient} disabled={!waitingPatients.length} primary />
              <ActionButton label="Mark Completed" icon={FiCheckCircle} onClick={completeCurrentPatient} disabled={!currentPatient} />
              <ActionButton label="Skip Patient" icon={FiSkipForward} onClick={skipCurrentPatient} disabled={!currentPatient} />
              <ActionButton label="End Session" icon={FiStopCircle} onClick={endSession} danger />
            </div>
          </article>

          {/* Mini Metrics list */}
          <div className="grid gap-4 sm:grid-cols-3">
            <MiniMetric label="Patients Waiting" value={waitingPatients.length} icon={FiUsers} tone="green" />
            <MiniMetric label="Average Wait Time" value={completedPatients.length === 0 ? '--' : `${averageConsultationTime} min`} icon={FiClock} tone="blue" />
            <MiniMetric label="Estimated Finish Time" value={queueSummary.finishBy} icon={FiFlag} tone="orange" />
          </div>
        </div>

        <aside className="space-y-5">
          {/* Session Records */}
          <article className="rounded-[24px] border border-[#e5eaf4] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <h2 className="text-lg font-extrabold text-[#07122f]">Session Records</h2>
            <div className="mt-4 grid gap-3">
              <RecordLine label="Completed" value={completedPatients.length} tone="green" />
              <RecordLine label="Skipped" value={skippedPatients.length} tone="orange" />
              <RecordLine label="Remaining" value={queueSummary.estimatedRemainingMinutes ? `${queueSummary.estimatedRemainingMinutes} min` : '--'} tone="blue" />
            </div>
          </article>

          {/* Up Next & Queue Progress Card */}
          <article className="rounded-[24px] border border-[#e5eaf4] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <h2 className="text-lg font-extrabold text-[#07122f]">Up Next</h2>
            
            {/* Next Patient Info */}
            <div className="mt-4">
              {waitingPatients.length > 0 ? (
                <div className="flex items-center justify-between rounded-2xl bg-[#f8fbff] p-4 border border-[#eef4ff]">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 font-black text-blue-600 text-sm">
                      #{waitingPatients[0].token}
                    </span>
                    <div className="text-left">
                      <h3 className="text-sm font-extrabold text-[#07122f]">{waitingPatients[0].name}</h3>
                      <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Arrived {waitingPatients[0].arrivalTime}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-100/40">
                    Next
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/50 p-4 border border-emerald-100/40 text-left">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
                    <FiCheckCircle className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-emerald-800">Queue is Clear</h3>
                    <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">No patients waiting</p>
                  </div>
                </div>
              )}
            </div>

            {/* Queue Progress Bar */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              {(() => {
                const total = queue?.patients ? queue.patients.length : 0;
                
                // Find highest token that has started or completed consultation
                const servedPatients = queue?.patients 
                  ? queue.patients.filter((p) => p.consultationStartedAt || p.consultationEndedAt)
                  : [];
                const lastActiveOrCompletedToken = servedPatients.length > 0
                  ? Math.max(...servedPatients.map((p) => p.tokenNumber))
                  : 0;

                const current = Math.max(queue?.currentToken || 0, lastActiveOrCompletedToken);
                const allCalled = total > 0 && waitingPatients.length === 0;
                const pct = allCalled
                  ? 100
                  : total > 0
                    ? Math.min(100, Math.round((current / total) * 100))
                    : 0;
                return (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-left">
                      <span className="text-slate-500">Queue Progress</span>
                      <span className="text-[#07122f]">{allCalled ? "100%" : `Token #${current} of ${total} (${pct}%)`}</span>
                    </div>
                    {/* The small progress bar */}
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          </article>
        </aside>
      </div>

      {/* Enhanced Viewport Full-Width (divided equally) Patients Lists */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Patients Queue List (including Current Patient) */}
        <article className="flex flex-col h-[400px] rounded-[24px] border border-[#e5eaf4] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between gap-4 shrink-0 border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <FiUsers className="h-4.5 w-4.5" />
              </span>
              <h2 className="text-lg font-extrabold text-[#07122f]">Patients Queue</h2>
            </div>
            <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-bold text-[#2459ff]">
              {patientsQueue.length} total
            </span>
          </div>

          {patientsQueue.length === 0 ? (
            <div className="flex-1 overflow-y-auto">
              <EmptyState
                icon={FiUsers}
                title="Queue is empty"
                text="Patients added by the receptionist will appear here with token, arrival time, and status."
              />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-slate-200">
              {patientsQueue.map((patient) => {
                const isCurrent = patient.isCurrent;
                return (
                  <div
                    key={patient.token}
                    className={`grid grid-cols-[40px_minmax(0,1fr)_75px_70px] sm:grid-cols-[60px_minmax(0,1fr)_90px_90px] gap-2 sm:gap-3 rounded-2xl px-3 sm:px-4 py-3 items-center transition duration-200 ${
                      isCurrent
                        ? "bg-blue-50/70 border-l-4 border-l-blue-600 shadow-xs"
                        : "bg-white hover:bg-slate-50/80 border-l-4 border-l-transparent"
                    }`}
                  >
                    <span className={`font-extrabold text-xs sm:text-sm ${isCurrent ? "text-blue-600" : "text-slate-400"}`}>
                      #{patient.token}
                    </span>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`text-sm sm:text-[15px] font-bold truncate ${isCurrent ? "text-blue-900" : "text-slate-700"}`}>
                        {patient.name}
                      </span>
                      {isCurrent && (
                        <span className="animate-pulse inline-block size-1.5 rounded-full bg-blue-500 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-[#6b7280] text-right sm:text-left">
                      {patient.arrivalTime}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 sm:px-3 sm:py-1 text-center text-[10px] sm:text-[11px] font-bold ${
                        isCurrent
                           ? "bg-blue-100 text-blue-700 border border-blue-200/40"
                           : "bg-amber-50 text-amber-600 border border-amber-100/40"
                      }`}
                    >
                      {patient.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </article>
 
        {/* Completed Patients Queue List */}
        <article className="flex flex-col h-[400px] rounded-[24px] border border-[#e5eaf4] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between gap-4 shrink-0 border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <FiCheckCircle className="h-4.5 w-4.5" />
              </span>
              <h2 className="text-lg font-extrabold text-[#07122f]">Completed Patients</h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#10b981]">
              {completedPatientsList.length} completed
            </span>
          </div>
 
          {completedPatientsList.length === 0 ? (
            <div className="flex-1 overflow-y-auto">
              <EmptyState
                icon={FiCheckCircle}
                title="No completed patients yet"
                text="Completed patient consultations will be listed here with token, completion time, and status."
              />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-slate-200">
              {completedPatientsList.map((patient) => (
                <div
                  key={patient.token}
                  className="grid grid-cols-[40px_minmax(0,1fr)_70px_24px] sm:grid-cols-[60px_minmax(0,1fr)_90px_90px] gap-2 sm:gap-3 rounded-2xl bg-white hover:bg-slate-50/80 border-l-4 border-l-transparent px-3 sm:px-4 py-3 items-center transition duration-200"
                >
                  <span className="font-extrabold text-xs sm:text-sm text-emerald-600">
                    #{patient.token}
                  </span>
                  <span className="text-sm sm:text-[15px] font-bold text-slate-700 truncate">
                    {patient.name}
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold text-[#6b7280] text-right sm:text-left">
                    {patient.completedTime}
                  </span>
                  <span className="hidden sm:block rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100/40 px-3 py-1 text-center text-[11px] font-bold">
                    {patient.status}
                  </span>
                  <span className="sm:hidden flex items-center justify-center text-emerald-650 shrink-0">
                    <FiCheckCircle className="h-5 w-5 text-emerald-600" />
                  </span>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  )
}

const formatTime = (dateStr) => {
  if (!dateStr) return '--:--'
  const date = new Date(dateStr)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const formatDuration = (minutes) => {
  if (!minutes) return '0 min'
  const hours = Math.floor(minutes / 60)
  const remaining = minutes % 60
  return hours ? `${hours}h ${remaining}m` : `${remaining} min`
}

const InfoPill = ({ label }) => (
  <span className="rounded-full bg-white/16 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/20">
    {label}
  </span>
)

const ActionButton = ({ label, icon: Icon, onClick, disabled = false, primary = false, danger = false }) => {
  const colorClass = primary
    ? 'bg-gradient-to-r from-[#5b5ff7] to-[#4d9eff] text-white shadow-[0_12px_24px_rgba(77,124,254,0.2)] hover:shadow-[0_14px_30px_rgba(77,124,254,0.25)]'
    : danger
      ? 'border border-[#fecaca] bg-white text-[#ef4444] hover:bg-[#fff1f2]'
      : 'border border-[#e5eaf4] bg-white text-[#111827] hover:border-[#4d7cfe] hover:text-[#2459ff]'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-14 items-center justify-center gap-2 rounded-2xl text-sm font-extrabold transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${colorClass} cursor-pointer`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  )
}

const MiniMetric = ({ icon: Icon, label, value, tone }) => {
  const toneClass = {
    green: 'text-[#22c55e] bg-[#ecfdf5]',
    blue: 'text-[#2459ff] bg-[#eef4ff]',
    orange: 'text-[#f59e0b] bg-[#fff7ed]',
  }[tone]

  return (
    <div className="rounded-[20px] border border-[#e5eaf4] bg-white p-4 shadow-[0_8px_26px_rgba(15,23,42,0.05)]">
      <div className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${toneClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs font-bold text-[#5b6478]">{label}</p>
      <p className="mt-1 truncate text-2xl font-extrabold text-[#07122f]">{value}</p>
    </div>
  )
}

const RecordLine = ({ label, value, tone }) => {
  const dotClass = {
    green: 'bg-[#22c55e]',
    orange: 'bg-[#f59e0b]',
    blue: 'bg-[#2459ff]',
  }[tone]

  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-4 py-4">
      <span className="flex items-center gap-2 text-sm font-bold text-[#6b7280]">
        <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
        {label}
      </span>
      <span className="text-lg font-extrabold text-[#07122f]">{value}</span>
    </div>
  )
}

const StatusLine = ({ label }) => (
  <div className="flex items-center gap-3 rounded-2xl bg-[#f8fbff] px-4 py-3">
    <FiCheckCircle className="h-5 w-5 text-[#22c55e]" />
    <span className="text-sm font-bold text-[#111827]">{label}</span>
  </div>
)

const EmptyState = ({ icon: Icon, title, text, compact = false }) => (
  <div className={`${compact ? 'py-2 text-left' : 'mt-5 rounded-[20px] border border-dashed border-[#d7e1f0] bg-[#f8fbff] px-5 py-8 text-center'}`}>
    <span className={`${compact ? 'mb-4' : 'mx-auto'} grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#2459ff] shadow-[0_8px_22px_rgba(15,23,42,0.06)]`}>
      <Icon className="h-6 w-6" />
    </span>
    <h3 className="text-base font-extrabold text-[#07122f]">{title}</h3>
    <p className={`${compact ? '' : 'mx-auto'} mt-2 max-w-xs text-sm leading-6 text-[#6b7280]`}>{text}</p>
  </div>
)

export default LiveSessionDoc

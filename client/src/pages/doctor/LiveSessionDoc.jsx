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
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Active Session Info */}
          <article className="rounded-[24px] border border-[#dff7e9] bg-[#f4fbf8] p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xl font-extrabold text-[#07122f]">
                  <span className="h-3 w-3 rounded-full bg-[#22c55e]" />
                  Online
                </div>
                <p className="mt-2 text-sm font-semibold text-[#5b6478]">
                  Started {formatTime(session?.startedAt)} <span className="px-2">.</span> Duration {formatDuration(elapsedMinutes)}
                </p>
              </div>
              <FiWifi className="h-8 w-8 text-[#22c55e]" />
            </div>
          </article>

          {/* Active Receptionist Connection info */}
          <article className="rounded-[24px] border border-[#e5eaf4] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
            {receptionist ? (
              <div className="flex items-center gap-4">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#eef4ff] text-[#2459ff]">
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

        {/* Upcoming Patients Queue List */}
        <article className="rounded-[24px] border border-[#e5eaf4] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-extrabold text-[#07122f]">Upcoming Patients Queue</h2>
            <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-bold text-[#2459ff]">{waitingPatients.length} waiting</span>
          </div>

          {waitingPatients.length === 0 ? (
            <EmptyState
              icon={FiUsers}
              title="Queue is empty"
              text="Patients added by the receptionist will appear here with token, arrival time, and status."
            />
          ) : (
            <div className="mt-4 max-h-[360px] space-y-3 overflow-y-auto pr-1">
              {waitingPatients.map((patient) => (
                <div key={patient.token} className="grid gap-3 rounded-2xl border border-[#e5eaf4] px-4 py-3 sm:grid-cols-[90px_minmax(0,1fr)_100px_90px] sm:items-center">
                  <span className="font-extrabold text-[#2459ff]">#{patient.token}</span>
                  <span className="font-bold text-[#111827]">{patient.name}</span>
                  <span className="text-sm font-semibold text-[#6b7280]">{patient.arrivalTime}</span>
                  <span className="rounded-full bg-[#fff7ed] px-3 py-1 text-center text-xs font-bold text-[#f59e0b]">{patient.status}</span>
                </div>
              ))}
            </div>
          )}
        </article>
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

        {/* Permissions / Status Info */}
        <article className="rounded-[24px] border border-[#e5eaf4] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <h2 className="text-lg font-extrabold text-[#07122f]">Allowed Here</h2>
          <div className="mt-4 space-y-3">
            <StatusLine label="Call next patient" />
            <StatusLine label="Mark consultation complete" />
            <StatusLine label="Skip patient" />
            <StatusLine label="End active session" />
          </div>
        </article>
      </aside>
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

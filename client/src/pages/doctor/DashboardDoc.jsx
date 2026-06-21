import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  FiActivity,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiFlag,
  FiPlay,
  FiRadio,
  FiUser,
  FiUsers,
} from 'react-icons/fi'
import doctorHero from '../../assets/doctor-hero.png'
import { useAuth } from '../../context/auth/AuthContext'
import { useSession } from '../../context/session/SessionContext'
import { useDoc } from '../../hooks/useDoc'
import DocHandleRec from '../../components/app/doctor/DocHandleRec'

const DashboardDoc = () => {
  const { user } = useAuth()
  const { session, queue, isSessionActive } = useSession()
  const { goLive } = useDoc()
  const navigate = useNavigate()
  const [activity] = useState([])

  const currentPatient = useMemo(() => {
    if (!queue || !queue.patients) return null
    return queue.patients.find((p) => p.tokenNumber === queue.currentToken) || null
  }, [queue])

  const waitingPatients = useMemo(() => {
    if (!queue || !queue.patients) return []
    return queue.patients.filter(
      (p) => p.tokenNumber > queue.currentToken && !p.skipped && !p.consultationEndedAt
    )
  }, [queue])

  const completedPatients = useMemo(() => {
    if (!queue || !queue.patients) return []
    return queue.patients.filter((p) => p.consultationEndedAt)
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

  const queueStats = useMemo(() => {
    if (!isSessionActive || !queue) {
      return {
        estimatedRemainingMinutes: '--',
        finishBy: '--:--',
        totalPatients: '--',
      }
    }
    
    // Calculate remaining patients (waiting patients + 1 for the current patient being served)
    const remainingPatientsCount = waitingPatients.length + (currentPatient ? 1 : 0)
    const avgTimeForCalc = averageConsultationTime !== null ? averageConsultationTime : 5
    const estimatedRemainingMinutes = remainingPatientsCount * avgTimeForCalc
    
    // Calculate estimated finish time relative to the current actual time
    const finishBy = estimatedRemainingMinutes
      ? new Date(Date.now() + estimatedRemainingMinutes * 60000).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '--:--'

    return {
      estimatedRemainingMinutes,
      finishBy,
      totalPatients: queue.patients ? queue.patients.length : 0,
    }
  }, [isSessionActive, queue, waitingPatients.length, currentPatient, averageConsultationTime])

  const statCards = [
    {
      title: 'Current Patient',
      value: !isSessionActive ? '--' : (currentPatient ? `Token #${currentPatient.tokenNumber}` : 'No active token'),
      helper: !isSessionActive ? 'No active session' : (currentPatient?.name || 'Not being served'),
      icon: FiUser,
      color: 'text-[#2459ff]',
      bg: 'bg-[#eef4ff]',
    },
    {
      title: 'Patients Waiting',
      value: !isSessionActive ? '--' : `${waitingPatients.length} Waiting`,
      helper: !isSessionActive ? 'No active session' : 'Total in queue',
      icon: FiUsers,
      color: 'text-[#22c55e]',
      bg: 'bg-[#ecfdf5]',
    },
    {
      title: 'Patients Completed',
      value: !isSessionActive ? '--' : `${completedPatients.length} Completed`,
      helper: !isSessionActive ? 'No active session' : 'Today',
      icon: FiCheckCircle,
      color: 'text-[#22c55e]',
      bg: 'bg-[#ecfdf5]',
    },
    {
      title: 'Average Consultation Time',
      value: !isSessionActive || averageConsultationTime === null ? '--' : `${averageConsultationTime} Minutes`,
      helper: !isSessionActive ? 'No active session' : 'Current estimate',
      icon: FiClock,
      color: 'text-[#5b5ff7]',
      bg: 'bg-[#f2f0ff]',
    },
  ]

  return (
    <section className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <article className="relative min-h-[280px] overflow-hidden rounded-[24px] bg-gradient-to-br from-[#5b5ff7] via-[#346dff] to-[#5ab7ff] p-6 text-white shadow-[0_16px_38px_rgba(77,124,254,0.22)] sm:p-8">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22),transparent_62%)]" />
          <div className="relative z-10 max-w-[640px] sm:max-w-[58%]">
            <p className="text-sm font-semibold text-white/82">Today&apos;s Queue Overview</p>
            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
              Good Morning,
              <span className="block">
                {user?.fullName ? `Dr. ${user.fullName.replace(/^Dr\.\s*/i, "")}` : "Doctor"}
              </span>
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/16 px-4 py-2 text-xs font-bold">
                <span className={`h-2.5 w-2.5 rounded-full ${isSessionActive ? 'bg-[#22c55e]' : 'bg-white/70'}`} />
                Session: {isSessionActive ? 'Active' : 'Offline'}
              </div>
              {isSessionActive && (
                <div className="inline-flex items-center gap-2 rounded-full bg-white/16 px-4 py-2 text-xs font-bold">
                  <span className={`h-2.5 w-2.5 rounded-full ${session?.receptionistId ? 'bg-[#22c55e]' : 'bg-red-400'}`} />
                  Receptionist: {session?.receptionistId ? 'Online' : 'Not Joined'}
                </div>
              )}
            </div>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/85">
              See the clinic snapshot, queue health, estimated timing, and latest activity before moving into the live workspace.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={isSessionActive ? () => navigate('/doctor/live-session') : goLive}
                className="inline-flex h-12 items-center gap-3 rounded-full bg-white px-6 text-sm font-bold text-[#2459ff] shadow-[0_12px_25px_rgba(15,23,42,0.14)] transition hover:-translate-y-0.5 cursor-pointer"
              >
                {isSessionActive ? <FiRadio className="h-5 w-5" /> : <FiPlay className="h-5 w-5" />}
                {isSessionActive ? 'Resume Session' : 'Go Live'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/doctor/live-session')}
                className="inline-flex h-12 items-center gap-3 rounded-full bg-white/14 px-6 text-sm font-bold text-white ring-1 ring-white/30 transition hover:bg-white/20 cursor-pointer"
              >
                View Live Session
                <FiArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <img
            src={doctorHero}
            alt=""
            className="absolute bottom-0 right-3 hidden h-[94%] max-w-[42%] object-contain sm:block"
          />
        </article>

        <DocHandleRec />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <article
              key={card.title}
              className="rounded-[18px] border border-[#e5eaf4] bg-white p-4 shadow-[0_8px_26px_rgba(15,23,42,0.05)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[#111827]">{card.title}</p>
                  <p className="mt-4 text-2xl font-extrabold text-[#07122f]">{card.value}</p>
                  <p className="mt-1 text-sm text-[#5b6478]">{card.helper}</p>
                </div>
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${card.bg} ${card.color}`}>
                  <Icon className="h-6 w-6" />
                </span>
              </div>
            </article>
          )
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <article className="rounded-[20px] border border-[#e5eaf4] bg-white p-5 shadow-[0_8px_26px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-extrabold text-[#07122f]">Queue Insights</h2>
            <FiActivity className="h-5 w-5 text-[#2459ff]" />
          </div>
          <div className="mt-4 grid gap-3">
            <SummaryRow
              icon={FiUsers}
              label="Total Patients Today"
              value={queueStats.totalPatients === '--' ? '--' : `${queueStats.totalPatients} Patients`}
            />
            <SummaryRow
              icon={FiClock}
              label="Estimated Remaining Time"
              value={queueStats.estimatedRemainingMinutes === '--' ? '--' : `${queueStats.estimatedRemainingMinutes} min`}
              success
            />
            <SummaryRow icon={FiFlag} label="Estimated Finish Time" value={queueStats.finishBy} />
          </div>
        </article>

        <article className="rounded-[20px] border border-[#e5eaf4] bg-white p-5 shadow-[0_8px_26px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-extrabold text-[#07122f]">Recent Activity Timeline</h2>
            <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-bold text-[#2459ff]">{activity.length} updates</span>
          </div>

          {activity.length === 0 ? (
            <EmptyState
              icon={FiActivity}
              title="No activity yet"
              text="Session started, receptionist joined, token called, and completed patient events will appear here."
            />
          ) : (
            <div className="mt-4 space-y-3">
              {activity.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-[#f8fbff] px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#2459ff]" />
                  <span className="flex-1 text-sm font-semibold text-[#111827]">{item.label}</span>
                  <span className="text-xs font-semibold text-[#6b7280]">{item.time}</span>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  )
}

const SummaryRow = ({ icon: Icon, label, value, success = false }) => (
  <div className="flex items-center gap-3 rounded-2xl bg-[#f8fbff] px-4 py-3">
    <span className={`grid h-10 w-10 place-items-center rounded-xl ${success ? 'bg-[#ecfdf5] text-[#22c55e]' : 'bg-[#eef4ff] text-[#2459ff]'}`}>
      <Icon className="h-5 w-5" />
    </span>
    <span className="flex-1 text-sm font-bold text-[#5b6478]">{label}</span>
    <span className="text-base font-extrabold text-[#07122f]">{value}</span>
  </div>
)

const EmptyState = ({ icon: Icon, title, text }) => (
  <div className="mt-5 rounded-[20px] border border-dashed border-[#d7e1f0] bg-[#f8fbff] px-5 py-8 text-center">
    <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#2459ff] shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
      <Icon className="h-6 w-6" />
    </span>
    <h3 className="mt-4 text-base font-extrabold text-[#07122f]">{title}</h3>
    <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#6b7280]">{text}</p>
  </div>
)

export default DashboardDoc

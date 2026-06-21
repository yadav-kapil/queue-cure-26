import { useMemo, useState } from 'react'
import {
  FiCalendar,
  FiCheckCircle,
  FiDownload,
  FiFilter,
  FiSearch,
  FiUser,
  FiAlertCircle,
} from 'react-icons/fi'
import { useSession } from '../../context/session/SessionContext'

const HistoryDoc = () => {
  const { queue, isSessionActive } = useSession()
  const [searchTerm, setSearchTerm] = useState('')

  // Retrieve completed consultations (consultationEndedAt is present and skipped is false)
  const completedConsultations = useMemo(() => {
    if (!queue || !queue.patients) return []
    return queue.patients.filter((p) => p.consultationEndedAt && !p.skipped)
  }, [queue])

  // Filter completed consultations based on search term
  const filteredConsultations = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return completedConsultations

    return completedConsultations.filter((consultation) => {
      return (
        consultation.name.toLowerCase().includes(query) ||
        consultation.tokenNumber.toString().includes(query)
      )
    })
  }, [completedConsultations, searchTerm])

  const formatTime = (dateStr) => {
    if (!dateStr) return '--:--'
    const date = new Date(dateStr)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getDuration = (start, end) => {
    if (!start || !end) return '--'
    const diffMs = new Date(end).getTime() - new Date(start).getTime()
    const diffMins = Math.max(0, Math.floor(diffMs / 60000))
    return `${diffMins} min`
  }

  const averageDuration = useMemo(() => {
    const completed = completedConsultations.filter(
      (p) => p.consultationStartedAt && p.consultationEndedAt
    )
    if (completed.length === 0) return '-- min'
    const totalMs = completed.reduce((sum, p) => {
      const start = new Date(p.consultationStartedAt).getTime()
      const end = new Date(p.consultationEndedAt).getTime()
      return sum + Math.max(0, end - start)
    }, 0)
    const averageMs = totalMs / completed.length
    const averageMinutes = Math.round(averageMs / 60000)
    return `${averageMinutes} min`
  }, [completedConsultations])

  const latestToken = useMemo(() => {
    if (completedConsultations.length === 0) return '--'
    const sorted = [...completedConsultations].sort(
      (a, b) => new Date(b.consultationEndedAt).getTime() - new Date(a.consultationEndedAt).getTime()
    )
    return `#${sorted[0].tokenNumber}`
  }, [completedConsultations])

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase text-[#2459ff]">History Page</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.01em] text-[#07122f] sm:text-4xl">
            Completed Consultations
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7280]">
            Review all patient consultation logs completed during the active session.
          </p>
        </div>

        <button
          type="button"
          disabled={!completedConsultations.length}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#5b5ff7] to-[#4d9eff] px-6 font-bold text-white shadow-[0_12px_24px_rgba(77,124,254,0.2)] transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 cursor-pointer"
        >
          <FiDownload className="h-5 w-5" />
          Export Logs
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Left Column: Log Table */}
        <article className="rounded-[24px] border border-[#e5eaf4] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-3 md:flex-row">
            <label className="relative flex-1">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search patient name or token number..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-[#f8fbff] pl-12 pr-4 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-slate-400 focus:border-[#2459ff] focus:bg-white"
              />
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                className="grid h-12 w-12 place-items-center rounded-2xl border border-[#e5eaf4] text-[#2459ff] transition hover:border-[#2459ff] hover:bg-[#eef4ff]"
                aria-label="Filter consultations"
              >
                <FiFilter className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="grid h-12 w-12 place-items-center rounded-2xl border border-[#e5eaf4] text-[#2459ff] transition hover:border-[#2459ff] hover:bg-[#eef4ff]"
                aria-label="Pick date"
              >
                <FiCalendar className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[20px] border border-[#e5eaf4]">
            <div className="grid grid-cols-[120px_minmax(160px,1fr)_150px_150px] bg-[#f8fbff] px-5 py-3 text-xs font-extrabold uppercase text-[#6b7280] max-lg:hidden">
              <span>Token</span>
              <span>Patient Name</span>
              <span>Duration</span>
              <span>Completed At</span>
            </div>

            {!isSessionActive ? (
              <div className="px-5 py-14 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-50 text-slate-400 border border-slate-100">
                  <FiAlertCircle className="h-7 w-7" />
                </span>
                <h2 className="mt-4 text-xl font-extrabold text-[#07122f]">
                  No Active Session
                </h2>
                <p className="mt-2 text-sm text-[#6b7280] max-w-sm mx-auto">
                  Historical consultations will display here once the live session starts processing patients.
                </p>
              </div>
            ) : filteredConsultations.length === 0 ? (
              <div className="px-5 py-14 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#eef4ff] text-[#2459ff]">
                  <FiCheckCircle className="h-7 w-7" />
                </span>
                <h2 className="mt-4 text-xl font-extrabold text-[#07122f]">
                  {searchTerm ? 'No search results found' : 'No completed consultations yet'}
                </h2>
                <p className="mt-2 text-sm text-[#6b7280] max-w-sm mx-auto">
                  {searchTerm ? 'Try searching another patient name or token number.' : 'Completed patient tokens will appear here after they are marked as done in the live session.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#e5eaf4]">
                {filteredConsultations.map((consultation) => (
                  <div
                    key={consultation.tokenNumber}
                    className="grid gap-3 px-5 py-4 text-sm font-semibold text-[#111827] lg:grid-cols-[120px_minmax(160px,1fr)_150px_150px] lg:items-center"
                  >
                    <span className="font-extrabold text-[#2459ff]">#{consultation.tokenNumber}</span>
                    <span className="font-bold text-[#07122f]">{consultation.name}</span>
                    <span className="text-slate-500 font-semibold">{getDuration(consultation.consultationStartedAt, consultation.consultationEndedAt)}</span>
                    <span className="text-slate-500 font-semibold">{formatTime(consultation.consultationEndedAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </article>

        {/* Right Column: Sidebar Stats */}
        <aside className="space-y-5">
          <article className="rounded-[24px] border border-[#e5eaf4] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <h2 className="text-lg font-extrabold text-[#07122f] mb-4">History Summary</h2>
            <div className="mt-4 grid gap-3">
              <HistoryMetric label="Completed Today" value={`${completedConsultations.length} Patients`} />
              <HistoryMetric label="Average Duration" value={averageDuration} />
              <HistoryMetric label="Latest Token" value={latestToken} />
            </div>
          </article>

          <article className="rounded-[24px] border border-[#e5eaf4] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="rounded-[20px] bg-gradient-to-br from-[#5b5ff7] to-[#4d9eff] p-5 text-white shadow-md">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/18">
                <FiUser className="h-6 w-6" />
              </span>
              <h2 className="mt-5 text-xl font-extrabold">Logs Synchronised</h2>
              <p className="mt-2 text-xs leading-relaxed text-white/80">
                All finished patient consultations are tracked in real-time. Use the export button to generate logs in your dashboard.
              </p>
            </div>
          </article>
        </aside>
      </div>
    </section>
  )
}

const HistoryMetric = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-4 py-4">
    <span className="text-sm font-bold text-[#6b7280]">{label}</span>
    <span className="text-lg font-extrabold text-[#07122f]">{value}</span>
  </div>
)

export default HistoryDoc

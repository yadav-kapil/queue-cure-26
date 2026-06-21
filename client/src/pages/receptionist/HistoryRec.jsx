import { useMemo, useState } from 'react'
import {
  FiCalendar,
  FiCheckCircle,
  FiFilter,
  FiSearch,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi'
import { useSession } from '../../context/session/SessionContext'

const HistoryRec = () => {
  const { queue, isSessionActive } = useSession()
  const [searchTerm, setSearchTerm] = useState('')

  // Filter queue patients who have completed consultations or are skipped
  const historicalPatients = useMemo(() => {
    if (!queue || !queue.patients) return []
    
    return queue.patients.filter(
      (p) => p.consultationEndedAt || p.skipped
    )
  }, [queue])

  const filteredPatients = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return historicalPatients

    return historicalPatients.filter((p) => {
      return (
        p.name.toLowerCase().includes(query) ||
        p.tokenNumber.toString().includes(query) ||
        (p.mobile && p.mobile.includes(query))
      )
    })
  }, [historicalPatients, searchTerm])

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

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase text-[#2459ff]">History Page</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.01em] text-[#07122f] sm:text-4xl">
          Consultation Logs
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7280]">
          Review completed and skipped patient tokens for the active clinical session.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Left Table Panel */}
        <article className="rounded-[28px] border border-[#e5eaf4] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-3 md:flex-row">
            <label className="relative flex-1">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patient, token or mobile..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-[#f8fbff] pl-12 pr-4 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-slate-400 focus:border-[#2459ff] focus:bg-white"
              />
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                className="grid h-12 w-12 place-items-center rounded-2xl border border-[#e5eaf4] text-[#2459ff] transition hover:border-[#2459ff] hover:bg-[#eef4ff]"
                aria-label="Filter logs"
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
            {/* Header for larger screens */}
            <div className="grid grid-cols-[100px_minmax(160px,1fr)_120px_120px_120px] bg-[#f8fbff] px-5 py-3 text-xs font-extrabold uppercase text-[#6b7280] max-lg:hidden">
              <span>Token</span>
              <span>Patient Name</span>
              <span>Duration</span>
              <span>Status</span>
              <span>Finished At</span>
            </div>

            {!isSessionActive ? (
              <div className="px-5 py-16 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-50 text-slate-400 border border-slate-100">
                  <FiAlertCircle className="h-7 w-7" />
                </span>
                <h2 className="mt-4 text-lg font-extrabold text-[#07122f]">
                  No Active Session
                </h2>
                <p className="mt-2 text-sm text-[#6b7280] max-w-sm mx-auto">
                  Historical queue logs will display here once a doctor starts a live session and patients are processed.
                </p>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#eef4ff] text-[#2459ff]">
                  <FiCheckCircle className="h-7 w-7" />
                </span>
                <h2 className="mt-4 text-lg font-extrabold text-[#07122f]">
                  {searchTerm ? 'No search results found' : 'No processed patients yet'}
                </h2>
                <p className="mt-2 text-sm text-[#6b7280] max-w-sm mx-auto">
                  {searchTerm ? 'Try searching another patient name or token number.' : 'Patients completed or skipped by the doctor in the active session will appear here.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#e5eaf4]">
                {filteredPatients.map((patient) => {
                  const hasEnded = !!patient.consultationEndedAt
                  const isSkipped = patient.skipped
                  
                  let statusLabel = 'Completed'
                  let statusClass = 'bg-[#ecfdf5] text-[#16a34a]'
                  let finishedTime = formatTime(patient.consultationEndedAt)

                  if (isSkipped) {
                    statusLabel = 'Skipped'
                    statusClass = 'bg-red-50 text-red-600'
                    finishedTime = '--:--'
                  }

                  return (
                    <div
                      key={patient.tokenNumber}
                      className="grid gap-3 px-5 py-4 text-sm font-semibold text-[#111827] lg:grid-cols-[100px_minmax(160px,1fr)_120px_120px_120px] lg:items-center"
                    >
                      <span className="font-extrabold text-[#2459ff]">#{patient.tokenNumber}</span>
                      <div>
                        <div className="font-bold text-[#07122f]">{patient.name}</div>
                        <div className="text-xs text-slate-400 font-semibold lg:hidden mt-0.5">
                          {patient.mobile}
                        </div>
                      </div>
                      <span className="text-slate-500 font-semibold">
                        {hasEnded ? getDuration(patient.consultationStartedAt, patient.consultationEndedAt) : '--'}
                      </span>
                      <div>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </div>
                      <span className="text-slate-500 font-semibold">{finishedTime}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </article>

        {/* Right Info Box */}
        <aside className="space-y-6">
          <article className="rounded-[28px] border border-[#e5eaf4] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            <h2 className="text-lg font-extrabold text-[#07122f] mb-4">Summary Stats</h2>
            
            <div className="space-y-3.5">
              <div className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-4 py-3.5">
                <span className="text-sm font-bold text-[#5b6478]">Completed</span>
                <span className="text-lg font-extrabold text-[#22c55e]">
                  {historicalPatients.filter((p) => p.consultationEndedAt).length} Patients
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-4 py-3.5">
                <span className="text-sm font-bold text-[#5b6478]">Skipped</span>
                <span className="text-lg font-extrabold text-[#ef4444]">
                  {historicalPatients.filter((p) => p.skipped).length} Patients
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-4 py-3.5">
                <span className="text-sm font-bold text-[#5b6478]">Total Logs</span>
                <span className="text-lg font-extrabold text-[#2459ff]">
                  {historicalPatients.length} Records
                </span>
              </div>
            </div>
          </article>
        </aside>
      </div>
    </section>
  )
}

export default HistoryRec

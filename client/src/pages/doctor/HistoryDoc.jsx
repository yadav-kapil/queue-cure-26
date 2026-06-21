import { useMemo, useState } from 'react'
import {
  FiCalendar,
  FiCheckCircle,
  FiDownload,
  FiFilter,
  FiSearch,
  FiUser,
} from 'react-icons/fi'

const HistoryDoc = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [completedConsultations] = useState([])

  const filteredConsultations = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return completedConsultations

    return completedConsultations.filter((consultation) => {
      return [consultation.token, consultation.name, consultation.completedAt]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    })
  }, [completedConsultations, searchTerm])

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase text-[#2459ff]">History Page</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.01em] text-[#07122f] sm:text-4xl">
            Completed Consultations
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7280]">
            Review completed tokens once live queue data is connected. This page is wired with state and empty by default.
          </p>
        </div>

        <button
          type="button"
          disabled={!completedConsultations.length}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#5b5ff7] to-[#4d9eff] px-6 font-bold text-white shadow-[0_12px_24px_rgba(77,124,254,0.2)] transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
        >
          <FiDownload className="h-5 w-5" />
          Export
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <article className="rounded-[24px] border border-[#e5eaf4] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-3 md:flex-row">
            <label className="relative flex-1">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b7280]" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search patient or token"
                className="h-12 w-full rounded-2xl border border-[#e5eaf4] bg-[#f8fbff] pl-12 pr-4 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#7c879a] focus:border-[#4d7cfe] focus:bg-white focus:ring-4 focus:ring-[#4d7cfe]/10"
              />
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                className="grid h-12 w-12 place-items-center rounded-2xl border border-[#e5eaf4] text-[#2459ff] transition hover:border-[#4d7cfe] hover:bg-[#eef4ff]"
                aria-label="Filter consultations"
              >
                <FiFilter className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="grid h-12 w-12 place-items-center rounded-2xl border border-[#e5eaf4] text-[#2459ff] transition hover:border-[#4d7cfe] hover:bg-[#eef4ff]"
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

            {filteredConsultations.length === 0 ? (
              <div className="px-5 py-14">
                <div className="mx-auto max-w-md text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#eef4ff] text-[#2459ff]">
                    <FiCheckCircle className="h-7 w-7" />
                  </span>
                  <h2 className="mt-4 text-xl font-extrabold text-[#07122f]">
                    No completed consultations yet
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#6b7280]">
                    Completed patients will appear here after the live session starts sending queue updates.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-[#e5eaf4]">
                {filteredConsultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="grid gap-3 px-5 py-4 text-sm font-semibold text-[#111827] lg:grid-cols-[120px_minmax(160px,1fr)_150px_150px]"
                  >
                    <span>#{consultation.token}</span>
                    <span>{consultation.name}</span>
                    <span>{consultation.duration} min</span>
                    <span>{consultation.completedAt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </article>

        <aside className="space-y-5">
          <article className="rounded-[24px] border border-[#e5eaf4] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <h2 className="text-lg font-extrabold text-[#07122f]">History Summary</h2>
            <div className="mt-4 grid gap-3">
              <HistoryMetric label="Completed Today" value={completedConsultations.length} />
              <HistoryMetric label="Average Duration" value="-- min" />
              <HistoryMetric label="Latest Token" value="--" />
            </div>
          </article>

          <article className="rounded-[24px] border border-[#e5eaf4] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="rounded-[20px] bg-gradient-to-br from-[#5b5ff7] to-[#4d9eff] p-5 text-white">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/18">
                <FiUser className="h-6 w-6" />
              </span>
              <h2 className="mt-5 text-2xl font-extrabold">Ready for live data</h2>
              <p className="mt-2 text-sm leading-6 text-white/82">
                Connect completed consultation events later and this page will fill automatically from state.
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

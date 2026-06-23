import { useMemo, useState, useEffect } from 'react'
import {
  FiCalendar,
  FiCheckCircle,
  FiFilter,
  FiSearch,
  FiClock,
  FiAlertCircle,
  FiUser,
  FiDownload
} from 'react-icons/fi'
import Loading from '../../components/common/Loading'
import ErrorDialog from '../../components/common/Error'
import { exportHistory } from '../../utils/exportHistory'

const HistoryRec = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showDateDropdown, setShowDateDropdown] = useState(false)
  const [showExportDropdown, setShowExportDropdown] = useState(false)
  const [customDate, setCustomDate] = useState('')

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        setErrorMsg(null)
        const res = await fetch("/api/session/history", {
          credentials: "include"
        })
        const data = await res.json()
        if (data.success) {
          setHistory(data.history)
        } else {
          setErrorMsg(data.message || "Failed to load history")
        }
      } catch (err) {
        console.error(err)
        setErrorMsg("Failed to load history")
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

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

  const isToday = (dateStr) => {
    if (!dateStr) return false
    const date = new Date(dateStr)
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isWithinDateRange = (dateStr, range) => {
    if (range === 'all') return true
    if (!dateStr) return false
    const date = new Date(dateStr)
    const today = new Date()
    
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const targetDateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    const diffTime = todayStart.getTime() - targetDateStart.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (range === 'today') {
      return diffDays === 0
    }
    if (range === 'yesterday') {
      return diffDays === 1
    }
    if (range === '7days') {
      return diffDays >= 0 && diffDays <= 7
    }
    if (range === '30days') {
      return diffDays >= 0 && diffDays <= 30
    }
    if (range === 'custom') {
      if (!customDate) return true
      const targetDate = new Date(customDate)
      return (
        date.getFullYear() === targetDate.getFullYear() &&
        date.getMonth() === targetDate.getMonth() &&
        date.getDate() === targetDate.getDate()
      )
    }
    return true
  }

  // Filter queue patients who have completed consultations or are skipped across all ended sessions
  const historicalPatients = useMemo(() => {
    return history.flatMap(
      (item) => item.queue?.patients?.filter((p) => p.consultationEndedAt || p.skipped) || []
    )
  }, [history])

  // Calculate stats for History Summary
  const stats = useMemo(() => {
    const sessionsToday = history.filter(
      (item) => item.session?.endedAt && isToday(item.session.endedAt)
    ).length

    const sessionsTotal = history.length

    const patientsToday = history.reduce((sum, item) => {
      const completedToday = item.queue?.patients?.filter(
        (p) => p.consultationEndedAt && !p.skipped && isToday(p.consultationEndedAt)
      ) || []
      return sum + completedToday.length
    }, 0)

    const patientsTotal = history.reduce((sum, item) => {
      const completedTotal = item.queue?.patients?.filter(
        (p) => p.consultationEndedAt && !p.skipped
      ) || []
      return sum + completedTotal.length
    }, 0)

    return {
      sessionsToday,
      sessionsTotal,
      patientsToday,
      patientsTotal
    }
  }, [history])

  // Filter completed/skipped consultations based on search term, status filter and date range
  const filteredHistory = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return history.map((item) => {
      const matchingPatients = item.queue?.patients?.filter((p) => {
        const isMatchedSearch = (p.consultationEndedAt || p.skipped) && (
          p.name.toLowerCase().includes(query) ||
          p.tokenNumber.toString().includes(query) ||
          (p.mobile && p.mobile.includes(query))
        )
        if (!isMatchedSearch) return false

        if (statusFilter === 'completed') {
          return !!p.consultationEndedAt && !p.skipped
        }
        if (statusFilter === 'skipped') {
          return p.skipped
        }
        return true
      }) || []

      return {
        ...item,
        filteredPatients: matchingPatients
      }
    }).filter((item) => {
      const matchesDate = isWithinDateRange(item.session?.startedAt, dateFilter)
      if (!matchesDate) return false

      if (searchTerm || statusFilter !== 'all') {
        return item.filteredPatients.length > 0
      }
      return true
    })
  }, [history, searchTerm, statusFilter, dateFilter, customDate])

  return (
    <>
      {loading && <Loading message="Loading consultation logs..." />}
      {errorMsg && (
        <ErrorDialog
          heading="History Error"
          message={errorMsg}
          onClose={() => setErrorMsg(null)}
        />
      )}
      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase text-[#2459ff]">History Page</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.01em] text-[#07122f] sm:text-4xl">
              Consultation Logs
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7280]">
              Review completed and skipped patient tokens for all ended clinical sessions.
            </p>
          </div>

          <div className="relative">
            <button
              type="button"
              disabled={!historicalPatients.length}
              onClick={() => {
                setShowExportDropdown(!showExportDropdown)
                setShowStatusDropdown(false)
                setShowDateDropdown(false)
              }}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#5b5ff7] to-[#4d9eff] px-6 font-bold text-white shadow-[0_12px_24px_rgba(77,124,254,0.2)] transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 cursor-pointer"
            >
              <FiDownload className="h-5 w-5" />
              Export Logs
            </button>
            {showExportDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowExportDropdown(false)} />
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-[#e5eaf4] bg-white p-2 shadow-[0_12px_30px_rgba(15,23,42,0.10)] z-50">
                  <p className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Export Format</p>
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        exportHistory(history, 'receptionist', 'csv')
                        setShowExportDropdown(false)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-[#f8fbff] transition"
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                        <FiDownload className="h-4 w-4" />
                      </span>
                      <span className='flex flex-col items-start'>
                        <span className="block text-xs font-extrabold text-[#07122f]">CSV File</span>
                        <span className="block text-[10px] text-slate-400 font-semibold">Spreadsheet format</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        exportHistory(history, 'receptionist', 'pdf')
                        setShowExportDropdown(false)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-[#f8fbff] transition"
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-500">
                        <FiUser className="h-4 w-4" />
                      </span>
                      <span className='flex flex-col items-start'>
                        <span className="block text-xs font-extrabold text-[#07122f]">PDF File</span>
                        <span className="block text-[10px] text-slate-400 font-semibold">Print-ready document</span>
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* Left Table Panel */}
          <article className="rounded-[28px] border border-[#e5eaf4] bg-white p-4 sm:p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] h-[550px] md:h-[680px] flex flex-col">
            <div className="flex flex-col gap-3 md:flex-row mb-5">
              <label className="relative flex-1">
                <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search patient name, token or mobile..."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-[#f8fbff] pl-12 pr-4 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-slate-400 focus:border-[#2459ff] focus:bg-white"
                />
              </label>
              <div className="flex gap-2 relative w-full md:w-auto">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowStatusDropdown(!showStatusDropdown)
                      setShowDateDropdown(false)
                    }}
                    className={`grid h-12 w-12 place-items-center rounded-2xl border transition ${
                      statusFilter !== 'all' || showStatusDropdown
                        ? 'border-[#2459ff] bg-[#eef4ff] text-[#2459ff]'
                        : 'border-[#e5eaf4] text-[#2459ff] hover:border-[#2459ff] hover:bg-[#eef4ff]'
                    }`}
                    aria-label="Filter consultations"
                  >
                    <FiFilter className="h-5 w-5" />
                  </button>
                  {showStatusDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowStatusDropdown(false)} />
                      <div className="absolute left-0 md:left-auto md:right-0 mt-2 w-48 rounded-2xl border border-[#e5eaf4] bg-white p-2 shadow-[0_12px_30px_rgba(15,23,42,0.08)] z-50">
                        <p className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Status Filter</p>
                        <div className="space-y-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setStatusFilter('all')
                              setShowStatusDropdown(false)
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition ${
                              statusFilter === 'all'
                                ? 'bg-[#eef4ff] text-[#2459ff]'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            All Statuses
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setStatusFilter('completed')
                              setShowStatusDropdown(false)
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition ${
                              statusFilter === 'completed'
                                ? 'bg-[#eef4ff] text-[#2459ff]'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            Completed Only
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setStatusFilter('skipped')
                              setShowStatusDropdown(false)
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition ${
                              statusFilter === 'skipped'
                                ? 'bg-[#eef4ff] text-[#2459ff]'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            Skipped Only
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDateDropdown(!showDateDropdown)
                      setShowStatusDropdown(false)
                    }}
                    className={`grid h-12 w-12 place-items-center rounded-2xl border transition ${
                      dateFilter !== 'all' || showDateDropdown
                        ? 'border-[#2459ff] bg-[#eef4ff] text-[#2459ff]'
                        : 'border-[#e5eaf4] text-[#2459ff] hover:border-[#2459ff] hover:bg-[#eef4ff]'
                    }`}
                    aria-label="Pick date"
                  >
                    <FiCalendar className="h-5 w-5" />
                  </button>
                  {showDateDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowDateDropdown(false)} />
                      <div className="absolute left-0 md:left-auto md:right-0 mt-2 w-48 rounded-2xl border border-[#e5eaf4] bg-white p-2 shadow-[0_12px_30px_rgba(15,23,42,0.08)] z-50">
                        <p className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Date Filter</p>
                        <div className="space-y-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setDateFilter('all')
                              setShowDateDropdown(false)
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition ${
                              dateFilter === 'all'
                                ? 'bg-[#eef4ff] text-[#2459ff]'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            All Time
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDateFilter('today')
                              setShowDateDropdown(false)
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition ${
                              dateFilter === 'today'
                                ? 'bg-[#eef4ff] text-[#2459ff]'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            Today
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDateFilter('yesterday')
                              setShowDateDropdown(false)
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition ${
                              dateFilter === 'yesterday'
                                ? 'bg-[#eef4ff] text-[#2459ff]'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            Yesterday
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDateFilter('7days')
                              setShowDateDropdown(false)
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition ${
                              dateFilter === '7days'
                                ? 'bg-[#eef4ff] text-[#2459ff]'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            Last 7 Days
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDateFilter('custom')
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition ${
                              dateFilter === 'custom'
                                ? 'bg-[#eef4ff] text-[#2459ff]'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            Custom Date
                          </button>
                          {dateFilter === 'custom' && (
                            <div className="px-3 py-1.5 mt-1 border-t border-slate-100">
                              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Select Date</label>
                              <input
                                type="date"
                                value={customDate}
                                onChange={(e) => {
                                  setCustomDate(e.target.value)
                                }}
                                className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-1.5 outline-none focus:border-[#2459ff] focus:bg-white"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('')
                      setStatusFilter('all')
                      setDateFilter('all')
                      setCustomDate('')
                    }}
                    className="flex-1 md:flex-initial flex items-center justify-center px-4 h-12 rounded-2xl border border-red-100 bg-red-50 text-xs font-black uppercase tracking-wider text-red-600 hover:bg-red-100 hover:border-red-200 transition"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {!loading && history.length === 0 ? (
              <div className="flex-1 flex flex-col justify-center items-center px-5 py-16 text-center border border-dashed border-[#d7e1f0] rounded-[20px] bg-[#f8fbff]">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-50 text-slate-400 border border-slate-100">
                  <FiAlertCircle className="h-7 w-7" />
                </span>
                <h2 className="mt-4 text-lg font-extrabold text-[#07122f]">
                  No History Available
                </h2>
                <p className="mt-2 text-sm text-[#6b7280] max-w-sm mx-auto">
                  Historical queue logs will display here once clinic sessions are completed.
                </p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="flex-1 flex flex-col justify-center items-center px-5 py-16 text-center border border-dashed border-[#d7e1f0] rounded-[20px] bg-[#f8fbff]">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#eef4ff] text-[#2459ff]">
                  <FiCheckCircle className="h-7 w-7" />
                </span>
                <h2 className="mt-4 text-lg font-extrabold text-[#07122f]">
                  No matching logs found
                </h2>
                <p className="mt-2 text-sm text-[#6b7280] max-w-sm mx-auto">
                  Try adjusting your search query, status filter, or date range.
                </p>
              </div>
            ) : (
              <div className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-thin">
                {filteredHistory.map((item) => {
                  const session = item.session
                  const patientsList = (searchTerm || statusFilter !== 'all') ? item.filteredPatients : (item.queue?.patients?.filter((p) => p.consultationEndedAt || p.skipped) || [])
                  
                  const sessionDate = new Date(session.startedAt).toLocaleDateString(undefined, {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })

                  const durationStr = getDuration(session.startedAt, session.endedAt)
                  const doctorName = session.doctorId ? `Dr. ${session.doctorId.fullName.replace(/^Dr\.\s*/i, "")}` : "Doctor"

                  return (
                    <div key={session._id} className="rounded-[20px] border border-[#e5eaf4] bg-white p-4 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-4">
                      {/* Session Header */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-500 border border-slate-200">
                              Session Log
                            </span>
                            <span className="text-sm font-extrabold text-[#07122f]">{sessionDate}</span>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400">
                            Started: {formatTime(session.startedAt)} • Ended: {formatTime(session.endedAt)} ({durationStr})
                          </p>
                        </div>
                        <div className="text-left md:text-right">
                          <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">Doctor</span>
                          <span className="text-xs font-extrabold text-[#2459ff]">
                            {doctorName}
                          </span>
                        </div>
                      </div>

                      {/* Processed Patients inside this Session */}
                      {patientsList.length === 0 ? (
                        <p className="text-center text-xs text-slate-400 py-3 font-semibold">No consultations in this session.</p>
                      ) : (
                        <div className="overflow-hidden rounded-[16px] border border-[#e5eaf4]">
                          <div className="grid grid-cols-[100px_minmax(160px,1fr)_120px_120px_120px] bg-[#f8fbff] px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-[#6b7280] max-md:hidden">
                            <span>Token</span>
                            <span>Patient Name</span>
                            <span>Duration</span>
                            <span>Status</span>
                            <span>Finished At</span>
                          </div>
                          <div className="divide-y divide-[#e5eaf4]">
                            {patientsList.map((p) => {
                              const hasEnded = !!p.consultationEndedAt
                              const isSkipped = p.skipped
                              
                              let statusLabel = 'Completed'
                              let statusClass = 'bg-[#ecfdf5] text-[#16a34a]'
                              let finishedTime = formatTime(p.consultationEndedAt)

                              if (isSkipped) {
                                statusLabel = 'Skipped'
                                statusClass = 'bg-red-50 text-red-600'
                                finishedTime = '--:--'
                              }

                              return (
                                <div key={p.tokenNumber} className="flex flex-col gap-2.5 md:grid md:grid-cols-[100px_minmax(160px,1fr)_120px_120px_120px] px-4 py-3.5 text-xs font-semibold text-[#111827] hover:bg-slate-50/50 transition border-b border-slate-100 last:border-0">
                                  
                                  {/* Row 1 (Mobile): Token, Name, Status Badge */}
                                  <div className="flex items-center justify-between w-full md:hidden">
                                    <div className="flex items-center gap-2">
                                      <span className="font-extrabold text-[#2459ff]">#{p.tokenNumber}</span>
                                      <span className="font-extrabold text-[#07122f]">{p.name}</span>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${statusClass}`}>
                                      {statusLabel}
                                    </span>
                                  </div>

                                  {/* Row 2 (Mobile): Finished time, Duration, Mobile, OTP */}
                                  <div className="flex items-center justify-between w-full md:hidden text-[10px] text-slate-400 font-bold">
                                    <div>
                                      Finished: {finishedTime} {hasEnded && `• ${getDuration(p.consultationStartedAt, p.consultationEndedAt)}`}
                                    </div>
                                    <div>
                                      Mob: {p.mobile || '--'} {p.code && `• OTP: ${p.code}`}
                                    </div>
                                  </div>

                                  {/* Desktop Columns */}
                                  <span className="hidden md:inline font-extrabold text-[#2459ff]">#{p.tokenNumber}</span>
                                  <div className="hidden md:block">
                                    <div className="font-extrabold text-[#07122f]">{p.name}</div>
                                    <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                      Mobile: {p.mobile || '--'} • OTP: {p.code || '--'}
                                    </div>
                                  </div>
                                  <span className="hidden md:inline text-slate-500 font-semibold">
                                    {hasEnded ? getDuration(p.consultationStartedAt, p.consultationEndedAt) : '--'}
                                  </span>
                                  <div className="hidden md:block">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${statusClass}`}>
                                      {statusLabel}
                                    </span>
                                  </div>
                                  <span className="hidden md:inline text-slate-500 font-semibold">{finishedTime}</span>

                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </article>

          {/* Right Info Box */}
          <aside className="space-y-6">
            <article className="rounded-[28px] border border-[#e5eaf4] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
              <h2 className="text-lg font-extrabold text-[#07122f] mb-4">Summary Stats</h2>
              
              {/* Today's Report */}
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#2459ff] mb-2.5 font-black">Today&apos;s Report</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-4 py-3">
                    <span className="text-sm font-bold text-[#5b6478]">Completed Sessions</span>
                    <span className="text-base font-extrabold text-[#07122f]">{stats.sessionsToday} Sessions</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-4 py-3">
                    <span className="text-sm font-bold text-[#5b6478]">Patients Attended</span>
                    <span className="text-base font-extrabold text-[#07122f]">{stats.patientsToday} Patients</span>
                  </div>
                </div>
              </div>

              {/* Total Report */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 font-black">Total Report</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-4 py-3">
                    <span className="text-sm font-bold text-[#5b6478]">Completed Till Now</span>
                    <span className="text-base font-extrabold text-[#07122f]">{stats.sessionsTotal} Sessions</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-4 py-3">
                    <span className="text-sm font-bold text-[#5b6478]">Total Patients Attended</span>
                    <span className="text-base font-extrabold text-[#07122f]">{stats.patientsTotal} Patients</span>
                  </div>
                </div>
              </div>
            </article>
          </aside>
        </div>
      </section>
    </>
  )
}

export default HistoryRec;
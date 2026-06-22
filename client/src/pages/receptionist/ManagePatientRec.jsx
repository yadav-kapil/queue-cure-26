import { useState, useMemo } from 'react'
import {
  FiUserPlus,
  FiUsers,
  FiClock,
  FiPhone,
  FiUser,
  FiSearch,
  FiInfo,
  FiRadio,
  FiTrash2
} from 'react-icons/fi'
import { useSession } from '../../context/session/SessionContext'
import { useRec } from '../../hooks/useRec'
import Loading from '../../components/common/Loading'

const ManagePatientRec = () => {
  const { queue, isSessionActive } = useSession()
  const { addPatientToQueue, addPatientLoading } = useRec()

  // Form State
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')

    if (!isSessionActive) {
      setFormError('Cannot add patient. No active session found. Please wait for the doctor to start the session.')
      return
    }

    if (!name.trim()) {
      setFormError('Patient name is required.')
      return
    }
    if (!mobile.trim()) {
      setFormError('Mobile number is required.')
      return
    }
    if (!/^\d{10}$/.test(mobile.trim())) {
      setFormError('Mobile number must be a valid 10-digit number.')
      return
    }

    try {
      const data = await addPatientToQueue({
        name: name.trim(),
        mobile: mobile.trim(),
        age: age ? Number(age) : undefined,
        gender
      })

      const patientCode = data?.patient?.code ? ` (OTP: ${data.patient.code})` : ''
      setFormSuccess(`Patient "${name}" has been successfully added to the queue!${patientCode}`)
      // Clear form
      setName('')
      setMobile('')
      setAge('')
      setGender('male')
    } catch (err) {
      setFormError(err.message || 'Failed to add patient to queue.')
    }
  }

  // Filter patients based on search
  const filteredPatients = useMemo(() => {
    if (!queue || !queue.patients) return []
    
    // Sort patients so current token is at top, followed by waiting
    const notDone = queue.patients.filter((p) => !p.consultationEndedAt)
    const current = notDone.find((p) => p.tokenNumber === queue.currentToken)
    const rest = notDone.filter((p) => p.tokenNumber !== queue.currentToken)
    
    rest.sort((a, b) => a.tokenNumber - b.tokenNumber)
    const arranged = current ? [current, ...rest] : rest

    if (!searchQuery.trim()) return arranged

    const q = searchQuery.toLowerCase().trim()
    return arranged.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tokenNumber.toString().includes(q) ||
        p.mobile.includes(q)
    )
  }, [queue, searchQuery])

  return (
    <>
      {addPatientLoading && <Loading message="Adding patient to queue..." />}
      <section className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eef4ff] text-[#2459ff] shadow-xs">
          <FiUsers className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-[#07122f]">Manage Patients</h1>
          <p className="text-sm font-semibold text-slate-400">Add patients to the queue and manage active appointments</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Left Column: Add Patient Form */}
        <article className="rounded-[28px] border border-[#e5eaf4] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] h-fit">
          <div className="flex items-center gap-2 text-md font-extrabold text-[#07122f] mb-4">
            <FiUserPlus className="h-5 w-5 text-[#2459ff]" />
            <h2>Add New Patient</h2>
          </div>

          {!isSessionActive ? (
            <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-4 text-xs font-semibold text-amber-700 leading-normal flex items-start gap-2">
              <FiInfo className="h-5 w-5 shrink-0 mt-0.5" />
              <span>
                <strong>Note:</strong> You cannot add patients right now because the doctor has no active session. Please wait until they go live.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="rounded-2xl bg-red-50 p-3.5 text-xs font-bold text-red-600 border border-red-100">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="rounded-2xl bg-emerald-50 p-3.5 text-xs font-bold text-emerald-600 border border-emerald-100">
                  {formSuccess}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#5b6478]">Patient Name *</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-[#f8fbff]/60 text-sm font-semibold text-[#07122f] focus:outline-none focus:border-[#2459ff] focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#5b6478]">Mobile Number *</label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10-digit number"
                    maxLength={10}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-[#f8fbff]/60 text-sm font-semibold text-[#07122f] focus:outline-none focus:border-[#2459ff] focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#5b6478]">Age (Optional)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 28"
                    min={0}
                    max={120}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-[#f8fbff]/60 text-sm font-semibold text-[#07122f] focus:outline-none focus:border-[#2459ff] focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#5b6478]">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-[#f8fbff]/60 text-sm font-semibold text-[#07122f] focus:outline-none focus:border-[#2459ff] focus:bg-white transition cursor-pointer"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={addPatientLoading}
                className="w-full h-11 mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2459ff] hover:bg-[#1a44cc] disabled:bg-slate-300 disabled:cursor-not-allowed font-extrabold text-white text-sm shadow-md transition enabled:hover:-translate-y-0.5 cursor-pointer"
              >
                {addPatientLoading ? 'Adding...' : 'Add to Queue'}
              </button>
            </form>
          )}
        </article>

        {/* Right Column: Active Queue List */}
        <article className="rounded-[28px] border border-[#e5eaf4] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-extrabold text-[#07122f]">Patients in Queue</h2>
            
            {/* Search Input */}
            <div className="relative w-full max-w-[280px]">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient, token, mobile..."
                className="w-full h-9 pl-9 pr-4 rounded-xl border border-slate-200 bg-[#f8fbff]/80 text-xs font-semibold text-[#07122f] focus:outline-none focus:border-[#2459ff] focus:bg-white transition"
              />
            </div>
          </div>

          {!isSessionActive ? (
            <div className="rounded-2xl border border-dashed border-[#d7e1f0] bg-[#f8fbff] py-16 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-400 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
                <FiRadio className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-extrabold text-[#07122f]">No Active Session</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#6b7280]">
                A live list of patients will be shown here once the doctor starts their session.
              </p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#d7e1f0] bg-[#f8fbff] py-16 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-400 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
                <FiUsers className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-extrabold text-[#07122f]">No Patients Found</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#6b7280]">
                {searchQuery ? 'No patients match your search criteria.' : 'Start adding patients using the form on the left.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Token</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">OTP</th>
                    <th className="py-3 px-4">Mobile</th>
                    <th className="py-3 px-4">Age / Gender</th>
                    <th className="py-3 px-4">Wait Time</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/60">
                  {filteredPatients.map((patient, index) => {
                    const isCurrent = patient.tokenNumber === queue.currentToken
                    const waitTimeEst = isCurrent 
                      ? '0 min' 
                      : `${(index) * 5} min`

                    let statusText = 'Waiting'
                    let statusClass = 'bg-[#fff7ed] text-[#f59e0b]'
                    
                    if (isCurrent) {
                      statusText = 'Next'
                      statusClass = 'bg-[#ecfdf5] text-[#16a34a]'
                    } else if (patient.skipped) {
                      statusText = 'Skipped'
                      statusClass = 'bg-red-50 text-red-600'
                    }

                    return (
                      <tr 
                        key={patient.tokenNumber} 
                        className={`transition hover:bg-slate-50/70 ${isCurrent ? 'bg-[#f4f7ff]/40 font-semibold' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-extrabold text-[#2459ff]">
                          #{patient.tokenNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-sm font-extrabold text-[#07122f]">{patient.name}</span>
                        </td>
                        <td className="py-3.5 px-4 text-sm font-semibold text-slate-600">
                          {patient.code || '--'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-sm font-semibold text-slate-500">{patient.mobile}</span>
                        </td>
                        <td className="py-3.5 px-4 text-sm font-semibold text-slate-500">
                          {patient.age ? `${patient.age} / ` : ''}{patient.gender ? (patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)) : '--'}
                        </td>
                        <td className="py-3.5 px-4 text-sm font-semibold text-slate-500">
                          {waitTimeEst}
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
          )}
        </article>
      </div>
    </section>
    </>
  )
}

export default ManagePatientRec

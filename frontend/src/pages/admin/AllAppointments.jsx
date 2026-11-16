import { useState } from 'react'
import useFetch from '../../hooks/useFetch.js'
import { Empty, ErrorBox, Loading, StatusBadge, formatDate, inputClass } from '../../components/ui.jsx'

export default function AllAppointments() {
  const { data, loading, error } = useFetch('/api/admin/appointments')
  const [search, setSearch] = useState('')

  const filtered = data.filter((a) =>
    (a.patient?.username || '').toLowerCase().includes(search.trim().toLowerCase()),
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">All Appointments</h1>
      <input
        className={`${inputClass} mt-4 max-w-md`}
        placeholder="Search by patient name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ErrorBox message={error} />
      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <div className="mt-6">
          <Empty text="No appointments found." />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">Specialization</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">{a.patient?.username || 'Removed'}</td>
                  <td className="px-4 py-3">{a.doctor?.username || 'Removed'}</td>
                  <td className="px-4 py-3">{a.doctor?.specialization}</td>
                  <td className="px-4 py-3">{formatDate(a.appointmentDate)}</td>
                  <td className="px-4 py-3">{a.appointmentTime}</td>
                  <td className="px-4 py-3">{a.reason}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
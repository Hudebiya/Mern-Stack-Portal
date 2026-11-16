import { useState } from 'react'
import api, { getApiErrorMessage } from '../../api/axios.js'
import useFetch from '../../hooks/useFetch.js'
import { Empty, ErrorBox, Loading, StatusBadge, formatDate } from '../../components/ui.jsx'

const tabs = ['all', 'pending', 'approved', 'rejected']

export default function DoctorRequests() {
  const [tab, setTab] = useState('all')
  const { data, loading, error, reload } = useFetch(
    '/api/appointments/doctor',
    tab === 'all' ? {} : { status: tab },
  )
  const [actionError, setActionError] = useState('')

  async function setStatus(id, status) {
    try {
      await api.patch(`/api/appointments/${id}/status`, { status })
      setActionError('')
      reload()
    } catch (err) {
      setActionError(getApiErrorMessage(err, 'Could not update appointment.'))
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Appointment Requests</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
              tab === t ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <ErrorBox message={error || actionError} />
      {loading ? (
        <Loading />
      ) : data.length === 0 ? (
        <div className="mt-6">
          <Empty text="No appointments found." />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((a) => (
                <tr key={a._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">{a.patient?.username || 'Removed'}</td>
                  <td className="px-4 py-3">{a.patient?.email}</td>
                  <td className="px-4 py-3">{formatDate(a.appointmentDate)}</td>
                  <td className="px-4 py-3">{a.appointmentTime}</td>
                  <td className="px-4 py-3">{a.reason}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {a.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setStatus(a._id, 'approved')}
                          className="rounded-lg bg-green-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setStatus(a._id, 'rejected')}
                          className="rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
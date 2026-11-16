import { useState } from 'react'
import api, { getApiErrorMessage } from '../../api/axios.js'
import useFetch from '../../hooks/useFetch.js'
import { Empty, ErrorBox, Loading, StatusBadge, formatDate } from '../../components/ui.jsx'

export default function MyAppointments() {
  const { data, loading, error, reload } = useFetch('/api/appointments/my')
  const [actionError, setActionError] = useState('')

  async function cancel(id) {
    if (!window.confirm('Cancel this appointment?')) return
    try {
      await api.patch(`/api/appointments/${id}/cancel`)
      setActionError('')
      reload()
    } catch (err) {
      setActionError(getApiErrorMessage(err, 'Could not cancel appointment.'))
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">My Appointments</h1>
      <ErrorBox message={error || actionError} />
      {loading ? (
        <Loading />
      ) : data.length === 0 ? (
        <div className="mt-6">
          <Empty text="You have no appointments yet." />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">Specialization</th>
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
                  <td className="px-4 py-3 font-medium text-slate-800">{a.doctor?.username || 'Removed'}</td>
                  <td className="px-4 py-3">{a.doctor?.specialization}</td>
                  <td className="px-4 py-3">{formatDate(a.appointmentDate)}</td>
                  <td className="px-4 py-3">{a.appointmentTime}</td>
                  <td className="px-4 py-3">{a.reason}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3">
                    {a.status === 'pending' && (
                      <button
                        onClick={() => cancel(a._id)}
                        className="rounded-lg border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Cancel
                      </button>
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
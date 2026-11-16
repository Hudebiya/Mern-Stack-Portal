import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api, { getApiErrorMessage } from '../../api/axios.js'
import useFetch from '../../hooks/useFetch.js'
import { ErrorBox, SuccessBox, inputClass } from '../../components/ui.jsx'

function todayLocal() {
  const d = new Date()
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

export default function BookAppointment() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { data: doctors } = useFetch('/api/doctors')
  const [form, setForm] = useState({
    doctor: params.get('doctor') || '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  function update(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  async function submit(e) {
    e.preventDefault()
    if (!form.doctor || !form.appointmentDate || !form.appointmentTime || !form.reason.trim()) {
      setError('Please fill in all fields.')
      return
    }
    setSaving(true)
    try {
      await api.post('/api/appointments', form)
      setSuccess('Appointment booked! Redirecting…')
      setTimeout(() => navigate('/patient/appointments'), 800)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not book appointment.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-slate-800">Book Appointment</h1>
      <form
        onSubmit={submit}
        className="mt-6 space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
      >
        <ErrorBox message={error} />
        <SuccessBox message={success} />

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Doctor</label>
          <select name="doctor" value={form.doctor} onChange={update} className={inputClass}>
            <option value="">Select a doctor</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.username} — {d.specialization}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Date</label>
            <input
              type="date"
              name="appointmentDate"
              min={todayLocal()}
              value={form.appointmentDate}
              onChange={update}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Time</label>
            <input
              type="time"
              name="appointmentTime"
              value={form.appointmentTime}
              onChange={update}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Reason for visit</label>
          <textarea
            name="reason"
            rows="3"
            value={form.reason}
            onChange={update}
            className={inputClass}
            placeholder="Describe your problem briefly"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-70"
        >
          {saving ? 'Booking…' : 'Book Appointment'}
        </button>
      </form>
    </div>
  )
}
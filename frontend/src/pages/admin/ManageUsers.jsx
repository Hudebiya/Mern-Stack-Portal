import { useState } from 'react'
import api, { getApiErrorMessage } from '../../api/axios.js'
import useFetch from '../../hooks/useFetch.js'
import { Empty, ErrorBox, Loading, StatusBadge, inputClass } from '../../components/ui.jsx'

const tabs = [
  { label: 'All', value: '' },
  { label: 'Doctors', value: 'doctor' },
  { label: 'Patients', value: 'patient' },
]
const emptyForm = { username: '', email: '', password: '', specialization: '', experience: '' }

export default function ManageUsers() {
  const [role, setRole] = useState('')
  const { data: users, loading, error, reload } = useFetch(
    '/api/admin/users',
    role ? { role } : {},
  )
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [actionError, setActionError] = useState('')
  const [saving, setSaving] = useState(false)

  async function addDoctor(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/api/admin/doctors', form)
      setShowModal(false)
      setForm(emptyForm)
      setFormError('')
      reload()
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Could not add doctor.'))
    } finally {
      setSaving(false)
    }
  }

  async function toggle(id) {
    try {
      await api.patch(`/api/admin/users/${id}/toggle`)
      setActionError('')
      reload()
    } catch (err) {
      setActionError(getApiErrorMessage(err, 'Could not update user.'))
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this user and all their appointments?')) return
    try {
      await api.delete(`/api/admin/users/${id}`)
      setActionError('')
      reload()
    } catch (err) {
      setActionError(getApiErrorMessage(err, 'Could not delete user.'))
    }
  }

  function update(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Manage Users</h1>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          + Add Doctor
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.label}
            onClick={() => setRole(t.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              role === t.value ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ErrorBox message={error || actionError} />
      {loading ? (
        <Loading />
      ) : users.length === 0 ? (
        <div className="mt-6">
          <Empty text="No users found." />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Specialization</th>
                <th className="px-4 py-3">Experience</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">{u.username}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3"><StatusBadge status={u.role} /></td>
                  <td className="px-4 py-3">{u.specialization || '-'}</td>
                  <td className="px-4 py-3">{u.role === 'doctor' ? `${u.experience ?? 0} yrs` : '-'}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.isActive === false ? 'inactive' : 'active'} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {u.role !== 'admin' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggle(u._id)}
                          className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          {u.isActive === false ? 'Activate' : 'Deactivate'}
                        </button>
                        <button
                          onClick={() => remove(u._id)}
                          className="rounded-lg border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Delete
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={addDoctor}
            className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-lg font-semibold text-slate-800">Add Doctor</h2>
            <ErrorBox message={formError} />
            <input name="username" placeholder="Name" value={form.username} onChange={update} className={inputClass} required />
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={update} className={inputClass} required />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={update} className={inputClass} required minLength={6} />
            <input name="specialization" placeholder="Specialization (e.g. Cardiologist)" value={form.specialization} onChange={update} className={inputClass} required />
            <input name="experience" type="number" min="0" placeholder="Experience (years)" value={form.experience} onChange={update} className={inputClass} />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false)
                  setFormError('')
                }}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
              >
                {saving ? 'Saving…' : 'Add Doctor'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
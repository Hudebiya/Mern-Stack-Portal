import { useAuth } from '../../context/AuthContext.jsx'
import useFetch from '../../hooks/useFetch.js'
import { ErrorBox, Loading, StatCard } from '../../components/ui.jsx'

export default function DoctorDashboard() {
  const { user } = useAuth()
  const { data, loading, error } = useFetch('/api/appointments/doctor')
  const count = (s) => data.filter((a) => a.status === s).length

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Doctor Dashboard</h1>

      <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">{user.username}</h2>
        <p className="text-sm text-slate-500">{user.email}</p>
        <p className="mt-2 text-sm text-indigo-600">{user.specialization}</p>
        <p className="text-sm text-slate-500">{user.experience ?? 0} years experience</p>
      </div>

      <ErrorBox message={error} />
      {loading ? (
        <Loading />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Appointments" value={data.length} />
          <StatCard label="Pending" value={count('pending')} color="text-yellow-600" />
          <StatCard label="Approved" value={count('approved')} color="text-green-600" />
          <StatCard label="Rejected" value={count('rejected')} color="text-red-600" />
        </div>
      )}
    </div>
  )
}
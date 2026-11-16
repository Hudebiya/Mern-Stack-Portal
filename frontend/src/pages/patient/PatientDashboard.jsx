import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import useFetch from '../../hooks/useFetch.js'
import { ErrorBox, Loading, StatCard } from '../../components/ui.jsx'

export default function PatientDashboard() {
  const { user } = useAuth()
  const { data, loading, error } = useFetch('/api/appointments/my')
  const count = (s) => data.filter((a) => a.status === s).length

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Welcome, {user.username}</h1>
      <p className="mt-1 text-slate-500">A summary of your appointments.</p>
      <ErrorBox message={error} />
      {loading ? (
        <Loading />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total" value={data.length} />
          <StatCard label="Pending" value={count('pending')} color="text-yellow-600" />
          <StatCard label="Approved" value={count('approved')} color="text-green-600" />
          <StatCard label="Rejected" value={count('rejected')} color="text-red-600" />
        </div>
      )}
      <Link
        to="/patient/doctors"
        className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        Find a doctor
      </Link>
    </div>
  )
}
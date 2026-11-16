import useFetch from '../../hooks/useFetch.js'
import { ErrorBox, Loading, StatCard } from '../../components/ui.jsx'

export default function AdminDashboard() {
  const { data, loading, error } = useFetch('/api/admin/stats', {}, {})

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
      <ErrorBox message={error} />
      {loading ? (
        <Loading />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Total Patients" value={data.totalPatients ?? 0} />
          <StatCard label="Total Doctors" value={data.totalDoctors ?? 0} />
          <StatCard label="Total Appointments" value={data.totalAppointments ?? 0} />
          <StatCard label="Pending" value={data.pending ?? 0} color="text-yellow-600" />
          <StatCard label="Approved" value={data.approved ?? 0} color="text-green-600" />
          <StatCard label="Rejected" value={data.rejected ?? 0} color="text-red-600" />
        </div>
      )}
    </div>
  )
}
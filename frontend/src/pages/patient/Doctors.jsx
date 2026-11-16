import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useFetch from '../../hooks/useFetch.js'
import { Empty, ErrorBox, Loading, inputClass } from '../../components/ui.jsx'

export default function Doctors() {
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300)
    return () => clearTimeout(t)
  }, [search])

  const { data: doctors, loading, error } = useFetch(
    '/api/doctors',
    debounced ? { search: debounced } : {},
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Available Doctors</h1>
      <input
        className={`${inputClass} mt-4 max-w-md`}
        placeholder="Search by name or specialization"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ErrorBox message={error} />
      {loading ? (
        <Loading />
      ) : doctors.length === 0 ? (
        <div className="mt-6">
          <Empty text="No doctors found." />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((d) => (
            <div key={d._id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">{d.username}</h2>
              <p className="mt-1 text-sm text-indigo-600">{d.specialization}</p>
              <p className="text-sm text-slate-500">{d.experience ?? 0} years experience</p>
              <Link
                to={`/patient/book?doctor=${d._id}`}
                className="mt-4 inline-block rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Book Appointment
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
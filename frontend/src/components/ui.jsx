const badgeStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    cancelled: 'bg-slate-200 text-slate-700',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    admin: 'bg-purple-100 text-purple-800',
    doctor: 'bg-indigo-100 text-indigo-800',
    patient: 'bg-sky-100 text-sky-800',
  }
  
  export const inputClass =
    'w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
  
  export function StatusBadge({ status }) {
    return (
      <span
        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${
          badgeStyles[status] || 'bg-slate-100 text-slate-700'
        }`}
      >
        {status}
      </span>
    )
  }
  
  export function StatCard({ label, value, color = 'text-indigo-600' }) {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm text-slate-500">{label}</p>
        <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
      </div>
    )
  }
  
  export function Loading() {
    return <p className="py-10 text-center text-slate-500">Loading…</p>
  }
  
  export function Empty({ text }) {
    return (
      <p className="rounded-2xl bg-white p-8 text-center text-slate-500 ring-1 ring-slate-200">
        {text}
      </p>
    )
  }
  
  export function ErrorBox({ message }) {
    if (!message) return null
    return (
      <div className="my-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {message}
      </div>
    )
  }
  
  export function SuccessBox({ message }) {
    if (!message) return null
    return (
      <div className="my-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
        {message}
      </div>
    )
  }
  
  export function formatDate(date) {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    })
  }
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const links = {
  patient: [
    { to: '/patient', label: 'Dashboard', end: true },
    { to: '/patient/doctors', label: 'Doctors' },
    { to: '/patient/book', label: 'Book Appointment' },
    { to: '/patient/appointments', label: 'My Appointments' },
  ],
  doctor: [
    { to: '/doctor', label: 'Dashboard', end: true },
    { to: '/doctor/requests', label: 'Appointment Requests' },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', end: true },
    { to: '/admin/users', label: 'Manage Users' },
    { to: '/admin/appointments', label: 'All Appointments' },
  ],
}

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
    }`

  const navLinks = links[user.role] || []

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="text-lg font-bold text-indigo-600">Clinic Portal</span>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <span className="text-sm text-slate-600">{user.username}</span>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold capitalize text-indigo-700">
              {user.role}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Logout
            </button>
          </div>

          <button
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-lg md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>

        {open && (
          <div className="space-y-1 border-t border-slate-200 px-4 py-3 md:hidden">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-slate-600">
                {user.username} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
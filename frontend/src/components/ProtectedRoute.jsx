import { Navigate } from 'react-router-dom'
import { homeFor, useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Loading…</div>
  }
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={homeFor(user.role)} replace />
  }
  return children
}
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import { AuthProvider, homeFor, useAuth } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import DashboardLayout from './components/DashboardLayout.jsx'
import PatientDashboard from './pages/patient/PatientDashboard.jsx'
import Doctors from './pages/patient/Doctors.jsx'
import BookAppointment from './pages/patient/BookAppointment.jsx'
import MyAppointments from './pages/patient/MyAppointments.jsx'
import DoctorDashboard from './pages/doctor/DoctorDashboard.jsx'
import DoctorRequests from './pages/doctor/DoctorRequests.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import ManageUsers from './pages/admin/ManageUsers.jsx'
import AllAppointments from './pages/admin/AllAppointments.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'

function RoleRedirect() {
  const { user, loading } = useAuth()
  if (loading) {
    return <div className="p-10 text-center text-slate-500">Loading…</div>
  }
  return <Navigate to={user ? homeFor(user.role) : '/login'} replace />
}

function Guarded({ role }) {
  return (
    <ProtectedRoute allowedRoles={[role]}>
      <DashboardLayout />
    </ProtectedRoute>
  )
}

function App() {
  return (
    <AuthProvider>
            <ThemeToggle />
      <Routes>
        <Route path="/" element={<RoleRedirect />} />
        <Route path="/dashboard" element={<RoleRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/patient" element={<Guarded role="patient" />}>
          <Route index element={<PatientDashboard />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="book" element={<BookAppointment />} />
          <Route path="appointments" element={<MyAppointments />} />
        </Route>

        <Route path="/doctor" element={<Guarded role="doctor" />}>
          <Route index element={<DoctorDashboard />} />
          <Route path="requests" element={<DoctorRequests />} />
        </Route>

        <Route path="/admin" element={<Guarded role="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="appointments" element={<AllAppointments />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
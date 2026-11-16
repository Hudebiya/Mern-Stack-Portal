import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios.js'

const AuthContext = createContext(null)

export function homeFor(role) {
  if (role === 'admin') return '/admin'
  if (role === 'doctor') return '/doctor'
  return '/patient'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/api/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function logout() {
    try {
      await api.post('/api/auth/logout')
    } catch {
      // ignore
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
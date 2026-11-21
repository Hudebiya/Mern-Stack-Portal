import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import api from '../api/axios.js'

const AuthContext = createContext(null)

export function homeFor(role) {
  if (role === 'admin') return '/admin'
  if (role === 'doctor') return '/doctor'
  if (role === 'patient') return '/patient'
  return null
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null)
  const [loading, setLoading] = useState(true)
  const authUpdatedRef = useRef(false)

  const setUser = useCallback((nextUser) => {
    authUpdatedRef.current = true
    setUserState(nextUser)
  }, [])

  useEffect(() => {
    let active = true
    api
      .get('/api/auth/me')
      .then((res) => {
        if (active && !authUpdatedRef.current) setUserState(res.data.user)
      })
      .catch(() => {
        if (active && !authUpdatedRef.current) setUserState(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  async function logout() {
    try {
      await api.post('/api/auth/logout')
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('token')
      setUser(null)
    }
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
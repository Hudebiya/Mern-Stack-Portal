import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { homeFor, useAuth } from '../context/AuthContext.jsx'
import AuthLayout from '../components/AuthLayout.jsx'
import InputField from '../components/InputField.jsx'
import { getApiErrorMessage, loginUser } from '../api/axios.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Login() {
  const { user, setUser, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setServerError('')
  }

  function validate() {
    const nextErrors = {}
    if (!form.email.trim()) nextErrors.email = 'Email is required.'
    else if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (!form.password) nextErrors.password = 'Password is required.'
    else if (form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }
    return nextErrors
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setServerError('')

    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    try {
      const response = await loginUser({ email: form.email.trim(), password: form.password })
      const data = response?.data ?? response
      if (!data?.user?.role) throw new Error('Login response did not include a user.')
      if (data.token) localStorage.setItem('token', data.token)
      setUser(data.user)
      navigate(homeFor(data.user.role), { replace: true })
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'Unable to sign in. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Loading…</div>
  }
  const home = user && homeFor(user.role)
  if (home) return <Navigate to={home} replace />

  const successMessage = location.state?.successMessage

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to continue to your account."
      notice={
        serverError
          ? { type: 'error', message: serverError }
          : successMessage
            ? { type: 'success', message: successMessage }
            : null
      }
      footer={
        <>
          Don’t have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold text-indigo-600 transition hover:text-indigo-500"
          >
            Create one
          </Link>
        </>
      }
    >
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        <InputField
          id="email"
          label="Email address"
          type="email"
          value={form.email}
          onChange={updateField}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <InputField
          id="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={updateField}
          error={errors.password}
          placeholder="Enter your password"
          autoComplete="current-password"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting && (
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
          )}
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Login

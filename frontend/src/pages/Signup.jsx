import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import InputField from '../components/InputField.jsx'
import { getApiErrorMessage, registerUser } from '../api/axios.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
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
    if (!form.name.trim()) nextErrors.name = 'Name is required.'
    if (!form.email.trim()) nextErrors.email = 'Email is required.'
    else if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (!form.password) nextErrors.password = 'Password is required.'
    else if (form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }
    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password.'
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.'
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
      await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      navigate('/login', {
        replace: true,
        state: { successMessage: 'Your account was created. You can now sign in.' },
      })
    } catch (error) {
      setServerError(
        getApiErrorMessage(error, 'Unable to create your account. Please try again.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Get started with your Portal account."
      notice={serverError ? { type: 'error', message: serverError } : null}
      footer={
        <>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 transition hover:text-indigo-500"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4" noValidate onSubmit={handleSubmit}>
        <InputField
          id="name"
          label="Name"
          value={form.name}
          onChange={updateField}
          error={errors.name}
          placeholder="Your name"
          autoComplete="name"
        />
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
          placeholder="At least 6 characters"
          autoComplete="new-password"
        />
        <InputField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          value={form.confirmPassword}
          onChange={updateField}
          error={errors.confirmPassword}
          placeholder="Enter your password again"
          autoComplete="new-password"
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
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Signup

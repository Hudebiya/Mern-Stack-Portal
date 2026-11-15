import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || undefined,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function loginUser(credentials) {
  return api.post('/api/auth/login', credentials)
}

export function registerUser({ name, email, password }) {
  // The existing API names its required name field "username".
  return api.post('/api/auth/register', { username: name, email, password })
}

export function getApiErrorMessage(error, fallback) {
  return error.response?.data?.message || fallback
}

export default api

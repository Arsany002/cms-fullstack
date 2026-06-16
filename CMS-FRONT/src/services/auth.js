import api from './api'

export const login = (credentials) => api.post('/auth/login', credentials)
export const register = (data) => api.post('/auth/register', data)
export const logout = () => api.post('/auth/logout')
export const me = () => api.get('/auth/me')

/**
 * Build the backend Google redirect URL.
 * Redirecting the browser there starts the OAuth flow.
 *
 * @param {string|null} role      - 'doctor' | 'assistant' | null (login intent)
 * @param {string|null} clinicId  - required when role is doctor or assistant
 */
export const getGoogleRedirectUrl = (role = null, clinicId = null) => {
  const base = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001/api/v1').replace(/\/$/, '')
  const params = new URLSearchParams()
  if (role) params.set('role', role)
  if (clinicId) params.set('clinic_id', clinicId)
  const qs = params.toString()
  return `${base}/auth/google/redirect${qs ? '?' + qs : ''}`
}

/**
 * Exchange a one-time code (from the Google callback URL) for a Passport token + user.
 */
export const exchangeGoogleCode = (code) => api.post('/auth/google/exchange', { code })

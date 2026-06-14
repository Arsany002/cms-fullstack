import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import * as authService from '../services/auth'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('cms_user')) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('cms_token') || null)
  const [loading, setLoading] = useState(!!localStorage.getItem('cms_token'))

  // Verify token on mount
  useEffect(() => {
    if (!token) { setLoading(false); return }
    authService.me()
      .then((res) => setUser(res.data.data ?? res.data))
      .catch(() => { clearSession() })
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const saveSession = useCallback((userData, tokenValue) => {
    localStorage.setItem('cms_token', tokenValue)
    localStorage.setItem('cms_user', JSON.stringify(userData))
    setToken(tokenValue)
    setUser(userData)
  }, [])

  const clearSession = useCallback(() => {
    localStorage.removeItem('cms_token')
    localStorage.removeItem('cms_user')
    setToken(null)
    setUser(null)
  }, [])

  const login = useCallback(async (credentials) => {
    const res = await authService.login(credentials)
    const { user: u, token: t } = res.data.data
    saveSession(u, t)
    return u
  }, [saveSession])

  const register = useCallback(async (data) => {
    const res = await authService.register(data)
    const { user: u, token: t } = res.data.data
    saveSession(u, t)
    return u
  }, [saveSession])

  const logout = useCallback(async () => {
    try { await authService.logout() } catch {}
    clearSession()
  }, [clearSession])

  const value = useMemo(
    () => ({ user, token, loading, login, logout, register, isAuthenticated: !!token }),
    [user, token, loading, login, logout, register]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

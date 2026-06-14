import { useAuth } from './useAuth'

export function useRole() {
  const { user } = useAuth()
  return {
    role:          user?.role ?? null,
    isSuperAdmin:  user?.role === 'super_admin',
    isDoctor:      user?.role === 'doctor',
    isAssistant:   user?.role === 'assistant',
  }
}

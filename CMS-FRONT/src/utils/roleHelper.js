export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  DOCTOR:      'doctor',
  ASSISTANT:   'assistant',
}

export const ROLE_LABELS = {
  super_admin: 'Super Admin',
  doctor:      'Doctor',
  assistant:   'Assistant',
}

export function getDashboardPath(role) {
  if (role === ROLES.SUPER_ADMIN) return '/admin/dashboard'
  if (role === ROLES.DOCTOR)      return '/doctor/dashboard'
  return '/assistant/dashboard'
}

export function statusBadge(status) {
  const map = {
    pending:   'badge-yellow',
    confirmed: 'badge-blue',
    completed: 'badge-green',
    cancelled: 'badge-red',
  }
  return map[status] ?? 'badge-gray'
}

export function genderLabel(g) {
  return g === 'male' ? 'Male' : g === 'female' ? 'Female' : '—'
}

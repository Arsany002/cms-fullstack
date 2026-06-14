import api from './api'

export const getAppointments = (role, params) => {
  const base = roleBase(role)
  return api.get(`${base}/appointments`, { params })
}

export const getAppointment = (role, id) =>
  api.get(`${roleBase(role)}/appointments/${id}`)

export const createAppointment = (data) =>
  api.post('/assistant/appointments', data)

export const updateAppointment = (id, data) =>
  api.put(`/assistant/appointments/${id}`, data)

export const deleteAppointment = (id) =>
  api.delete(`/assistant/appointments/${id}`)

export const updateAppointmentStatus = (id, status) =>
  api.patch(`/doctor/appointments/${id}/status`, { status })

export const getAvailableSlots = (params) =>
  api.get('/assistant/available-slots', { params })

// Super Admin
export const getAdminAppointments = (params) =>
  api.get('/super-admin/appointments', { params })

export const getAdminPrescriptions = (params) =>
  api.get('/super-admin/prescriptions', { params })

function roleBase(role) {
  if (role === 'super_admin') return '/super-admin'
  if (role === 'doctor')      return '/doctor'
  return '/assistant'
}

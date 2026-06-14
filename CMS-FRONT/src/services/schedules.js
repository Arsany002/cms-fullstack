import api from './api'

const base = '/doctor/schedules'

export const getSchedules    = ()           => api.get(base)
export const getSchedule     = (id)         => api.get(`${base}/${id}`)
export const createSchedule  = (data)       => api.post(base, data)
export const updateSchedule  = (id, data)   => api.put(`${base}/${id}`, data)
export const deleteSchedule  = (id)         => api.delete(`${base}/${id}`)

import api from './api'

const base = '/super-admin/clinics'

export const getPublicClinics = ()           => api.get('/public/clinics')
export const getClinics       = (params)     => api.get(base, { params })
export const getClinic        = (id)         => api.get(`${base}/${id}`)
export const createClinic     = (data)       => api.post(base, data)
export const updateClinic     = (id, data)   => api.put(`${base}/${id}`, data)
export const toggleClinic     = (id)         => api.patch(`${base}/${id}/toggle`)

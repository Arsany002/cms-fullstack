import api from './api'

const base = '/doctor/prescriptions'

export const getPrescriptions   = (params)      => api.get(base, { params })
export const getPrescription    = (id)          => api.get(`${base}/${id}`)
export const createPrescription = (data)        => api.post(base, data)
export const updatePrescription = (id, data)    => api.put(`${base}/${id}`, data)

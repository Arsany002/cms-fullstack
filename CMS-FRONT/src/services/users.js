import api from './api'

const base = '/super-admin/users'

export const getUsers    = (params) => api.get(base, { params })
export const getUser     = (id)     => api.get(`${base}/${id}`)
export const createUser  = (data)   => api.post(base, data)
export const updateUser  = (id, data) => api.put(`${base}/${id}`, data)
export const toggleUser  = (id)     => api.patch(`${base}/${id}/toggle`)
export const changeRole  = (id, role) => api.patch(`${base}/${id}/role`, { role })

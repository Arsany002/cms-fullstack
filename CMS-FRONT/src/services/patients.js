import api from './api'

export const getPatients  = (role, params) => api.get(`/${rolePrefix(role)}/patients`, { params })
export const getPatient   = (role, id)     => api.get(`/${rolePrefix(role)}/patients/${id}`)
export const createPatient = (data)        => api.post('/assistant/patients', data)
export const updatePatient = (id, data)    => api.put(`/assistant/patients/${id}`, data)

function rolePrefix(role) {
  return role === 'doctor' ? 'doctor' : 'assistant'
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createAppointment, getAvailableSlots } from '../../../services/appointments'
import { getPatients } from '../../../services/patients'
import api from '../../../services/api'
import Select from '../../../components/common/Select'
import Input from '../../../components/common/Input'
import Button from '../../../components/common/Button'
import AlertMessage from '../../../components/common/AlertMessage'

export default function AppointmentBook() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [serverError, setServerError] = useState('')
  const [slotsParams, setSlotsParams] = useState(null)

  const { register, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = useForm()

  const doctorId   = watch('doctor_id')
  const apptDate   = watch('appointment_date')

  const { data: patientsData } = useQuery({
    queryKey: ['assistant-patients-all'],
    queryFn: () => getPatients('assistant', { per_page: 200 }),
    select: (r) => r.data.data ?? [],
  })

  const { data: doctorsData } = useQuery({
    queryKey: ['clinic-doctors'],
    queryFn: () => api.get('/assistant/doctors').then((r) => r.data.data ?? []).catch(() => []),
  })

  const { data: slots, isLoading: loadingSlots } = useQuery({
    queryKey: ['available-slots', doctorId, apptDate],
    queryFn: () => getAvailableSlots({ doctor_id: doctorId, date: apptDate }),
    enabled: !!doctorId && !!apptDate,
    select: (r) => r.data.slots ?? [],
  })

  const mutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['assistant-appointments'] }); navigate('/assistant/appointments') },
    onError: (err) => {
      const errs = err.response?.data?.errors
      if (errs) Object.entries(errs).forEach(([f, m]) => setError(f, { message: m[0] }))
      else setServerError(err.response?.data?.message ?? 'Booking failed')
    },
  })

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Book Appointment</h1>
      <div className="card">
        <AlertMessage message={serverError} />
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} noValidate>
          <Select label="Patient" error={errors.patient_id?.message}
            {...register('patient_id', { required: 'Patient is required' })}>
            <option value="">Select patient…</option>
            {(patientsData ?? []).map((p) => (
              <option key={p.id} value={p.id}>{p.name} {p.phone ? `· ${p.phone}` : ''}</option>
            ))}
          </Select>

          <Select label="Doctor" error={errors.doctor_id?.message}
            {...register('doctor_id', { required: 'Doctor is required' })}>
            <option value="">Select doctor…</option>
            {(doctorsData ?? []).map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </Select>

          <Input label="Appointment Date" type="date" error={errors.appointment_date?.message}
            min={new Date().toISOString().slice(0,10)}
            {...register('appointment_date', { required: 'Date is required' })} />

          <div className="mb-4">
            <label className="form-label">Time Slot</label>
            {loadingSlots && <p className="text-sm text-gray-400">Loading slots…</p>}
            {!loadingSlots && slots !== undefined && (
              slots.length === 0
                ? <p className="text-sm text-red-500">No available slots for selected doctor/date</p>
                : <select className={`form-input ${errors.start_time ? 'border-red-500' : ''}`}
                    {...register('start_time', { required: 'Time slot is required' })}>
                    <option value="">Pick a slot…</option>
                    {slots.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
            )}
            {!doctorId || !apptDate ? <p className="text-xs text-gray-400 mt-1">Select doctor and date first</p> : null}
            {errors.start_time && <p className="form-error">{errors.start_time.message}</p>}
          </div>

          <div className="mb-4">
            <label className="form-label">Notes (optional)</label>
            <textarea className="form-input" rows={2} {...register('notes')} />
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="secondary" type="button" onClick={() => navigate('/assistant/appointments')}>Cancel</Button>
            <Button type="submit" loading={mutation.isPending || isSubmitting}>Book</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

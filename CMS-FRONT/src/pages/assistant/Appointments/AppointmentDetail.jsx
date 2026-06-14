import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { getAppointment, updateAppointment, getAvailableSlots } from '../../../services/appointments'
import Spinner from '../../../components/common/Spinner'
import AlertMessage from '../../../components/common/AlertMessage'
import Button from '../../../components/common/Button'
import Input from '../../../components/common/Input'
import Modal from '../../../components/common/Modal'
import { statusBadge } from '../../../utils/roleHelper'

export default function AssistantAppointmentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [serverError, setServerError] = useState('')

  const { data: appt, isLoading, isError, error } = useQuery({
    queryKey: ['assistant-appointment', id],
    queryFn: () => getAppointment('assistant', id),
    select: (r) => r.data.data,
  })

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()

  const newDate    = watch('appointment_date')
  const doctorId   = appt?.doctor_id

  const { data: slots, isLoading: loadingSlots } = useQuery({
    queryKey: ['reschedule-slots', doctorId, newDate],
    queryFn: () => getAvailableSlots({ doctor_id: doctorId, date: newDate }),
    enabled: !!doctorId && !!newDate,
    select: (r) => r.data.slots ?? [],
  })

  const updateMut = useMutation({
    mutationFn: (d) => updateAppointment(id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['assistant-appointment', id] })
      qc.invalidateQueries({ queryKey: ['assistant-appointments'] })
      setRescheduleOpen(false)
    },
    onError: (err) => setServerError(err.response?.data?.message ?? 'Update failed'),
  })

  if (isLoading) return <Spinner size="lg" className="mt-20" />
  if (isError)   return <AlertMessage message={error?.response?.data?.message ?? 'Failed to load'} />

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">← Back</button>
        <h1 className="text-2xl font-bold text-gray-900">Appointment #{appt.id}</h1>
        <span className={statusBadge(appt.status)}>{appt.status}</span>
      </div>

      <div className="card mb-4 grid grid-cols-2 gap-4">
        <div><p className="text-xs text-gray-500">Patient</p><p className="font-medium">{appt.patient?.name}</p></div>
        <div><p className="text-xs text-gray-500">Doctor</p><p className="font-medium">{appt.doctor?.name}</p></div>
        <div><p className="text-xs text-gray-500">Date</p><p className="font-medium">{appt.appointment_date}</p></div>
        <div><p className="text-xs text-gray-500">Time</p><p className="font-medium">{appt.start_time}</p></div>
        {appt.notes && <div className="col-span-2"><p className="text-xs text-gray-500">Notes</p><p>{appt.notes}</p></div>}
      </div>

      {appt.status !== 'cancelled' && appt.status !== 'completed' && (
        <div className="flex gap-3">
          <Button onClick={() => setRescheduleOpen(true)}>Reschedule</Button>
        </div>
      )}

      <Modal isOpen={rescheduleOpen} onClose={() => setRescheduleOpen(false)} title="Reschedule Appointment">
        <AlertMessage message={serverError} />
        <form onSubmit={handleSubmit((d) => updateMut.mutate(d))} noValidate>
          <Input label="New Date" type="date" error={errors.appointment_date?.message}
            min={new Date().toISOString().slice(0,10)}
            {...register('appointment_date', { required: 'Date is required' })} />

          <div className="mb-4">
            <label className="form-label">New Time Slot</label>
            {loadingSlots && <p className="text-sm text-gray-400">Loading…</p>}
            {!newDate && <p className="text-xs text-gray-400">Select date first</p>}
            {!loadingSlots && slots !== undefined && (
              <select className={`form-input ${errors.start_time ? 'border-red-500' : ''}`}
                {...register('start_time', { required: 'Slot is required' })}>
                <option value="">Pick a slot…</option>
                {slots.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
            {errors.start_time && <p className="form-error">{errors.start_time.message}</p>}
          </div>

          <div className="mb-4">
            <label className="form-label">Notes</label>
            <textarea className="form-input" rows={2} defaultValue={appt.notes ?? ''} {...register('notes')} />
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="secondary" type="button" onClick={() => setRescheduleOpen(false)}>Cancel</Button>
            <Button type="submit" loading={updateMut.isPending || isSubmitting}>Reschedule</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPrescription, createPrescription, updatePrescription } from '../../../services/prescriptions'
import { getAppointments } from '../../../services/appointments'
import Input from '../../../components/common/Input'
import Select from '../../../components/common/Select'
import Button from '../../../components/common/Button'
import AlertMessage from '../../../components/common/AlertMessage'
import Spinner from '../../../components/common/Spinner'

export default function PrescriptionForm() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const preApptId = searchParams.get('appointment_id')
  const isEdit    = !!id
  const navigate  = useNavigate()
  const qc = useQueryClient()
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, reset, setError, control, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { appointment_id: preApptId ?? '', diagnosis: '', notes: '', items: [{ medicine_name: '', dosage: '', frequency: '', duration: '', notes: '' }] },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  const { data: appts } = useQuery({
    queryKey: ['doctor-appointments-all'],
    queryFn: () => getAppointments('doctor', { per_page: 100, status: 'confirmed' }),
    select: (r) => r.data.data ?? [],
  })

  const { data: existingData, isLoading } = useQuery({
    queryKey: ['prescription', id],
    queryFn: () => getPrescription(id),
    enabled: isEdit,
    select: (r) => r.data.data,
  })

  useEffect(() => { if (existingData) reset(existingData) }, [existingData, reset])

  const mutation = useMutation({
    mutationFn: (d) => isEdit ? updatePrescription(id, d) : createPrescription(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['prescriptions'] }); navigate('/doctor/prescriptions') },
    onError: (err) => {
      const errs = err.response?.data?.errors
      if (errs) Object.entries(errs).forEach(([f, m]) => setError(f, { message: m[0] }))
      else setServerError(err.response?.data?.message ?? 'Save failed')
    },
  })

  if (isLoading) return <Spinner size="lg" className="mt-20" />

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Prescription' : 'New Prescription'}</h1>
      <div className="card">
        <AlertMessage message={serverError} />
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} noValidate>

          <Select label="Appointment" error={errors.appointment_id?.message}
            {...register('appointment_id', { required: 'Appointment is required' })}>
            <option value="">Select appointment…</option>
            {(appts ?? []).map((a) => (
              <option key={a.id} value={a.id}>
                #{a.id} — {a.patient?.name} — {a.appointment_date} {a.start_time}
              </option>
            ))}
          </Select>

          <div className="mb-4">
            <label htmlFor="diagnosis" className="form-label">Diagnosis</label>
            <textarea id="diagnosis" className={`form-input ${errors.diagnosis ? 'border-red-500' : ''}`} rows={3}
              {...register('diagnosis', { required: 'Diagnosis is required' })} />
            {errors.diagnosis && <p className="form-error">{errors.diagnosis.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="notes" className="form-label">Notes</label>
            <textarea id="notes" className="form-input" rows={2} {...register('notes')} />
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="form-label mb-0">Medications</p>
              <button type="button" className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                onClick={() => append({ medicine_name: '', dosage: '', frequency: '', duration: '', notes: '' })}>
                + Add Item
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, idx) => (
                <div key={field.id} className="border border-gray-200 rounded-lg p-4 relative">
                  <button type="button" className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xs"
                    onClick={() => remove(idx)}>✕</button>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Medicine" error={errors.items?.[idx]?.medicine_name?.message}
                      {...register(`items.${idx}.medicine_name`, { required: 'Required' })} />
                    <Input label="Dosage" error={errors.items?.[idx]?.dosage?.message}
                      {...register(`items.${idx}.dosage`, { required: 'Required' })} />
                    <Input label="Frequency" error={errors.items?.[idx]?.frequency?.message}
                      {...register(`items.${idx}.frequency`, { required: 'Required' })} />
                    <Input label="Duration" error={errors.items?.[idx]?.duration?.message}
                      {...register(`items.${idx}.duration`, { required: 'Required' })} />
                    <div className="col-span-2">
                      <Input label="Notes (optional)" {...register(`items.${idx}.notes`)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-4">
            <Button variant="secondary" type="button" onClick={() => navigate('/doctor/prescriptions')}>Cancel</Button>
            <Button type="submit" loading={mutation.isPending || isSubmitting}>
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

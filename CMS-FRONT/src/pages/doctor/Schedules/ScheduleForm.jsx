import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSchedule, createSchedule, updateSchedule } from '../../../services/schedules'
import Input from '../../../components/common/Input'
import Select from '../../../components/common/Select'
import Button from '../../../components/common/Button'
import AlertMessage from '../../../components/common/AlertMessage'
import Spinner from '../../../components/common/Spinner'

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

export default function ScheduleForm() {
  const { id } = useParams()
  const isEdit  = !!id
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm()

  const { data, isLoading } = useQuery({
    queryKey: ['schedule', id],
    queryFn: () => getSchedule(id),
    enabled: isEdit,
    select: (r) => r.data.data,
  })

  useEffect(() => { if (data) reset(data) }, [data, reset])

  const mutation = useMutation({
    mutationFn: (d) => isEdit ? updateSchedule(id, d) : createSchedule(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['schedules'] }); navigate('/doctor/schedules') },
    onError: (err) => {
      const errs = err.response?.data?.errors
      if (errs) Object.entries(errs).forEach(([f, m]) => setError(f, { message: m[0] }))
      else setServerError(err.response?.data?.message ?? 'Save failed')
    },
  })

  if (isLoading) return <Spinner size="lg" className="mt-20" />

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Schedule' : 'New Schedule'}</h1>
      <div className="card">
        <AlertMessage message={serverError} />
        <form onSubmit={handleSubmit((d) => mutation.mutate({ ...d, day_of_week: Number(d.day_of_week), slot_duration: Number(d.slot_duration) }))} noValidate>
          <Select label="Day of Week" error={errors.day_of_week?.message}
            {...register('day_of_week', { required: 'Day is required' })}>
            <option value="">Select day…</option>
            {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
          </Select>
          <Input label="Start Time" type="time" error={errors.start_time?.message}
            {...register('start_time', { required: 'Start time is required' })} />
          <Input label="End Time" type="time" error={errors.end_time?.message}
            {...register('end_time', { required: 'End time is required' })} />
          <Input label="Slot Duration (minutes)" type="number" min={5} error={errors.slot_duration?.message}
            {...register('slot_duration', { required: 'Slot duration is required', min: { value: 5, message: 'Minimum 5 min' } })} />
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" type="button" onClick={() => navigate('/doctor/schedules')}>Cancel</Button>
            <Button type="submit" loading={mutation.isPending || isSubmitting}>
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

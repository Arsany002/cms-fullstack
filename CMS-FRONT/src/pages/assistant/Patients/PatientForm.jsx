import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPatient, createPatient, updatePatient } from '../../../services/patients'
import Input from '../../../components/common/Input'
import Select from '../../../components/common/Select'
import Button from '../../../components/common/Button'
import AlertMessage from '../../../components/common/AlertMessage'
import Spinner from '../../../components/common/Spinner'

export default function PatientForm() {
  const { id } = useParams()
  const isEdit  = !!id
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm()

  const { data, isLoading } = useQuery({
    queryKey: ['assistant-patient', id],
    queryFn: () => getPatient('assistant', id),
    enabled: isEdit,
    select: (r) => r.data.data,
  })

  useEffect(() => { if (data) reset(data) }, [data, reset])

  const mutation = useMutation({
    mutationFn: (d) => isEdit ? updatePatient(id, d) : createPatient(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['assistant-patients'] }); navigate('/assistant/patients') },
    onError: (err) => {
      const errs = err.response?.data?.errors
      if (errs) Object.entries(errs).forEach(([f, m]) => setError(f, { message: m[0] }))
      else setServerError(err.response?.data?.message ?? 'Save failed')
    },
  })

  if (isLoading) return <Spinner size="lg" className="mt-20" />

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Patient' : 'New Patient'}</h1>
      <div className="card">
        <AlertMessage message={serverError} />
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} noValidate>
          <Input label="Full Name" error={errors.name?.message}
            {...register('name', { required: 'Name is required' })} />
          <Input label="Phone" type="tel" error={errors.phone?.message}
            {...register('phone')} />
          <Input label="Email" type="email" error={errors.email?.message}
            {...register('email')} />
          <Input label="Date of Birth" type="date" error={errors.date_of_birth?.message}
            {...register('date_of_birth')} />
          <Select label="Gender" error={errors.gender?.message}
            {...register('gender', { required: 'Gender is required' })}>
            <option value="">Select gender…</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Select>
          <Input label="Address" error={errors.address?.message}
            {...register('address')} />
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" type="button" onClick={() => navigate('/assistant/patients')}>Cancel</Button>
            <Button type="submit" loading={mutation.isPending || isSubmitting}>
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

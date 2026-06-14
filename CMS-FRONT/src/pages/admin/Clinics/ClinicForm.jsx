import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getClinic, createClinic, updateClinic } from '../../../services/clinics'
import Input from '../../../components/common/Input'
import Button from '../../../components/common/Button'
import AlertMessage from '../../../components/common/AlertMessage'
import Spinner from '../../../components/common/Spinner'

export default function ClinicForm() {
  const { id } = useParams()
  const isEdit  = !!id
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm()

  const { data, isLoading } = useQuery({
    queryKey: ['clinic', id],
    queryFn: () => getClinic(id),
    enabled: isEdit,
    select: (r) => r.data.data,
  })

  useEffect(() => { if (data) reset(data) }, [data, reset])

  const mutation = useMutation({
    mutationFn: (d) => isEdit ? updateClinic(id, d) : createClinic(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['clinics'] }); navigate('/admin/clinics') },
    onError: (err) => {
      const errs = err.response?.data?.errors
      if (errs) Object.entries(errs).forEach(([f, m]) => setError(f, { message: m[0] }))
      else setServerError(err.response?.data?.message ?? 'Save failed')
    },
  })

  if (isLoading) return <Spinner size="lg" className="mt-20" />

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Clinic' : 'New Clinic'}</h1>
      <div className="card">
        <AlertMessage message={serverError} />
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} noValidate>
          <Input label="Name" error={errors.name?.message}
            {...register('name', { required: 'Name is required' })} />
          <Input label="Address" error={errors.address?.message}
            {...register('address', { required: 'Address is required' })} />
          <Input label="Phone" type="tel" error={errors.phone?.message}
            {...register('phone')} />
          <Input label="Email" type="email" error={errors.email?.message}
            {...register('email')} />
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" type="button" onClick={() => navigate('/admin/clinics')}>Cancel</Button>
            <Button type="submit" loading={mutation.isPending || isSubmitting}>
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

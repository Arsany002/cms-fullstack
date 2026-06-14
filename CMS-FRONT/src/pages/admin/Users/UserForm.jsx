import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUser, createUser, updateUser } from '../../../services/users'
import { getClinics } from '../../../services/clinics'
import Input from '../../../components/common/Input'
import Select from '../../../components/common/Select'
import Button from '../../../components/common/Button'
import AlertMessage from '../../../components/common/AlertMessage'
import Spinner from '../../../components/common/Spinner'

export default function UserForm() {
  const { id } = useParams()
  const isEdit  = !!id
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm()

  const { data: userData, isLoading: loadingUser } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
    enabled: isEdit,
    select: (r) => r.data.data,
  })

  const { data: clinicsData } = useQuery({
    queryKey: ['clinics-all'],
    queryFn: () => getClinics({ per_page: 100 }),
    select: (r) => r.data.data?.data ?? r.data.data ?? [],
  })

  useEffect(() => { if (userData) reset(userData) }, [userData, reset])

  const mutation = useMutation({
    mutationFn: (d) => isEdit ? updateUser(id, d) : createUser(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); navigate('/admin/users') },
    onError: (err) => {
      const errs = err.response?.data?.errors
      if (errs) Object.entries(errs).forEach(([f, m]) => setError(f, { message: m[0] }))
      else setServerError(err.response?.data?.message ?? 'Save failed')
    },
  })

  if (loadingUser) return <Spinner size="lg" className="mt-20" />

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit User' : 'New User'}</h1>
      <div className="card">
        <AlertMessage message={serverError} />
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} noValidate>
          <Input label="Name" error={errors.name?.message}
            {...register('name', { required: 'Name is required' })} />
          <Input label="Email" type="email" error={errors.email?.message}
            {...register('email', { required: 'Email is required' })} />
          {!isEdit && (
            <Input label="Password" type="password" error={errors.password?.message}
              {...register('password', { required: 'Password is required' })} />
          )}
          <Input label="Phone" type="tel" error={errors.phone?.message}
            {...register('phone')} />
          <Select label="Role" error={errors.role?.message}
            {...register('role', { required: 'Role is required' })}>
            <option value="">Select role…</option>
            <option value="doctor">Doctor</option>
            <option value="assistant">Assistant</option>
            <option value="super_admin">Super Admin</option>
          </Select>
          <Select label="Clinic" error={errors.clinic_id?.message}
            {...register('clinic_id')}>
            <option value="">No clinic</option>
            {(clinicsData ?? []).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" type="button" onClick={() => navigate('/admin/users')}>Cancel</Button>
            <Button type="submit" loading={mutation.isPending || isSubmitting}>
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

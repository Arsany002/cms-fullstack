import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import { getDashboardPath } from '../../utils/roleHelper'
import { getClinics } from '../../services/clinics'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Button from '../../components/common/Button'
import AlertMessage from '../../components/common/AlertMessage'

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const { register, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = useForm()

  const role = watch('role')

  const { data: clinicsData } = useQuery({
    queryKey: ['clinics-list'],
    queryFn: () => getClinics({ per_page: 100 }),
    select: (res) => res.data.data?.data ?? res.data.data ?? [],
  })

  const onSubmit = async (data) => {
    setServerError('')
    try {
      const user = await registerUser(data)
      navigate(getDashboardPath(user.role), { replace: true })
    } catch (err) {
      const errors422 = err.response?.data?.errors
      if (errors422) {
        Object.entries(errors422).forEach(([field, msgs]) =>
          setError(field, { message: msgs[0] })
        )
      } else {
        setServerError(err.response?.data?.message ?? 'Registration failed.')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary-600 text-white text-2xl font-bold mb-4">C</div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
        </div>

        <div className="card">
          <AlertMessage type="error" message={serverError} />
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input label="Full Name" type="text" placeholder="John Doe" error={errors.name?.message}
              {...register('name', { required: 'Name is required' })} />
            <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
              })} />
            <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message}
              {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })} />
            <Input label="Confirm Password" type="password" placeholder="••••••••" error={errors.password_confirmation?.message}
              {...register('password_confirmation', { required: 'Please confirm password' })} />

            <Select label="Role" error={errors.role?.message}
              {...register('role', { required: 'Role is required' })}>
              <option value="">Select role…</option>
              <option value="doctor">Doctor</option>
              <option value="assistant">Assistant</option>
            </Select>

            {(role === 'doctor' || role === 'assistant') && (
              <Select label="Clinic" error={errors.clinic_id?.message}
                {...register('clinic_id', { required: 'Clinic is required' })}>
                <option value="">Select clinic…</option>
                {(clinicsData ?? []).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            )}

            <Button type="submit" className="w-full mt-2" loading={isSubmitting}>
              Create Account
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

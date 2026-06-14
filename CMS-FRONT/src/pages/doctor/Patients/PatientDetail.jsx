import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPatient } from '../../../services/patients'
import Spinner from '../../../components/common/Spinner'
import AlertMessage from '../../../components/common/AlertMessage'
import { genderLabel } from '../../../utils/roleHelper'

export default function DoctorPatientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: patient, isLoading, isError, error } = useQuery({
    queryKey: ['doctor-patient', id],
    queryFn: () => getPatient('doctor', id),
    select: (r) => r.data.data,
  })

  if (isLoading) return <Spinner size="lg" className="mt-20" />
  if (isError)   return <AlertMessage message={error?.response?.data?.message ?? 'Failed to load'} />

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">← Back</button>
        <h1 className="text-2xl font-bold text-gray-900">Patient: {patient.name}</h1>
      </div>

      <div className="card grid grid-cols-2 gap-4">
        <Detail label="Full Name"    value={patient.name} />
        <Detail label="Phone"        value={patient.phone} />
        <Detail label="Email"        value={patient.email} />
        <Detail label="Gender"       value={genderLabel(patient.gender)} />
        <Detail label="Date of Birth" value={patient.date_of_birth} />
        <Detail label="Address"      value={patient.address} />
      </div>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value ?? '—'}</p>
    </div>
  )
}

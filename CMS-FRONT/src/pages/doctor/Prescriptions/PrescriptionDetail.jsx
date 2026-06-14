import { useNavigate, useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPrescription } from '../../../services/prescriptions'
import Spinner from '../../../components/common/Spinner'
import AlertMessage from '../../../components/common/AlertMessage'
import Button from '../../../components/common/Button'

export default function PrescriptionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: rx, isLoading, isError, error } = useQuery({
    queryKey: ['prescription', id],
    queryFn: () => getPrescription(id),
    select: (r) => r.data.data,
  })

  if (isLoading) return <Spinner size="lg" className="mt-20" />
  if (isError)   return <AlertMessage message={error?.response?.data?.message ?? 'Failed to load'} />

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">← Back</button>
        <h1 className="text-2xl font-bold text-gray-900">Prescription #{rx.id}</h1>
        <Link to={`/doctor/prescriptions/${rx.id}/edit`} className="ml-auto">
          <Button variant="secondary">Edit</Button>
        </Link>
      </div>

      <div className="card mb-4 grid grid-cols-2 gap-4">
        <div><p className="text-xs text-gray-500">Patient</p><p className="font-medium">{rx.appointment?.patient?.name ?? '—'}</p></div>
        <div><p className="text-xs text-gray-500">Appointment Date</p><p className="font-medium">{rx.appointment?.appointment_date ?? '—'}</p></div>
        <div className="col-span-2"><p className="text-xs text-gray-500">Diagnosis</p><p>{rx.diagnosis}</p></div>
        {rx.notes && <div className="col-span-2"><p className="text-xs text-gray-500">Notes</p><p>{rx.notes}</p></div>}
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-3">Medications</h2>
        <div className="divide-y divide-gray-100">
          {(rx.items ?? []).map((item, i) => (
            <div key={i} className="py-3 grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-500">Medicine: </span><span className="font-medium">{item.medicine_name}</span></div>
              <div><span className="text-gray-500">Dosage: </span>{item.dosage}</div>
              <div><span className="text-gray-500">Frequency: </span>{item.frequency}</div>
              <div><span className="text-gray-500">Duration: </span>{item.duration}</div>
              {item.notes && <div className="col-span-2"><span className="text-gray-500">Notes: </span>{item.notes}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

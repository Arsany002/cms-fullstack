import { useNavigate, useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAppointment, updateAppointmentStatus } from '../../../services/appointments'
import Spinner from '../../../components/common/Spinner'
import AlertMessage from '../../../components/common/AlertMessage'
import Button from '../../../components/common/Button'
import { statusBadge } from '../../../utils/roleHelper'

export default function DoctorAppointmentDetail() {
  const { id } = useParams()
  const qc = useQueryClient()
  const navigate = useNavigate()

  const { data: appt, isLoading, isError, error } = useQuery({
    queryKey: ['doctor-appointment', id],
    queryFn: () => getAppointment('doctor', id),
    select: (r) => r.data.data,
  })

  const statusMut = useMutation({
    mutationFn: (status) => updateAppointmentStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['doctor-appointment', id] }),
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
        <div><p className="text-xs text-gray-500">Date</p><p className="font-medium">{appt.appointment_date}</p></div>
        <div><p className="text-xs text-gray-500">Time</p><p className="font-medium">{appt.start_time}</p></div>
        <div><p className="text-xs text-gray-500">Phone</p><p className="font-medium">{appt.patient?.phone ?? '—'}</p></div>
        {appt.notes && (
          <div className="col-span-2"><p className="text-xs text-gray-500">Notes</p><p>{appt.notes}</p></div>
        )}
      </div>

      <div className="card flex gap-3 flex-wrap">
        <p className="text-sm font-medium text-gray-700 self-center mr-2">Update Status:</p>
        {['confirmed', 'completed'].map((s) => (
          <Button
            key={s}
            variant={s === 'completed' ? 'success' : 'primary'}
            className="text-sm"
            disabled={appt.status === s}
            loading={statusMut.isPending && statusMut.variables === s}
            onClick={() => statusMut.mutate(s)}
          >
            Mark {s}
          </Button>
        ))}
        <Link to={`/doctor/prescriptions/new?appointment_id=${appt.id}`} className="ml-auto">
          <Button variant="secondary">+ Write Prescription</Button>
        </Link>
      </div>
    </div>
  )
}

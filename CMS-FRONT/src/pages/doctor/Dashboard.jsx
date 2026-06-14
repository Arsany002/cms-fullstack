import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import { getAppointments } from '../../services/appointments'
import { getPrescriptions } from '../../services/prescriptions'
import Spinner from '../../components/common/Spinner'
import { statusBadge } from '../../utils/roleHelper'

export default function DoctorDashboard() {
  const { user } = useAuth()
  const today = new Date().toISOString().slice(0, 10)

  const { data: apptData, isLoading: loadingAppts } = useQuery({
    queryKey: ['doctor-today-appointments'],
    queryFn: () => getAppointments('doctor', { date: today, per_page: 5 }),
    select: (r) => r.data.data?.data ?? [],
  })

  const { data: rxData, isLoading: loadingRx } = useQuery({
    queryKey: ['doctor-recent-prescriptions'],
    queryFn: () => getPrescriptions({ per_page: 5 }),
    select: (r) => r.data.data?.data ?? [],
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, Dr. {user?.name}</h1>
      <p className="text-gray-500 mb-6">Today: {today}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Today's Appointments</h2>
          {loadingAppts ? <Spinner /> : (
            <ul className="divide-y divide-gray-100">
              {(apptData ?? []).map((a) => (
                <li key={a.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{a.patient?.name}</p>
                    <p className="text-xs text-gray-400">{a.start_time}</p>
                  </div>
                  <span className={statusBadge(a.status)}>{a.status}</span>
                </li>
              ))}
              {(apptData ?? []).length === 0 && <p className="text-gray-400 text-sm">No appointments today</p>}
            </ul>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Recent Prescriptions</h2>
          {loadingRx ? <Spinner /> : (
            <ul className="divide-y divide-gray-100">
              {(rxData ?? []).map((p) => (
                <li key={p.id} className="py-3">
                  <p className="font-medium">{p.appointment?.patient?.name ?? '—'}</p>
                  <p className="text-xs text-gray-400 truncate">{p.diagnosis}</p>
                </li>
              ))}
              {(rxData ?? []).length === 0 && <p className="text-gray-400 text-sm">No prescriptions yet</p>}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

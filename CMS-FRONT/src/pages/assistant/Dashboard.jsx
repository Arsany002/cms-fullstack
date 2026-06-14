import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import { getAppointments } from '../../services/appointments'
import Spinner from '../../components/common/Spinner'
import { statusBadge } from '../../utils/roleHelper'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'

export default function AssistantDashboard() {
  const { user } = useAuth()
  const today = new Date().toISOString().slice(0, 10)

  const { data: apptData, isLoading } = useQuery({
    queryKey: ['assistant-today-appointments'],
    queryFn: () => getAppointments('assistant', { date: today, per_page: 10 }),
    select: (r) => r.data.data?.data ?? [],
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {user?.name}</h1>
      <p className="text-gray-500 mb-6">Today: {today}</p>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Today's Appointments</h2>
          <Link to="/assistant/appointments/new"><Button className="text-sm">+ Book Appointment</Button></Link>
        </div>
        {isLoading ? <Spinner /> : (
          <div className="divide-y divide-gray-100">
            {(apptData ?? []).map((a) => (
              <div key={a.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{a.patient?.name}</p>
                  <p className="text-xs text-gray-400">Dr. {a.doctor?.name} · {a.start_time}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={statusBadge(a.status)}>{a.status}</span>
                  <Link to={`/assistant/appointments/${a.id}`}>
                    <Button variant="secondary" className="text-xs py-1 px-2">View</Button>
                  </Link>
                </div>
              </div>
            ))}
            {(apptData ?? []).length === 0 && <p className="text-gray-400 text-sm">No appointments today</p>}
          </div>
        )}
      </div>
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'
import Spinner from '../../components/common/Spinner'
import AlertMessage from '../../components/common/AlertMessage'

const fetchStats = () => api.get('/super-admin/dashboard').then((r) => r.data.data)

function StatCard({ label, value, icon, color }) {
  const colors = {
    blue:   'bg-blue-50 text-blue-600',
    green:  'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    rose:   'bg-rose-50 text-rose-600',
    teal:   'bg-teal-50 text-teal-600',
  }
  return (
    <div className="card flex items-center gap-4">
      <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-2xl ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { data, isLoading, isError, error } = useQuery({ queryKey: ['admin-stats'], queryFn: fetchStats })

  if (isLoading) return <Spinner size="lg" className="mt-20" />
  if (isError)   return <AlertMessage message={error?.response?.data?.message ?? 'Failed to load stats'} />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">System Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Clinics"       value={data.total_clinics}       icon="🏥" color="blue"   />
        <StatCard label="Total Users"         value={data.total_users}         icon="👥" color="green"  />
        <StatCard label="Total Patients"      value={data.total_patients}      icon="🧑‍⚕️" color="purple" />
        <StatCard label="Total Appointments"  value={data.total_appointments}  icon="📅" color="yellow" />
        <StatCard label="Total Prescriptions" value={data.total_prescriptions} icon="💊" color="rose"   />
        <StatCard label="Appointments Today"  value={data.appointments_today}  icon="📌" color="teal"   />
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getAppointments } from '../../../services/appointments'
import Spinner from '../../../components/common/Spinner'
import AlertMessage from '../../../components/common/AlertMessage'
import Pagination from '../../../components/common/Pagination'
import Button from '../../../components/common/Button'
import { statusBadge } from '../../../utils/roleHelper'

export default function DoctorAppointmentsList() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ date: '', status: '' })

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['doctor-appointments', page, filters],
    queryFn: () => getAppointments('doctor', { page, ...filters }),
    select: (r) => r.data,
  })

  const appointments = data?.data?.data ?? []
  const meta         = data?.data?.meta ?? null

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Appointments</h1>

      <div className="card mb-4 flex flex-wrap gap-3">
        <input type="date" className="form-input w-auto"
          value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
        <select className="form-input w-auto" value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button className="btn-secondary text-sm" onClick={() => { setFilters({ date: '', status: '' }); setPage(1) }}>Clear</button>
      </div>

      {isLoading && <Spinner size="lg" className="mt-10" />}
      {isError   && <AlertMessage message={error?.response?.data?.message ?? 'Failed to load'} />}

      {!isLoading && !isError && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr><th>#</th><th>Patient</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td className="text-gray-400">{a.id}</td>
                  <td className="font-medium">{a.patient?.name ?? '—'}</td>
                  <td>{a.appointment_date}</td>
                  <td>{a.start_time}</td>
                  <td><span className={statusBadge(a.status)}>{a.status}</span></td>
                  <td>
                    <Link to={`/doctor/appointments/${a.id}`}>
                      <Button variant="secondary" className="text-xs py-1 px-2">View</Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">No appointments found</td></tr>
              )}
            </tbody>
          </table>
          <Pagination meta={meta} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

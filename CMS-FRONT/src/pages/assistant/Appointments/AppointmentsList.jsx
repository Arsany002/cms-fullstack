import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getAppointments, deleteAppointment } from '../../../services/appointments'
import Spinner from '../../../components/common/Spinner'
import AlertMessage from '../../../components/common/AlertMessage'
import Pagination from '../../../components/common/Pagination'
import Button from '../../../components/common/Button'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import { statusBadge } from '../../../utils/roleHelper'

export default function AssistantAppointmentsList() {
  const [page, setPage]     = useState(1)
  const [filters, setFilters] = useState({ date: '', status: '' })
  const [cancelId, setCancelId] = useState(null)
  const qc = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['assistant-appointments', page, filters],
    queryFn: () => getAppointments('assistant', { page, ...filters }),
    select: (r) => r.data,
  })

  const deleteMut = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['assistant-appointments'] }); setCancelId(null) },
  })

  const appointments = data?.data ?? []
  const meta         = data?.meta ?? null

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <Link to="/assistant/appointments/new"><Button>+ Book Appointment</Button></Link>
      </div>

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
              <tr><th>#</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td className="text-gray-400">{a.id}</td>
                  <td className="font-medium">{a.patient?.name ?? '—'}</td>
                  <td>{a.doctor?.name ?? '—'}</td>
                  <td>{a.appointment_date}</td>
                  <td>{a.start_time}</td>
                  <td><span className={statusBadge(a.status)}>{a.status}</span></td>
                  <td className="flex gap-2">
                    <Link to={`/assistant/appointments/${a.id}`}>
                      <Button variant="secondary" className="text-xs py-1 px-2">View</Button>
                    </Link>
                    {a.status !== 'cancelled' && a.status !== 'completed' && (
                      <Button variant="danger" className="text-xs py-1 px-2" onClick={() => setCancelId(a.id)}>
                        Cancel
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-gray-400">No appointments found</td></tr>
              )}
            </tbody>
          </table>
          <Pagination meta={meta} onPageChange={setPage} />
        </div>
      )}

      <ConfirmDialog
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={() => deleteMut.mutate(cancelId)}
        loading={deleteMut.isPending}
        title="Cancel Appointment"
        message="Cancel this appointment? This action cannot be undone."
      />
    </div>
  )
}

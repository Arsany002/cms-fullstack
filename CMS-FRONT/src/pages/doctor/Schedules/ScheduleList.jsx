import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getSchedules, deleteSchedule } from '../../../services/schedules'
import Spinner from '../../../components/common/Spinner'
import AlertMessage from '../../../components/common/AlertMessage'
import Button from '../../../components/common/Button'
import ConfirmDialog from '../../../components/common/ConfirmDialog'

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

export default function ScheduleList() {
  const [deleteId, setDeleteId] = useState(null)
  const qc = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['schedules'],
    queryFn: getSchedules,
    select: (r) => r.data.data ?? [],
  })

  const deleteMut = useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['schedules'] }); setDeleteId(null) },
  })

  if (isLoading) return <Spinner size="lg" className="mt-20" />
  if (isError)   return <AlertMessage message={error?.response?.data?.message ?? 'Failed to load schedules'} />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Schedules</h1>
        <Link to="/doctor/schedules/new"><Button>+ New Schedule</Button></Link>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr><th>Day</th><th>Start</th><th>End</th><th>Slot (min)</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {(data ?? []).map((s) => (
              <tr key={s.id}>
                <td className="font-medium">{DAYS[s.day_of_week]}</td>
                <td>{s.start_time}</td>
                <td>{s.end_time}</td>
                <td>{s.slot_duration}</td>
                <td className="flex gap-2">
                  <Link to={`/doctor/schedules/${s.id}/edit`}>
                    <Button variant="secondary" className="text-xs py-1 px-2">Edit</Button>
                  </Link>
                  <Button variant="danger" className="text-xs py-1 px-2" onClick={() => setDeleteId(s.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {(data ?? []).length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">No schedules yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMut.mutate(deleteId)}
        loading={deleteMut.isPending}
        title="Delete Schedule"
        message="Are you sure you want to delete this schedule?"
      />
    </div>
  )
}

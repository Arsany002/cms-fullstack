import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getPrescriptions } from '../../../services/prescriptions'
import Spinner from '../../../components/common/Spinner'
import AlertMessage from '../../../components/common/AlertMessage'
import Pagination from '../../../components/common/Pagination'
import Button from '../../../components/common/Button'

export default function PrescriptionList() {
  const [page, setPage] = useState(1)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['prescriptions', page],
    queryFn: () => getPrescriptions({ page }),
    select: (r) => r.data,
  })

  const prescriptions = data?.data?.data ?? []
  const meta          = data?.data?.meta ?? null

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
        <Link to="/doctor/prescriptions/new"><Button>+ New Prescription</Button></Link>
      </div>

      {isLoading && <Spinner size="lg" className="mt-10" />}
      {isError   && <AlertMessage message={error?.response?.data?.message ?? 'Failed to load'} />}

      {!isLoading && !isError && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr><th>#</th><th>Patient</th><th>Diagnosis</th><th>Items</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {prescriptions.map((p) => (
                <tr key={p.id}>
                  <td className="text-gray-400">{p.id}</td>
                  <td className="font-medium">{p.appointment?.patient?.name ?? '—'}</td>
                  <td className="max-w-xs truncate">{p.diagnosis}</td>
                  <td>{p.items?.length ?? 0}</td>
                  <td>{p.created_at?.slice(0, 10)}</td>
                  <td className="flex gap-2">
                    <Link to={`/doctor/prescriptions/${p.id}`}>
                      <Button variant="secondary" className="text-xs py-1 px-2">View</Button>
                    </Link>
                    <Link to={`/doctor/prescriptions/${p.id}/edit`}>
                      <Button variant="secondary" className="text-xs py-1 px-2">Edit</Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {prescriptions.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">No prescriptions yet</td></tr>
              )}
            </tbody>
          </table>
          <Pagination meta={meta} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

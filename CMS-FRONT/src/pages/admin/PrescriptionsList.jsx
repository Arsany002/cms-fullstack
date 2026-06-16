import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAdminPrescriptions } from '../../services/appointments'
import Spinner from '../../components/common/Spinner'
import AlertMessage from '../../components/common/AlertMessage'
import Pagination from '../../components/common/Pagination'

export default function AdminPrescriptionsList() {
  const [page, setPage] = useState(1)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin-prescriptions', page],
    queryFn: () => getAdminPrescriptions({ page }),
    select: (r) => r.data,
  })

  const prescriptions = data?.data ?? []
  const meta          = data?.meta ?? null

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Prescriptions</h1>

      {isLoading && <Spinner size="lg" className="mt-10" />}
      {isError   && <AlertMessage message={error?.response?.data?.message ?? 'Failed to load'} />}

      {!isLoading && !isError && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr><th>#</th><th>Patient</th><th>Doctor</th><th>Diagnosis</th><th>Date</th></tr>
            </thead>
            <tbody>
              {prescriptions.map((p) => (
                <tr key={p.id}>
                  <td className="text-gray-400">{p.id}</td>
                  <td className="font-medium">{p.appointment?.patient?.name ?? '—'}</td>
                  <td>{p.appointment?.doctor?.name ?? '—'}</td>
                  <td className="max-w-xs truncate">{p.diagnosis}</td>
                  <td>{p.created_at?.slice(0, 10)}</td>
                </tr>
              ))}
              {prescriptions.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">No prescriptions found</td></tr>
              )}
            </tbody>
          </table>
          <Pagination meta={meta} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

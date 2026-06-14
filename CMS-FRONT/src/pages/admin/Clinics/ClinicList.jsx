import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getClinics, toggleClinic } from '../../../services/clinics'
import Spinner from '../../../components/common/Spinner'
import AlertMessage from '../../../components/common/AlertMessage'
import Pagination from '../../../components/common/Pagination'
import Button from '../../../components/common/Button'

export default function ClinicList() {
  const [page, setPage] = useState(1)
  const qc = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['clinics', page],
    queryFn: () => getClinics({ page }),
    select: (r) => r.data,
  })

  const toggleMut = useMutation({
    mutationFn: toggleClinic,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clinics'] }),
  })

  if (isLoading) return <Spinner size="lg" className="mt-20" />
  if (isError)   return <AlertMessage message={error?.response?.data?.message ?? 'Failed to load clinics'} />

  const clinics = data.data?.data ?? []
  const meta    = data.data?.meta ?? data.meta ?? null

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clinics</h1>
        <Link to="/admin/clinics/new"><Button>+ New Clinic</Button></Link>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>#</th><th>Name</th><th>Phone</th><th>Email</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clinics.map((c) => (
              <tr key={c.id}>
                <td className="text-gray-400">{c.id}</td>
                <td className="font-medium">{c.name}</td>
                <td>{c.phone ?? '—'}</td>
                <td>{c.email ?? '—'}</td>
                <td>
                  <span className={c.is_active ? 'badge-green' : 'badge-red'}>
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="flex gap-2">
                  <Link to={`/admin/clinics/${c.id}/edit`}>
                    <Button variant="secondary" className="text-xs py-1 px-2">Edit</Button>
                  </Link>
                  <Button
                    variant={c.is_active ? 'danger' : 'success'}
                    className="text-xs py-1 px-2"
                    loading={toggleMut.isPending && toggleMut.variables === c.id}
                    onClick={() => toggleMut.mutate(c.id)}
                  >
                    {c.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination meta={meta} onPageChange={setPage} />
      </div>
    </div>
  )
}

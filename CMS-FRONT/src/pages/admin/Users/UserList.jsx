import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getUsers, toggleUser, changeRole } from '../../../services/users'
import Spinner from '../../../components/common/Spinner'
import AlertMessage from '../../../components/common/AlertMessage'
import Pagination from '../../../components/common/Pagination'
import Button from '../../../components/common/Button'
import { ROLE_LABELS } from '../../../utils/roleHelper'

export default function UserList() {
  const [page, setPage] = useState(1)
  const qc = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users', page],
    queryFn: () => getUsers({ page }),
    select: (r) => r.data,
  })

  const toggleMut = useMutation({
    mutationFn: toggleUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })

  const roleMut = useMutation({
    mutationFn: ({ id, role }) => changeRole(id, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })

  if (isLoading) return <Spinner size="lg" className="mt-20" />
  if (isError)   return <AlertMessage message={error?.response?.data?.message ?? 'Failed to load users'} />

  const users = data.data?.data ?? []
  const meta  = data.data?.meta ?? data.meta ?? null

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <Link to="/admin/users/new"><Button>+ New User</Button></Link>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Clinic</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="text-gray-400">{u.id}</td>
                <td className="font-medium">{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select
                    value={u.role}
                    className="text-xs border border-gray-200 rounded px-2 py-1"
                    onChange={(e) => roleMut.mutate({ id: u.id, role: e.target.value })}
                  >
                    <option value="doctor">Doctor</option>
                    <option value="assistant">Assistant</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </td>
                <td>{u.clinic?.name ?? '—'}</td>
                <td>
                  <span className={u.is_active ? 'badge-green' : 'badge-red'}>
                    {u.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="flex gap-2">
                  <Link to={`/admin/users/${u.id}/edit`}>
                    <Button variant="secondary" className="text-xs py-1 px-2">Edit</Button>
                  </Link>
                  <Button
                    variant={u.is_active ? 'danger' : 'success'}
                    className="text-xs py-1 px-2"
                    loading={toggleMut.isPending && toggleMut.variables === u.id}
                    onClick={() => toggleMut.mutate(u.id)}
                  >
                    {u.is_active ? 'Deactivate' : 'Activate'}
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

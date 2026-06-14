import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getPatients } from '../../../services/patients'
import Spinner from '../../../components/common/Spinner'
import AlertMessage from '../../../components/common/AlertMessage'
import Pagination from '../../../components/common/Pagination'
import Button from '../../../components/common/Button'
import { genderLabel } from '../../../utils/roleHelper'

export default function AssistantPatientList() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['assistant-patients', page, search],
    queryFn: () => getPatients('assistant', { page, search }),
    select: (r) => r.data,
  })

  const patients = data?.data?.data ?? []
  const meta     = data?.data?.meta ?? null

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
        <Link to="/assistant/patients/new"><Button>+ New Patient</Button></Link>
      </div>

      <div className="card mb-4">
        <input type="text" className="form-input" placeholder="Search by name or phone…"
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
      </div>

      {isLoading && <Spinner size="lg" className="mt-10" />}
      {isError   && <AlertMessage message={error?.response?.data?.message ?? 'Failed to load'} />}

      {!isLoading && !isError && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr><th>#</th><th>Name</th><th>Phone</th><th>Gender</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td className="text-gray-400">{p.id}</td>
                  <td className="font-medium">{p.name}</td>
                  <td>{p.phone ?? '—'}</td>
                  <td>{genderLabel(p.gender)}</td>
                  <td className="flex gap-2">
                    <Link to={`/assistant/patients/${p.id}`}>
                      <Button variant="secondary" className="text-xs py-1 px-2">View</Button>
                    </Link>
                    <Link to={`/assistant/patients/${p.id}/edit`}>
                      <Button variant="secondary" className="text-xs py-1 px-2">Edit</Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {patients.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">No patients found</td></tr>
              )}
            </tbody>
          </table>
          <Pagination meta={meta} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

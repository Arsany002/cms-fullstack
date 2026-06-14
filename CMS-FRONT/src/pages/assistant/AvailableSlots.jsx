import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAvailableSlots } from '../../services/appointments'
import api from '../../services/api'
import Spinner from '../../components/common/Spinner'
import AlertMessage from '../../components/common/AlertMessage'
import Button from '../../components/common/Button'

export default function AvailableSlots() {
  const [doctorId, setDoctorId] = useState('')
  const [date, setDate]         = useState('')
  const [query, setQuery]       = useState(null)

  const { data: doctorsData } = useQuery({
    queryKey: ['clinic-doctors'],
    queryFn: () => api.get('/assistant/doctors').then((r) => r.data.data ?? []).catch(() => []),
  })

  const { data: slots, isLoading, isError, error } = useQuery({
    queryKey: ['available-slots-page', query],
    queryFn: () => getAvailableSlots({ doctor_id: query.doctorId, date: query.date }),
    enabled: !!query,
    select: (r) => r.data.slots ?? [],
  })

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Available Slots</h1>
      <div className="card mb-6 flex flex-col gap-4">
        <div>
          <label className="form-label">Doctor</label>
          <select className="form-input" value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
            <option value="">Select doctor…</option>
            {(doctorsData ?? []).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Date</label>
          <input type="date" className="form-input" value={date}
            min={new Date().toISOString().slice(0,10)}
            onChange={(e) => setDate(e.target.value)} />
        </div>
        <Button disabled={!doctorId || !date} onClick={() => setQuery({ doctorId, date })}>
          Check Slots
        </Button>
      </div>

      {isLoading && <Spinner />}
      {isError   && <AlertMessage message={error?.response?.data?.message ?? 'Failed to load slots'} />}

      {!isLoading && slots && (
        <div className="card">
          <h2 className="font-semibold mb-3">Available on {query?.date}</h2>
          {slots.length === 0
            ? <p className="text-gray-400">No slots available</p>
            : (
              <div className="flex flex-wrap gap-2">
                {slots.map((s) => (
                  <span key={s} className="badge-blue px-3 py-1 text-sm">{s}</span>
                ))}
              </div>
            )
          }
        </div>
      )}
    </div>
  )
}

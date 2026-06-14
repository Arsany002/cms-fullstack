import { NavLink } from 'react-router-dom'
import { useRole } from '../../hooks/useRole'

const adminLinks = [
  { to: '/admin/dashboard',     label: 'Dashboard',     icon: '📊' },
  { to: '/admin/clinics',       label: 'Clinics',       icon: '🏥' },
  { to: '/admin/users',         label: 'Users',         icon: '👥' },
  { to: '/admin/appointments',  label: 'Appointments',  icon: '📅' },
  { to: '/admin/prescriptions', label: 'Prescriptions', icon: '💊' },
]

const doctorLinks = [
  { to: '/doctor/dashboard',     label: 'Dashboard',     icon: '📊' },
  { to: '/doctor/schedules',     label: 'Schedules',     icon: '🗓️' },
  { to: '/doctor/appointments',  label: 'Appointments',  icon: '📅' },
  { to: '/doctor/prescriptions', label: 'Prescriptions', icon: '💊' },
  { to: '/doctor/patients',      label: 'Patients',      icon: '🧑‍⚕️' },
]

const assistantLinks = [
  { to: '/assistant/dashboard',    label: 'Dashboard',    icon: '📊' },
  { to: '/assistant/patients',     label: 'Patients',     icon: '🧑‍⚕️' },
  { to: '/assistant/appointments', label: 'Appointments', icon: '📅' },
]

export default function Sidebar({ open, onClose }) {
  const { isSuperAdmin, isDoctor } = useRole()
  const links = isSuperAdmin ? adminLinks : isDoctor ? doctorLinks : assistantLinks

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white flex flex-col
          transform transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
          <div className="h-8 w-8 rounded-md bg-primary-600 flex items-center justify-center text-sm font-bold">
            C
          </div>
          <span className="text-lg font-semibold tracking-tight">CMS</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                ${isActive
                  ? 'bg-primary-700 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
              }
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

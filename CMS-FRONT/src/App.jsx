import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { getDashboardPath } from './utils/roleHelper'

import ProtectedRoute from './components/layout/ProtectedRoute'
import Layout         from './components/layout/Layout'
import Spinner        from './components/common/Spinner'

// Auth
import Login    from './pages/auth/Login'
import Register from './pages/auth/Register'

// Admin
import AdminDashboard      from './pages/admin/Dashboard'
import ClinicList          from './pages/admin/Clinics/ClinicList'
import ClinicForm          from './pages/admin/Clinics/ClinicForm'
import UserList            from './pages/admin/Users/UserList'
import UserForm            from './pages/admin/Users/UserForm'
import AdminAppointments   from './pages/admin/AppointmentsList'
import AdminPrescriptions  from './pages/admin/PrescriptionsList'

// Doctor
import DoctorDashboard          from './pages/doctor/Dashboard'
import ScheduleList             from './pages/doctor/Schedules/ScheduleList'
import ScheduleForm             from './pages/doctor/Schedules/ScheduleForm'
import DoctorAppointmentsList   from './pages/doctor/Appointments/AppointmentsList'
import DoctorAppointmentDetail  from './pages/doctor/Appointments/AppointmentDetail'
import PrescriptionList         from './pages/doctor/Prescriptions/PrescriptionList'
import PrescriptionForm         from './pages/doctor/Prescriptions/PrescriptionForm'
import PrescriptionDetail       from './pages/doctor/Prescriptions/PrescriptionDetail'
import DoctorPatientList        from './pages/doctor/Patients/PatientList'
import DoctorPatientDetail      from './pages/doctor/Patients/PatientDetail'

// Assistant
import AssistantDashboard         from './pages/assistant/Dashboard'
import AssistantPatientList       from './pages/assistant/Patients/PatientList'
import PatientForm                from './pages/assistant/Patients/PatientForm'
import AssistantAppointmentsList  from './pages/assistant/Appointments/AppointmentsList'
import AppointmentBook            from './pages/assistant/Appointments/AppointmentBook'
import AssistantAppointmentDetail from './pages/assistant/Appointments/AppointmentDetail'
import AvailableSlots             from './pages/assistant/AvailableSlots'

function RootRedirect() {
  const { isAuthenticated, user, loading } = useAuth()
  if (loading) return <div className="h-screen flex items-center justify-center"><Spinner size="lg" /></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Navigate to={getDashboardPath(user?.role)} replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/"         element={<RootRedirect />} />

      {/* Super Admin */}
      <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
        <Route element={<Layout />}>
          <Route path="/admin/dashboard"             element={<AdminDashboard />} />
          <Route path="/admin/clinics"               element={<ClinicList />} />
          <Route path="/admin/clinics/new"           element={<ClinicForm />} />
          <Route path="/admin/clinics/:id/edit"      element={<ClinicForm />} />
          <Route path="/admin/users"                 element={<UserList />} />
          <Route path="/admin/users/new"             element={<UserForm />} />
          <Route path="/admin/users/:id/edit"        element={<UserForm />} />
          <Route path="/admin/appointments"          element={<AdminAppointments />} />
          <Route path="/admin/prescriptions"         element={<AdminPrescriptions />} />
        </Route>
      </Route>

      {/* Doctor */}
      <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
        <Route element={<Layout />}>
          <Route path="/doctor/dashboard"                element={<DoctorDashboard />} />
          <Route path="/doctor/schedules"                element={<ScheduleList />} />
          <Route path="/doctor/schedules/new"            element={<ScheduleForm />} />
          <Route path="/doctor/schedules/:id/edit"       element={<ScheduleForm />} />
          <Route path="/doctor/appointments"             element={<DoctorAppointmentsList />} />
          <Route path="/doctor/appointments/:id"         element={<DoctorAppointmentDetail />} />
          <Route path="/doctor/prescriptions"            element={<PrescriptionList />} />
          <Route path="/doctor/prescriptions/new"        element={<PrescriptionForm />} />
          <Route path="/doctor/prescriptions/:id"        element={<PrescriptionDetail />} />
          <Route path="/doctor/prescriptions/:id/edit"   element={<PrescriptionForm />} />
          <Route path="/doctor/patients"                 element={<DoctorPatientList />} />
          <Route path="/doctor/patients/:id"             element={<DoctorPatientDetail />} />
        </Route>
      </Route>

      {/* Assistant */}
      <Route element={<ProtectedRoute allowedRoles={['assistant']} />}>
        <Route element={<Layout />}>
          <Route path="/assistant/dashboard"              element={<AssistantDashboard />} />
          <Route path="/assistant/patients"               element={<AssistantPatientList />} />
          <Route path="/assistant/patients/new"           element={<PatientForm />} />
          <Route path="/assistant/patients/:id"           element={<AssistantPatientList />} />
          <Route path="/assistant/patients/:id/edit"      element={<PatientForm />} />
          <Route path="/assistant/appointments"           element={<AssistantAppointmentsList />} />
          <Route path="/assistant/appointments/new"       element={<AppointmentBook />} />
          <Route path="/assistant/appointments/:id"       element={<AssistantAppointmentDetail />} />
          <Route path="/assistant/available-slots"        element={<AvailableSlots />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

# Frontend Technical Documentation

## 1. Project Overview

This document provides a technical documentation report for the React frontend codebase.

The frontend is developed using React with JSX. It contains UI components, pages, routing logic, API integration, styling files, assets, and reusable utility logic.

---

## 2. Project Metadata

| Item | Value |
|---|---|
| Project Name | cms-front |
| Version | 1.0.0 |
| Frontend Framework | React |
| Code Format | JSX |
| Main Source Folder | `src/` |
| Documentation File | `docs/frontend/FRONTEND_DOCUMENTATION.md` |

---

## 3. Main Technologies Used

| Category | Technology |
|---|---|
| UI Framework | React |
| Code Syntax | JSX |
| Routing | React Router DOM |
| Styling | Custom CSS / Project Styling |
| Package Manager | npm |

---

## 4. UI Elements and Frontend Structure

The frontend is organized around reusable UI elements. These UI elements are usually represented as React components. Components are used to build pages, forms, layouts, buttons, cards, tables, modals, navigation bars, and other interface sections.

### Detected Components

| RootRedirect | `src/App.jsx` |
| App | `src/App.jsx` |
| AlertMessage | `src/components/common/AlertMessage.jsx` |
| Button | `src/components/common/Button.jsx` |
| ConfirmDialog | `src/components/common/ConfirmDialog.jsx` |
| Input | `src/components/common/Input.jsx` |
| Modal | `src/components/common/Modal.jsx` |
| Pagination | `src/components/common/Pagination.jsx` |
| Select | `src/components/common/Select.jsx` |
| Spinner | `src/components/common/Spinner.jsx` |
| Header | `src/components/layout/Header.jsx` |
| Layout | `src/components/layout/Layout.jsx` |
| ProtectedRoute | `src/components/layout/ProtectedRoute.jsx` |
| Sidebar | `src/components/layout/Sidebar.jsx` |
| AuthProvider | `src/context/AuthContext.jsx` |
| AdminAppointmentsList | `src/pages/admin/AppointmentsList.jsx` |
| ClinicForm | `src/pages/admin/Clinics/ClinicForm.jsx` |
| ClinicList | `src/pages/admin/Clinics/ClinicList.jsx` |
| StatCard | `src/pages/admin/Dashboard.jsx` |
| AdminDashboard | `src/pages/admin/Dashboard.jsx` |
| AdminPrescriptionsList | `src/pages/admin/PrescriptionsList.jsx` |
| UserForm | `src/pages/admin/Users/UserForm.jsx` |
| UserList | `src/pages/admin/Users/UserList.jsx` |
| AppointmentBook | `src/pages/assistant/Appointments/AppointmentBook.jsx` |
| AssistantAppointmentDetail | `src/pages/assistant/Appointments/AppointmentDetail.jsx` |
| AssistantAppointmentsList | `src/pages/assistant/Appointments/AppointmentsList.jsx` |
| AvailableSlots | `src/pages/assistant/AvailableSlots.jsx` |
| AssistantDashboard | `src/pages/assistant/Dashboard.jsx` |
| PatientForm | `src/pages/assistant/Patients/PatientForm.jsx` |
| AssistantPatientList | `src/pages/assistant/Patients/PatientList.jsx` |
| Login | `src/pages/auth/Login.jsx` |
| Register | `src/pages/auth/Register.jsx` |
| DoctorAppointmentDetail | `src/pages/doctor/Appointments/AppointmentDetail.jsx` |
| DoctorAppointmentsList | `src/pages/doctor/Appointments/AppointmentsList.jsx` |
| DoctorDashboard | `src/pages/doctor/Dashboard.jsx` |
| DoctorPatientDetail | `src/pages/doctor/Patients/PatientDetail.jsx` |
| Detail | `src/pages/doctor/Patients/PatientDetail.jsx` |
| DoctorPatientList | `src/pages/doctor/Patients/PatientList.jsx` |
| PrescriptionDetail | `src/pages/doctor/Prescriptions/PrescriptionDetail.jsx` |
| PrescriptionForm | `src/pages/doctor/Prescriptions/PrescriptionForm.jsx` |
| PrescriptionList | `src/pages/doctor/Prescriptions/PrescriptionList.jsx` |
| ScheduleForm | `src/pages/doctor/Schedules/ScheduleForm.jsx` |
| ScheduleList | `src/pages/doctor/Schedules/ScheduleList.jsx` |


| Component | File |
|---|---|
| RootRedirect | `src/App.jsx` |
| App | `src/App.jsx` |
| AlertMessage | `src/components/common/AlertMessage.jsx` |
| Button | `src/components/common/Button.jsx` |
| ConfirmDialog | `src/components/common/ConfirmDialog.jsx` |
| Input | `src/components/common/Input.jsx` |
| Modal | `src/components/common/Modal.jsx` |
| Pagination | `src/components/common/Pagination.jsx` |
| Select | `src/components/common/Select.jsx` |
| Spinner | `src/components/common/Spinner.jsx` |
| Header | `src/components/layout/Header.jsx` |
| Layout | `src/components/layout/Layout.jsx` |
| ProtectedRoute | `src/components/layout/ProtectedRoute.jsx` |
| Sidebar | `src/components/layout/Sidebar.jsx` |
| AuthProvider | `src/context/AuthContext.jsx` |
| AdminAppointmentsList | `src/pages/admin/AppointmentsList.jsx` |
| ClinicForm | `src/pages/admin/Clinics/ClinicForm.jsx` |
| ClinicList | `src/pages/admin/Clinics/ClinicList.jsx` |
| StatCard | `src/pages/admin/Dashboard.jsx` |
| AdminDashboard | `src/pages/admin/Dashboard.jsx` |
| AdminPrescriptionsList | `src/pages/admin/PrescriptionsList.jsx` |
| UserForm | `src/pages/admin/Users/UserForm.jsx` |
| UserList | `src/pages/admin/Users/UserList.jsx` |
| AppointmentBook | `src/pages/assistant/Appointments/AppointmentBook.jsx` |
| AssistantAppointmentDetail | `src/pages/assistant/Appointments/AppointmentDetail.jsx` |
| AssistantAppointmentsList | `src/pages/assistant/Appointments/AppointmentsList.jsx` |
| AvailableSlots | `src/pages/assistant/AvailableSlots.jsx` |
| AssistantDashboard | `src/pages/assistant/Dashboard.jsx` |
| PatientForm | `src/pages/assistant/Patients/PatientForm.jsx` |
| AssistantPatientList | `src/pages/assistant/Patients/PatientList.jsx` |
| Login | `src/pages/auth/Login.jsx` |
| Register | `src/pages/auth/Register.jsx` |
| DoctorAppointmentDetail | `src/pages/doctor/Appointments/AppointmentDetail.jsx` |
| DoctorAppointmentsList | `src/pages/doctor/Appointments/AppointmentsList.jsx` |
| DoctorDashboard | `src/pages/doctor/Dashboard.jsx` |
| DoctorPatientDetail | `src/pages/doctor/Patients/PatientDetail.jsx` |
| Detail | `src/pages/doctor/Patients/PatientDetail.jsx` |
| DoctorPatientList | `src/pages/doctor/Patients/PatientList.jsx` |
| PrescriptionDetail | `src/pages/doctor/Prescriptions/PrescriptionDetail.jsx` |
| PrescriptionForm | `src/pages/doctor/Prescriptions/PrescriptionForm.jsx` |
| PrescriptionList | `src/pages/doctor/Prescriptions/PrescriptionList.jsx` |
| ScheduleForm | `src/pages/doctor/Schedules/ScheduleForm.jsx` |
| ScheduleList | `src/pages/doctor/Schedules/ScheduleList.jsx` |

---

## 5. Source Code Structure

The following files were found inside the frontend source folder:

- `src/App.jsx`
- `src/components/common/AlertMessage.jsx`
- `src/components/common/Button.jsx`
- `src/components/common/ConfirmDialog.jsx`
- `src/components/common/Input.jsx`
- `src/components/common/Modal.jsx`
- `src/components/common/Pagination.jsx`
- `src/components/common/Select.jsx`
- `src/components/common/Spinner.jsx`
- `src/components/layout/Header.jsx`
- `src/components/layout/Layout.jsx`
- `src/components/layout/ProtectedRoute.jsx`
- `src/components/layout/Sidebar.jsx`
- `src/context/AuthContext.jsx`
- `src/hooks/useAuth.js`
- `src/hooks/useRole.js`
- `src/index.css`
- `src/index.jsx`
- `src/pages/admin/AppointmentsList.jsx`
- `src/pages/admin/Clinics/ClinicForm.jsx`
- `src/pages/admin/Clinics/ClinicList.jsx`
- `src/pages/admin/Dashboard.jsx`
- `src/pages/admin/PrescriptionsList.jsx`
- `src/pages/admin/Users/UserForm.jsx`
- `src/pages/admin/Users/UserList.jsx`
- `src/pages/assistant/Appointments/AppointmentBook.jsx`
- `src/pages/assistant/Appointments/AppointmentDetail.jsx`
- `src/pages/assistant/Appointments/AppointmentsList.jsx`
- `src/pages/assistant/AvailableSlots.jsx`
- `src/pages/assistant/Dashboard.jsx`
- `src/pages/assistant/Patients/PatientForm.jsx`
- `src/pages/assistant/Patients/PatientList.jsx`
- `src/pages/auth/Login.jsx`
- `src/pages/auth/Register.jsx`
- `src/pages/doctor/Appointments/AppointmentDetail.jsx`
- `src/pages/doctor/Appointments/AppointmentsList.jsx`
- `src/pages/doctor/Dashboard.jsx`
- `src/pages/doctor/Patients/PatientDetail.jsx`
- `src/pages/doctor/Patients/PatientList.jsx`
- `src/pages/doctor/Prescriptions/PrescriptionDetail.jsx`
- `src/pages/doctor/Prescriptions/PrescriptionForm.jsx`
- `src/pages/doctor/Prescriptions/PrescriptionList.jsx`
- `src/pages/doctor/Schedules/ScheduleForm.jsx`
- `src/pages/doctor/Schedules/ScheduleList.jsx`
- `src/services/api.js`
- `src/services/appointments.js`
- `src/services/auth.js`
- `src/services/clinics.js`
- `src/services/patients.js`
- `src/services/prescriptions.js`
- `src/services/schedules.js`
- `src/services/users.js`
- `src/utils/roleHelper.js`

---

## 6. Styling and UI Design Files

The following styling files were detected:

- `src/index.css`

---

## 7. File-Level Documentation

### src/App.jsx

**Detected Components**

- `RootRedirect`
- `App`

**Imports**

- `react-router-dom`
- `./hooks/useAuth`
- `./utils/roleHelper`
- `./components/layout/ProtectedRoute`
- `./components/layout/Layout`
- `./components/common/Spinner`
- `./pages/auth/Login`
- `./pages/auth/Register`
- `./pages/admin/Dashboard`
- `./pages/admin/Clinics/ClinicList`
- `./pages/admin/Clinics/ClinicForm`
- `./pages/admin/Users/UserList`
- `./pages/admin/Users/UserForm`
- `./pages/admin/AppointmentsList`
- `./pages/admin/PrescriptionsList`
- `./pages/doctor/Dashboard`
- `./pages/doctor/Schedules/ScheduleList`
- `./pages/doctor/Schedules/ScheduleForm`
- `./pages/doctor/Appointments/AppointmentsList`
- `./pages/doctor/Appointments/AppointmentDetail`
- `./pages/doctor/Prescriptions/PrescriptionList`
- `./pages/doctor/Prescriptions/PrescriptionForm`
- `./pages/doctor/Prescriptions/PrescriptionDetail`
- `./pages/doctor/Patients/PatientList`
- `./pages/doctor/Patients/PatientDetail`
- `./pages/assistant/Dashboard`
- `./pages/assistant/Patients/PatientList`
- `./pages/assistant/Patients/PatientForm`
- `./pages/assistant/Appointments/AppointmentsList`
- `./pages/assistant/Appointments/AppointmentBook`
- `./pages/assistant/Appointments/AppointmentDetail`
- `./pages/assistant/AvailableSlots`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/components/common/AlertMessage.jsx

**Detected Components**

- `AlertMessage`

**Imports**

No imports detected.

**JSDoc Comments**

No JSDoc comments found in this file.

### src/components/common/Button.jsx

**Detected Components**

- `Button`

**Imports**

- `./Spinner`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/components/common/ConfirmDialog.jsx

**Detected Components**

- `ConfirmDialog`

**Imports**

- `./Modal`
- `./Button`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/components/common/Input.jsx

**Detected Components**

- `Input`

**Imports**

- `react`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/components/common/Modal.jsx

**Detected Components**

- `Modal`

**Imports**

- `react`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/components/common/Pagination.jsx

**Detected Components**

- `Pagination`

**Imports**

No imports detected.

**JSDoc Comments**

No JSDoc comments found in this file.

### src/components/common/Select.jsx

**Detected Components**

- `Select`

**Imports**

- `react`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/components/common/Spinner.jsx

**Detected Components**

- `Spinner`

**Imports**

No imports detected.

**JSDoc Comments**

No JSDoc comments found in this file.

### src/components/layout/Header.jsx

**Detected Components**

- `Header`

**Imports**

- `react-router-dom`
- `../../hooks/useAuth`
- `../../utils/roleHelper`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/components/layout/Layout.jsx

**Detected Components**

- `Layout`

**Imports**

- `react`
- `react-router-dom`
- `./Sidebar`
- `./Header`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/components/layout/ProtectedRoute.jsx

**Detected Components**

- `ProtectedRoute`

**Imports**

- `react-router-dom`
- `../../hooks/useAuth`
- `../../utils/roleHelper`
- `../common/Spinner`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/components/layout/Sidebar.jsx

**Detected Components**

- `Sidebar`

**Imports**

- `react-router-dom`
- `../../hooks/useRole`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/context/AuthContext.jsx

**Detected Components**

- `AuthProvider`

**Imports**

- `react`
- `../services/auth`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/hooks/useAuth.js

**Detected Components**

No component detected.

**Imports**

- `react`
- `../context/AuthContext`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/hooks/useRole.js

**Detected Components**

No component detected.

**Imports**

- `./useAuth`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/index.jsx

**Detected Components**

No component detected.

**Imports**

- `react`
- `react-dom/client`
- `react-router-dom`
- `@tanstack/react-query`
- `@tanstack/react-query-devtools`
- `./context/AuthContext`
- `./App`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/admin/AppointmentsList.jsx

**Detected Components**

- `AdminAppointmentsList`

**Imports**

- `react`
- `@tanstack/react-query`
- `../../services/appointments`
- `../../components/common/Spinner`
- `../../components/common/AlertMessage`
- `../../components/common/Pagination`
- `../../utils/roleHelper`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/admin/Clinics/ClinicForm.jsx

**Detected Components**

- `ClinicForm`

**Imports**

- `react`
- `react-router-dom`
- `react-hook-form`
- `@tanstack/react-query`
- `../../../services/clinics`
- `../../../components/common/Input`
- `../../../components/common/Button`
- `../../../components/common/AlertMessage`
- `../../../components/common/Spinner`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/admin/Clinics/ClinicList.jsx

**Detected Components**

- `ClinicList`

**Imports**

- `react`
- `@tanstack/react-query`
- `react-router-dom`
- `../../../services/clinics`
- `../../../components/common/Spinner`
- `../../../components/common/AlertMessage`
- `../../../components/common/Pagination`
- `../../../components/common/Button`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/admin/Dashboard.jsx

**Detected Components**

- `StatCard`
- `AdminDashboard`

**Imports**

- `@tanstack/react-query`
- `../../services/api`
- `../../components/common/Spinner`
- `../../components/common/AlertMessage`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/admin/PrescriptionsList.jsx

**Detected Components**

- `AdminPrescriptionsList`

**Imports**

- `react`
- `@tanstack/react-query`
- `../../services/appointments`
- `../../components/common/Spinner`
- `../../components/common/AlertMessage`
- `../../components/common/Pagination`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/admin/Users/UserForm.jsx

**Detected Components**

- `UserForm`

**Imports**

- `react`
- `react-router-dom`
- `react-hook-form`
- `@tanstack/react-query`
- `../../../services/users`
- `../../../services/clinics`
- `../../../components/common/Input`
- `../../../components/common/Select`
- `../../../components/common/Button`
- `../../../components/common/AlertMessage`
- `../../../components/common/Spinner`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/admin/Users/UserList.jsx

**Detected Components**

- `UserList`

**Imports**

- `react`
- `@tanstack/react-query`
- `react-router-dom`
- `../../../services/users`
- `../../../components/common/Spinner`
- `../../../components/common/AlertMessage`
- `../../../components/common/Pagination`
- `../../../components/common/Button`
- `../../../utils/roleHelper`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/assistant/Appointments/AppointmentBook.jsx

**Detected Components**

- `AppointmentBook`

**Imports**

- `react`
- `react-router-dom`
- `react-hook-form`
- `@tanstack/react-query`
- `../../../services/appointments`
- `../../../services/patients`
- `../../../services/api`
- `../../../components/common/Select`
- `../../../components/common/Input`
- `../../../components/common/Button`
- `../../../components/common/AlertMessage`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/assistant/Appointments/AppointmentDetail.jsx

**Detected Components**

- `AssistantAppointmentDetail`

**Imports**

- `react`
- `react-router-dom`
- `@tanstack/react-query`
- `react-hook-form`
- `../../../services/appointments`
- `../../../components/common/Spinner`
- `../../../components/common/AlertMessage`
- `../../../components/common/Button`
- `../../../components/common/Input`
- `../../../components/common/Modal`
- `../../../utils/roleHelper`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/assistant/Appointments/AppointmentsList.jsx

**Detected Components**

- `AssistantAppointmentsList`

**Imports**

- `react`
- `@tanstack/react-query`
- `react-router-dom`
- `../../../services/appointments`
- `../../../components/common/Spinner`
- `../../../components/common/AlertMessage`
- `../../../components/common/Pagination`
- `../../../components/common/Button`
- `../../../components/common/ConfirmDialog`
- `../../../utils/roleHelper`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/assistant/AvailableSlots.jsx

**Detected Components**

- `AvailableSlots`

**Imports**

- `react`
- `@tanstack/react-query`
- `../../services/appointments`
- `../../services/api`
- `../../components/common/Spinner`
- `../../components/common/AlertMessage`
- `../../components/common/Button`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/assistant/Dashboard.jsx

**Detected Components**

- `AssistantDashboard`

**Imports**

- `@tanstack/react-query`
- `../../hooks/useAuth`
- `../../services/appointments`
- `../../components/common/Spinner`
- `../../utils/roleHelper`
- `react-router-dom`
- `../../components/common/Button`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/assistant/Patients/PatientForm.jsx

**Detected Components**

- `PatientForm`

**Imports**

- `react`
- `react-router-dom`
- `react-hook-form`
- `@tanstack/react-query`
- `../../../services/patients`
- `../../../components/common/Input`
- `../../../components/common/Select`
- `../../../components/common/Button`
- `../../../components/common/AlertMessage`
- `../../../components/common/Spinner`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/assistant/Patients/PatientList.jsx

**Detected Components**

- `AssistantPatientList`

**Imports**

- `react`
- `@tanstack/react-query`
- `react-router-dom`
- `../../../services/patients`
- `../../../components/common/Spinner`
- `../../../components/common/AlertMessage`
- `../../../components/common/Pagination`
- `../../../components/common/Button`
- `../../../utils/roleHelper`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/auth/Login.jsx

**Detected Components**

- `Login`

**Imports**

- `react`
- `react-router-dom`
- `react-hook-form`
- `../../hooks/useAuth`
- `../../utils/roleHelper`
- `../../components/common/Input`
- `../../components/common/Button`
- `../../components/common/AlertMessage`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/auth/Register.jsx

**Detected Components**

- `Register`

**Imports**

- `react`
- `react-router-dom`
- `react-hook-form`
- `@tanstack/react-query`
- `../../hooks/useAuth`
- `../../utils/roleHelper`
- `../../services/clinics`
- `../../components/common/Input`
- `../../components/common/Select`
- `../../components/common/Button`
- `../../components/common/AlertMessage`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/doctor/Appointments/AppointmentDetail.jsx

**Detected Components**

- `DoctorAppointmentDetail`

**Imports**

- `react-router-dom`
- `@tanstack/react-query`
- `../../../services/appointments`
- `../../../components/common/Spinner`
- `../../../components/common/AlertMessage`
- `../../../components/common/Button`
- `../../../utils/roleHelper`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/doctor/Appointments/AppointmentsList.jsx

**Detected Components**

- `DoctorAppointmentsList`

**Imports**

- `react`
- `@tanstack/react-query`
- `react-router-dom`
- `../../../services/appointments`
- `../../../components/common/Spinner`
- `../../../components/common/AlertMessage`
- `../../../components/common/Pagination`
- `../../../components/common/Button`
- `../../../utils/roleHelper`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/doctor/Dashboard.jsx

**Detected Components**

- `DoctorDashboard`

**Imports**

- `@tanstack/react-query`
- `../../hooks/useAuth`
- `../../services/appointments`
- `../../services/prescriptions`
- `../../components/common/Spinner`
- `../../utils/roleHelper`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/doctor/Patients/PatientDetail.jsx

**Detected Components**

- `DoctorPatientDetail`
- `Detail`

**Imports**

- `react-router-dom`
- `@tanstack/react-query`
- `../../../services/patients`
- `../../../components/common/Spinner`
- `../../../components/common/AlertMessage`
- `../../../utils/roleHelper`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/doctor/Patients/PatientList.jsx

**Detected Components**

- `DoctorPatientList`

**Imports**

- `react`
- `@tanstack/react-query`
- `react-router-dom`
- `../../../services/patients`
- `../../../components/common/Spinner`
- `../../../components/common/AlertMessage`
- `../../../components/common/Pagination`
- `../../../components/common/Button`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/doctor/Prescriptions/PrescriptionDetail.jsx

**Detected Components**

- `PrescriptionDetail`

**Imports**

- `react-router-dom`
- `@tanstack/react-query`
- `../../../services/prescriptions`
- `../../../components/common/Spinner`
- `../../../components/common/AlertMessage`
- `../../../components/common/Button`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/doctor/Prescriptions/PrescriptionForm.jsx

**Detected Components**

- `PrescriptionForm`

**Imports**

- `react`
- `react-router-dom`
- `react-hook-form`
- `@tanstack/react-query`
- `../../../services/prescriptions`
- `../../../services/appointments`
- `../../../components/common/Input`
- `../../../components/common/Select`
- `../../../components/common/Button`
- `../../../components/common/AlertMessage`
- `../../../components/common/Spinner`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/doctor/Prescriptions/PrescriptionList.jsx

**Detected Components**

- `PrescriptionList`

**Imports**

- `react`
- `@tanstack/react-query`
- `react-router-dom`
- `../../../services/prescriptions`
- `../../../components/common/Spinner`
- `../../../components/common/AlertMessage`
- `../../../components/common/Pagination`
- `../../../components/common/Button`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/doctor/Schedules/ScheduleForm.jsx

**Detected Components**

- `ScheduleForm`

**Imports**

- `react`
- `react-router-dom`
- `react-hook-form`
- `@tanstack/react-query`
- `../../../services/schedules`
- `../../../components/common/Input`
- `../../../components/common/Select`
- `../../../components/common/Button`
- `../../../components/common/AlertMessage`
- `../../../components/common/Spinner`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/pages/doctor/Schedules/ScheduleList.jsx

**Detected Components**

- `ScheduleList`

**Imports**

- `react`
- `@tanstack/react-query`
- `react-router-dom`
- `../../../services/schedules`
- `../../../components/common/Spinner`
- `../../../components/common/AlertMessage`
- `../../../components/common/Button`
- `../../../components/common/ConfirmDialog`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/services/api.js

**Detected Components**

No component detected.

**Imports**

- `axios`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/services/appointments.js

**Detected Components**

No component detected.

**Imports**

- `./api`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/services/auth.js

**Detected Components**

No component detected.

**Imports**

- `./api`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/services/clinics.js

**Detected Components**

No component detected.

**Imports**

- `./api`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/services/patients.js

**Detected Components**

No component detected.

**Imports**

- `./api`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/services/prescriptions.js

**Detected Components**

No component detected.

**Imports**

- `./api`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/services/schedules.js

**Detected Components**

No component detected.

**Imports**

- `./api`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/services/users.js

**Detected Components**

No component detected.

**Imports**

- `./api`

**JSDoc Comments**

No JSDoc comments found in this file.

### src/utils/roleHelper.js

**Detected Components**

No component detected.

**Imports**

No imports detected.

**JSDoc Comments**

No JSDoc comments found in this file.


---

## 8. Dependencies

### Production Dependencies

| @tanstack/react-query | ^5.28.0 |
| @tanstack/react-query-devtools | ^5.28.0 |
| axios | ^1.6.7 |
| react | ^18.2.0 |
| react-dom | ^18.2.0 |
| react-hook-form | ^7.51.1 |
| react-router-dom | ^6.22.3 |


| Package | Version |
|---|---|
| @tanstack/react-query | ^5.28.0 |
| @tanstack/react-query-devtools | ^5.28.0 |
| axios | ^1.6.7 |
| react | ^18.2.0 |
| react-dom | ^18.2.0 |
| react-hook-form | ^7.51.1 |
| react-router-dom | ^6.22.3 |

### Development Dependencies


| Package | Version |
|---|---|
| @types/react | ^18.2.64 |
| @types/react-dom | ^18.2.21 |
| @vitejs/plugin-react | ^4.2.1 |
| autoprefixer | ^10.4.18 |
| dependency-cruiser | ^17.4.3 |
| jsdoc | ^4.0.5 |
| license-checker | ^25.0.1 |
| postcss | ^8.4.35 |
| tailwindcss | ^3.4.1 |
| vite | ^5.1.6 |

---

## 9. Architecture Explanation

The React frontend follows a component-based architecture. Each UI section is divided into reusable components. Pages are built by combining these components. The frontend communicates with the Laravel backend through API calls.

Typical frontend flow:

```txt
User Interface
     ↓
React Component
     ↓
Page / Route
     ↓
API Service
     ↓
Laravel Backend API
     ↓
Database
```

---

## 10. UI Documentation Notes

This documentation includes automatically detected React components and styling files. For stronger UI documentation, add JSDoc comments above important components.

Example:

```jsx
/**
 * LoginForm component.
 *
 * Displays the login form and handles user authentication input.
 *
 * @component
 * @returns {JSX.Element} Login form UI.
 */
function LoginForm() {
  return <form>...</form>;
}
```

---

## 11. Conclusion

This frontend documentation summarizes the React JSX codebase, detected UI components, file structure, dependencies, styling files, and architecture. It can be regenerated whenever the codebase changes.

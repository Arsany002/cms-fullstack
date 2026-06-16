export const API_BASE = process.env.TEST_API_URL || 'http://localhost:8000/api/v1'
export const STATE_FILE = new URL('../.test-state.json', import.meta.url).pathname

export function uniqueTs() {
  return Date.now()
}

export function makeSuperAdmin(ts = uniqueTs()) {
  return {
    name: `E2E Admin ${ts}`,
    email: `e2e_admin_${ts}@example.com`,
    password: 'Password123456',
    role: 'super_admin',
  }
}

export function makeDoctor(ts = uniqueTs()) {
  return {
    name: `E2E Doctor ${ts}`,
    email: `e2e_doctor_${ts}@example.com`,
    password: 'Password123456',
    role: 'doctor',
  }
}

export function makeAssistant(ts = uniqueTs()) {
  return {
    name: `E2E Assistant ${ts}`,
    email: `e2e_assistant_${ts}@example.com`,
    password: 'Password123456',
    role: 'assistant',
  }
}

export function makeClinic(ts = uniqueTs()) {
  return {
    name: `E2E Clinic ${ts}`,
    address: `${ts} Test Street`,
    phone: '0123456789',
    email: `clinic_${ts}@example.com`,
  }
}

export function makePatient(ts = uniqueTs()) {
  return {
    name: `E2E Patient ${ts}`,
    phone: '0123456789',
    email: `patient_${ts}@example.com`,
    gender: 'male',
    date_of_birth: '1990-01-15',
    address: `${ts} Patient Lane`,
  }
}

export function makeSchedule() {
  return {
    day_of_week: 1, // Monday
    start_time: '09:00',
    end_time: '17:00',
    slot_duration: 30,
  }
}

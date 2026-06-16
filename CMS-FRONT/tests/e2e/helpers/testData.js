export const API_BASE = process.env.TEST_API_URL || 'http://localhost:8000/api/v1'
export const STATE_FILE = new URL('../.test-state.json', import.meta.url).pathname
export const TEST_PREFIX = 'playwright'
export const TEST_NAME_PREFIX = 'Playwright'

export function uniqueTs() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function uniqueEmail(label = 'user', ts = uniqueTs()) {
  return `${TEST_PREFIX}_${label}_${ts}@example.com`
}

export function makeSuperAdmin(ts = uniqueTs()) {
  return {
    name: `${TEST_NAME_PREFIX} Admin ${ts}`,
    email: uniqueEmail('admin', ts),
    password: 'Password123456',
    role: 'super_admin',
  }
}

export function makeDoctor(ts = uniqueTs()) {
  return {
    name: `${TEST_NAME_PREFIX} Doctor ${ts}`,
    email: uniqueEmail('doctor', ts),
    password: 'Password123456',
    role: 'doctor',
  }
}

export function makeAssistant(ts = uniqueTs()) {
  return {
    name: `${TEST_NAME_PREFIX} Assistant ${ts}`,
    email: uniqueEmail('assistant', ts),
    password: 'Password123456',
    role: 'assistant',
  }
}

export function makeClinic(ts = uniqueTs()) {
  return {
    name: `${TEST_NAME_PREFIX} Clinic ${ts}`,
    address: `${ts} Test Street`,
    phone: '0123456789',
    email: uniqueEmail('clinic', ts),
  }
}

export function makePatient(ts = uniqueTs()) {
  return {
    name: `${TEST_NAME_PREFIX} Patient ${ts}`,
    phone: '0123456789',
    email: uniqueEmail('patient', ts),
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

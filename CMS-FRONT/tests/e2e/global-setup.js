import fs from 'fs'
import { API_BASE, STATE_FILE, makeSuperAdmin, makeDoctor, makeAssistant, makeClinic } from './helpers/testData.js'
import { apiRegister, apiLogin } from './helpers/auth.js'

async function apiFetch(url, method, body, token) {
  const res = await fetch(`${API_BASE}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  return res.json()
}

export default async function globalSetup() {
  const ts = Date.now()
  console.log('\n[global-setup] Creating E2E test users and clinic…')

  // 1. Register super_admin
  const adminData = makeSuperAdmin(ts)
  const { user: adminUser, token: adminToken } = await apiRegister(adminData)
  console.log(`  ✓ super_admin: ${adminData.email}`)

  // 2. Create clinic via super_admin API
  const clinicPayload = makeClinic(ts)
  const clinicRes = await apiFetch('/super-admin/clinics', 'POST', clinicPayload, adminToken)
  if (!clinicRes.success) throw new Error(`Clinic creation failed: ${JSON.stringify(clinicRes)}`)
  const clinic = clinicRes.data
  console.log(`  ✓ clinic: ${clinic.name} (${clinic.id})`)

  // 3. Register doctor assigned to clinic
  const doctorData = makeDoctor(ts)
  const { user: doctorUser, token: doctorToken } = await apiRegister({
    ...doctorData,
    clinic_id: clinic.id,
  })
  console.log(`  ✓ doctor: ${doctorData.email}`)

  // 4. Register assistant assigned to clinic
  const assistantData = makeAssistant(ts)
  const { user: assistantUser, token: assistantToken } = await apiRegister({
    ...assistantData,
    clinic_id: clinic.id,
  })
  console.log(`  ✓ assistant: ${assistantData.email}`)

  // 5. Get a public clinic for the register-page tests
  const publicClinicsRes = await fetch(`${API_BASE}/public/clinics`, {
    headers: { Accept: 'application/json' },
  })
  const publicClinics = await publicClinicsRes.json()
  const firstPublicClinic = publicClinics.data?.[0] ?? clinic

  // 6. Persist state
  const state = {
    superAdmin: {
      ...adminData,
      user: adminUser,
      token: adminToken,
    },
    doctor: {
      ...doctorData,
      clinic_id: clinic.id,
      user: doctorUser,
      token: doctorToken,
    },
    assistant: {
      ...assistantData,
      clinic_id: clinic.id,
      user: assistantUser,
      token: assistantToken,
    },
    clinic,
    publicClinic: firstPublicClinic,
    ts,
  }

  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2))
  console.log(`[global-setup] State saved to ${STATE_FILE}\n`)
}

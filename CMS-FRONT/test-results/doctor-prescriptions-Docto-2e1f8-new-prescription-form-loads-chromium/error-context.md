# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: doctor/prescriptions.spec.js >> Doctor — Prescriptions >> new prescription form loads
- Location: tests/e2e/doctor/prescriptions.spec.js:20:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByLabel(/diagnosis/i)
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByLabel(/diagnosis/i)

```

```yaml
- complementary:
  - text: C CMS
  - navigation:
    - link "📊 Dashboard":
      - /url: /doctor/dashboard
    - link "🗓️ Schedules":
      - /url: /doctor/schedules
    - link "📅 Appointments":
      - /url: /doctor/appointments
    - link "💊 Prescriptions":
      - /url: /doctor/prescriptions
    - link "🧑‍⚕️ Patients":
      - /url: /doctor/patients
- banner:
  - paragraph: E2E Doctor 1781564603839
  - paragraph: Doctor
  - button "Sign Out"
- main:
  - heading "New Prescription" [level=1]
  - text: Appointment
  - combobox "Appointment":
    - option "Select appointment…" [selected]
  - text: Diagnosis
  - textbox
  - text: Notes
  - textbox
  - paragraph: Medications
  - button "+ Add Item"
  - button "✕"
  - text: Medicine
  - textbox "Medicine"
  - text: Dosage
  - textbox "Dosage"
  - text: Frequency
  - textbox "Frequency"
  - text: Duration
  - textbox "Duration"
  - text: Notes (optional)
  - textbox "Notes (optional)"
  - button "Cancel"
  - button "Create"
- button "Open Tanstack query devtools":
  - img
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | import { getTestState, injectSession } from '../helpers/auth.js'
  3  | 
  4  | test.describe('Doctor — Prescriptions', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     const state = getTestState()
  7  |     await injectSession(page, state.doctor.token, state.doctor.user)
  8  |   })
  9  | 
  10 |   test('prescription list page loads', async ({ page }) => {
  11 |     await page.goto('/doctor/prescriptions')
  12 |     await expect(page.getByRole('heading', { name: /prescription/i })).toBeVisible()
  13 |   })
  14 | 
  15 |   test('shows + New Prescription button', async ({ page }) => {
  16 |     await page.goto('/doctor/prescriptions')
  17 |     await expect(page.getByRole('link', { name: /new prescription/i })).toBeVisible()
  18 |   })
  19 | 
  20 |   test('new prescription form loads', async ({ page }) => {
  21 |     await page.goto('/doctor/prescriptions/new')
  22 |     await expect(page.getByRole('heading', { name: /new prescription/i })).toBeVisible()
> 23 |     await expect(page.getByLabel(/diagnosis/i)).toBeVisible()
     |                                                 ^ Error: expect(locator).toBeVisible() failed
  24 |   })
  25 | 
  26 |   test('patients list loads for doctor', async ({ page }) => {
  27 |     await page.goto('/doctor/patients')
  28 |     await expect(page.getByRole('heading', { name: /patients/i })).toBeVisible()
  29 |   })
  30 | })
  31 | 
```
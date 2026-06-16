# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: super-admin/clinics.spec.js >> Super Admin — Clinics >> clinic list shows at least one clinic
- Location: tests/e2e/super-admin/clinics.spec.js:22:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('table tbody tr').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('table tbody tr').first()

```

```yaml
- complementary:
  - text: C CMS
  - navigation:
    - link "📊 Dashboard":
      - /url: /admin/dashboard
    - link "🏥 Clinics":
      - /url: /admin/clinics
    - link "👥 Users":
      - /url: /admin/users
    - link "📅 Appointments":
      - /url: /admin/appointments
    - link "💊 Prescriptions":
      - /url: /admin/prescriptions
- banner:
  - paragraph: E2E Admin 1781564603839
  - paragraph: Super Admin
  - button "Sign Out"
- main:
  - heading "Clinics" [level=1]
  - link "+ New Clinic":
    - /url: /admin/clinics/new
    - button "+ New Clinic"
  - table:
    - rowgroup:
      - row "# Name Phone Email Status Actions":
        - columnheader "#"
        - columnheader "Name"
        - columnheader "Phone"
        - columnheader "Email"
        - columnheader "Status"
        - columnheader "Actions"
    - rowgroup
- button "Open Tanstack query devtools":
  - img
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | import { getTestState, injectSession } from '../helpers/auth.js'
  3  | import { setupNetworkMonitor, attachReports } from '../helpers/reporting.js'
  4  | import { makeClinic, uniqueTs } from '../helpers/testData.js'
  5  | 
  6  | test.describe('Super Admin — Clinics', () => {
  7  |   test.beforeEach(async ({ page }) => {
  8  |     const state = getTestState()
  9  |     await injectSession(page, state.superAdmin.token, state.superAdmin.user)
  10 |   })
  11 | 
  12 |   test('clinic list page loads with heading', async ({ page }) => {
  13 |     await page.goto('/admin/clinics')
  14 |     await expect(page.getByRole('heading', { name: /clinics/i })).toBeVisible()
  15 |   })
  16 | 
  17 |   test('shows + New Clinic button', async ({ page }) => {
  18 |     await page.goto('/admin/clinics')
  19 |     await expect(page.getByRole('link', { name: /new clinic/i })).toBeVisible()
  20 |   })
  21 | 
  22 |   test('clinic list shows at least one clinic', async ({ page }) => {
  23 |     await page.goto('/admin/clinics')
  24 |     // Table should have at least the test clinic created in global-setup
> 25 |     await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10000 })
     |                                                          ^ Error: expect(locator).toBeVisible() failed
  26 |   })
  27 | 
  28 |   test('new clinic form loads with required fields', async ({ page }) => {
  29 |     await page.goto('/admin/clinics/new')
  30 |     await expect(page.getByRole('heading', { name: /new clinic/i })).toBeVisible()
  31 |     await expect(page.getByLabel('Name')).toBeVisible()
  32 |     await expect(page.getByLabel('Address')).toBeVisible()
  33 |     await expect(page.getByRole('button', { name: /create/i })).toBeVisible()
  34 |   })
  35 | 
  36 |   test('new clinic form shows validation on empty submit', async ({ page }) => {
  37 |     await page.goto('/admin/clinics/new')
  38 |     await page.getByRole('button', { name: /create/i }).click()
  39 |     await expect(page.locator('.form-error').first()).toBeVisible()
  40 |   })
  41 | 
  42 |   test('creates a clinic successfully', async ({ page }, testInfo) => {
  43 |     const monitor = setupNetworkMonitor(page)
  44 |     const clinic = makeClinic(uniqueTs())
  45 | 
  46 |     await page.goto('/admin/clinics/new')
  47 |     await page.getByLabel('Name').fill(clinic.name)
  48 |     await page.getByLabel('Address').fill(clinic.address)
  49 |     await page.getByLabel('Phone').fill(clinic.phone)
  50 |     await page.getByLabel('Email').fill(clinic.email)
  51 | 
  52 |     await page.getByRole('button', { name: /create/i }).click()
  53 |     await expect(page).toHaveURL(/\/admin\/clinics$/, { timeout: 10000 })
  54 |     await expect(page.getByRole('heading', { name: /clinics/i })).toBeVisible()
  55 | 
  56 |     await attachReports(testInfo, monitor)
  57 |     expect(monitor.consoleErrors).toEqual([])
  58 |   })
  59 | 
  60 |   test('edit clinic form pre-fills values', async ({ page }) => {
  61 |     const state = getTestState()
  62 |     const clinicId = state.clinic.id
  63 |     await page.goto(`/admin/clinics/${clinicId}/edit`)
  64 |     await expect(page.getByRole('heading', { name: /edit clinic/i })).toBeVisible()
  65 |     // Name field should be pre-filled
  66 |     await expect(page.getByLabel('Name')).not.toBeEmpty()
  67 |   })
  68 | })
  69 | 
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: super-admin/users.spec.js >> Super Admin — Users >> users list shows at least one user
- Location: tests/e2e/super-admin/users.spec.js:21:3

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
  - heading "Users" [level=1]
  - link "+ New User":
    - /url: /admin/users/new
    - button "+ New User"
  - table:
    - rowgroup:
      - row "# Name Email Role Clinic Status Actions":
        - columnheader "#"
        - columnheader "Name"
        - columnheader "Email"
        - columnheader "Role"
        - columnheader "Clinic"
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
  3  | import { makeDoctor, uniqueTs } from '../helpers/testData.js'
  4  | 
  5  | test.describe('Super Admin — Users', () => {
  6  |   test.beforeEach(async ({ page }) => {
  7  |     const state = getTestState()
  8  |     await injectSession(page, state.superAdmin.token, state.superAdmin.user)
  9  |   })
  10 | 
  11 |   test('users list page loads with heading', async ({ page }) => {
  12 |     await page.goto('/admin/users')
  13 |     await expect(page.getByRole('heading', { name: /users/i })).toBeVisible()
  14 |   })
  15 | 
  16 |   test('shows + New User button', async ({ page }) => {
  17 |     await page.goto('/admin/users')
  18 |     await expect(page.getByRole('link', { name: /new user/i })).toBeVisible()
  19 |   })
  20 | 
  21 |   test('users list shows at least one user', async ({ page }) => {
  22 |     await page.goto('/admin/users')
> 23 |     await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10000 })
     |                                                          ^ Error: expect(locator).toBeVisible() failed
  24 |   })
  25 | 
  26 |   test('new user form loads with required fields', async ({ page }) => {
  27 |     await page.goto('/admin/users/new')
  28 |     await expect(page.getByRole('heading', { name: /new user/i })).toBeVisible()
  29 |     await expect(page.getByLabel('Name')).toBeVisible()
  30 |     await expect(page.getByLabel('Email')).toBeVisible()
  31 |     await expect(page.getByLabel('Password')).toBeVisible()
  32 |     await expect(page.getByLabel('Role')).toBeVisible()
  33 |   })
  34 | 
  35 |   test('new user form validation fires on empty submit', async ({ page }) => {
  36 |     await page.goto('/admin/users/new')
  37 |     await page.getByRole('button', { name: /create/i }).click()
  38 |     await expect(page.locator('.form-error').first()).toBeVisible()
  39 |   })
  40 | 
  41 |   test('creates a new doctor user successfully', async ({ page }) => {
  42 |     const state = getTestState()
  43 |     const doctor = makeDoctor(uniqueTs())
  44 | 
  45 |     await page.goto('/admin/users/new')
  46 |     await page.getByLabel('Name').fill(doctor.name)
  47 |     await page.getByLabel('Email').fill(doctor.email)
  48 |     await page.getByLabel('Password').fill(doctor.password)
  49 |     await page.getByLabel('Role').selectOption({ value: 'doctor' })
  50 |     // Clinic dropdown should appear after selecting doctor role
  51 |     const clinicSelect = page.getByLabel('Clinic')
  52 |     if (await clinicSelect.isVisible()) {
  53 |       await clinicSelect.selectOption({ index: 1 })
  54 |     }
  55 | 
  56 |     await page.getByRole('button', { name: /create/i }).click()
  57 |     await expect(page).toHaveURL(/\/admin\/users$/, { timeout: 10000 })
  58 |   })
  59 | 
  60 |   test('admin appointments page loads', async ({ page }) => {
  61 |     await page.goto('/admin/appointments')
  62 |     await expect(page.getByRole('heading', { name: /appointments/i })).toBeVisible()
  63 |   })
  64 | 
  65 |   test('admin prescriptions page loads', async ({ page }) => {
  66 |     await page.goto('/admin/prescriptions')
  67 |     await expect(page.getByRole('heading', { name: /prescription/i })).toBeVisible()
  68 |   })
  69 | })
  70 | 
```
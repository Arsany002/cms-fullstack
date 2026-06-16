# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth/register.spec.js >> Register page >> successful registration redirects away from /register
- Location: tests/e2e/auth/register.spec.js:57:3

# Error details

```
Error: expect(page).not.toHaveURL(expected) failed

Expected pattern: not /\/register/
Received string: "http://localhost:5173/register"
Timeout: 15000ms

Call log:
  - Expect "not toHaveURL" with timeout 15000ms
    33 × unexpected value "http://localhost:5173/register"

```

```yaml
- text: C
- heading "Create Account" [level=1]
- text: Too Many Attempts. Full Name
- textbox "Full Name":
  - /placeholder: John Doe
  - text: E2E Assistant 1781564655045
- text: Email
- textbox "Email":
  - /placeholder: you@example.com
  - text: e2e_assistant_1781564655045@example.com
- text: Password
- textbox "Password":
  - /placeholder: ••••••••
  - text: Password123456
- text: Confirm Password
- textbox "Confirm Password":
  - /placeholder: ••••••••
  - text: Password123456
- text: Role
- combobox "Role":
  - option "Select role…"
  - option "Doctor"
  - option "Assistant" [selected]
- text: Clinic
- combobox "Clinic":
  - option "Select clinic…"
  - option "E2E Clinic 1781563121952" [selected]
  - option "E2E Clinic 1781563535624"
  - option "E2E Clinic 1781564603839"
  - option "Playwright Test Clinic"
- button "Create Account"
- paragraph:
  - text: Already have an account?
  - link "Sign in":
    - /url: /login
- button "Open Tanstack query devtools":
  - img
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | import { getTestState } from '../helpers/auth.js'
  3  | import { injectSession } from '../helpers/auth.js'
  4  | import { setupNetworkMonitor, attachReports } from '../helpers/reporting.js'
  5  | import { makeAssistant, uniqueTs } from '../helpers/testData.js'
  6  | 
  7  | test.describe('Register page', () => {
  8  |   test('shows heading and form fields', async ({ page }) => {
  9  |     await page.goto('/register')
  10 |     await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible()
  11 |     await expect(page.getByPlaceholder('John Doe')).toBeVisible()
  12 |     await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
  13 |     await expect(page.locator('input[type="password"]').first()).toBeVisible()
  14 |     await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()
  15 |   })
  16 | 
  17 |   test('clinic dropdown is populated after selecting a role', async ({ page }) => {
  18 |     await page.goto('/register')
  19 |     const selects = page.locator('select')
  20 |     await selects.nth(0).selectOption({ label: 'Assistant' })
  21 |     const clinicSelect = selects.nth(1)
  22 |     await expect(clinicSelect).toBeVisible()
  23 |     const count = await clinicSelect.locator('option').count()
  24 |     expect(count).toBeGreaterThan(1) // at least one real clinic + placeholder
  25 |   })
  26 | 
  27 |   test('shows validation errors on empty submit', async ({ page }) => {
  28 |     await page.goto('/register')
  29 |     await page.getByRole('button', { name: /create account/i }).click()
  30 |     await expect(page.locator('.form-error').first()).toBeVisible()
  31 |   })
  32 | 
  33 |   test('shows password mismatch error', async ({ page }) => {
  34 |     await page.goto('/register')
  35 |     await page.getByPlaceholder('John Doe').fill('Test User')
  36 |     await page.getByPlaceholder('you@example.com').fill('test@example.com')
  37 |     const pwInputs = page.locator('input[type="password"]')
  38 |     await pwInputs.nth(0).fill('Password123456')
  39 |     await pwInputs.nth(1).fill('DifferentPassword')
  40 |     await page.locator('select').nth(0).selectOption({ label: 'Assistant' })
  41 |     const clinicSelect = page.locator('select').nth(1)
  42 |     await expect(clinicSelect).toBeVisible()
  43 |     await clinicSelect.selectOption({ index: 1 })
  44 |     await page.getByRole('button', { name: /create account/i }).click()
  45 |     // Backend returns 422 password confirmation error
  46 |     await expect(page.locator('text=/password|confirmation/i').first()).toBeVisible({ timeout: 8000 })
  47 |   })
  48 | 
  49 |   test('shows error for invalid email format', async ({ page }) => {
  50 |     await page.goto('/register')
  51 |     await page.getByPlaceholder('John Doe').fill('Test User')
  52 |     await page.getByPlaceholder('you@example.com').fill('not-an-email')
  53 |     await page.getByRole('button', { name: /create account/i }).click()
  54 |     await expect(page.locator('.form-error').filter({ hasText: /email/i })).toBeVisible()
  55 |   })
  56 | 
  57 |   test('successful registration redirects away from /register', async ({ page }, testInfo) => {
  58 |     const monitor = setupNetworkMonitor(page)
  59 |     const state = getTestState()
  60 |     const ts = uniqueTs()
  61 |     const user = makeAssistant(ts)
  62 | 
  63 |     await page.goto('/register')
  64 |     await page.getByPlaceholder('John Doe').fill(user.name)
  65 |     await page.getByPlaceholder('you@example.com').fill(user.email)
  66 |     const pwInputs = page.locator('input[type="password"]')
  67 |     await pwInputs.nth(0).fill(user.password)
  68 |     await pwInputs.nth(1).fill(user.password)
  69 |     await page.locator('select').nth(0).selectOption({ label: 'Assistant' })
  70 |     const clinicSelect = page.locator('select').nth(1)
  71 |     await expect(clinicSelect).toBeVisible()
  72 |     await clinicSelect.selectOption({ index: 1 })
  73 |     await page.getByRole('button', { name: /create account/i }).click()
  74 | 
> 75 |     await expect(page).not.toHaveURL(/\/register/, { timeout: 15000 })
     |                            ^ Error: expect(page).not.toHaveURL(expected) failed
  76 | 
  77 |     const token = await page.evaluate(() => localStorage.getItem('cms_token'))
  78 |     const storedUser = await page.evaluate(() => localStorage.getItem('cms_user'))
  79 |     expect(token).toBeTruthy()
  80 |     expect(storedUser).toBeTruthy()
  81 | 
  82 |     await attachReports(testInfo, monitor)
  83 |   })
  84 | 
  85 |   test('authenticated user is redirected away from /register', async ({ page }) => {
  86 |     const state = getTestState()
  87 |     await injectSession(page, state.assistant.token, state.assistant.user)
  88 |     await page.goto('/register')
  89 |     await expect(page).not.toHaveURL(/\/register/, { timeout: 8000 })
  90 |   })
  91 | })
  92 | 
```
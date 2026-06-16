# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: assistant/assistant-dashboard.spec.js >> Assistant dashboard >> page body is not blank
- Location: tests/e2e/assistant/assistant-dashboard.spec.js:40:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 50
Received:   0
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - complementary [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e6]: C
        - generic [ref=e7]: CMS
      - navigation [ref=e8]:
        - link "📊 Dashboard" [ref=e9] [cursor=pointer]:
          - /url: /assistant/dashboard
          - generic [ref=e10]: 📊
          - text: Dashboard
        - link "🧑‍⚕️ Patients" [ref=e11] [cursor=pointer]:
          - /url: /assistant/patients
          - generic [ref=e12]: 🧑‍⚕️
          - text: Patients
        - link "📅 Appointments" [ref=e13] [cursor=pointer]:
          - /url: /assistant/appointments
          - generic [ref=e14]: 📅
          - text: Appointments
    - generic [ref=e15]:
      - banner [ref=e16]:
        - generic [ref=e17]:
          - generic [ref=e18]:
            - paragraph [ref=e19]: E2E Assistant 1781564603839
            - paragraph [ref=e20]: Assistant
          - button "Sign Out" [ref=e21] [cursor=pointer]
      - main [ref=e22]:
        - generic [ref=e23]:
          - heading "Welcome, E2E Assistant 1781564603839" [level=1] [ref=e24]
          - paragraph [ref=e25]: "Today: 2026-06-15"
          - generic [ref=e26]:
            - generic [ref=e27]:
              - heading "Today's Appointments" [level=2] [ref=e28]
              - link "+ Book Appointment" [ref=e29] [cursor=pointer]:
                - /url: /assistant/appointments/new
                - button "+ Book Appointment" [ref=e30]
            - paragraph [ref=e32]: No appointments today
  - generic [ref=e33]:
    - img [ref=e35]
    - button "Open Tanstack query devtools" [ref=e83] [cursor=pointer]:
      - img [ref=e84]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | import { getTestState, injectSession } from '../helpers/auth.js'
  3  | import { setupNetworkMonitor, attachReports } from '../helpers/reporting.js'
  4  | 
  5  | test.describe('Assistant dashboard', () => {
  6  |   test.beforeEach(async ({ page }) => {
  7  |     const state = getTestState()
  8  |     await injectSession(page, state.assistant.token, state.assistant.user)
  9  |   })
  10 | 
  11 |   test('loads with correct heading and user name', async ({ page }, testInfo) => {
  12 |     const monitor = setupNetworkMonitor(page)
  13 |     const state = getTestState()
  14 | 
  15 |     await page.goto('/assistant/dashboard')
  16 |     await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible()
  17 |     await expect(page.locator('body')).toContainText(state.assistant.user.name)
  18 | 
  19 |     await attachReports(testInfo, monitor)
  20 |     expect(monitor.consoleErrors).toEqual([])
  21 |   })
  22 | 
  23 |   test("shows Today's Appointments section", async ({ page }) => {
  24 |     await page.goto('/assistant/dashboard')
  25 |     await expect(page.getByRole('heading', { name: /today.*appointment/i })).toBeVisible()
  26 |   })
  27 | 
  28 |   test('shows + Book Appointment button', async ({ page }) => {
  29 |     await page.goto('/assistant/dashboard')
  30 |     await expect(page.getByRole('link', { name: /book appointment/i })).toBeVisible()
  31 |   })
  32 | 
  33 |   test('sidebar has correct navigation links', async ({ page }) => {
  34 |     await page.goto('/assistant/dashboard')
  35 |     await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible()
  36 |     await expect(page.getByRole('link', { name: /patients/i })).toBeVisible()
  37 |     await expect(page.getByRole('link', { name: /appointments/i })).toBeVisible()
  38 |   })
  39 | 
  40 |   test('page body is not blank', async ({ page }) => {
  41 |     await page.goto('/assistant/dashboard')
  42 |     const bodyText = await page.locator('body').innerText()
> 43 |     expect(bodyText.length).toBeGreaterThan(50)
     |                             ^ Error: expect(received).toBeGreaterThan(expected)
  44 |   })
  45 | })
  46 | 
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth/login.spec.js >> Login page >> super_admin login redirects to admin dashboard
- Location: tests/e2e/auth/login.spec.js:54:3

# Error details

```
TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]: C
      - heading "Clinic Management System" [level=1] [ref=e7]
      - paragraph [ref=e8]: Sign in to your account
    - generic [ref=e9]:
      - generic [ref=e10]: Too Many Attempts.
      - generic [ref=e11]:
        - generic [ref=e12]:
          - generic [ref=e13]: Email address
          - textbox "Email address" [ref=e14]:
            - /placeholder: you@example.com
            - text: e2e_admin_1781564603839@example.com
        - generic [ref=e15]:
          - generic [ref=e16]: Password
          - textbox "Password" [ref=e17]:
            - /placeholder: ••••••••
            - text: Password123456
        - button "Sign In" [ref=e18] [cursor=pointer]
      - paragraph [ref=e19]:
        - text: Don't have an account?
        - link "Register" [ref=e20] [cursor=pointer]:
          - /url: /register
  - generic [ref=e21]:
    - img [ref=e23]
    - button "Open Tanstack query devtools" [ref=e71] [cursor=pointer]:
      - img [ref=e72]
```

# Test source

```ts
  1  | import fs from 'fs'
  2  | import { API_BASE, STATE_FILE } from './testData.js'
  3  | 
  4  | /** Call the backend register endpoint and return { user, token }. */
  5  | export async function apiRegister(userData) {
  6  |   const res = await fetch(`${API_BASE}/auth/register`, {
  7  |     method: 'POST',
  8  |     headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  9  |     body: JSON.stringify({ ...userData, password_confirmation: userData.password }),
  10 |   })
  11 |   const json = await res.json()
  12 |   if (!json.success) throw new Error(`Register failed: ${JSON.stringify(json)}`)
  13 |   return json.data // { user, token }
  14 | }
  15 | 
  16 | /** Call the backend login endpoint and return { user, token }. */
  17 | export async function apiLogin(email, password) {
  18 |   const res = await fetch(`${API_BASE}/auth/login`, {
  19 |     method: 'POST',
  20 |     headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  21 |     body: JSON.stringify({ email, password }),
  22 |   })
  23 |   const json = await res.json()
  24 |   if (!json.success) throw new Error(`Login failed: ${JSON.stringify(json)}`)
  25 |   return json.data // { user, token }
  26 | }
  27 | 
  28 | /**
  29 |  * Inject auth into the page WITHOUT doing a real /auth/me round-trip.
  30 |  *
  31 |  * Strategy:
  32 |  *   1. addInitScript – writes localStorage BEFORE any JS runs, so React's
  33 |  *      AuthContext reads the token on first render.
  34 |  *   2. page.route – intercepts GET /auth/me and returns the user immediately,
  35 |  *      so the loading spinner disappears in < 50ms instead of waiting for the
  36 |  *      real backend call.
  37 |  *
  38 |  * After calling this helper, navigate to any page and content will be
  39 |  * immediately visible (no 5-second spinner wait).
  40 |  */
  41 | export async function injectSession(page, token, user) {
  42 |   // 1. Pre-populate localStorage before page scripts run
  43 |   await page.addInitScript(({ t, u }) => {
  44 |     localStorage.setItem('cms_token', t)
  45 |     localStorage.setItem('cms_user', JSON.stringify(u))
  46 |   }, { t: token, u: user })
  47 | 
  48 |   // 2. Mock /auth/me so ProtectedRoute spinner disappears instantly
  49 |   await page.route('**/api/v1/auth/me', async (route) => {
  50 |     await route.fulfill({
  51 |       status: 200,
  52 |       contentType: 'application/json',
  53 |       body: JSON.stringify({ success: true, message: 'Success', data: user }),
  54 |     })
  55 |   })
  56 | }
  57 | 
  58 | /** Full UI login flow — uses the REAL backend (not mocked). */
  59 | export async function loginViaUI(page, email, password) {
  60 |   await page.goto('/login')
  61 |   await page.getByPlaceholder('you@example.com').fill(email)
  62 |   await page.locator('input[type="password"]').fill(password)
  63 |   await page.getByRole('button', { name: /sign in/i }).click()
> 64 |   await page.waitForURL(/\/(admin|doctor|assistant)\/dashboard/, { timeout: 15000 })
     |              ^ TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
  65 | }
  66 | 
  67 | /** Load shared test state written by global-setup.js */
  68 | export function getTestState() {
  69 |   if (!fs.existsSync(STATE_FILE)) {
  70 |     throw new Error(`Test state file not found at ${STATE_FILE}. Run global setup first.`)
  71 |   }
  72 |   return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'))
  73 | }
  74 | 
```
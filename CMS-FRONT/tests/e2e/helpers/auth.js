import fs from 'fs'
import { API_BASE, STATE_FILE } from './testData.js'

/** Call the backend register endpoint and return { user, token }. */
export async function apiRegister(userData) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...userData, password_confirmation: userData.password }),
  })
  const json = await res.json()
  if (!json.success) throw new Error(`Register failed: ${JSON.stringify(json)}`)
  return json.data // { user, token }
}

export async function registerTestUser(userData) {
  return apiRegister(userData)
}

/** Call the backend login endpoint and return { user, token }. */
export async function apiLogin(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const json = await res.json()
  if (!json.success) throw new Error(`Login failed: ${JSON.stringify(json)}`)
  return json.data // { user, token }
}

export async function apiLogout(token) {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  const json = await res.json()
  if (!json.success) throw new Error(`Logout failed: ${JSON.stringify(json)}`)
  return json
}

/**
 * Inject auth into the page WITHOUT doing a real /auth/me round-trip.
 *
 * Strategy:
 *   1. addInitScript – writes localStorage BEFORE any JS runs, so React's
 *      AuthContext reads the token on first render.
 *   2. page.route – intercepts GET /auth/me and returns the user immediately,
 *      so the loading spinner disappears in < 50ms instead of waiting for the
 *      real backend call.
 *
 * After calling this helper, navigate to any page and content will be
 * immediately visible (no 5-second spinner wait).
 */
export async function injectSession(page, token, user) {
  // 1. Pre-populate localStorage before page scripts run
  await page.addInitScript(({ t, u }) => {
    localStorage.setItem('cms_token', t)
    localStorage.setItem('cms_user', JSON.stringify(u))
  }, { t: token, u: user })

  // 2. Mock /auth/me so ProtectedRoute spinner disappears instantly
  await page.route('**/api/v1/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, message: 'Success', data: user }),
    })
  })
}

export async function verifyLocalStorageAuth(page, expectedUser = null) {
  const session = await page.evaluate(() => ({
    token: localStorage.getItem('cms_token'),
    user: localStorage.getItem('cms_user'),
  }))

  if (!session.token) throw new Error('Expected cms_token in localStorage')
  if (!session.user) throw new Error('Expected cms_user in localStorage')

  const user = JSON.parse(session.user)
  if (expectedUser?.email && user.email !== expectedUser.email) {
    throw new Error(`Expected localStorage user ${expectedUser.email}, got ${user.email}`)
  }

  return { token: session.token, user }
}

export async function logoutViaUI(page) {
  await page.getByRole('button', { name: /logout|sign out/i }).click()
  await page.waitForURL(/\/login/, { timeout: 15000 })
}

/** Full UI login flow — uses the REAL backend (not mocked). */
export async function loginViaUI(page, email, password) {
  await page.goto('/login')
  await page.getByPlaceholder('you@example.com').fill(email)
  await page.locator('input[type="password"]').fill(password)
  await page.getByRole('button', { name: /sign in/i }).click()
  await page.waitForURL(/\/(admin|doctor|assistant)\/dashboard/, { timeout: 15000 })
}

/** Load shared test state written by global-setup.js */
export function getTestState() {
  if (!fs.existsSync(STATE_FILE)) {
    throw new Error(`Test state file not found at ${STATE_FILE}. Run global setup first.`)
  }
  return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'))
}

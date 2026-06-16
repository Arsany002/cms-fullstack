/**
 * Google OAuth E2E tests.
 *
 * Because real Google OAuth requires a browser redirect to accounts.google.com
 * (which Playwright cannot complete without real credentials), these tests cover:
 *
 *  1. UI/UX assertions — buttons present, validation messages shown.
 *  2. The GoogleCallback page — error states (missing code, error param).
 *  3. The GoogleCallback exchange flow — simulated via the real backend exchange
 *     endpoint, seeded with a one-time code in the DB cache.
 *
 * Full end-to-end Google OAuth (redirect → Google → callback) is not tested
 * here because it requires real OAuth credentials. That flow is covered by the
 * backend PHPUnit tests using Socialite mocking.
 */

import { test, expect } from '../fixtures.js'
import { getTestState } from '../helpers/auth.js'
import { API_BASE } from '../helpers/testData.js'

const BASE = process.env.TEST_BASE_URL || 'http://127.0.0.1:5174'

// ─── Register page ────────────────────────────────────────────────────────────

test.describe('Register page — Google button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register')
  })

  test('shows "Register with Google" button', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: /register with google/i })
    ).toBeVisible()
  })

  test('clicking Google without selecting role shows validation error', async ({ page }) => {
    await page.getByRole('button', { name: /register with google/i }).click()

    // Should NOT navigate away — error message visible
    await expect(page.getByText(/please select a role/i)).toBeVisible()
    await expect(page).toHaveURL(/\/register/)
  })

  test('clicking Google as doctor without clinic shows clinic validation error', async ({ page }) => {
    await page.selectOption('select', { label: 'Doctor' })

    // Wait for clinic dropdown to appear
    await expect(page.getByLabel(/clinic/i)).toBeVisible()

    await page.getByRole('button', { name: /register with google/i }).click()

    await expect(page.getByText(/please select a clinic/i)).toBeVisible()
    await expect(page).toHaveURL(/\/register/)
  })

  test('clicking Google as assistant without clinic shows clinic validation error', async ({ page }) => {
    await page.selectOption('select', { label: 'Assistant' })
    await expect(page.getByLabel(/clinic/i)).toBeVisible()

    await page.getByRole('button', { name: /register with google/i }).click()

    await expect(page.getByText(/please select a clinic/i)).toBeVisible()
  })

  test('role and clinic dropdowns are required — clinic appears only for doctor/assistant', async ({ page }) => {
    // Initially no clinic dropdown
    await expect(page.getByLabel(/clinic/i)).not.toBeVisible()

    await page.selectOption('select', { label: 'Doctor' })
    await expect(page.getByLabel(/clinic/i)).toBeVisible()
  })
})

// ─── Login page ───────────────────────────────────────────────────────────────

test.describe('Login page — Google button', () => {
  test('shows "Continue with Google" button', async ({ page }) => {
    await page.goto('/login')
    await expect(
      page.getByRole('button', { name: /continue with google/i })
    ).toBeVisible()
  })
})

// ─── GoogleCallback page — error states ──────────────────────────────────────

test.describe('GoogleCallback page — error handling', () => {
  test('shows sign-in failed for missing code and no error param', async ({ page }) => {
    await page.goto('/auth/google/callback')
    await expect(page.getByText(/sign-in failed/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /back to login/i })).toBeVisible()
  })

  test('shows registration_required message for that error param', async ({ page }) => {
    await page.goto('/auth/google/callback?error=registration_required')
    await expect(page.getByText(/not registered yet/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /register/i })).toBeVisible()
  })

  test('shows account_deactivated message for that error param', async ({ page }) => {
    await page.goto('/auth/google/callback?error=account_deactivated')
    await expect(page.getByText(/deactivated/i)).toBeVisible()
  })

  test('shows state_invalid message for that error param', async ({ page }) => {
    await page.goto('/auth/google/callback?error=state_invalid')
    await expect(page.getByText(/expired or was invalid/i)).toBeVisible()
  })

  test('shows generic error for unknown error param', async ({ page }) => {
    await page.goto('/auth/google/callback?error=something_weird')
    await expect(page.getByText(/sign-in failed/i)).toBeVisible()
  })
})

// ─── GoogleCallback exchange flow — real backend ──────────────────────────────

test.describe('GoogleCallback page — exchange flow', () => {
  /**
   * Seed a one-time exchange code in the backend cache via a direct API call.
   * This simulates what the backend callback handler would normally do.
   * Only works in local/testing mode where the backend is accessible.
   */
  async function seedExchangeCode(userId) {
    const res = await fetch(`${API_BASE}/testing/google-exchange-seed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.code ?? null
  }

  test('exchanges valid code and redirects to dashboard', async ({ page }) => {
    const state = getTestState()
    const userId = state.assistant?.user?.id
    if (!userId) {
      test.skip(true, 'No assistant user in test state')
      return
    }

    const code = await seedExchangeCode(userId)
    if (!code) {
      test.skip(true, 'Testing seed endpoint not available — skipping exchange flow test')
      return
    }

    await page.goto(`/auth/google/callback?code=${code}`)
    await page.waitForURL(/\/(assistant|doctor|admin)\/dashboard/, { timeout: 10000 })
    const token = await page.evaluate(() => localStorage.getItem('cms_token'))
    expect(token).not.toBeNull()
  })

  test('shows error for expired/invalid exchange code', async ({ page }) => {
    // Use a valid-format UUID that doesn't exist in cache
    await page.goto('/auth/google/callback?code=00000000-0000-0000-0000-000000000000')
    await expect(page.getByText(/sign-in failed/i)).toBeVisible({ timeout: 8000 })
  })
})

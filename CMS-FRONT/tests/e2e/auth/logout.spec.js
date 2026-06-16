import { test, expect } from '../fixtures.js'
import { getTestState, loginViaUI } from '../helpers/auth.js'

test.describe('Logout', () => {
  test('sign-out button clears session and redirects to login', async ({ page }) => {
    const state = getTestState()
    // Use real UI login so this test gets a fresh Passport token.
    // Logging out revokes that fresh token only — the shared state.assistant.token
    // used by later tests (e.g. smoke/navigation) stays valid in the DB.
    await loginViaUI(page, state.assistant.email, state.assistant.password)
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible()

    await page.getByRole('button', { name: /sign out/i }).click()

    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })

    const token = await page.evaluate(() => localStorage.getItem('cms_token'))
    const user  = await page.evaluate(() => localStorage.getItem('cms_user'))
    expect(token).toBeNull()
    expect(user).toBeNull()
  })
})

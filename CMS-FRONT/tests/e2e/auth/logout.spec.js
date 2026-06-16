import { test, expect } from '@playwright/test'
import { getTestState, injectSession } from '../helpers/auth.js'

test.describe('Logout', () => {
  test('sign-out button clears session and redirects to login', async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.assistant.token, state.assistant.user)
    await page.goto('/assistant/dashboard')
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible()

    await page.getByRole('button', { name: /sign out/i }).click()

    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })

    const token = await page.evaluate(() => localStorage.getItem('cms_token'))
    const user  = await page.evaluate(() => localStorage.getItem('cms_user'))
    expect(token).toBeNull()
    expect(user).toBeNull()
  })
})

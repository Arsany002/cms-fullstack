import { test, expect } from '@playwright/test'
import { getTestState, injectSession, loginViaUI } from '../helpers/auth.js'
import { setupNetworkMonitor, attachReports } from '../helpers/reporting.js'

test.describe('Login page', () => {
  test('shows heading and form fields', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: /clinic management system/i })).toBeVisible()
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /register/i })).toBeVisible()
  })

  test('shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.locator('.form-error').first()).toBeVisible()
  })

  test('shows error on wrong credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('you@example.com').fill('nobody@example.com')
    await page.locator('input[type="password"]').fill('WrongPassword999')
    await page.getByRole('button', { name: /sign in/i }).click()
    // Should show alert error message, still on /login
    await expect(page).toHaveURL(/\/login/, { timeout: 8000 })
    await expect(page.locator('[role="alert"], .text-red-600, .text-red-700').first()).toBeVisible({ timeout: 8000 })
  })

  test('assistant login redirects to assistant dashboard', async ({ page }, testInfo) => {
    const monitor = setupNetworkMonitor(page)
    const state = getTestState()

    await loginViaUI(page, state.assistant.email, state.assistant.password)
    await expect(page).toHaveURL(/\/assistant\/dashboard/)

    const token = await page.evaluate(() => localStorage.getItem('cms_token'))
    const storedUser = await page.evaluate(() => localStorage.getItem('cms_user'))
    expect(token).toBeTruthy()
    expect(JSON.parse(storedUser).role).toBe('assistant')

    await attachReports(testInfo, monitor)
    expect(monitor.consoleErrors).toEqual([])
    expect(monitor.failedRequests).toEqual([])
  })

  test('doctor login redirects to doctor dashboard', async ({ page }) => {
    const state = getTestState()
    await loginViaUI(page, state.doctor.email, state.doctor.password)
    await expect(page).toHaveURL(/\/doctor\/dashboard/)
  })

  test('super_admin login redirects to admin dashboard', async ({ page }) => {
    const state = getTestState()
    await loginViaUI(page, state.superAdmin.email, state.superAdmin.password)
    await expect(page).toHaveURL(/\/admin\/dashboard/)
  })

  test('authenticated user is redirected away from /login', async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.assistant.token, state.assistant.user)
    await page.goto('/login')
    await expect(page).not.toHaveURL(/\/login/, { timeout: 8000 })
  })
})

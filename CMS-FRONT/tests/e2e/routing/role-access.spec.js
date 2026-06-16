import { test, expect } from '../fixtures.js'
import { getTestState, injectSession } from '../helpers/auth.js'

test.describe('Role-based route access', () => {
  test('assistant cannot access /admin/dashboard — redirected', async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.assistant.token, state.assistant.user)
    await page.goto('/admin/dashboard')
    await expect(page).not.toHaveURL(/\/admin\/dashboard/, { timeout: 8000 })
    // Should end up on assistant dashboard or login
    await expect(page).toHaveURL(/\/assistant\/dashboard|\/login/, { timeout: 8000 })
  })

  test('assistant cannot access /doctor/dashboard — redirected', async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.assistant.token, state.assistant.user)
    await page.goto('/doctor/dashboard')
    await expect(page).not.toHaveURL(/\/doctor\/dashboard/, { timeout: 8000 })
  })

  test('doctor cannot access /admin/dashboard — redirected', async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.doctor.token, state.doctor.user)
    await page.goto('/admin/dashboard')
    await expect(page).not.toHaveURL(/\/admin\/dashboard/, { timeout: 8000 })
  })

  test('doctor cannot access /assistant/dashboard — redirected', async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.doctor.token, state.doctor.user)
    await page.goto('/assistant/dashboard')
    await expect(page).not.toHaveURL(/\/assistant\/dashboard/, { timeout: 8000 })
  })

  test('super_admin cannot access /doctor/dashboard — redirected', async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.superAdmin.token, state.superAdmin.user)
    await page.goto('/doctor/dashboard')
    await expect(page).not.toHaveURL(/\/doctor\/dashboard/, { timeout: 8000 })
  })

  test('super_admin cannot access /assistant/dashboard — redirected', async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.superAdmin.token, state.superAdmin.user)
    await page.goto('/assistant/dashboard')
    await expect(page).not.toHaveURL(/\/assistant\/dashboard/, { timeout: 8000 })
  })

  test('assistant can access their own dashboard', async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.assistant.token, state.assistant.user)
    await page.goto('/assistant/dashboard')
    await expect(page).toHaveURL(/\/assistant\/dashboard/)
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible()
  })

  test('doctor can access their own dashboard', async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.doctor.token, state.doctor.user)
    await page.goto('/doctor/dashboard')
    await expect(page).toHaveURL(/\/doctor\/dashboard/)
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible()
  })

  test('super_admin can access admin dashboard', async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.superAdmin.token, state.superAdmin.user)
    await page.goto('/admin/dashboard')
    await expect(page).toHaveURL(/\/admin\/dashboard/)
    await expect(page.getByRole('heading', { name: /system overview/i })).toBeVisible()
  })
})

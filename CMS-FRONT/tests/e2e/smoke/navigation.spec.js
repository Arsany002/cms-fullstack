import { test, expect } from '@playwright/test'
import { getTestState, injectSession } from '../helpers/auth.js'
import { setupNetworkMonitor, attachReports } from '../helpers/reporting.js'

test.describe('Navigation smoke tests', () => {
  test('assistant sidebar links navigate correctly', async ({ page }, testInfo) => {
    const monitor = setupNetworkMonitor(page)
    const state = getTestState()
    await injectSession(page, state.assistant.token, state.assistant.user)
    await page.goto('/assistant/dashboard')

    await page.getByRole('link', { name: /patients/i }).click()
    await expect(page).toHaveURL(/\/assistant\/patients/)
    await expect(page.getByRole('heading', { name: /patients/i })).toBeVisible()

    await page.getByRole('link', { name: /appointments/i }).click()
    await expect(page).toHaveURL(/\/assistant\/appointments/)
    await expect(page.getByRole('heading', { name: /appointments/i })).toBeVisible()

    await attachReports(testInfo, monitor)
    expect(monitor.consoleErrors).toEqual([])
  })

  test('doctor sidebar links navigate correctly', async ({ page }, testInfo) => {
    const monitor = setupNetworkMonitor(page)
    const state = getTestState()
    await injectSession(page, state.doctor.token, state.doctor.user)
    await page.goto('/doctor/dashboard')

    await page.getByRole('link', { name: /schedules/i }).click()
    await expect(page).toHaveURL(/\/doctor\/schedules/)

    await page.getByRole('link', { name: /prescriptions/i }).click()
    await expect(page).toHaveURL(/\/doctor\/prescriptions/)

    await page.getByRole('link', { name: /patients/i }).click()
    await expect(page).toHaveURL(/\/doctor\/patients/)

    await attachReports(testInfo, monitor)
    expect(monitor.consoleErrors).toEqual([])
  })

  test('admin sidebar links navigate correctly', async ({ page }, testInfo) => {
    const monitor = setupNetworkMonitor(page)
    const state = getTestState()
    await injectSession(page, state.superAdmin.token, state.superAdmin.user)
    await page.goto('/admin/dashboard')

    await page.getByRole('link', { name: /clinics/i }).click()
    await expect(page).toHaveURL(/\/admin\/clinics/)

    await page.getByRole('link', { name: /users/i }).click()
    await expect(page).toHaveURL(/\/admin\/users/)

    await page.getByRole('link', { name: /appointments/i }).click()
    await expect(page).toHaveURL(/\/admin\/appointments/)

    await attachReports(testInfo, monitor)
    expect(monitor.consoleErrors).toEqual([])
  })

  test('mobile viewport — assistant dashboard renders', async ({ page }) => {
    const state = getTestState()
    await page.setViewportSize({ width: 375, height: 812 })
    await injectSession(page, state.assistant.token, state.assistant.user)
    await page.goto('/assistant/dashboard')
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible()
    const bodyText = await page.locator('body').innerText()
    expect(bodyText.length).toBeGreaterThan(20)
  })

  test('mobile viewport — login page renders', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: /clinic management/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })
})

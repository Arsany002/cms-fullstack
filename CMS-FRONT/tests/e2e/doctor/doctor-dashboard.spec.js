import { test, expect } from '../fixtures.js'
import { getTestState, injectSession } from '../helpers/auth.js'
import { setupNetworkMonitor, attachReports } from '../helpers/reporting.js'

test.describe('Doctor dashboard', () => {
  test.beforeEach(async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.doctor.token, state.doctor.user)
  })

  test('loads with Welcome heading containing "Dr."', async ({ page }, testInfo) => {
    const monitor = setupNetworkMonitor(page)
    const state = getTestState()

    await page.goto('/doctor/dashboard')
    await expect(page.getByRole('heading', { name: /welcome.*dr\./i })).toBeVisible()
    await expect(page.locator('body')).toContainText(state.doctor.user.name)

    await attachReports(testInfo, monitor)
    expect(monitor.consoleErrors).toEqual([])
  })

  test("shows Today's Appointments section", async ({ page }) => {
    await page.goto('/doctor/dashboard')
    await expect(page.getByRole('heading', { name: /today.*appointment/i })).toBeVisible()
  })

  test('shows Recent Prescriptions section', async ({ page }) => {
    await page.goto('/doctor/dashboard')
    await expect(page.getByRole('heading', { name: /recent prescription/i })).toBeVisible()
  })

  test('sidebar has correct navigation links', async ({ page }) => {
    await page.goto('/doctor/dashboard')
    await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /schedules/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /appointments/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /prescriptions/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /patients/i })).toBeVisible()
  })
})

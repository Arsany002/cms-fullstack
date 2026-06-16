import { test, expect } from '@playwright/test'
import { getTestState, injectSession } from '../helpers/auth.js'
import { setupNetworkMonitor, attachReports } from '../helpers/reporting.js'

test.describe('Assistant dashboard', () => {
  test.beforeEach(async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.assistant.token, state.assistant.user)
  })

  test('loads with correct heading and user name', async ({ page }, testInfo) => {
    const monitor = setupNetworkMonitor(page)
    const state = getTestState()

    await page.goto('/assistant/dashboard')
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible()
    await expect(page.locator('body')).toContainText(state.assistant.user.name)

    await attachReports(testInfo, monitor)
    expect(monitor.consoleErrors).toEqual([])
  })

  test("shows Today's Appointments section", async ({ page }) => {
    await page.goto('/assistant/dashboard')
    await expect(page.getByRole('heading', { name: /today.*appointment/i })).toBeVisible()
  })

  test('shows + Book Appointment button', async ({ page }) => {
    await page.goto('/assistant/dashboard')
    await expect(page.getByRole('link', { name: /book appointment/i })).toBeVisible()
  })

  test('sidebar has correct navigation links', async ({ page }) => {
    await page.goto('/assistant/dashboard')
    await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /patients/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /appointments/i })).toBeVisible()
  })

  test('page body is not blank', async ({ page }) => {
    await page.goto('/assistant/dashboard')
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible()
    const bodyText = await page.locator('body').innerText()
    expect(bodyText.length).toBeGreaterThan(50)
  })
})

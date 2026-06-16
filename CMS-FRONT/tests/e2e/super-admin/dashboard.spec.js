import { test, expect } from '@playwright/test'
import { getTestState, injectSession } from '../helpers/auth.js'
import { setupNetworkMonitor, attachReports } from '../helpers/reporting.js'

test.describe('Super Admin — Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.superAdmin.token, state.superAdmin.user)
  })

  test('loads System Overview heading', async ({ page }, testInfo) => {
    const monitor = setupNetworkMonitor(page)

    await page.goto('/admin/dashboard')
    await expect(page.getByRole('heading', { name: /system overview/i })).toBeVisible()

    await attachReports(testInfo, monitor)
    expect(monitor.consoleErrors).toEqual([])
  })

  test('shows stat cards', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await expect(page.locator('text=Total Clinics')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Total Users')).toBeVisible()
    await expect(page.locator('text=Total Appointments')).toBeVisible()
  })

  test('sidebar has admin navigation links', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await expect(page.getByRole('link', { name: /clinics/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /users/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /appointments/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /prescriptions/i })).toBeVisible()
  })
})

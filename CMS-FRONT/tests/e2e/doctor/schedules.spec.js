import { test, expect } from '../fixtures.js'
import { getTestState, injectSession } from '../helpers/auth.js'
import { setupNetworkMonitor, attachReports } from '../helpers/reporting.js'

test.describe('Doctor — Schedules', () => {
  test.beforeEach(async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.doctor.token, state.doctor.user)
  })

  test('schedule list page loads', async ({ page }) => {
    await page.goto('/doctor/schedules')
    await expect(page.getByRole('heading', { name: /my schedules/i })).toBeVisible()
  })

  test('shows + New Schedule button', async ({ page }) => {
    await page.goto('/doctor/schedules')
    await expect(page.getByRole('link', { name: /new schedule/i })).toBeVisible()
  })

  test('new schedule form loads with all fields', async ({ page }) => {
    await page.goto('/doctor/schedules/new')
    await expect(page.getByRole('heading', { name: /new schedule/i })).toBeVisible()
    await expect(page.getByLabel('Day of Week')).toBeVisible()
    await expect(page.getByLabel('Start Time')).toBeVisible()
    await expect(page.getByLabel('End Time')).toBeVisible()
    await expect(page.getByLabel(/slot duration/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /create/i })).toBeVisible()
  })

  test('new schedule form shows validation on empty submit', async ({ page }) => {
    await page.goto('/doctor/schedules/new')
    await page.getByRole('button', { name: /create/i }).click()
    await expect(page.locator('.form-error').first()).toBeVisible()
  })

  test('creates a schedule successfully', async ({ page }, testInfo) => {
    const monitor = setupNetworkMonitor(page)

    await page.goto('/doctor/schedules/new')
    await page.getByLabel('Day of Week').selectOption({ value: '1' }) // Monday
    await page.getByLabel('Start Time').fill('09:00')
    await page.getByLabel('End Time').fill('17:00')
    await page.getByLabel(/slot duration/i).fill('30')

    await page.getByRole('button', { name: /create/i }).click()
    await expect(page).toHaveURL(/\/doctor\/schedules$/, { timeout: 10000 })
    await expect(page.getByRole('heading', { name: /my schedules/i })).toBeVisible()

    await attachReports(testInfo, monitor)
    expect(monitor.consoleErrors).toEqual([])
  })
})

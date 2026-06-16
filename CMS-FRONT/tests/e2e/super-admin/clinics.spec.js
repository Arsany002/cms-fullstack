import { test, expect } from '@playwright/test'
import { getTestState, injectSession } from '../helpers/auth.js'
import { setupNetworkMonitor, attachReports } from '../helpers/reporting.js'
import { makeClinic, uniqueTs } from '../helpers/testData.js'

test.describe('Super Admin — Clinics', () => {
  test.beforeEach(async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.superAdmin.token, state.superAdmin.user)
  })

  test('clinic list page loads with heading', async ({ page }) => {
    await page.goto('/admin/clinics')
    await expect(page.getByRole('heading', { name: /clinics/i })).toBeVisible()
  })

  test('shows + New Clinic button', async ({ page }) => {
    await page.goto('/admin/clinics')
    await expect(page.getByRole('link', { name: /new clinic/i })).toBeVisible()
  })

  test('clinic list shows at least one clinic', async ({ page }) => {
    await page.goto('/admin/clinics')
    // Table should have at least the test clinic created in global-setup
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10000 })
  })

  test('new clinic form loads with required fields', async ({ page }) => {
    await page.goto('/admin/clinics/new')
    await expect(page.getByRole('heading', { name: /new clinic/i })).toBeVisible()
    await expect(page.getByLabel('Name')).toBeVisible()
    await expect(page.getByLabel('Address')).toBeVisible()
    await expect(page.getByRole('button', { name: /create/i })).toBeVisible()
  })

  test('new clinic form shows validation on empty submit', async ({ page }) => {
    await page.goto('/admin/clinics/new')
    await page.getByRole('button', { name: /create/i }).click()
    await expect(page.locator('.form-error').first()).toBeVisible()
  })

  test('creates a clinic successfully', async ({ page }, testInfo) => {
    const monitor = setupNetworkMonitor(page)
    const clinic = makeClinic(uniqueTs())

    await page.goto('/admin/clinics/new')
    await page.getByLabel('Name').fill(clinic.name)
    await page.getByLabel('Address').fill(clinic.address)
    await page.getByLabel('Phone').fill(clinic.phone)
    await page.getByLabel('Email').fill(clinic.email)

    await page.getByRole('button', { name: /create/i }).click()
    await expect(page).toHaveURL(/\/admin\/clinics$/, { timeout: 10000 })
    await expect(page.getByRole('heading', { name: /clinics/i })).toBeVisible()

    await attachReports(testInfo, monitor)
    expect(monitor.consoleErrors).toEqual([])
  })

  test('edit clinic form pre-fills values', async ({ page }) => {
    const state = getTestState()
    const clinicId = state.clinic.id
    await page.goto(`/admin/clinics/${clinicId}/edit`)
    await expect(page.getByRole('heading', { name: /edit clinic/i })).toBeVisible()
    // Name field should be pre-filled
    await expect(page.getByLabel('Name')).not.toBeEmpty()
  })
})

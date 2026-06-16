import { test, expect } from '@playwright/test'
import { getTestState, injectSession } from '../helpers/auth.js'
import { setupNetworkMonitor, attachReports } from '../helpers/reporting.js'
import { makePatient, uniqueTs } from '../helpers/testData.js'

test.describe('Assistant — Patients', () => {
  test.beforeEach(async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.assistant.token, state.assistant.user)
  })

  test('patients list page loads with heading', async ({ page }) => {
    await page.goto('/assistant/patients')
    await expect(page.getByRole('heading', { name: /patients/i })).toBeVisible()
  })

  test('shows + New Patient button', async ({ page }) => {
    await page.goto('/assistant/patients')
    await expect(page.getByRole('link', { name: /new patient/i })).toBeVisible()
  })

  test('search input is visible', async ({ page }) => {
    await page.goto('/assistant/patients')
    await expect(page.getByPlaceholder(/search/i)).toBeVisible()
  })

  test('new patient form loads with all required fields', async ({ page }) => {
    await page.goto('/assistant/patients/new')
    await expect(page.getByRole('heading', { name: /new patient/i })).toBeVisible()
    await expect(page.getByLabel('Full Name')).toBeVisible()
    await expect(page.getByLabel('Gender')).toBeVisible()
    await expect(page.getByRole('button', { name: /create/i })).toBeVisible()
  })

  test('new patient form shows validation on empty submit', async ({ page }) => {
    await page.goto('/assistant/patients/new')
    await page.getByRole('button', { name: /create/i }).click()
    await expect(page.locator('.form-error').first()).toBeVisible()
  })

  test('creates a new patient successfully', async ({ page }, testInfo) => {
    const monitor = setupNetworkMonitor(page)
    const patient = makePatient(uniqueTs())

    await page.goto('/assistant/patients/new')
    await page.getByLabel('Full Name').fill(patient.name)
    await page.getByLabel('Phone').fill(patient.phone)
    await page.getByLabel('Email').fill(patient.email)
    await page.getByLabel('Date of Birth').fill(patient.date_of_birth)
    await page.getByLabel('Gender').selectOption({ value: 'male' })
    await page.getByLabel('Address').fill(patient.address)

    await page.getByRole('button', { name: /create/i }).click()
    await expect(page).toHaveURL(/\/assistant\/patients$/, { timeout: 10000 })
    await expect(page.getByRole('heading', { name: /patients/i })).toBeVisible()

    await attachReports(testInfo, monitor)
    expect(monitor.consoleErrors).toEqual([])
  })
})

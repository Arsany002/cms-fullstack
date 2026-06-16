import { test, expect } from '../fixtures.js'
import { getTestState, injectSession } from '../helpers/auth.js'

test.describe('Assistant — Appointments', () => {
  test.beforeEach(async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.assistant.token, state.assistant.user)
  })

  test('appointments list page loads', async ({ page }) => {
    await page.goto('/assistant/appointments')
    await expect(page.getByRole('heading', { name: /appointments/i })).toBeVisible()
  })

  test('shows + Book Appointment button', async ({ page }) => {
    await page.goto('/assistant/appointments')
    await expect(page.getByRole('link', { name: /book appointment/i })).toBeVisible()
  })

  test('book appointment form loads with required fields', async ({ page }) => {
    await page.goto('/assistant/appointments/new')
    await expect(page.getByRole('heading', { name: /book appointment/i })).toBeVisible()
    // Patient and Doctor selects should be visible
    await expect(page.getByLabel('Patient')).toBeVisible()
    await expect(page.getByLabel('Doctor')).toBeVisible()
  })

  test('available slots page loads with heading', async ({ page }) => {
    await page.goto('/assistant/available-slots')
    await expect(page.getByRole('heading', { name: /available slots/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /check slots/i })).toBeVisible()
  })
})

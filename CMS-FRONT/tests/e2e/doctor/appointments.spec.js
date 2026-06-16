import { test, expect } from '@playwright/test'
import { getTestState, injectSession } from '../helpers/auth.js'

test.describe('Doctor — Appointments', () => {
  test.beforeEach(async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.doctor.token, state.doctor.user)
  })

  test('appointments list page loads', async ({ page }) => {
    await page.goto('/doctor/appointments')
    await expect(page.getByRole('heading', { name: /appointments/i })).toBeVisible()
  })

  test('page body is not blank and has no React crash', async ({ page }) => {
    await page.goto('/doctor/appointments')
    const bodyText = await page.locator('body').innerText()
    expect(bodyText.length).toBeGreaterThan(20)
    await expect(page.locator('body')).not.toContainText(/something went wrong/i)
  })
})

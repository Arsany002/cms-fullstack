import { test, expect } from '@playwright/test'
import { getTestState, injectSession } from '../helpers/auth.js'

test.describe('Doctor — Prescriptions', () => {
  test.beforeEach(async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.doctor.token, state.doctor.user)
  })

  test('prescription list page loads', async ({ page }) => {
    await page.goto('/doctor/prescriptions')
    await expect(page.getByRole('heading', { name: /prescription/i })).toBeVisible()
  })

  test('shows + New Prescription button', async ({ page }) => {
    await page.goto('/doctor/prescriptions')
    await expect(page.getByRole('link', { name: /new prescription/i })).toBeVisible()
  })

  test('new prescription form loads', async ({ page }) => {
    await page.goto('/doctor/prescriptions/new')
    await expect(page.getByRole('heading', { name: /new prescription/i })).toBeVisible()
    await expect(page.getByLabel(/diagnosis/i)).toBeVisible()
  })

  test('patients list loads for doctor', async ({ page }) => {
    await page.goto('/doctor/patients')
    await expect(page.getByRole('heading', { name: /patients/i })).toBeVisible()
  })
})

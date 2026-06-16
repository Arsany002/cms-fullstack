import { test, expect } from '@playwright/test'
import { getTestState, injectSession } from '../helpers/auth.js'
import { makeDoctor, uniqueTs } from '../helpers/testData.js'

test.describe('Super Admin — Users', () => {
  test.beforeEach(async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.superAdmin.token, state.superAdmin.user)
  })

  test('users list page loads with heading', async ({ page }) => {
    await page.goto('/admin/users')
    await expect(page.getByRole('heading', { name: /users/i })).toBeVisible()
  })

  test('shows + New User button', async ({ page }) => {
    await page.goto('/admin/users')
    await expect(page.getByRole('link', { name: /new user/i })).toBeVisible()
  })

  test('users list shows at least one user', async ({ page }) => {
    await page.goto('/admin/users')
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10000 })
  })

  test('new user form loads with required fields', async ({ page }) => {
    await page.goto('/admin/users/new')
    await expect(page.getByRole('heading', { name: /new user/i })).toBeVisible()
    await expect(page.getByLabel('Name')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByLabel('Role')).toBeVisible()
  })

  test('new user form validation fires on empty submit', async ({ page }) => {
    await page.goto('/admin/users/new')
    await page.getByRole('button', { name: /create/i }).click()
    await expect(page.locator('.form-error').first()).toBeVisible()
  })

  test('creates a new doctor user successfully', async ({ page }) => {
    const state = getTestState()
    const doctor = makeDoctor(uniqueTs())

    await page.goto('/admin/users/new')
    await page.getByLabel('Name').fill(doctor.name)
    await page.getByLabel('Email').fill(doctor.email)
    await page.getByLabel('Password').fill(doctor.password)
    await page.getByLabel('Role').selectOption({ value: 'doctor' })
    // Clinic dropdown should appear after selecting doctor role
    const clinicSelect = page.getByLabel('Clinic')
    if (await clinicSelect.isVisible()) {
      await clinicSelect.selectOption({ index: 1 })
    }

    await page.getByRole('button', { name: /create/i }).click()
    await expect(page).toHaveURL(/\/admin\/users$/, { timeout: 10000 })
  })

  test('admin appointments page loads', async ({ page }) => {
    await page.goto('/admin/appointments')
    await expect(page.getByRole('heading', { name: /appointments/i })).toBeVisible()
  })

  test('admin prescriptions page loads', async ({ page }) => {
    await page.goto('/admin/prescriptions')
    await expect(page.getByRole('heading', { name: /prescription/i })).toBeVisible()
  })
})

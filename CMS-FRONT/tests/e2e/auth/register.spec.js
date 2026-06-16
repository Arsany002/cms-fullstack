import { test, expect } from '@playwright/test'
import { getTestState } from '../helpers/auth.js'
import { injectSession } from '../helpers/auth.js'
import { setupNetworkMonitor, attachReports } from '../helpers/reporting.js'
import { makeAssistant, uniqueTs } from '../helpers/testData.js'

test.describe('Register page', () => {
  test('shows heading and form fields', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible()
    await expect(page.getByPlaceholder('John Doe')).toBeVisible()
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()
  })

  test('clinic dropdown is populated after selecting a role', async ({ page }) => {
    await page.goto('/register')
    const selects = page.locator('select')
    await selects.nth(0).selectOption({ label: 'Assistant' })
    const clinicSelect = selects.nth(1)
    await expect(clinicSelect).toBeVisible()
    const count = await clinicSelect.locator('option').count()
    expect(count).toBeGreaterThan(1) // at least one real clinic + placeholder
  })

  test('shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/register')
    await page.getByRole('button', { name: /create account/i }).click()
    await expect(page.locator('.form-error').first()).toBeVisible()
  })

  test('shows password mismatch error', async ({ page }) => {
    await page.goto('/register')
    await page.getByPlaceholder('John Doe').fill('Test User')
    await page.getByPlaceholder('you@example.com').fill('test@example.com')
    const pwInputs = page.locator('input[type="password"]')
    await pwInputs.nth(0).fill('Password123456')
    await pwInputs.nth(1).fill('DifferentPassword')
    await page.locator('select').nth(0).selectOption({ label: 'Assistant' })
    const clinicSelect = page.locator('select').nth(1)
    await expect(clinicSelect).toBeVisible()
    await clinicSelect.selectOption({ index: 1 })
    await page.getByRole('button', { name: /create account/i }).click()
    // Backend returns 422 password confirmation error
    await expect(page.locator('text=/password|confirmation/i').first()).toBeVisible({ timeout: 8000 })
  })

  test('shows error for invalid email format', async ({ page }) => {
    await page.goto('/register')
    await page.getByPlaceholder('John Doe').fill('Test User')
    await page.getByPlaceholder('you@example.com').fill('not-an-email')
    await page.getByRole('button', { name: /create account/i }).click()
    await expect(page.locator('.form-error').filter({ hasText: /email/i })).toBeVisible()
  })

  test('successful registration redirects away from /register', async ({ page }, testInfo) => {
    const monitor = setupNetworkMonitor(page)
    const state = getTestState()
    const ts = uniqueTs()
    const user = makeAssistant(ts)

    await page.goto('/register')
    await page.getByPlaceholder('John Doe').fill(user.name)
    await page.getByPlaceholder('you@example.com').fill(user.email)
    const pwInputs = page.locator('input[type="password"]')
    await pwInputs.nth(0).fill(user.password)
    await pwInputs.nth(1).fill(user.password)
    await page.locator('select').nth(0).selectOption({ label: 'Assistant' })
    const clinicSelect = page.locator('select').nth(1)
    await expect(clinicSelect).toBeVisible()
    await clinicSelect.selectOption({ index: 1 })
    await page.getByRole('button', { name: /create account/i }).click()

    await expect(page).not.toHaveURL(/\/register/, { timeout: 15000 })

    const token = await page.evaluate(() => localStorage.getItem('cms_token'))
    const storedUser = await page.evaluate(() => localStorage.getItem('cms_user'))
    expect(token).toBeTruthy()
    expect(storedUser).toBeTruthy()

    await attachReports(testInfo, monitor)
  })

  test('authenticated user is redirected away from /register', async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.assistant.token, state.assistant.user)
    await page.goto('/register')
    await expect(page).not.toHaveURL(/\/register/, { timeout: 8000 })
  })
})

import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { getTestState, injectSession } from '../helpers/auth.js'

async function checkA11y(page, label) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .exclude('#axe-ignore') // escape hatch for known issues
    .analyze()

  // Filter only critical and serious violations
  const serious = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious'
  )

  if (serious.length > 0) {
    const summary = serious.map(
      (v) => `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} nodes)`
    ).join('\n')
    console.warn(`A11y issues on ${label}:\n${summary}`)
  }

  // Fail only on critical violations
  const critical = results.violations.filter((v) => v.impact === 'critical')
  expect(
    critical,
    `Critical a11y violations on ${label}:\n${critical.map((v) => v.description).join('\n')}`
  ).toHaveLength(0)
}

test.describe('Accessibility — critical violations only', () => {
  test('login page has no critical a11y violations', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    await checkA11y(page, 'Login')
  })

  test('register page has no critical a11y violations', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible()
    await checkA11y(page, 'Register')
  })

  test('assistant dashboard has no critical a11y violations', async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.assistant.token, state.assistant.user)
    await page.goto('/assistant/dashboard')
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible()
    await checkA11y(page, 'Assistant Dashboard')
  })

  test('doctor dashboard has no critical a11y violations', async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.doctor.token, state.doctor.user)
    await page.goto('/doctor/dashboard')
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible()
    await checkA11y(page, 'Doctor Dashboard')
  })

  test('admin dashboard has no critical a11y violations', async ({ page }) => {
    const state = getTestState()
    await injectSession(page, state.superAdmin.token, state.superAdmin.user)
    await page.goto('/admin/dashboard')
    await expect(page.getByRole('heading', { name: /system overview/i })).toBeVisible()
    await checkA11y(page, 'Admin Dashboard')
  })
})

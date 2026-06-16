import { test, expect } from '../fixtures.js'

const protectedPaths = [
  '/admin/dashboard',
  '/admin/clinics',
  '/admin/users',
  '/doctor/dashboard',
  '/doctor/schedules',
  '/doctor/appointments',
  '/doctor/prescriptions',
  '/doctor/patients',
  '/assistant/dashboard',
  '/assistant/patients',
  '/assistant/appointments',
]

test.describe('Unauthenticated access', () => {
  for (const path of protectedPaths) {
    test(`redirects ${path} → /login when not authenticated`, async ({ page }) => {
      // Clear any existing session
      await page.goto('/', { waitUntil: 'domcontentloaded' })
      await page.evaluate(() => {
        localStorage.removeItem('cms_token')
        localStorage.removeItem('cms_user')
      })

      await page.goto(path)
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
    })
  }

  test('root / without auth redirects to /login', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => {
      localStorage.removeItem('cms_token')
      localStorage.removeItem('cms_user')
    })
    await page.goto('/')
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
  })

  test('unknown path redirects to / (which then goes to /login)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => {
      localStorage.removeItem('cms_token')
      localStorage.removeItem('cms_user')
    })
    await page.goto('/this/path/does/not/exist')
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
  })
})

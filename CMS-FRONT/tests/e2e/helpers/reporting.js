/** Attach console-error and failed-request collectors to a page. */
export function setupNetworkMonitor(page) {
  const consoleErrors = []
  const failedRequests = []

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', (err) => {
    consoleErrors.push(err.message)
  })
  page.on('requestfailed', (req) => {
    const url = req.url()
    if (url.includes('favicon') || url.includes('chrome-extension')) return
    failedRequests.push(`${req.method()} ${url} — ${req.failure()?.errorText ?? 'unknown'}`)
  })

  return { consoleErrors, failedRequests }
}

/** Attach collected errors to the Playwright test report. */
export async function attachReports(testInfo, { consoleErrors, failedRequests }) {
  await testInfo.attach('console-errors', {
    body: consoleErrors.join('\n') || 'none',
    contentType: 'text/plain',
  })
  await testInfo.attach('failed-requests', {
    body: failedRequests.join('\n') || 'none',
    contentType: 'text/plain',
  })
}

/** Assert no unexpected 500 errors hit the page during the test. */
export function expect500Free(page, expect) {
  const errors500 = []
  page.on('response', (res) => {
    if (res.status() === 500) errors500.push(`500 on ${res.url()}`)
  })
  return () => expect(errors500).toEqual([])
}

import { test as base, expect } from '@playwright/test'
import { attachReports, setupNetworkMonitor } from './helpers/reporting.js'

const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    const monitor = setupNetworkMonitor(page)

    await use(page)

    await attachReports(testInfo, monitor)
  },
})

export { expect, test }

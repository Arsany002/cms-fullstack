import fs from 'fs'
import { STATE_FILE } from './helpers/testData.js'
import { cleanupTestData } from './helpers/cleanup.js'

export default async function globalTeardown() {
  console.log('[global-teardown] Cleaning Playwright test data...')
  cleanupTestData({ required: false })

  if (fs.existsSync(STATE_FILE)) {
    fs.unlinkSync(STATE_FILE)
    console.log('[global-teardown] Removed test state file.')
  }
}

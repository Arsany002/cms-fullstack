import fs from 'fs'
import { STATE_FILE } from './helpers/testData.js'

export default async function globalTeardown() {
  if (fs.existsSync(STATE_FILE)) {
    fs.unlinkSync(STATE_FILE)
    console.log('[global-teardown] Removed test state file.')
  }
}

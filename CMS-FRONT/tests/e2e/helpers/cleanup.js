import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'
import path from 'path'

const FRONT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const REPO_ROOT = path.resolve(FRONT_ROOT, '..')

const BACKEND_ROOT = path.resolve(FRONT_ROOT, '..', 'CMS-BACK')

function parseCleanupCommand() {
  if (process.env.CMS_CLEANUP_COMMAND) {
    return {
      command: process.env.CMS_CLEANUP_COMMAND,
      args: [],
      shell: true,
      cwd: REPO_ROOT,
    }
  }

  // Local mode: call php artisan directly when CMS_LOCAL_BACKEND is set or
  // when the artisan file exists alongside a running local PHP process.
  if (process.env.CMS_LOCAL_BACKEND || process.env.CMS_LOCAL) {
    return {
      command: 'php',
      args: ['artisan', 'cms:cleanup-test-data'],
      shell: false,
      cwd: BACKEND_ROOT,
    }
  }

  return {
    command: 'docker',
    args: ['compose', 'exec', '-T', 'cms_backend', 'php', 'artisan', 'cms:cleanup-test-data'],
    shell: false,
    cwd: REPO_ROOT,
  }
}

export function cleanupTestData({ required = true } = {}) {
  const { command, args, shell, cwd } = parseCleanupCommand()
  const result = spawnSync(command, args, {
    cwd,
    shell,
    encoding: 'utf-8',
  })

  const output = [result.stdout, result.stderr].filter(Boolean).join('\n').trim()

  if (result.status !== 0) {
    const manualCmd = (process.env.CMS_LOCAL_BACKEND || process.env.CMS_LOCAL)
      ? 'cd CMS-BACK && php artisan cms:cleanup-test-data'
      : 'docker compose exec cms_backend php artisan cms:cleanup-test-data'
    const message = [
      `Playwright cleanup failed with exit code ${result.status}.`,
      output,
      `Run manually: ${manualCmd}`,
    ].filter(Boolean).join('\n')

    if (required) throw new Error(message)
    console.warn(message)
  } else if (output) {
    console.log(output)
  }

  return output
}

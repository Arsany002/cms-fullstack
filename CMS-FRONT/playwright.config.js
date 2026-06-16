import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    timeout: 30000,
    fullyParallel: false,
    workers: 1,
    retries: 0,

    globalSetup:    './tests/e2e/global-setup.js',
    globalTeardown: './tests/e2e/global-teardown.js',

    reporter: [
        ['html'],
        ['json', { outputFile: 'test-results/results.json' }],
        ['list'],
    ],

    use: {
        baseURL:       process.env.TEST_BASE_URL || 'http://localhost:5174',
        trace:         'retain-on-failure',
        video:         'retain-on-failure',
        screenshot:    'only-on-failure',
        actionTimeout: 10000,
    },

    expect: {
        timeout: 15000,
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});

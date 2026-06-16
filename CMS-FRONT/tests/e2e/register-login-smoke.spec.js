import { test, expect } from '@playwright/test';

test('register new assistant user, authenticate, and load the app', async ({ page }, testInfo) => {
    const consoleErrors = [];
    const failedRequests = [];

    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });

    page.on('pageerror', (error) => {
        consoleErrors.push(error.message);
    });

    page.on('requestfailed', (request) => {
        const url = request.url();

        // Ignore browser/dev noise if any.
        if (url.includes('favicon') || url.includes('chrome-extension')) {
            return;
        }

        failedRequests.push(
            `${request.method()} ${url} - ${request.failure()?.errorText || 'unknown error'}`
        );
    });

    const timestamp = Date.now();

    const user = {
        name: `Playwright Assistant ${timestamp}`,
        email: `playwright_assistant_${timestamp}@example.com`,
        password: 'Password123456'
    };

    await page.goto('/register');

    await expect(
        page.getByRole('heading', { name: /create account/i })
    ).toBeVisible();

    // Your current form uses placeholders, not real connected labels.
    await page.getByPlaceholder('John Doe').fill(user.name);
    await page.getByPlaceholder('you@example.com').fill(user.email);

    const passwordInputs = page.locator('input[type="password"]');

    await expect(passwordInputs).toHaveCount(2);

    await passwordInputs.nth(0).fill(user.password);
    await passwordInputs.nth(1).fill(user.password);

    const selects = page.locator('select');

    // First select = Role
    await selects.nth(0).selectOption({ label: 'Assistant' });

    // Second select = Clinic
    const clinicSelect = selects.nth(1);
    await expect(clinicSelect).toBeVisible();

    const clinicOptions = await clinicSelect.locator('option').count();

    if (clinicOptions <= 1) {
        throw new Error(
            'No clinic options found. Seed/create at least one clinic before running the registration test.'
        );
    }

    await clinicSelect.selectOption({ index: 1 });

    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page).not.toHaveURL(/\/register/i, { timeout: 15000 });

    // Some apps redirect to login after register.
    // If that happens, log in with the same new user.
    if (/\/login/i.test(page.url())) {
        await expect(page.getByPlaceholder('you@example.com')).toBeVisible();

        await page.getByPlaceholder('you@example.com').fill(user.email);
        await page.locator('input[type="password"]').fill(user.password);

        await page.getByRole('button', { name: /login|sign in/i }).click();

        await expect(page).not.toHaveURL(/\/login/i, { timeout: 15000 });
    }

    // Confirm the app has loaded and is not blank.
    const bodyText = await page.locator('body').innerText();

    expect(bodyText.length).toBeGreaterThan(0);
    expect(bodyText).toMatch(/dashboard|appointment|patient|clinic|prescription|schedule|assistant/i);

    // Confirm frontend auth storage if the app logs the user in.
    const token = await page.evaluate(() => localStorage.getItem('cms_token'));
    const storedUser = await page.evaluate(() => localStorage.getItem('cms_user'));

    expect(token).toBeTruthy();
    expect(storedUser).toBeTruthy();

    await testInfo.attach('registered-user', {
        body: JSON.stringify(user, null, 2),
        contentType: 'application/json'
    });

    await testInfo.attach('console-errors', {
        body: consoleErrors.join('\n') || 'No console errors',
        contentType: 'text/plain'
    });

    await testInfo.attach('failed-requests', {
        body: failedRequests.join('\n') || 'No failed requests',
        contentType: 'text/plain'
    });

    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
});
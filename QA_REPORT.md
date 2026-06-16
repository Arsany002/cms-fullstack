# QA Report - CMS Separation Refactor and E2E Run

**Date:** 2026-06-16  
**Engineer:** Codex  
**Project:** Clinic Management System - Laravel API + React SPA

## Test Environment

| Component | Details |
|---|---|
| Backend | Laravel, local server already running at `http://127.0.0.1:8001` |
| Frontend | Vite/React, local server already running at `http://127.0.0.1:5174` |
| API base | `http://127.0.0.1:8001/api/v1` |
| Playwright base | `http://127.0.0.1:5174` |
| Cleanup mode | `CMS_LOCAL_BACKEND=1`, Artisan cleanup command |
| Test data policy | Only `playwright_` emails and `Playwright` names were created/deleted |

Docker ports were left alone. Backend `8000` was treated as Docker-reserved per instruction; local backend verification used `8001`, and frontend verification used `5174`.

## Commands Used

```bash
cd CMS-BACK
php artisan passport:client --personal --name="CMS API" --no-interaction
php artisan cms:cleanup-test-data
find app/Http/Controllers app/Services app/Repositories app/Http/Requests -name "*.php" -print0 | xargs -0 -n1 php -l
./vendor/bin/phpunit

cd ../CMS-FRONT
npm run build
npm run lint
TEST_BASE_URL=http://127.0.0.1:5174 TEST_API_URL=http://127.0.0.1:8001/api/v1 CMS_LOCAL_BACKEND=1 npm run test:e2e:report
```

## Test Files Created Or Updated

No new Playwright spec files were created in this pass. Existing helper defaults and docs were updated for the `8001`/`5174` local workflow:

| File | Change |
|---|---|
| `CMS-FRONT/src/services/api.js` | Local fallback API base changed to `127.0.0.1:8001` |
| `CMS-FRONT/tests/e2e/helpers/testData.js` | E2E API helper fallback changed to `127.0.0.1:8001` |
| `CMS-FRONT/playwright.config.js` | Playwright base URL fallback changed to `localhost:5174` |
| `CMS-FRONT/vite.config.js` | Vite dev port changed to `5174` |
| `CMS-FRONT/README.md` | Documented local backend/frontend/test commands |

## Features Covered

- Auth registration, login, logout, and `/auth/me`
- Registration rollback behavior when Passport token creation fails
- Public clinic lookup
- Super admin dashboard, clinics, users, appointments, prescriptions
- Doctor appointments, patients, prescriptions, schedules
- Assistant doctors, patients, appointments, available slots
- Route protection and role-based frontend access
- Frontend navigation smoke tests
- Critical accessibility checks
- Safe Playwright test-data cleanup before and after tests

## Passing Tests

| Suite | Result |
|---|---|
| Backend syntax check | Passed |
| Backend PHPUnit | Passed: 80 tests, 271 assertions |
| Backend endpoint smoke test | Passed: 23 checked API calls |
| Frontend production build | Passed |
| Playwright E2E | Passed: 96 tests, 0 failed |

## Failing Tests

| Check | Result |
|---|---|
| Frontend lint | Blocked: `eslint` binary is not installed in `CMS-FRONT/node_modules` |

## Bugs Found

- Initial endpoint registration failed because the local DB lacked a Passport personal access client. After creating the client, registration/login endpoints worked.
- A failed registration attempt before Passport setup did not leave a `playwright_` user behind; cleanup reported `users: 0`, confirming the transaction rollback protected the DB.
- Existing axe output still logs serious, non-blocking accessibility issues: color contrast on auth/dashboard screens and list structure on the doctor dashboard.

## Bugs Fixed

- Moved direct controller repository/model access into services for assistant, doctor, and super-admin flows.
- Added missing service methods for scoped patient, schedule, appointment, prescription, clinic, and doctor list access.
- Preserved `403` clinic/ownership behavior for cross-clinic patient and prescription access after moving checks into services.
- Updated local frontend/test defaults to use backend `8001` and frontend `5174`.

## Remaining Known Issues

- `npm run lint` cannot run until `eslint` is installed or the script is updated to use an available linter.
- Doctor/assistant dashboard API routes are not present in `php artisan route:list`; frontend dashboard pages rely on existing aggregate/list endpoints.
- Playwright report and test-results are generated artifacts and changed after the successful run.

## Recommendations

- Add `eslint` to frontend dev dependencies or remove/fix the lint script.
- Keep local E2E runs on `8001`/`5174` and Docker on `8000`/`5173` to avoid port collisions.
- Fix the logged serious accessibility issues before raising axe thresholds.
- Keep cleanup as an Artisan command guarded by `APP_ENV=local|testing`; do not add a production cleanup endpoint.

## Reports

- Separation audit: `SEPARATION_OF_CONCERNS_AUDIT_REPORT.md`
- Endpoint audit: `BACKEND_ENDPOINT_TEST_REPORT.md`
- Playwright HTML report: `CMS-FRONT/playwright-report/index.html`

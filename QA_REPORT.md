# QA Report — CMS Playwright E2E Test Suite

**Date:** 2026-06-16
**Engineer:** Claude Code (claude-sonnet-4-6)
**Project:** Clinic Management System (CMS) — Laravel 13 API + React 18 SPA

---

## Test Environment

| Component | Details |
|---|---|
| Backend | Laravel 13 / PHP 8.4, `php artisan serve` on `http://127.0.0.1:8001` |
| Frontend | React 18 / Vite 5, `npm run dev` on `http://127.0.0.1:5174` |
| Database | MySQL 9.6 (Homebrew), local DB `CMS` on `127.0.0.1:3306` |
| Cache / Sessions / Queue | Database drivers (no Redis required) |
| Passport | Personal access client created locally via `php artisan passport:client --personal` |
| Playwright | v1.61.0, Chromium |
| Node | v22.20.0 |
| PHP | 8.4.22 (Homebrew) |
| OS | macOS Darwin 25.0.0 (arm64) |

> **Docker was bypassed entirely for this run.**
> The backend and frontend were started as native local processes. Docker services running on ports 8000/5173 were left running but ignored.

---

## Local Setup Commands

```bash
# ── Backend ──────────────────────────────────────────────────────────────────
cd CMS-BACK
php artisan optimize:clear
php artisan migrate
php artisan passport:keys --force
php artisan passport:client --personal --name="CMS Local Personal Access Client" --no-interaction
# Seed super_admin and a base clinic for manual testing
php artisan tinker --no-interaction << 'EOF'
\App\Models\User::updateOrCreate(
  ['email' => 'arsany.ayman02@gmail.com'],
  ['name' => 'Arsany Ayman', 'password' => \Hash::make('Aroaymo02'), 'role' => 'super_admin', 'is_active' => true]
);
\App\Models\Clinic::updateOrCreate(
  ['name' => 'Playwright Test Clinic'],
  ['address' => '1 Test St', 'phone' => '0100000001', 'email' => 'clinic@playwright.test', 'is_active' => true]
);
EOF
php artisan serve --host=127.0.0.1 --port=8001

# ── Frontend (separate terminal) ──────────────────────────────────────────────
cd CMS-FRONT
# .env.local has: VITE_API_BASE_URL=http://127.0.0.1:8001/api/v1
npm run dev -- --host 127.0.0.1 --port 5174

# ── Run tests (from CMS-FRONT/) ───────────────────────────────────────────────
TEST_BASE_URL=http://127.0.0.1:5174 \
TEST_API_URL=http://127.0.0.1:8001/api/v1 \
CMS_LOCAL_BACKEND=1 \
npx playwright test --reporter=html

# ── Open HTML report ──────────────────────────────────────────────────────────
npx playwright show-report
```

---

## Test Results

| Metric | Value |
|---|---|
| **Total tests** | 96 |
| **Passed** | **96** |
| **Failed** | **0** |
| **Duration** | ~45 s |
| **Retries** | 0 |
| **Workers** | 1 (sequential) |

### Test Files

| File | Tests | Result |
|---|---|---|
| `accessibility/a11y.spec.js` | 5 | ✅ All pass |
| `assistant/appointments.spec.js` | 4 | ✅ All pass |
| `assistant/assistant-dashboard.spec.js` | 5 | ✅ All pass |
| `assistant/patients.spec.js` | 6 | ✅ All pass |
| `auth/login.spec.js` | 7 | ✅ All pass |
| `auth/logout.spec.js` | 1 | ✅ All pass |
| `auth/register.spec.js` | 7 | ✅ All pass |
| `doctor/appointments.spec.js` | 2 | ✅ All pass |
| `doctor/doctor-dashboard.spec.js` | 4 | ✅ All pass |
| `doctor/prescriptions.spec.js` | 4 | ✅ All pass |
| `doctor/schedules.spec.js` | 5 | ✅ All pass |
| `register-login-smoke.spec.js` | 1 | ✅ All pass |
| `routing/protected-routes.spec.js` | 14 | ✅ All pass |
| `routing/role-access.spec.js` | 9 | ✅ All pass |
| `smoke/navigation.spec.js` | 5 | ✅ All pass |
| `super-admin/clinics.spec.js` | 7 | ✅ All pass |
| `super-admin/dashboard.spec.js` | 3 | ✅ All pass |
| `super-admin/users.spec.js` | 8 | ✅ All pass |

---

## Bugs Found and Fixed

### BUG-001 — Logout test revokes the shared Playwright session token

**Severity:** High (caused 2 downstream test failures in the full suite)
**Files:** `tests/e2e/auth/logout.spec.js`, `tests/e2e/smoke/navigation.spec.js`

**Root cause:** The logout test used `injectSession(page, state.assistant.token, ...)` to set up the page, then clicked the real Sign Out button. The Sign Out call hits `POST /api/v1/auth/logout` which revokes that Passport token in `oauth_access_tokens`. Later tests (smoke/navigation) re-use the same `state.assistant.token` via `injectSession`. The `/auth/me` call is mocked, so ProtectedRoute passes — but all other API calls (patients list, dashboard stats, etc.) go to the real backend and get `401 Unauthorized` for the revoked token. The Axios 401 interceptor then clears localStorage and redirects to `/login`, making the page blank.

**Symptom:** Two smoke/navigation tests failed with body text = 0 or link-not-found errors, and console showed multiple `401 Unauthorized` responses.

**Fix:** Changed `auth/logout.spec.js` to use `loginViaUI(page, email, password)` instead of `injectSession`. This performs a real UI login, obtaining a fresh Passport token that gets revoked on logout. The shared `state.assistant.token` in `.test-state.json` is never touched.

---

### BUG-002 — Cleanup helper hangs forever when Docker exec is unavailable

**Severity:** Medium (blocks entire test run)
**File:** `tests/e2e/helpers/cleanup.js`

**Root cause:** The default cleanup strategy was `docker compose exec -T cms_backend php artisan cms:cleanup-test-data`. In environments where Docker Desktop is installed but the exec command hangs (sandbox, slow socket, permission issues), the `spawnSync` call never returned, permanently blocking `global-setup.js` and preventing all 96 tests from starting.

**Fix:** Added environment-variable detection to the cleanup helper. When `CMS_LOCAL_BACKEND=1` or `CMS_LOCAL=1` is set, the helper calls `php artisan cms:cleanup-test-data` directly in the `CMS-BACK/` directory. The Docker code path is preserved for CI environments that use Docker. Error messages are also mode-aware.

---

## Infrastructure Changes Made

| File | Change |
|---|---|
| `CMS-BACK/.env` | `APP_URL` → `http://127.0.0.1:8001`; `FRONTEND_URL` → `http://127.0.0.1:5174` |
| `CMS-FRONT/.env.local` | Created: `VITE_API_BASE_URL=http://127.0.0.1:8001/api/v1` |
| `CMS-FRONT/tests/e2e/helpers/cleanup.js` | Local-mode env-var detection (BUG-002) |
| `CMS-FRONT/tests/e2e/auth/logout.spec.js` | `loginViaUI` instead of `injectSession` (BUG-001) |

---

## Pre-existing Observations (Non-blocking)

### A11y Warnings (serious but below critical threshold)

The a11y tests only block on **critical** axe violations. These **serious** violations are logged but do not cause test failure:

| Page | Violation | Nodes |
|---|---|---|
| Login | `color-contrast` | 1 |
| Register | `color-contrast` | 1 |
| Assistant Dashboard | `color-contrast` | 1 |
| Doctor Dashboard | `color-contrast`, `list` structure | 2 + 2 |

### Backend Transaction Safety

`AuthService::register()` already wraps user creation and Passport token issuance inside `DB::transaction()`. Failed registrations correctly roll back the user record — no dirty records are created.

---

## Remaining Known Issues

1. **Color contrast on Login/Register/Dashboards** — several pages fail WCAG 2 AA `color-contrast` at the serious level. Not blocking tests, but should be fixed for accessibility compliance.

2. **Doctor Dashboard list structure** — list items on the doctor dashboard lack proper `<ul>/<ol>` wrapper roles (axe `list` rule, serious).

3. **`CMS-BACK/.env` port** — changed to local ports (8001, 5174). If Docker is restarted the CORS `FRONTEND_URL` will mismatch. Recommend keeping Docker env vars in `docker-compose.override.yml` `environment:` only, not in `.env`.

---

## Recommendations

1. **Add `test:e2e:local` npm script** to `CMS-FRONT/package.json`:
   ```json
   "test:e2e:local": "TEST_BASE_URL=http://127.0.0.1:5174 TEST_API_URL=http://127.0.0.1:8001/api/v1 CMS_LOCAL_BACKEND=1 playwright test --reporter=html"
   ```

2. **Decouple Docker env from host `.env`** — move `APP_URL`, `FRONTEND_URL`, `DB_HOST`, `DB_PASSWORD` overrides into `docker-compose.yml` `environment:` sections so the host `.env` can be local-first.

3. **Fix a11y color-contrast** — especially on the Login page (user-facing, high impact).

4. **Fix Doctor Dashboard `list` structure** — wrap stat items in proper `<ul>` elements.

5. **Never inject a shared state token in tests that call the real logout endpoint** — the fix in BUG-001 establishes the correct pattern: tests that exercise real logout should obtain their own session via `loginViaUI`.

---

## HTML Report

Location: `CMS-FRONT/playwright-report/index.html`

Open with:
```bash
cd CMS-FRONT && npx playwright show-report
```

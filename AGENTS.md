# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

Clinic Management System (CMS) — Laravel 13 API backend + React 18 SPA frontend, orchestrated entirely via Docker Compose with an Nginx reverse proxy.

```
Browser → http://localhost (cms_proxy)
              ├─ /api/*  →  cms_backend   (PHP-FPM + Nginx + Supervisor)
              └─ /*      →  cms_frontend  (React SPA / Nginx)
```

## Commands

### Docker (primary workflow)

```bash
# Start full stack (dev mode with Vite HMR is automatic via docker-compose.override.yml)
docker compose up -d --build

# Dev URLs:  backend http://localhost:8000/api/v1  |  frontend http://localhost:5173
# Prod URL:  http://localhost

# Run artisan commands
docker compose exec cms_backend php artisan <command>

# Run backend tests (inside container)
docker compose exec cms_backend php artisan test

# Run a single test file or filter
docker compose exec cms_backend php artisan test --filter=AuthTest
docker compose exec cms_backend php artisan test tests/Feature/Auth/AuthTest.php

# Frontend lint
docker compose exec cms_frontend npm run lint

# Frontend build
docker compose exec cms_frontend npm run build

# Clear all caches
docker compose exec cms_backend php artisan optimize:clear

# Tail logs
docker compose logs -f cms_backend
docker compose logs -f cms_frontend
```

### First-time setup (after initial `docker compose up`)

```bash
docker compose exec cms_backend php artisan passport:client --personal --name="CMS API" --no-interaction
# The entrypoint now runs passport:keys and chmod 600 on *.key automatically on every start.
# No need to copy client credentials to .env — Passport 13 finds the client from the DB directly.
```

### E2E tests (Playwright)

```bash
# Run from CMS-FRONT/
cd CMS-FRONT
TEST_BASE_URL=http://localhost:5173 npx playwright test --reporter=list
# With HTML report:
TEST_BASE_URL=http://localhost:5173 npx playwright test --reporter=html
# Report opens at: CMS-FRONT/playwright-report/index.html
```

**Prerequisites before running E2E tests:**
- Stack must be up: `docker compose up -d`
- At least one Passport personal access client must exist:
  `docker compose exec cms_backend php artisan passport:client --personal --name="CMS API" --no-interaction`
- At least one active clinic must exist in the database (used by the registration test)

## Architecture

### Backend (`CMS-BACK/`) — Laravel 13, PHP 8.3

**Layered pattern:** `Controller → Service → Repository → Model`

- Controllers use the `ApiResponse` trait (`app/Traits/ApiResponse.php`) for all JSON responses. Every response follows `{ success: bool, message: string, data?: ..., meta?: ... }`.
- Services contain business logic; they are injected into controllers via constructor DI.
- Repositories handle all Eloquent queries; injected into services.
- Models use UUIDs (`HasUuids`), not auto-increment IDs.

**Auth:** Laravel Passport Personal Access Tokens. Token stored/read by the frontend from `localStorage` as `cms_token`.

**Role system:** Three roles defined as a PHP-backed enum (`app/Enums/UserRole.php`): `super_admin`, `doctor`, `assistant`. Roles are enforced by a custom `RoleMiddleware` that checks `$user->role->value` against the required role string (not spatie/permission — that package is installed but the custom middleware is what's actually used).

**Clinic scoping:** The `clinic.scope` middleware (`ClinicScopeMiddleware`) is applied to all `doctor` and `assistant` routes. It forcefully merges `clinic_id` from the authenticated user into the request, preventing cross-clinic data access regardless of what the client sends.

**API routes** (`routes/api.php`) — all prefixed `/api/v1/`:
- `GET /public/clinics` — **no auth required**; returns `[{ id, name }]` of active clinics only. Used by the Register page to populate the Clinic dropdown before a user is logged in.
- `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`, `GET /auth/me`
- `/super-admin/*` — clinic/user CRUD, global dashboard, appointments, prescriptions
- `/doctor/*` — scoped to their clinic: schedules, appointments (status updates), prescriptions, patients
- `/assistant/*` — scoped to their clinic: patients CRUD, appointments CRUD, available slots, doctor list

**Custom exceptions** (`app/Exceptions/`): `AccountDeactivatedException`, `AppointmentConflictException`, `ClinicScopeViolationException`, `InvalidAppointmentStateException`, `SelfDemotionException`.

**API docs:** l5-swagger annotations on controllers; regenerate with `php artisan l5-swagger:generate`.

### Frontend (`CMS-FRONT/`) — React 18 + Vite

**State management:**
- Server state: TanStack Query v5 (`@tanstack/react-query`)
- Auth state: `AuthContext` (`src/context/AuthContext.jsx`) — stores `cms_token` and `cms_user` in `localStorage`, verifies token on mount via `/auth/me`
- Forms: React Hook Form

**API layer** (`src/services/`): One file per domain (`auth.js`, `appointments.js`, `clinics.js`, `patients.js`, `prescriptions.js`, `schedules.js`, `users.js`). All call `src/services/api.js` — an Axios instance that reads `VITE_API_BASE_URL`, attaches the bearer token from localStorage, and auto-redirects to `/login` on 401.

`clinics.js` exports both `getClinics` (auth-required, super-admin only) and `getPublicClinics` (no auth, calls `GET /public/clinics`). The Register page uses `getPublicClinics`.

**Routing** (`src/App.jsx`): Role-based route tree. `ProtectedRoute` wraps each role group (`super_admin`, `doctor`, `assistant`). Unauthenticated users are redirected to `/login`; authenticated users are redirected to their role-specific dashboard via `getDashboardPath()`.

**Styling:** Tailwind CSS v3.

### Infrastructure

Services in `docker-compose.yml`:

| Service | Role |
|---|---|
| `cms_proxy` | Nginx reverse proxy (prod only) |
| `cms_backend` | PHP-FPM + Nginx, managed by Supervisord |
| `cms_frontend` | React SPA / Nginx (prod) or Vite dev server (override) |
| `cms_queue` | `php artisan queue:work redis` |
| `cms_scheduler` | Runs `schedule:run` every 60 s |
| `cms_db` | MySQL 8.4 |
| `cms_redis` | Redis 7.4 (cache, queues, sessions) |

`docker-compose.override.yml` is auto-applied in dev: swaps frontend to Vite HMR, exposes backend on 8000 and frontend on 5173, disables the proxy container.

Required `.env` keys: `APP_KEY`, `DB_PASSWORD`, `DB_ROOT_PASSWORD`, `REDIS_PASSWORD`, `PASSPORT_CLIENT_ID`, `PASSPORT_CLIENT_SECRET`.

> **Note:** `PASSPORT_CLIENT_ID` / `PASSPORT_CLIENT_SECRET` in `.env` are passed to the backend container but Passport 13 resolves the personal access client directly from the `oauth_clients` table (not from env). The env vars are kept for reference but are not strictly required after the client is created in the DB.

### Passport / OAuth notes

- **Passport version:** `^13.7` — uses `grant_types` column in `oauth_clients` (not the old `personal_access_client` boolean).
- **Key permissions:** `storage/oauth-private.key` must be `600`; `storage/oauth-public.key` must be `600` or `660`. The `Dockerfile` and `docker/entrypoint.sh` both enforce `chmod 600` on every `*.key` file. If you ever see a 500 with *"Key file permissions are not correct"*, run: `docker compose exec cms_backend chmod 600 /var/www/html/storage/oauth-public.key`
- **Keys are gitignored** (`storage/*.key`). They are copied into the Docker image from the host at build time. The entrypoint runs `php artisan passport:keys` to regenerate them if they are missing.

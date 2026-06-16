# CMS Frontend

React SPA for the Clinic Management System backend built with Vite, React 18, TanStack Query, React Router v6, and Tailwind CSS.

## Prerequisites

- Node.js ≥ 18
- The Laravel CMS backend running at `http://127.0.0.1:8001`

## Setup

```bash
cd CMS-FRONT
npm install
```

## Environment

Copy `.env` and adjust if your backend runs on a different port:

```
VITE_API_BASE_URL=http://127.0.0.1:8001/api/v1
```

## Run Dev Server

```bash
npm run dev -- --host 127.0.0.1 --port 5174
# App will be at http://127.0.0.1:5174
```

## Build for Production

```bash
npm run build
npm run preview
```

## Playwright E2E Workflow

Prerequisites: start the Laravel backend locally on `127.0.0.1:8001`. If this is the first setup, the database was reset, or auth says `Personal access client not found`, run `php artisan cms:local-setup` once from `CMS-BACK/`.

```bash
cd ../CMS-BACK
php artisan cms:local-setup
php artisan serve --host=127.0.0.1 --port=8001
```

Useful test commands from `CMS-FRONT/`:

```bash
# Delete only Playwright-owned data in local/testing
CMS_CLEANUP_COMMAND="cd ../CMS-BACK && php artisan cms:cleanup-test-data" npm run test:e2e:cleanup

# Run the full suite
TEST_BASE_URL=http://localhost:5174 TEST_API_URL=http://127.0.0.1:8001/api/v1 CMS_CLEANUP_COMMAND="cd ../CMS-BACK && php artisan cms:cleanup-test-data" npm run test:e2e

# Rerun only tests that failed in the previous run
TEST_BASE_URL=http://localhost:5174 TEST_API_URL=http://127.0.0.1:8001/api/v1 CMS_CLEANUP_COMMAND="cd ../CMS-BACK && php artisan cms:cleanup-test-data" npm run test:e2e:failed

# Run with the HTML reporter, then open the report
TEST_BASE_URL=http://localhost:5174 TEST_API_URL=http://127.0.0.1:8001/api/v1 CMS_CLEANUP_COMMAND="cd ../CMS-BACK && php artisan cms:cleanup-test-data" npm run test:e2e:report
npm run test:e2e:show-report

# Interactive runner
TEST_BASE_URL=http://localhost:5174 TEST_API_URL=http://127.0.0.1:8001/api/v1 CMS_CLEANUP_COMMAND="cd ../CMS-BACK && php artisan cms:cleanup-test-data" npm run test:e2e:ui
```

The suite runs `cms:cleanup-test-data` before setup and again during teardown. Cleanup is implemented as an Artisan command, refuses to run outside `local` or `testing`, and only targets Playwright-owned records with `playwright_` emails or `Playwright` names.

## Backend CORS

In your Laravel `config/cors.php`, add the dev origin:

```php
'allowed_origins' => ['http://localhost:5174'],
```

Then run:

```bash
php artisan config:clear
```

## Role-Based Access

| Role        | Entry point              |
|-------------|--------------------------|
| super_admin | `/admin/dashboard`       |
| doctor      | `/doctor/dashboard`      |
| assistant   | `/assistant/dashboard`   |

## Tech Stack

| Library                | Purpose                          |
|------------------------|----------------------------------|
| Vite                   | Build tool                       |
| React 18               | UI framework                     |
| React Router v6        | Client-side routing              |
| TanStack Query v5      | Server-state management          |
| Axios                  | HTTP client                      |
| React Hook Form        | Form handling & validation       |
| Tailwind CSS           | Utility-first styling            |

# Backend Endpoint Test Report

**Date:** 2026-06-16  
**Backend:** `http://127.0.0.1:8001/api/v1`  
**Mode:** Local non-Docker backend, Docker `8000` avoided

## Setup

The first registration smoke test failed because no Passport personal access client existed in the local database:

`Personal access client not found for 'users' user provider. Please create one.`

After running:

```bash
cd CMS-BACK
php artisan passport:client --personal --name="CMS API" --no-interaction
```

the endpoint smoke test passed.

## Cleanup Safety

Cleanup was run before and after the endpoint smoke test:

```bash
php artisan cms:cleanup-test-data
```

Before rerun, cleanup reported zero `playwright_` users after the failed Passport registration attempt, confirming registration rollback. After the passing smoke test, cleanup removed:

| Type | Removed |
|---|---:|
| Tokens | 3 |
| Users | 3 |
| Clinics | 1 |
| Patients | 0 |
| Appointments | 0 |
| Prescriptions | 0 |

Only Playwright-owned data was targeted.

## Endpoint Results

| Endpoint | Method | Status | Response shape |
|---|---:|---:|---|
| `/public/clinics` before setup | GET | 200 | `success`, empty clinic array |
| `/auth/register` super admin | POST | 201 | `user`, `token` |
| `/auth/me` super admin | GET | 200 | authenticated user object |
| `/super-admin/clinics` create Playwright clinic | POST | 201 | clinic object |
| `/public/clinics` after setup | GET | 200 | one clinic |
| `/super-admin/dashboard` | GET | 200 | dashboard totals |
| `/super-admin/clinics` | GET | 200 | clinic array |
| `/super-admin/users` | GET | 200 | user array |
| `/super-admin/appointments` | GET | 200 | appointment array |
| `/super-admin/prescriptions` | GET | 200 | prescription array |
| `/auth/register` doctor | POST | 201 | `user`, `token` |
| `/auth/register` assistant | POST | 201 | `user`, `token` |
| `/doctor/appointments` | GET | 200 | appointment array |
| `/doctor/patients` | GET | 200 | patient array |
| `/doctor/prescriptions` | GET | 200 | prescription array |
| `/doctor/schedules` | GET | 200 | schedule array |
| `/assistant/doctors` | GET | 200 | doctor array |
| `/assistant/patients` | GET | 200 | patient array |
| `/assistant/appointments` | GET | 200 | appointment array |
| `/assistant/available-slots?doctor_id=...&date=2026-07-15` | GET | 200 | `slots` object |
| `/auth/logout` doctor | POST | 200 | success message |
| `/auth/logout` assistant | POST | 200 | success message |
| `/auth/logout` super admin | POST | 200 | success message |

## Routes Not Present

`php artisan route:list --path=api/v1` did not show separate API routes for:

- `/doctor/dashboard`
- `/assistant/dashboard`

The frontend dashboard pages are covered by Playwright, but backend dashboard endpoints only exist for super admin in the current route list.

## Result

Backend endpoint smoke test passed against `127.0.0.1:8001`.

# Separation Of Concerns Audit Report

**Date:** 2026-06-16  
**Scope:** `CMS-BACK/app/Http/Controllers`, `app/Services`, `app/Repositories`, API request flow

## Objective

Harden the Laravel backend toward the intended layering:

`Controller -> Service -> Repository -> Model`

Controllers should validate/request/return responses only. Services should own business rules and scoped access decisions. Repositories should own Eloquent query details.

## Findings Before Refactor

| Area | Finding | Risk |
|---|---|---|
| Assistant appointments | Controller injected `AppointmentRepository` and used route model binding | Medium |
| Assistant doctors | Controller queried users through `UserRepository` | Low |
| Assistant patients | Controller injected `PatientRepository` and enforced clinic access itself | Medium |
| Doctor appointments | Controller queried appointments through repository | Medium |
| Doctor patients | Controller enforced clinic access itself | Medium |
| Doctor prescriptions | Controller enforced doctor ownership itself | Medium |
| Doctor schedules | Controller used repository and inline `abort_if` ownership checks | Medium |
| Super admin clinics | Controller injected `ClinicRepository` and used model binding | Medium |

Services already used repositories for most business operations. Model imports in services were kept where they are return/type contracts, but direct Eloquent query ownership remains in repositories.

## Changes Made

| File | Change |
|---|---|
| `app/Services/PatientService.php` | New service for clinic-scoped patient listing, create, show, update |
| `app/Services/ScheduleService.php` | New service for doctor-scoped schedule CRUD |
| `app/Services/AppointmentService.php` | Added list/find/status methods for clinic and doctor scoped controllers |
| `app/Services/PrescriptionService.php` | Added doctor-scoped list/show/update methods with ownership checks |
| `app/Services/ClinicService.php` | Added paginate, active, create, find, update, toggle methods |
| `app/Services/UserService.php` | Added clinic-scoped doctor listing |
| `app/Repositories/ClinicRepository.php` | Added ID-based update/toggle methods |
| `app/Repositories/ScheduleRepository.php` | Added doctor-scoped find/update/delete methods |
| `app/Repositories/PrescriptionRepository.php` | Added doctor-scoped helper methods |
| Assistant/doctor/super-admin controllers | Removed direct repository/model dependencies where business logic belonged in services |

## Guardrails Preserved

- Cross-clinic patient access still returns `403`.
- Cross-doctor prescription access still returns `403`.
- Appointment conflict/state rules remain inside `AppointmentService`.
- Registration remains wrapped in `DB::transaction()`.
- Repository layer remains the only layer with direct query construction for these flows.

## Verification

```bash
find app/Http/Controllers app/Services app/Repositories app/Http/Requests -name "*.php" -print0 | xargs -0 -n1 php -l
./vendor/bin/phpunit
```

Results:

- PHP syntax sweep: passed.
- PHPUnit: passed, 80 tests, 271 assertions.
- Regression filters after scoped-service changes: patient and prescription controller tests passed.

## Remaining Notes

- `PrescriptionRepository::createWithItems()` still owns a DB transaction. Moving that transaction into `PrescriptionService` would be a reasonable future cleanup, but it was left untouched to keep this pass small and low risk.
- Services still import model classes for return types/resources. That is acceptable in this codebase and was not treated as a separation violation.

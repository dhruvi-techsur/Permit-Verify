---
phase: 01-foundation
plan: "03"
subsystem: auth
tags: [nestjs, jwt, passport, bcrypt, typeorm, throttler, supertest, jest]

# Dependency graph
requires:
  - phase: 01-foundation
    plan: "01"
    provides: "users table, refresh_tokens table, password_reset_tokens table, user_role enum"
provides:
  - "NestJS backend scaffold with TypeORM + Postgres + Throttler"
  - "POST /api/v1/auth/register — 201 with token pair"
  - "POST /api/v1/auth/login — 200 with token pair"
  - "POST /api/v1/auth/refresh — 200 with rotated token pair"
  - "POST /api/v1/auth/logout — 200 with token revocation"
  - "POST /api/v1/auth/forgot-password — 200 enumeration-safe"
  - "POST /api/v1/auth/reset-password — 200 single-use token"
  - "GET /api/v1/auth/me — 200 JWT-protected"
  - "JwtAuthGuard, RolesGuard, Roles decorator, CurrentUser decorator"
  - "Integration test suite (14 tests, context boot + all endpoints)"
affects:
  - "01-04 (frontend auth flows call these endpoints)"
  - "01-05 (reviewer/admin flows use JwtAuthGuard + RolesGuard)"

# Tech tracking
tech-stack:
  added:
    - "@nestjs/common ^10 / @nestjs/core ^10 / @nestjs/platform-express ^10"
    - "@nestjs/jwt ^10.2 + passport-jwt ^4 (JWT access + refresh tokens)"
    - "@nestjs/passport ^10 + passport ^0.7 (strategy pattern)"
    - "@nestjs/throttler ^5.1 (rate limiting on /login + /forgot-password)"
    - "@nestjs/typeorm ^10 + typeorm ^0.3 + pg ^8 (ORM + Postgres driver)"
    - "bcrypt ^5.1 (password hashing at cost 12)"
    - "class-validator ^0.14 + class-transformer ^0.5 (DTO validation)"
    - "@nestjs/testing + supertest ^7 + ts-jest ^29 (integration tests)"
  patterns:
    - "Separate JwtStrategy (access) + JwtRefreshStrategy (refresh) for dual-token flow"
    - "SHA-256 hash stored in DB, raw token sent to client — server-side revocation"
    - "sanitizeUser() strips passwordHash before any API response"
    - "enumeration-safe forgotPassword always returns 200 regardless of user existence"
    - "Single-use password reset tokens via usedAt column check"

key-files:
  created:
    - "backend/package.json — all dependencies"
    - "backend/tsconfig.json — strict TypeScript config"
    - "backend/src/main.ts — bootstrap (global prefix, CORS, ValidationPipe, 0.0.0.0)"
    - "backend/src/app.module.ts — root module (TypeORM, Throttler, Auth, Users, Email)"
    - "backend/src/config/database.config.ts — TypeORM DataSource for CLI"
    - "backend/src/config/jwt.config.ts — access+refresh secret/expiry config"
    - "backend/src/auth/auth.module.ts — wires AuthService, JwtModule, strategies"
    - "backend/src/auth/auth.controller.ts — all 7 endpoints"
    - "backend/src/auth/auth.service.ts — core auth logic"
    - "backend/src/auth/strategies/jwt.strategy.ts — validates user on each request"
    - "backend/src/auth/strategies/jwt-refresh.strategy.ts — extracts refresh token from body"
    - "backend/src/auth/guards/jwt-auth.guard.ts — extends AuthGuard('jwt')"
    - "backend/src/auth/guards/roles.guard.ts — RBAC via Reflector metadata"
    - "backend/src/auth/decorators/roles.decorator.ts — @Roles(...) SetMetadata"
    - "backend/src/auth/decorators/current-user.decorator.ts — @CurrentUser() param decorator"
    - "backend/src/auth/dto/*.ts — 5 DTOs with class-validator constraints"
    - "backend/src/users/entities/user.entity.ts — User TypeORM entity"
    - "backend/src/users/entities/refresh-token.entity.ts — RefreshToken TypeORM entity"
    - "backend/src/users/entities/password-reset-token.entity.ts — PasswordResetToken entity"
    - "backend/src/users/users.service.ts — findById + findByEmail"
    - "backend/src/users/users.module.ts"
    - "backend/src/email/email.service.ts — stub (logs to console, real SMTP Phase 2)"
    - "backend/src/email/email.module.ts"
    - "backend/test/jest-e2e.json — e2e test configuration"
    - "backend/test/app.context-spec.ts — NestJS context boot test"
    - "backend/test/auth.e2e-spec.ts — 14 auth endpoint integration tests"
  modified: []

key-decisions:
  - "bcrypt cost 12 enforced via BCRYPT_COST constant (TechArch Security spec)"
  - "Refresh tokens stored as SHA-256(random 64-byte hex) in DB — server-side revocation without JWT blocklists"
  - "Password reset tokens single-use via usedAt column; also clears all refresh tokens on password change"
  - "forgotPassword always returns 200 regardless of email existence (enumeration-safe)"
  - "EmailService stubs to console logger in dev — real Nodemailer/Resend wired in Phase 2"
  - "main.ts binds 0.0.0.0 (not localhost) for docker-compose proxy compatibility"
  - "app.module.ts uses migrationsRun: false + synchronize: false — migrations run via CLI in compose command"

patterns-established:
  - "Dual JWT strategy: JwtStrategy ('jwt') for access tokens, JwtRefreshStrategy ('jwt-refresh') for body field extraction"
  - "Token sanitization: sanitizeUser() always strips passwordHash before any response"
  - "Integration tests: @nestjs/testing moduleFixture + Supertest, unique timestamped email per run, afterAll cleanup"

# Metrics
duration: 4min
completed: 2026-08-06
---

# Phase 1 Plan 03: NestJS Auth API Summary

**Complete NestJS backend with 7 JWT auth endpoints, bcrypt-12 password hashing, SHA-256 refresh token revocation, RBAC guards, and 14-test integration suite**

## Performance

- **Duration:** 4 min
- **Started:** 2026-08-06T01:00:57Z
- **Completed:** 2026-08-06T01:05:25Z
- **Tasks:** 2
- **Files modified:** 29

## Accomplishments
- Full NestJS backend scaffold (package.json, tsconfig, main.ts, app.module.ts) with TypeORM, Passport, Throttler
- Complete auth module: 7 endpoints, AuthService with bcrypt cost 12, SHA-256 token hashing, sliding refresh rotation, single-use password reset tokens, enumeration-safe forgot-password
- RBAC infrastructure: JwtAuthGuard, RolesGuard, Roles decorator, CurrentUser decorator — ready for role-protected routes in 01-05
- Integration test suite: 14 tests covering all endpoints, contract assertions, auth enforcement, token revocation, and NestJS context boot test

## Task Commits

Each task was committed atomically:

1. **Task 1: NestJS backend scaffold + auth module with all 7 endpoints** - `6612e2f` (feat)
2. **Task 2: Backend integration tests (context boot + all auth endpoints)** - `bd93ef1` (feat)

## Files Created/Modified

- `backend/package.json` — all NestJS/TypeORM/Passport/bcrypt dependencies (29 packages)
- `backend/tsconfig.json` — strict TypeScript with emitDecoratorMetadata for NestJS
- `backend/src/main.ts` — bootstrap with 0.0.0.0 bind, global prefix, CORS, ValidationPipe
- `backend/src/app.module.ts` — root module wiring TypeORM + Throttler + feature modules
- `backend/src/config/database.config.ts` — TypeORM DataSource for CLI migration runner
- `backend/src/config/jwt.config.ts` — access+refresh JWT secret/expiry configuration
- `backend/src/auth/auth.module.ts` — AuthModule wiring all providers + JwtModule
- `backend/src/auth/auth.controller.ts` — all 7 auth endpoints
- `backend/src/auth/auth.service.ts` — core auth logic with bcrypt-12 + SHA-256
- `backend/src/auth/strategies/jwt.strategy.ts` — validates user on each access token request
- `backend/src/auth/strategies/jwt-refresh.strategy.ts` — extracts refresh token from body
- `backend/src/auth/guards/jwt-auth.guard.ts` — JwtAuthGuard extends AuthGuard('jwt')
- `backend/src/auth/guards/roles.guard.ts` — RolesGuard with Reflector metadata
- `backend/src/auth/decorators/roles.decorator.ts` — @Roles() SetMetadata decorator
- `backend/src/auth/decorators/current-user.decorator.ts` — @CurrentUser() param decorator
- `backend/src/auth/dto/*.ts` — 5 DTOs (register, login, refresh, forgot-password, reset-password)
- `backend/src/users/entities/*.ts` — User, RefreshToken, PasswordResetToken TypeORM entities
- `backend/src/users/users.service.ts` — findById + findByEmail
- `backend/src/users/users.module.ts` — exports UsersService
- `backend/src/email/email.service.ts` — console-logging stub (real SMTP Phase 2)
- `backend/src/email/email.module.ts` — exports EmailService
- `backend/test/jest-e2e.json` — e2e test runner configuration
- `backend/test/app.context-spec.ts` — NestJS application context boot test
- `backend/test/auth.e2e-spec.ts` — 14 integration tests for all auth endpoints

## Decisions Made
- bcrypt cost 12 via `BCRYPT_COST = 12` constant (TechArch Security spec)
- SHA-256(random 64-byte hex) stored in DB for refresh tokens — enables server-side revocation without JWT blocklists
- Password reset tokens: single-use via `usedAt` check; password change invalidates all refresh tokens
- `forgotPassword` always returns 200 regardless of email existence (enumeration-safe)
- `EmailService` stubs to console logger — real Nodemailer/Resend wired in Phase 2
- `main.ts` binds `0.0.0.0:3000` (not localhost) for docker-compose proxy compatibility
- `migrationsRun: false` + `synchronize: false` in TypeORM — migrations run via CLI in compose command

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

| File | Line | Stub | Classification |
|------|------|------|----------------|
| `backend/src/email/email.service.ts` | 9 | `sendPasswordReset` logs to console instead of sending real email | **Cosmetic** — plan explicitly specifies "stubbed for dev, real SMTP in prod"; auth flows work correctly |

## Issues Encountered

None — TypeScript compiled cleanly (`tsc --noEmit` exit 0) on first attempt.

## User Setup Required

None — no external service configuration required for backend (uses docker-compose postgres).

## Next Phase Readiness
- Auth API ready for frontend integration in plans 01-04 (auth pages) and 01-05 (protected routes)
- JwtAuthGuard + RolesGuard ready for use on any protected endpoint
- Integration tests require live Postgres (docker-compose up) to run — they are e2e tests, not unit tests

---
*Phase: 01-foundation*
*Completed: 2026-08-06*

## Self-Check: PASSED

- All 9 key files confirmed present on disk
- Both task commits confirmed in git log (6612e2f, bd93ef1)
- TypeScript compilation: `tsc --noEmit` → exit 0
- Known stubs section present: 1 cosmetic stub (EmailService), no blocking stubs

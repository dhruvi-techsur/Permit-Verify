---
phase: 01-foundation
plan: "01"
subsystem: infra
tags: [docker, postgres, typeorm, migration, seed, minio, nestjs]

# Dependency graph
requires: []
provides:
  - Docker Compose dev stack with postgres:15, minio, backend, frontend services
  - PostgreSQL schema: users, password_reset_tokens, refresh_tokens tables with all enums
  - TypeORM migration InitialSchema1721000000001 with all DDL matching TechArch
  - Idempotent seed: applicant@permitflow.test, reviewer@permitflow.test, admin@permitflow.test
  - .env.example documenting all required environment variables
affects:
  - 01-02-foundation
  - 01-03-foundation
  - 01-04-foundation
  - 01-05-foundation
  - All subsequent phases requiring a running stack

# Tech tracking
tech-stack:
  added: [postgres:15, minio:RELEASE.2024-01-18T22-51-28Z, node:20-alpine, typeorm, bcrypt]
  patterns:
    - "DB healthcheck + depends_on service_healthy ensures migrate runs after DB is ready"
    - "ON CONFLICT (email) DO UPDATE for idempotent seed (safe on every boot)"
    - "DATABASE_URL points to compose service name (postgres:5432), never localhost"
    - "migrate → seed → serve order in compose command"

key-files:
  created:
    - docker-compose.yml
    - .env.example
    - backend/Dockerfile.dev
    - frontend/Dockerfile.dev
    - backend/src/database/migrations/001_initial_schema.ts
    - backend/src/database/seeds/seed.ts
    - backend/src/database/seeds/run-seed.ts
  modified: []

key-decisions:
  - "postgres:15 pinned (not :latest) to hit sandbox image cache and avoid registry rate limits"
  - "minio pinned to RELEASE.2024-01-18T22-51-28Z for reproducibility"
  - "bcrypt cost 12 for seed passwords — appropriate for dev UAT users"
  - "RESEND_API_KEY uses dev-placeholder in compose (real key provided at runtime via .env)"
  - "Minimal Dockerfile.dev stubs for backend/frontend — replaced in plans 01-02/01-03"

patterns-established:
  - "compose command: sh -c 'npm run migration:run && npm run seed && npm run start:dev'"
  - "Seed uses ON CONFLICT for idempotency on every compose restart"
  - "All service-to-service URLs use compose service names (postgres, minio)"

# Metrics
duration: 1min
completed: 2026-08-06
---

# Phase 1 Plan 01: Docker Compose dev stack + PostgreSQL schema migration + idempotent seed

**Four-service Docker Compose stack (postgres:15, minio, backend, frontend) with TypeORM migration creating users/password_reset_tokens/refresh_tokens tables, all 4 enums, 9 indexes, updated_at trigger, and an idempotent 3-role seed**

## Performance

- **Duration:** 1 min
- **Started:** 2026-08-06T00:54:33Z
- **Completed:** 2026-08-06T00:56:18Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Complete `docker-compose.yml` with four services matching TechArch local dev spec exactly
- `postgres:15` with healthcheck (`pg_isready`), `minio` pinned release, backend with `depends_on: service_healthy`
- TypeORM migration with all Phase 1 DDL: 3 tables, 4 enums, 9 indexes, `updated_at` auto-trigger
- Idempotent seed creating one user per role (applicant, reviewer, admin) with bcrypt-hashed passwords
- `.env.example` documenting all 14 required env vars from TechArch §7.4
- Minimal `Dockerfile.dev` stubs for backend and frontend (scaffolded in 01-02/01-03)

## Task Commits

Each task was committed atomically:

1. **Task 1: Docker Compose dev stack with health checks** - `ee2df91` (feat)
2. **Task 2: TypeORM migration and idempotent seed** - `01fdcbc` (feat)

## Files Created/Modified
- `docker-compose.yml` — Multi-service dev stack: postgres:15, minio, backend, frontend
- `.env.example` — All required env vars documented with dev defaults
- `backend/Dockerfile.dev` — Minimal node:20-alpine dev image for backend
- `frontend/Dockerfile.dev` — Minimal node:20-alpine dev image for frontend
- `backend/src/database/migrations/001_initial_schema.ts` — TypeORM migration: all tables, enums, indexes, trigger
- `backend/src/database/seeds/seed.ts` — Idempotent seed with 3 role users
- `backend/src/database/seeds/run-seed.ts` — CLI entry point for `npm run seed`

## Decisions Made
- Used `postgres:15` (pinned) matching TechArch spec; pinned minio to `RELEASE.2024-01-18T22-51-28Z` for reproducibility
- Minimal Dockerfile.dev stubs for backend and frontend, as noted in plan — real scaffolding in 01-02/01-03
- `RESEND_API_KEY: dev-placeholder` in compose is intentional for local dev; real key injected via `.env`
- bcrypt cost 12 for seed — appropriate for dev/UAT test users

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

- `RESEND_API_KEY: dev-placeholder` in `docker-compose.yml` line 57 — **Cosmetic**: intentional dev placeholder for external email service; real key provided at runtime via `.env` file. Does not defeat plan objective.
- `backend/Dockerfile.dev` and `frontend/Dockerfile.dev` are minimal stubs — **Cosmetic**: plan explicitly notes these will be replaced in plans 01-02 and 01-03.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required for local dev. Real credentials (RESEND_API_KEY, production DB) are documented in `.env.example`.

## Next Phase Readiness
- Docker Compose stack validated with `docker compose config --quiet` — exits 0
- Migration file ready for `npm run migration:run` in backend container
- Seed file ready for `npm run seed` — idempotent, safe on every restart
- Ready for 01-02: Vite/React/TypeScript frontend scaffold + design system
- Ready for 01-03: NestJS backend scaffold + auth endpoints

---
*Phase: 01-foundation*
*Completed: 2026-08-06*

## Self-Check: PASSED

- ✅ `docker-compose.yml` exists on disk
- ✅ `.env.example` exists on disk
- ✅ `backend/Dockerfile.dev` exists on disk
- ✅ `frontend/Dockerfile.dev` exists on disk
- ✅ `backend/src/database/migrations/001_initial_schema.ts` exists on disk
- ✅ `backend/src/database/seeds/seed.ts` exists on disk
- ✅ `backend/src/database/seeds/run-seed.ts` exists on disk
- ✅ Commit `ee2df91` (Task 1) found in git log
- ✅ Commit `01fdcbc` (Task 2) found in git log
- ✅ Build check: `docker compose config --quiet` → exit 0
- ✅ No blocking stubs found (cosmetic stubs documented in Known Stubs)

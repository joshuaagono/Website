# GraceStream Admin Backend (Prototype)

Dependency-free Node server matching the `ARCHITECTURE.md` prototype spec. Implements every endpoint `app.js` already calls (`/api/admin/summary`, `/api/analytics/users`, `/api/analytics/session`, approvals, media, archive, payments, AI logs) plus the rest of the production API sketch, backed by a JSON file.

## Run

```
cd backend
node server.js
```

Serves the API **and** the frontend together at `http://localhost:8787` (no build step, no npm install). First run copies `db.seed.json` → `db.json`; all writes persist there.

## Auth model (prototype only)

Send `x-access-level: admin` (and optionally `x-actor: you@example.com`) on admin requests. `app.js` already does this for you via `fetchBackendJson`. Replace with real sessions/JWTs before production, per the Identity module in `ARCHITECTURE.md`.

## What the admin panel buttons now do

Each button in the Admin Portal (Users, Media, Archive, Payments, AI tabs) calls a real endpoint — approving members runs `/api/approvals/evaluate` + `/decide`, publishing media calls `/api/media/publish`, archive actions hit `/api/archive/bundles`, etc. — and the metric tiles refresh from `/api/admin/summary` after every action. Reset state any time by deleting `backend/db.json`.

## Swapping in the real stack

Endpoints, request/response shapes, and the `AccessLevel` enum match `platform-contracts.ts`, so moving to NestJS + PostgreSQL later is a drop-in replacement — the frontend doesn't change.

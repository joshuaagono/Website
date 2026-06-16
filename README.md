# GraceStream Admin Backend (Prototype)

Dependency-free Node server matching the `ARCHITECTURE.md` prototype spec. Implements the operational admin portal endpoints `app.js` already calls (`/api/admin/summary`, `/api/analytics/users`, approvals, media, archive, payments, AI logs) **and** a `/admin` content editor for editing the live website itself: hero text, the document/media library, calendar events, and archive bundles.

## Run

```
cd backend
node server.js
```

Serves the API **and** the frontend together at `http://localhost:8787` (no build step, no npm install). First run copies `db.seed.json` → `db.json`; all writes persist there. Delete `db.json` any time to reset to the seed data.

## Editing the website: `/admin`

Visit `http://localhost:8787/admin`.

First visit: no password is set yet, so you'll be asked to create one (8+ characters). After that, the same screen becomes a login. Sessions last 12 hours via an HttpOnly cookie; change the password any time from the Account tab.

What you can edit:
- **Hero Text** — the homepage eyebrow, title, body copy, button labels/links, and stat tiles.
- **Resources** — the document/media library cards used by search (title, type, date, preacher, excerpt, tags, and searchable quotes).
- **Calendar Events** — every event on the month calendar (date, time, type, location, owner, color, attached resources).
- **Archive Bundles** — the 4-in-1 video/audio/PDF/EPUB bundles on the archive page, including the searchable PDF/EPUB quotes.

Edits save immediately to `db.json` and the public site (`/`) picks them up automatically on next page load — no rebuild needed.

## Operational admin portal: `/#admin` (inside the main site)

The original control-room tabs (Users & Access, Media, Payments, AI) still live inside the main site's hash-routed Admin Portal section and talk to the operational endpoints (approvals, media jobs, payments, AI logs) — that's a different surface from the new `/admin` content editor.

## Auth model (prototype only)

`/admin` uses a single shared password and a signed session cookie — good enough for one or a few trusted editors. The operational portal still also accepts `x-access-level: admin` headers for the older approval/media/payment flows. Replace both with real per-user accounts before production, per the Identity module in `ARCHITECTURE.md`.

## Swapping in the real stack

Endpoints, request/response shapes, and the `AccessLevel` enum match `platform-contracts.ts`, so moving to NestJS + PostgreSQL later is a drop-in replacement — the frontend doesn't change.


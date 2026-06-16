# GraceStream Church Platform Architecture

## Recommended Stack

- Language: TypeScript across frontend, backend, workers, and shared contracts.
- Frontend: Next.js with React Server Components, Tailwind or a design system, and accessible UI primitives.
- Backend: NestJS or Next.js API routes for smaller deployments; split into services as traffic grows.
- Prototype backend: dependency-free Node HTTP server in `backend/server.js` with JSON persistence in `backend/db.json`.
- Database: PostgreSQL with row-level security, Prisma or Drizzle, Redis for queues and caching.
- Search: OpenSearch or Postgres full-text plus vector embeddings for PDF, DOCX, EPUB, transcripts, and images.
- Media: Cloudflare Stream, Mux, AWS MediaConvert, or LiveKit depending on budget and live needs.
- Storage: S3-compatible storage such as AWS S3, Cloudflare R2, or Backblaze B2.
- AI: OpenAI API for chatbot, document Q&A, sermon summaries, captions review, moderation, and workflow routing.

## Core Modules

1. Identity and access control
   - Guest, member, worker, pastor, media, finance, admin, and super-admin roles.
   - Rule-based auto-approval with risk scoring.
   - Optional sponsor approvals and department ownership.
   - Super Admin can create role classes, assign feature permissions, delegate website editing rights, and audit every permission change.

2. Admin portal
   - Protected dashboard for users, access levels, approval queues, media jobs, archive bundles, streams, payments, integrations, and AI workflow logs.
   - Full audit trail for every approval, payment action, publishing action, and permission change.
   - Custom backend routes power admin summary, users, audit logs, and analytics matrices.
   - Website editor uses section-level permissions, drafts, approvals, version history, and rollback.

3. AI automation
   - Sermon summaries, clips, titles, tags, chapters, devotionals, and social posts.
   - Chatbot with permission-aware retrieval.
   - Workflow agent that can open tickets, send reminders, and escalate approvals.

4. Media platform
   - Adaptive bitrate video with 4K, 1080p, 720p, 480p, and audio-only tracks.
   - DVR, subtitles, chapters, multi-stream switching, multi-language interpreter feeds, clips, and replay publishing.
   - Playback continuity preserves the current timestamp when changing quality, switching between video/audio mode, or moving between language feeds.
   - Automatic upload after service using queue workers.

5. Calendar and resources
   - Every day can attach video, audio, photos, PDFs, DOCX, EPUB, forms, and private links.
   - Featured resources and permission-aware visibility.
   - Interactive month calendar with previous-event retrieval, upcoming-event filtering, overflow dates, event chips, detailed event panels, and direct event resource access.

6. Archive
   - Dedicated archive page for video, audio, PDF, and EPUB resources.
   - Each archive record is a bundle containing video, audio, PDF, and EPUB versions of the same service, event, or teaching.
   - Category filters, featured bundles, download rules, and access-aware resource visibility.
   - Archive-local search by title, date, preacher, category, bundle ID, serial number, file descriptions, and PDF/EPUB content.

7. Search
   - Extract text from PDFs, DOCX, EPUB, image OCR, and transcripts.
   - Store chunks with metadata and embeddings.
   - Fetch exact file matches and answer questions with citations.
   - Search by file name, date, serial number, preacher, resource ID, file type, transcript, photo metadata, or phrase inside PDF/EPUB files.
   - Return extracted PDF/EPUB quotes with source page/chapter metadata and access-level checks before opening private resources.
   - Pull data directly from archive bundles by indexing each bundle's video, audio, PDF, and EPUB files as searchable records linked back to the parent archive.

8. Registration and convention
   - Smart registration with verification, family grouping, ministry interests, payments, QR badges, seat allocation, and needs routing.

9. Payments and donations
   - Stripe, Paystack, Flutterwave, or bank transfer adapters.
   - Design for pledges, recurring giving, funds, receipts, and finance approval exports.

10. Integrations
   - Telegram, Slack, email, SMS, CRM, accounting, livestream providers, analytics, storage, and calendar APIs.
   - Plugin registry isolates integrations behind declared permissions, webhook routes, API key rotation, provider health checks, and fallback behavior.

11. AI analytics
   - Capture session analytics such as IP address, browser, device type, provider, pages visited, time spent, return frequency, and downloads through backend event collection.
   - Realtime location should use browser geolocation only after user consent; approximate IP location should be treated as lower confidence.
   - AI summaries can highlight engagement trends, repeat visitors, content demand, download behavior, and device/network quality issues.
   - Analytics must include retention limits, role-based access, consent records, and audit logs.
   - User analytics matrix displays each user/session as a row with columns for IP, browser, provider, device, location, pages, time spent, frequency, and downloads.

## Production API Sketch

```ts
POST /api/auth/register
POST /api/approvals/evaluate
POST /api/approvals/notify
POST /api/media/upload-complete
POST /api/media/transcode
POST /api/media/publish
GET  /api/calendar/:date
POST /api/search
POST /api/chat
GET  /api/admin/roles
GET  /api/admin/site-sections
GET  /api/admin/plugins
POST /api/admin/assign-role
POST /api/analytics/session
POST /api/analytics/event
POST /api/analytics/download
POST /api/analytics/location-consent
POST /api/convention/register
POST /api/payments/checkout
POST /api/donations
```

## Standout Features

- AI sermon-to-devotional generator.
- Live multilingual captions and translated subtitles.
- First-time visitor follow-up journeys.
- Prayer request triage with pastoral escalation.
- Family check-in and children ministry pickup codes.
- Volunteer scheduling with auto-reminders.
- Testimony wall with approval workflow.
- Ministry analytics for attendance, giving, engagement, and care needs.

# GraceStream Church Platform

Stack:

- Next.js App Router
- TypeScript
- PostgreSQL
- Prisma
- Clerk authentication
- Vercel deployment

## Setup

```powershell
npm install
copy .env.example .env.local
npx prisma migrate dev
npm run dev
```

## Required Vercel Environment Variables

- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`

## Features

- Public top menu: Home, Archive, Library, Donation
- Clerk login/logout
- Profile route for signed-in users
- Admin and Analytics only render if `User.canAccessAdmin` is true
- Super Admin bootstrap for `joshuaagono95@gmail.com`
- PostgreSQL schema for users, roles, permissions, resources, archive bundles, analytics, downloads, plugins, donations, and site drafts
- Multi-language live player with playback continuity
- Archive and Library backed by Prisma queries
- Analytics matrix backed by PostgreSQL sessions

## Super Admin

The first Super Admin is automatically bootstrapped by `getCurrentDbUser()` when the Clerk account email is:

```text
joshuaagono95@gmail.com
```

That user receives:

- `accessClass: SUPER_ADMIN`
- `canAccessAdmin: true`

All other users default to `MEMBER` with no admin access until Super Admin grants access in the database/admin portal.

# GraceStream Custom Admin Backend

Run from the `church-platform` folder:

```powershell
node backend/server.js
```

Open:

```text
http://127.0.0.1:4180/
```

## API Routes

- `GET /api/admin/summary`
- `GET /api/admin/users`
- `PUT /api/admin/users/:id`
- `GET /api/admin/audit-log`
- `GET /api/analytics/users`
- `POST /api/analytics/session`

## Notes

- This backend uses only Node built-ins and `backend/db.json`.
- IP address and network provider should be captured on the backend, not from frontend JavaScript.
- Realtime precise location requires explicit browser/user consent.
- Production deployment should add authentication, role permissions, rate limits, encryption, retention policies, and audit logging.

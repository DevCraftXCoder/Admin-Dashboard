# Security Policy

## Reporting a Vulnerability

Do **not** open a public GitHub issue for security vulnerabilities.

Contact via GitHub: [@DevCraftXCoder](https://github.com/DevCraftXCoder)

---

## Security Architecture

### Admin Authentication

- All admin routes require `X-Admin-Key` header — separate from user JWT system
- API key validated via timing-safe comparison on every request
- No admin functionality accessible via user JWT — complete auth layer separation
- Admin session tokens have short TTL with server-side revocation support

### Security Intelligence Center (SIC) Access

- SIC endpoints require admin API key — not accessible to regular users under any circumstance
- SIC scan results persisted with audit trail: who triggered the scan, when, and what scope
- SIC findings treated as sensitive — not exposed in any public-facing API

### AI Security (SIC)

- SIC prompts do not include raw user-generated data — only structured platform metadata
- AI output is treated as advisory findings, not executable instructions
- SIC scan results reviewed by a human before any action is taken
- Anthropic API key for SIC stored separately from application secrets — scoped to admin service

### Audit Logging

All admin actions are logged to D1 with:
- Admin identity (key fingerprint — not the full key)
- Action type
- Target resource
- Timestamp
- Request metadata (IP, user agent)

Audit logs have a 90-day retention policy. Logs are append-only from the application layer.

### Privilege Escalation Prevention

- No admin endpoint accepts a user JWT — prevents JWT escalation to admin
- Admin key rotation policy: rotate on any suspected exposure
- Admin key stored as a hash in audit logs — the raw value is never logged
- Separate rate limiting on admin endpoints — brute-force protection on the API key

### Content Management Security

- Admin delete operations are irreversible after the hard-delete grace period
- Track delete triggers R2 cleanup for all associated files — no orphaned storage
- User delete cascades through all 30+ related tables in a transaction — atomic operation
- Soft-delete + audit trail maintained before any hard purge

### Infrastructure

- Admin dashboard served on the same domain but behind a separate auth middleware
- All admin API responses include `X-Content-Type-Options: nosniff` and `X-Frame-Options: DENY`
- No admin endpoints are cached — all requests go through auth validation
- Admin UI never exposed on a public CDN cache path

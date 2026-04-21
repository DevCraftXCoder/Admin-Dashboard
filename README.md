# Admin Dashboard

**Multi-panel admin console with Security Intelligence Center (SIC) — AI-powered security analysis, vulnerability assessment, and access control validation.**

> A full-featured admin dashboard for platform operations. Seven specialized panels cover analytics, user management, content moderation, growth tracking, creator scoring, and security. The Security Intelligence Center (SIC) tab is an AI-powered security analysis layer that continuously audits the platform for vulnerabilities, validates access controls, and generates compliance reports.

---

## Architecture

```
Browser (admin-authenticated)
  │
  ▼
Next.js 15  (App Router · admin auth gate)
  │
  ├── Dashboard Shell  (sidebar nav · tab routing)
  │
  ├── Panel: Analytics        →  platform-wide stats + charts
  ├── Panel: Users            →  user management · ban · verify · delete
  ├── Panel: Content          →  track + post moderation queue
  ├── Panel: Reports          →  content report queue + AI auto-research
  ├── Panel: Growth           →  growth analytics (→ Growth Report AI)
  ├── Panel: Creator Scoring  →  influencer metrics (→ Influnx Calc)
  └── Panel: SIC              →  Security Intelligence Center
        │
        └── AI Security Engine  (Claude API · extended thinking)
              ├── Vulnerability Scanner
              ├── Access Control Validator
              ├── Compliance Reporter
              └── Threat Modeler
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, App Router, React |
| Admin Auth | API key gate + session validation |
| AI (SIC) | Anthropic Claude API (extended thinking) |
| API | Hono (Cloudflare Workers) |
| Database | Cloudflare D1 |
| Validation | Zod |

---

## Panels

### Analytics
- Platform-wide statistics: users, tracks, plays, revenue
- Follower growth charts (daily/weekly/monthly)
- Top content by play count and engagement
- Subscription tier distribution
- Error rate and uptime history

### Users
- Paginated user list with search and filter
- User detail view: profile, tier, join date, activity
- Actions: ban (with expiry), unban, verify artist, delete with full cascade cleanup
- Soft-delete protection — hard delete triggers R2 cleanup for all associated files

### Content
- Track and post management with admin-level delete
- Admin delete triggers R2 cleanup (audio, HLS segments, cover art) and cascades through 30+ related tables
- Content flagging and status updates

### Reports
- Moderation queue — user-submitted content reports
- AI auto-research: before a moderator reviews a report, the system automatically gathers context (profile history, report patterns, content metadata) and surfaces it as a structured brief
- Action log: take action, update status, track resolution

### Growth (Growth Report AI integration)
- Real-time growth dashboard
- Period-over-period comparisons
- AI-generated narrative growth reports with streaming output

### Creator Scoring (Influnx Calc integration)
- Per-creator scoring across the Influnx 100-point system
- Batch scoring for the full creator roster
- Score trend history

---

## Security Intelligence Center (SIC)

SIC is an AI-powered security analysis layer embedded in the admin console. It is not a passive dashboard — it actively analyzes the platform's security posture and generates actionable reports.

### Capabilities

#### Vulnerability Assessment
- Reviews known OWASP Top 10 patterns against the current API surface
- Flags endpoints missing auth, rate limiting, or input validation
- Identifies IDOR risk patterns (endpoints accepting user-supplied resource IDs)
- Checks for injection vectors in parameterized query patterns

#### Access Control Validation
- Maps every API route to its auth requirement (public, JWT, admin key, signed webhook)
- Flags routes where auth type mismatches expected access level
- Detects over-privileged endpoints (admin actions reachable by user JWT)
- Validates CSRF exemption list — flags any non-exempt state-changing endpoints missing the header check

#### Compliance Reporting
- GDPR surface map: which endpoints handle PII, which support deletion and export
- Data retention audit: checks TTL settings on ephemeral tables (error_logs, uptime_checks, ws_tickets)
- Soft-delete + hard-purge verification: confirms cascade completeness
- Session management audit: token TTLs, rotation policy, revocation coverage

#### Threat Modeling
- Generates STRIDE-based threat model for critical flows (auth, payment, file upload, DMs)
- Identifies trust boundary crossings and validates they have appropriate controls
- Produces attack surface summary for use in security reviews

### SIC API

```http
POST /api/sic/scan
X-Admin-Key: <key>
Content-Type: application/json

{
  "scope": "access_control",          // vulnerability | access_control | compliance | threat_model | full
  "target": "authentication_routes",  // optional — scope to specific area
  "depth": "deep"                     // quick | standard | deep
}
```

Response: `text/event-stream` — SIC report tokens streamed as SSE.

```http
GET /api/sic/reports
X-Admin-Key: <key>

→ Paginated list of past SIC scan reports with score, scope, and findings count
```

```http
GET /api/sic/reports/:id
X-Admin-Key: <key>

→ Full report: findings, confidence scores, recommendations
```

---

## Key Engineering Decisions

### Extended thinking for security analysis
Security analysis requires multi-step reasoning across the entire API surface. SIC uses Claude's extended thinking mode — the model works through auth flows, trust boundaries, and access patterns before producing findings. This produces fewer false positives and more accurate severity ratings than a fast-path response.

### Streaming SIC reports
Security reports can be 2,000–8,000 tokens. Streaming via SSE means the first findings appear in under a second — the admin sees results as they're generated rather than waiting for the full report.

### SIC as a separate auth context
SIC endpoints require admin API key authentication — never JWT. Admin key auth is isolated from the user auth system. A compromised user JWT cannot access any SIC functionality.

### Scan results persisted to D1
Each SIC scan result is persisted with a timestamp, scope, and finding list. This builds a historical security posture record. The dashboard can show security score trends over time.

---

## Security (Meta)

The admin dashboard itself applies the security standards it monitors:

- **Admin auth** — API key required on all `/api/admin/*` routes; key validated via timing-safe comparison
- **No JWT crossover** — admin routes never accept a user JWT; separate auth context
- **CSRF exempt** — admin routes are explicitly exempted from the `X-Requested-With` check (they use API key auth instead)
- **Rate limiting** — admin endpoints rate-limited to prevent brute-force on the API key
- **Audit logging** — all admin actions logged to D1 with admin identity, action, target, and timestamp

---

## License

MIT — see [LICENSE](LICENSE)

# Admin Dashboard

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Anthropic](https://img.shields.io/badge/Anthropic_Claude-D97706?style=flat&logo=anthropic&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=flat&logo=cloudflare&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

**Multi-panel admin console with Security Intelligence Center (SIC) — AI-powered security analysis, vulnerability assessment, and access control validation.**

> A full-featured platform operations dashboard with seven specialized panels. The Security Intelligence Center (SIC) tab uses Claude's extended thinking to audit the platform for vulnerabilities, validate access controls, and generate structured compliance reports.

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Panels](#panels)
- [Security Intelligence Center (SIC)](#security-intelligence-center-sic)
- [Security (Meta)](#security-meta)
- [Recent Additions](#recent-additions)
- [Running This](#running-this)

---

## Architecture

```
Browser  (admin-authenticated)
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

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js 15, App Router, React | Server and client components |
| AI (SIC) | Anthropic Claude API (`claude-opus-4-7`) | Extended thinking, 8k thinking budget |
| Streaming | Server-Sent Events | Progressive AI report delivery |
| Runtime | Cloudflare Workers | via @opennextjs/cloudflare |
| Auth | Web Crypto API | httpOnly cookie session — no JWT library |
| Validation | Zod | All API route payloads |

---

## Panels

| Panel | Purpose | Key Actions |
|---|---|---|
| **Analytics** | Platform-wide stats: users, tracks, plays, revenue, error rates | Time-range filter, subscription distribution chart |
| **Users** | User list with search and filter | Ban / unban, artist verify, delete with full cascade |
| **Content** | Track + post management queue | Admin delete with R2 + HLS cleanup, content flagging |
| **Reports** | Moderation queue with AI auto-research context | Take action, update status, track resolution |
| **Growth** | Real-time growth analytics with AI narrative | Period-over-period comparison, streaming report |
| **Creator Scoring** | Per-creator Influnx 100-point scoring | Batch scoring, score trend history |
| **SIC** | Security Intelligence Center | Vulnerability scan, access control audit, compliance report |

---

## Security Intelligence Center (SIC)

SIC is an AI-powered security analysis layer embedded in the admin console. It actively analyzes the platform's security posture and generates actionable findings.

### Capabilities

#### Vulnerability Assessment
- Reviews OWASP Top 10 patterns against the current API surface
- Flags endpoints missing auth, rate limiting, or input validation
- Identifies IDOR risk patterns (endpoints accepting user-supplied resource IDs)
- Checks for injection vectors in query patterns

#### Access Control Validation
- Maps every API route to its auth requirement (public / JWT / admin key / signed webhook)
- Flags routes where auth type mismatches expected access level
- Detects over-privileged endpoints (admin actions reachable by user JWT)
- Validates CSRF exemption list — flags non-exempt state-changing endpoints missing the header check

#### Compliance Reporting
- GDPR surface map: which endpoints handle PII, which support deletion and export
- Data retention audit: checks TTL settings on ephemeral tables (error logs, uptime checks, WS tickets)
- Soft-delete + hard-purge cascade completeness verification
- Session management audit: rotation policy, revocation coverage

#### Threat Modeling
- Generates STRIDE-based threat model for critical flows (auth, payment, file upload, DMs)
- Identifies trust boundary crossings with control verification
- Produces attack surface summary suitable for security reviews

### How Extended Thinking Helps
Security analysis requires multi-step reasoning across the entire API surface. Claude's extended thinking mode (8,000-token budget) works through auth flows, trust boundaries, and access patterns before producing findings — fewer false positives and more accurate severity ratings than a fast-path response.

### SIC API

```http
POST /api/sic/scan
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
→ Paginated list of past SIC scan reports

GET /api/sic/reports/:id
→ Full report: findings, confidence scores, recommendations
```

---

## Security (Meta)

The admin dashboard applies the same security standards it monitors:

- **Admin auth gate:** Middleware on all `/admin/*` routes — requests without a valid admin session cookie are rejected at the middleware layer, before any handler runs.
- **httpOnly cookie:** Admin session stored in an httpOnly, Secure, SameSite=Strict cookie — not accessible to client JavaScript under any circumstance.
- **Server-side session verification:** Every admin API route verifies the session on the server before executing any logic — no client-held auth state.
- **Separate auth context:** Admin routes never accept a user JWT. A compromised user credential cannot reach any admin endpoint. Admin key and user JWT are completely separate auth systems.
- **CSRF exemption:** Admin routes are explicitly exempted from the `X-Requested-With` check because they use API key auth instead — the exemption is intentional, not an oversight.
- **Rate limiting:** Admin endpoints rate-limited to prevent brute-force against the admin key.
- **Audit logging:** All admin actions logged to D1 with identity, action, target, and timestamp.
- **No client-side auth state:** Zero `localStorage` or client-held tokens for admin sessions.
- **Prompt injection mitigation:** User-generated content passed to AI as structured data with strict role separation — never interpolated into the system prompt.

---

## Recent Additions

- Deploy-status pill showing live Cloudflare deployment state in the Systems tab
- Top-3 EV plays + daily summary Discord notification buttons in EV Betta panel
- WebGL performance charts in admin analytics panel

---

## Running This

```bash
npm install

npm run dev          # dev server
npm run build        # production build
npm run typecheck    # tsc --noEmit
```

See `.env.example` for required environment variables.

---

## License

MIT — see [LICENSE](LICENSE)

# Admin Dashboard

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![LLM Powered](https://img.shields.io/badge/LLM_Powered-D97706?style=flat&logo=anthropic&logoColor=white)

**Multi-panel admin console with AI-powered Security Intelligence Center.**

> Platform operations dashboard with 7 specialized panels — including an embedded AI security scanner that runs LLM extended thinking to analyze vulnerabilities, validate access controls, and auto-research content reports before moderator review.

## Architecture

```
Browser (admin auth)
  └── Next.js 15 (admin gate)
        └── 7 panels (routed tabs)
              ├── Analytics Panel — platform-wide stats
              ├── Users Panel — user management, bans, verification
              ├── Content Panel — track management, R2 cleanup
              ├── Reports Panel — AI auto-research + moderator queue
              ├── Growth Panel — growth metrics and analytics
              ├── Risk Signals Panel — detection framework, behavioral scoring
              └── SIC Panel — AI Security Intelligence (LLM extended thinking)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| AI | LLM API (extended thinking) |
| Language | TypeScript |
| Streaming | Server-Sent Events — AI reports streamed progressively |

## Security Intelligence Center (SIC)

- **Real-time vulnerability scanning** via LLM with extended thinking — surfaces attack surface issues
- **Access control validation** — tests privilege escalation paths against live auth logic
- **Compliance reporting** — generates structured audit reports with remediation steps
- **Auto-research on content reports** — gathers context (user history, post content, similar reports) before moderator review
- **Risk scoring** — behavioral signals panel detects anomaly patterns in user activity

## Panel Overview

| Panel | Purpose |
|-------|---------|
| Analytics | Platform-wide stats, follower analytics, engagement trends |
| Users | User list, ban/unban, verify artist, full profile + R2 deletion |
| Content | Track management, admin delete with R2 + HLS cleanup |
| Reports | AI auto-researched moderation queue, status tracking |
| Growth | Growth metrics and period comparisons |
| Risk Signals | Detection framework, behavioral scoring (formerly Creator Scoring) |
| SIC | AI pentesting scanner — vulnerability analysis, access control tests, compliance reports |

## Key Engineering

- **Admin auth gate** with role-based panel access — no public routes
- **AI reports streamed progressively** via SSE — no waiting for full LLM generation
- **Embedded SIC scanner** architecture — see SIC repo for full tool list
- **Auto-research pipeline** — content reports trigger background LLM context gathering


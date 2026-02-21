# Roadmap (Phased)

Automation runner:
- `pnpm run roadmap:run`
- `docs/ROADMAP_AUTOMATION.md`

## Phase A — Foundation
Status: Done
- [x] Next.js App Router setup
- [x] Prisma schema + initial migration
- [x] Core API routes for run/status/report
- [x] Docker compose for local Postgres

## Phase B — Scanner MVP
Status: Done
- [x] Worker loop with lease/retry/backoff
- [x] URL normalization + SSRF guard + tests
- [x] HTML resource extraction
- [x] Findings v1 rules engine

## Phase C — Report UX + Summary JSON
Status: Done
- [x] `asdev.audit.summary.v1` builder
- [x] Persisted summary + findings
- [x] Public report page by token
- [x] Sample summary fixture for UI

## Phase D — Lead/Order Gating (Mock)
Status: Done
- [x] Unlock flow with email capture
- [x] Mock order creation + event logging
- [x] Reuse existing pending/paid order
- [x] Block unlock when report is not ready

## Phase E — Security and Ops Hardening
Status: In Progress
- [x] Rate limit on create-run endpoint
- [x] DNS rebinding guard in URL normalization
- [x] Error sanitization + no-store on sensitive APIs
- [x] request-id + structured API logs
- [ ] Distributed rate limit (Redis)
- [ ] Metrics/alerts dashboard

## Phase F — Monetization and Delivery
Status: Planned
- [ ] Real payment provider integration
- [ ] Paid PDF/report delivery endpoint
- [ ] Full order lifecycle callbacks

## Phase G — SEO Scale
Status: Planned
- [ ] Programmatic guides and pillar pages
- [ ] Multi-page/deeper crawl strategy
- [ ] Expanded SEO-focused findings

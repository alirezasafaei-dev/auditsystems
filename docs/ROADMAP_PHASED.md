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

## Phase D — Lead/Order Gating
Status: Done
- [x] Unlock flow with email capture
- [x] Order API endpoint (`/api/orders`)
- [x] Reuse existing pending/paid order
- [x] Block checkout when report is not ready

## Phase E — Security and Ops Hardening
Status: Done
- [x] Distributed-capable rate limit backend (Upstash Redis + fallback)
- [x] DNS rebinding guard in URL normalization
- [x] Error sanitization + no-store on sensitive APIs
- [x] request-id + structured API logs
- [x] Prometheus-style metrics endpoint (`/api/metrics`)

## Phase F — Monetization and Delivery
Status: Done
- [x] Payment callback route (`/api/payments/callback`)
- [x] Real provider integration layer (Zarinpal + provider abstraction)
- [x] Paid PDF/report delivery endpoint (`/api/pdf/[token]`)
- [x] Signed download token validation

## Phase G — SEO Scale
Status: Done
- [x] Programmatic guides index and dynamic guide pages
- [x] Pillar page for audit positioning
- [x] Sitemap and robots routes
- [x] Canonical/open graph metadata for guide pages

## Phase H — Excellence / Momtaz
Status: Done
- [x] Bilingual product routes (`/` + `/en/*`) for core flow and report flow
- [x] Locale-aware shell (`lang/dir/navigation/footer`) in unified layout
- [x] Multi-language SEO coverage (hreflang alternates + bilingual sitemap)
- [x] Edge security headers and liveness/readiness API model

## Phase I — SEO Execution Automation
Status: Done
- [x] Base URL governance helper (`src/lib/site.ts`) and metadata utilities (`src/lib/seoMeta.ts`)
- [x] Full metadata coverage for indexable templates (audit/sample/pillar/guides/home)
- [x] Noindex policy for tokenized report routes and failed pages
- [x] Localized guide content split (`fa/en`) + guide breadcrumbs/related links + article schema
- [x] Real sitemap freshness model (`updatedAt`) and stricter robots disallow rules
- [x] Automated SEO checks (`pnpm run seo:audit`) with artifacts in `logs/seo/`

## Phase J — Shared VPS Production Rollout
Status: Done
- [x] Roll out as independent app on shared VPS under brand subdomain: `audit.alirezasafaeisystems.ir`
- [x] Keep isolation by app/runtime (dedicated PM2 app names + dedicated env files + dedicated release directory)
- [x] Use existing deploy pattern (`ops/deploy/deploy.sh`) with production/staging ports (`3010`/`3011`)
- [x] Provision Nginx site + TLS cert for production/staging audit domains
- [x] Apply server hardening baseline: increase swap to `2G`, verify journald/log growth, keep release retention active
- [x] Complete production env + data readiness: `DATABASE_URL`, payment provider, redis rate-limit config, strict base URL
- [x] Execute go-live quality gates on target host:
  - [x] `pnpm run roadmap:run`
  - [x] `pnpm run seo:audit`
  - [x] readiness checks on public domain (`production/staging`)
- [x] Connect internal links from main brand site (`/fa` and `/en`) to audit product routes

# Project Analysis (Real Data Snapshot)

تاریخ تحلیل: 2026-02-23  
منبع: اجرای واقعی روی همین repository و artifactهای تولیدشده در `logs/*`

## Scope
- بررسی ساختار پروژه، مسیرها، فازها، و سلامت اتوماسیون
- اجرای quality gates و سنجش وضعیت SEO/Performance
- ثبت ریسک‌های باقی‌مانده برای production rollout

## Architecture Snapshot
- Framework: Next.js 15 (App Router) + TypeScript
- Data: Prisma + PostgreSQL
- Runtime pattern: Web app + DB-driven worker + API routes
- Payments: Provider abstraction (`MOCK`, `ZARINPAL`) + callback + PDF delivery
- SEO infra:
  - `src/lib/site.ts`
  - `src/lib/seoMeta.ts`
  - `src/app/sitemap.ts`
  - `src/app/robots.ts`
  - `src/scripts/seo-audit-automation.ts`

## Route Inventory (Measured)
- Page routes: `20`
- API routes: `10`
- Guide routes per locale: `10` slug (FA) + `10` slug (EN)

### Page Routes
- `/`
- `/audit`
- `/audit/r/[token]`
- `/audit/r/[token]/success`
- `/audit/r/[token]/unlock`
- `/en`
- `/en/audit`
- `/en/audit/r/[token]`
- `/en/audit/r/[token]/success`
- `/en/audit/r/[token]/unlock`
- `/en/failed`
- `/en/guides`
- `/en/guides/[slug]`
- `/en/pillar/iran-readiness-audit`
- `/en/sample-report`
- `/failed`
- `/guides`
- `/guides/[slug]`
- `/pillar/iran-readiness-audit`
- `/sample-report`

## Automation & Quality (Measured)
### Roadmap Gate
- Command: `pnpm run roadmap:run`
- Report: `logs/roadmap/last-run.json`
- Result:
  - `passed=25`
  - `failed=0`
  - `skipped=0`

### SEO Gate
- Command: `pnpm run seo:audit`
- Report: `logs/seo/last-run.json`
- Result: `passed=7`, `failed=0`

### Payment Preflight
- Command: `pnpm run payment:preflight:strict`
- Report: `logs/preflight/payment-preflight.json`
- Result:
  - provider: `MOCK`
  - `APP_BASE_URL=http://localhost:3000`
  - redis distributed limiter intentionally disabled (env not set)

### Payment Smoke
- Command: `pnpm run payment:zarinpal:smoke`
- Result: `[SKIP] ZARINPAL_MERCHANT_ID is not set.`

### Migration Check
- Command: `pnpm prisma migrate deploy`
- Result: `P1000` (DB auth failed for local `postgres` credentials at `localhost:5432`)

## Lighthouse (Local Lab, Measured)
- Command: `pnpm run lighthouse:local`
- Report: `logs/lighthouse/summary.json`
- Routes tested: `/`, `/audit`, `/guides`
- Exit status: all routes `code=0`

| Route | Performance | SEO | Accessibility | Best Practices | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---|---|---|---|
| `/` | 82 | 91 | 95 | 96 | 0.8s | 5.0s | 50ms | 0 |
| `/audit` | 82 | 91 | 96 | 96 | 0.8s | 5.0s | 60ms | 0 |
| `/guides` | 82 | 91 | 95 | 96 | 0.8s | 5.0s | 60ms | 0 |

## Live Deployment Snapshot (Measured)
- VPS: `185.3.124.93`
- Runtime: `Node v20.20.0`, `pnpm 9.15.0`, `nginx/1.18.0`, `PM2` with `pm2-deploy.service`
- PM2 apps online: `6` (portfolio/staging + persiantoolbox/staging + audit/staging)
- Port isolation: app runtimes روی `127.0.0.1:{3000,3001,3002,3003,3010,3011}`
- Public health:
  - `https://audit.alirezasafaeisystems.ir/api/ready` -> `200`
  - `https://staging.audit.alirezasafaeisystems.ir/api/ready` -> `200`
- TLS:
  - `audit.alirezasafaeisystems.ir` valid certificate
  - `staging.audit.alirezasafaeisystems.ir` valid certificate
- Server hardening:
  - swap ارتقا داده شد: `~2.1Gi`
  - logrotate برای logs هر سه پروژه فعال شد

## Current Phase Status
- Done: `A` تا `J`
- Planned: `none`
- Source of truth: `ops/roadmap/phases.json`

## Remaining Post-GoLive Tasks (Actionable)
1. Replace mock payment with live gateway credentials (`ZARINPAL_MERCHANT_ID`) and rerun `pnpm run payment:zarinpal:smoke`.
2. Enable distributed rate limiting in production (`UPSTASH_*`, `REQUIRE_DISTRIBUTED_RATE_LIMIT=true`) after credential provisioning.
3. Run production DB migration policy on server-side secrets context and archive migration evidence.

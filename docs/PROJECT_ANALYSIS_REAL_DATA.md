# Project Analysis (Real Data Snapshot)

تاریخ تحلیل: 2026-02-24 05:10 (+03:30)  
منبع: اجرای واقعی commandها روی repository و VPS production (`185.3.124.93`)

## Scope
- اعتبارسنجی فنی سه پروژه روی VPS مشترک: `asdev-portfolio`, `asdev-persiantoolbox`, `asdev-audit-ir`
- اجرای gateهای خودکار داخل `asdev-audit-ir`
- بررسی دسترسی عمومی دامنه‌ها، TLS، redirect، locale پیش‌فرض و ظرفیت سرور

## Architecture Snapshot
- Framework: Next.js 15 (App Router) + TypeScript
- Data: Prisma + PostgreSQL
- Runtime pattern: Nginx reverse proxy + PM2 processes + loopback ports
- Payments: provider abstraction (`MOCK`, `ZARINPAL`) + callback + PDF delivery
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

## Automation & Quality (Measured)
### `docs:refresh` run
- Command: `pnpm run docs:refresh`
- Timestamp: 2026-02-23T20:05Z
- Output: `docs/AUTO_GENERATED_STATUS.md` + `logs/roadmap/last-run.{json,md}`

### Roadmap Gate
- Command: `pnpm run roadmap:run`
- Result:
  - `passed=25`
  - `failed=0`
  - `skipped=0`

### SEO Gate
- Command: `pnpm run seo:audit`
- Result: `passed=7`, `failed=0`

### Quality Gate
- Command: `pnpm run check`
- Result: success (`lint`, `typecheck`, `test`, `build`)

### Test Snapshot
- Vitest: `6` files, `30` tests, all passed
- Build output: all app routes compiled successfully (dynamic + static + SSG)

## VPS Capacity Snapshot (Measured)
| Metric | Value | Assessment |
|---|---|---|
| CPU | 4 vCPU (`Intel Xeon E5-2680 v4`) | کافی برای 3 سرویس Next.js |
| RAM | 7.8Gi total / ~948Mi used / ~6.5Gi available | ظرفیت مناسب |
| Swap | 2.1Gi total / ~7Mi used | baseline hardening فعال |
| Disk | 59G total / 18G used / 39G free | ظرفیت مناسب |
| Load Avg | `0.10 / 0.44 / 0.69` | فشار پایین |

## PM2 Runtime Snapshot (Measured)
- Total online apps: `6`
- Production:
  - `my-portfolio-production` (~109MB)
  - `persian-tools-production` (~94MB)
  - `asdev-audit-ir-production` (~93MB)
- Staging:
  - `my-portfolio-staging` (~97MB)
  - `persian-tools-staging` (~95MB)
  - `asdev-audit-ir-staging` (~93MB)
- Port isolation: `127.0.0.1:{3000,3001,3002,3003,3010,3011}`

## Public Live Verification (Measured)
### Domain/HTTPS/Redirect
- `http://alirezasafaeisystems.ir` -> `301` to HTTPS
- `http://persiantoolbox.ir` -> `301` to HTTPS
- `http://audit.alirezasafaeisystems.ir` -> `301` to HTTPS
- `https://www.alirezasafaeisystems.ir` -> `301` to apex
- TLS valid on all three domains

### Health Endpoints (GET-based)
- `https://alirezasafaeisystems.ir/api/ready` -> `200`
- `https://audit.alirezasafaeisystems.ir/api/ready` -> `200`
- `https://staging.audit.alirezasafaeisystems.ir/api/ready` -> `200`

### Locale Default Verification
- `https://alirezasafaeisystems.ir/` -> `307` to `/fa` + `lang=fa`
- `https://persiantoolbox.ir/` -> `200` + `ptb_locale=fa`
- `https://audit.alirezasafaeisystems.ir/` -> `lang="fa"` / `dir="rtl"` on root

## Important Diagnostic Note
- از محیط local فعلی، `audit.alirezasafaeisystems.ir` و `staging.audit...` timeout مشاهده می‌شود.
- راستی‌آزمایی authoritative از داخل VPS انجام شد و هر دو endpoint با `GET/HEAD=200/200` تایید شدند.
- این اختلاف مسیر شبکه/egress محیط local است، نه failure خود سرویس.

## Current Phase Status
- Done: `A` تا `J`
- Planned: `none`
- Source of truth: `ops/roadmap/phases.json`

## Post-GoLive Tasks (Updated — 2026-02-24)
1. `ZARINPAL_MERCHANT_ID`:
   - وضعیت: **Incomplete**
   - شواهد: `pnpm run payment:zarinpal:smoke` روی production با خروجی `[SKIP] ZARINPAL_MERCHANT_ID is not set.`
   - علت: در shared env مقدار فعلی `ZARINPAL_MERCHANT_ID=""` است.
2. distributed rate limit:
   - وضعیت: **Operational with DB fallback**
   - شواهد: `POST /api/audit/runs` روی production/staging -> `200 QUEUED`
   - تحلیل: در نبود `UPSTASH_*` واقعی، fallback دیتابیس فعال است و سرویس fail-open کنترل‌شده دارد.
3. readiness parity + baseline:
   - وضعیت: **Complete**
   - شواهد:
     - `GET/HEAD` parity روی چهار endpoint (`portfolio/persian/audit-prod/audit-staging`) = `200/200`
     - `pnpm run network:baseline` روی VPS -> PASS
     - artifact: `logs/runtime/asdev-network-baseline.json`

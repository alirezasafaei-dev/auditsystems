# SEO Audit (Repo-Backed, Real Data) — Updated

تاریخ snapshot: 2026-02-23 (latest run set at `16:05Z` تا `16:08Z`)

## Real Coverage Snapshot
- Page routes: `20`
- EN page routes: `10`
- API routes: `10`
- Guide slugs: `10`
- Templates with metadata/generateMetadata: `14`
- Sitemap URLs: `30` (10 static localized pairs + 20 guides localized pairs)
- SEO automation status: `passed=7 / failed=0` (`logs/seo/last-run.json`)
- Roadmap gate status: `passed=25 / failed=0 / skipped=0` (`logs/roadmap/last-run.json`)

## Stack & SEO Infra
- Next.js App Router + TypeScript
- SEO config files:
  - `src/app/layout.tsx`
  - `src/app/sitemap.ts`
  - `src/app/robots.ts`
  - `src/lib/site.ts`
  - `src/lib/seoMeta.ts`
  - `src/scripts/seo-audit-automation.ts`

## Implemented Upgrades (Executed)
1. Canonical/Base URL Governance
- `APP_BASE_URL` centralized via `src/lib/site.ts`
- strict production mode via `APP_BASE_URL_STRICT=true`
- localhost fallback pattern removed from app source

2. Indexation Control
- tokenized report tree (`/audit/r/[token]` and `/en/audit/r/[token]`) is non-indexable via route layouts
- failed pages are non-indexable
- robots disallow covers `/api/`, `/audit/r/`, `/en/audit/r/`

3. Sitemap/Robots Quality
- sitemap uses real guide freshness (`updatedAt`) from content source
- sitemap includes locale alternates (`fa-IR`, `en`, `x-default`)
- robots includes `host` and sitemap pointer

4. On-Page & IA
- metadata coverage expanded to all indexable templates
- guide detail pages now include:
  - breadcrumb navigation
  - related guides
  - `BreadcrumbList` + `Article` schema

5. Content Localization
- guides are truly localized by locale (`fa/en`) in `src/content/guides.ts`
- FA pages no longer render English-only guide copy

6. Measurement Foundation
- GA4 bootstrap (env-gated) added in `src/app/layout.tsx`
- consent-aware SEO event tracking added (`src/lib/analytics.ts`)
- SEO events wired in landing, guides, audit, unlock, success flows

## Local Lighthouse Snapshot (Measured)
- command: `pnpm run lighthouse:local`
- artifact: `logs/lighthouse/summary.json`
- tested routes: `/`, `/audit`, `/guides` (all `code=0`)

| Route | Performance | SEO | Accessibility | Best Practices | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---|---|---|---|
| `/` | 82 | 91 | 95 | 96 | 0.8s | 5.0s | 50ms | 0 |
| `/audit` | 82 | 91 | 96 | 96 | 0.8s | 5.0s | 60ms | 0 |
| `/guides` | 82 | 91 | 95 | 96 | 0.8s | 5.0s | 60ms | 0 |

## Live URL Verification
- `https://audit.alirezasafaeisystems.ir/api/ready` -> `200` (ready)
- `https://staging.audit.alirezasafaeisystems.ir/api/ready` -> `200` (ready)
- TLS certificates for both production/staging audit domains are valid on server.

## Current Residual Risks
- GA4 event pipeline نیازمند مقدار واقعی `NEXT_PUBLIC_GA4_MEASUREMENT_ID` در production است.
- SEO event dispatch consent-gated است و بدون مقدار `localStorage["asdev_analytics_consent"]="granted"` ارسال نمی‌شود.
- LCP محلی برای صفحات اصلی روی `5.0s` است و برای بهینه‌سازی phase بعدی باید روی تصاویر/critical path تمرکز شود.

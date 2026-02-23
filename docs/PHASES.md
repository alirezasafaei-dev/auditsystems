# Execution Phases

این سند acceptance criteria هر فاز را مشخص می‌کند.

## Phase A — Foundation (Done)
- `POST /api/audit/runs` کار می‌کند.
- `AuditRun` و `ReportShare.token` ذخیره می‌شوند.
- صفحه گزارش token-based قابل مشاهده است.

## Phase B — Scanner MVP (Done)
- Worker job را lease و اجرا می‌کند.
- URL normalization + SSRF guard فعال است.
- resource extraction از HTML انجام می‌شود.

## Phase C — Findings + Summary (Done)
- findings با code/severity/recommendation/evidence ذخیره می‌شود.
- summary نسخه‌بندی‌شده `asdev.audit.summary.v1` تولید می‌شود.
- endpoint گزارش summary/findings را ارائه می‌دهد.

## Phase D — Unlock Funnel (Done)
- capture ایمیل در unlock انجام می‌شود.
- mock order و event ثبت می‌شود.
- unlock برای گزارش آماده‌نشده رد می‌شود.

## Phase E — Security/Ops Hardening (Done)
- rate limit روی create run
- error sanitization
- request-id و structured logs
- no-store برای APIهای حساس
- `/api/metrics` برای observability

## Phase F — Monetization (Done)
- payment provider واقعی (Zarinpal abstraction)
- callback handling
- download flow برای گزارش paid

## Phase G — SEO Scale (Done)
- guide content pipeline
- crawl depth expansion baseline
- findings پیشرفته‌تر SEO baseline
- sitemap/robots/canonical

## Phase H — Excellence / Momtaz (Done)
- دو‌زبانه‌سازی مسیرهای اصلی (`fa/en`) با UX هم‌راستا
- SEO چندزبانه (canonical + hreflang + sitemap bilingual)
- hardening لایه edge + health probes (`/api/live`, `/api/ready`)

## Phase I — SEO Execution Automation (Done)
- metadata کامل برای templateهای indexable
- noindex برای مسیرهای tokenized و failed
- localization واقعی راهنماها در `fa/en`
- breadcrumb/article schema برای guide templates
- `sitemap.xml` با `lastmod` واقعی بر پایه داده محتوا
- اتوماسیون SEO checks با `pnpm run seo:audit`

## Phase J — Shared VPS Production Rollout (Planned)
- اپ روی ساب‌دامین مستقل برند (`audit.alirezasafaeisystems.ir`) بدون تداخل با سایت‌های فعلی publish شود.
- health checks عمومی برقرار باشند: `GET /api/live` و `GET /api/ready` با وضعیت 200.
- TLS معتبر و redirect کامل HTTP->HTTPS برای دامنه جدید فعال باشد.
- env production کامل و معتبر باشد (`APP_BASE_URL_STRICT=true`, payment/redis/database secrets).
- migration واقعی دیتابیس با `pnpm prisma migrate deploy` روی production DB موفق شود.
- release/rollback عملی با اسکریپت‌های `ops/deploy/*` قابل اجرا و قابل بازگشت باشد.
- لینک‌دهی داخلی از سایت اصلی به مسیرهای audit در `fa/en` اضافه و verify شود.

# Execution 1-10 (Operational Completion)

این سند اجرای عملی ۱۰ مورد نهایی را بدون deploy روی سرور واقعی پوشش می‌دهد.

## Scope Guard
- Deploy واقعی تا زمان تایید کارفرما انجام نمی‌شود.
- تمام اقدامات این سند روی repo/CI/local environment هستند.

## 1) Docs Consistency
- [x] `docs/PHASES.md` با `docs/ROADMAP_PHASED.md` همگام شد.

## 2) Production Env Baseline
- [x] متغیرهای حیاتی در `.env.example` و preflight تعریف شده‌اند.
- [x] راهنمای env عملیاتی در `docs/PRODUCTION_ENV.md` افزوده شد.

## 3) Strict Preflight
- [x] فرمان: `pnpm run payment:preflight:strict`
- خروجی: `logs/preflight/payment-preflight.json`

## 4) Payment Smoke
- [x] فرمان: `pnpm run payment:zarinpal:smoke`
- خروجی: `logs/preflight/zarinpal-smoke.json` یا `SKIP` در نبود merchant.

## 5) Production Migration
- [~] فرمان: `pnpm prisma migrate deploy`
- وضعیت فعلی: روی محیط فعلی به دلیل credential نامعتبر DB fail شد (`P1000`).
- اقدام انجام‌شده: مسیر no-docker deployment با Postgres سیستم/سرور مستندسازی شد.

## 6) Runtime Serviceization
- [x] systemd unit files اضافه شد.
- [x] pm2 ecosystem اضافه شد.
- [x] release-based deploy/rollback scripts (بدون Docker) اضافه شد.

## 7) Monitoring + Alerts
- [x] Prometheus scrape + alert rules اضافه شد.

## 8) CI/CD Hard Gate
- [x] workflow readiness برای main/pull_request/schedule فعال شد.
- [x] gate اصلی: `pnpm run automation:run`

## 9) Lighthouse Final Check
- [x] اسکریپت اجرای Lighthouse local + artifact generation اضافه شد.

## 10) Release + Rollback
- [x] `CHANGELOG.md` ایجاد شد.
- [x] `docs/RELEASE_RUNBOOK.md` و `docs/ROLLBACK_RUNBOOK.md` ایجاد شد.
- [x] Git tag release ایجاد و push شد.

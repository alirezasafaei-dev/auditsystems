# Shared VPS Production Roadmap (No Timeline)

این سند تصمیم اجرایی برای استقرار `asdev-audit-ir` روی همان VPS فعلی را ثبت می‌کند.

## Deployment Decision
- الگوی هدف: اپ مستقل روی زیرساخت مشترک
- دامنه پیشنهادی production: `audit.alirezasafaeisystems.ir`
- دامنه پیشنهادی staging: `staging.audit.alirezasafaeisystems.ir`
- اصل طراحی: shared host, isolated runtime (PM2/env/releases/logs)

## Infrastructure Snapshot (Measured: 2026-02-23)
| Area | Current State | Outcome |
|---|---|---|
| CPU | 4 vCPU | کافی برای اضافه‌شدن یک Next.js service دیگر |
| RAM | 7.8Gi total, ~749Mi used, ~6.7Gi available | ظرفیت مناسب |
| Swap | 128MB (used ~6.8MB) | برای پایداری build/restart باید به 2GB افزایش یابد |
| Disk | 59G total, 42G free | ظرفیت مناسب |
| Load Avg | 0.58 / 0.13 / 0.04 | فشار پایین |
| Running Node Apps | 4 PM2 apps (2 production + 2 staging) | قابل توسعه |
| Bound App Ports | 3000, 3001, 3002, 3003 | بدون تداخل با 3010/3011 |
| DB Engine | PostgreSQL 14 | سازگار با پروژه |
| Existing release footprint | `/var/www/my-portfolio/releases` ≈ 2.9G, `/var/www/persian-tools/releases` ≈ 3.2G | نیازمند retention monitoring |

## Work Packages

### 1) Host Hardening Baseline
- افزایش swap از 128MB به 2GB.
- بازبینی growth لاگ‌ها و حفظ release retention.
- تایید باقی‌ماندن فضای آزاد دیسک بالاتر از 30%.

### 2) Isolated Runtime Setup
- استفاده از مسیر استاندارد: `/var/www/asdev-audit-ir`.
- env fileها:
  - `/var/www/asdev-audit-ir/shared/env/production.env`
  - `/var/www/asdev-audit-ir/shared/env/staging.env`
- PM2 app names:
  - `asdev-audit-ir-production`
  - `asdev-audit-ir-staging`

### 3) Nginx + TLS
- site config با template موجود `ops/nginx/asdev-audit-ir.conf`.
- production/staging روی پورت‌های `3010` و `3011`.
- صدور SSL و enforce کردن redirect کامل HTTP->HTTPS.

### 4) Production Data/Env Readiness
- تکمیل envهای حیاتی: `DATABASE_URL`, `APP_BASE_URL`, `APP_BASE_URL_STRICT=true`, payment, redis, secrets.
- اجرای:
  - `pnpm run payment:preflight:strict`
  - `pnpm prisma migrate deploy`
  - `pnpm run automation:run`

### 5) Go-Live Quality Gates
- سرویس باید روی `GET /api/live` و `GET /api/ready` پاسخ 200 بدهد.
- `sitemap.xml` و `robots.txt` روی دامنه production معتبر باشند.
- callback پرداخت روی production domain endpoint verify شود.

### 6) Main-Site Integration
- لینک داخلی از `alirezasafaeisystems.ir/fa` و `alirezasafaeisystems.ir/en` به audit app اضافه شود.
- anchor text و placement به‌صورت conversion-oriented تنظیم شود.

## Entry Criteria
- دسترسی DNS برای رکوردهای production/staging ساب‌دامین
- دسترسی sudo روی VPS
- دسترسی دیتابیس production معتبر
- merchant/payment credential معتبر

## Acceptance Criteria
- اپ production روی ساب‌دامین جدید در دسترس باشد.
- rollback با `ops/deploy/rollback.sh --env production` عملی و تست‌شده باشد.
- خطای بحرانی health/readiness وجود نداشته باشد.
- preflight و automation gate روی target host بدون failure کامل شوند.

## Risk Notes
- ریسک اصلی کوتاه‌مدت: swap پایین فعلی (128MB) در زمان build/restart هم‌زمان.
- ریسک عملیاتی: رشد release folders در `/var/www/*/releases` بدون retention صحیح.
- ریسک SEO: راه‌اندازی دامنه بدون لینک‌دهی داخلی کافی از سایت اصلی.

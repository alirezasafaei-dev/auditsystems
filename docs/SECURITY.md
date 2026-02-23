# SECURITY

## Secrets Policy
- هیچ secret واقعی نباید commit شود.
- فقط از `.env.example` برای نمونه متغیرها استفاده شود.
- فایل‌های `.env` محلی باید خارج از Git بمانند.

## Reporting
- امنیت/افشای مسئولانه از طریق Issue خصوصی یا کانال داخلی تیم انجام شود.
- برای رخدادهای عملیاتی، جزئیات بازتولید و impact ثبت شود.

## Dependency Audit Commands
```bash
pnpm run check
pnpm run payment:preflight:strict
pnpm run lighthouse:local
```

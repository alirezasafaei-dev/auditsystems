# asdev-audit-ir

سرویس Audit برای بررسی آماده‌بودن سایت (Performance / SEO / Security / Resilience) با گزارش قابل اشتراک، Worker صف، و جریان Unlock (lead/order).

## Stack
- Next.js App Router + TypeScript
- Prisma + PostgreSQL
- Worker اختصاصی با queue در DB
- Vitest + ESLint
- Bilingual product surface (`fa/en`) with RTL/LTR support

## Quick Start
1. نصب وابستگی‌ها:
```bash
pnpm install
```
2. تنظیم env:
```bash
cp .env.example .env
```
3. اجرای دیتابیس PostgreSQL (بدون Docker) و تنظیم `DATABASE_URL` معتبر در `.env`.
4. مایگریشن و Prisma Client:
```bash
pnpm run db:migrate
pnpm prisma generate
```
5. اجرای وب:
```bash
pnpm run dev
```
6. اجرای Worker (ترمینال جدا):
```bash
pnpm run worker:dev
```

## Quality Gate
```bash
pnpm run check
```
این دستور `lint + typecheck + test + build` را کامل اجرا می‌کند.

## Roadmap Automation
```bash
pnpm run roadmap:run
pnpm run seo:audit
```
گزارش اجرای فازها در `logs/roadmap/last-run.md` و `logs/roadmap/last-run.json` تولید می‌شود.
گزارش اتوماسیون SEO در `logs/seo/last-run.md` و `logs/seo/last-run.json` تولید می‌شود.

## Docs Automation
```bash
pnpm run docs:generate
```
گزارش خودکار مستندات در `docs/AUTO_GENERATED_STATUS.md` تولید می‌شود.

## Production Readiness Automation
```bash
pnpm run payment:preflight
pnpm run payment:zarinpal:smoke
pnpm run automation:run
pnpm run lighthouse:local
```
- `payment:preflight`: بررسی آماده‌بودن env/redis/provider پرداخت
- `payment:zarinpal:smoke`: تست واقعی اتصال request/verify به Zarinpal (با merchant id)
- `automation:run`: اجرای یکپارچه quality + roadmap + docs + preflight
- `lighthouse:local`: اجرای Lighthouse روی مسیرهای اصلی (`/`, `/audit`, `/guides`) و تولید artifact در `logs/lighthouse`

## Deployment Guard
- Deploy روی سرور واقعی نیازمند تایید مستقیم است.
- برای آماده‌سازی runtime از فایل‌های `ops/systemd/*` و `ops/pm2/ecosystem.config.cjs` استفاده کنید.
- الگوی رسمی no-docker deploy: `docs/DEPLOYMENT_NO_DOCKER.md`
- health endpoints:
  - `GET /api/live` for liveness
  - `GET /api/ready` for dependency-aware readiness (`200/503`)

## Momtaz Phase
- فاز ممتاز (`Phase H`) تکمیل شده است:
  - UI/UX دوزبانه
  - SEO چندزبانه
  - security hardening + readiness model
- مرجع: `docs/PHASE_EXCELLENCE.md`, `docs/ROADMAP_MOMTAZ.md`

## Environment Variables
- `DATABASE_URL`
- `AUDIT_DNS_GUARD`
- `WORKER_POLL_MS`
- `WORKER_JOB_TIMEOUT_MS`
- `IP_HASH_SALT`
- `APP_BASE_URL`
- `APP_BASE_URL_STRICT`
- `NEXT_PUBLIC_GA4_MEASUREMENT_ID`

## Documentation
- ایندکس مستندات: `docs/README.md`
- مسیرهای API و صفحات: `docs/ROUTES_NEXTJS.md`
- امنیت SSRF و Hardening: `docs/SECURITY_SSRF.md`
- راهنمای Worker: `docs/WORKER_RUNBOOK.md`
- فازها و نقشه راه: `docs/PHASES.md`, `docs/ROADMAP_PHASED.md`
- تحلیل واقعی وضعیت پروژه: `docs/PROJECT_ANALYSIS_REAL_DATA.md`
- اتوماسیون roadmap: `docs/ROADMAP_AUTOMATION.md`
- گزارش خودکار وضعیت: `docs/AUTO_GENERATED_STATUS.md`
- نقش‌ها و مهارت‌ها: `docs/ROLES_AND_SKILLS_SETUP.md`
- env پروداکشن: `docs/PRODUCTION_ENV.md`
- اجرای ۱ تا ۱۰: `docs/EXECUTION_1_TO_10.md`
- release: `docs/RELEASE_RUNBOOK.md`
- rollback: `docs/ROLLBACK_RUNBOOK.md`
- دیپلوی بدون Docker: `docs/DEPLOYMENT_NO_DOCKER.md`

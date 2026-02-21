# asdev-audit-ir

سرویس Audit برای بررسی آماده‌بودن سایت (Performance / SEO / Security / Resilience) با گزارش قابل اشتراک، Worker صف، و جریان Unlock (lead/order).

## Stack
- Next.js App Router + TypeScript
- Prisma + PostgreSQL
- Worker اختصاصی با queue در DB
- Vitest + ESLint

## Quick Start
1. نصب وابستگی‌ها:
```bash
pnpm install
```
2. تنظیم env:
```bash
cp .env.example .env
```
3. اجرای دیتابیس (در صورت استفاده از docker):
```bash
docker compose up -d
```
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
```
گزارش اجرای فازها در `logs/roadmap/last-run.md` و `logs/roadmap/last-run.json` تولید می‌شود.

## Environment Variables
- `DATABASE_URL`
- `AUDIT_DNS_GUARD`
- `WORKER_POLL_MS`
- `WORKER_JOB_TIMEOUT_MS`
- `IP_HASH_SALT`

## Documentation
- ایندکس مستندات: `docs/README.md`
- مسیرهای API و صفحات: `docs/ROUTES_NEXTJS.md`
- امنیت SSRF و Hardening: `docs/SECURITY_SSRF.md`
- راهنمای Worker: `docs/WORKER_RUNBOOK.md`
- فازها و نقشه راه: `docs/PHASES.md`, `docs/ROADMAP_PHASED.md`
- اتوماسیون roadmap: `docs/ROADMAP_AUTOMATION.md`
- نقش‌ها و مهارت‌ها: `docs/ROLES_AND_SKILLS_SETUP.md`

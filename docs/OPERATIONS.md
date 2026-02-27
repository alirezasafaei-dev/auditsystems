# OPERATIONS

## Run Locally
```bash
pnpm install
cp .env.example .env
pnpm run db:migrate
pnpm run dev
pnpm run worker:dev
```

## Build
```bash
pnpm run build
pnpm run start
```

## Health Checks
- `GET /api/live`
- `GET /api/ready`

## Quality/Release Gates
```bash
pnpm run check
pnpm run payment:preflight
pnpm run payment:zarinpal:smoke
pnpm run automation:run
pnpm run deploy:check:hosting
```

## Shared VPS Anti-Conflict Check
- این چک برای جلوگیری از تداخل پورت/دامنه/سرویس در shared VPS است.
- اجرای strict (پیشنهادی قبل از deploy):
```bash
pnpm run deploy:check:hosting
```
- اجرای همراه با SSH روی خود VPS:
```bash
bash scripts/deploy/check-hosting-sync.sh \
  --strict \
  --ssh-target deploy@185.3.124.93 \
  --ssh-key /home/dev/.ssh/id_ed25519
```

## Full Readiness Automation
- برای مدیریت کارهای تکراری قبل از deploy:
```bash
pnpm run deploy:readiness
```
- اجرای کامل همراه با راستی‌آزمایی VPS و تولید گزارش:
```bash
bash scripts/deploy/run-readiness-suite.sh \
  --strict \
  --with-ssh \
  --ssh-target deploy@185.3.124.93 \
  --ssh-key /home/dev/.ssh/id_ed25519
```
- خروجی‌ها:
  - `logs/deploy/last-readiness.md`
  - `logs/deploy/last-readiness.json`

## Troubleshooting
- اگر `db:migrate` شکست خورد: مقدار `DATABASE_URL` را بررسی کنید.
- اگر Worker کار نمی‌کند: `WORKER_POLL_MS` و `WORKER_JOB_TIMEOUT_MS` را از `.env` بررسی کنید.
- اگر readiness fail شد: خروجی `GET /api/ready` و لاگ‌های roadmap/SEO در `logs/` را چک کنید.

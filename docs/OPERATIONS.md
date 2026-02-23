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
```

## Troubleshooting
- اگر `db:migrate` شکست خورد: مقدار `DATABASE_URL` را بررسی کنید.
- اگر Worker کار نمی‌کند: `WORKER_POLL_MS` و `WORKER_JOB_TIMEOUT_MS` را از `.env` بررسی کنید.
- اگر readiness fail شد: خروجی `GET /api/ready` و لاگ‌های roadmap/SEO در `logs/` را چک کنید.

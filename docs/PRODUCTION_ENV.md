# Production Environment Baseline

این راهنما فقط برای آماده‌سازی است و deploy واقعی نیازمند تایید جداگانه است.

## Required Variables
- `DATABASE_URL`: production postgres URL
- `APP_BASE_URL`: public https domain
- `IP_HASH_SALT`: random secret (>=32 chars)
- `DOWNLOAD_TOKEN_SECRET`: random secret (>=32 chars)
- `PAYMENT_PROVIDER_DEFAULT`: `ZARINPAL` یا provider مورد تایید
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `REQUIRE_DISTRIBUTED_RATE_LIMIT=true`
- `ZARINPAL_MERCHANT_ID` (when provider=ZARINPAL)

## Validation Commands
```bash
pnpm run payment:preflight:strict
pnpm run payment:zarinpal:smoke
```

## Notes
- برای smoke واقعی، `APP_BASE_URL` باید publicly reachable باشد.
- اگر merchant فعال نیست، smoke با `SKIP` ثبت می‌شود.

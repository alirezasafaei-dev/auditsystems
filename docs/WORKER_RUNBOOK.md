# Worker Runbook

## Purpose
Worker مسئول مصرف صف `Job` و اجرای audit برای `AUDIT_RUN` است.

## Job Type
- `AUDIT_RUN`

## Payload
```json
{ "runId": "..." }
```

## Runtime Flow
1. lease job با `FOR UPDATE SKIP LOCKED`
2. load run از DB
3. normalize URL + SSRF checks
4. `AuditRun.status = RUNNING`
5. fetch HTML + headers
6. extract resources + evaluate findings
7. build summary v1
8. persist resources/findings/summary
9. `SUCCEEDED` یا `FAILED`

## Commands
اجرای Worker:
```bash
pnpm run worker:dev
```

نمونه enqueue:
```bash
pnpm run jobs:enqueue:sample
```

## Environment
- `WORKER_POLL_MS` (default: `1200`)
- `WORKER_JOB_TIMEOUT_MS` (default: `45000`)
- `AUDIT_DNS_GUARD` (default: `true`)

## Retry and Lease
- `maxAttempts` پیش‌فرض: 3
- backoff نمایی تا سقف 60 ثانیه
- lease منقضی‌شده recycle می‌شود و دوباره queue می‌شود

## Failure Handling
- خطا در `AuditRun.errorCode/errorMessage` ثبت می‌شود.
- job تا قبل از `maxAttempts` retry می‌شود.
- بعد از سقف retry، status job به `FAILED` می‌رود.

## Key Files
- `src/worker/index.ts`
- `src/worker/queue.ts`
- `src/worker/audit.handler.ts`

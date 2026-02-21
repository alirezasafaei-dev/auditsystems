# Worker Runbook — Audit

## Job Type
- `AUDIT_RUN`

## Payload
```json
{ "runId": "..." }
```

## مراحل اجرا در handler
1) load run از DB
2) normalize URL (با SSRF guard)
3) status = RUNNING
4) fetch HTML + headers
5) extract resources
6) evaluate 10 rules → findings
7) build summary v1 → ذخیره در run
8) status = SUCCEEDED یا FAILED

## فایل‌های کد
- `src/worker/audit.handler.ts`
- `src/lib/normalizeAuditTargetUrl.ts`
- `src/lib/extractResources.ts`
- `src/lib/rules.ts`
- `src/lib/summary.ts`

## نکات
- Lighthouse را در child process اجرا کنید تا قابل kill باشد.
- اگر Lighthouse timeout خورد، run را شکست ندهید؛ فقط scoreها را خالی بگذارید.


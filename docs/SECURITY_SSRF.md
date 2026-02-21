# Security and SSRF

Audit یک سرویس fetch-external-url است؛ بنابراین SSRF و abuse-control مهم‌ترین ریسک‌ها هستند.

## Implemented Controls

### URL Normalization and Guardrails
- فقط `http/https` مجاز است.
- hostهای `localhost`, `.local`, `.internal`, `.lan`, `.home` بلوک می‌شوند.
- IPهای private/reserved (IPv4/IPv6) بلوک می‌شوند.
- credential در URL حذف می‌شود (`user:pass@`).
- fragment حذف می‌شود.
- max length کنترل می‌شود.
- tracking query params حذف می‌شوند (`utm_*`, `gclid`, ...).
- DNS check برای private resolution فعال است (DNS rebinding guard).

مرجع کد: `src/lib/normalizeAuditTargetUrl.ts`

### API Abuse Controls
- Rate limit روی `POST /api/audit/runs`: 5 درخواست در 10 دقیقه برای هر `ipHash`.
- Hash برای IP با salt (`IP_HASH_SALT`) ذخیره می‌شود.
- خطاهای داخلی sanitize می‌شوند تا نشت جزئیات اتفاق نیفتد.

مرجع کد:
- `src/app/api/audit/runs/route.ts`
- `src/lib/security.ts`

### Token Access Controls
- token گزارش اگر `revoked` یا `expired` باشد، دسترسی رد می‌شود.
- در unlock، اگر گزارش هنوز `SUCCEEDED` نباشد، `REPORT_NOT_READY` برمی‌گردد.

مرجع کد:
- `src/lib/reportShare.ts`
- `src/app/api/reports/[token]/route.ts`
- `src/app/api/reports/[token]/unlock/route.ts`

### Response Safety
- برای APIهای حساس: `Cache-Control: no-store`
- برای trace: `x-request-id`

## Recommended Next Hardening
- Rate limiting توزیع‌شده (Redis) برای چند instance.
- re-check روی redirect hops به‌صورت مستقل.
- allowlist اختیاری domain در حالت enterprise.
- security monitoring dashboard (error-rate + suspicious patterns).

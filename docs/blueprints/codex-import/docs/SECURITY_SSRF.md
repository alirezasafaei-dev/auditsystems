# امنیت و SSRF — Audit

Audit یک سرویس "fetch external URL" است؛ بنابراین SSRF مهم‌ترین ریسک امنیتی شماست.

## Guardrails پیشنهادی (MVP)
- allowlist protocol: فقط http/https
- block: localhost, *.local, *.internal, *.lan, *.home
- block: IPهای private/reserved (IPv4 + IPv6)
- block: پورت‌های غیر 80/443
- strip credentials (user:pass@)
- strip fragments
- max URL length

## Hardening توصیه‌شده
- DNS lookup و رد hostnameهایی که به IP خصوصی resolve می‌شوند (DNS rebinding)
- re-check SSRF برای هر redirect hop
- rate limit روی endpoint `POST /api/audit/runs`
- limit concurrency worker

## پیاده‌سازی آماده
- `src/lib/normalizeAuditTargetUrl.ts`

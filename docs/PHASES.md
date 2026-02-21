# Execution Phases

این سند acceptance criteria هر فاز را مشخص می‌کند.

## Phase A — Foundation (Done)
- `POST /api/audit/runs` کار می‌کند.
- `AuditRun` و `ReportShare.token` ذخیره می‌شوند.
- صفحه گزارش token-based قابل مشاهده است.

## Phase B — Scanner MVP (Done)
- Worker job را lease و اجرا می‌کند.
- URL normalization + SSRF guard فعال است.
- resource extraction از HTML انجام می‌شود.

## Phase C — Findings + Summary (Done)
- findings با code/severity/recommendation/evidence ذخیره می‌شود.
- summary نسخه‌بندی‌شده `asdev.audit.summary.v1` تولید می‌شود.
- endpoint گزارش summary/findings را ارائه می‌دهد.

## Phase D — Unlock Funnel (Done)
- capture ایمیل در unlock انجام می‌شود.
- mock order و event ثبت می‌شود.
- unlock برای گزارش آماده‌نشده رد می‌شود.

## Phase E — Security/Ops Hardening (In Progress)
- rate limit روی create run
- error sanitization
- request-id و structured logs
- no-store برای APIهای حساس

## Phase F — Monetization (Planned)
- payment provider واقعی
- callback handling
- download flow برای گزارش paid

## Phase G — SEO Scale (Planned)
- guide content pipeline
- crawl depth expansion
- findings پیشرفته‌تر SEO

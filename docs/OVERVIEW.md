# Iran Readiness Audit — Overview

## Product Goal
- تولید گزارش فنی قابل اشتراک برای سایت
- نمایش سریع نقاط ضعف Performance/SEO/Security/Resilience
- تبدیل گزارش به lead/order از طریق unlock funnel

## Current Architecture
- Web: Next.js App Router
- DB: PostgreSQL + Prisma
- Worker: loop اختصاصی برای queue و اجرای audit
- Report Model: summary نسخه‌بندی‌شده (`asdev.audit.summary.v1`)

## Main Flow
1. کاربر URL را در `/audit` ثبت می‌کند.
2. API یک `AuditRun` و `ReportShare.token` می‌سازد.
3. Job در queue ثبت می‌شود.
4. Worker run را اجرا می‌کند و findings/summary ذخیره می‌کند.
5. گزارش از مسیر `/audit/r/[token]` نمایش داده می‌شود.
6. کاربر در unlock ایمیل می‌دهد و order mock ساخته می‌شود.

## Design Principles
- قرارداد خروجی پایدار (summary versioned)
- fail-safe execution (run state + error persistence)
- امنیت پیش‌فرض برای external fetch (SSRF guard + rate limit)
- observability پایه با request-id و structured logs

# Iran Readiness Audit — مستند فنی اجرایی (MVP)

## هدف محصول
- جذب ترافیک ارگانیک (SEO) با گزارش‌های قابل اشتراک
- نمایش مهارت شما در حوزه performance/SEO/resilience/ops
- تبدیل به لید (مشاوره/پروژه) و در صورت نیاز پرداخت برای گزارش کامل/PDF

## تعریف خروجی MVP
کاربر URL وارد می‌کند → سیستم یک `AuditRun` می‌سازد → Worker آن را اجرا می‌کند → Report summary + findings ذخیره می‌شود → یک صفحه report با token قابل share است.

## اجزای اصلی
- Web (Next.js App Router) برای landing + audit form + report page
- Worker (Node) برای crawl + (اختیاری) lighthouse + ساخت findings
- DB (Postgres + Prisma) برای runs + leads + orders + share tokens

## اصول طراحی
- گزارش‌ها **versioned** هستند (`asdev.audit.summary.v1`)
- SSRF guardrails برای امنیت ضروری است
- سیستم fail-safe: خطاها در run ذخیره شوند، UI پیام قابل فهم بدهد


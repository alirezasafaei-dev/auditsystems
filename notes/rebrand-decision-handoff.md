# Handoff Note: Pre-Rebrand State Capture (2026-05-04)

مقدمه
- این سند برای ذخیره‌سازی وضعیت فعلی قبل از اجرای هر rebrand نهایی تهیه شده است.
- هدف: هیچ تغییری روی rebrand انجام نشود؛ فقط جمع‌آوری و مستندسازی کامل برای تصمیم‌گیری بعدی.

## وضعیت فعلی پروژه (مختصر)
- دامنه‌ی بررسی: `audit.alirezasafaeisystems.ir`
- سایت فعلی برای user-facing audit flow در حال نمایش است.
- endpointهای کلیدی جواب می‌دهند:
  - `GET /api/ready` => 200
  - `POST /api/audit/runs` برای URL عمومی (`https://example.com`) => 200 + `runId`/`token`
  - `GET /api/audit/runs/{runId}` => `status: QUEUED`
  - `GET /api/reports/{token}` => `status: QUEUED`, `summary: null`, `findings: []`
- پیام خطای دامنه محلی (`localhost`) صحیح برگشت می‌دهد (`SSRF_BLOCKED_HOSTNAME`).

## نتیجه‌گیری فنی فعلی (بدون تغییر کد جدید)
- هسته‌ی ثبت درخواست (ingest) کار می‌کند.
- مسیر پردازش غیرهمزمان (worker/job) ظاهراً به نتیجه نمی‌رسد چون رکوردها از `QUEUED` خارج نمی‌شوند.
- UI برای کاربر لینک گزارش می‌سازد، اما صفحه تا وقتی worker کار نکند روی وضعیت `QUEUED` می‌ماند.

## مدارک لاگ/تأیید فعلی
- اجرای دستی smoke (`node` + API checks) نشان داد:
  - run ساخت می‌شود (runId/token دریافت شد)
  - 30 poll پیاپی (۲ ثانیه‌ای) هیچ‌گاه به `SUCCEEDED`/`FAILED` نرسید.
  - گزارش نهایی هم `QUEUED` ماند.
- فایل اسکریپت smoke موجود: `scripts/deploy/smoke-audit-flow.cjs`
- اسکریپت deploy production به‌روزشده برای اجرا worker همزمان web:
  - `ops/deploy/deploy.sh`
- چک سلامت deploy/provision:
  - `scripts/deploy/check-hosting-sync.sh`

## محدودیت/مسئله‌ی عملیاتی فعلی
- احتمال بسیار بالا: worker در production بالا نیست یا با نام صحیح کار نمی‌کند.
- deploy فعلی روی هر دو app-name زیر تنظیم شده است:
  - `asdev-audit-ir-production`
  - `asdev-audit-ir-production-worker`
- چون کاربر گفت rebrand به `alirezasafaeisystems` در حال انجام است، احتمالاً این اسم‌ها به‌زودی باید align شوند.

## فایل‌های مرتبط (بدون تغییر در این مرحله)
- `src/app/api/audit/runs/route.ts`
- `src/worker/audit.handler.ts`
- `src/worker/index.ts`
- `src/worker/queue.ts`
- `ops/deploy/deploy.sh`
- `scripts/deploy/smoke-audit-flow.cjs`
- `scripts/deploy/check-hosting-sync.sh`
- `.env.example`
- `docs/PRODUCTION_ENV.md`
- `combined-sites-env-prod-latest.env` (اطلاعات deploy)

## متغیرهای محلی موجود/نکات برای تصمیم بعدی
- env مرکزی فعلی production (در فایل ترکیبی) شامل مقادیر زیر برای audit است:
  - `AUDIT_DNS_GUARD=true`
  - `WORKER_POLL_MS=1200`
  - `WORKER_JOB_TIMEOUT_MS=45000`
  - `REQUIRE_DISTRIBUTED_RATE_LIMIT=true`
  - `UPSTASH_REDIS_REST_URL` و `UPSTASH_REDIS_REST_TOKEN` خالی‌اند
  - در عوض `REDIS_URL` و `ASDEV_REDIS_URL` مقداردهی شده‌اند.
- توجه: در این مرحله **هیچ rebrand یا deploy جدیدی انجام نشود**.

## فهرست تصمیم‌گیری پیشنهادی در دستور بعد (برنامه نهایی)
1) اولویت‌: تثبیت worker اجرا
   - verify روی VPS: `pm2 list`, `pm2 logs <worker-app>`, `journalctl -u ???`
   - اجرای مستقیم health + poll تا transition از `QUEUED`
2) اگر worker درست شد، smoke کامل را با همان دامنه اجرا کن
3) بعد از تثبیت، rebrand صرفاً روی دامنه‌ها/asset naming انجام شود
4) در نهایت deploy + verify با اسکریپت‌های بالا.

## وضعیت rebrand
- rebrand از `asdev` به `alirezasafaeisystems` **در این لحظه انجام نشد**.
- در این مرحله فقط snapshot/مستندسازی شده تا در دستور بعد تصمیم بگیریم.

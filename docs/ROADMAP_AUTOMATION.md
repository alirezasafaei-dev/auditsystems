# Roadmap Automation

این اتوماسیون برای اجرای واقعی فازهای roadmap و کنترل پیشرفت در لوکال/CI ساخته شده است.

## Files
- Config: `ops/roadmap/phases.json`
- Runner: `src/scripts/roadmap-automation.ts`
- Reports:
  - `logs/roadmap/last-run.json`
  - `logs/roadmap/last-run.md`

## Commands
- اجرای کامل فازهای `done` و `in_progress` با strict mode:
```bash
pnpm run roadmap:run
```
- اجرای dry run (بدون اجرای commandها):
```bash
pnpm run roadmap:dry
```
- اجرای یک فاز مشخص:
```bash
pnpm run roadmap:phase -- E
```
- اجرای همه فازها شامل planned:
```bash
tsx src/scripts/roadmap-automation.ts --strict --include-planned
```

## Runtime Behavior
- پیش‌فرض: فازهای `planned` اجرا نمی‌شوند.
- در strict mode اگر checkی fail شود، exit code نهایی `1` می‌شود.
- برای هر check، مدت زمان، خروجی، و exit code ثبت می‌شود.
- گزارش Markdown برای استفاده تیم/مدیریت تولید می‌شود.

## How To Extend
1. فاز یا check جدید را در `ops/roadmap/phases.json` اضافه کن.
2. برای هر check یک command واقعی و قابل اتکا تعریف کن.
3. در CI از `pnpm run roadmap:run` به‌عنوان gate استفاده کن.

## Operational Recommendation
- حداقل روزی یک بار `roadmap:run` را در CI زمان‌بندی کن.
- گزارش `logs/roadmap/last-run.md` را در PR یا کانال تیمی منتشر کن.

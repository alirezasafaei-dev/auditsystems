# Report Summary JSON — Audit (asdev.audit.summary.v1)

هدف Summary:
- UI شما فقط به summary تکیه کند (پایدار)
- raw lighthouse یا داده‌های حجیم جدا نگهداری شود

## فایل‌ها
- `src/lib/summary.types.ts` — Type دقیق Summary
- `src/lib/summary.ts` — builder
- `docs/SUMMARY_EXAMPLE.json` — نمونه خروجی برای تست UI

## اصول
- `schema` حتماً versioned باشد
- `generatedAt` داشته باشد
- `run` meta را داشته باشد
- `dependencies` و `security` و `seoBasics` را برای UX سریع نگه دارید
- `highlights.topFixes` خروجی “قابل عمل” به کاربر می‌دهد


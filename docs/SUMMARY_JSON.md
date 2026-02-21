# Report Summary JSON (`asdev.audit.summary.v1`)

هدف Summary:
- UI فقط به یک قرارداد پایدار تکیه کند.
- داده‌های حجیم یا خام (مثل lighthouse raw) جدا نگه داشته شوند.

## Source Files
- `src/lib/summary.types.ts`
- `src/lib/summary.ts`
- `docs/SUMMARY_EXAMPLE.json`

## Rules
- `schema` باید versioned باشد.
- `generatedAt` باید ثبت شود.
- اطلاعات run (input/normalized/final URL, duration, depth) باید وجود داشته باشد.
- findings/highlights باید برای UX سریع قابل مصرف باشند.

## Consumer Guidance
- UI روی keyهای پایدار summary قفل شود.
- افزودن field جدید باید backward-compatible باشد.
- تغییرات شکسته (breaking) فقط با نسخه schema جدید انجام شود.

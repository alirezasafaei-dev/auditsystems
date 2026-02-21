# قیف تبدیل (Landing → Activation → Payment) — Audit

## North Star
- **Report View + Share** (activation)
- سپس **Lead / Unlock** (monetization)

---

## Landing
**هدف:** کاربر سریع بفهمد گزارش چه ارزشی دارد.

### CTAها
- CTA اصلی: «تست رایگان سایت»
- CTA ثانویه: «مشاهده گزارش نمونه»

### KPI
- `audit_click_start / audit_landing_view`

---

## Activation
**هدف:** کاربر «مشکل» را ببیند و گزارش را share کند.

### Activation Event
- run موفق (SUCCEEDED)
- view report
- share/copy link

### UX توصیه‌شده
- 3 تا “Top Fix” با impact بالا
- بخش “Third‑party dependencies” (برای ایران بسیار ملموس است)
- یک summary score (اگر Lighthouse دارید)

---

## Payment (یا Lead)
دو مسیر:

### مسیر A: Lead (مشاوره/پروژه)
- فرم: ایمیل + شماره + توضیح کوتاه
- CTA: «درخواست بررسی کامل»

### مسیر B: Unlock (PDF/Full report)
- پرداخت برای PDF (یا گزارش کامل)
- بعد از پرداخت: لینک دانلود + ایمیل ارسال شود

---

## رویدادهای پیشنهادی
- `audit_landing_view`
- `audit_run_created`
- `audit_run_succeeded`
- `audit_report_view`
- `audit_report_share`
- `audit_unlock_click`
- `audit_checkout_started`
- `audit_payment_succeeded`
- `audit_consult_click`

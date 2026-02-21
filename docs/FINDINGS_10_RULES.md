# Findings v1 — ۱۰ قانون طلایی (Golden Rules)

این ruleها طوری انتخاب شده‌اند که با **HTML + Resource list + headers** قابل تشخیص باشند و خروجی ملموس بدهند.

> فایل کد: `src/lib/rules.ts`

---

## لیست Ruleها (MVP)

1) `THIRD_PARTY_FONTS` — RESILIENCE | HIGH  
2) `THIRD_PARTY_CRITICAL_JS` — RESILIENCE | HIGH  
3) `RECAPTCHA_DEPENDENCY` — RESILIENCE | HIGH  
4) `MIXED_CONTENT` — SECURITY | HIGH  
5) `NO_CSP_HEADER` — SECURITY | MEDIUM/HIGH  
6) `NO_HSTS` — SECURITY | MEDIUM  
7) `STATIC_ASSETS_NO_LONG_CACHE` — PERFORMANCE | MEDIUM  
8) `SLOW_TTFB_OR_SERVER_RESPONSE` — PERFORMANCE | MEDIUM/HIGH  
9) `TOO_MANY_REQUESTS_OR_HEAVY_PAGE` — PERFORMANCE | MEDIUM  
10) `SEO_BASICS_MISSING` — SEO | LOW/MEDIUM

---

## استاندارد Finding
هر finding باید این‌ها را داشته باشد:
- `code` یکتا
- `severity` مشخص
- `recommendation` عملیاتی
- `evidence` (حداقل چند URL نمونه یا metric)

---

## نکته اجرایی مهم
Ruleها را از روز اول **versioned** کنید (اگر تغییر بزرگ دادید در summary نسخه را عوض کنید).

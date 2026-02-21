# فازبندی اجرایی (بدون زمان‌بندی)

> هر فاز باید یک خروجی قابل نمایش داشته باشد.

---

## Phase A — Foundation
**هدف:** ثبت run + تولید token + وضعیت‌های پایه

**Acceptance Criteria**
- `POST /api/audit/runs` کار می‌کند
- `AuditRun` در DB ساخته می‌شود و `ReportShare.token` تولید می‌شود
- صفحه `/audit/r/[token]` حداقل یک نمای ساده (placeholder) نشان می‌دهد

---

## Phase B — Scanner MVP (HTML + Resource Extraction)
**هدف:** fetch HTML + استخراج منابع + ثبت resources

**Acceptance Criteria**
- برای URLهای واقعی، HTML و headers ذخیره/پردازش می‌شود
- حداقل ۲۰ resource قابل تشخیص است (script/link/img)
- third-party تشخیص داده می‌شود (host compare)

---

## Phase C — Findings v1 (10 Golden Rules)
**هدف:** ۱۰ rule اولیه اجرا شود و findings در report نمایش داده شود

**Acceptance Criteria**
- حداقل ۵ finding برای سایت‌های واقعی بیرون می‌آید (نه همیشه صفر)
- هر finding شامل `code + severity + recommendation + evidence` است
- UI: top fixes + لیست findings قابل فهم

---

## Phase D — Summary JSON v1 (Stable API for UI)
**هدف:** ساخت و ذخیره `asdev.audit.summary.v1`

**Acceptance Criteria**
- `AuditRun.summary` با ساختار ثابت ذخیره می‌شود
- UI فقط از summary استفاده می‌کند (نه از raw lighthouse/jsonهای حجیم)

---

## Phase E — Lighthouse (اختیاری اما پرارزش)
**هدف:** scoreها و vitals را از Lighthouse اضافه کنید

**Acceptance Criteria**
- Lighthouse در worker اجرا می‌شود و timeout دارد
- scoreها در summary می‌آیند
- در صورت crash یا timeout، run شکست نخورد (graceful degrade)

---

## Phase F — Monetization / Lead
**هدف:** Unlock flow (ایمیل/پرداخت/PDF)

**Acceptance Criteria**
- Lead capture ثبت می‌شود
- Order lifecycle ثبت می‌شود (PENDING/PAID/FAILED)
- PDF قابل دانلود برای سفارش‌های PAID

---

## Phase G — SEO Scale (Programmatic Guides)
**هدف:** صفحات guides + sample reports + metadata

**Acceptance Criteria**
- sitemap + robots + canonical
- حداقل ۱۰ مقاله خوشه‌ای + یک pillar
- share cards (OG) برای report و guides

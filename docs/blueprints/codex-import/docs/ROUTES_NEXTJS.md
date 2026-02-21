# Routeهای دقیق (Next.js App Router) — Audit

## پیشنهاد ساختار `app/`

```txt
app/
  (marketing)/
    page.tsx                       // Landing
    pricing/page.tsx               // (اختیاری) قیمت‌گذاری Unlock/Monitoring
    sample-report/page.tsx         // گزارش نمونه قابل share
    guides/[slug]/page.tsx         // مقالات سئویی
  (tool)/
    audit/page.tsx                 // فرم URL + depth
    audit/r/[token]/page.tsx       // Report عمومی
    audit/r/[token]/unlock/page.tsx// ایمیل + پرداخت برای PDF/Full
    audit/r/[token]/success/page.tsx
    audit/r/[token]/failed/page.tsx
  (admin)/
    admin/page.tsx
    admin/runs/page.tsx
    admin/leads/page.tsx
    admin/orders/page.tsx
  api/
    audit/runs/route.ts
    audit/runs/[id]/route.ts
    reports/[token]/route.ts
    leads/route.ts
    orders/route.ts
    payments/callback/route.ts
    pdf/[token]/route.ts
```

## API قرارداد (MVP)

### Create Run
- `POST /api/audit/runs`
  - body: `{ url: string, depth?: "QUICK"|"DEEP" }`
  - response: `{ runId: string, token: string }`

### Get Report (Public)
- `GET /api/reports/:token`
  - response: `AuditRun.summary` + meta

### Unlock / Order
- `POST /api/orders`
  - body: `{ token: string, email: string }`
  - response: `{ orderId, redirectUrl }`

### Payment Callback
- `POST /api/payments/callback`
  - body: provider payload
  - response: ok

### PDF Download
- `GET /api/pdf/:token`
  - require: valid PAID order
  - response: application/pdf


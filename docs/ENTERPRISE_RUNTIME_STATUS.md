# Enterprise Runtime Status

Last updated (UTC): 2026-02-24T01:40:52Z
Base commit at capture: `c5254ba`

## Implemented baseline
- ASDEV cross-site contract: `/asdev` page + footer signature + UTM links + Telegram (`@asdevsystems`).
- `/standards` و `/en/standards` با intent-map و لینک داخلی استاندارد بین سه سایت.
- Security headers baseline in Next config (CSP, HSTS, Referrer-Policy, XFO, XCTO, Permissions-Policy).
- `X-Robots-Tag: noindex, nofollow` for `/api/*` and admin surfaces.
- Request/correlation IDs via middleware.
- Health endpoints: `/api/health`, `/api/ready`.
- GET/HEAD parity روی `/api/ready` در کد و workflowهای deploy برای هر سه پروژه.
- CI smoke gate added in `.github/workflows/main-gate.yml` (curl-based `/asdev` validation in production-mode server).
- Runtime baseline script: `pnpm run network:baseline`.

## Latest real verification
- VPS deploy-all (`manual-20260224T0120xxZ` تا `manual-20260224T0125xxZ`) -> PASS
  - `my-portfolio-production` روی `3002`
  - `persian-tools-production` روی `3000`
  - `asdev-audit-ir-production/staging` روی `3010/3011`
- `pm2 status` -> 6 app آنلاین (3 production + 3 staging)
- Loopback readiness (روی VPS):
  - `http://127.0.0.1:3002/api/ready` -> `GET=200 HEAD=200`
  - `http://127.0.0.1:3000/api/ready` -> `GET=200 HEAD=200`
  - `http://127.0.0.1:3010/api/ready` -> `GET=200 HEAD=200`
  - `http://127.0.0.1:3011/api/ready` -> `GET=200 HEAD=200`
- Public readiness from VPS egress:
  - `https://alirezasafaeisystems.ir/api/ready` -> `GET=200 HEAD=200`
  - `https://persiantoolbox.ir/api/ready` -> `GET=200 HEAD=200`
  - `https://audit.alirezasafaeisystems.ir/api/ready` -> `GET=200 HEAD=200`
  - `https://staging.audit.alirezasafaeisystems.ir/api/ready` -> `GET=200 HEAD=200`
- `pnpm run network:baseline` (روی VPS) -> PASS
  - report: `logs/runtime/asdev-network-baseline.json`
- `pnpm run payment:zarinpal:smoke` (روی VPS) -> SKIP
  - evidence: `ZARINPAL_MERCHANT_ID=""` در shared env
- `POST /api/audit/runs` روی production/staging -> `503 RATE_LIMIT_BACKEND_REQUIRED` (مطابق strict-mode وقتی backend واقعی Upstash تنظیم نیست)

## Notes
- از محیط local فعلی، دامنه‌های `audit*` ممکن است timeout شوند؛ راستی‌آزمایی نهایی public با egress خود VPS انجام شده و مبنا قرار گرفته است.
- برای برداشتن `RATE_LIMIT_BACKEND_REQUIRED` و اجرای smoke واقعی پرداخت، باید credential واقعی `UPSTASH_*` و `ZARINPAL_MERCHANT_ID` در shared env ست شود.

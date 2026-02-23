# Auto Generated Project Status

Generated at: 2026-02-23T16:10:38.504Z

## Overview
- API routes: 10
- Page routes: 20
- Test files: 6
- NPM scripts: 24

## Roadmap Phases
- Done: 9
- In Progress: 0
- Planned: 1
- Last automation run: 2026-02-23T16:08:46.751Z
- Last run results: passed=22, failed=0, skipped=3

## API Routes
- `/api/audit/runs`
- `/api/audit/runs/[id]`
- `/api/live`
- `/api/metrics`
- `/api/orders`
- `/api/payments/callback`
- `/api/pdf/[token]`
- `/api/ready`
- `/api/reports/[token]`
- `/api/reports/[token]/unlock`

## Page Routes
- `/`
- `/audit`
- `/audit/r/[token]`
- `/audit/r/[token]/success`
- `/audit/r/[token]/unlock`
- `/en`
- `/en/audit`
- `/en/audit/r/[token]`
- `/en/audit/r/[token]/success`
- `/en/audit/r/[token]/unlock`
- `/en/failed`
- `/en/guides`
- `/en/guides/[slug]`
- `/en/pillar/iran-readiness-audit`
- `/en/sample-report`
- `/failed`
- `/guides`
- `/guides/[slug]`
- `/pillar/iran-readiness-audit`
- `/sample-report`

## Environment Variables (.env.example)
- `DATABASE_URL`
- `AUDIT_DNS_GUARD`
- `WORKER_POLL_MS`
- `WORKER_JOB_TIMEOUT_MS`
- `IP_HASH_SALT`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `REQUIRE_DISTRIBUTED_RATE_LIMIT`
- `PAYMENT_PROVIDER_DEFAULT`
- `APP_BASE_URL`
- `APP_BASE_URL_STRICT`
- `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
- `ZARINPAL_MERCHANT_ID`
- `DOWNLOAD_TOKEN_SECRET`

## Phase Checks Inventory
| Phase | Title | Status | Checks |
|---|---|---|---:|
| A | Foundation | done | 2 |
| B | Scanner MVP | done | 2 |
| C | Report UX + Summary JSON | done | 2 |
| D | Lead/Order Gating | done | 2 |
| E | Security and Ops Hardening | done | 4 |
| F | Monetization and Delivery | done | 3 |
| G | SEO Scale | done | 2 |
| H | Excellence / Momtaz | done | 3 |
| I | SEO Execution Automation | done | 2 |
| J | Shared VPS Production Rollout | planned | 3 |

## Key Commands
- `pnpm run dev` -> `next dev`
- `pnpm run check` -> `pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run build`
- `pnpm run worker:dev` -> `tsx src/worker/index.ts`
- `pnpm run roadmap:run` -> `tsx src/scripts/roadmap-automation.ts --strict`
- `pnpm run roadmap:dry` -> `tsx src/scripts/roadmap-automation.ts --dry-run`
- `pnpm run roadmap:phase` -> `tsx src/scripts/roadmap-automation.ts --phase`
- `pnpm run seo:audit` -> `tsx src/scripts/seo-audit-automation.ts --strict`
- `pnpm run seo:audit:dry` -> `tsx src/scripts/seo-audit-automation.ts --dry-run`
- `pnpm run docs:generate` -> `tsx src/scripts/docs-automation.ts`
- `pnpm run docs:refresh` -> `pnpm run docs:generate && pnpm run roadmap:run`
- `pnpm run payment:preflight` -> `tsx src/scripts/payment-preflight.ts`
- `pnpm run payment:preflight:strict` -> `tsx src/scripts/payment-preflight.ts --strict`
- `pnpm run payment:zarinpal:smoke` -> `tsx src/scripts/zarinpal-smoke.ts`
- `pnpm run automation:run` -> `tsx src/scripts/automation-master.ts --strict`
- `pnpm run lighthouse:local` -> `tsx src/scripts/lighthouse-local.ts`

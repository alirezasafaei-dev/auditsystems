# Auto Generated Project Status

Generated at: 2026-02-21T19:22:33.489Z

## Overview
- API routes: 9
- Page routes: 10
- Test files: 5
- NPM scripts: 22

## Roadmap Phases
- Done: 7
- In Progress: 0
- Planned: 0
- Last automation run: 2026-02-21T19:06:14.948Z
- Last run results: passed=17, failed=0, skipped=0

## API Routes
- `/api/audit/runs`
- `/api/audit/runs/[id]`
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

## Key Commands
- `pnpm run dev` -> `next dev`
- `pnpm run check` -> `pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run build`
- `pnpm run worker:dev` -> `tsx src/worker/index.ts`
- `pnpm run roadmap:run` -> `tsx src/scripts/roadmap-automation.ts --strict`
- `pnpm run roadmap:dry` -> `tsx src/scripts/roadmap-automation.ts --dry-run`
- `pnpm run docs:generate` -> `tsx src/scripts/docs-automation.ts`
- `pnpm run docs:refresh` -> `pnpm run docs:generate && pnpm run roadmap:run`
- `pnpm run payment:preflight` -> `tsx src/scripts/payment-preflight.ts`
- `pnpm run payment:preflight:strict` -> `tsx src/scripts/payment-preflight.ts --strict`
- `pnpm run payment:zarinpal:smoke` -> `tsx src/scripts/zarinpal-smoke.ts`
- `pnpm run automation:run` -> `tsx src/scripts/automation-master.ts --strict`

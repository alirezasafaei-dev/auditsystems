# Auto Generated Project Status

Generated at: 2026-02-21T17:24:32.956Z

## Overview
- API routes: 4
- Page routes: 6
- Test files: 4
- NPM scripts: 17

## Roadmap Phases
- Done: 4
- In Progress: 1
- Planned: 2
- Last automation run: 2026-02-21T17:17:54.624Z
- Last run results: passed=11, failed=0, skipped=2

## API Routes
- `/api/audit/runs`
- `/api/audit/runs/[id]`
- `/api/reports/[token]`
- `/api/reports/[token]/unlock`

## Page Routes
- `/`
- `/audit`
- `/audit/r/[token]`
- `/audit/r/[token]/success`
- `/audit/r/[token]/unlock`
- `/failed`

## Environment Variables (.env.example)
- `DATABASE_URL`
- `AUDIT_DNS_GUARD`
- `WORKER_POLL_MS`
- `WORKER_JOB_TIMEOUT_MS`
- `IP_HASH_SALT`

## Phase Checks Inventory
| Phase | Title | Status | Checks |
|---|---|---|---:|
| A | Foundation | done | 2 |
| B | Scanner MVP | done | 2 |
| C | Report UX + Summary JSON | done | 2 |
| D | Lead/Order Gating (Mock) | done | 2 |
| E | Security and Ops Hardening | in_progress | 3 |
| F | Monetization and Delivery | planned | 1 |
| G | SEO Scale | planned | 1 |

## Key Commands
- `pnpm run dev` -> `next dev`
- `pnpm run check` -> `pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run build`
- `pnpm run worker:dev` -> `tsx src/worker/index.ts`
- `pnpm run roadmap:run` -> `tsx src/scripts/roadmap-automation.ts --strict`
- `pnpm run roadmap:dry` -> `tsx src/scripts/roadmap-automation.ts --dry-run`
- `pnpm run docs:generate` -> `tsx src/scripts/docs-automation.ts`
- `pnpm run docs:refresh` -> `pnpm run docs:generate && pnpm run roadmap:run`

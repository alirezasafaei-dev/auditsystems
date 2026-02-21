# Roles and Skills Setup

## Operational Roles

- Product Owner: approves scope, pricing, and release gates.
- Backend Owner: owns API routes, DB migrations, and worker reliability.
- Security Owner: owns SSRF/rate-limit controls, secret hygiene, and security checks.
- Observability Owner: owns request tracing, error logs, and incident response notes.

## Installed Codex Skills

- `security-best-practices`
- `security-threat-model`
- `sentry`
- `playwright`
- `vercel-deploy`

Installed under: `~/.codex/skills`

## Environment Prerequisites

- `DATABASE_URL`
- `AUDIT_DNS_GUARD`
- `WORKER_POLL_MS`
- `WORKER_JOB_TIMEOUT_MS`
- `IP_HASH_SALT`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `PAYMENT_PROVIDER_DEFAULT`
- `APP_BASE_URL`
- `ZARINPAL_MERCHANT_ID`
- `DOWNLOAD_TOKEN_SECRET`

## Release Gate

Run:

```bash
pnpm run check
pnpm run roadmap:run
pnpm run docs:generate
pnpm run payment:preflight
```

This validates code quality, roadmap integrity, generated docs, and payment production preflight.

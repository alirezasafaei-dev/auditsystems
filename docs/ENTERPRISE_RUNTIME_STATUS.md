# Enterprise Runtime Status

Last updated (UTC): 2026-02-24T00:39:28Z
Base commit at capture: `56f9be4`

## Implemented baseline
- ASDEV cross-site contract: `/asdev` page + footer signature + UTM links + Telegram (`@asdevsystems`).
- Security headers baseline in Next config (CSP, HSTS, Referrer-Policy, XFO, XCTO, Permissions-Policy).
- `X-Robots-Tag: noindex, nofollow` for `/api/*` and admin surfaces.
- Request/correlation IDs via middleware.
- Health endpoints: `/api/health`, `/api/ready`.
- CI smoke gate added in `.github/workflows/main-gate.yml` (curl-based `/asdev` validation in production-mode server).

## Latest real verification
- `pnpm install --no-frozen-lockfile` -> PASS (lockfile synced after dependency rollback)
- `pnpm typecheck` -> PASS
- `pnpm run build` -> PASS
- Local production smoke:
  - server: `PORT=3110 pnpm run start`
  - check: `curl -fsS http://127.0.0.1:3110/asdev | grep -E "ASDEV|asdev_network"`
  - result: PASS

## Notes
- API handler signatures updated to `GET(_request: Request)` for test compatibility.
- Smoke in CI uses deterministic HTML assertions for `/asdev` to avoid flaky browser startup paths.

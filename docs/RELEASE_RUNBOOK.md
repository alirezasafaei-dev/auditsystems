# Release Runbook

## Pre-release
1. `pnpm install --frozen-lockfile`
2. `pnpm run automation:run`
3. `pnpm run payment:preflight:strict`
4. `pnpm prisma migrate deploy`
5. `pnpm run lighthouse:local`

## Release
1. Update `CHANGELOG.md`
2. Create tag:
```bash
git tag -a v0.2.0 -m "release v0.2.0"
git push origin v0.2.0
```

## Post-release checks
1. `/api/metrics` returns valid Prometheus text
2. Payment callback endpoint healthy
3. Worker processing queue without backlog growth

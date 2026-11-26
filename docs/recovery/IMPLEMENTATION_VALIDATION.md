# Recovery implementation validation — 2026-11-21

## Result

LOCAL_PC, branch codex/audit-recovery-20261111, base 39e127266771c5cb1dd4d4473289378e1b328878. Working tree contains the recovery changes. Node 22.23.4, pnpm 9.15.0, Prisma 6.19.3, Next.js 16.4.6, Vitest 4.1.10.

| Command | Exit | Observed result |
|---|---:|---|
| pnpm install --no-frozen-lockfile | 0 | Updated the local graph and lockfile |
| pnpm exec prisma generate --schema prisma/schema.prisma | 0 | Generated Prisma Client |
| pnpm audit --prod --json (before) | 1 | 1 high, 7 moderate, 0 critical or low |
| pnpm audit --prod (after) | 0 | Zero known advisories |
| pnpm lint | 0 | Zero warnings or errors after generated/tool exclusions and removal of unused token prop |
| pnpm typecheck | 0 | Passed |
| pnpm test (default concurrency) | 1 | 1100 passed, 1 timed out, 41 skipped |
| pnpm run test --maxWorkers=4 --testTimeout=20000 | 0 | 1101 passed, 0 failed, 41 skipped in 132 files |
| pnpm build | 0 | Next build passed with the existing Turbopack tracing warning |
| pnpm exec vitest run (SEO evidence, SEO, rules, rule regression, safe audit fetch) | 0 | 179 passed, 0 failed, 0 skipped |
| bash scripts/tests/test-package-release-private-files.sh | 0 | Asserted nested state, environment files, database, backup and trace fixtures were absent |
| node --experimental-strip-types --test tests/recovery/docs-status.test.mjs | 0 | 1 passed, 0 failed, 0 skipped |
| pnpm scan:secrets | 0 | Repository scanner passed |
| pnpm check:no-database-dumps | 0 | Passed |
| pnpm check:actions-pinned | 0 | Passed |
| pnpm check:prisma-deepmerge | 0 | Final run verified 8.0.0 after correcting Windows pnpm invocation |
| bash scripts/agent-skills.sh verify | 0 | Pinned gitlinks verified |
| bash scripts/tests/test-agent-skills-integrity.sh | 0 | Passed |

The earlier 2525-problem lint run included tooling under .state. The current lint gate keeps source coverage. The report form contains no input for email and gives delivery status. The API does not create a lead while delivery is unavailable. The notification implementation returns false without persisting delivery history or logging email/report body. The trusted Nginx deployment configuration overwrites X-Real-IP. The regression test verifies that varying caller X-Forwarded-For leaves both capture quota keys unchanged. Verify that the production ingress still overwrites the configured header and bars direct access to the application listener.

An independent review found archive exclusions were too narrow. Expanded them and reran the archive fixture. A separate local public-route smoke was attempted, but the shell command was rejected by automatic policy and did not execute. The full test result includes 41 skipped tests. Hosted CI, a production-like service stack, candidate SHA, production worker parity, rollback/restore evidence and a new owned-site audit remain open.

Independent re-review accepted the source remediations after the follow-up fixes. Both working trees were kept uncommitted and unstaged.

All 16 relocated private evidence files were present in the expected project directories. Thirteen matched the relocation manifest's SHA-256. Three Markdown files (manifest entries 1, 2 and 6) differ from their recorded digest. The files and manifest were preserved. Use fresh evidence for production acceptance.

## Changed files

- `.env.example`
- `.github/workflows/docs-automation.yml`
- `.gitignore`
- `AGENTS.md`
- `docs/AUTO_GENERATED_STATUS.md`
- `docs/README.md`
- `docs/recovery/CURRENT_STATUS.md`
- `docs/recovery/DOCUMENTATION_VALIDATION.md`
- `docs/recovery/IMPLEMENTATION_PLAN.md`
- `docs/recovery/IMPLEMENTATION_VALIDATION.md`
- `docs/recovery/RELEASE_READINESS.md`
- `docs/security/AUTH_ABUSE_TRUST_BOUNDARY.md`
- `eslint.config.mjs`
- `next-env.d.ts`
- `package.json`
- `pnpm-lock.yaml`
- `README.md`
- `scripts/package-release.sh`
- `scripts/tests/test-package-release-private-files.sh`
- `scripts/tests/test-prisma-deepmerge-remediation.sh`
- `src/app/api/reports/[token]/capture/route.test.ts`
- `src/app/api/reports/[token]/capture/route.ts`
- `src/app/audit/r/[token]/page.tsx`
- `src/components/EmailCapture.tsx`
- `src/lib/authRateLimit.test.ts`
- `src/lib/authRateLimit.ts`
- `src/lib/notifications.test.ts`
- `src/lib/notifications.ts`
- `src/lib/report-capture-schema.ts`
- `src/scripts/docs-automation.ts`
- `tests/recovery/docs-status.test.mjs`

## 2026-11-26 follow-up

A disposable Windows-native PostgreSQL 16.16 instance applied all 15 migrations (exit 0). The 41 previously skipped PostgreSQL tests ran. The first full native suite exposed a raw serialization failure during a scheduled claim. The scheduler now retries the whole transaction on Prisma P2010 for PostgreSQL serialization failures and deadlocks, within the existing retry bound. The independent reviewer accepted the logic, the deterministic retry cases and the SEO report assertions.

| Command or check | Exit | Result |
|---|---:|---|
| Full Vitest with all PostgreSQL integration flags | 0 | 1142 passed, 0 failed, 0 skipped |
| Deterministic scheduler retry regression added after the full run | 0 | 3 passed, 0 failed, 0 skipped |
| Audit worker round-trip against fixture HTML and both SEO endpoints | 0 | 4 integration cases passed. Both probes were VERIFIED/200 in persisted summary and authorized report response |
| pnpm lint, pnpm typecheck, pnpm build | 0 | Passed |
| pnpm scan:secrets, pnpm audit --prod, package fixture, action pins and dump guard | 0 | Passed |

The WSL test attempt had clock skew between database and app runtimes. The passing evidence uses PostgreSQL and Node on the same Windows clock with UTC database sessions. The checks used disposable data and synthetic payment state. Real payment remains unverified.

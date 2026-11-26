# Recovery implementation plan — 2026-11-11

Goal: promote an auditable, secure candidate with correct report evidence and truthful delivery. User approved the practical priority sequence and project-contained work.

## Boundaries
- Preserve root checkout changes. Work only on codex/audit-recovery-20261111 in each project's .state/recovery-source.
- Logs, tools, caches and test artifacts stay in the owning project .state directory.
- Private audit reports remain ignored; tracked docs contain sanitized conclusions only.
- No publishing/commit until staged review, secret scan and repository checks. Production operations require the existing exact approval gate.

## Implementation units
- [x] Relocate historical evidence, verify file digests, create execution ledger and README pointers.
- [ ] Audit package.json / pnpm-lock.yaml: compatible production-dependency remediation. Verify audit, lint, types, tests, build under supported Node.
- [ ] Mother workflow runner compatibility: use supported image; verify workflow configuration and browser executable.
- [ ] Audit notifications.ts: no provider means no false sent record, no PII log; test outcome and existing callers.
- [ ] Audit report capture: bounded shared schema, rate limiting and appropriate origin policy; regression tests.
- [ ] Mother legacy track and Compose: prevent unconstrained telemetry writes and placeholder runtime config; regression checks.
- [ ] Independent review and complete validation receipts with actual failed/skipped counts.
- [ ] Reconcile candidate release identity, web/worker artifact, migration/rollback needs without mutating production.
- [ ] Approved release and live verification: version match plus owned-site robots/sitemap correctness; do not mark complete before evidence.

## Definition of done
Each unit has changed-file inventory, commands/exit results, residual risks and explicit production impact. A test success is not deployment success. No task is marked done based only on source presence or document generation.

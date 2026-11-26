# Release readiness — recovery candidate

Status: NOT READY FOR PRODUCTION. This document prepares review; it is not a deployment approval or receipt.

## Required evidence
- Exact candidate commit after security review and required checks; current working branch is uncommitted.
- Reproducible artifact excluding .state, credentials, user data and local caches.
- Source SHA/release ID/build timestamp surfaced by the application and matched to web and workers.
- Actual database migration status compared with candidate migrations. Matching schema files alone is insufficient.
- Known rollback artifact and verified restore procedure before any state-changing migration.
- Protected environment and explicit production authorization as required by project governance.
- Post-release desktop/mobile checks plus the owned-site robots/sitemap regression.

## Deployment route selection
AuditSystems has a protected-input workflow at .github/workflows/deploy-vps-manual.yml. Its production confirmation input is APPROVE_AUDITSYSTEMS_PRODUCTION_DEPLOY, and forward migrations have a separate gate. Mother governance additionally documents APPROVE_CRITICAL_SITE_PRODUCTION_DEPLOY / APPROVE_CRITICAL_SITE_MIGRATION. Resolve the applicable target contract before any operation.

The older scripts/deploy-production.sh is not a safe dry-run: it sources configuration, installs, builds, migrates, seeds plans, cleans authentication state and restarts processes. Do not execute it as a diagnostic or readiness check. Prefer the reviewed release workflow and explicit artifact/rollback contract.

## Remaining external proof
- Hosted exact-head CI after branch publication.
- AUTOMATION_SERVER authenticated status and sync timer evidence.
- Payment-provider readiness and authorized controlled checkout.
- Production release and live verification after approval.

## 2026-11-21 release decision

The recovery worktree is locally testable. The base SHA identifies the checkout and the current candidate includes uncommitted changes. Bind the approved candidate commit to a release ID, build timestamp and SHA-256 of the artifact before deployment.

For AuditSystems, the protected workflow passes release identity to web and worker processes. Verify the public version response against the artifact metadata. Independently verify the running worker's release metadata, working directory and startup evidence. Verify the web working directory and release symlink against the same exact release. Compare database migration state with the candidate and record the previous release ID, retained artifact, process configuration, database backup and restore rehearsal. A version response alone cannot establish worker parity.

After authorization and deployment, run a fresh owned-site audit of the mother site. Require a completed run, direct checks for both robots.txt and sitemap.xml with truthful status and evidence in the persisted and visible report, and matching web/worker/artifact identity. Keep the rollback artifact available through acceptance. The historical score of 93 describes the prior run. The local smoke checked both SEO routes but did not generate a new production audit.

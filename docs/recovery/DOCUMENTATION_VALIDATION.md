# Documentation validation

- Regression test first failed because generated output represented configured phase labels as completion evidence.
- Added explicit inventory-only wording, canonical recovery pointer and declared-done label.
- Windows route inventory regression first failed with zero routes for a real route fixture; platform-independent filename detection corrected it.
- node --test tests/recovery/docs-status.test.mjs: PASS on Node 24 and project-contained supported Node v22.23.4 (1 integration test).
- Generated status refreshed from current source. This does not certify production readiness.

# Rollback Runbook

## Trigger conditions
- Sustained 5xx spike
- Payment callback failures
- Critical regression in report generation

## Steps
1. Identify last stable tag (`git tag --sort=-creatordate | head`).
2. Checkout stable tag commit in deployment branch/environment.
3. Re-apply previous `.env` and restart services.
4. If migration caused issue, apply DB rollback plan or restore snapshot.
5. Validate:
   - `GET /api/metrics`
   - `POST /api/audit/runs`
   - report fetch + unlock flow

## Verification
- Error rate returns to baseline
- Payment callback success restored
- Worker queue drains normally

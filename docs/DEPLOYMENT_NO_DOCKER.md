# Deployment (No Docker)

این پروژه مطابق الگوی `asdev-portfolio` و `asdev-persiantoolbox` با Docker deploy نمی‌شود.

## Runtime Pattern
- Process manager: PM2
- Edge proxy: Nginx
- Release model: timestamped releases + `current/{env}` symlink
- Health check: `GET /api/ready`

## Key Files
- `ops/deploy/deploy.sh`
- `ops/deploy/rollback.sh`
- `scripts/deploy/bootstrap-ubuntu-vps.sh`
- `scripts/deploy/provision-nginx-site.sh`
- `ops/nginx/asdev-audit-ir.conf`

## Server Flow (Production)
1. VPS bootstrap (one-time)
```bash
sudo bash scripts/deploy/bootstrap-ubuntu-vps.sh
```
2. Prepare env file on server:
- `/var/www/asdev-audit-ir/shared/env/production.env`
3. Deploy a release:
```bash
bash ops/deploy/deploy.sh --env production --source-dir /path/to/release
```
4. Rollback when needed:
```bash
bash ops/deploy/rollback.sh --env production
```

## Important Guard
- هیچ deploy واقعی قبل از تایید مستقیم انجام نمی‌شود.

## Shared VPS Recommendation
- الگوی recommended برای این پروژه: اپ مستقل روی زیرساخت مشترک
- دامنه‌های هدف:
  - production: `audit.alirezasafaeisystems.ir`
  - staging: `staging.audit.alirezasafaeisystems.ir`
- پورت‌های runtime مطابق اسکریپت‌ها:
  - production: `3010`
  - staging: `3011`

جزئیات کامل تصمیم و معیارهای پذیرش در:
- `ROADMAP_SHARED_VPS_PRODUCTION.md`

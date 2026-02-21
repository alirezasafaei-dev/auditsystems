#!/usr/bin/env bash
set -euo pipefail

cd /home/dev/Project_Me/asdev-audit-ir
pnpm dlx pm2 start ops/pm2/ecosystem.config.cjs
pnpm dlx pm2 save

echo "PM2 services are running."

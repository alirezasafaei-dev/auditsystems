#!/usr/bin/env bash
set -euo pipefail

cd /home/dev/Project_Me/asdev-audit-ir

pnpm run check
pnpm run payment:preflight:strict
pnpm run payment:zarinpal:smoke || true
pnpm prisma migrate deploy
pnpm run lighthouse:local

echo "Local production checks completed."

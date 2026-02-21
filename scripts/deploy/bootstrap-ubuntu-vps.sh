#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "[bootstrap] run as root: sudo bash scripts/deploy/bootstrap-ubuntu-vps.sh" >&2
  exit 1
fi

DEPLOY_USER="${DEPLOY_USER:-deploy}"
BASE_DIR="${BASE_DIR:-/var/www/asdev-audit-ir}"
NODE_MAJOR="${NODE_MAJOR:-22}"

echo "[bootstrap] apt update"
apt update

echo "[bootstrap] install base packages"
apt install -y nginx postgresql postgresql-contrib curl git rsync ufw fail2ban ca-certificates gnupg

echo "[bootstrap] install Node.js ${NODE_MAJOR}.x"
curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
apt install -y nodejs

corepack enable || true
corepack prepare pnpm@10.6.2 --activate || true
npm install -g pm2

if ! id -u "${DEPLOY_USER}" >/dev/null 2>&1; then
  adduser --disabled-password --gecos "" "${DEPLOY_USER}"
fi

mkdir -p "${BASE_DIR}/releases" "${BASE_DIR}/current" "${BASE_DIR}/shared/env" "${BASE_DIR}/shared/logs" "${BASE_DIR}/tmp"
chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "${BASE_DIR}"

ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

systemctl enable nginx
systemctl enable postgresql
systemctl enable fail2ban

cat <<INFO
[bootstrap] completed.

Next steps:
1. Copy nginx template from ops/nginx/asdev-audit-ir.conf
2. Create env files:
   - ${BASE_DIR}/shared/env/production.env
   - ${BASE_DIR}/shared/env/staging.env
3. Create Postgres users/databases and update DATABASE_URL.
4. Run deploy script with release artifact.
INFO

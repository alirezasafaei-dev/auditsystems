#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="/home/dev/Project_Me/asdev-audit-ir"

sudo cp "$REPO_DIR/ops/systemd/asdev-audit-web.service" /etc/systemd/system/
sudo cp "$REPO_DIR/ops/systemd/asdev-audit-worker.service" /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable asdev-audit-web.service
sudo systemctl enable asdev-audit-worker.service

echo "Systemd units installed."
echo "Start with: sudo systemctl start asdev-audit-web asdev-audit-worker"

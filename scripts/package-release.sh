#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="${1:?source directory is required}"
ARCHIVE_PATH="${2:?archive path is required}"

[[ -d "$SOURCE_DIR" ]] || { echo "source directory does not exist" >&2; exit 1; }

tar -C "$SOURCE_DIR" -czf "$ARCHIVE_PATH" \
  --exclude='./.git' \
  --exclude='./.github' \
  --exclude='./node_modules' \
  --exclude='./.next' \
  --exclude='./.venv' \
  --exclude='./coverage' \
  --exclude='./artifacts' \
  --exclude='./reports' \
  --exclude='./logs' \
  --exclude='playwright-report' \
  --exclude='test-results' \
  --exclude='ops/backups' \
  --exclude='*.sql.gz' \
  --exclude='*.pem' \
  --exclude='.state' \
  --exclude='.env*' \
  --exclude='*.db' \
  --exclude='*.db-*' \
  --exclude='*.sqlite' \
  --exclude='*.sqlite-*' \
  --exclude='*.sqlite3' \
  --exclude='*.sqlite3-*' \
  .

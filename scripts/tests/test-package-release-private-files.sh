#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
mkdir -p "$repo_root/.state/package-release-test"
export TMPDIR="$repo_root/.state/package-release-test"
fixture="$(mktemp -d)"
archive="$(mktemp)"
trap 'rm -rf "$fixture" "$archive"' EXIT

mkdir -p "$fixture/.state" "$fixture/nested/.state"
printf 'public\n' > "$fixture/README.md"
printf 'private-state-sentinel\n' > "$fixture/.state/evidence.txt"
printf 'private-env-sentinel\n' > "$fixture/.env.production.local"
printf 'example-env\n' > "$fixture/.env.example"

printf 'private-state-sentinel\n' > "$fixture/nested/.state/evidence.txt"
printf 'private-env-sentinel\n' > "$fixture/nested/.env.runtime"
printf 'private-db-sentinel\n' > "$fixture/nested/private.sqlite3"
printf 'private-db-sentinel\n' > "$fixture/nested/private.sqlite3-wal"

mkdir -p "$fixture/ops/backups" "$fixture/playwright-report" "$fixture/test-results"
touch "$fixture/ops/backups/snapshot.tar" "$fixture/playwright-report/trace.zip" "$fixture/test-results/debug.zip" "$fixture/nested/dump.sql.gz" "$fixture/nested/private.pem"

bash "$repo_root/scripts/package-release.sh" "$fixture" "$archive"
contents="$(tar -tzf "$archive")"

printf '%s\n' "$contents" | grep -qx './README.md'
if printf '%s\n' "$contents" | grep -Eq '(^|/)\.state/|(^|/)\.env[^/]*|private\.sqlite3|ops/backups|playwright-report|test-results|dump\.sql\.gz|private\.pem'; then
  printf 'Release archive contains a private or generated fixture\n' >&2
  exit 1
fi
printf 'Release archive excluded all private fixtures\n'

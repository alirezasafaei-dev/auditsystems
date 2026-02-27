#!/usr/bin/env bash
set -euo pipefail

STRICT=false
WITH_SSH=false
SSH_TARGET=""
SSH_KEY=""
REPORT_DIR="logs/deploy"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
MD_REPORT="$REPORT_DIR/readiness-$STAMP.md"
JSON_REPORT="$REPORT_DIR/readiness-$STAMP.json"

usage() {
  cat <<'USAGE'
Usage: scripts/deploy/run-readiness-suite.sh [options]

Options:
  --strict                    Fail on warnings in hosting checks
  --with-ssh                  Enable remote VPS checks
  --ssh-target <user@host>    SSH target (required with --with-ssh)
  --ssh-key <path>            SSH private key
  -h, --help                  Show help
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --strict) STRICT=true; shift ;;
    --with-ssh) WITH_SSH=true; shift ;;
    --ssh-target) SSH_TARGET="${2:-}"; shift 2 ;;
    --ssh-key) SSH_KEY="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; usage; exit 1 ;;
  esac
done

if [[ "$WITH_SSH" == "true" && -z "$SSH_TARGET" ]]; then
  echo "[suite] --ssh-target is required with --with-ssh" >&2
  exit 1
fi

mkdir -p "$REPORT_DIR"

run_step() {
  local name="$1"
  local cmd="$2"
  local log_file="$REPORT_DIR/${STAMP}-${name}.log"
  local rc=0

  echo "[suite] running: $name"
  set +e
  bash -lc "$cmd" >"$log_file" 2>&1
  rc=$?
  set -e
  echo "[suite] $name exit=$rc log=$log_file"
  printf '%s|%s|%s\n' "$name" "$rc" "$log_file" >> "$REPORT_DIR/${STAMP}-results.tsv"
}

: > "$REPORT_DIR/${STAMP}-results.tsv"

run_step "check" "pnpm run check"
run_step "payment_preflight" "pnpm run payment:preflight"

HOSTING_CMD="bash scripts/deploy/check-hosting-sync.sh"
if [[ "$STRICT" == "true" ]]; then
  HOSTING_CMD+=" --strict"
fi
if [[ "$WITH_SSH" == "true" ]]; then
  HOSTING_CMD+=" --ssh-target '$SSH_TARGET'"
  if [[ -n "$SSH_KEY" ]]; then
    HOSTING_CMD+=" --ssh-key '$SSH_KEY'"
  fi
fi
run_step "hosting_sync" "$HOSTING_CMD"

TOTAL=0
FAILED=0
{
  echo "# Deploy Readiness Suite"
  echo
  echo "Generated at (UTC): $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo
  echo "| Step | Exit Code | Log |"
  echo "|---|---:|---|"
  while IFS='|' read -r step rc log; do
    TOTAL=$((TOTAL + 1))
    if [[ "$rc" -ne 0 ]]; then
      FAILED=$((FAILED + 1))
    fi
    echo "| $step | $rc | $log |"
  done < "$REPORT_DIR/${STAMP}-results.tsv"
  echo
  echo "Summary: total=$TOTAL failed=$FAILED"
} > "$MD_REPORT"

{
  echo "{"
  echo "  \"generated_at_utc\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\","
  echo "  \"strict\": $([[ "$STRICT" == "true" ]] && echo true || echo false),"
  echo "  \"with_ssh\": $([[ "$WITH_SSH" == "true" ]] && echo true || echo false),"
  echo "  \"results\": ["
  first=true
  while IFS='|' read -r step rc log; do
    if [[ "$first" == "true" ]]; then
      first=false
    else
      echo ","
    fi
    printf '    {"step":"%s","exit_code":%s,"log":"%s"}' "$step" "$rc" "$log"
  done < "$REPORT_DIR/${STAMP}-results.tsv"
  echo
  echo "  ]"
  echo "}"
} > "$JSON_REPORT"

cp -f "$MD_REPORT" "$REPORT_DIR/last-readiness.md"
cp -f "$JSON_REPORT" "$REPORT_DIR/last-readiness.json"

if [[ "$FAILED" -gt 0 ]]; then
  echo "[suite] completed with failures. report=$MD_REPORT"
  exit 1
fi

echo "[suite] all checks passed. report=$MD_REPORT"

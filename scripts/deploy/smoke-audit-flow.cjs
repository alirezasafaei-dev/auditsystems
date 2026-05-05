#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const https = require('https');

const BASE_URL = process.env.AUDIT_SMOKE_BASE_URL || 'https://audit.alirezasafaeisystems.ir';
const TARGET_URL = process.env.AUDIT_SMOKE_TARGET_URL || 'https://example.com';
const POLL_INTERVAL_MS = Number(process.env.AUDIT_SMOKE_POLL_MS || '1500');
const MAX_POLL_ATTEMPTS = Number(process.env.AUDIT_SMOKE_MAX_ATTEMPTS || '20');

function requestJson(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        method: options.method || 'GET',
        hostname: new URL(BASE_URL).hostname,
        port: 443,
        path,
        protocol: 'https:',
        headers: options.headers,
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => {
          raw += chunk;
        });
        res.on('end', () => {
          let body;
          try {
            body = raw ? JSON.parse(raw) : null;
          } catch {
            body = raw;
          }
          resolve({ status: res.statusCode ?? 0, body, raw });
        });
      }
    );

    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

function randomIpv4() {
  return `198.51.100.${Math.floor(Math.random() * 200) + 1}`;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  const runBody = JSON.stringify({ url: TARGET_URL, depth: 'QUICK' });
  const createReq = await requestJson('/api/audit/runs', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': randomIpv4(),
      'user-agent': 'audit-smoke-bot'
    },
    body: runBody
  });

  if (createReq.status !== 200) {
    console.error('smoke_create_failed', createReq.status, createReq.body);
    process.exit(1);
  }

  const { runId, token } = createReq.body;
  if (!runId || !token) {
    console.error('smoke_missing_run_or_token', createReq.body);
    process.exit(1);
  }

  let finalStatus = null;
  for (let i = 0; i < MAX_POLL_ATTEMPTS; i++) {
    const statusReq = await requestJson(`/api/audit/runs/${runId}`);
    finalStatus = statusReq.body?.status ?? null;

    if (statusReq.status !== 200) {
      console.error('smoke_poll_failed', statusReq.status, statusReq.body);
      process.exit(1);
    }

    if (finalStatus !== 'QUEUED') {
      break;
    }

    await sleep(POLL_INTERVAL_MS);
  }

  if (finalStatus === 'QUEUED') {
    console.error('smoke_still_queued', runId);
    process.exit(1);
  }

  const reportReq = await requestJson(`/api/reports/${token}`);
  if (reportReq.status !== 200) {
    console.error('smoke_report_failed', reportReq.status, reportReq.body);
    process.exit(1);
  }

  const reportStatus = reportReq.body?.status;
  if (!['SUCCEEDED', 'FAILED'].includes(reportStatus)) {
    console.error('smoke_report_not_terminal', reportStatus);
    process.exit(1);
  }

  console.log('smoke_ok', JSON.stringify({ runId, token, status: reportStatus, findingsCount: reportReq.body?.findings?.length ?? 0 }));
})();

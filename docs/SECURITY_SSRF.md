# Security and SSRF

## Implemented Controls

### URL and SSRF Controls
- Protocol allowlist: `http/https`
- Private/reserved network blocking for IPv4/IPv6
- Blocked local hostnames (`localhost`, `.local`, `.internal`, ...)
- DNS rebinding protection (`verifyDnsPublicIp`)
- URL credential stripping, fragment removal, max-length guard

Reference: `src/lib/normalizeAuditTargetUrl.ts`

### Rate Limiting
- Distributed-capable limiter using Upstash Redis REST API
- Automatic fallback to DB-window limiter when Redis is unavailable

Reference:
- `src/lib/rateLimit.ts`
- `src/app/api/audit/runs/route.ts`

### Token and Access Controls
- Share token validity (`revokedAt`, `expiresAt`) enforcement
- Signed download token for PDF access (`HMAC`)
- Paid-order verification before PDF delivery

Reference:
- `src/lib/reportShare.ts`
- `src/lib/downloadToken.ts`
- `src/app/api/pdf/[token]/route.ts`

### Operational Observability
- `x-request-id` response header on API routes
- Structured logs for major flows
- `/api/metrics` endpoint for request count and latency buckets

Reference:
- `src/lib/observability.ts`
- `src/lib/metrics.ts`
- `src/app/api/metrics/route.ts`

## Environment Secrets
- `IP_HASH_SALT`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `DOWNLOAD_TOKEN_SECRET`
- `ZARINPAL_MERCHANT_ID`

Set all of the above in production with strong random values.

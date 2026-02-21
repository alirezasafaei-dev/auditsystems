# Routes (Implemented)

این فایل وضعیت واقعی مسیرهای پیاده‌سازی‌شده را پوشش می‌دهد.

## Pages
- `GET /`
- `GET /audit`
- `GET /audit/r/[token]`
- `GET /audit/r/[token]/unlock`
- `GET /audit/r/[token]/success`
- `GET /failed`

## API

### `POST /api/audit/runs`
Create audit run + share token + enqueue job.

Request body:
```json
{ "url": "https://example.com", "depth": "QUICK" }
```

Success response (`200`):
```json
{ "runId": "...", "token": "...", "status": "QUEUED", "requestId": "..." }
```

Error codes:
- `400`: `INVALID_URL_*`, `SSRF_BLOCKED_*`
- `429`: `RATE_LIMITED`
- `500`: `INTERNAL_ERROR`

Notes:
- Rate limit: 5 run در 10 دقیقه برای هر IP hash.
- Response header: `x-request-id`, `Cache-Control: no-store`.

### `GET /api/audit/runs/[id]`
Get run status.

Success response (`200`):
```json
{
  "id": "...",
  "status": "QUEUED|RUNNING|SUCCEEDED|FAILED",
  "startedAt": "...",
  "finishedAt": "...",
  "errorCode": null,
  "errorMessage": null,
  "requestId": "..."
}
```

Error:
- `404`: `NOT_FOUND`

### `GET /api/reports/[token]`
Get report (summary + findings) by share token.

Success response (`200`):
```json
{
  "run": {
    "id": "...",
    "url": "...",
    "normalizedUrl": "...",
    "status": "SUCCEEDED",
    "summary": {}
  },
  "findings": [],
  "status": "SUCCEEDED",
  "requestId": "..."
}
```

Error:
- `404`: `NOT_FOUND` (invalid/revoked/expired token)

### `POST /api/reports/[token]/unlock`
Capture lead + create mock order.

Request body:
```json
{ "email": "user@example.com" }
```

Success response (`200`):
- New order:
```json
{ "leadId": "...", "orderId": "...", "reused": false, "requestId": "..." }
```
- Reused order:
```json
{ "orderId": "...", "reused": true, "requestId": "..." }
```

Errors:
- `400`: `INVALID_EMAIL`
- `404`: `NOT_FOUND`
- `409`: `REPORT_NOT_READY`
- `500`: `INTERNAL_ERROR`

## Security & Caching
همه APIهای حساس از `Cache-Control: no-store` استفاده می‌کنند.

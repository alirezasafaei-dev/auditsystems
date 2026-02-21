# Routes (Implemented)

## Pages
- `GET /`
- `GET /audit`
- `GET /audit/r/[token]`
- `GET /audit/r/[token]/unlock`
- `GET /audit/r/[token]/success`
- `GET /failed`
- `GET /guides`
- `GET /guides/[slug]`
- `GET /pillar/iran-readiness-audit`
- `GET /sample-report`

## SEO Metadata Routes
- `GET /sitemap.xml`
- `GET /robots.txt`

## API

### `POST /api/audit/runs`
Creates run + token + job enqueue.

### `GET /api/audit/runs/[id]`
Returns run status.

### `GET /api/reports/[token]`
Returns report summary + findings.

### `POST /api/reports/[token]/unlock`
Legacy unlock endpoint (lead/order bootstrap).

### `POST /api/orders`
Primary order creation endpoint with provider selection and checkout URL.

### `GET|POST /api/payments/callback`
Payment verification callback endpoint.

### `GET /api/pdf/[token]?dl=...`
Returns paid PDF when signed download token and paid order are valid.

### `GET /api/metrics`
Prometheus-style operational metrics.

## Security and Caching
- Sensitive API responses are `Cache-Control: no-store`.
- API responses include `x-request-id`.

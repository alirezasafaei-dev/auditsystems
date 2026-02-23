# SEO Measurement & Automation Playbook

## Scope
این سند مدل اندازه‌گیری SEO-to-conversion را برای مسیرهای اصلی همین repo تعریف می‌کند.

## KPI Layers
- Visibility: GSC clicks, impressions, CTR, average position
- Index Quality: indexed صفحات هدف / صفحات هدف کل
- Engagement: guide views, report views
- Conversion: `audit_run_created`, `unlock_started`, `payment_success`
- Assisted Conversion: conversionهایی که touchpoint سئو داشته‌اند

## Event Taxonomy (GA4/GTM)
- `seo_landing_view`
  - params: `locale`, `path`, `referrer_type`
- `seo_guide_view`
  - params: `locale`, `slug`
- `seo_audit_start`
  - params: `locale`, `depth`
- `seo_audit_run_created`
  - params: `locale`, `depth`, `run_status`
- `seo_report_view`
  - params: `locale`, `run_status`
- `seo_unlock_started`
  - params: `locale`, `provider`
- `seo_payment_success`
  - params: `locale`, `provider`

## Consent Gate
- رویدادها فقط وقتی ارسال می‌شوند که مقدار زیر در browser set شود:
  - `localStorage["asdev_analytics_consent"] = "granted"`
- در نبود consent، eventها ارسال نمی‌شوند.

## Dashboard Requirements
- Segment by locale (`fa`, `en`)
- Segment by page-type (home, guides, audit, report, unlock)
- Weekly snapshots:
  - CTR by template
  - Top pages by impressions
  - Conversions assisted by organic sessions

## Automation Hooks
- SEO audit automation:
  - `pnpm run seo:audit` (strict)
  - `pnpm run seo:audit:dry`
- Output artifacts:
  - `logs/seo/last-run.json`
  - `logs/seo/last-run.md`

## QA Gate (Before Release)
- رویدادهای کلیدی در preview دستی تست شوند.
- UTM noise در canonical مسیرها وارد نشود.
- KPI dashboard برای هر دو locale داده دریافت کند.

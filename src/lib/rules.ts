import { AuditContext, Finding } from "./types";

function getHeader(headers: Record<string, string>, name: string): string | undefined {
  const key = Object.keys(headers).find((k) => k.toLowerCase() === name.toLowerCase());
  return key ? headers[key] : undefined;
}

function findUrls(resources: AuditContext["resources"], pattern: RegExp): string[] {
  return resources.filter((r) => pattern.test(r.url)).map((r) => r.url);
}

export function evaluateAuditRules(ctx: AuditContext): Finding[] {
  const findings: Finding[] = [];

  const thirdPartyFonts = ctx.resources.filter(
    (r) =>
      r.isThirdParty &&
      (r.kind === "font" || r.kind === "style") &&
      /(fonts\.googleapis|fonts\.gstatic|\.woff2?$)/i.test(r.url)
  );

  if (thirdPartyFonts.length > 0) {
    findings.push({
      code: "THIRD_PARTY_FONTS",
      category: "RESILIENCE",
      severity: "HIGH",
      title: "Third-party fonts detected",
      recommendation: "Self-host critical fonts and preload only what is required.",
      evidence: { count: thirdPartyFonts.length, examples: thirdPartyFonts.slice(0, 8).map((x) => x.url) }
    });
  }

  const blockingHeadScripts = ctx.resources.filter(
    (r) =>
      r.kind === "script" &&
      r.isThirdParty &&
      r.inHead === true &&
      r.attrs?.async !== true &&
      r.attrs?.defer !== true
  );

  if (blockingHeadScripts.length > 0) {
    findings.push({
      code: "THIRD_PARTY_CRITICAL_JS",
      category: "RESILIENCE",
      severity: "HIGH",
      title: "Blocking third-party JavaScript in head",
      recommendation: "Use async/defer, load later, or self-host critical scripts.",
      evidence: { count: blockingHeadScripts.length, examples: blockingHeadScripts.slice(0, 8).map((x) => x.url) }
    });
  }

  const recaptchaUrls = findUrls(ctx.resources, /(google\.com\/recaptcha|gstatic\.com\/recaptcha|recaptcha)/i);
  if (recaptchaUrls.length > 0) {
    findings.push({
      code: "RECAPTCHA_DEPENDENCY",
      category: "RESILIENCE",
      severity: "HIGH",
      title: "reCAPTCHA dependency detected",
      recommendation: "Add server-side anti-abuse fallback and graceful degradation path.",
      evidence: { count: recaptchaUrls.length, examples: recaptchaUrls.slice(0, 8) }
    });
  }

  if (ctx.target.protocol === "https:") {
    const mixedContent = ctx.resources.filter((r) => r.url.startsWith("http://"));
    if (mixedContent.length > 0) {
      findings.push({
        code: "MIXED_CONTENT",
        category: "SECURITY",
        severity: "HIGH",
        title: "Mixed content detected",
        recommendation: "Serve all resources over HTTPS and consider upgrade-insecure-requests in CSP.",
        evidence: { count: mixedContent.length, examples: mixedContent.slice(0, 8).map((x) => x.url) }
      });
    }
  }

  if (!getHeader(ctx.main.headers, "content-security-policy")) {
    findings.push({
      code: "NO_CSP_HEADER",
      category: "SECURITY",
      severity: "MEDIUM",
      title: "Missing CSP header",
      recommendation: "Deploy a baseline CSP and tighten progressively.",
      evidence: { header: "content-security-policy", present: false }
    });
  }

  if (ctx.target.protocol === "https:" && !getHeader(ctx.main.headers, "strict-transport-security")) {
    findings.push({
      code: "NO_HSTS",
      category: "SECURITY",
      severity: "MEDIUM",
      title: "Missing HSTS header",
      recommendation: "Enable Strict-Transport-Security with an appropriate max-age.",
      evidence: { header: "strict-transport-security", present: false }
    });
  }

  const staticAssetNoCachePartial = ctx.resources.some(
    (r) => (r.kind === "script" || r.kind === "style") && !/[.-][a-f0-9]{8,}\./i.test(r.url)
  );
  if (staticAssetNoCachePartial) {
    findings.push({
      code: "STATIC_ASSETS_NO_LONG_CACHE",
      category: "PERFORMANCE",
      severity: "LOW",
      title: "Potentially non-fingerprinted static assets",
      recommendation: "Use hashed filenames and long immutable cache-control for static assets.",
      evidence: { partial: true }
    });
  }

  if ((ctx.main.metrics?.ttfbMs ?? 0) > 1200 || (ctx.main.metrics?.responseMs ?? 0) > 2000) {
    findings.push({
      code: "SLOW_TTFB_OR_SERVER_RESPONSE",
      category: "PERFORMANCE",
      severity: "MEDIUM",
      title: "Server response appears slow",
      recommendation: "Improve backend response time and caching strategy.",
      evidence: { partial: true, metrics: ctx.main.metrics }
    });
  }

  if (ctx.resources.length > 80) {
    findings.push({
      code: "TOO_MANY_REQUESTS_OR_HEAVY_PAGE",
      category: "PERFORMANCE",
      severity: "MEDIUM",
      title: "Page appears request-heavy",
      recommendation: "Reduce request count and payload size for critical rendering path.",
      evidence: { partial: true, resourceCount: ctx.resources.length }
    });
  }

  if (!ctx.seo.title || !ctx.seo.metaDescription || !ctx.seo.canonical || !ctx.seo.openGraph) {
    findings.push({
      code: "SEO_BASICS_MISSING",
      category: "SEO",
      severity: "LOW",
      title: "Basic SEO tags are incomplete",
      recommendation: "Add title, meta description, canonical URL, and Open Graph tags.",
      evidence: { partial: true, seo: ctx.seo }
    });
  }

  return findings;
}

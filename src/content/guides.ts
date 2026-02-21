export type Guide = {
  slug: string;
  title: string;
  summary: string;
  sections: string[];
};

export const guides: Guide[] = [
  {
    slug: "iran-website-performance-checklist",
    title: "Iran Website Performance Checklist",
    summary: "A practical checklist to reduce latency and improve perceived speed.",
    sections: ["Critical rendering path", "Compression and caching", "Third-party budget", "Monitoring"]
  },
  {
    slug: "fix-core-web-vitals-fast",
    title: "Fix Core Web Vitals Fast",
    summary: "How to diagnose and improve LCP, CLS, and INP in production.",
    sections: ["LCP bottlenecks", "CLS root causes", "INP interaction profiling", "Regression gates"]
  },
  {
    slug: "technical-seo-audit-template",
    title: "Technical SEO Audit Template",
    summary: "Structured template for indexing, crawlability, and metadata quality.",
    sections: ["Indexability", "Canonical strategy", "Structured data", "Sitemap quality"]
  },
  {
    slug: "security-headers-for-growth-sites",
    title: "Security Headers for Growth Sites",
    summary: "Recommended HTTP security headers without hurting marketing workflows.",
    sections: ["CSP strategy", "HSTS rollout", "Frame and content protections", "Verification"]
  },
  {
    slug: "ssrf-safe-url-processing",
    title: "SSRF-Safe URL Processing",
    summary: "Defensive URL normalization and DNS rebinding protections.",
    sections: ["Protocol restrictions", "Private network blocking", "DNS validation", "Operational safeguards"]
  },
  {
    slug: "third-party-script-risk-audit",
    title: "Third-Party Script Risk Audit",
    summary: "Audit and control script suppliers affecting privacy and performance.",
    sections: ["Inventory extraction", "Risk scoring", "Deferral strategy", "Vendor policy"]
  },
  {
    slug: "production-observability-baseline",
    title: "Production Observability Baseline",
    summary: "Set up actionable logs, metrics, and alerts for web funnels.",
    sections: ["Request tracing", "SLIs and SLOs", "Alerting strategy", "Incident evidence"]
  },
  {
    slug: "unlock-funnel-conversion-ops",
    title: "Unlock Funnel Conversion Ops",
    summary: "Design lead-to-order conversion flow with robust backend events.",
    sections: ["Lead capture integrity", "Order lifecycle", "Callback handling", "Revenue analytics"]
  },
  {
    slug: "audit-worker-reliability-patterns",
    title: "Audit Worker Reliability Patterns",
    summary: "Queue leases, retry strategy, and timeout controls for background jobs.",
    sections: ["Lease semantics", "Backoff tuning", "Poison jobs", "Runbook practices"]
  },
  {
    slug: "programmatic-seo-content-system",
    title: "Programmatic SEO Content System",
    summary: "Build scalable guide hubs with quality governance and schema discipline.",
    sections: ["Topic clustering", "Template constraints", "Internal linking", "Quality review"]
  }
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

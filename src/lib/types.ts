export type ResourceKind = "script" | "style" | "font" | "img" | "preload" | "other";

export type ExtractedResource = {
  url: string;
  host: string;
  kind: ResourceKind;
  isThirdParty: boolean;
  inHead?: boolean;
  attrs?: Record<string, string | boolean>;
};

export type FindingCategory = "RESILIENCE" | "PERFORMANCE" | "SEO" | "SECURITY" | "UX";
export type FindingSeverity = "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type FindingCode =
  | "THIRD_PARTY_FONTS"
  | "THIRD_PARTY_CRITICAL_JS"
  | "RECAPTCHA_DEPENDENCY"
  | "MIXED_CONTENT"
  | "NO_CSP_HEADER"
  | "NO_HSTS"
  | "STATIC_ASSETS_NO_LONG_CACHE"
  | "SLOW_TTFB_OR_SERVER_RESPONSE"
  | "TOO_MANY_REQUESTS_OR_HEAVY_PAGE"
  | "SEO_BASICS_MISSING";

export type Finding = {
  code: FindingCode;
  category: FindingCategory;
  severity: FindingSeverity;
  title: string;
  description?: string;
  recommendation: string;
  evidence?: Record<string, unknown>;
};

export type SeoBasics = {
  title: boolean;
  metaDescription: boolean;
  canonical: boolean;
  openGraph: boolean;
};

export type AuditContext = {
  target: {
    normalizedUrl: string;
    origin: string;
    host: string;
    protocol: "http:" | "https:";
    firstPartyHosts: Set<string>;
  };
  main: {
    finalUrl: string;
    status: number;
    headers: Record<string, string>;
    html: string;
    metrics?: {
      ttfbMs?: number;
      responseMs?: number;
    };
  };
  resources: ExtractedResource[];
  seo: SeoBasics;
};

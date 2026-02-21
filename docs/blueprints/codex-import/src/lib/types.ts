// 01-audit/src/lib/types.ts

export type FindingCategory = "RESILIENCE" | "PERFORMANCE" | "SEO" | "SECURITY" | "UX";
export type FindingSeverity = "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type Finding = {
  code: string;
  category: FindingCategory;
  severity: FindingSeverity;
  title: string;
  description?: string;
  recommendation: string;
  evidence?: Record<string, any>;
};

export type ExtractedResource = {
  url: string;
  kind: "script" | "style" | "font" | "img" | "other";
  host: string;
  isThirdParty: boolean;

  // extra hints
  inHead?: boolean;
  attrs?: Record<string, string>;
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
  };
  resources: ExtractedResource[];
  lighthouse?: any;
};

// 01-audit/src/lib/summary.types.ts

export type AuditSummaryV1 = {
  schema: "asdev.audit.summary.v1";
  generatedAt: string;

  run: {
    id: string;
    inputUrl: string;
    normalizedUrl: string;
    finalUrl?: string;
    depth?: "QUICK" | "DEEP";
    status: "SUCCEEDED" | "FAILED";
    durationMs?: number;
  };

  scores?: {
    performance?: number;
    accessibility?: number;
    bestPractices?: number;
    seo?: number;
  };

  vitals?: {
    lcpMs?: number;
    inpMs?: number;
    cls?: number;
    ttfbMs?: number;
  };

  dependencies: {
    firstPartyHosts: string[];
    thirdParty: {
      count: number;
      hosts: Array<{
        host: string;
        requestCount?: number;
        kinds?: Record<string, number>;
        tags?: string[];
        examples?: string[];
      }>;
      highRiskHosts: string[];
    };
  };

  security: {
    https: boolean;
    mixedContent: { count: number; examples: string[] };
    headers: {
      csp: "present" | "missing";
      hsts: "present" | "missing";
      xContentTypeOptions: "present" | "missing";
      referrerPolicy: "present" | "missing";
      permissionsPolicy: "present" | "missing";
    };
  };

  seoBasics: {
    title: "present" | "missing";
    metaDescription: "present" | "missing";
    canonical: "present" | "missing";
    openGraph: "present" | "missing";
  };

  findings: Array<{
    code: string;
    category: "RESILIENCE" | "PERFORMANCE" | "SEO" | "SECURITY" | "UX";
    severity: "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    title: string;
    recommendation: string;
    evidence?: any;
  }>;

  highlights: {
    topFixes: Array<{
      code: string;
      impact: "HIGH" | "MEDIUM" | "LOW";
      effort: "LOW" | "MEDIUM" | "HIGH";
      why: string;
      steps: string[];
    }>;
  };
};

import type { Metadata } from "next";
import AuditPageClientEn from "./AuditPageClient";
import { buildPageMetadata } from "../../../lib/seoMeta";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  path: "/audit",
  title: "Start a Technical Website Audit",
  description: "Submit your website URL and generate a technical SEO, performance, and security audit report.",
  keywords: ["website audit", "SEO audit", "performance audit", "security audit"]
});

export default function AuditPageEn() {
  return <AuditPageClientEn />;
}


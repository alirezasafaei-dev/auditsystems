import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata } from "../../../lib/seoMeta";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  path: "/sample-report",
  title: "Sample Report Entry",
  description: "Public sample entry for the audit report flow and delivery experience.",
  keywords: ["sample audit report", "technical SEO report sample"]
});

export default function SampleReportPageEn() {
  return (
    <main className="grid">
      <section className="card">
        <h1>Sample Report</h1>
        <p>Use this page as a public sample entry point for marketing and SEO.</p>
      </section>

      <section className="card">
        <p>To view a real report, create a run in <Link href="/en/audit">/en/audit</Link> and open the generated token URL.</p>
      </section>
    </main>
  );
}

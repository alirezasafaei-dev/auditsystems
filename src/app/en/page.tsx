import Link from "next/link";
import type { Metadata } from "next";

const baseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Website Audit Platform for Growth Teams",
  description: "Technical audits, SEO diagnostics, security checks, and conversion-ready report delivery.",
  alternates: {
    canonical: `${baseUrl}/en`,
    languages: {
      "fa-IR": `${baseUrl}/`,
      en: `${baseUrl}/en`
    }
  }
};

export default function HomePageEn() {
  return (
    <main>
      <section className="card hero">
        <h1>Website Audit Platform for Growth Teams</h1>
        <p>Run technical audits, analyze findings, and convert reports into paid delivery workflows with production-ready automation.</p>
        <div className="hero-actions">
          <Link className="button" href="/en/audit">Start New Audit</Link>
          <Link className="button secondary" href="/en/guides">Explore Guides</Link>
        </div>
      </section>

      <section className="kpi-grid">
        <article className="kpi"><strong>17/17</strong><p>Roadmap checks passing in automation</p></article>
        <article className="kpi"><strong>10</strong><p>Implemented API routes</p></article>
        <article className="kpi"><strong>20+</strong><p>SEO-ready static and dynamic pages in two languages</p></article>
        <article className="kpi"><strong>4</strong><p>CI pipelines for roadmap, docs, production readiness, and main gate</p></article>
      </section>

      <section className="grid-2">
        <article className="card grid">
          <h2>Core Flows</h2>
          <p>Audit run creation, queued worker execution, tokenized report sharing, checkout callbacks, and paid PDF delivery.</p>
          <Link href="/en/sample-report">Open Sample Report Entry</Link>
        </article>
        <article className="card grid">
          <h2>Operational Tooling</h2>
          <p>Roadmap automation, docs generation, payment preflight checks, and production readiness workflow are fully integrated.</p>
          <Link href="/en/pillar/iran-readiness-audit">Read Platform Pillar</Link>
        </article>
      </section>
    </main>
  );
}

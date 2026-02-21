import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="card hero">
        <h1>Website Audit Platform for Growth Teams</h1>
        <p>
          Run technical audits, analyze findings, and convert reports into paid delivery workflows with production-ready automation.
        </p>
        <div className="hero-actions">
          <Link className="button" href="/audit">
            Start New Audit
          </Link>
          <Link className="button secondary" href="/guides">
            Explore Guides
          </Link>
        </div>
      </section>

      <section className="kpi-grid">
        <article className="kpi">
          <strong>17/17</strong>
          <p>Roadmap checks passing in automation</p>
        </article>
        <article className="kpi">
          <strong>8</strong>
          <p>Implemented API routes</p>
        </article>
        <article className="kpi">
          <strong>10</strong>
          <p>SEO-ready static and dynamic pages</p>
        </article>
        <article className="kpi">
          <strong>3</strong>
          <p>CI pipelines for roadmap, docs, production readiness</p>
        </article>
      </section>

      <section className="grid-2">
        <article className="card grid">
          <h2>Core Flows</h2>
          <p>Audit run creation, queued worker execution, tokenized report sharing, checkout callbacks, and paid PDF delivery.</p>
          <Link href="/sample-report">Open Sample Report Entry</Link>
        </article>
        <article className="card grid">
          <h2>Operational Tooling</h2>
          <p>Roadmap automation, docs generation, payment preflight checks, and production readiness workflow are all integrated.</p>
          <Link href="/pillar/iran-readiness-audit">Read Platform Pillar</Link>
        </article>
      </section>
    </main>
  );
}

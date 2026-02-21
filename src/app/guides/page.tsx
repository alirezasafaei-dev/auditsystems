import Link from "next/link";
import { guides } from "../../content/guides";

export default function GuidesIndexPage() {
  return (
    <main>
      <section className="card hero">
        <h1>Growth & Technical Guides</h1>
        <p>Curated playbooks for audit quality, web performance, security posture, and conversion operations.</p>
      </section>

      <section className="guide-grid">
        {guides.map((guide) => (
          <article key={guide.slug} className="guide-item">
            <h2>{guide.title}</h2>
            <p>{guide.summary}</p>
            <p>
              <Link href={`/guides/${guide.slug}`}>Read Guide</Link>
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}

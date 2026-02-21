import Link from "next/link";
import { guides } from "../../content/guides";

export default function GuidesIndexPage() {
  return (
    <main className="grid">
      <section className="card">
        <h1>Guides</h1>
        <p>Programmatic SEO guides for audit, performance, and security operations.</p>
      </section>

      <section className="card">
        <ul>
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

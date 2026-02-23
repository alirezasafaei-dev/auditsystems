import Link from "next/link";
import { getGuides } from "../../content/guides";
import type { Metadata } from "next";
import { buildPageMetadata } from "../../lib/seoMeta";

const guides = getGuides("fa");

export const metadata: Metadata = buildPageMetadata({
  locale: "fa",
  path: "/guides",
  title: "راهنماهای رشد و فنی",
  description: "راهنماهای عملی برای سئو، کارایی، امنیت و بهبود نرخ تبدیل.",
  keywords: ["راهنمای سئو", "راهنمای کارایی وب", "راهنمای امنیت وب"]
});

export default function GuidesIndexPage() {
  return (
    <main>
      <section className="card hero">
        <h1>راهنماهای رشد و فنی</h1>
        <p>Playbookهای کاربردی برای کیفیت audit، کارایی وب، وضعیت امنیت و عملیات تبدیل.</p>
      </section>

      <section className="guide-grid">
        {guides.map((guide) => (
          <article key={guide.slug} className="guide-item">
            <h2>{guide.title}</h2>
            <p>{guide.summary}</p>
            <p>
              <Link href={`/guides/${guide.slug}`}>مطالعه راهنما</Link>
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}

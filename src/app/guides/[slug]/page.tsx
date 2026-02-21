import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuideBySlug, guides } from "../../../content/guides";

export async function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) {
    return { title: "Guide Not Found" };
  }

  const baseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";

  return {
    title: `${guide.title} | asdev-audit-ir`,
    description: guide.summary,
    alternates: {
      canonical: `${baseUrl}/guides/${guide.slug}`
    },
    openGraph: {
      title: guide.title,
      description: guide.summary,
      type: "article",
      url: `${baseUrl}/guides/${guide.slug}`
    }
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <main className="grid">
      <section className="card">
        <h1>{guide.title}</h1>
        <p>{guide.summary}</p>
      </section>

      <section className="card">
        <h2>Sections</h2>
        <ul>
          {guide.sections.map((section) => (
            <li key={section}>{section}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

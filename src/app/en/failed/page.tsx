import Link from "next/link";
import type { Metadata } from "next";
import { buildNoIndexMetadata } from "../../../lib/seoMeta";

export const metadata: Metadata = buildNoIndexMetadata({
  title: "Audit Failed",
  description: "Audit execution error page. This route must stay non-indexable."
});

export default function FailedPageEn() {
  return (
    <main>
      <section className="card">
        <h1>Audit failed</h1>
        <p>The audit run failed. Please retry with a reachable URL.</p>
        <p>
          <Link href="/en/audit">Retry Audit</Link>
        </p>
      </section>
    </main>
  );
}

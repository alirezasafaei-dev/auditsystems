import Link from "next/link";
import type { Metadata } from "next";
import { buildNoIndexMetadata } from "../../lib/seoMeta";

export const metadata: Metadata = buildNoIndexMetadata({
  title: "اجرای Audit ناموفق",
  description: "صفحه خطای اجرای audit. این مسیر نباید ایندکس شود."
});

export default function FailedPage() {
  return (
    <main>
      <section className="card">
        <h1>اجرای Audit ناموفق بود</h1>
        <p>این run با خطا متوقف شد. لطفاً با یک URL در دسترس دوباره تلاش کنید.</p>
        <p>
          <Link href="/audit">تلاش مجدد</Link>
        </p>
      </section>
    </main>
  );
}

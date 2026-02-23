import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata } from "../../lib/seoMeta";

export const metadata: Metadata = buildPageMetadata({
  locale: "fa",
  path: "/sample-report",
  title: "ورودی گزارش نمونه",
  description: "نمونه ورود به گزارش audit برای نمایش مسیر ارزش و تحویل گزارش.",
  keywords: ["گزارش نمونه", "audit report sample", "سئو"]
});

export default function SampleReportPage() {
  return (
    <main className="grid">
      <section className="card">
        <h1>گزارش نمونه</h1>
        <p>از این صفحه به‌عنوان ورودی عمومی نمونه برای بازاریابی و سئو استفاده کنید.</p>
      </section>

      <section className="card">
        <p>
          برای مشاهده گزارش واقعی، یک run در <Link href="/audit">/audit</Link> ایجاد کنید و URL ساخته‌شده را باز کنید.
        </p>
      </section>
    </main>
  );
}

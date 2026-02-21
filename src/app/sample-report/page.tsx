import Link from "next/link";

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

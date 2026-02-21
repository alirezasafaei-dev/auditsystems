import Link from "next/link";

export default async function SuccessPage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ orderId?: string; dl?: string; downloadUrl?: string }> }) {
  const { token } = await params;
  const query = await searchParams;

  const orderId = query.orderId ?? null;
  const dl = query.dl ?? null;
  const directUrl = query.downloadUrl ?? null;
  const downloadHref = directUrl ?? (dl ? `/api/pdf/${token}?dl=${encodeURIComponent(dl)}` : null);

  return (
    <main>
      <section className="card">
        <h1>پرداخت موفق</h1>
        <p>سفارش شما با موفقیت تکمیل شد.</p>
        {orderId ? <p>شناسه سفارش: {orderId}</p> : null}
        {downloadHref ? (
          <p>
            <Link href={downloadHref}>دانلود گزارش PDF</Link>
          </p>
        ) : (
          <p>لینک دانلود پس از تایید پرداخت در دسترس خواهد بود.</p>
        )}
      </section>
    </main>
  );
}

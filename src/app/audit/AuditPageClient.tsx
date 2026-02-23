"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { trackSeoEvent } from "../../lib/analytics";

export default function AuditPageClient() {
  const [url, setUrl] = useState("https://example.com");
  const [depth, setDepth] = useState<"QUICK" | "DEEP">("QUICK");
  const [message, setMessage] = useState("");
  const [reportPath, setReportPath] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    trackSeoEvent("seo_audit_page_view", { locale: "fa", path: "/audit" });
  }, []);

  function toUserMessage(errorCode: string): string {
    if (errorCode === "RATE_LIMITED") return "تعداد درخواست‌ها زیاد است. چند دقیقه بعد دوباره تلاش کنید.";
    if (errorCode === "INVALID_URL_EMPTY") return "آدرس وارد نشده است.";
    if (errorCode === "INVALID_URL_TOO_LONG") return "آدرس خیلی طولانی است.";
    if (errorCode.startsWith("INVALID_URL_")) return "آدرس معتبر نیست. لطفا URL کامل و عمومی وارد کنید.";
    if (errorCode.startsWith("SSRF_BLOCKED_")) return "این آدرس قابل بررسی نیست. لطفا یک دامنه عمومی و در دسترس وارد کنید.";
    return "خطا در ثبت درخواست. دوباره تلاش کنید.";
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    trackSeoEvent("seo_audit_start", { locale: "fa", depth });
    setIsSubmitting(true);
    setMessage("در حال ثبت درخواست تحلیل...");
    setReportPath(null);

    try {
      const response = await fetch("/api/audit/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, depth })
      });

      const body = await response.json();
      if (!response.ok) {
        setMessage(toUserMessage(String(body.error ?? "")));
        return;
      }

      const nextPath = `/audit/r/${body.token}`;
      setReportPath(nextPath);
      setMessage(`Run ایجاد شد: ${body.runId}`);
      trackSeoEvent("seo_audit_run_created", { locale: "fa", depth, run_status: String(body.status ?? "QUEUED") });
    } catch {
      setMessage("ارتباط با سرور برقرار نشد. دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <section className="card hero">
        <h1>ایجاد Audit جدید</h1>
        <p>آدرس هدف را ارسال کنید تا token گزارش تولید شود. اجرای worker بعد از enqueue به‌صورت خودکار شروع می‌شود.</p>
      </section>

      <section className="grid-2">
        <section className="card">
          <form onSubmit={onSubmit} className="grid">
            <label>
              آدرس هدف
              <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} required />
            </label>
            <label>
              عمق تحلیل
              <select value={depth} onChange={(e) => setDepth(e.target.value as "QUICK" | "DEEP")}>
                <option value="QUICK">سریع (Quick)</option>
                <option value="DEEP">عمیق (Deep)</option>
              </select>
            </label>
            <p>Quick برای تحلیل سریع و Deep برای بررسی عمیق‌تر مسیرها مناسب است.</p>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "در حال ارسال..." : "ثبت Audit"}
            </button>
          </form>
        </section>

        <section className="card grid">
          <h2>وضعیت Run</h2>
          <p role="status" aria-live="polite">
            {message || "هنوز درخواستی ثبت نشده است."}
          </p>
          {reportPath ? (
            <p>
              <Link href={reportPath}>باز کردن گزارش</Link>
            </p>
          ) : null}
        </section>
      </section>
    </main>
  );
}

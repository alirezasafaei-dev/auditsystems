import type { Metadata } from "next";
import AuditPageClient from "./AuditPageClient";
import { buildPageMetadata } from "../../lib/seoMeta";

export const metadata: Metadata = buildPageMetadata({
  locale: "fa",
  path: "/audit",
  title: "شروع Audit فنی سایت",
  description: "URL سایت را ثبت کنید و گزارش فنی، سئو، امنیت و کارایی را دریافت کنید.",
  keywords: ["audit سایت", "گزارش سئو", "گزارش کارایی", "گزارش امنیت"]
});

export default function AuditPage() {
  return <AuditPageClient />;
}


import { ReactNode } from "react";
import type { Metadata } from "next";
import { buildNoIndexMetadata } from "../../../../lib/seoMeta";

export const metadata: Metadata = buildNoIndexMetadata({
  title: "گزارش Audit (خصوصی)",
  description: "این مسیر برای مشاهده گزارش tokenized است و نباید ایندکس شود."
});

export default function ReportTokenLayout({ children }: { children: ReactNode }) {
  return children;
}


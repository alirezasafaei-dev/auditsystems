import { ReactNode } from "react";
import type { Metadata } from "next";
import { buildNoIndexMetadata } from "../../../../../lib/seoMeta";

export const metadata: Metadata = buildNoIndexMetadata({
  title: "Audit Report (Private)",
  description: "This tokenized report route is non-indexable."
});

export default function ReportTokenLayoutEn({ children }: { children: ReactNode }) {
  return children;
}


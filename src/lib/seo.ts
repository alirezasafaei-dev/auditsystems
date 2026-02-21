import { SeoBasics } from "./types";

export function parseSeoBasics(html: string): SeoBasics {
  return {
    title: /<title[^>]*>[^<]+<\/title>/i.test(html),
    metaDescription: /<meta\s+name=["']description["'][^>]*>/i.test(html),
    canonical: /<link\s+rel=["']canonical["'][^>]*>/i.test(html),
    openGraph: /<meta\s+property=["']og:/i.test(html)
  };
}

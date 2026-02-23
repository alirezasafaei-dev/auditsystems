import type { Metadata } from "next";
import { toAbsoluteUrl } from "./site";

export type SeoLocale = "fa" | "en";

type MetadataInput = {
  locale: SeoLocale;
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  type?: "website" | "article";
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

function normalizeRoutePath(path: string): string {
  if (!path) return "/";
  if (path === "/en") return "/";
  if (path.startsWith("/en/")) return path.slice(3) || "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function withLocale(path: string, locale: SeoLocale): string {
  if (locale === "fa") return path;
  if (path === "/") return "/en";
  return `/en${path}`;
}

export function buildLocaleAlternates(path: string, locale: SeoLocale): NonNullable<Metadata["alternates"]> {
  const normalized = normalizeRoutePath(path);
  const faPath = withLocale(normalized, "fa");
  const enPath = withLocale(normalized, "en");
  const canonical = locale === "fa" ? faPath : enPath;

  return {
    canonical: toAbsoluteUrl(canonical),
    languages: {
      "fa-IR": toAbsoluteUrl(faPath),
      en: toAbsoluteUrl(enPath),
      "x-default": toAbsoluteUrl(faPath)
    }
  };
}

export function buildPageMetadata(input: MetadataInput): Metadata {
  const ogType = input.type ?? "website";
  const canonicalPath = withLocale(normalizeRoutePath(input.path), input.locale);
  const canonical = toAbsoluteUrl(canonicalPath);

  return {
    title: input.title,
    description: input.description,
    ...(input.keywords ? { keywords: input.keywords } : {}),
    alternates: buildLocaleAlternates(input.path, input.locale),
    openGraph: {
      title: input.title,
      description: input.description,
      type: ogType,
      url: canonical,
      siteName: "Asdev Audit Platform"
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description
    }
  };
}

export function buildNoIndexMetadata(input?: { title?: string; description?: string }): Metadata {
  const metadata: Metadata = {
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        "max-image-preview": "none",
        "max-snippet": -1,
        "max-video-preview": -1
      }
    }
  };

  if (input?.title) metadata.title = input.title;
  if (input?.description) metadata.description = input.description;
  return metadata;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path)
    }))
  };
}

export function buildArticleSchema(input: {
  title: string;
  description: string;
  path: string;
  inLanguage: "fa-IR" | "en-US";
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: toAbsoluteUrl(input.path),
    inLanguage: input.inLanguage,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      "@type": "Organization",
      name: "Asdev Audit Platform"
    },
    publisher: {
      "@type": "Organization",
      name: "Asdev Audit Platform"
    }
  };
}


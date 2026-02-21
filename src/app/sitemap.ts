import { MetadataRoute } from "next";
import { guides } from "../content/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/audit",
    "/guides",
    "/sample-report",
    "/pillar/iran-readiness-audit",
    "/en",
    "/en/audit",
    "/en/guides",
    "/en/sample-report",
    "/en/pillar/iran-readiness-audit"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.7
  }));

  const guideRoutes: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.65
  }));

  const guideRoutesEn: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${baseUrl}/en/guides/${guide.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.63
  }));

  return [...staticRoutes, ...guideRoutes, ...guideRoutesEn];
}

import { MetadataRoute } from "next";
import { getAppBaseUrl } from "../lib/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getAppBaseUrl();
  const host = new URL(baseUrl).host;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/en", "/guides", "/en/guides", "/pillar", "/en/pillar", "/sample-report", "/en/sample-report", "/audit", "/en/audit", "/standards", "/en/standards"],
        disallow: ["/api/", "/audit/r/", "/en/audit/r/", "/failed", "/en/failed", "/brand/asdev-portfolio", "/en/brand/asdev-portfolio", "/asdev"]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host
  };
}

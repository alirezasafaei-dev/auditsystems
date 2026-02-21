import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/en", "/guides", "/en/guides", "/pillar", "/en/pillar", "/sample-report", "/en/sample-report"],
      disallow: ["/api/"]
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}

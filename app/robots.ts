import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Allow every crawler — including AI/answer-engine bots (GPTBot,
    // PerplexityBot, ClaudeBot, Google-Extended) which we *want* indexing
    // the site for Generative Engine Optimization.
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${SITE.creditUrl}/sitemap.xml`,
    host: SITE.creditUrl,
  };
}

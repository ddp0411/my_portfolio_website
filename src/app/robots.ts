import type { MetadataRoute } from "next";
import { baseURL } from "@/resources";

// Served at /robots.txt.
//
// AI search and assistant crawlers are named explicitly so it's unambiguous that
// they may read the site (needed to be cited in ChatGPT, Claude, Perplexity,
// Gemini and Google AI Overviews). A crawler that matches a named group ignores
// the "*" group, so the same rules are repeated for them.
const aiCrawlers = [
  "GPTBot", // OpenAI
  "OAI-SearchBot", // ChatGPT search
  "ChatGPT-User", // ChatGPT browsing on a user's behalf
  "ClaudeBot", // Anthropic
  "Claude-SearchBot", // Claude search
  "Claude-User", // Claude fetching on a user's behalf
  "PerplexityBot", // Perplexity
  "Perplexity-User",
  "Google-Extended", // Gemini / Vertex AI grounding
  "Applebot-Extended", // Apple Intelligence
  "Bingbot", // Bing + Copilot
  "CCBot", // Common Crawl, used by many open models
];

const disallow = ["/api/subscribe"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: aiCrawlers, allow: "/", disallow },
    ],
    sitemap: `${baseURL}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";

/**
 * Axtarış sistemləri və AI assistentlərinin robotları üçün açıq icazə.
 * AI botlarını ayrıca sadalayırıq ki, niyyət aydın olsun: ChatGPT, Claude,
 * Perplexity və Gemini DesTech haqqında məlumatı saytdan götürə bilsin.
 *
 * `host` direktivi qəsdən yoxdur — Google onu dəstəkləmir.
 */
const AI_AND_SEARCH_BOTS = [
  "Googlebot",
  "Bingbot",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_AND_SEARCH_BOTS, allow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

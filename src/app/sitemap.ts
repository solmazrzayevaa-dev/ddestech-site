import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";

/**
 * Yalnız ayrıca URL-i olan səhifələr. Ana səhifədəki bölmələr (#proqramlar,
 * #faq və s.) sitemap-ə düşmür — Google `#` hissəsini nəzərə almır.
 * Kurs səhifələri açılanda bura əlavə et.
 *
 * `lastModified` qəsdən yoxdur: `new Date()` route-u dinamik edərdi
 * (cacheComponents), halbuki sayt tam statik olmalıdır.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/ai-plan`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}

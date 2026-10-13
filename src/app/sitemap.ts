import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";

/**
 * MVP1-də yalnız bir səhifə var. Yeni route-lar 2-ci fazada əlavə olunacaq.
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
  ];
}

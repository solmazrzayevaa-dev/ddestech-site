/**
 * Publik (brauzerə düşən) konfiqurasiya.
 * Sirr saxlamır — Supabase açarları yalnız Server Action-dadır.
 */

/**
 * Saytın kanonik ünvanı. Vercel-də `NEXT_PUBLIC_SITE_URL` təyin et;
 * təyin olunmasa preview deploy-un öz domenindən istifadə olunur.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

/** GA4 ölçmə ID-si (G-XXXXXXX). Boş olsa skript yüklənmir. */
export const gaId = process.env.NEXT_PUBLIC_GA_ID ?? "";

/** Meta (Facebook) Pixel ID. Boş olsa skript yüklənmir. */
export const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

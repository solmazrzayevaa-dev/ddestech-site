/**
 * Publik (brauzerə düşən) konfiqurasiya.
 * Sirr saxlamır — Supabase açarları yalnız Server Action-dadır.
 */

/**
 * Saytın kanonik ünvanı. Vercel-də `NEXT_PUBLIC_SITE_URL` təyin et;
 * təyin olunmasa preview deploy-un öz domenindən istifadə olunur.
 *
 * Protokol unudulsa (`www.destechedu.co` kimi) `new URL()` xəta verir və
 * BÜTÜN build sınır. Ona görə `https://` yoxdursa özümüz əlavə edirik.
 */
function normalizeSiteUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/$/, "");
  if (!trimmed) return "http://localhost:3000";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/**
 * Saytın əsas (kanonik) domeni. Canonical, OG, robots.txt, sitemap.xml,
 * llms.txt və JSON-LD hamısı bu ünvanı göstərir.
 *
 * Production-da env dəyişənindən ASILI DEYİL: əvvəllər Vercel-də
 * `NEXT_PUBLIC_SITE_URL=https://destech.az` qalmışdı, destech.az isə açılmır —
 * nəticədə Google-a "əsl sayt işləməyən domendədir" deyilirdi. Domen dəyişsə,
 * yalnız bu sabiti dəyiş.
 */
export const PRODUCTION_SITE_URL = "https://destechedu.co";

export const siteUrl =
  process.env.VERCEL_ENV === "production"
    ? PRODUCTION_SITE_URL
    : normalizeSiteUrl(
        process.env.NEXT_PUBLIC_SITE_URL ||
          (process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000"),
      );

/**
 * AI Creator qeydiyyat formu brauzerdən birbaşa Supabase-ə yazır, ona görə
 * bu iki dəyər publikdir (`NEXT_PUBLIC_`). Təhlükəli deyil: publishable açar
 * `supabase/migrations/0002_ai_creator_registrations.sql`-dəki RLS ilə
 * YALNIZ `insert` edə bilir — heç nə oxuya, silə və ya dəyişə bilmir.
 *
 * DİQQƏT: bu layihə Supabase-in YENİ açar sistemindədir (`sb_publishable_…`).
 * Köhnə `anon` JWT açarları (`eyJhbGci…`) söndürülüb və 401 qaytarır —
 * dashboard-da "Legacy anon, service_role API keys" tabında görünsələr belə.
 *
 * Secret açarı (`sb_secret_…`) ilə qarışdırma — o RLS-i bypass edir və
 * heç vaxt `NEXT_PUBLIC_` olmamalıdır.
 *
 * İkisindən biri boş olsa forma göndərilmir, istifadəçiyə xəta göstərilir.
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/** GA4 ölçmə ID-si (G-XXXXXXX). Boş olsa skript yüklənmir. */
export const gaId = process.env.NEXT_PUBLIC_GA_ID ?? "";

/** Meta (Facebook) Pixel ID. Boş olsa skript yüklənmir. */
export const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

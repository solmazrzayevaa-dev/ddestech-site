import { cacheLife } from "next/cache";

/**
 * AI Creator qiymət və qeydiyyat statusu — tarixə görə hesablanır.
 *
 * DİQQƏT: bu tarixlər `supabase/migrations/0002_ai_creator_registrations.sql`
 * faylındaki `early_bird` / `price_azn` default-ları və insert policy-si ilə
 * EYNİ olmalıdır. Bazada qiymət serverdə təyin olunur — brauzerdəki dəyər
 * yalnız göstərmək üçündür, göndərilmir.
 */

export const aiCreatorPricing = {
  earlyBirdEnd: "2026-11-02T23:59:59+04:00",
  registrationEnd: "2026-11-20T23:59:59+04:00",
  priceEarly: 80,
  priceRegular: 120,
} as const;

export type AiCreatorPriceState = {
  /** Early bird müddəti hələ davam edirmi. */
  early: boolean;
  /** Göstərilən aylıq qiymət (₼). */
  price: number;
  /** Köhnə (üstüxətli) qiymət — yalnız early bird vaxtı göstərilir. */
  oldPrice: number;
  /** "Early bird · 4 gün qalıb" kimi etiket. */
  earlyBirdLabel: string;
  /** Qeydiyyat hələ açıqdırmı. */
  open: boolean;
};

/**
 * Serverdə cari tarixlə qiymət vəziyyəti.
 *
 * `async`-dir ki, `Date.now()` komponentin render gövdəsində çağırılmasın —
 * React render-i təmiz (pure) saymalıdır (`react-hooks/purity`).
 *
 * `"use cache"` + `cacheLife("hours")`: qiymət ən çox iki dəfə dəyişir
 * (2 və 20 Noyabr), ona görə saatlıq keş bəsdir və səhifə dinamik olmur.
 * Layihə `cacheComponents` işlədir — `export const revalidate` ilə uyğun
 * gəlmir (bax `next.config.ts`).
 */
export async function getAiCreatorPriceState(): Promise<AiCreatorPriceState> {
  "use cache";
  cacheLife("hours");
  return aiCreatorPriceStateAt(Date.now());
}

export function aiCreatorPriceStateAt(now: number): AiCreatorPriceState {
  const earlyEnd = Date.parse(aiCreatorPricing.earlyBirdEnd);
  const early = now <= earlyEnd;
  const days = Math.ceil((earlyEnd - now) / 86_400_000);

  const earlyBirdLabel = !early
    ? "Early bird müddəti bitib"
    : days <= 1
      ? "Early bird · bu gün son gün"
      : `Early bird · ${days} gün qalıb`;

  return {
    early,
    price: early ? aiCreatorPricing.priceEarly : aiCreatorPricing.priceRegular,
    oldPrice: aiCreatorPricing.priceRegular,
    earlyBirdLabel,
    open: now <= Date.parse(aiCreatorPricing.registrationEnd),
  };
}


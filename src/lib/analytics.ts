/**
 * Analitika hadisələri. Skriptlər yüklənməyibsə (ID təyin olunmayıb,
 * reklam bloklayıcı var) funksiyalar sakitcə heç nə etmir.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Müraciət uğurla göndəriləndə — GA4 `generate_lead` + Meta `Lead`. */
export function trackLead(program?: string): void {
  if (typeof window === "undefined") return;

  window.gtag?.("event", "generate_lead", {
    form_name: "muraciet",
    program: program || undefined,
  });

  window.fbq?.("track", "Lead", {
    content_name: program || "Müraciət formu",
  });
}

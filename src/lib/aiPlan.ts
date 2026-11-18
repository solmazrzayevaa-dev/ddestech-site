/**
 * AI generator (`/ai-plan`) üçün ortaq tiplər və mətnin təmizlənməsi.
 * Server (route handler) və brauzer eyni tipi istifadə edir.
 */

export const AI_MODULES = [
  "Avtomatlaşdırma",
  "Şəkil",
  "Video",
  "Səsləndirmə",
  "Poster",
  "Montaj",
  "App və landing",
] as const;

export const WORK_MAX_LENGTH = 200;

export type Automation = { name: string; how: string; module: string };
export type Creation = { t: string; module: string };

export type AiPlan = {
  valid: true;
  title: string;
  automations: Automation[];
  creates: Creation[];
  result: string;
};

export type AiPlanResponse = AiPlan | { valid: false };

/** İstifadəçi mətnini prompt-a salmazdan əvvəl təmizləyir. */
export function cleanWork(value: unknown): string {
  return String(value ?? "")
    .replace(/[\r\n"<>`]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, WORK_MAX_LENGTH);
}

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Modelin cavabını yoxlayır və yalnız gözlənilən formanı saxlayır.
 * Uyğun deyilsə `{ valid: false }` qaytarır.
 */
export function normalizePlan(raw: unknown): AiPlanResponse {
  if (!raw || typeof raw !== "object") return { valid: false };
  const r = raw as Record<string, unknown>;
  if (r.valid === false) return { valid: false };

  const automations = (Array.isArray(r.automations) ? r.automations : [])
    .slice(0, 4)
    .map((x) => {
      const o = (x ?? {}) as Record<string, unknown>;
      return {
        name: str(o.name, 80),
        how: str(o.how, 200),
        module: str(o.module, 30),
      };
    })
    .filter((x) => x.name);

  const creates = (Array.isArray(r.creates) ? r.creates : [])
    .slice(0, 3)
    .map((x) => {
      const o = (x ?? {}) as Record<string, unknown>;
      return { t: str(o.t, 90), module: str(o.module, 30) };
    })
    .filter((x) => x.t);

  if (!automations.length) return { valid: false };

  return {
    valid: true,
    title: str(r.title, 60),
    automations,
    creates,
    result: str(r.result, 220),
  };
}

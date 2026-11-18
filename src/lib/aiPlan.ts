/**
 * AI generator (`/ai-plan`) üçün ortaq məntiq: prompt, cavabın yoxlanması.
 * Mənbə: handoff `reference/api/generate.js` və prototipdəki `normalize()`.
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

export function buildPrompt(work: string): string {
  const modules = AI_MODULES.join("|");
  return [
    `Sən DesTech-in "AI Creator" kursunun köməkçisisən. Saytdakı istifadəçi hazırda nə işlə məşğul olduğunu yazıb: "${work}".`,
    "Kurs 0-dan öyrədir (heç bir təcrübə tələb olunmur): Claude ilə işləmək və avtomatlaşdırma, şəkil yaratmaq, video yaratmaq, səsləndirmə, poster dizaynı, AI ilə montaj, öz app və landing səhifəsini qurmaq.",
    "Bu işlə məşğul olan, AI təcrübəsi olmayan biri kursdan sonra Claude ilə gündəlik işində NƏYİ AVTOMATLAŞDIRA və nə yarada bilər? Onun yazdığı işə uyğun, konkret, real nümunələr ver. Rəqəm, faiz və saat uydurma, şişirtmə.",
    "Yalnız JSON qaytar, başqa heç nə yazma:",
    `{"valid":true,"title":"peşənin qısa adı, ilk hərf böyük (məs. Mühasib)","automations":[{"name":"maks 6 söz","how":"Claude bunu necə edir, 1 cümlə, maks 18 söz","module":"${modules}"}],"creates":[{"t":"maks 8 söz","module":"..."}],"result":"işin necə asanlaşacağı, 1 cümlə, maks 20 söz"}`,
    `automations dəqiq 4 element, creates dəqiq 3 element. module yalnız bu siyahıdan: ${AI_MODULES.join(", ")}.`,
    'Yazılan iş və ya peşə deyilsə, mənasızdırsa və ya uyğunsuzdursa yalnız {"valid":false} qaytar.',
    'Azərbaycan dilində, "sən" müraciəti ilə, düzgün Azərbaycan hərfləri ilə yaz.',
  ].join("\n");
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

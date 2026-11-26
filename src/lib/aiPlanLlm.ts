import { AI_MODULES, normalizePlan, type AiPlanResponse } from "@/lib/aiPlan";

/**
 * Claude (Haiku 5.5) ilə plan. Yalnız serverdə çağırılır: açar brauzerə çatmır.
 * Paket əlavə olunmayıb — birbaşa Messages API-yə HTTP sorğu.
 */

const MODEL = "claude-haiku-5-5";
/** Upstream üçün limit; route `maxDuration` (30 san) bundan böyük olmalıdır. */
const UPSTREAM_TIMEOUT_MS = 25_000;

/** Yenidən cəhd oluna bilən xəta (timeout, upstream, format). */
export class RetryableError extends Error {}
const API_VERSION = "2023-06-01";

const SYSTEM = [
  'Sən DesTech-in "AI Creator" kursunun köməkçisisən. Kurs 0-dan öyrədir: Claude ilə işləmək və avtomatlaşdırma, şəkil, video, səsləndirmə, poster, AI montajı, öz app və landing səhifəsi.',
  "Hədəf auditoriya Azərbaycanda yaşayan, AI təcrübəsi olmayan insanlardır. Cavabları Azərbaycan bazarına uyğunlaşdır: yerli müştərilər, Azərbaycan dilində mətn, AZN məbləğləri, yerli kanallar (Instagram, WhatsApp, Bolt, Kapital Bank kimi konkret brendlər YAZMA).",
  "Konkret ol: istifadəçinin yazdığı işə görə real, gündəlik iş nümunələri ver. Rəqəm, faiz, saat və müddət UYDURMA; ümumi ifadə işlət.",
  "Hər istifadəçiyə eyni cavab vermə: eyni peşə olsa belə, verilən kontekstə (komanda, vaxt) görə fərqli və spesifik nəticə ver.",
  "Yalnız JSON qaytar, başqa heç nə yazma. Sahələr: valid (true/false), title, automations (dəqiq 3 element: name maks 6 söz, how maks 18 söz, module), creates (dəqiq 3 element: t maks 8 söz, module), result (maks 20 söz).",
  `module yalnız bu siyahıdan: ${AI_MODULES.join(", ")}.`,
  "Tək sözlük peşə adlarını (vəkil, sürücü, müəllim, həkim, dizayner və s.) etibarlı peşə kimi qəbul et və onlar üçün plan yaz.",
  'Yazılan iş və ya peşə deyilsə, mənasızdırsa və ya uyğunsuzdursa yalnız {"valid":false} qaytar.',
  'Azərbaycan dilində, "sən" müraciəti ilə, düzgün Azərbaycan hərfləri ilə yaz.',
].join("\n");

const clean = (value: string) => value.replace(/[\r\n"<>`]/g, " ").replace(/\s+/g, " ").trim();

export async function llmPlan(work: string, team?: string): Promise<AiPlanResponse | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const context = team === "tek" ? "İstifadəçi tək işləyir." : team === "komanda" ? "İstifadəçinin komandası var." : "";
  const userText = [`İstifadəçinin işi: "${clean(work)}".`, context].filter(Boolean).join(" ");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": API_VERSION,
      "content-type": "application/json",
    },
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 800,
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: userText }],
    }),
  });
  if (!response.ok) throw new RetryableError(`anthropic_${response.status}`);

  const data = (await response.json()) as { content?: Array<{ type?: string; text?: string }> };
  const text = (data.content ?? []).map((c) => c.text ?? "").join("");
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new RetryableError("no_json");

  let raw: unknown;
  try {
    raw = JSON.parse(text.slice(start, end + 1));
  } catch {
    throw new RetryableError("bad_json");
  }
  if (raw && typeof raw === "object" && (raw as { valid?: unknown }).valid === false) {
    return { valid: false };
  }
  const parsed = normalizePlan(raw);
  if (!parsed.valid) throw new RetryableError("empty_plan");
  return parsed;
}

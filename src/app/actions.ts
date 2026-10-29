"use server";

import {
  emptyValues,
  validateLead,
  type FormState,
  type LeadInput,
  type LeadValues,
} from "@/lib/leads";

/**
 * Müraciət formunun Server Action-ı — lead-i Supabase-dəki
 * `website_leads` cədvəlinə yazır.
 *
 * Supabase üçün paket yoxdur — PostgREST endpoint-inə birbaşa `fetch`.
 * Service role açarı YALNIZ serverdə qalır (NEXT_PUBLIC_ prefiksi yoxdur).
 *
 * İKİ BAZAYA YAZILIR:
 *  1. Saytın öz layihəsi (`SUPABASE_*`) — ƏSAS. Uğursuz olsa form xəta verir.
 *  2. DesTech platform layihəsi (`PLATFORM_SUPABASE_*`) — müraciətlər orada
 *     `/leads` səhifəsində komandaya göstərilir. ƏLAVƏ: uğursuz olsa lead
 *     əsas bazada qaldığı üçün itmir, yalnız loga düşür.
 *
 * Hər iki cədvəlin sxemi eyni olmalıdır — hər ikisinə eyni body göndərilir.
 * Bax: `supabase/migrations/0001_website_leads.sql` və platformda
 * `supabase/migrations/0009_website_leads.sql`.
 *
 * Bildiriş göndərilmir: müraciətlər platformdan izlənilir.
 */

async function postLead(
  url: string,
  key: string,
  lead: LeadInput,
): Promise<void> {
  const response = await fetch(`${url}/rest/v1/website_leads`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(lead),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase ${response.status}: ${detail}`);
  }
}

/** Əsas baza — buraya yazılmasa müraciət qəbul olunmuş saymırıq. */
async function insertLead(lead: LeadInput): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL və ya SUPABASE_SERVICE_ROLE_KEY təyin olunmayıb.",
    );
  }

  await postLead(url, key, lead);
}

/**
 * Platform bazası — "best effort". Açarlar təyin olunmasa sadəcə ötürülür
 * (məs. local development), xəta atılmır.
 */
async function mirrorLeadToPlatform(lead: LeadInput): Promise<void> {
  const url = process.env.PLATFORM_SUPABASE_URL;
  const key = process.env.PLATFORM_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return;

  await postLead(url, key, lead);
}

export async function submitLead(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  // Honeypot: bot-lar gizli sahəni doldurur. Uğur kimi cavab veririk ki,
  // bot nəyin səhv getdiyini anlamasın.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return {
      status: "success",
      message: "Müraciətin qəbul olundu.",
      values: emptyValues,
    };
  }

  const { errors, lead } = validateLead(formData);

  // Xəta halında yazılanları geri qaytarırıq ki, form boşalmasın.
  const values: LeadValues = {
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    program: lead.program,
    message: lead.message,
  };

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Formu yoxla — bəzi sahələr düzgün deyil.",
      errors,
      values,
    };
  }

  try {
    await insertLead(lead);
  } catch (error) {
    console.error("[submitLead] Supabase insert uğursuz oldu:", error);
    return {
      status: "error",
      message:
        "Müraciəti göndərə bilmədik. Bir az sonra yenidən yoxla və ya WhatsApp-dan yaz.",
      values,
    };
  }

  // Lead əsas bazadadır — platforma köçürmə uğursuz olsa da istifadəçiyə
  // uğur qaytarırıq. Çatmayan sətirlər loga düşür və əldən bərpa oluna bilər.
  try {
    await mirrorLeadToPlatform(lead);
  } catch (error) {
    console.error("[submitLead] Platform bazasına köçürmə uğursuz oldu:", error);
  }

  return {
    status: "success",
    message: "Müraciətin qəbul olundu. Tezliklə səninlə əlaqə saxlayacağıq.",
    values: emptyValues,
  };
}

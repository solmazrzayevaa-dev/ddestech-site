import { programs } from "@/content/site";

/**
 * Müraciət formunun validasiyası və normallaşdırması.
 * Paketsiz — 5 sahə üçün sxem kitabxanası artıqlıq edərdi.
 */

export type LeadInput = {
  name: string;
  phone: string;
  email: string;
  program: string;
  message: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
};

export type FieldErrors = Partial<Record<"name" | "phone" | "email", string>>;

/** Formun geri qaytarılan dəyərləri — bax: `FormState.values`. */
export type LeadValues = Pick<
  LeadInput,
  "name" | "phone" | "email" | "program" | "message"
>;

export const emptyValues: LeadValues = {
  name: "",
  phone: "",
  email: "",
  program: "",
  message: "",
};

/** Server Action-ın forma qaytardığı nəticə. */
export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: FieldErrors;
  /**
   * React 19 Server Action-dan sonra formu avtomatik reset edir, ona görə
   * yazılanlar `defaultValue` vasitəsilə geri qaytarılır — xəta halında
   * istifadəçi hər şeyi yenidən yazmasın.
   */
  values: LeadValues;
};

export const initialFormState: FormState = {
  status: "idle",
  values: emptyValues,
};

/**
 * Telefonu +994XXXXXXXXX formasına gətirir.
 * İstifadəçi "055 590 36 95", "0555903695", "994555903695" və ya
 * "+994 55 590 36 95" yaza bilər — hamısı eyni nəticə verir.
 */
export function normalizePhone(raw: string): string {
  const digitsOnly = raw.replace(/[\s()\-.]/g, "");

  if (digitsOnly.startsWith("+994")) return digitsOnly;
  if (digitsOnly.startsWith("994")) return `+${digitsOnly}`;
  // Yerli format: 055... → +99455...
  if (digitsOnly.startsWith("0")) return `+994${digitsOnly.slice(1)}`;
  if (/^\d{9}$/.test(digitsOnly)) return `+994${digitsOnly}`;

  return digitsOnly;
}

const PHONE_PATTERN = /^\+994\d{9}$/;
// Sadə yoxlanış — tam RFC 5322 deyil, səhv yazılışı tutmaq üçün kifayətdir.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const VALID_PROGRAMS = new Set(programs.map((p) => p.formOption));

export function validateLead(formData: FormData): {
  errors: FieldErrors;
  lead: LeadInput;
} {
  const read = (key: string) => String(formData.get(key) ?? "").trim();

  const name = read("name");
  const phone = normalizePhone(read("phone"));
  const email = read("email");
  const programRaw = read("program");
  const message = read("message");

  const errors: FieldErrors = {};

  if (!name) {
    errors.name = "Ad və soyad tələb olunur.";
  } else if (name.length > 120) {
    errors.name = "Ad çox uzundur.";
  }

  if (!read("phone")) {
    errors.phone = "Telefon tələb olunur.";
  } else if (!PHONE_PATTERN.test(phone)) {
    errors.phone = "Telefonu +994 55 590 36 95 formatında yaz.";
  }

  if (email && !EMAIL_PATTERN.test(email)) {
    errors.email = "Email düzgün görünmür.";
  }

  return {
    errors,
    lead: {
      name,
      phone,
      email,
      // Siyahıda olmayan dəyəri qəbul etmirik (select ilə oynanıla bilər)
      program: VALID_PROGRAMS.has(programRaw) ? programRaw : "",
      message: message.slice(0, 2000),
      utm_source: read("utm_source").slice(0, 120),
      utm_medium: read("utm_medium").slice(0, 120),
      utm_campaign: read("utm_campaign").slice(0, 120),
    },
  };
}

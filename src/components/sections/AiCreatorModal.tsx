"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Close } from "@/components/ui/icons";
import { aiCreator, contact } from "@/content/site";
import type { AiCreatorPriceState } from "@/lib/aiCreatorPrice";
import { trackLead } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { supabasePublishableKey, supabaseUrl } from "@/lib/env";
import { Motto, PriceRow, Spark, StatusPill } from "./AiCreatorParts";

/**
 * AI Creator modalı — "Proqram haqqında" və "Qeydiyyat" tabları.
 * Mənbə: `ai-creator-banner.html` → `.ac-modal`.
 *
 * `ProgramDrawer`-dən fərqli olaraq native `<dialog>` işlədilir: dizaynın
 * bulanıq `::backdrop` effekti buna bağlıdır, həmçinin Esc ilə bağlanma və
 * fokus tələsi brauzerin özündən gəlir (CLAUDE.md → Əlçatanlıq).
 */

const TABLE = "ai_creator_registrations";

type Field = "name" | "phone" | "fin" | "email" | "consent";
type Errors = Partial<Record<Field, string>>;

type Props = {
  tab: "program" | "register" | null;
  price: AiCreatorPriceState;
  onClose: () => void;
};

const emptyForm = {
  name: "",
  phone: "",
  fin: "",
  email: "",
  consent: false,
};

export function AiCreatorModal({ tab, price, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  /**
   * Aktiv tab: `tab` prop-u açılış tabını verir, `override` isə istifadəçinin
   * modal içində etdiyi seçimi. Effekt içində state dəyişməmək üçün
   * hesablanır (`react-hooks/set-state-in-effect`).
   */
  const [override, setOverride] = useState<"program" | "register" | null>(null);
  const active = override ?? tab ?? "program";

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ name: string; phone: string } | null>(
    null,
  );

  /**
   * Bağlanmanın YEGANƏ yolu: React state-i sıfırla, DOM-u aşağıdakı effekt
   * sinxronlaşdırsın. `<dialog>`-un `close` hadisəsinə güvənmirik — bəzi
   * brauzerlər onu göndərmir (yalnız `toggle`), o zaman modal bağlanıb
   * görünsə də React hələ "açıq" sayır və bir daha açılmır.
   */
  const close = useCallback(() => {
    setOverride(null);
    onClose();
  }, [onClose]);

  // Açılma / bağlanma — `tab` prop-u idarə edir.
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    if (tab) {
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [tab]);

  // Esc: brauzer dialoqu özü bağlayardı, amma biz qarşısını alıb bağlanmanı
  // React-ə həvalə edirik ki, state ilə DOM həmişə eyni olsun.
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    const handleCancel = (event: Event) => {
      event.preventDefault();
      close();
    };
    el.addEventListener("cancel", handleCancel);
    return () => el.removeEventListener("cancel", handleCancel);
  }, [close]);

  // Modal açıq olanda arxa səhifə scroll olunmur.
  useEffect(() => {
    if (!tab) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [tab]);

  // Uğur ekranı açılanda ekran oxuyucu üçün fokus başlığa keçir.
  useEffect(() => {
    if (done) successRef.current?.focus();
  }, [done]);

  function update(field: Field, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Düzəldilən sahənin xətası dərhal itir.
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validate(): Errors {
    const next: Errors = {};
    const E = aiCreator.errors;

    if (form.name.trim().split(/\s+/).filter(Boolean).length < 2)
      next.name = E.name;
    if (form.phone.replace(/\D/g, "").length !== 9) next.phone = E.phone;
    if (!/^[A-Z0-9]{7}$/.test(form.fin)) next.fin = E.fin;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      next.email = E.email;
    if (!form.consent) next.consent = E.consent;

    return next;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");

    const found = validate();
    setErrors(found);
    const firstBad = (Object.keys(found) as Field[])[0];
    if (firstBad) {
      document
        .querySelector<HTMLElement>(`[data-ac-field="${firstBad}"]`)
        ?.focus();
      return;
    }

    if (!supabaseUrl || !supabasePublishableKey) {
      setFormError(aiCreator.errors.notConnected);
      return;
    }

    const payload = {
      full_name: form.name.trim(),
      phone: `+994${form.phone.replace(/\D/g, "")}`,
      fin: form.fin,
      email: form.email.trim().toLowerCase(),
      consent: true,
    };

    setSubmitting(true);
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/${TABLE}`, {
        method: "POST",
        headers: {
          apikey: supabasePublishableKey,
          Authorization: `Bearer ${supabasePublishableKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const E = aiCreator.errors;
        if (response.status === 409) throw new Error(E.duplicateFin);
        // 401 və 403 fərqli səbəblərdir və onları eyni mesajla göstərmək
        // nasazlığı tapmağı çətinləşdirir: 401 = açar qəbul edilmir
        // (məs. köhnə legacy açar), 403 = açar düzgündür, RLS imkan vermir.
        if (response.status === 401) throw new Error(E.badKey);
        if (response.status === 403) throw new Error(E.closed);
        throw new Error(E.generic);
      }

      setDone({ name: payload.full_name, phone: payload.phone });
      trackLead(aiCreator.title);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : aiCreator.errors.genericWithPhone,
      );
    } finally {
      setSubmitting(false);
    }
  }

  const F = aiCreator.form;
  const S = aiCreator.summary;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="aiCreatorModalTitle"
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
      className="rounded-md backdrop:bg-ink/60 backdrop:backdrop-blur-[6px] max-[859px]:h-dvh max-[859px]:max-h-dvh max-[859px]:w-screen max-[859px]:max-w-screen max-[859px]:rounded-none m-auto h-[min(820px,calc(100dvh-32px))] max-h-[min(820px,calc(100dvh-32px))] w-[min(980px,calc(100vw-32px))] overflow-hidden border-0 bg-white p-0 text-ink shadow-[0_32px_80px_-16px_rgba(21,18,40,0.45)] open:flex open:flex-col"
    >
      {/* ── Başlıq ── */}
      <header className="on-dark relative max-[859px]:px-5 flex-none overflow-hidden bg-[radial-gradient(circle_at_88%_0%,var(--color-cobalt-glow)_0,var(--color-cobalt)_50%,var(--color-cobalt-deep)_100%)] px-10 pt-7 pb-5 text-white">
        <Spark className="top-[-30px] right-[90px] size-24" />
        <div className="relative flex items-start justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <StatusPill>
                {price.open
                  ? aiCreator.statusOpenModal
                  : aiCreator.statusClosed}
              </StatusPill>
            </div>
            <h2
              id="aiCreatorModalTitle"
              className="mt-3.5 mb-0 text-[clamp(36px,5vw,52px)] leading-none font-semibold tracking-[-0.055em]"
            >
              {aiCreator.title}
            </h2>
            <Motto className="!mt-1.5 text-[22px]" />
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={aiCreator.close}
            className="grid size-11 flex-none place-items-center rounded-full border-0 bg-white/15 text-white"
          >
            <Close size={20} />
          </button>
        </div>

        <div
          role="tablist"
          aria-label={aiCreator.tabs.label}
          className="rounded-pill bg-ink/30 relative mt-5 inline-flex gap-1.5 p-[5px]"
        >
          {(["program", "register"] as const).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              id={`aiCreatorTab-${key}`}
              aria-controls={`aiCreatorPanel-${key}`}
              aria-selected={active === key}
              tabIndex={active === key ? 0 : -1}
              onClick={() => setOverride(key)}
              className={cn(
                "rounded-pill h-10 border-0 px-5 text-[15px] font-semibold",
                active === key ? "text-ink bg-white" : "bg-transparent text-white",
              )}
            >
              {aiCreator.tabs[key]}
            </button>
          ))}
        </div>
      </header>

      {/* ── Məzmun ── */}
      <div className="max-[859px]:px-5 min-h-0 flex-1 overflow-y-auto px-10 pt-8 pb-10">
        {/* Proqram haqqında */}
        <div
          role="tabpanel"
          id="aiCreatorPanel-program"
          aria-labelledby="aiCreatorTab-program"
          hidden={active !== "program"}
          className="flex flex-col gap-11"
        >
          <div className="max-[859px]:grid-cols-1 grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-start gap-8">
            <div>
              <p className="max-[859px]:text-[22px] m-0 text-[26px] leading-[1.25] font-medium tracking-[-0.03em]">
                <span className="text-web-text-soft">
                  {aiCreator.intro.leadSoft}
                </span>{" "}
                {aiCreator.intro.lead}
              </p>
              <p className="text-web-text-muted mt-3.5 mb-0 text-base leading-[1.6]">
                {aiCreator.intro.text}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {aiCreator.facts.map((fact) => (
                <div
                  key={fact.value}
                  className="bg-cloud rounded-[20px] p-[18px]"
                >
                  <b
                    className={cn(
                      "block font-bold",
                      fact.numeric
                        ? "font-display text-[28px]"
                        : "text-xl leading-[1.4] tracking-[-0.02em]",
                    )}
                  >
                    {fact.value}
                  </b>
                  <span className="text-web-text-muted mt-1.5 block text-sm">
                    {fact.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* (01) Kimlər üçündür */}
          <div>
            <div className="text-web-text-muted text-[13px] font-semibold">
              {aiCreator.audienceLabel}
            </div>
            <h3 className="mt-2 mb-4 text-[28px] leading-[1.15] font-semibold tracking-[-0.04em]">
              {aiCreator.audienceHeading}
            </h3>
            <div className="max-[859px]:grid-cols-2 grid grid-cols-5 gap-2.5">
              {aiCreator.audience.map((item) => (
                <div
                  key={item.title}
                  className="border-web-border rounded-mosaic border p-4"
                >
                  <b className="text-base tracking-[-0.02em]">{item.title}</b>
                  <p className="text-web-text-muted mt-1.5 mb-0 text-sm leading-[1.45]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* (02) Nə öyrənəcəksən */}
          <div>
            <div className="text-web-text-muted text-[13px] font-semibold">
              {aiCreator.weeksLabel}
            </div>
            <h3 className="mt-2 mb-4 text-[28px] leading-[1.15] font-semibold tracking-[-0.04em]">
              {aiCreator.weeksHeading}{" "}
              <span className="text-web-text-soft">
                {aiCreator.weeksHeadingSoft}
              </span>
            </h3>
            <ol className="border-web-border m-0 list-none border-b p-0">
              {aiCreator.weeks.map((week) => (
                <li
                  key={week.number}
                  className="border-web-border max-[859px]:grid-cols-[40px_minmax(0,1fr)] grid grid-cols-[56px_230px_minmax(0,1fr)] items-center gap-4 border-t py-3.5"
                >
                  <span className="font-display text-cobalt text-lg font-bold">
                    {week.number}
                  </span>
                  <span className="rounded-pill bg-cobalt-tint text-cobalt-deep justify-self-start px-[13px] py-[7px] text-sm font-bold">
                    {week.role}
                  </span>
                  <div className="max-[859px]:col-start-2">
                    <strong className="block text-base font-semibold">
                      {week.title}
                    </strong>
                    <small className="text-web-text-muted mt-0.5 block text-sm">
                      {week.description}
                    </small>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* (03) Kursun sonunda */}
          <div className="bg-ink on-dark max-[859px]:grid-cols-1 grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-8 rounded-[24px] p-8 text-white">
            <div>
              <div className="text-[13px] font-semibold text-white/70">
                {aiCreator.outcomeLabel}
              </div>
              <h3 className="mt-2 mb-5 text-[30px] leading-[1.15] font-semibold tracking-[-0.04em]">
                {aiCreator.outcomeHeading}{" "}
                <span className="text-lime">
                  {aiCreator.outcomeHeadingAccent}
                </span>
              </h3>
              <p className="m-0 text-sm leading-[1.55] text-white/80">
                {aiCreator.outcomeText}
              </p>
            </div>
            <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
              {aiCreator.checks.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-base leading-[1.45]"
                >
                  <span
                    aria-hidden="true"
                    className="bg-lime text-ink grid size-[26px] flex-none place-items-center rounded-full"
                  >
                    <Check size={14} />
                  </span>
                  {item}
                </li>
              ))}
              <li className="flex items-start gap-3 text-base leading-[1.45]">
                <span
                  aria-hidden="true"
                  className="bg-lime text-ink grid size-[26px] flex-none place-items-center rounded-full"
                >
                  <Check size={14} />
                </span>
                <span>
                  {aiCreator.checkMethod.text}
                  <br />
                  <em className="text-lime font-semibold not-italic">
                    {aiCreator.checkMethod.accent}
                  </em>
                </span>
              </li>
            </ul>
          </div>

          {/* (04) Tarixlər və qiymət */}
          <div>
            <div className="text-web-text-muted text-[13px] font-semibold">
              {aiCreator.datesLabel}
            </div>
            <div className="max-[859px]:grid-cols-1 mt-3.5 grid grid-cols-3 gap-2.5">
              {aiCreator.dates.map((date) => (
                <div
                  key={date.value}
                  className={cn(
                    "rounded-[20px] p-5",
                    date.highlight ? "bg-lime" : "bg-cloud",
                  )}
                >
                  <b className="font-display block text-[26px] font-bold">
                    {date.value}
                  </b>
                  <strong className="mt-2 block text-[15px] font-semibold">
                    {date.title}
                  </strong>
                  <span
                    className={cn(
                      "mt-0.5 block text-sm",
                      date.highlight ? "text-ink" : "text-web-text-muted",
                    )}
                  >
                    {date.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Qeydiyyat */}
        <div
          role="tabpanel"
          id="aiCreatorPanel-register"
          aria-labelledby="aiCreatorTab-register"
          hidden={active !== "register"}
        >
          {done ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 text-center">
              <span
                aria-hidden="true"
                className="bg-lime text-ink grid size-[88px] place-items-center rounded-full"
              >
                <Check size={40} />
              </span>
              <h3
                ref={successRef}
                tabIndex={-1}
                className="mt-2 mb-0 text-[34px] leading-[1.15] font-semibold tracking-[-0.04em]"
              >
                {aiCreator.success.heading}
              </h3>
              <p className="text-web-text-muted m-0 max-w-[480px] text-base leading-[1.6]">
                {aiCreator.success.text
                  .replace("{name}", done.name.split(/\s+/)[0])
                  .replace("{phone}", done.phone)}
              </p>
              <p className="text-ink m-0 font-semibold">
                {aiCreator.success.priceLabel} {price.price} ₼ / ay
              </p>
              <button
                type="button"
                onClick={close}
                className="rounded-pill border-web-border-strong text-ink h-12 border-[1.5px] bg-white px-[22px] text-[15px] font-semibold"
              >
                {aiCreator.close}
              </button>
            </div>
          ) : (
            <div className="max-[859px]:grid-cols-1 grid grid-cols-[minmax(0,1fr)_320px] items-start gap-8">
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-[18px]"
              >
                <div>
                  <h3 className="m-0 text-[28px] leading-[1.15] font-semibold tracking-[-0.04em]">
                    {F.heading}
                  </h3>
                  <p className="text-web-text-muted mt-1.5 mb-0 text-[15px] leading-[1.5]">
                    {F.text}
                  </p>
                </div>

                <TextField
                  id="aiCreatorName"
                  field="name"
                  label={F.nameLabel}
                  placeholder={F.namePlaceholder}
                  autoComplete="name"
                  value={form.name}
                  error={errors.name}
                  onChange={(value) => update("name", value)}
                />

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="aiCreatorPhone"
                    className="text-sm font-semibold"
                  >
                    {F.phoneLabel}
                  </label>
                  <div
                    className={cn(
                      "rounded-sm flex h-[52px] items-center overflow-hidden border-[1.5px] bg-white focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ink",
                      errors.phone
                        ? "border-web-error"
                        : "border-web-border-strong",
                    )}
                  >
                    <span className="border-web-border text-web-text-muted flex h-full items-center border-r pr-3 pl-4 font-semibold">
                      {F.phonePrefix}
                    </span>
                    <input
                      id="aiCreatorPhone"
                      data-ac-field="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder={F.phonePlaceholder}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby="aiCreatorPhoneErr"
                      value={form.phone}
                      onChange={(event) =>
                        update(
                          "phone",
                          event.target.value.replace(/[^\d ]/g, "").slice(0, 13),
                        )
                      }
                      className="text-ink placeholder:text-web-text-soft h-full min-w-0 flex-1 border-0 bg-transparent px-3.5 text-base outline-none"
                    />
                  </div>
                  <FieldError id="aiCreatorPhoneErr" message={errors.phone} />
                </div>

                <div className="max-[859px]:grid-cols-1 grid grid-cols-2 gap-4">
                  <TextField
                    id="aiCreatorFin"
                    field="fin"
                    label={F.finLabel}
                    placeholder={F.finPlaceholder}
                    autoComplete="off"
                    maxLength={7}
                    value={form.fin}
                    error={errors.fin}
                    help={F.finHelp}
                    className="tracking-[0.08em] uppercase"
                    onChange={(value) =>
                      update(
                        "fin",
                        value
                          .toUpperCase()
                          .replace(/[^A-Z0-9]/g, "")
                          .slice(0, 7),
                      )
                    }
                  />
                  <TextField
                    id="aiCreatorEmail"
                    field="email"
                    label={F.emailLabel}
                    placeholder={F.emailPlaceholder}
                    autoComplete="email"
                    type="email"
                    value={form.email}
                    error={errors.email}
                    onChange={(value) => update("email", value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-web-text-muted flex cursor-pointer items-start gap-2.5 text-sm leading-[1.45]">
                    <input
                      type="checkbox"
                      data-ac-field="consent"
                      checked={form.consent}
                      aria-invalid={Boolean(errors.consent)}
                      aria-describedby="aiCreatorConsentErr"
                      onChange={(event) =>
                        update("consent", event.target.checked)
                      }
                      className="accent-web-cta m-0 size-5 flex-none"
                    />
                    {F.consent}
                  </label>
                  <FieldError
                    id="aiCreatorConsentErr"
                    message={errors.consent}
                  />
                </div>

                {formError && (
                  <p
                    role="alert"
                    className="bg-web-error-bg text-web-error rounded-sm m-0 px-3.5 py-3 text-sm font-semibold"
                  >
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-pill bg-web-cta hover:bg-web-cta-hover inline-flex h-14 items-center justify-center gap-3 border-0 px-[26px] text-[17px] font-bold text-white disabled:cursor-progress disabled:opacity-60"
                >
                  {submitting ? F.submittingLabel : F.submitLabel}
                </button>
                <p className="text-web-text-muted m-0 text-center text-[13px] leading-[1.5]">
                  {F.note}
                </p>
              </form>

              {/* Xülasə */}
              <aside className="bg-cloud flex flex-col gap-[18px] rounded-[24px] p-6 text-sm">
                <div>
                  <div className="text-web-text-muted text-[13px] font-semibold">
                    {S.label}
                  </div>
                  <div className="mt-1.5 text-[22px] font-semibold tracking-[-0.03em]">
                    {S.title}
                  </div>
                  <div className="text-web-text-muted mt-1">{S.subtitle}</div>
                </div>
                <hr className="border-web-border m-0 h-px border-0 bg-current opacity-20" />
                <div>
                  <div className="text-cobalt-deep text-[13px] font-bold">
                    {price.earlyBirdLabel}
                  </div>
                  <PriceRow state={price} size="md" tone="on-light" />
                </div>
                <div className="flex flex-col gap-2">
                  <SummaryRow label={S.monthlyRow} value={`${price.price} ₼`} />
                  <SummaryRow label={S.durationRow} value={S.durationValue} />
                  <SummaryRow label={S.paymentRow} value={S.paymentValue} />
                </div>
                <hr className="border-web-border m-0 h-px border-0 bg-current opacity-20" />
                <div className="text-web-text-muted flex flex-col gap-1.5">
                  <span>{S.earlyBirdInfo}</span>
                  <span>{S.deadlineInfo}</span>
                  <span>
                    {S.questionLabel}{" "}
                    <a
                      href={contact.phoneHref}
                      className="text-ink font-semibold"
                    >
                      {contact.phoneLabel}
                    </a>
                  </span>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>

      {/* ── Alt panel — yalnız "Proqram haqqında" tabında ── */}
      {active === "program" && (
        <footer className="border-web-border max-[859px]:px-5 max-[859px]:py-3 flex flex-none flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t bg-white px-10 py-4">
          <div>
            <div className="text-cobalt-deep text-[13px] font-bold">
              {price.earlyBirdLabel}
            </div>
            <PriceRow state={price} size="sm" tone="on-light" />
          </div>
          <button
            type="button"
            onClick={() => setOverride("register")}
            className="rounded-pill bg-web-cta hover:bg-web-cta-hover max-[859px]:flex-1 inline-flex h-14 items-center justify-center gap-3 border-0 px-[26px] text-[17px] font-bold text-white"
          >
            {aiCreator.gotoRegister} <span aria-hidden="true">→</span>
          </button>
        </footer>
      )}
    </dialog>
  );
}

/* ────────────────────── Kiçik köməkçi komponentlər ────────────────────── */

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <span
      id={id}
      aria-live="polite"
      className="text-web-error text-[13px] font-semibold"
    >
      {message}
    </span>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-web-text-muted">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

type TextFieldProps = {
  id: string;
  field: Field;
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  help?: string;
  type?: string;
  maxLength?: number;
  autoComplete?: string;
  className?: string;
  onChange: (value: string) => void;
};

function TextField({
  id,
  field,
  label,
  placeholder,
  value,
  error,
  help,
  type = "text",
  maxLength,
  autoComplete,
  className,
  onChange,
}: TextFieldProps) {
  const errId = `${id}Err`;
  const helpId = `${id}Help`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        data-ac-field={field}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={cn(help && !error ? helpId : undefined, errId)}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "rounded-sm text-ink placeholder:text-web-text-soft h-[52px] w-full border-[1.5px] bg-white px-4 text-base focus:outline-2 focus:outline-offset-2 focus:outline-ink",
          error ? "border-web-error" : "border-web-border-strong",
          className,
        )}
      />
      {help && !error && (
        <span id={helpId} className="text-web-text-muted text-[13px]">
          {help}
        </span>
      )}
      <FieldError id={errId} message={error} />
    </div>
  );
}

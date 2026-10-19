"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitLead } from "@/app/actions";
import { Button, Container, Panel, Pill, SectionLabel } from "@/components/ui";
import { apply, programs, type ProgramId } from "@/content/site";
import { trackLead } from "@/lib/analytics";
import { initialFormState } from "@/lib/leads";
import { cn } from "@/lib/cn";

/**
 * Müraciət bölməsi — tünd panel + ağ form kartı.
 * Referans: design/landing-reference.html → `<!-- APPLICATION -->`.
 *
 * Form Server Action ilə işləyir: JS olmadan da göndərilir (progressive
 * enhancement). UTM-lər klient tərəfdə gizli sahələrə yazılır — beləcə
 * səhifə statik qalır (searchParams oxunsaydı dinamik olardı).
 */

const fieldClass =
  "h-13 w-full rounded-sm border-[1.5px] border-web-border-strong bg-paper px-4 text-base font-medium text-ink";

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
        {optional && (
          <span className="text-web-text-muted font-medium">
            {" "}
            {apply.form.messageOptional}
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-web-cta m-0 text-sm font-semibold">
          {error}
        </p>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" arrow spread disabled={pending} size="lg">
      {pending ? "Göndərilir…" : apply.form.submitLabel}
    </Button>
  );
}

export function Apply() {
  const [state, formAction] = useActionState(submitLead, initialFormState);
  const selectRef = useRef<HTMLSelectElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);

  // Proqram drawer-indəki "Bu proqrama müraciət et" select-i avtomatik seçir.
  // Select uncontrolled-dir — dəyər birbaşa DOM-a yazılır ki, `form.reset()`
  // onu özü təmizləsin və effekt içində setState olmasın.
  useEffect(() => {
    function onSelect(event: Event) {
      const id = (event as CustomEvent<ProgramId>).detail;
      const match = programs.find((p) => p.id === id);
      if (match && selectRef.current) selectRef.current.value = match.formOption;
    }

    window.addEventListener("destech:select-program", onSelect);
    return () => window.removeEventListener("destech:select-program", onSelect);
  }, []);

  // Nəticəni elan et. Formu təmizləməyə ehtiyac yoxdur — React 19 Server
  // Action-dan sonra onu özü reset edir, dəyərlər isə `defaultValue`-dan gəlir.
  //
  // İstisna: `<select>` üçün `defaultValue` YALNIZ mount zamanı tətbiq olunur,
  // ona görə seçilmiş proqramı reset-dən sonra DOM-a özümüz yazırıq.
  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.value = state.values.program;
    }
    if (state.status !== "idle") {
      statusRef.current?.focus();
    }
    if (state.status === "success") {
      trackLead(state.values.program);
    }
  }, [state]);

  return (
    <Panel
      id={apply.id}
      tone="ink"
      className="scroll-mt-[90px] p-[clamp(32px,5vw,72px)]"
    >
      <Container className="flex flex-wrap gap-12 px-0">
        {/* Sol sütun */}
        <div className="flex flex-[1_1_360px] flex-col gap-[22px]">
          <SectionLabel number="09" tone="lime">
            Müraciət
          </SectionLabel>

          <h2 className="text-web-h2-m lg:text-web-h2 text-paper m-0">
            <span className="text-web-text-soft">{apply.headingSoft}</span>
            <br />
            {apply.heading}
          </h2>

          <Pill variant="translucent" dot className="self-start">
            {apply.statusPill}
          </Pill>

          <p className="m-0 max-w-[420px] text-[clamp(17px,1.4vw,19px)] leading-[1.55] font-medium">
            {apply.text}
          </p>

          <div className="mt-auto flex flex-wrap gap-2.5">
            <Button
              href={apply.whatsappCta.href}
              target="_blank"
              rel="noopener noreferrer"
              variant="surface"
              size="sm"
              className="h-12 px-5"
            >
              {apply.whatsappCta.label}
            </Button>
            <Button
              href={apply.instagramCta.href}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              className="h-12 border-[1.5px] border-white/60 bg-transparent px-5 text-paper"
            >
              {apply.instagramCta.label}
            </Button>
          </div>
        </div>

        {/* Form kartı */}
        <form
          action={formAction}
          noValidate
          className="bg-paper text-ink rounded-md flex flex-[1.2_1_420px] flex-col gap-[18px] p-[clamp(24px,3vw,36px)] shadow-[0_24px_64px_-24px_rgba(0,0,0,0.5)]"
        >
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[18px]">
            <Field id="f-name" label={apply.form.nameLabel} error={state.errors?.name}>
              <input
                id="f-name"
                name="name"
                type="text"
                autoComplete="name"
                defaultValue={state.values.name}
                required
                aria-invalid={state.errors?.name ? true : undefined}
                aria-describedby={state.errors?.name ? "f-name-error" : undefined}
                className={fieldClass}
              />
            </Field>

            <Field
              id="f-phone"
              label={apply.form.phoneLabel}
              error={state.errors?.phone}
            >
              <input
                id="f-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                defaultValue={state.values.phone}
                required
                placeholder={apply.form.phonePlaceholder}
                aria-invalid={state.errors?.phone ? true : undefined}
                aria-describedby={
                  state.errors?.phone ? "f-phone-error" : undefined
                }
                className={fieldClass}
              />
            </Field>
          </div>

          <Field
            id="f-email"
            label={apply.form.emailLabel}
            optional
            error={state.errors?.email}
          >
            <input
              id="f-email"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={state.values.email}
              aria-invalid={state.errors?.email ? true : undefined}
              aria-describedby={
                state.errors?.email ? "f-email-error" : undefined
              }
              className={fieldClass}
            />
          </Field>

          <Field id="f-program" label={apply.form.programLabel}>
            <select
              id="f-program"
              name="program"
              ref={selectRef}
              defaultValue={state.values.program}
              className={fieldClass}
            >
              <option value="">{apply.form.programPlaceholder}</option>
              {apply.programOptions.map((option) => (
                <option key={option.id} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field id="f-msg" label={apply.form.messageLabel} optional>
            <textarea
              id="f-msg"
              name="message"
              rows={3}
              maxLength={2000}
              defaultValue={state.values.message}
              className={cn(fieldClass, "h-26 resize-y px-4 py-3.5")}
            />
          </Field>

          <UtmFields />

          {/* Honeypot — real istifadəçi görmür və fokuslana bilmir */}
          <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="f-website">Veb sayt</label>
            <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <SubmitButton />

          {/* Uğur və xəta vizual olaraq fərqlənməlidir: uğurda lime nöqtə +
              ink mətn, xətada pink-deep. Əvvəl hər ikisi eyni rəngdə idi və
              uğurlu göndəriş xəta kimi oxunurdu. */}
          <p
            ref={statusRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            className={cn(
              "m-0 flex items-start gap-2 text-sm font-semibold",
              state.status === "idle" && "sr-only",
              state.status === "success" && "text-ink",
              state.status === "error" && "text-web-cta",
            )}
          >
            {state.status === "success" && (
              <span
                aria-hidden="true"
                className="bg-lime rounded-pill mt-1.5 inline-block size-2 shrink-0"
              />
            )}
            {state.message ?? ""}
          </p>
        </form>
      </Container>
    </Panel>
  );
}

/**
 * UTM parametrlərini URL-dən gizli sahələrə köçürür.
 * Dəyərlər birbaşa DOM-a yazılır — `searchParams` oxunsaydı səhifə
 * dinamik olardı, state işlədilsəydi effektdə artıq render yaranardı.
 */
function UtmFields() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    containerRef.current
      ?.querySelectorAll<HTMLInputElement>("input[data-utm]")
      .forEach((input) => {
        input.value = params.get(input.name) ?? "";
      });
  }, []);

  return (
    <div ref={containerRef} hidden>
      <input type="hidden" name="utm_source" data-utm />
      <input type="hidden" name="utm_medium" data-utm />
      <input type="hidden" name="utm_campaign" data-utm />
    </div>
  );
}

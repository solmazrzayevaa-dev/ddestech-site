"use client";

import { useCallback } from "react";
import { Button, CircleButton, GlassCard, Icons, Pill } from "@/components/ui";
import { SectionLabel } from "@/components/ui";
import {
  apply,
  programDetailLabels as L,
  studyFormat,
  type Program,
} from "@/content/site";
import { useDialog } from "@/hooks/useDialog";
import { cn } from "@/lib/cn";
import { bgClass, orbGradient, textClass } from "./programColors";

/**
 * Proqram detal paneli — eyni səhifədə sağdan açılan drawer. URL dəyişmir.
 * Referans: design/landing-reference.html → `PROGRAM DETAIL (same page drawer)`.
 *
 * Esc və arxa fon kliki ilə bağlanır, fokus panel içində qalır,
 * açıq olanda səhifə scroll olunmur.
 */

type Props = {
  program: Program | null;
  onClose: () => void;
};

export function ProgramDrawer({ program, onClose }: Props) {
  const open = program !== null;
  const { panelRef } = useDialog<HTMLDivElement, HTMLElement>(open, onClose);

  /** Paneli bağlayır, müraciət formuna sürüşdürür və proqramı seçdirir. */
  const applyToProgram = useCallback(() => {
    if (!program) return;
    onClose();
    // Form addım 7-də qurulur; o vaxta qədər hadisə sadəcə dinlənilmir.
    window.dispatchEvent(
      new CustomEvent("destech:select-program", { detail: program.id }),
    );
    document
      .getElementById(apply.id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [program, onClose]);

  if (!program) return null;

  const { theme } = program;

  return (
    <div className="fixed inset-0 z-100 flex justify-end">
      {/* Arxa fon — klikləyəndə bağlanır */}
      <button
        type="button"
        aria-label="Pəncərəni bağla"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer border-0 bg-ink/50 backdrop-blur-[6px]"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={program.title}
        className="bg-web-bg relative flex h-full w-[min(720px,100%)] flex-col overflow-y-auto rounded-l-md shadow-[-24px_0_64px_-24px_rgba(21,18,40,0.45)]"
      >
        {/* ── Başlıq bloku ── */}
        <div
          className={cn(
            "relative mx-2.5 mt-2.5 flex flex-col gap-[18px] overflow-hidden rounded-xl-m p-[clamp(24px,3vw,36px)]",
            bgClass[theme.bg],
            textClass[theme.fg],
          )}
        >
          <div
            aria-hidden="true"
            className={cn(
              "rounded-pill absolute -top-[70px] -right-[60px] size-[220px] shadow-[0_30px_50px_-20px_rgba(0,0,0,0.35)]",
              orbGradient[theme.orb],
            )}
          />

          <div className="relative flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {program.chips.map((chip) => (
                <Pill key={chip}>{chip}</Pill>
              ))}
            </div>
            <CircleButton
              aria-label={L.close}
              variant="glass"
              onClick={onClose}
            >
              <Icons.Close />
            </CircleButton>
          </div>

          <h2 className="relative m-0 mt-2 text-[clamp(36px,4.4vw,56px)] leading-[0.95] font-semibold tracking-[-0.05em]">
            {program.title}
          </h2>

          <p className="relative m-0 max-w-[520px] text-[17px] leading-[1.5] font-medium">
            {program.summary}
          </p>

          <GlassCard
            radius="mosaic"
            className="relative grid grid-cols-3 gap-2 p-3.5"
          >
            {[
              [L.durationLabel, program.duration],
              [L.formatLabel, program.format],
              [L.paymentLabel, program.payment],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="text-web-text-muted text-xs font-semibold">
                  {label}
                </div>
                <div className="text-base font-bold">{value}</div>
              </div>
            ))}
          </GlassCard>
        </div>

        {/* ── Gövdə ── */}
        <div className="flex flex-col gap-10 p-[clamp(24px,3vw,36px)]">
          {/* (a) Kimin üçündür */}
          <section className="flex flex-col gap-3.5">
            <SectionLabel>{L.audience}</SectionLabel>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-2">
              {program.audience.map((item) => (
                <div
                  key={item.title}
                  className="bg-paper shadow-card rounded-mosaic p-4"
                >
                  <div className="text-[15px] font-bold">{item.title}</div>
                  <div className="text-web-text-muted mt-1.5 text-sm leading-[1.5] font-medium">
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* (b) Kursun sonunda bacaracaqsan */}
          <section className="flex flex-col gap-3.5">
            <SectionLabel>{L.outcomes}</SectionLabel>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {program.outcomes.map((outcome) => (
                <li key={outcome} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="bg-ink text-lime rounded-pill mt-px inline-flex size-6 shrink-0 items-center justify-center"
                  >
                    <Icons.Check size={12} />
                  </span>
                  <span className="text-web-body">{outcome}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* (c) Tədris planı */}
          <section className="flex flex-col gap-1.5">
            <div className="mb-2 flex items-baseline justify-between">
              <SectionLabel>{L.curriculum}</SectionLabel>
              <span className="text-web-text-muted text-[13px] font-semibold">
                {program.moduleCount}
              </span>
            </div>
            {program.modules.map((module) => (
              <div
                key={module.number}
                className="grid grid-cols-[52px_minmax(0,1fr)] gap-3 border-t border-[#d6d1c7] py-[18px]"
              >
                <span
                  className={cn(
                    "font-display text-lg font-semibold",
                    textClass[theme.accent],
                  )}
                >
                  {module.number}
                </span>
                <div>
                  <div className="text-lg leading-[1.25] font-semibold tracking-[-0.02em]">
                    {module.title}
                  </div>
                  <div className="text-web-text-muted mt-1.5 text-sm leading-[1.55] font-medium">
                    {module.description}
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* (d) Alətlər */}
          <section className="flex flex-col gap-3.5">
            <SectionLabel>{L.tools}</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {program.tools.map((tool) => (
                <Pill
                  key={tool}
                  className="h-[34px] shadow-[0_1px_0_rgba(21,18,40,0.04),0_6px_16px_-12px_rgba(21,18,40,0.3)]"
                >
                  {tool}
                </Pill>
              ))}
            </div>
          </section>

          {/* (e) Necə oxuyursan */}
          <section className="flex flex-col gap-3.5">
            <SectionLabel>{L.howYouStudy}</SectionLabel>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
              {studyFormat.map((card) => (
                <div
                  key={card.value}
                  className={cn(
                    "rounded-mosaic p-4",
                    card.highlight ? "bg-lime" : "bg-paper",
                  )}
                >
                  <div className="font-display text-[22px] font-semibold">
                    {card.value}
                  </div>
                  <div
                    className={cn(
                      "mt-1.5 text-[13px] leading-[1.45] font-medium",
                      card.highlight ? "text-ink" : "text-web-text-muted",
                    )}
                  >
                    {card.description}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* (f) Final layihə və diplom */}
          <section className="bg-ink text-paper on-dark flex flex-col gap-2.5 rounded-[22px] p-[22px]">
            <SectionLabel tone="lime">{L.final}</SectionLabel>
            <p className="text-web-body m-0">{program.final}</p>
          </section>
        </div>

        {/* ── Sticky altlıq ── */}
        <div className="border-web-border sticky bottom-0 mt-auto flex flex-wrap items-center justify-between gap-3 border-t bg-[rgba(244,242,238,0.9)] px-[clamp(16px,3vw,28px)] py-3.5 backdrop-blur-[14px]">
          <div>
            <div className="text-web-text-muted text-xs font-semibold">
              {L.nextGroup}
            </div>
            <div className="font-display text-lg font-semibold">
              {program.next}
            </div>
          </div>
          <Button onClick={applyToProgram} arrow>
            {L.apply}
          </Button>
        </div>
      </div>
    </div>
  );
}

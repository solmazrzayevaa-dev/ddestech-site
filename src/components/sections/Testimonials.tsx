"use client";

import { useState } from "react";
import {
  CircleButton,
  Container,
  Icons,
  Pill,
  SectionLabel,
} from "@/components/ui";
import { testimonials, testimonialsSection } from "@/content/site";
import { cn } from "@/lib/cn";
import { bgClass, textClass } from "./programColors";

/**
 * Tələbə rəyləri — mərkəzləşdirilmiş sitat, oxlarla dəyişir.
 * Referans: design/landing-reference.html → `<!-- TESTIMONIAL -->`.
 *
 * Rəylər hələ nümunədir ("Nümunə mətn" nişanı) — launch-dan əvvəl
 * real rəylərlə əvəz olunmalıdır (CLAUDE.md → Açıq qalanlar).
 */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  const go = (step: number) =>
    setIndex((i) => (i + step + testimonials.length) % testimonials.length);

  return (
    <section
      id={testimonialsSection.id}
      className="scroll-mt-[90px] py-[clamp(96px,11vw,160px)]"
    >
      <Container className="flex flex-col items-center gap-8 text-center">
        <div className="flex items-center gap-2.5">
          <SectionLabel number="05">Tələbə rəyləri</SectionLabel>
          <Pill variant="outline" className="h-6 text-[11px]">
            {testimonialsSection.sampleBadge}
          </Pill>
        </div>

        <blockquote
          aria-live="polite"
          className="m-0 min-h-[3.7em] max-w-[900px] text-[clamp(24px,2.7vw,38px)] leading-[1.22] font-medium tracking-[-0.025em]"
        >
          “<span className="text-web-text-soft">{current.lead}</span>{" "}
          {current.text}”
        </blockquote>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex">
            {testimonials.map((item, i) => (
              <span
                key={item.name}
                aria-hidden="true"
                className={cn(
                  "rounded-pill border-web-bg inline-flex size-12 items-center justify-center border-[3px] text-base font-bold",
                  i > 0 && "-ml-3",
                  i === index ? "opacity-100" : "opacity-40",
                  bgClass[item.color],
                  item.color === "yellow" ? textClass.ink : textClass.paper,
                )}
              >
                {item.name.charAt(0)}
              </span>
            ))}
          </div>

          <div className="text-left">
            <div className="text-[15px] font-bold">{current.name}</div>
            <div className="text-web-text-muted text-[13px] font-medium">
              {current.meta}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <CircleButton
            aria-label={testimonialsSection.prevLabel}
            variant="outline"
            onClick={() => go(-1)}
          >
            <Icons.ChevronLeft />
          </CircleButton>
          <CircleButton
            aria-label={testimonialsSection.nextLabel}
            variant="ink"
            onClick={() => go(1)}
          >
            <Icons.ChevronRight />
          </CircleButton>
        </div>
      </Container>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Button, Container, Panel, Pill, SectionLabel } from "@/components/ui";
import { programs, programsSection, type Program } from "@/content/site";
import { cn } from "@/lib/cn";
import { ProgramDrawer } from "./ProgramDrawer";
import { ProgramVisual, tileBackground } from "./ProgramVisual";
import { bgClass, textClass } from "./programColors";

/**
 * Proqramlar bölməsi — 3 kart, hər birində 3D + şüşə vizual.
 * "Ətraflı" düyməsi eyni səhifədə sağdan drawer açır (URL dəyişmir).
 * Referans: design/landing-reference.html → `<section id="proqramlar">`.
 */
export function Programs() {
  const [active, setActive] = useState<Program | null>(null);

  return (
    <>
      <Panel
        id={programsSection.id}
        tone="alt"
        className="scroll-mt-[90px] py-[clamp(48px,6vw,88px)]"
      >
        <Container className="flex flex-col gap-10">
          <div className="flex max-w-[760px] flex-col gap-[18px]">
            <SectionLabel number="01">Tədris proqramları</SectionLabel>
            <h2 className="text-web-h2-m lg:text-web-h2 m-0">
              <span className="text-web-text-soft">
                {programsSection.headingSoft}
              </span>
              <br />
              {programsSection.heading}
            </h2>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3">
            {programs.map((program) => (
              <article
                key={program.id}
                className={cn(
                  "rounded-md flex flex-col gap-3.5 p-3",
                  bgClass[program.theme.bg],
                )}
              >
                <div className="flex flex-col gap-3.5 px-3 pt-3 pb-1">
                  <div className="flex flex-wrap gap-1.5">
                    {program.cardChips.map((chip) => (
                      <Pill key={chip}>{chip}</Pill>
                    ))}
                  </div>

                  <h3
                    className={cn(
                      "m-0 text-[clamp(28px,2.6vw,36px)] leading-[0.98] font-semibold tracking-[-0.045em]",
                      textClass[program.theme.cardTitleFg],
                    )}
                  >
                    {program.titleLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h3>

                  <p
                    className={cn(
                      "m-0 text-[15px] leading-[1.5] font-medium",
                      textClass[program.theme.cardBodyFg],
                    )}
                  >
                    {program.cardDescription}
                  </p>
                </div>

                {/* Vizual plitə — dekorasiya, üstündə şüşə "Ətraflı" düyməsi */}
                <div
                  className={cn(
                    "rounded-[20px] relative h-[300px] overflow-hidden",
                    tileBackground[program.id],
                  )}
                >
                  <ProgramVisual id={program.id} />

                  <Button
                    variant="glass"
                    size="sm"
                    arrow
                    onClick={() => setActive(program)}
                    aria-haspopup="dialog"
                    className="absolute bottom-2.5 left-2.5 z-3"
                  >
                    <span className="sr-only">{program.title} — </span>
                    {programsSection.detailsLabel}
                  </Button>

                  <Pill
                    variant={program.id === "uxui" ? "surface" : "ink"}
                    className="absolute top-2.5 right-2.5 z-3"
                  >
                    {program.price}
                  </Pill>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Panel>

      <ProgramDrawer program={active} onClose={() => setActive(null)} />
    </>
  );
}

"use client";

import { useId, useState } from "react";
import { Button, Container, SectionLabel } from "@/components/ui";
import { faq, faqSection } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * FAQ — kartsız redaksiya siyahısı, incə xətlərlə ayrılmış sətirlər.
 * Referans: design/landing-reference.html → `<!-- FAQ -->`.
 * Eyni anda bir sual açıq olur (referansdakı davranış).
 */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section
      id={faqSection.id}
      className="scroll-mt-[90px] py-[clamp(72px,9vw,128px)]"
    >
      <Container className="flex flex-wrap gap-x-16 gap-y-10">
        <div className="flex flex-[1_1_320px] flex-col gap-[18px]">
          <SectionLabel number="08">Suallar</SectionLabel>
          <h2 className="text-web-h2-m lg:text-web-h2 m-0">
            <span className="text-web-text-soft">{faqSection.headingSoft}</span>{" "}
            {faqSection.heading}
          </h2>

          <div className="bg-web-surface shadow-card mt-3 flex items-center gap-3.5 self-start rounded-[22px] py-3.5 pr-3.5 pl-[18px]">
            <span className="text-[15px] font-semibold">
              {faqSection.helpText}
            </span>
            <Button
              href={faqSection.helpCta.href}
              variant="dark"
              size="sm"
              className="h-10"
            >
              {faqSection.helpCta.label}
            </Button>
          </div>
        </div>

        <div className="flex flex-[2_1_560px] flex-col border-t border-[#d6d1c7]">
          {faq.map((item, i) => {
            const isOpen = open === i;
            const panelId = `${baseId}-panel-${i}`;
            const buttonId = `${baseId}-button-${i}`;

            return (
              <div key={item.number} className="border-b border-[#d6d1c7]">
                <h3 className="m-0">
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent py-[26px] text-left"
                  >
                    <span className="flex items-baseline gap-5">
                      <span className="text-web-text-muted text-[13px] font-semibold">
                        {item.number}
                      </span>
                      <span className="text-[clamp(18px,1.6vw,22px)] font-semibold tracking-[-0.02em]">
                        {item.question}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "rounded-pill inline-flex size-10 shrink-0 items-center justify-center text-xl font-medium transition-colors",
                        isOpen
                          ? "bg-ink text-paper"
                          : "bg-web-surface text-ink",
                      )}
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                >
                  <p className="text-web-body text-web-text-muted m-0 pr-14 pb-7 pl-10">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

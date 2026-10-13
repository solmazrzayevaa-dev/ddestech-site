"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  CircleButton,
  Container,
  GlassCard,
  Icons,
  Pill,
  SectionLabel,
} from "@/components/ui";
import { teachers, teachersSection } from "@/content/site";

/**
 * Müəllimlər — sol başlıq + sağda kart cərgəsi, ox düymələri ilə sürüşür.
 * Referans: design/landing-reference.html → `<!-- TEACHERS -->`.
 *
 * Desktop-da hər iki kart sığır; mobil və dar ekranlarda cərgə üfüqi
 * sürüşür və oxlar bir kart addımı ilə hərəkət etdirir.
 */
export function Teachers() {
  const rowRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const row = rowRef.current;
    if (!row) return;

    const card = row.querySelector("article");
    const step = card
      ? card.getBoundingClientRect().width + 12 // kart eni + grid aralığı
      : row.clientWidth;

    // Hərəkət azaldılmış rejimdə animasiya yoxdur (CLAUDE.md → Əlçatanlıq)
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const max = row.scrollWidth - row.clientWidth;
    const target = Math.min(Math.max(row.scrollLeft + step * direction, 0), max);

    row.scrollTo({ left: target, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <section
      id={teachersSection.id}
      className="scroll-mt-[90px] pt-[clamp(72px,9vw,128px)]"
    >
      <Container className="grid grid-cols-1 items-stretch gap-3 min-[900px]:grid-cols-12">
        <div className="min-[900px]:col-span-4 flex flex-col gap-5 py-2 pr-2">
          <SectionLabel number="04">Müəllimlər</SectionLabel>
          <h2 className="text-web-h2-m lg:text-web-h2 m-0 max-w-[286px]">
            <span className="text-web-text-soft">
              {teachersSection.headingSoft}
            </span>{" "}
            {teachersSection.heading}
          </h2>
          <p className="text-web-body text-web-text-muted m-0">
            {teachersSection.intro}
          </p>

          <div className="mt-auto flex gap-2">
            <CircleButton
              aria-label={teachersSection.prevLabel}
              variant="outline"
              onClick={() => scrollByCard(-1)}
            >
              <Icons.ChevronLeft />
            </CircleButton>
            <CircleButton
              aria-label={teachersSection.nextLabel}
              variant="ink"
              onClick={() => scrollByCard(1)}
            >
              <Icons.ChevronRight />
            </CircleButton>
          </div>
        </div>

        <div
          ref={rowRef}
          className="min-[900px]:col-span-8 flex snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {teachers.map((teacher) => (
            <article
              key={teacher.name}
              className="rounded-md relative h-[clamp(420px,38vw,540px)] w-full shrink-0 snap-start overflow-hidden bg-[#d9d4ca] min-[900px]:w-[calc(50%-6px)]"
            >
              <Image
                src={teacher.image}
                alt={teacher.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover"
                style={{ objectPosition: teacher.imagePosition }}
              />

              <Pill
                variant="glass"
                className="absolute top-3.5 left-3.5 z-1"
              >
                {teacher.badge}
              </Pill>

              <GlassCard
                radius="mosaic"
                className="absolute right-2.5 bottom-2.5 left-2.5 flex items-end justify-between gap-3 rounded-[22px] p-[18px]"
              >
                <div>
                  <h3 className="m-0 text-[22px] leading-[1.1] font-semibold tracking-[-0.03em]">
                    {teacher.name}
                  </h3>
                  <p className="m-0 mt-1.5 text-sm font-medium">
                    {teacher.role}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {teacher.links.map((link) => (
                    <CircleButton
                      key={link.ariaLabel}
                      href={link.href}
                      aria-label={`${teacher.name} — ${link.ariaLabel}`}
                      size="sm"
                      variant="ink"
                      className="text-xs font-bold"
                    >
                      {link.ariaLabel === "Instagram" ? (
                        <svg
                          aria-hidden="true"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="5" />
                          <circle cx="12" cy="12" r="4" />
                        </svg>
                      ) : (
                        link.label
                      )}
                    </CircleButton>
                  ))}
                </div>
              </GlassCard>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

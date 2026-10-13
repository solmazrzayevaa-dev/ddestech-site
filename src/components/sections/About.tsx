import Image from "next/image";
import { Container, SectionLabel } from "@/components/ui";
import { about } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * "Necə oxuyursan" — bento: bir tünd böyük kart + 4 rəqəm kartı.
 * Referans: design/landing-reference.html → `<!-- ABOUT: bento -->`.
 */
export function About() {
  const { philosophy } = about;

  return (
    <section
      id={about.id}
      className="scroll-mt-[90px] py-[clamp(72px,9vw,128px)]"
    >
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col items-center gap-[18px] text-center">
          <h2 className="text-web-h2-m lg:text-web-h2 m-0 max-w-[900px]">
            <span className="text-web-text-soft">{about.headingSoft}</span>{" "}
            {about.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 min-[900px]:grid-cols-12">
          {/* Fəlsəfə kartı — tünd, 5 sütun, 2 cərgə */}
          <div className="bg-ink text-paper on-dark rounded-md min-[900px]:col-span-5 min-[900px]:row-span-2 flex flex-col gap-5 p-8 shadow-[0_1px_2px_rgba(21,18,40,0.06),0_24px_56px_-20px_rgba(21,18,40,0.35)]">
            <SectionLabel tone="lime">{philosophy.label}</SectionLabel>

            <p className="m-0 text-[clamp(22px,2vw,28px)] leading-[1.25] font-medium tracking-[-0.025em]">
              {philosophy.text}
            </p>

            <div className="mt-auto flex items-center gap-3">
              <Image
                src={philosophy.author.image}
                alt=""
                width={48}
                height={48}
                className="rounded-pill border-paper size-12 border-2 object-cover"
                style={{ objectPosition: philosophy.author.imagePosition }}
              />
              <div>
                <div className="text-[15px] font-bold">
                  {philosophy.author.name}
                </div>
                <div className="text-[13px] font-medium">
                  {philosophy.author.role}
                </div>
              </div>
            </div>

            <a
              href={philosophy.cta.href}
              className="bg-paper text-ink flex h-13 items-center justify-center rounded-[16px] text-[15px] font-semibold no-underline"
            >
              {philosophy.cta.label}
            </a>
          </div>

          {/* 4 rəqəm kartı — 7 sütun */}
          <div className="min-[900px]:col-span-7 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
            {about.stats.map((stat) => (
              <div
                key={stat.value}
                className={cn(
                  "rounded-md flex flex-col gap-3.5 p-7",
                  stat.highlight
                    ? "bg-lime text-ink"
                    : "bg-web-surface shadow-card",
                )}
              >
                <div
                  className={cn(
                    "flex items-baseline justify-between border-b pb-3.5",
                    stat.highlight ? "border-ink/18" : "border-web-border",
                  )}
                >
                  <span className="font-display text-[clamp(40px,4vw,56px)] leading-none font-semibold tracking-[-0.04em]">
                    {stat.value}
                  </span>
                  <span
                    className={cn(
                      "text-[13px] font-semibold",
                      stat.highlight ? "text-ink" : "text-web-text-muted",
                    )}
                  >
                    {stat.label}
                  </span>
                </div>
                <p
                  className={cn(
                    "m-0 text-[15px] leading-[1.5] font-medium",
                    stat.highlight ? "text-ink" : "text-web-text-muted",
                  )}
                >
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

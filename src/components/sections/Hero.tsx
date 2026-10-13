import Image from "next/image";
import { Button, Container, GlassCard, Panel, Pill } from "@/components/ui";
import { hero } from "@/content/site";

/**
 * Hero — tam enli foto banner, aşağıda tünd keçid.
 * Referans: design/landing-reference.html → `<section id="top">`.
 *
 * `-mt-18` nav-ın hündürlüyünü (60px + 12px sticky offset) kompensasiya edir —
 * şüşə pill fotonun üzərində üzür.
 */
export function Hero() {
  return (
    <Panel
      id="top"
      tone="ink"
      className="-mt-18 flex min-h-[clamp(600px,80vh,860px)] flex-col justify-end"
    >
      <Image
        src={hero.image}
        alt={hero.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_28%]"
      />

      {/* Mətni oxunaqlı saxlayan keçid — referansdakı dayaq nöqtələri */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,18,40,0.28)_0%,rgba(21,18,40,0)_22%,rgba(21,18,40,0)_42%,rgba(21,18,40,0.62)_70%,rgba(21,18,40,0.86)_100%)]"
      />

      {/* Görünmə sarğıda idarə olunur — Pill-in öz `inline-flex`-i
          `hidden` sinfini üstələyir (cn() sinif birləşdirmir). */}
      <span className="absolute top-24 right-5 hidden min-[900px]:block">
        <Pill variant="glass" className="h-[34px] px-3.5">
          {hero.badge}
        </Pill>
      </span>

      <Container className="relative flex flex-wrap items-end justify-between gap-8 pt-35 pb-[clamp(28px,4vw,48px)]">
        <div className="flex max-w-[820px] flex-1 basis-[560px] flex-col gap-[22px]">
          <h1 className="text-paper m-0 text-[clamp(48px,7.2vw,108px)] leading-[0.92] font-semibold tracking-[-0.055em]">
            {hero.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="text-paper m-0 max-w-[520px] text-[clamp(17px,1.5vw,20px)] leading-[1.5] font-medium">
            {hero.subtitle}
          </p>

          <div className="flex flex-wrap gap-2.5">
            <Button
              href={hero.primaryCta.href}
              size="lg"
              arrow
              className="shadow-[0_12px_32px_-10px_rgba(229,53,140,0.7)]"
            >
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} variant="glass" size="lg">
              {hero.secondaryCta.label}
            </Button>
          </div>
        </div>

        {/* Növbəti qrup kartı — ≤900px-də gizlənir, məlumat müraciət bölməsində təkrarlanır */}
        <GlassCard
          radius="xl-m"
          className="hidden w-[310px] shrink-0 flex-col gap-3.5 p-5 min-[900px]:flex"
        >
          <div className="flex items-center justify-between">
            <span className="text-web-label text-web-text-muted">
              {hero.nextGroup.label}
            </span>
            <Pill variant="pink" className="h-[26px]">
              {hero.nextGroup.badge}
            </Pill>
          </div>

          <h2 className="m-0 text-[26px] leading-[1.05] font-semibold tracking-[-0.035em]">
            {hero.nextGroup.program}
          </h2>

          <div aria-hidden="true" className="h-px bg-ink/14" />

          <div className="flex items-baseline justify-between">
            <span className="text-web-label">{hero.nextGroup.startLabel}</span>
            <span className="font-display text-xl font-semibold tracking-[-0.02em]">
              {hero.nextGroup.startDate}
            </span>
          </div>

          <Button
            href={hero.nextGroup.cta.href}
            variant="dark"
            size="sm"
            arrow
            spread
          >
            {hero.nextGroup.cta.label}
          </Button>
        </GlassCard>
      </Container>
    </Panel>
  );
}

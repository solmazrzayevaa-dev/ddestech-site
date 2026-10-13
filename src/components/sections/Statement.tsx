import { Button, Container } from "@/components/ui";
import { statement } from "@/content/site";

/**
 * Mərkəzləşdirilmiş bəyanat + məzun şirkətləri.
 * Referans: design/landing-reference.html → `<!-- STATEMENT -->`.
 */
export function Statement() {
  return (
    <section className="pt-[clamp(72px,9vw,128px)] pb-[clamp(48px,6vw,80px)]">
      <Container className="flex flex-col items-center gap-7 text-center">
        <p className="m-0 max-w-[820px] text-[clamp(24px,2.7vw,38px)] leading-[1.22] font-medium tracking-[-0.025em]">
          <span className="text-web-text-soft">{statement.lead}</span>{" "}
          {statement.text}
        </p>

        <div className="flex flex-wrap justify-center gap-2.5">
          <Button href={statement.primaryCta.href} arrow>
            {statement.primaryCta.label}
          </Button>
          <Button href={statement.secondaryCta.href} variant="surface">
            {statement.secondaryCta.label}
          </Button>
        </div>
      </Container>

      <Container className="mt-[clamp(56px,7vw,88px)] flex flex-col items-center gap-5">
        <p className="text-web-text-muted m-0 text-[13px] font-semibold">
          {statement.logosLabel}
        </p>

        {/* Kənarlarda solğunlaşma maskası — web-guidelines → Logo marquee */}
        <ul className="m-0 flex w-full list-none flex-wrap items-center justify-center gap-x-13 gap-y-5 p-0 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          {statement.logos.map((logo) => (
            <li
              key={logo}
              className="text-web-text-soft text-[19px] font-bold tracking-[-0.02em] whitespace-nowrap"
            >
              {logo}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

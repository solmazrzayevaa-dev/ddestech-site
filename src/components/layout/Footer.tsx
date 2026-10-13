import { Panel, SectionLabel } from "@/components/ui";
import { footer } from "@/content/site";

/**
 * Footer — nəhəng wordmark ilə.
 * Referans: design/landing-reference.html → `<!-- FOOTER: giant wordmark -->`.
 */
export function Footer() {
  return (
    <Panel
      as="footer"
      tone="alt"
      className="px-[clamp(24px,4vw,56px)] pt-[clamp(32px,4vw,56px)]"
    >
      <div className="flex flex-wrap justify-between gap-10">
        <p className="m-0 max-w-[340px] text-base leading-[1.55] font-medium">
          {footer.tagline}
        </p>

        <div className="flex flex-wrap gap-14">
          <nav
            aria-label="Səhifə"
            className="flex flex-col gap-2.5 text-[15px] font-semibold"
          >
            <SectionLabel>{footer.pageLabel}</SectionLabel>
            {footer.pageLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-web-cta no-underline transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-2.5 text-[15px] font-semibold">
            <SectionLabel>{footer.contactLabel}</SectionLabel>
            {footer.contactLinks.map((link) => {
              const external = link.href.startsWith("http");
              return (
                <a
                  key={link.href}
                  href={link.href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="hover:text-web-cta no-underline transition-colors"
                >
                  {link.label}
                </a>
              );
            })}
            <span>{footer.address}</span>
          </div>
        </div>
      </div>

      <div className="text-web-text-muted mt-14 flex items-end justify-between gap-4 text-[13px] font-semibold">
        <span>{footer.copyright}</span>
        <span>{footer.city}</span>
      </div>

      {/* Nəhəng wordmark — dekorasiya, ekran oxuyucusu üçün təkrardır */}
      <div
        aria-hidden="true"
        className="font-display text-ink mt-4 mb-[-0.06em] text-[clamp(72px,17.5vw,260px)] leading-[0.78] font-semibold tracking-[-0.06em] whitespace-nowrap"
      >
        {footer.wordmark}
      </div>
    </Panel>
  );
}

import { aiCreator } from "@/content/site";
import type { AiCreatorPriceState } from "@/lib/aiCreatorPrice";
import { cn } from "@/lib/cn";

/**
 * AI Creator banner-i və modalının ortaq hissələri.
 * Mənbə: `ai-creator-banner.html` → `.acb__spark`, `.ac-status`, `.ac-chip`,
 * `.ac-motto`, `.ac-price`.
 *
 * Breakpoint-lər referansdakı kimi 960px və 860px-dir (Tailwind-in 768/1024
 * default-ları deyil) — dizayn dəyişməsin deyə `min-[960px]:` şəklində yazılır.
 */

/** Küncdəki lime ulduz. */
export function Spark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      className={cn("fill-lime pointer-events-none absolute", className)}
    >
      <path d="M50 0C54 34 66 46 100 50C66 54 54 66 50 100C46 66 34 54 0 50C34 46 46 34 50 0Z" />
    </svg>
  );
}

/** "● Qeydiyyat açıqdır · 29 Oktyabr, 12:00" */
export function StatusPill({ children }: { children: string }) {
  return (
    <span className="rounded-pill inline-flex items-center gap-2 bg-white/15 px-3.5 py-2 text-sm font-semibold">
      <span
        aria-hidden="true"
        className="bg-lime size-2 shrink-0 rounded-full"
      />
      {children}
    </span>
  );
}

/** Əyilmiş lime "Yeni proqram" nişanı. */
export function NewChip() {
  return (
    <span className="rounded-pill bg-lime text-ink inline-block -rotate-3 px-3.5 py-2 text-sm font-bold">
      {aiCreator.chip}
    </span>
  );
}

/** "Tək nəfərlik böyük komanda." — sakit hissə ağ/72, vurğu lime. */
export function Motto({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "mt-3.5 mb-0 font-medium tracking-[-0.03em] leading-[1.15]",
        className,
      )}
    >
      <span className="text-white/70">{aiCreator.mottoSoft}</span>{" "}
      <span className="text-lime">{aiCreator.motto}</span>
    </p>
  );
}

type PriceProps = {
  state: AiCreatorPriceState;
  /** Qiymət rəqəminin ölçüsü — banner 48px, footer 30px, xülasə 36px. */
  size: "lg" | "md" | "sm";
  /** Tünd fon (banner) və ya ağ fon (modal) üçün rəng dəsti. */
  tone: "on-dark" | "on-light";
};

const priceSizes = {
  lg: "text-[48px]",
  md: "text-[36px]",
  sm: "text-[30px]",
} as const;

const suffixSizes = {
  lg: "text-base",
  md: "text-[15px]",
  sm: "text-[15px]",
} as const;

/** "80 ₼ /ay 120 ₼" — köhnə qiymət yalnız early bird vaxtı görünür. */
export function PriceRow({ state, size, tone }: PriceProps) {
  const dark = tone === "on-dark";

  return (
    <div className="mt-1.5 flex items-baseline gap-2">
      <strong
        className={cn(
          "font-display leading-none font-bold",
          priceSizes[size],
        )}
      >
        {state.price} ₼
      </strong>
      <small
        className={cn(
          "font-semibold",
          suffixSizes[size],
          dark ? "text-white/80" : "text-web-text-muted",
        )}
      >
        /ay
      </small>
      {state.early && (
        <s
          className={cn(
            "font-display font-semibold decoration-2",
            size === "lg" ? "text-xl" : "text-[17px]",
            dark ? "text-white/60" : "text-web-text-soft",
          )}
        >
          {state.oldPrice} ₼
        </s>
      )}
    </div>
  );
}

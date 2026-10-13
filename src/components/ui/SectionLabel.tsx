import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Editorial bölmə etiketi: "(01) Tədris proqramları".
 * Referans: `.lbl` — 13px / 600 / +0.02em.
 *
 * Böyük hərfli "KICKER" yoxdur — mötərizədə nömrə + Title Case
 * (design/web-guidelines.md → 2026 istiqaməti, 5).
 */

export type SectionLabelTone = "muted" | "lime" | "ink" | "paper";

const toneClasses: Record<SectionLabelTone, string> = {
  muted: "text-web-text-muted",
  lime: "text-lime",
  ink: "text-ink",
  paper: "text-paper",
};

export type SectionLabelProps = ComponentPropsWithoutRef<"p"> & {
  /** Mötərizədəki nömrə, məs. "01". Verilməsə `children` olduğu kimi çıxır. */
  number?: string;
  children: string;
  tone?: SectionLabelTone;
};

export function SectionLabel({
  number,
  children,
  tone = "muted",
  className,
  ...rest
}: SectionLabelProps) {
  return (
    <p
      className={cn("text-web-label m-0", toneClasses[tone], className)}
      {...rest}
    >
      {number ? `(${number}) ${children}` : children}
    </p>
  );
}

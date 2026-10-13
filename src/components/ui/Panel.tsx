import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Çərçivəli kanvasın bir paneli — səhifə uzun bir səth deyil, ekran
 * kənarından 12px (mobil 8px) içəri çəkilmiş yumru panellərdir.
 * Referans: `.panel` — radius 36px (mobil 24px), overflow hidden.
 *
 * Boşluğu panelin özü yox, səhifə sarğısı verir (`p-web-frame-m sm:p-web-frame`).
 */

export type PanelTone = "bg" | "alt" | "ink" | "lime" | "surface" | "none";

const toneClasses: Record<PanelTone, string> = {
  bg: "bg-web-bg",
  alt: "bg-web-bg-alt",
  ink: "bg-ink text-paper",
  lime: "bg-lime text-ink",
  surface: "bg-web-surface",
  none: "",
};

type PanelProps<T extends ElementType> = {
  as?: T;
  tone?: PanelTone;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "tone" | "children" | "className">;

export function Panel<T extends ElementType = "section">({
  as,
  tone = "none",
  children,
  className,
  ...rest
}: PanelProps<T>) {
  const Component = (as ?? "section") as ElementType;

  return (
    <Component
      className={cn(
        "rounded-xl-m md:rounded-xl relative overflow-hidden",
        // Tünd panellərdə fokus halqası ağ olur (globals.css → .on-dark)
        tone === "ink" && "on-dark",
        toneClasses[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Şüşə səth — nav pill, foto üzərindəki ad lövhəsi, tədbir kartı.
 *
 * DİQQƏT: yalnız foto və ya rəngli blok üzərində işlənir. Düz `web-bg` fonda
 * şüşə kart qoyma, şüşə içində şüşə qurma, üzərinə 2 sətirdən uzun mətn yazma
 * (design/web-guidelines.md → Şüşə → Etmə).
 */

export type GlassTone = "light" | "dark";

export type GlassRadius = "sm" | "mosaic" | "md" | "xl-m" | "xl" | "pill";

const radiusClasses: Record<GlassRadius, string> = {
  sm: "rounded-sm",
  mosaic: "rounded-mosaic",
  md: "rounded-md",
  "xl-m": "rounded-xl-m",
  xl: "rounded-xl",
  pill: "rounded-pill",
};

type GlassCardProps<T extends ElementType> = {
  as?: T;
  tone?: GlassTone;
  radius?: GlassRadius;
  children: ReactNode;
  className?: string;
} & Omit<
  ComponentPropsWithoutRef<T>,
  "as" | "tone" | "radius" | "children" | "className"
>;

export function GlassCard<T extends ElementType = "div">({
  as,
  tone = "light",
  radius = "md",
  children,
  className,
  ...rest
}: GlassCardProps<T>) {
  const Component = (as ?? "div") as ElementType;

  return (
    <Component
      className={cn(
        tone === "light" ? "glass text-ink" : "glass-dark text-paper",
        radiusClasses[radius],
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}

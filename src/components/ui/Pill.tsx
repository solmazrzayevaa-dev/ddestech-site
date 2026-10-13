import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Chip / teq / status nişanı. Referans: `.pill` — 30px hündürlük, 13px/600.
 * `dot` verildikdə solda lime status nöqtəsi ("● Qəbul açıqdır").
 */

export type PillVariant =
  | "surface" // ağ fon — rəngli kart üzərində
  | "ink"
  | "pink"
  | "lime"
  | "glass" // foto üzərində
  | "glass-dark"
  | "outline" // kəsik konturlu qeyd ("Nümunə mətn")
  | "translucent"; // tünd panel üzərində ağ 10%

const variantClasses: Record<PillVariant, string> = {
  surface: "bg-paper text-ink",
  ink: "bg-ink text-paper",
  pink: "bg-pink text-paper",
  lime: "bg-lime text-ink",
  glass: "glass text-ink",
  "glass-dark": "glass-dark text-paper",
  outline: "bg-paper text-web-text-muted border border-dashed border-[#c9c4ba]",
  translucent: "bg-white/10 text-paper",
};

export type PillProps = ComponentPropsWithoutRef<"span"> & {
  children: ReactNode;
  variant?: PillVariant;
  /** Solda status nöqtəsi. */
  dot?: boolean;
};

export function Pill({
  children,
  variant = "surface",
  dot = false,
  className,
  ...rest
}: PillProps) {
  return (
    <span
      className={cn(
        "rounded-pill text-web-label inline-flex h-[30px] items-center gap-2 px-3 whitespace-nowrap",
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="bg-lime rounded-pill size-[7px] shrink-0"
        />
      )}
      {children}
    </span>
  );
}

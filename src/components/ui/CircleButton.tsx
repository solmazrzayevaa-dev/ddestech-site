import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Dairəvi ikon düyməsi — karusel oxları, menyu, drawer bağlama, FAQ +/−.
 * Referans: `.circ` — 44px, radius pill.
 *
 * `aria-label` MƏCBURİDİR: içəridə yalnız ikon var, görünən mətn yoxdur.
 */

export type CircleButtonVariant =
  | "ink"
  | "outline"
  | "glass"
  | "pink"
  | "paper";

export type CircleButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<CircleButtonVariant, string> = {
  ink: "bg-ink text-paper hover:bg-ink/90",
  outline:
    "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-paper bg-transparent",
  glass: "glass text-ink",
  pink: "bg-pink text-paper hover:bg-pink-deep",
  paper: "bg-paper text-ink hover:bg-web-bg-alt",
};

const sizeClasses: Record<CircleButtonSize, string> = {
  sm: "size-9",
  md: "size-10",
  lg: "size-11",
};

type BaseProps = {
  children: ReactNode;
  /** Görünən mətn olmadığı üçün məcburidir. */
  "aria-label": string;
  variant?: CircleButtonVariant;
  size?: CircleButtonSize;
  className?: string;
};

// React 19-da `ref` adi prop-dur — ComponentProps onu daxil edir.
type AnchorProps = BaseProps &
  Omit<ComponentProps<"a">, keyof BaseProps> & { href: string };

type NativeButtonProps = BaseProps &
  Omit<ComponentProps<"button">, keyof BaseProps> & {
    href?: undefined;
  };

export type CircleButtonProps = AnchorProps | NativeButtonProps;

export function CircleButton({
  children,
  variant = "ink",
  size = "lg",
  className,
  ...rest
}: CircleButtonProps) {
  const classes = cn(
    "inline-flex shrink-0 items-center justify-center rounded-pill no-underline transition-colors",
    sizeClasses[size],
    variantClasses[variant],
    className,
  );

  if (rest.href !== undefined) {
    const { href, ...anchorProps } = rest as AnchorProps;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { type = "button", ...buttonProps } = rest as NativeButtonProps;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

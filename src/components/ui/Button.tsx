import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "./icons";
import { cn } from "@/lib/cn";

/**
 * Pill düymə. Referans: design/landing-reference.html → `.btn` / `.arw`.
 * Hündürlük 52px, radius pill, sağda ox dairəsi hover-də −45° fırlanır.
 *
 * `href` verildikdə `<a>`, verilmədikdə `<button>` render olunur —
 * heç vaxt klik olunan `<div>` yoxdur (CLAUDE.md → Əlçatanlıq).
 */

export type ButtonVariant =
  | "primary" // əsas CTA: bright pink + ağ mətn
  | "dark" // ikinci dərəcəli: ink pill
  | "glass" // yalnız foto və ya rəngli blok üzərində
  | "outline" // ink kontur, şəffaf fon
  | "surface"; // neytral fonda ağ pill

export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-pink text-paper hover:bg-pink-deep",
  dark: "bg-ink text-paper hover:bg-ink/90",
  glass: "glass text-ink",
  outline: "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-paper",
  surface: "bg-web-surface text-ink shadow-card hover:shadow-float",
};

/** Ox dairəsinin rəngi variant-a görə dəyişir (referansdakı `.arw`). */
const arrowClasses: Record<ButtonVariant, string> = {
  primary: "bg-paper text-pink",
  dark: "bg-pink text-paper",
  glass: "bg-ink text-paper",
  outline: "bg-ink text-paper",
  surface: "bg-ink text-paper",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-11 text-web-small",
  md: "h-[52px] text-[15px]",
  lg: "h-14 text-web-button",
};

/** Ox olanda sağ tərəf dairəyə yer vermək üçün daralır. */
const paddingClasses: Record<ButtonSize, { withArrow: string; plain: string }> =
  {
    sm: { withArrow: "pl-4 pr-1.5", plain: "px-4" },
    md: { withArrow: "pl-[22px] pr-2", plain: "px-[22px]" },
    lg: { withArrow: "pl-6 pr-2", plain: "px-6" },
  };

const arrowSizeClasses: Record<ButtonSize, string> = {
  sm: "size-8",
  md: "size-[38px]",
  lg: "size-10",
};

const arrowIconSize: Record<ButtonSize, number> = { sm: 14, md: 16, lg: 16 };

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Sağda fırlanan ox dairəsi. */
  arrow?: boolean;
  /** Mətn solda, ox sağ kənarda (dar kartlarda tam en üçün). */
  spread?: boolean;
  className?: string;
};

// React 19-da `ref` adi prop-dur — ComponentProps onu daxil edir.
type AnchorProps = BaseProps &
  Omit<ComponentProps<"a">, keyof BaseProps> & { href: string };

type NativeButtonProps = BaseProps &
  Omit<ComponentProps<"button">, keyof BaseProps> & {
    href?: undefined;
  };

export type ButtonProps = AnchorProps | NativeButtonProps;

export function Button({
  children,
  variant = "primary",
  size = "md",
  arrow = false,
  spread = false,
  className,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "group inline-flex items-center gap-3 rounded-pill font-semibold whitespace-nowrap no-underline transition-colors",
    variant === "primary" && "font-bold",
    sizeClasses[size],
    arrow ? paddingClasses[size].withArrow : paddingClasses[size].plain,
    spread && "w-full justify-between",
    variantClasses[variant],
    className,
  );

  const content = (
    <>
      {children}
      {arrow && (
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex items-center justify-center rounded-pill transition-transform duration-300 group-hover:-rotate-45",
            arrowSizeClasses[size],
            arrowClasses[variant],
          )}
        >
          <ArrowRight size={arrowIconSize[size]} />
        </span>
      )}
    </>
  );

  if (rest.href !== undefined) {
    const { href, ...anchorProps } = rest as AnchorProps;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {content}
      </a>
    );
  }

  const { type = "button", ...buttonProps } = rest as NativeButtonProps;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Məzmun konteyneri. Referans: `.in` — maks. en 1280px,
 * kənar boşluq clamp(16px, 3vw, 40px) (web-gutter-m → web-gutter).
 */

type ContainerProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function Container<T extends ElementType = "div">({
  as,
  children,
  className,
  ...rest
}: ContainerProps<T>) {
  const Component = (as ?? "div") as ElementType;

  return (
    <Component
      className={cn(
        "max-w-web mx-auto w-full px-[clamp(16px,3vw,40px)]",
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}

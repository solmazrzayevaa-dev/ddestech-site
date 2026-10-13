/**
 * Ortaq ikonlar. Hamısı `currentColor` ilə çəkilir və `aria-hidden`-dir —
 * mənanı həmişə ətrafdakı mətn və ya `aria-label` daşıyır.
 * Ölçülər referansdakı stroke-width 2.5 / viewBox 24 ilə eynidir.
 */

type IconProps = {
  size?: number;
  className?: string;
};

function Svg({
  size = 16,
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  );
}

export function ChevronLeft(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M15 6l-6 6 6 6" />
    </Svg>
  );
}

export function ChevronRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 6l6 6-6 6" />
    </Svg>
  );
}

export function Close(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  );
}

export function Menu(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 9h14M5 15h14" />
    </Svg>
  );
}

export function Check(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 12l5 5L19 7" />
    </Svg>
  );
}

/** DesTech ulduzu — nav loqo nişanı. Fill ilə çəkilir. */
export function Star({ size = 20, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        d="M12 0c.8 6.4 5.6 11.2 12 12-6.4.8-11.2 5.6-12 12-.8-6.4-5.6-11.2-12-12C6.4 11.2 11.2 6.4 12 0z"
        fill="currentColor"
      />
    </svg>
  );
}

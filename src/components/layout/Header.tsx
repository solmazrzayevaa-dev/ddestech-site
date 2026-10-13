"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button, CircleButton, Icons } from "@/components/ui";
import { nav, navLinks, site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Üzən şüşə nav pill — sticky, hero fotosunun üzərində.
 * Referans: design/landing-reference.html → `<header>` + `.navlinks`.
 *
 * ≤900px: link qrupu gizlənir, hamburger görünür → tam ekran menyu.
 * Menyu Esc ilə bağlanır, fokus panel içində qalır, açıq olanda səhifə
 * scroll olunmur (CLAUDE.md → Əlçatanlıq).
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Esc ilə bağlanma + fokus tələsi
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Açıq olanda səhifə scroll olunmur
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Menyu açılanda fokus panelə, bağlananda hamburger düyməsinə qayıdır.
  // İlk render-də işləmir — əks halda səhifə yüklənəndə fokusu oğurlayardı.
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    if (open) {
      panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    } else {
      toggleRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  return (
    <>
      <header className="sticky top-web-frame z-30 flex h-15 justify-center px-2">
        <nav
          aria-label={nav.ariaLabel}
          className="glass rounded-pill flex h-15 w-full max-w-[1180px] items-center justify-between gap-3 px-2"
        >
          {/* Loqo */}
          <a
            href="#top"
            className="text-ink inline-flex items-center gap-2.5 no-underline"
          >
            <span
              aria-hidden="true"
              className="bg-ink text-lime rounded-pill inline-flex size-11 items-center justify-center"
            >
              <Icons.Star size={20} />
            </span>
            <span className="font-display text-[17px] font-semibold tracking-[-0.02em]">
              {site.name}
            </span>
          </a>

          {/* Desktop link qrupu — ≤900px-də gizlənir */}
          <div className="rounded-pill hidden items-center gap-0.5 bg-ink/6 p-1 min-[900px]:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-pill text-ink hover:bg-ink hover:text-paper inline-flex h-9 items-center px-3.5 text-sm font-semibold no-underline transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <Button href={nav.cta.href} size="sm" arrow className="text-sm">
              {nav.cta.label}
            </Button>
            <CircleButton
              ref={toggleRef}
              aria-label={nav.menuOpenLabel}
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen(true)}
              className="min-[900px]:hidden"
            >
              <Icons.Menu size={18} />
            </CircleButton>
          </div>
        </nav>
      </header>

      {/* Mobil tam ekran menyu */}
      <div
        id={menuId}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={nav.ariaLabel}
        hidden={!open}
        className={cn(
          "bg-web-bg fixed inset-0 z-40 flex flex-col p-web-frame-m min-[900px]:hidden",
          !open && "pointer-events-none",
        )}
      >
        <div className="flex h-15 items-center justify-between px-2">
          <span className="inline-flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="bg-ink text-lime rounded-pill inline-flex size-11 items-center justify-center"
            >
              <Icons.Star size={20} />
            </span>
            <span className="font-display text-[17px] font-semibold tracking-[-0.02em]">
              {site.name}
            </span>
          </span>
          <CircleButton
            aria-label={nav.menuCloseLabel}
            onClick={() => setOpen(false)}
          >
            <Icons.Close size={18} />
          </CircleButton>
        </div>

        <nav
          aria-label={nav.ariaLabel}
          className="mt-8 flex flex-1 flex-col gap-1 px-2"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-web-h2-m border-web-border text-ink border-b py-4 no-underline"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="px-2 pb-4">
          <Button
            href={nav.cta.href}
            arrow
            spread
            onClick={() => setOpen(false)}
          >
            {nav.cta.label}
          </Button>
        </div>
      </div>
    </>
  );
}

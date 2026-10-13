"use client";

import { useEffect, useRef } from "react";

/**
 * Modal davranışı: Esc ilə bağlanma, fokus tələsi, səhifə scroll kilidi,
 * bağlananda fokusun açan elementə qayıtması.
 *
 * Həm mobil menyu, həm proqram drawer-i eyni məntiqi işlədir
 * (CLAUDE.md → Əlçatanlıq: drawer üçün fokus tələsi və Esc ilə bağlanma).
 */
export function useDialog<
  Panel extends HTMLElement,
  Trigger extends HTMLElement,
>(open: boolean, onClose: () => void) {
  const panelRef = useRef<Panel>(null);
  const triggerRef = useRef<Trigger>(null);

  // Esc + Tab tələsi
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
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
  }, [open, onClose]);

  // Açıq olanda səhifə scroll olunmur
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Açılanda fokus panelə, bağlananda açan elementə qayıdır.
  // İlk render-də işləmir — əks halda səhifə yüklənəndə fokusu oğurlayardı.
  const mounted = useRef(false);
  /** Açılmazdan əvvəl fokusda olan element — `triggerRef` verilməyəndə ehtiyat. */
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    if (open) {
      previouslyFocused.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      panelRef.current
        ?.querySelector<HTMLElement>('button:not([disabled]), a[href]')
        ?.focus();
    } else {
      const target = triggerRef.current ?? previouslyFocused.current;
      target?.focus({ preventScroll: true });
    }
  }, [open]);

  return { panelRef, triggerRef };
}

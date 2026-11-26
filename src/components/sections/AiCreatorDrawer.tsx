"use client";

import { useEffect, useRef } from "react";
import { Close } from "@/components/ui/icons";
import { aiCreator, aiCreatorDetails } from "@/content/site";
import { AI_CREATOR_PRICE_AZN } from "@/lib/aiCreatorPrice";
import { PriceRow } from "./AiCreatorParts";

/**
 * "Ətraflı" paneli — sağdan açılan yan panel (dizayn `Details`).
 * Native `<dialog>`: Esc ilə bağlanır, fokus tələsi var.
 */
export function AiCreatorDrawer({
  open,
  onClose,
  onRegister,
}: {
  open: boolean;
  onClose: () => void;
  onRegister: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="aiCreatorDrawerTitle"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="destech-slide-right fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-[560px] overflow-y-auto border-0 bg-white p-0 text-[#151228] backdrop:bg-[rgba(21,18,40,0.6)]"
    >
      <div className="flex min-h-full flex-col">
        <header className="bg-[#1d1b20] px-7 pt-7 pb-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="m-0 flex items-center gap-2.5 text-sm font-semibold text-[#ffd3e8]">
                <span aria-hidden="true" className="size-2 rounded-full bg-white" />
                {aiCreator.statusOpen}
              </p>
              <h2
                id="aiCreatorDrawerTitle"
                className="mt-4 mb-0 text-[30px] leading-[1.15] font-bold tracking-[-0.01em]"
              >
                AI Creator
              </h2>
              <p className="mt-1 mb-0 text-lg font-semibold">
                Tək nəfərlik{" "}
                <span className="font-accent text-[#ff9fd3] italic">
                  böyük komanda
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={aiCreator.close}
              className="grid size-11 shrink-0 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white"
            >
              <Close size={20} />
            </button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-9 px-7 py-8">
          <p className="m-0 text-[22px] leading-[1.35] font-medium tracking-[-0.02em]">
            <strong className="font-semibold">{aiCreatorDetails.introLead}</strong>{" "}
            <span className="text-[#5a566e]">{aiCreatorDetails.introText}</span>
          </p>

          <section>
            <h3 className="mt-0 mb-2.5 text-xl font-semibold tracking-[-0.02em]">
              {aiCreatorDetails.audienceLabel}
            </h3>
            <p className="m-0 text-[15px] leading-[1.6] text-[#5a566e]">
              {aiCreatorDetails.audienceText}
            </p>
          </section>

          <section>
            <h3 className="mt-0 mb-2 text-xl font-semibold tracking-[-0.02em]">
              {aiCreatorDetails.programLabel}
            </h3>
            <ol className="m-0 list-none border-b border-[#e4e0d8] p-0">
              {aiCreatorDetails.modules.map((module) => (
                <li
                  key={module.number}
                  className="grid grid-cols-[44px_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1 border-t border-[#e4e0d8] py-4"
                >
                  <span className="font-display text-base font-bold text-[#b8226f]">
                    {module.number}
                  </span>
                  <div>
                    <span className="text-[13px] font-bold text-[#b8226f]">
                      {module.role}
                    </span>
                    <strong className="block text-[15px] font-semibold">
                      {module.title}
                    </strong>
                    <small className="mt-1 block text-[13px] leading-[1.5] text-[#5a566e]">
                      {module.description}
                    </small>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <footer className="sticky bottom-0 flex flex-wrap items-center justify-between gap-4 border-t border-[#e4e0d8] bg-white px-7 py-5">
          <div>
            <PriceRow price={AI_CREATOR_PRICE_AZN} size="md" tone="on-light" />
            <span className="mt-1 block text-[13px] text-[#5a566e]">
              {aiCreatorDetails.footerNote}
            </span>
          </div>
          <button
            type="button"
            onClick={onRegister}
            className="inline-flex h-12 items-center gap-2.5 rounded-full bg-[#e5358c] px-6 text-base font-bold text-white transition-colors duration-500 hover:bg-[#9a1a5c] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#151228]"
          >
            {aiCreatorDetails.footerCta}
          </button>
        </footer>
      </div>
    </dialog>
  );
}

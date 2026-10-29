"use client";

import { useCallback, useState } from "react";
import { Panel } from "@/components/ui";
import { ArrowRight } from "@/components/ui/icons";
import { aiCreator } from "@/content/site";
import { useHashTab, type AiCreatorTab } from "@/hooks/useHashTab";
import type { AiCreatorPriceState } from "@/lib/aiCreatorPrice";
import { AiCreatorModal } from "./AiCreatorModal";
import { Motto, NewChip, PriceRow, Spark, StatusPill } from "./AiCreatorParts";

/**
 * AI Creator banneri — hero-dan sonra, proqramlar bölməsindən əvvəl.
 * "Ətraflı və qeydiyyat" düyməsi eyni səhifədə modal açır; URL dəyişmir.
 * Mənbə: `ai-creator-banner.html` → `.acb`.
 *
 * `price` serverdə hesablanır (bax `src/app/page.tsx`) — brauzerdə tarixə
 * görə yenidən hesablamaq hidrasiya uyğunsuzluğu yaradardı.
 */

export function AiCreator({ price }: { price: AiCreatorPriceState }) {
  const [openTab, setOpenTab] = useState<AiCreatorTab | null>(null);
  const hashTab = useHashTab();
  /** Hash ilə açılan modal bağlandıqdan sonra yenidən açılmasın. */
  const [hashUsed, setHashUsed] = useState(false);

  const tab = openTab ?? (hashUsed ? null : hashTab);

  const close = useCallback(() => {
    setOpenTab(null);
    setHashUsed(true);
  }, []);

  return (
    <>
      <Panel
        id={aiCreator.id}
        aria-labelledby="aiCreatorTitle"
        className="min-[960px]:grid-cols-[minmax(0,620px)_1fr] min-[960px]:min-h-[480px] min-[960px]:px-14 min-[960px]:py-12 on-dark grid grid-cols-1 gap-6 bg-[radial-gradient(circle_at_78%_50%,var(--color-cobalt-glow)_0,var(--color-cobalt)_42%,var(--color-cobalt-deep)_100%)] px-5 py-6 text-white"
      >
        <Spark className="min-[960px]:-top-[34px] min-[960px]:-right-[30px] min-[960px]:size-[110px] -top-[26px] -right-[26px] size-[92px]" />

        {/* Mobildə `contents` olur ki, başlıq / orbit / qiymət grid-də
            referansdakı sıra ilə düzülsün (mətn → orbit → qiymət). */}
        <div className="min-[960px]:relative min-[960px]:z-[1] min-[960px]:flex min-[960px]:flex-col min-[960px]:justify-between min-[960px]:gap-7 contents">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <StatusPill>
                {price.open ? aiCreator.statusOpen : aiCreator.statusClosed}
              </StatusPill>
              <NewChip />
            </div>
            <h2
              id="aiCreatorTitle"
              className="mt-[22px] mb-0 text-[clamp(52px,8vw,96px)] leading-[0.95] font-semibold tracking-[-0.055em]"
            >
              {aiCreator.title}
            </h2>
            <Motto className="text-[clamp(22px,2.6vw,32px)]" />
            <div className="mt-4 flex flex-wrap gap-x-[18px] gap-y-1.5 text-[13px] font-semibold text-white/85">
              {aiCreator.meta.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-x-7 gap-y-5 max-[959px]:order-3">
            <div>
              {price.early && (
                <div className="text-lime text-[13px] font-bold">
                  {aiCreator.earlyBirdShort}
                </div>
              )}
              <PriceRow state={price} size="lg" tone="on-dark" />
            </div>
            <button
              type="button"
              onClick={() => setOpenTab("program")}
              className="rounded-pill text-ink group inline-flex h-14 items-center gap-3.5 bg-white pr-2 pl-6 text-[17px] font-bold max-[959px]:w-full max-[959px]:justify-between"
            >
              {aiCreator.openCta}
              <span
                aria-hidden="true"
                className="rounded-pill bg-pink grid size-10 place-items-center text-white transition-transform duration-300 group-hover:-rotate-45"
              >
                <ArrowRight size={18} />
              </span>
            </button>
          </div>
        </div>

        {/* Orbit: mərkəzdə "Sən", ətrafında 8 rol. Mobildə sadə çip sırası. */}
        <div
          aria-label={aiCreator.orbitLabel}
          className="min-[960px]:relative min-[960px]:min-h-[384px] min-[960px]:block flex flex-wrap items-center gap-1.5 max-[959px]:order-2"
        >
          {/* Dekorativ orbit dairələri — yalnız desktopda */}
          <span
            aria-hidden="true"
            className="min-[960px]:block absolute top-1/2 left-1/2 hidden h-[330px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20"
          />
          <span
            aria-hidden="true"
            className="min-[960px]:block absolute top-1/2 left-1/2 hidden h-[220px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/30"
          />

          <div className="min-[960px]:absolute min-[960px]:top-1/2 min-[960px]:left-1/2 min-[960px]:size-[138px] min-[960px]:-translate-x-1/2 min-[960px]:-translate-y-1/2 min-[960px]:flex-col min-[960px]:gap-0.5 min-[960px]:shadow-[0_24px_60px_rgba(11,20,90,0.45)] bg-lime text-ink z-[1] flex size-[52px] items-center justify-center rounded-full">
            <b className="min-[960px]:text-[34px] text-base leading-none font-bold tracking-[-0.04em]">
              {aiCreator.youLabel}
            </b>
            <span className="font-display min-[960px]:inline hidden text-[13px] font-semibold">
              {aiCreator.youValue}
            </span>
          </div>

          <ul className="min-[960px]:block m-0 contents list-none p-0">
            {aiCreator.roles.map((role) => (
              <li
                key={role.label}
                style={{
                  // Desktopda mövqe mərkəzdən sapma ilə verilir; mobildə
                  // `max-[959px]:!transform-none` bunu söndürür.
                  transform: `translate(calc(-50% + ${role.x}px), calc(-50% + ${role.y}px)) rotate(${role.rotate}deg)`,
                }}
                className="rounded-pill text-ink min-[960px]:absolute min-[960px]:top-1/2 min-[960px]:left-1/2 min-[960px]:z-[2] min-[960px]:px-4 min-[960px]:py-[9px] min-[960px]:text-[15px] min-[960px]:shadow-[0_10px_24px_rgba(21,18,40,0.22)] bg-white px-3 py-[7px] text-[13px] font-bold whitespace-nowrap max-[959px]:!transform-none"
              >
                {role.label}
              </li>
            ))}
          </ul>
        </div>
      </Panel>

      <AiCreatorModal tab={tab} price={price} onClose={close} />
    </>
  );
}

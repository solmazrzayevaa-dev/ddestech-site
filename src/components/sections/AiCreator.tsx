"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { aiCreator } from "@/content/site";
import { useHashTab, type AiCreatorTab } from "@/hooks/useHashTab";
import { AI_CREATOR_PRICE_AZN } from "@/lib/aiCreatorPrice";
import { AiCreatorModal } from "./AiCreatorModal";
import { PriceRow, StatusPill } from "./AiCreatorParts";

/**
 * AI Creator banneri (v2) — mənbə: dizayn kətanı `V5`.
 * Qaranlıq → çəhrayı qradiyent, üzən peşə pilləri, nəhəng "0-dan".
 *
 * "Nələr öyrənəcəyinə bax" → ətraflı modal (hələlik köhnə proqram tabı;
 * Mərhələ 2-də `Details` panelinə keçəcək).
 * Peşə input-u Enter/göndər ilə `/ai-plan?q=…` səhifəsinə keçir.
 *
 * `price` serverdə hesablanır (bax `src/app/page.tsx`).
 */

/** Dizayndakı üzən peşə pilləri: [mövqe, fırlanma, gecikmə (s)] */
const FLOATING_ROLES: Array<{
  label: string;
  className: string;
  rotate: number;
  delay: number;
}> = [
  { label: "Marketoloq", className: "left-[-18px] top-[12%]", rotate: -8, delay: 0 },
  { label: "Mühasib", className: "left-[4%] top-[25%]", rotate: 6, delay: 0.7 },
  { label: "Biznes analitik", className: "left-[-24px] top-[38%]", rotate: -5, delay: 1.4 },
  { label: "Vəkil", className: "left-[6%] top-[88%]", rotate: -6, delay: 0.9 },
  { label: "Müəllim", className: "right-[-16px] top-[10%]", rotate: 7, delay: 0.4 },
  { label: "Sahibkar", className: "right-[4%] top-[23%]", rotate: -6, delay: 1.1 },
  { label: "SMM menecer", className: "right-[-22px] top-[36%]", rotate: 5, delay: 1.8 },
  { label: "HR", className: "right-[3%] top-[49%]", rotate: -8, delay: 2.5 },
  { label: "Logist", className: "right-[6%] top-[87%]", rotate: 6, delay: 1.3 },
];

export function AiCreator() {
  const [openTab, setOpenTab] = useState<AiCreatorTab | null>(null);
  const hashTab = useHashTab();
  /** Hash ilə açılan modal bağlandıqdan sonra yenidən açılmasın. */
  const [hashUsed, setHashUsed] = useState(false);
  const [profession, setProfession] = useState("");
  const router = useRouter();

  const tab = openTab ?? (hashUsed ? null : hashTab);

  const close = useCallback(() => {
    setOpenTab(null);
    setHashUsed(true);
  }, []);

  return (
    <>
      <section
        id={aiCreator.id}
        aria-labelledby="aiCreatorTitle"
        className="relative isolate overflow-hidden rounded-[24px] bg-[#1d1b20] px-5 pt-16 pb-14 text-white md:rounded-[36px] md:px-10 md:pt-20 md:pb-16"
      >
        {/* Qradiyent: tünddən çəhrayıya */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-30 bg-[linear-gradient(180deg,#1d1b20_0%,#26192a_18%,#5a1a42_38%,#a3226b_60%,#c42878_80%,#b8226f_100%)]"
        />
        {/* Mərkəzdə parlaq işıq */}
        <div
          aria-hidden="true"
          className="absolute top-[64%] left-1/2 -z-20 h-[60%] w-[130%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(255,150,210,0.85),rgba(234,98,207,0.35)_45%,rgba(229,53,140,0)_75%)] motion-safe:animate-pulse"
        />
        {/* Aşağıda "sütunlar" — dizayndakı bar-chart kimi */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-20 flex h-[52%] items-end justify-center gap-3 px-[2%]"
        >
          {[44, 62, 80, 94, 80, 62, 44].map((h, i) => (
            <span
              key={i}
              style={{ height: `${h}%` }}
              className="flex-1 rounded-t-md border border-b-0 border-white/20 bg-linear-to-b from-white/18 to-white/2"
            />
          ))}
        </div>

        {/* Üzən peşə pilləri — yalnız geniş ekranda */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 hidden min-[901px]:block"
        >
          {FLOATING_ROLES.map((role) => (
            <div
              key={role.label}
              className={`absolute ${role.className}`}
              style={{ transform: `rotate(${role.rotate}deg)` }}
            >
              <span
                className="inline-block rounded-full border border-white/45 bg-linear-to-br from-white/26 to-white/8 px-6 py-3.5 text-[19px] font-bold whitespace-nowrap text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_16px_36px_-12px_rgba(40,0,20,0.55),0_0_30px_rgba(255,159,211,0.3)] backdrop-blur-md motion-safe:animate-[destech-bob_5s_cubic-bezier(.45,0,.55,1)_infinite]"
                style={{ animationDelay: `${role.delay}s` }}
              >
                {role.label}
              </span>
            </div>
          ))}
        </div>

        <div className="relative z-10 mx-auto flex max-w-[1280px] flex-col items-center text-center">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <StatusPill>
              {aiCreator.statusOpen}
            </StatusPill>
          </div>

          <h2
            id="aiCreatorTitle"
            className="mt-6 text-[clamp(30px,3.4vw,48px)] leading-[1.12] font-bold tracking-[-0.01em]"
          >
            AI Creator — tək nəfərlik{" "}
            <span className="font-accent text-[#ff9fd3] italic">
              böyük komanda
            </span>
          </h2>

          <button
            type="button"
            onClick={() => setOpenTab("program")}
            className="mt-6 inline-flex h-[60px] w-full max-w-[344px] items-center justify-center rounded-full border border-white bg-transparent text-[17px] font-extrabold text-white transition-colors duration-500 hover:bg-white/14 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Nələr öyrənəcəyinə bax
          </button>

          {/* "0-dan" — nəhəng tipoqrafiya */}
          <div
            aria-hidden="true"
            className="mt-2 flex items-center justify-center leading-[0.82] whitespace-nowrap"
          >
            <span
              className="relative z-[2] mr-[-0.2em] text-[clamp(150px,30vw,440px)] font-extrabold text-white/16 [-webkit-text-stroke:2px_rgba(255,235,246,0.8)] [text-shadow:0_0_60px_rgba(255,160,210,0.6),0_0_2px_rgba(255,255,255,0.7)]"
            >
              0
            </span>
            <span className="text-[clamp(90px,17vw,250px)] font-extrabold text-white [text-shadow:0_10px_60px_rgba(229,53,140,0.45)]">
              -dan
            </span>
          </div>
          <p className="mt-1 text-[clamp(20px,2.2vw,30px)] leading-[1.25] font-bold">
            <span className="sr-only">0-dan </span>
            öyrədirik — kod, dizayn və AI təcrübəsi lazım deyil
          </p>

          {/* Peşə input-u — göndərəndə /ai-plan?q=… səhifəsinə keçir */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = profession.trim();
              router.push(
                q ? `/ai-plan?q=${encodeURIComponent(q)}` : "/ai-plan",
              );
            }}
            className="mt-11 flex w-full max-w-[1120px] items-center gap-2.5 rounded-full border border-[rgba(255,211,232,0.35)] bg-[#0a0a0d] py-2.5 pr-2.5 pl-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_22px_60px_-16px_rgba(229,53,140,0.85)]"
          >
            <label htmlFor="aiCreatorProfession" className="sr-only">
              Hazırda nə işlə məşğulsan?
            </label>
            <input
              id="aiCreatorProfession"
              type="text"
              autoComplete="off"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              maxLength={200}
              placeholder="Hazırda nə işlə məşğulsan? Məsələn: mühasibəm, aylıq hesabat hazırlayıram"
              className="h-[58px] min-w-0 flex-1 bg-transparent text-[18px] font-medium text-white outline-none placeholder:text-[#a79ea2] md:text-[20px]"
            />
            <button
              type="submit"
              aria-label="Göndər"
              className="grid size-[58px] shrink-0 cursor-pointer place-items-center rounded-full bg-white text-[#b8226f] transition-colors duration-500 hover:bg-[#ffd3e8] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>

          <div className="mt-6">
            <PriceRow price={AI_CREATOR_PRICE_AZN} size="lg" tone="on-dark" />
          </div>
        </div>
      </section>

      <AiCreatorModal tab={tab} onClose={close} />
    </>
  );
}

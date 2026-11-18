"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { WORK_MAX_LENGTH, cleanWork, type AiPlan, type AiPlanResponse } from "@/lib/aiPlan";

/**
 * Peşə generatoru — çat interfeysi. Mənbə: handoff `design/generator-*.html`.
 * Hər sorğu bir cüt (istifadəçi mətni + cavab) kimi söhbətə əlavə olunur.
 */

const STEPS = [
  "Gündəlik təkrarlanan işləri tapır",
  "Claude ilə avtomatlaşdırma yollarını seçir",
  "Sənin üçün planı yazır",
];
/** Düşünmə mərhələsinin minimum müddəti (ms). */
const MIN_THINK_MS = 4500;
const STEP_MS = 1100;

type Turn =
  | { id: number; work: string; status: "thinking" }
  | { id: number; work: string; status: "done"; plan: AiPlan }
  | { id: number; work: string; status: "invalid" | "error"; message: string };

const INVALID_MESSAGE =
  "Bunu peşə kimi tanımadım. Başqa cür yaz, məsələn: mühasibəm, aylıq hesabat hazırlayıram.";
const RATE_MESSAGE = "Çox sorğu gəldi. Bir neçə saniyədən sonra yenidən yoxla.";
const ERROR_MESSAGE = "Hazırda cavab verə bilmirik. Bir az sonra yenidən yoxla.";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestPlan(work: string, signal: AbortSignal) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ work }),
    signal,
  });
  if (response.status === 429) throw new Error("rate_limited");
  if (!response.ok) throw new Error("http");
  return (await response.json()) as AiPlanResponse;
}

export function AiPlanChat({ initialQuery }: { initialQuery: string }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(0);
  const nextId = useRef(1);
  const controller = useRef<AbortController | null>(null);
  const started = useRef(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  async function send(raw: string) {
    const work = cleanWork(raw);
    if (!work || busy) return;

    const id = nextId.current++;
    const ac = new AbortController();
    controller.current = ac;
    setBusy(true);
    setStep(0);
    setDraft("");
    setTurns((prev) => [...prev, { id, work, status: "thinking" }]);

    const ticker = setInterval(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, STEP_MS);

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    try {
      const [answer] = await Promise.all([
        requestPlan(work, ac.signal),
        wait(reduce ? 300 : MIN_THINK_MS),
      ]);
      const next: Turn = answer.valid
        ? { id, work, status: "done", plan: answer }
        : { id, work, status: "invalid", message: INVALID_MESSAGE };
      setTurns((prev) => prev.map((t) => (t.id === id ? next : t)));
    } catch (error) {
      if (ac.signal.aborted) {
        setTurns((prev) => prev.filter((t) => t.id !== id));
      } else {
        const rate = error instanceof Error && error.message === "rate_limited";
        setTurns((prev) =>
          prev.map((t) =>
            t.id === id
              ? {
                  id,
                  work,
                  status: "error",
                  message: rate ? RATE_MESSAGE : ERROR_MESSAGE,
                }
              : t,
          ),
        );
      }
    } finally {
      clearInterval(ticker);
      controller.current = null;
      setBusy(false);
    }
  }

  // /ai-plan?q=… ilə gələndə sorğu avtomatik başlayır (yalnız bir dəfə).
  useEffect(() => {
    if (started.current || !initialQuery) return;
    started.current = true;
    void send(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns, busy]);

  const empty = turns.length === 0;

  return (
    <div className="flex min-h-dvh flex-col bg-[#0a0a0b] text-[#f5f3f4]">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[#2a2a2e] bg-[#0a0a0b]/90 px-5 py-4 backdrop-blur">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-[#f5f3f4] hover:bg-white/10"
        >
          ← Geri
        </Link>
        <span className="text-sm font-bold">AI Creator</span>
        <Link
          href="/#ai-creator"
          className="inline-flex min-h-11 items-center rounded-full bg-white/10 px-4 text-sm font-semibold hover:bg-white/15"
        >
          Ətraflı və qeydiyyat
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-[760px] flex-1 flex-col gap-8 px-5 pt-10 pb-6">
        {empty && (
          <section className="flex flex-col items-center gap-4 pt-12 text-center">
            <h1 className="text-[clamp(28px,4vw,40px)] leading-[1.15] font-bold tracking-[-0.02em]">
              Hazırda nə işlə məşğulsan?
            </h1>
            <p className="text-[#9a979e] m-0 max-w-[520px] text-base leading-[1.6]">
              Yaz, Claude sənin işinə uyğun hansı işləri avtomatlaşdırıb nə
              yarada biləcəyini göstərsin.
            </p>
          </section>
        )}

        {turns.map((turn) => (
          <div key={turn.id} className="flex flex-col gap-4">
            <div className="ml-auto max-w-[80%] rounded-[20px] bg-[#1c1c20] px-5 py-3 text-base leading-[1.5]">
              {turn.work}
            </div>

            {turn.status === "thinking" && (
              <div aria-busy="true" className="flex flex-col gap-3">
                <p className="text-[#9a979e] m-0 text-sm font-semibold">
                  Düşünür…
                </p>
                <ol className="m-0 flex list-none flex-col gap-2 p-0 text-sm">
                  {STEPS.map((label, i) => (
                    <li
                      key={label}
                      className={
                        i <= step ? "text-[#f5f3f4]" : "text-[#8d8a93]"
                      }
                    >
                      {i < step ? "✓ " : i === step ? "… " : "· "}
                      {label}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {turn.status === "invalid" || turn.status === "error" ? (
              <p
                role="status"
                className="text-[#ffd3e8] m-0 text-base leading-[1.6]"
              >
                {turn.message}
              </p>
            ) : null}

            {turn.status === "done" && (
              <PlanView plan={turn.plan} />
            )}
          </div>
        ))}
        <div ref={endRef} />
      </main>

      <form
        className="sticky bottom-0 border-t border-[#2a2a2e] bg-[#0a0a0b] px-5 py-4"
        onSubmit={(e) => {
          e.preventDefault();
          void send(draft);
        }}
      >
        <div className="mx-auto flex max-w-[760px] items-end gap-2 rounded-[24px] border border-[#2a2a2e] bg-[#141416] p-2 pl-5">
          <label htmlFor="aiPlanInput" className="sr-only">
            Peşəni yaz
          </label>
          <textarea
            id="aiPlanInput"
            rows={1}
            maxLength={WORK_MAX_LENGTH}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(draft);
              }
            }}
            placeholder={
              empty
                ? "Məsələn: mühasibəm, aylıq hesabat hazırlayıram"
                : "Başqa peşə yaz və ya sual ver…"
            }
            className="max-h-40 min-h-11 flex-1 resize-none bg-transparent py-2.5 text-base text-[#f5f3f4] outline-none placeholder:text-[#8d8a93]"
          />
          {busy ? (
            <button
              type="button"
              aria-label="Dayandır"
              onClick={() => controller.current?.abort()}
              className="grid size-11 shrink-0 place-items-center rounded-full bg-white/15 text-white"
            >
              <span aria-hidden="true" className="block size-3.5 bg-white" />
            </button>
          ) : (
            <button
              type="submit"
              aria-label="Göndər"
              disabled={!draft.trim()}
              className="grid size-11 shrink-0 place-items-center rounded-full bg-[#ff4f9f] text-white transition-colors disabled:bg-[#2a2a2e] disabled:text-[#8d8a93]"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-[#8d8a93] mx-auto mt-2 mb-0 max-w-[760px] text-xs">
          Claude ilə işləyir · Enter göndərir, Shift+Enter yeni sətir
        </p>
      </form>
    </div>
  );
}

function PlanView({ plan }: { plan: AiPlan }) {
  return (
    <article aria-live="polite" className="flex flex-col gap-6">
      {plan.title && (
        <h2 className="m-0 text-[clamp(24px,3vw,32px)] leading-[1.2] font-bold tracking-[-0.02em]">
          {plan.title} kimi Claude ilə bunları avtomatlaşdıra biləcəksən
        </h2>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {plan.automations.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            className="rounded-[20px] border border-[#2a2a2e] bg-[#141416] p-5"
          >
            <div className="text-xs font-bold text-[#ff9fd3]">
              {String(i + 1).padStart(2, "0")} · {item.module}
            </div>
            <strong className="mt-2 block text-base font-semibold">
              {item.name}
            </strong>
            <p className="text-[#9a979e] mt-1.5 mb-0 text-sm leading-[1.5]">
              {item.how}
            </p>
          </div>
        ))}
      </div>

      {plan.creates.length > 0 && (
        <div>
          <h3 className="mt-0 mb-3 text-base font-semibold">
            Yarada biləcəklərin
          </h3>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {plan.creates.map((item, i) => (
              <li
                key={`${item.t}-${i}`}
                className="flex items-center justify-between gap-3 border-t border-[#2a2a2e] py-3 text-[15px]"
              >
                <span>{item.t}</span>
                <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#ffd3e8]">
                  {item.module}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {plan.result && (
        <p className="m-0 rounded-[20px] bg-[#1c1c20] p-5 text-[15px] leading-[1.6]">
          <strong className="text-[#ff9fd3]">Nəticə: </strong>
          {plan.result}
        </p>
      )}

      <Link
        href="/#ai-creator"
        className="rounded-pill inline-flex h-12 w-fit items-center gap-2.5 bg-[#ff4f9f] px-6 text-base font-bold text-white hover:bg-[#b8226f]"
      >
        Bunları 0-dan öyrən — ətraflı
      </Link>
    </article>
  );
}

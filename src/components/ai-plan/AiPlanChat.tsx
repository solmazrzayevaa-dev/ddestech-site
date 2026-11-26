"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { WORK_MAX_LENGTH, cleanWork, type AiPlan, type AiPlanResponse } from "@/lib/aiPlan";

/**
 * Peşə generatoru — dizayn: AI Creator banneri ilə eyni palitra, qaranlıq
 * fon, parlayan kürə, şəffaf input. Hər sorğu söhbətə bir cüt kimi əlavə olunur.
 */

const STEPS = [
  "Peşəni başa düşür",
  "Təkrarlanan işləri tapır",
  "Avtomatlaşdırma yollarını seçir",
  "Planı yazır",
];
/** Düşünmə mərhələsinin minimum müddəti (ms). */
const MIN_THINK_MS = 4500;
const STEP_MS = 1100;

type Team = "tek" | "komanda";

type Turn =
  | { id: number; work: string; status: "thinking" }
  | { id: number; work: string; team?: Team; status: "done"; plan: AiPlan }
  | { id: number; work: string; status: "invalid" | "error"; message: string };

const INVALID_MESSAGE =
  "Bunu peşə kimi tanımadım. Başqa cür yaz, məsələn: mühasibəm, aylıq hesabat hazırlayıram.";
const RATE_MESSAGE = "Çox sorğu gəldi. Bir neçə saniyədən sonra yenidən yoxla.";
const ERROR_MESSAGE = "Bir az gözlə və yenidən yoxla.";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestPlan(work: string, team: Team | undefined, signal: AbortSignal) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ work, team }),
    signal,
  });
  if (response.status === 429) throw new Error("rate_limited");
  if (response.status === 503) throw new Error("retry");
  if (!response.ok) throw new Error("http");
  return (await response.json()) as AiPlanResponse;
}

export function AiPlanChat() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(0);
  const nextId = useRef(1);
  const controller = useRef<AbortController | null>(null);
  const started = useRef(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  async function send(raw: string, team?: Team) {
    const work = cleanWork(raw);
    if (!work || busy) return;

    const id = nextId.current++;
    const ac = new AbortController();
    controller.current = ac;
    setBusy(true);
    setStep(0);
    setDraft("");
    setTurns((prev) => [...prev, { id, work, team, status: "thinking" }]);

    const ticker = setInterval(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, STEP_MS);

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    try {
      // Müvəqqəti xəta olanda bir dəfə avtomatik yenidən cəhd.
      const attempt = async () => {
        try {
          return await requestPlan(work, team, ac.signal);
        } catch (error) {
          if (error instanceof Error && error.message === "retry" && !ac.signal.aborted) {
            await wait(800);
            return requestPlan(work, team, ac.signal);
          }
          throw error;
        }
      };
      const [answer] = await Promise.all([
        attempt(),
        wait(reduce ? 300 : MIN_THINK_MS),
      ]);
      const next: Turn = answer.valid
        ? { id, work, team, status: "done", plan: answer }
        : { id, work, status: "invalid", message: INVALID_MESSAGE };
      setTurns((prev) => prev.map((t) => (t.id === id ? next : t)));
    } catch (error) {
      if (ac.signal.aborted) {
        setTurns((prev) => prev.filter((t) => t.id !== id));
      } else {
        const rate = error instanceof Error && error.message === "rate_limited";
        // "Peşə kimi tanımadım" yalnız valid:false üçün çıxır; qalan hər xəta üçün ERROR_MESSAGE.
        setTurns((prev) =>
          prev.map((t) =>
            t.id === id
              ? { id, work, status: "error", message: rate ? RATE_MESSAGE : ERROR_MESSAGE }
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
  // Query brauzerdən oxunur ki, səhifə statik qala bilsin.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const initial = cleanWork(new URLSearchParams(window.location.search).get("q"));
    // Bir dəfəlik xarici sinxronizasiya (URL → sorğu); render zamanı deyil.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initial) void send(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns, busy]);

  const empty = turns.length === 0;
  const lastDone = [...turns].reverse().find((t) => t.status === "done");

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-[#0c0a10] text-white">
      {/* Yuxarıdan aşağı qradiyent — banner palitrası */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#0c0a10_0%,#2a1528_45%,#7a1e4f_80%,#b8226f_100%)] opacity-90"
      />

      <header className="relative z-10 flex items-center justify-between gap-3 px-5 py-4">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold hover:bg-white/10"
        >
          ← Geri
        </Link>
        <span className="font-accent text-base italic text-[#ff9fd3]">AI Creator</span>
        <Link
          href="/#ai-creator"
          className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-4 text-sm font-semibold hover:bg-white/10"
        >
          Ətraflı və qeydiyyat
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-[760px] flex-1 flex-col gap-8 px-5 pb-6">
        {empty && (
          <section className="flex flex-col items-center gap-6 pt-8 text-center">
            <div
              aria-hidden="true"
              className="relative size-[180px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#ffd3e8_0%,#ff6fb5_30%,#b8226f_60%,#3a0f2a_100%)] shadow-[0_0_80px_rgba(255,111,181,0.55)] motion-safe:animate-pulse"
            />
            <p className="m-0 text-base text-white/70">Salam</p>
            <h1 className="m-0 text-[clamp(30px,4.5vw,46px)] leading-[1.1] font-bold tracking-[-0.02em]">
              Hazırda nə işlə{" "}
              <span className="font-accent italic text-[#ff9fd3]">məşğulsan?</span>
            </h1>
            <p className="m-0 max-w-[520px] text-base leading-[1.6] text-white/75">
              Peşəni və ya gündəlik işini yaz. Claude kursdan sonra nələri avtomatlaşdıra və yarada biləcəyini göstərsin.
            </p>
          </section>
        )}

        {turns.map((turn) => (
          <div key={turn.id} className="flex flex-col gap-4">
            <div className="ml-auto max-w-[80%] rounded-[22px] border border-white/15 bg-white/10 px-5 py-3 text-base leading-[1.5] backdrop-blur-md">
              {turn.work}
            </div>

            {turn.status === "thinking" && (
              <div aria-busy="true" className="flex flex-col gap-3">
                <p className="m-0 text-sm font-semibold text-white/80">Düşünür…</p>
                <ol className="m-0 flex list-none flex-col gap-2 p-0 text-sm">
                  {STEPS.map((label, i) => (
                    <li key={label} className={i <= step ? "text-white" : "text-white/40"}>
                      {i < step ? "✓ " : i === step ? "… " : "· "}
                      {label}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {(turn.status === "invalid" || turn.status === "error") && (
              <p role="status" className="m-0 text-base leading-[1.6] text-[#ffd3e8]">
                {turn.message}
              </p>
            )}

            {turn.status === "done" && <PlanView plan={turn.plan} />}
          </div>
        ))}

        {lastDone && !busy && (
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-sm text-white/70">Sən necə işləyirsən?</span>
            {(
              [
                { key: "tek", label: "Tək işləyirəm" },
                { key: "komanda", label: "Komandam var" },
              ] as const
            ).map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => void send(lastDone.work, option.key)}
                className="min-h-11 rounded-full border border-white/25 bg-white/10 px-4 text-sm font-semibold hover:bg-white/20"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
        <div ref={endRef} />
      </main>

      <form
        className="relative z-10 px-5 pb-6"
        onSubmit={(e) => {
          e.preventDefault();
          void send(draft);
        }}
      >
        <div className="mx-auto flex max-w-[760px] items-center gap-2 rounded-full border border-white/25 bg-white/10 py-2 pr-2 pl-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <label htmlFor="aiPlanInput" className="sr-only">
            Peşəni yaz
          </label>
          <input
            id="aiPlanInput"
            type="text"
            maxLength={WORK_MAX_LENGTH}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={empty ? "Peşəni və ya işini yaz" : "Başqa peşə yaz və ya sual ver…"}
            className="h-12 min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/55"
          />
          {busy ? (
            <button
              type="button"
              aria-label="Dayandır"
              onClick={() => controller.current?.abort()}
              className="grid size-12 shrink-0 place-items-center rounded-full bg-white/20 text-white"
            >
              <span aria-hidden="true" className="block size-3.5 bg-white" />
            </button>
          ) : (
            <button
              type="submit"
              aria-label="Göndər"
              disabled={!draft.trim()}
              className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-[#b8226f] transition-opacity disabled:opacity-40"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          )}
        </div>
        <p className="m-0 mx-auto mt-2 max-w-[760px] text-center text-xs text-white/55">
          Claude ilə işləyir
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
          <span className="font-accent italic text-[#ff9fd3]">{plan.title}</span> kimi Claude ilə bunları avtomatlaşdıra biləcəksən
        </h2>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {plan.automations.map((item, i) => (
          <div key={`${item.name}-${i}`} className="rounded-[22px] border border-white/15 bg-white/10 p-5 backdrop-blur-md">
            <div className="text-xs font-bold text-[#ff9fd3]">
              {String(i + 1).padStart(2, "0")} · {item.module}
            </div>
            <strong className="mt-2 block text-base font-semibold">{item.name}</strong>
            <p className="mt-1.5 mb-0 text-sm leading-[1.5] text-white/75">{item.how}</p>
          </div>
        ))}
      </div>

      {plan.creates.length > 0 && (
        <div>
          <h3 className="mt-0 mb-3 text-base font-semibold">Yarada biləcəklərin</h3>
          <ul className="m-0 flex list-none flex-col p-0">
            {plan.creates.map((item, i) => (
              <li key={`${item.t}-${i}`} className="flex items-center justify-between gap-3 border-t border-white/15 py-3 text-[15px]">
                <span>{item.t}</span>
                <span className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-[#ffd3e8]">
                  {item.module}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {plan.result && (
        <p className="m-0 rounded-[22px] border border-white/15 bg-black/25 p-5 text-[15px] leading-[1.6]">
          <strong>Nəticə: </strong>
          {plan.result}
        </p>
      )}

      <Link
        href="/#ai-creator"
        className="inline-flex h-12 w-fit items-center gap-2.5 rounded-full bg-white px-6 text-base font-bold text-[#b8226f] hover:bg-[#ffd3e8]"
      >
        Bunları 0-dan öyrən — ətraflı
      </Link>
    </article>
  );
}

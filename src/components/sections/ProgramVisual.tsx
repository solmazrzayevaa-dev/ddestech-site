import type { ProgramId } from "@/content/site";

/**
 * Proqram kartının aşağı yarısındakı vizual plitə — saf dekorasiya.
 * Referans: design/landing-reference.html → hər `article` içindəki `.tile`.
 * 3D kürələr, şüşə panellər və qradiyentlər birbaşa CSS-dir (şəkil yoxdur).
 *
 * Bütün elementlər `aria-hidden` — ekran oxuyucusu üçün məna daşımır.
 */

/** Qrafik dizayn — pink kürə, sarı halqa, tipoqrafiya şüşə kartı. */
function GraphicVisual() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute top-6 -left-5 size-[150px] rounded-pill bg-[radial-gradient(circle_at_32%_28%,#ffffff_0%,#ff8cc4_18%,#e5358c_48%,#9a1a5c_100%)] shadow-[0_28px_40px_-14px_rgba(154,26,92,0.55)]"
      />
      <div
        aria-hidden="true"
        className="absolute top-[58px] right-[18px] size-28 rounded-pill border-[22px] border-yellow shadow-[inset_-6px_-8px_12px_rgba(120,110,0,0.35),inset_6px_6px_10px_rgba(255,255,255,0.8),0_18px_28px_-10px_rgba(120,110,0,0.45)] [transform:rotate(-18deg)_scaleY(0.82)]"
      />
      <div
        aria-hidden="true"
        className="glass absolute top-[46%] left-1/2 flex w-[200px] -translate-x-1/2 -translate-y-1/2 rotate-[-6deg] flex-col gap-2.5 rounded-[20px] bg-white/38 p-4"
      >
        <div className="flex items-end justify-between">
          <span className="text-ink text-[64px] leading-[0.8] font-semibold tracking-[-0.06em]">
            Aa
          </span>
          <span className="text-ink text-[11px] font-bold">Jakarta 600</span>
        </div>
        <div className="h-px bg-ink/25" />
        <div className="flex gap-1.5">
          {["bg-pink", "bg-yellow", "bg-cobalt", "bg-ink"].map((c) => (
            <span key={c} className={`size-[26px] rounded-[8px] ${c}`} />
          ))}
        </div>
      </div>
    </>
  );
}

/** Motion dizayn — kobalt kürələr, kəsik trayektoriya, timeline şüşəsi. */
function MotionVisual() {
  return (
    <>
      <svg
        aria-hidden="true"
        viewBox="0 0 300 300"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
      >
        <path
          d="M20 210 C 90 60, 170 60, 280 120"
          fill="none"
          stroke="#151228"
          strokeWidth="2"
          strokeDasharray="4 8"
          opacity="0.45"
        />
      </svg>
      {[
        "left-[14%] top-[46%] size-[38px] opacity-25 blur-[1px]",
        "left-[30%] top-[24%] size-[54px] opacity-50",
        "left-[56%] top-[14%] size-[92px] shadow-[0_24px_34px_-12px_rgba(22,49,166,0.6)]",
      ].map((pos) => (
        <div
          key={pos}
          aria-hidden="true"
          className={`absolute rounded-pill bg-[radial-gradient(circle_at_32%_28%,#ffffff_0%,#7d94ff_21%,#2448e0_57%,#1631a6_100%)] ${pos}`}
        />
      ))}
      <div
        aria-hidden="true"
        className="glass absolute right-4 bottom-16 left-4 flex flex-col gap-2 rounded-[16px] bg-white/42 px-3.5 py-3"
      >
        <div className="flex items-center gap-2.5">
          <span className="bg-ink rounded-pill inline-flex size-[22px] items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 24 24">
              <path d="M7 4l13 8-13 8z" fill="#efea4d" />
            </svg>
          </span>
          <span className="text-ink text-[11px] font-bold">00:02:14</span>
          <span className="relative h-0.5 flex-1 bg-ink/20">
            <span className="bg-ink absolute top-0 left-0 h-0.5 w-[58%]" />
          </span>
        </div>
        <div className="relative h-3">
          <span className="absolute top-[5px] right-0 left-0 h-0.5 bg-ink/15" />
          {[
            ["left-[8%]", "bg-ink"],
            ["left-[34%]", "bg-cobalt"],
            ["left-[58%]", "bg-pink"],
            ["left-[86%]", "bg-ink"],
          ].map(([pos, color]) => (
            <span
              key={pos}
              className={`absolute top-px size-2.5 rotate-45 ${pos} ${color}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}

/** UX/UI dizayn — lime kürə, pink kafel, mobil ekran şüşəsi, kursor. */
function UxUiVisual() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute top-[30px] -right-3.5 size-24 rounded-pill bg-[radial-gradient(circle_at_32%_28%,#ffffff_0%,#eef59a_18%,#d6e04a_50%,#8a9418_100%)] shadow-[0_22px_32px_-12px_rgba(0,0,0,0.45)]"
      />
      <div
        aria-hidden="true"
        className="absolute top-[52px] left-[18px] size-16 rotate-[-14deg] rounded-mosaic bg-[linear-gradient(145deg,#ff8cc4_0%,#e5358c_45%,#9a1a5c_100%)] shadow-[inset_4px_4px_8px_rgba(255,255,255,0.45),0_20px_28px_-10px_rgba(0,0,0,0.45)]"
      />
      <div
        aria-hidden="true"
        className="glass absolute top-[44%] left-1/2 flex h-[196px] w-[150px] -translate-x-1/2 -translate-y-1/2 rotate-[4deg] flex-col gap-2 rounded-xl-m border-white/50 bg-white/22 p-3"
      >
        <div className="flex items-center justify-between">
          <span className="rounded-pill size-[22px] bg-white/85" />
          <span className="h-1.5 w-10 rounded-[4px] bg-white/70" />
        </div>
        <span className="h-[54px] rounded-sm bg-white/55" />
        <span className="h-[7px] w-4/5 rounded-[4px] bg-white/85" />
        <span className="h-[7px] w-[56%] rounded-[4px] bg-white/55" />
        <span className="bg-lime text-ink mt-auto flex h-7 items-center justify-center rounded-pill text-[10px] font-bold">
          Davam et
        </span>
      </div>
      <svg
        aria-hidden="true"
        width="34"
        height="34"
        viewBox="0 0 24 24"
        className="absolute top-[62%] left-[62%] drop-shadow-[0_6px_8px_rgba(0,0,0,0.35)]"
      >
        <path
          d="M5 3l14 7-6 2-2 6z"
          fill="#ffffff"
          stroke="#151228"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
}

/** Plitənin qradiyent fonu — referansdakı `.tile` background-ları. */
export const tileBackground: Record<ProgramId, string> = {
  qrafik:
    "bg-[radial-gradient(120%_90%_at_20%_10%,#fff2f8_0%,#fbd3e8_55%,#f5b3d4_100%)]",
  motion:
    "bg-[radial-gradient(120%_90%_at_80%_0%,#fffde0_0%,#f6f1a6_55%,#e6dd5c_100%)]",
  uxui: "bg-[radial-gradient(120%_90%_at_20%_0%,#6d70c9_0%,#44479a_50%,#2a2c6b_100%)]",
};

export function ProgramVisual({ id }: { id: ProgramId }) {
  if (id === "qrafik") return <GraphicVisual />;
  if (id === "motion") return <MotionVisual />;
  return <UxUiVisual />;
}

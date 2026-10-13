import type { ColorToken } from "@/content/site";

/**
 * Rəng tokenindən Tailwind sinifinə xəritə.
 * Tailwind sinif adlarını şablonla qurmaq olmur (`bg-${token}` build-də tapılmır),
 * ona görə bütün variantlar burada açıq yazılır.
 */

export const bgClass: Record<ColorToken, string> = {
  pink: "bg-pink",
  yellow: "bg-yellow",
  indigo: "bg-indigo",
  cobalt: "bg-cobalt",
  lime: "bg-lime",
  ink: "bg-ink",
  paper: "bg-paper",
};

export const textClass: Record<ColorToken, string> = {
  pink: "text-pink",
  yellow: "text-yellow",
  indigo: "text-indigo",
  cobalt: "text-cobalt",
  lime: "text-lime",
  ink: "text-ink",
  paper: "text-paper",
};

/** Drawer başlığındakı 3D kürənin qradiyenti — referansdakı `p.orb`. */
export const orbGradient: Record<string, string> = {
  yellow:
    "bg-[radial-gradient(circle_at_32%_28%,#ffffff_0%,#fff27a_22%,#efea4d_55%,#b9b220_100%)]",
  cobalt:
    "bg-[radial-gradient(circle_at_32%_28%,#ffffff_0%,#7d94ff_20%,#2448e0_55%,#1631a6_100%)]",
  lime: "bg-[radial-gradient(circle_at_32%_28%,#ffffff_0%,#eef59a_18%,#d6e04a_50%,#8a9418_100%)]",
};

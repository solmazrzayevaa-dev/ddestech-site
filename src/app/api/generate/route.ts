import { NextResponse } from "next/server";
import { cleanWork } from "@/lib/aiPlan";
import { matchPlan } from "@/lib/aiPlanData";

/**
 * POST /api/generate  { "work": "Mühasibəm, aylıq hesabat hazırlayıram" }
 *
 * Xarici API çağırılmır — cavab `aiPlanData.ts`-dəki bazadan gəlir,
 * buna görə xərc və açar tələb olunmur.
 */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;
const hits = new Map<string, number[]>();

function limited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  if (limited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const work = cleanWork((body as { work?: unknown } | null)?.work);
  if (!work) return NextResponse.json({ valid: false }, { status: 400 });

  return NextResponse.json(matchPlan(work));
}

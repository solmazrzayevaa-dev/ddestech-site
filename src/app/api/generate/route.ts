import { NextResponse } from "next/server";
import { buildPrompt, cleanWork, normalizePlan } from "@/lib/aiPlan";

/**
 * POST /api/generate  { "work": "Mühasibəm, aylıq hesabatlar hazırlayıram" }
 *
 * `ANTHROPIC_API_KEY` yalnız serverdə oxunur — brauzerə heç vaxt çatmır.
 * Cavab həmişə `normalizePlan`-dan keçir.
 */

const MODEL = "claude-haiku-5-5";

/**
 * Sadə in-memory limit (IP başına dəqiqədə 8). Serverless instansiyalar
 * arasında paylaşılmır — real trafik üçün Upstash/Vercel KV ilə əvəz olunmalıdır.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;
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

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1200,
        messages: [{ role: "user", content: buildPrompt(work) }],
      }),
    });
    if (!upstream.ok) {
      return NextResponse.json({ error: "upstream" }, { status: 502 });
    }

    const data = (await upstream.json()) as {
      content?: Array<{ type?: string; text?: string }>;
    };
    const text = (data.content ?? []).map((c) => c.text ?? "").join("");
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) {
      return NextResponse.json({ valid: false });
    }
    const parsed: unknown = JSON.parse(text.slice(start, end + 1));
    return NextResponse.json(normalizePlan(parsed));
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

import type { Metadata } from "next";
import { AiPlanChat } from "@/components/ai-plan/AiPlanChat";
import { cleanWork } from "@/lib/aiPlan";

export const metadata: Metadata = {
  title: "Peşən üçün AI planı — AI Creator",
  description:
    "Hazırda nə işlə məşğul olduğunu yaz — Claude ilə hansı işləri avtomatlaşdıra biləcəyini gör.",
  alternates: { canonical: "/ai-plan" },
};

export default async function AiPlanPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const initialQuery = cleanWork(Array.isArray(q) ? q[0] : q);
  return <AiPlanChat initialQuery={initialQuery} />;
}

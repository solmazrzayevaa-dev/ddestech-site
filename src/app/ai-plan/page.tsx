import type { Metadata } from "next";
import { AiPlanChat } from "@/components/ai-plan/AiPlanChat";

export const metadata: Metadata = {
  title: "Peşən üçün AI planı — AI Creator",
  description:
    "Hazırda nə işlə məşğul olduğunu yaz — Claude ilə hansı işləri avtomatlaşdıra biləcəyini gör.",
  alternates: { canonical: "/ai-plan" },
};

export default function AiPlanPage() {
  return <AiPlanChat />;
}

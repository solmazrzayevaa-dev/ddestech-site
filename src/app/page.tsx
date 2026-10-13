import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { About } from "@/components/sections/About";
import { Apply } from "@/components/sections/Apply";
import { Community } from "@/components/sections/Community";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Programs } from "@/components/sections/Programs";
import { Statement } from "@/components/sections/Statement";
import { Teachers } from "@/components/sections/Teachers";
import { Testimonials } from "@/components/sections/Testimonials";
import { Works } from "@/components/sections/Works";

/**
 * Tək səhifə (MVP1) — bütün bölmələr.
 * Çərçivəli kanvas: panellər ekran kənarından 12px (mobil 8px), arada da 12px.
 */
export default function Home() {
  return (
    <div className="p-web-frame-m sm:p-web-frame gap-web-frame flex min-h-screen flex-col">
      {/* Klaviatura ilə naviqasiya: Tab-a basanda ilk fokuslanan element */}
      <a
        href="#main"
        className="bg-ink text-paper rounded-pill sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:px-5 focus-visible:py-3 focus-visible:text-sm focus-visible:font-semibold"
      >
        Əsas məzmuna keç
      </a>

      <Header />

      <main id="main" className="gap-web-frame flex flex-col">
        <Hero />
        <Statement />
        <Programs />
        <About />
        <Works />
        <Teachers />
        <Testimonials />
        <Community />
        <Faq />
        <Apply />
      </main>

      <Footer />
    </div>
  );
}

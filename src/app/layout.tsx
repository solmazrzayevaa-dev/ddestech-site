import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Unbounded } from "next/font/google";
import { Analytics } from "@/components/layout/Analytics";
import { contact, hero, site } from "@/content/site";
import { siteUrl } from "@/lib/env";
import "./globals.css";

/* Əsas şrift — başlıq və mətn (variable 200–800) */
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

/* Yalnız rəqəm, tarix və footer wordmark-ı üçün */
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "az_AZ",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: [
      {
        url: hero.image,
        // hero-banner.jpg-nin real ölçüsü (2304×1536, 3:2).
        // Sosial platformalar özü kəsir — yanlış ölçü verilsə kadr pozulur.
        width: 2304,
        height: 1536,
        alt: hero.imageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [hero.image],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f2ee",
};

/**
 * schema.org — axtarış sistemləri üçün struktur məlumat.
 * Yalnız təsdiqlənmiş faktlar: ad, ünvan, telefon, sosial profillər.
 * Uydurma reytinq və ya məzun sayı YOXDUR (web-guidelines.md → Etmə).
 */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: `${site.name} Academy`,
  alternateName: site.name,
  url: siteUrl,
  description: site.description,
  image: `${siteUrl}${hero.image}`,
  telephone: "+994555903695",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Cəfərov Qardaşları 16",
    addressLocality: "Bakı",
    addressCountry: "AZ",
  },
  sameAs: [contact.instagram],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={site.locale}
      className={`${plusJakarta.variable} ${unbounded.variable} h-full`}
    >
      {/* suppressHydrationWarning: brauzer genişlənmələri (parol menecerləri və s.)
          <body>-yə öz atributlarını əlavə edir və React bunu uyğunsuzluq sayır.
          Yalnız bu elementin atributlarına aiddir — məzmun yoxlanışı qalır. */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        {children}
        <script
          type="application/ld+json"
          // Məzmun statikdir və site.ts-dən gəlir — istifadəçi girişi yoxdur.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}

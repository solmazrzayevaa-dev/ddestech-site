# DesTech — landing (MVP1)

DesTech Academy (Bakı) üçün tək səhifəlik marketing saytı. Məqsəd: proqramları göstərmək və müraciət toplamaq.

## Əhatə (MVP1)
- YALNIZ bir səhifə: `/`. Başqa route, blog, proqram səhifəsi YOXDUR (2-ci faza).
- Bölmələr (ardıcıllıqla, anchor-larla): Hero `#top` → Bəyanat + loqolar → AI Creator banneri `#ai-creator` → Proqramlar `#proqramlar` → Necə oxuyursan `#haqqimizda` → Tələbə işləri `#isler` → Müəllimlər `#muellimler` → Rəylər `#reyler` → Community `#community` → FAQ `#faq` → Müraciət `#muraciet` → Footer.
- Proqram kartında "Ətraflı" → eyni səhifədə sağdan açılan panel (drawer). URL dəyişmir.
- AI Creator banner-ində "Ətraflı və qeydiyyat" → eyni səhifədə modal (native `<dialog>`, iki tab: proqram + qeydiyyat). URL dəyişmir, amma `#ai-creator` və `#ai-creator-qeydiyyat` hash-ləri ilə birbaşa açıla bilir.

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- Statik səhifə; məzmun `src/content/site.ts` faylındadır (CMS yoxdur)
- Müraciət formu → Server Action → Supabase `website_leads` cədvəli (həm sayt, həm platform layihəsinə yazılır)
- AI Creator qeydiyyatı → brauzerdən birbaşa Supabase `ai_creator_registrations` cədvəlinə (anon açar + RLS, yalnız `insert`)
- Deploy: Vercel

## Dizayn mənbəyi
- `design/landing-reference.html` — təsdiqlənmiş dizayn. Vizual referansdır: struktur, ölçülər, rənglər, effektlər buradan götürülür. Kodu birbaşa kopyalama — React komponentlərinə çevir.
- `design/tokens.json` — DesTech dizayn sistemi tokenləri. Tailwind theme-ə bunlardan köçür (`web-*`, `glass-*`, `shadow-*`, `radius-*`). Sosial media tokenlərini (`post-*`, `format-*`, 26–128px ölçülər) vebdə İSTİFADƏ ETMƏ.
- `design/web-guidelines.md` — veb qaydaları (glass, kölgə, tipoqrafiya, grid, etmə siyahısı).

## Dizayn qaydaları (qısa)
- Fon `#f4f2ee`, alternativ `#ebe8e1`, mətn `#151228`, köməkçi `#5a566e`, iki tonlu başlığın sakit hissəsi `#8a8698` (yalnız 36px+).
- Əsas CTA: `#e5358c` (bright pink), ağ mətn 16px bold. Lime `#d6e04a` üzərində yalnız tünd mətn.
- Şriftlər: Plus Jakarta Sans (400–800, başlıqlar 600, sıx hərf aralığı), Unbounded (yalnız rəqəm, tarix, wordmark). `next/font/google` ilə yüklə.
- Çərçivəli kanvas: panellər ekran kənarından 12px, radius 36px (mobil 24px).
- Glass yalnız foto və ya rəngli blok üzərində: `bg-white/60 backdrop-blur-xl` + 1px ağ kontur + daxili işıq kölgəsi. `backdrop-filter` olmayanda solid fallback.
- Nav: üzən glass pill, sticky, hero üzərində. Desktop-da link qrupu; ≤900px-də linklər gizlənir və hamburger görünür → tam ekran menyu (anchor linklər).
- Bütün mətnlər Azərbaycan dilində. ə, ı, ş, ç, ğ, ö, ü, İ həmişə düzgün. `<html lang="az">`.

## Kod qaydaları
- Hər bölmə ayrıca komponent: `src/components/sections/*`. Ortaq UI: `src/components/ui/*` (Button, Pill, GlassCard, CircleButton, SectionLabel).
- Məzmunu komponentə yazma — `src/content/site.ts`-dən oxu (proqramlar, müəllimlər, rəylər, FAQ, loqolar, əlaqə).
- Şəkillər `public/images/`, `next/image` ilə.
- Mobile-first. 375px, 768px, 1024px, 1440px-də yoxla.
- Əlçatanlıq: real `<button>` və `<a>`, fokus halqası görünür, şəkillərin alt mətni, drawer üçün fokus tələsi və Esc ilə bağlanma, `prefers-reduced-motion`.
- Yeni paket əlavə etməzdən əvvəl soruş.

## Əlaqə məlumatları
- Ünvan: Cəfərov Qardaşları 16, Bakı
- Telefon: 055 590 36 95 (`tel:+994555903695`)
- WhatsApp: https://wa.me/994555903695
- Instagram: https://instagram.com/destechcom
- WhatsApp community: [LINK GƏLƏCƏK]

## Açıq qalanlar
- Tələbə işləri şəkilləri (gələcək) — hələlik plitələr placeholder.
- Rəylər nümunədir ("Nümunə mətn" nişanı) — launch-dan əvvəl real rəylərlə əvəz olunmalıdır.
- Şirkət loqoları (SVG) — hələlik mətn.
- Motion və UX/UI növbəti qrup tarixləri.

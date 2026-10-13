# Claude Code üçün addım-addım prompt-lar

Hər addımı ayrıca sessiyada (və ya ardıcıl) ver. Hər addımdan sonra brauzerdə yoxla və commit et.
Plan mode ilə başla (Shift+Tab): Claude əvvəl planı göstərsin, sən təsdiqlə.

---

## 0. Hazırlıq (özün)
1. Kompüterdə boş qovluq yarat: `destech-site`
2. Bu paketin içindəkiləri ora köçür (`CLAUDE.md`, `design/`, `public/`, `PROMPTS.md`)
3. Terminalda həmin qovluqda `claude` əmri ilə Claude Code-u aç

---

## 1. Layihəni qur
```
CLAUDE.md faylını oxu. Bu qovluqda Next.js (App Router, TypeScript, Tailwind, src/ qovluğu) layihəsi qur — mövcud design/ və public/ qovluqlarına toxunma.
design/tokens.json-dakı web-*, glass-*, shadow-*, radius-* tokenlərini Tailwind theme-ə köçür.
Plus Jakarta Sans və Unbounded şriftlərini next/font ilə qoş. <html lang="az">.
Hələ heç bir bölmə qurma. Sonda `npm run dev` işləsin. Əvvəl plan göstər.
```

## 2. Məzmun faylı
```
design/landing-reference.html faylından bütün məzmunu çıxar və src/content/site.ts faylına tipli data kimi yaz:
proqramlar (detal paneli məlumatları daxil: who, outcomes, modules, tools, final, next), müəllimlər, rəylər, FAQ, loqolar, tədbir, əlaqə.
Mətnləri dəyişmə, Azərbaycan hərflərini qoru.
```

## 3. UI komponentləri
```
design/landing-reference.html və design/web-guidelines.md əsasında src/components/ui/ altında bunları qur:
Button (primary pink, dark, glass, outline; ox dairəsi hover-də fırlanır), Pill, GlassCard, CircleButton, SectionLabel ("(01) Ad" formatı), Panel (çərçivəli bölmə).
Bir /dev-ui test səhifəsində hamısını göstər (sonra siləcəyik).
```

## 4. Nav + Hero
```
Header (üzən glass pill nav, sticky, mobil hamburger + tam ekran menyu) və Hero bölməsini qur.
Hero: /images/hero-banner.jpg tam enli, aşağıda tünd keçid, başlıq, iki düymə, sağda glass "Növbəti qrup" kartı.
Referans: design/landing-reference.html. 375px və 1440px-də dizayna uyğun olsun.
```

## 5. Proqramlar + detal paneli
```
Proqramlar bölməsini qur: 3 kart, hər birində 3D + glass vizual (referansdakı CSS formaları).
"Ətraflı" düyməsi sağdan drawer açır: məzmun site.ts-dən. Esc və arxa fon kliki ilə bağlanır, fokus panel içində qalır, açıq olanda səhifə scroll olmur.
Paneldəki "Bu proqrama müraciət et" paneli bağlayıb #muraciet-ə scroll edir və formda proqramı avtomatik seçir.
```

## 6. Qalan bölmələr
```
Referansa görə qur: Bəyanat + loqolar, Necə oxuyursan (bento), Tələbə işləri (mozaika — hələlik placeholder plitələr), Müəllimlər, Rəylər (oxlarla dəyişən), Community, FAQ (accordion), Footer.
Hər bölmə ayrıca komponent. Sonda bütün səhifəni 375 / 768 / 1440 px-də yoxla.
```

## 7. Müraciət formu
```
Müraciət formunu işlək et:
- Sahələr: ad (məcburi), telefon (məcburi, +994 formatı yoxlanışı), email (istəyə bağlı), proqram (select), mesaj.
- Server Action ilə Supabase-də website_leads cədvəlinə yaz (id, created_at, name, phone, email, program, message, utm_source, utm_medium, utm_campaign). SQL migration faylını da yaz.
- Uğurlu göndərişdən sonra Telegram bota bildiriş (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID env-dən).
- Spam üçün honeypot sahə. Xəta və uğur halları formda göstərilsin.
- .env.example faylı yarat.
```

## 8. SEO + analitika
```
Metadata (title, description, OG şəkil — hero-banner-dən), favicon, robots.txt, sitemap.xml, schema.org EducationalOrganization.
GA4 və Meta Pixel (ID-lər env-dən); müraciət uğurlu olanda "Lead" hadisəsi göndər.
Lighthouse-da Performance və Accessibility ≥ 90 olsun.
```

## 9. Deploy
```
Vercel-ə deploy üçün hazırla: env dəyişənlərinin siyahısı, build xətası olmasın. README-yə deploy addımlarını yaz.
```

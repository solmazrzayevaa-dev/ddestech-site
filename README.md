# DesTech — landing (MVP1)

DesTech Academy (Bakı) üçün tək səhifəlik marketing saytı. Məqsəd: proqramları
göstərmək və müraciət toplamaq.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Vercel
**Baza:** Supabase (`website_leads`)

---

## Lokal işə salmaq

```bash
npm install
cp .env.example .env.local   # dəyərləri doldur (aşağıya bax)
npm run dev                  # http://localhost:3000
```

Env dəyişənləri olmadan da sayt işləyir — yalnız müraciət formu göndərilə bilmir.

### Əmrlər

| Əmr | Nə edir |
|---|---|
| `npm run dev` | inkişaf serveri |
| `npm run build` | production build |
| `npm start` | build olunmuş saytı işə salır |
| `npm run typecheck` | `next typegen && tsc --noEmit` |
| `npm run lint` | ESLint |

> **Qeyd:** `src/app/globals.css` dəyişdirdikdən sonra dev serveri yenidən başlat —
> Turbopack bu faylın dəyişikliyini həmişə hot-reload etmir.

---

## Mühit dəyişənləri

Tam siyahı və izahlar `.env.example` faylındadır.

| Dəyişən | Məcburi | Nə üçün |
|---|---|---|
| `SUPABASE_URL` | ✅ | Lead-ləri yazmaq |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | RLS-i bypass edən server açarı |
| `NEXT_PUBLIC_SITE_URL` | ✅ (prod) | canonical, OG, `robots.txt`, `sitemap.xml` |
| `NEXT_PUBLIC_GA_ID` | — | GA4 |
| `NEXT_PUBLIC_META_PIXEL_ID` | — | Meta Pixel |

⚠️ `SUPABASE_SERVICE_ROLE_KEY` **heç vaxt** `NEXT_PUBLIC_` prefiksi almamalıdır —
əks halda brauzerə düşər və bazaya tam giriş verər.

Analitika dəyişənləri boş qalsa, həmin skriptlər ümumiyyətlə yüklənmir.

Müraciətlər üçün bildiriş göndərilmir — yeni lead-ləri Supabase panelində
**Table Editor → `website_leads`** bölməsindən izləyirsən.

---

## Supabase qurulumu

1. Yeni Supabase layihəsi yarat.
2. SQL Editor-da `supabase/migrations/0001_website_leads.sql` faylını işə sal.
3. **Project Settings → Data API → Project URL** → `SUPABASE_URL`
4. **Project Settings → API Keys → `service_role`** → `SUPABASE_SERVICE_ROLE_KEY`

Cədvəldə RLS açıqdır və heç bir policy yoxdur — yəni `anon` açarı ilə oxumaq/yazmaq
mümkün deyil. Yazma yalnız Server Action-dakı service role açarı ilə baş verir.

---

## Vercel-ə deploy

1. Repo-nu GitHub-a push et.
2. Vercel → **Add New → Project** → repo-nu seç.
   Framework avtomatik **Next.js** təyin olunur; build əmrini dəyişmə.
3. **Settings → Environment Variables** — yuxarıdakı cədvəldən dəyişənləri əlavə et.
   `NEXT_PUBLIC_*` olanları Production, Preview və Development üçün də qeyd et.
4. **Deploy.**
5. Domeni bağla (**Settings → Domains**), sonra `NEXT_PUBLIC_SITE_URL`-i həmin
   domenə dəyiş və yenidən deploy et — `sitemap.xml`, `robots.txt` və OG linkləri
   bu dəyərdən qurulur.

`NEXT_PUBLIC_SITE_URL` təyin olunmasa, Vercel-in öz production domenindən istifadə
olunur (`VERCEL_PROJECT_PRODUCTION_URL`).

### Deploy-dan sonra yoxla

- [ ] Müraciət formu göndərilir, Supabase-də sətir yaranır
- [ ] `/robots.txt` və `/sitemap.xml` real domeni göstərir
- [ ] OG kartı düzgün görünür ([opengraph.xyz](https://www.opengraph.xyz/))
- [ ] Lighthouse: Performance və Accessibility

---

## Layihə strukturu

```
design/                         təsdiqlənmiş dizayn (toxunma)
  landing-reference.html        vizual referans
  tokens.json                   dizayn tokenləri
  web-guidelines.md             veb qaydaları
public/images/                  foto materiallar
supabase/migrations/            SQL migration-ları
src/
  app/
    layout.tsx                  şriftlər, metadata, JSON-LD, analitika
    page.tsx                    bölmələrin ardıcıllığı
    actions.ts                  Server Action (Supabase insert)
    globals.css                 Tailwind theme — dizayn tokenləri
    icon.tsx robots.ts sitemap.ts
  components/
    layout/                     Header, Footer, Analytics
    sections/                   hər bölmə ayrıca komponent
    ui/                         Button, Pill, GlassCard, CircleButton, …
  content/site.ts               BÜTÜN mətnlər burada
  hooks/useDialog.ts            modal: Esc, fokus tələsi, scroll kilidi
  lib/                          cn, env, leads (validasiya), analytics
```

Məzmunu komponentə yazma — hər şey `src/content/site.ts`-dən oxunur.
Ətraflı qaydalar: [`CLAUDE.md`](./CLAUDE.md).

---

## Launch-dan əvvəl doldurulmalı

`src/content/site.ts`-də `TODO` ilə işarələnib:

- [ ] `contact.whatsappCommunity` — `[WHATSAPP_COMMUNITY_LINK]`
- [ ] Motion və UX/UI proqramlarının başlama tarixi — `[TARİX]`
- [ ] Növbəti tədbirin saatı və məkanı — `[Saat] · [Məkan]`
- [ ] FAQ 06 — diplom şərtləri
- [ ] Tələbə işləri: 4 placeholder plitə → real şəkillər (`public/images/works/`)
- [ ] Rəylər nümunədir — real rəylərlə əvəz et və "Nümunə mətn" nişanını sil
- [ ] Müəllimlərin Behance/Instagram linkləri (hazırda `#`)
- [ ] Şirkət loqoları — mətn əvəzinə SVG
- [ ] Motion işləri — əlavə olunanda filter düymələri avtomatik görünəcək

## Bilinən güzəşt

Əsas CTA `#e5358c` + ağ mətn = **4.02:1**, yəni 16px mətn üçün WCAG AA-dan keçmir
(`tokens.json`-dakı `web-cta` `#b8226f` 6.0:1 verərdi). Brend sadiqliyi üçün
qəsdən saxlanılıb — Lighthouse `color-contrast` audit-i bu səbəbdən düşür.

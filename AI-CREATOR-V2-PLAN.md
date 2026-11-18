# AI Creator v2 — iş planı

Mənbə dizayn: `AI Creator — Banner` kətanı (5 artboard, DesTech dizayn sistemi).
Hazırlanma tarixi: 18 Noyabr 2026. **Hələ heç nə kodlanmayıb.**

---

## 1. Dizaynda nə var

| Artboard | Nədir | Ölçü |
|---|---|---|
| `V5` | Landing banneri — qaranlıq qradiyent hero, peşə generatoru sahəsi | 1440×940, fluid |
| `Details` | "Ətraflı" paneli — proqram, 8 modul, qiymət, CTA | 1040×1640, interaktiv |
| `Gen1` | Generator səhifəsi — boş vəziyyət | 1440×900 |
| `Gen2` | Generator — "Claude düşünür", addımlar | 1440×900 |
| `Gen3` | Generator — nəticə (kartlar, siyahı, CTA) | 1440×1340 |

### Yeni axın

```
Banner (V5)
  ├─ "Nələr öyrənəcəyinə bax"  →  Details paneli  →  "Qeydiyyata keç"  →  qeydiyyat formu
  └─ "Hazırda nə işlə məşğulsan?" input
        └─ peşə yazılır / plitə seçilir
              └─ nəticə:  Gen1 → Gen2 (düşünür) → Gen3 (nəticə + CTA)
```

### Köhnə axından fərqlər

| | İndiki sayt | Yeni dizayn |
|---|---|---|
| Banner fonu | kobalt mavi, orbit + 8 rol çipi | qaranlıq → çəhrayı qradiyent, üzən peşə pilləri, nəhəng "0-dan" |
| Giriş nöqtəsi | tək düymə "Ətraflı və qeydiyyat" | iki yol: "Nələr öyrənəcəyinə bax" + peşə input-u |
| Modal | bir modal, iki tab (proqram + qeydiyyat) | `Details` paneli (yalnız proqram) → ayrıca qeydiyyat |
| Proqram | 8 həftə × 8 rol | 8 modul, rol adları ilə (Fotoqraf, Montajçı, Developer…) |
| Qiymət | early bird 80 ₼ / 120 ₼ məntiqi | tək qiymət 120 ₼/ay + "Claude abunəliyi hədiyyə" |
| Generator | yoxdur | **tamamilə yeni** |
| Şrift | Plus Jakarta Sans + Unbounded | + **Playfair Display italic** (yeni) |

---

## 2. Əvvəlcə qərar verilməli olanlar

Bunlar cavabsız qalsa iş düzgün istiqamətə getməz.

### S1 — Qeydiyyat son tarixi 20 Noyabr, bu gün 18-dir
Həm dizaynda ("son tarix 20 Noyabr"), həm kodda (`aiCreatorPrice.ts`), həm də bazadakı RLS policy-sində bu tarix var. İki günə bu həcmdə iş çıxmır. Deməli:
- tarix yeni qrupa görə dəyişir? (onda hər üç yerdə eyni vaxtda dəyişməli)
- yoxsa v2 növbəti qrup üçün hazırlanır və 20 Noyabrdan sonra yayımlanır?

### S2 — Generator həqiqətən Claude-a qoşulacaq, yoxsa dizayndakı kimi hazır cavablar?
Dizaynın kodunda **real AI yoxdur**: 10 peşə üçün hazır mətnlər (`P` massivi), açar sözə görə uyğunlaşdırma və tanınmayan peşə üçün ümumi cavab. "Düşünür…" animasiyası bəzəkdir.
- **A) Dizayndakı kimi statik** — pulsuz, dərhal işləyir, sındırılmır. MVP üçün tövsiyə.
- **B) Real Claude API** — server route, API açarı, xərc, sui-istifadəyə qarşı limit, gözləmə vaxtı. Ayrıca mərhələ.

### S3 — Generator ayrıca səhifə olsun?
`Gen1–3` tam səhifədir (öz header-i, "Geri" düyməsi). Amma `CLAUDE.md`-də MVP1 qaydası: **yalnız `/` səhifəsi, başqa route yoxdur**.
- **A) `/generator` route-u** — dizayna uyğun, qaydanı dəyişir.
- **B) Bannerin içində açılan tam ekran panel** — route yoxdur, qayda pozulmur.

### S4 — `V5` artboard-ı yarımçıqdır
Komponentin məntiqində nəticə üçün dəyərlər var (`create`, `automate`, `showSol`, `pick0…5` plitələri), amma **onları göstərən markup artboard-da yoxdur** — input-dan sonrakı sahə və `#qeydiyyat` blokları boşdur. Üç ehtimal:
- nəticə bannerdə yox, generator səhifəsində göstərilir (ən çox ehtimal),
- plitələr sonradan silinib,
- dizayn hələ bitməyib.

Hansı nəzərdə tutulub?

### S5 — Qiymət məntiqi sadələşir?
`Details` footer-də tək qiymət: **120 ₼/ay**, üstüxətli köhnə qiymət yoxdur, əvəzinə "Claude abunəliyi bizdən hədiyyə". Early bird (80 ₼) tamamilə çıxarılsın? Çıxarılsa `aiCreatorPrice.ts`, `site.ts` və migrasiyadakı `price_azn` default-u birlikdə dəyişməlidir.

### S6 — Qeydiyyat formu necə açılır?
Dizaynda forma çəkilməyib. İndiki forma (ad, nömrə, FİN, e-poçt, razılıq) saxlanılır, amma:
- `Details` panelinin içində ikinci tab kimi (indiki kimi), yoxsa
- `Details` bağlanıb ayrıca qeydiyyat paneli açılır?

---

## 3. Mərhələlər

Hər mərhələ ayrıca commit/PR. Sıra vacibdir: 1-ci olmadan 2-ci işləmir.

### Mərhələ 0 — Təməl (S1, S5 cavablandıqdan sonra)
- [ ] Tarixləri bir yerdə topla: `aiCreatorPrice.ts` + `site.ts` + yeni SQL migrasiyası eyni vaxtda
- [ ] Playfair Display şriftini `next/font/google` ilə əlavə et (yalnız italic 700 — ölçü üçün)
- [ ] Yeni rəng tokenləri: qaranlıq qradiyent (`#1d1b20 → #5a1a42 → #a3226b → #b8226f`), vurğu `#ff9fd3`, `#ffd3e8`
- [ ] Hazırkı `#e5358c` ilə yeni `#b8226f` arasında qərar: banner daxilində tünd variant, saytın qalanında köhnə CTA rəngi qalır

**Nəticə:** heç nə görünmür, amma sonrakı mərhələlər üçün zəmin var. Kiçik.

### Mərhələ 1 — Yeni banner (V5)
- [ ] `AiCreator.tsx` tam yenidən yazılır: qradiyent fon, üzən peşə pilləri, SVG "naqillər", kursor işığı
- [ ] Nəhəng "0-dan" tipoqrafiyası (`-webkit-text-stroke`, `clamp()`)
- [ ] Peşə input sahəsi (hələ işləmir — yalnız görünüş)
- [ ] "Nələr öyrənəcəyinə bax" düyməsi → `Details` paneli
- [ ] **Əlçatanlıq düzəlişi:** dizayndakı input-un `<label>`-i yoxdur, əlavə olunmalı (ekran oxuyucusu üçün gizli)
- [ ] Mobil: pillər ≤900px gizlənir, "0-dan" ölçüsü kiçilir, input tam en
- [ ] `prefers-reduced-motion`: bütün animasiyalar sönür (dizaynda var, saxla)
- [ ] 375 / 768 / 1024 / 1440px-də yoxla

**Nəticə:** banner yeni görkəmdədir, generator hələ işləmir. Böyük — ən ağır mərhələ.

### Mərhələ 2 — Ətraflı paneli (Details)
- [ ] İndiki `AiCreatorModal`-ın proqram tabı yeni `Details` dizaynına keçir
- [ ] 8 modul `site.ts`-ə köçür (rol adı + başlıq + izah)
- [ ] "Kimlər üçündür" bloku
- [ ] Yapışqan footer: 120 ₼/ay + "Claude abunəliyi hədiyyə" + "Qeydiyyata keç"
- [ ] Fokus tələsi, Esc ilə bağlanma, `#ai-creator` hash-i ilə birbaşa açılma saxlanılır

**Nəticə:** banner → ətraflı → qeydiyyat axını tam işləyir. Orta.

### Mərhələ 3 — Generator (S2, S3, S4 cavablandıqdan sonra)
- [ ] Peşə bazası `site.ts`-ə: 10 peşə + ümumi cavab (dizayndakı `P` massivi)
- [ ] Açar sözlə uyğunlaşdırma, Azərbaycan hərflərinə görə `toLocaleLowerCase('az')`
- [ ] Boş vəziyyət (Gen1): başlıq, input, "Claude ilə işləyir" nişanı
- [ ] Düşünmə vəziyyəti (Gen2): addımlar bir-bir işarələnir, shimmer effekti
- [ ] Nəticə (Gen3): 4 avtomatlaşdırma kartı, "Yarada biləcəklərin" siyahısı, "Nəticə" bloku, CTA
- [ ] "Geri" → bannerə qayıdış
- [ ] Mobil: kartlar bir sütun, chat balonları dar ekranda oxunaqlı

**Nəticə:** tam yeni axın. Böyük.

### Mərhələ 4 — Son yoxlama
- [ ] Kontrast: `#ffd3e8`, `#8d8a93`, `#a8a5ad` fonlarına qarşı 4.5:1 yoxlanır
- [ ] Klaviatura ilə bütün axın: banner → ətraflı → qeydiyyat → generator
- [ ] Animasiyaların mobil performansı (backdrop-blur + qradiyent + SVG eyni anda ağırdır)
- [ ] Lighthouse, 375px-də horizontal scroll yoxdur
- [ ] Qeydiyyatın uçdan-uca yoxlanması (Supabase-ə real yazı)

---

## 4. Nəzərə alınmalı texniki qeydlər

- **Radius:** dizaynda panel radius-u `8px`, `CLAUDE.md`-də isə `36px` (mobil 24px) yazılıb. Dizayn qaydası dəyişib, yoxsa bu artboard-a məxsusdur? `CLAUDE.md` yenilənməlidir.
- **Animasiya yükü:** V5-də eyni anda bob (10 pill), wire-pulse, glow, cursor-glow, zeroIn, backdrop-blur işləyir. Zəif telefonda kadr düşümü riski var — pillərin sayı azaldıla və ya `will-change` məhdudlaşdırıla bilər.
- **Qeydiyyat bazası:** artıq platform Supabase layihəsindədir (`gsrytfnfgpxgzcvtdsxe`). Vercel-də env dəyişənləri hələ köhnədir — v2 işinə başlamazdan əvvəl düzəlməlidir, əks halda prod-da forma işləməyəcək.
- **Mətnlər:** dizayndakı bütün mətnlər hazırdır və Azərbaycan dilindədir — birbaşa `site.ts`-ə köçürülə bilər, yenidən yazmağa ehtiyac yoxdur.
- **`useHashTab`:** `#ai-creator` və `#ai-creator-qeydiyyat` hash-ləri saxlanılmalıdır (paylaşılmış linklər var). Generator üçün üçüncü hash lazım ola bilər.

---

## 5. Təxmini həcm

| Mərhələ | Həcm |
|---|---|
| 0 — Təməl | kiçik |
| 1 — Banner | böyük |
| 2 — Ətraflı paneli | orta |
| 3 — Generator | böyük |
| 4 — Yoxlama | orta |

Mərhələ 1 və 2 müstəqildir, paralel gedə bilər. Mərhələ 3 S2/S3/S4 cavabsız başlaya bilməz.

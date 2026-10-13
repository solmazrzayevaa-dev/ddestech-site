# Veb (sayt)

Bu bölmə DesTech sistemini sayta (landing, proqram və blog səhifələri) uyğunlaşdırır. Sosial media qaydaları (1080px kanvas, 26px minimum) vebə köçürülmür — vebdə `web-*`, `glass-*` və veb kölgə tokenləri istifadə olunur. Rənglər, şriftlər və brend səsi eynidir.

## 2026 istiqaməti — nəyə əsaslanır

Vizual dil 2025–2026 studio və təhsil saytlarında görünən bir neçə ortaq qərara söykənir (referanslar: Studio Aton, Glossai, Leara, Aeline, Confluence, şəxsi portfolio saytları):

1. **Çərçivəli kanvas** — səhifə bir uzun səth deyil, ekran kənarından `web-frame` (12px) içəri çəkilmiş yumru panellərdir (`radius-xl`). Panellər arasında da 12px.
2. **Mozaika və bento grid** — foto plitələri və kartlar sıx aralıqla (`web-mosaic-gap` 8px) yığılır; ölçüləri fərqlidir (1, 2, 3 sütun). Ritm bərabər kart cərgələrindən yox, ölçü kontrastından gəlir.
3. **Sakit, sıx tipoqrafiya** — böyük başlıqlar ExtraBold deyil, **Semibold 600**, çox sıx hərf aralığı. İerarxiya ağırlıqla yox, ölçü və rəng tonu ilə qurulur.
4. **İki tonlu başlıq** — başlığın giriş hissəsi `web-text-soft`, əsas hissəsi `web-text`: "Proqramı öyrətmirik — *designer kimi düşünməyi öyrədirik.*"
5. **Editorial etiketlər** — `(01) Tədris proqramları` kimi mötərizəli nömrələr, küncdə kiçik meta (`(2026)`, `©`). Böyük hərfli "KICKER"-lər yox.
6. **Şüşə yalnız fotoqrafiya üzərində** — nav, chip, ad lövhəsi, "Ətraflı" düyməsi şəkil və ya rəngli blok üzərində üzəndə. Düz fonda şüşə kart yox.
7. **İki qatlı yumşaq kölgə** — yaxın kəskin 1px + uzaq yumşaq geniş kölgə. Kölgə yalnız üzən elementlərdə.

## Rəng

- Baza: `web-bg` (cloud) və alternativ bölmə fonu `web-bg-alt` — full-bleed bölmələr ton fərqi ilə ayrılır, xətt ilə yox.
- Mətn: `web-text`; köməkçi `web-text-muted`; iki tonlu böyük başlıqda `web-text-soft` (yalnız 36px+).
- Brend rəngləri **panel və plitə** kimi: proqram kartları, community paneli, mozaika plitələri. Ardıcıl iki tam rəngli panel yoxdur.
- `web-cta` (pink-deep) yalnız "Müraciət et". İkinci dərəcəli düymələr ink pill və ya şüşə.
- `web-highlight` (lime) — status nöqtəsi, "Növbəti qrup", aktiv filter. Lime üzərində həmişə ink.

### Proqram rəngləri

| Proqram | Kart fonu | Başlıq | Kiçik mətn |
|---|---|---|---|
| Qrafik dizayn | `pink` | `paper` (24px+) | `ink` — kiçik ağ mətn pink üzərində keçmir |
| Motion dizayn — 0-dan | `cobalt` | `paper` | `paper` |
| Motion — dizaynerlər üçün | `yellow` | `ink` | `ink` |
| Vizual dizayn | `ink` | `paper` | `paper`, vurğu `lime` |

## Şüşə (glass)

- **Açıq şüşə**: fon `glass-light`, `backdrop-filter: blur(20px) saturate(160%)`, 1px `glass-stroke` kontur, `shadow-glass`. Üzərində ink mətn.
- **Tünd şüşə**: fon `glass-dark`, eyni blur, ağ mətn. Açıq, sakit fotolar üzərində.
- İstifadə yerləri: üzən nav pill, foto üzərində chip və ad lövhəsi, kart şəklinin üstündə "Ətraflı" düyməsi, community fotosunun üzərində tədbir kartı.
- Etmə: düz cloud fonda şüşə kart; şüşə içində şüşə; şüşə üzərində uzun mətn (maks. 2 sətir).
- `backdrop-filter` dəstəklənməyəndə fon `paper` / `ink` 90% opaklıqla əvəz olunur.

## Kölgə

| Token | Harada |
|---|---|
| `shadow-float` | Nav pill, üzən chip, hover olunan kart |
| `shadow-card` | Neytral fondakı kartlar — demək olar ki, görünməz |
| `shadow-glass` | Şüşə elementlər (daxili işıq xətti + düşən kölgə) |

Rəngli panellərdə kölgə yoxdur — rəng özü səthi ayırır.

## Tipoqrafiya

| Rol | Stil | Mobil | Desktop |
|---|---|---|---|
| Hero / wordmark | `web-display` | 48px | 104px, 600, −0.055em |
| Bəyanat paraqrafı | `web-statement` | 24px | 36px, 500, mərkəzdə |
| Bölmə başlığı | `web-h2` | 36px | 64px, 600 |
| Kart başlığı | `web-h3` | 22px | 26px, 600 |
| Giriş mətni | `web-body-lg` | 18px | 20px |
| Əsas mətn | `web-body` | 16px | 16px (blog 18px) |
| Meta | `web-small` | 14px | 14px |
| Etiket | `web-label` | `(01) Ad` 13px | eyni |
| Rəqəm | `web-stat` (Unbounded) | 44px | 64px |

- Unbounded yalnız rəqəm, tarix və footer wordmark-ı üçün.
- Caveat vebdə səhifədə maks. 1 dəfə.
- Uzun Azərbaycan sözləri ("Müəllimlərimiz") mobil başlıqda sığmalıdır — ölçünü kiçilt, sözü bölmə.

## Grid və düzülüş

- **Çərçivə**: panellər ekran kənarından `web-frame` 12px (mobil 8px), radius `radius-xl` 36px (mobil 24px).
- **Məzmun**: panel içində 12 sütun, konteyner `web-container` 1280px, kənar boşluq 40px (mobil 16px), aralıq `web-grid-gap` 24px.
- **Mozaika**: foto və iş plitələri `web-mosaic-gap` 8px, plitə radius 16–20px. Hero mozaikası: 12 sütun, 2 cərgə, plitələr 3–5 sütun enində.
- **Bölmə nümunələri** (eyni nümunə ardıcıl iki dəfə yox):
  - Mərkəzləşdirilmiş bəyanat (etiket + `web-statement` + düymə)
  - Sol başlıq + sağda karusel idarəsi (ox düymələri), aşağıda kart cərgəsi
  - Bento: bir tünd böyük kart + 4 rəqəm kartı (rəqəm solda, etiket sağda, arada incə xətt)
  - Split panel: rəngli mətn paneli + foto paneli (şüşə element üzərində)
  - Redaksiya siyahısı: incə xətlərlə ayrılmış sətirlər (FAQ)
- Bölmələr arası 128px (mobil 72px). Full-bleed fon dəyişikliyi bölmə sərhədidir.

## Komponentlər (veb)

- **Nav** — üzən pill (`glass-light` + `shadow-float`), ekranın yuxarısından 12px aşağıda. Solda dairəvi logo nişanı + "DesTech", ortada seqmentli link qrupu (aktiv link ink pill-də ağ mətn), sağda "Müraciət et" + dairəvi menyu düyməsi (44px). Mobil: logo + menyu dairəsi; menyu tam ekran panel.
- **Button** — primary: `web-cta` pill 52px, sağda ağ dairə içində ox. Secondary: ink pill. Şüşə: foto üzərində. Hover: ox dairəsi 45° fırlanır.
- **Status pill** — kiçik pill, solda lime nöqtə: "● Qəbul açıqdır · [TARİX]".
- **Chip / Tag** — pill 30px, 13–14px. Rəngli kart üzərində ağ fon + ink.
- **Program card** — 4:5 nisbət, yuxarıda chip-lər, başlıq, təsvir; aşağı yarıda tələbə işi, onun üstündə şüşə "Ətraflı →" düyməsi.
- **Karusel idarəsi** — iki dairəvi düymə (44px): biri kontur, biri ink.
- **Input** — paper fon, `web-border-strong` 1.5px, `radius-sm`, 52px, label üstdə.
- **Accordion (FAQ)** — kartsız, incə `web-border` xətlərlə ayrılmış sətirlər; sual `web-h3`, sağda dairəvi +/− düyməsi.
- **Logo marquee** — monoxrom loqolar, kənarlarda solğunlaşma maskası.

## Hallar və əlçatanlıq

- Fokus: `focus-ring` 2px, 2px offset — tünd və foto fonlarda ağ halqa.
- Mətn kontrastı 4.5:1 (24px+ üçün 3:1). Şüşə üzərindəki mətni ən açıq/ən tünd foto hissəsinə qarşı yoxla.
- Hərəkət: opacity/transform, 200–400ms; `prefers-reduced-motion` olduqda dayanır.
- Bütün şəkillərin alt mətni (tələbə işi: "İş adı — Tələbə adı").

## Etmə

- Düz fonda şüşə kartlar, göy səma + üzən UI template-i, göy-bənövşəyi qradiyent.
- Hər yerdə ExtraBold başlıq; hər bölmədə eyni "etiket + başlıq + 3 kart" nümunəsi.
- Uydurma rəqəmlər. Rəqəm yoxdursa, rəqəm kartı da yoxdur.
- Stok "gülümsəyən tələbə" fotoları — real dərs, LAB, tədbir fotoları və tələbə işləri.
- Sosial media ölçülərini vebdə istifadə etmək.

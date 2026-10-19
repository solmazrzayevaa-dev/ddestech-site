/**
 * DesTech landing — bütün məzmun.
 * Mənbə: design/landing-reference.html. Mətnlər dəyişdirilməyib.
 *
 * Komponentlərə mətn yazma — hər şey buradan oxunur (CLAUDE.md → Kod qaydaları).
 * Köşəli mötərizədəki yerlər ([TARİX], [Saat] · [Məkan], [Tələbə adı], …)
 * referansdakı doldurulmamış sahələrdir — launch-dan əvvəl əvəz olunmalıdır.
 */

/* ────────────────────────────── Tiplər ────────────────────────────── */

/** Tailwind theme-dəki rəng token adları (src/app/globals.css → @theme). */
export type ColorToken =
  | "pink"
  | "yellow"
  | "indigo"
  | "cobalt"
  | "lime"
  | "ink"
  | "paper";

export type ProgramId = "qrafik" | "motion" | "uxui";

export interface NavLink {
  label: string;
  href: string;
}

export interface ProgramTheme {
  /** Kart və drawer başlığının fonu. */
  bg: ColorToken;
  /** Drawer başlığındakı mətn (pink üzərində ink — referansdakı kimi). */
  fg: ColorToken;
  /** Kart başlığı — pink üzərində ağ (24px+ olduğu üçün keçir). */
  cardTitleFg: ColorToken;
  /** Kart təsviri — pink üzərində kiçik ağ mətn keçmir, ona görə ink. */
  cardBodyFg: ColorToken;
  /** Modul nömrələri və kiçik vurğular. */
  accent: ColorToken;
  /** Drawer başlığının küncündəki 3D kürənin əsas rəngi. */
  orb: ColorToken;
}

/** "(a) Kimin üçündür" kartı. */
export interface ProgramAudience {
  title: string;
  description: string;
}

/** "(c) Tədris planı" sətri. */
export interface ProgramModule {
  /** "01" … "08" — Unbounded ilə göstərilir. */
  number: string;
  title: string;
  description: string;
}

export interface Program {
  id: ProgramId;
  /** Kart və drawer başlığı. */
  title: string;
  /** Kartda başlıq sətirlərə bölünür (referansda <br>). */
  titleLines: string[];
  /** Kart üzərindəki qısa təsvir. */
  cardDescription: string;
  /** Kart üzərindəki chip-lər. */
  cardChips: string[];
  /** Kart plitəsinin küncündəki qiymət nişanı. */
  price: string;
  theme: ProgramTheme;

  /* ── Drawer (detal paneli) ── */
  /** Drawer başlığındakı chip-lər. */
  chips: string[];
  summary: string;
  duration: string;
  format: string;
  payment: string;
  /** "8 modul" — tədris planı başlığının sağında. */
  moduleCount: string;
  /** Növbəti qrupun başlama tarixi (sticky altlıqda). */
  next: string;
  audience: ProgramAudience[];
  outcomes: string[];
  modules: ProgramModule[];
  tools: string[];
  final: string;
  /** Müraciət formundakı select seçimi. */
  formOption: string;
}

export interface Teacher {
  name: string;
  role: string;
  /** Fotonun üstündəki chip. */
  badge: string;
  image: string;
  imageAlt: string;
  /** object-position — portretin kadrlanması. */
  imagePosition: string;
  links: { label: string; ariaLabel: string; href: string }[];
}

export interface Testimonial {
  /** Sitatın sakit (web-text-soft) hissəsi. */
  lead: string;
  text: string;
  name: string;
  meta: string;
  /** Avatar dairəsinin rəngi. */
  color: ColorToken;
}

export interface FaqItem {
  /** "01" … "06". */
  number: string;
  question: string;
  answer: string;
}

/** Bento rəqəm kartı (Necə oxuyursan). */
export interface StatCard {
  /** Unbounded ilə: "2×", "100%", "LAB", "1:1". */
  value: string;
  /** Rəqəmin sağındakı meta — drawer-dəki kiçik kartlarda yoxdur. */
  label?: string;
  description: string;
  /** Yalnız LAB kartı limedir; qalanları ağ səth. */
  highlight?: boolean;
}

/**
 * Mozaika plitəsi.
 *
 * Real iş əlavə etmək üçün sadəcə `image` yaz — şəkil avtomatik placeholder-i
 * əvəz edir. `fill` və `placeholder` yalnız şəkil olmayanda işlənir.
 */
export interface WorkTile {
  /**
   * İşin adı, məs. "Bakı Dizayn Həftəsi posteri".
   * Həm plitənin üstündə görünür, həm də şəklin alt mətni kimi işlənir,
   * ona görə təsviredici olsun.
   */
  caption: string;
  /** Filter teqi — "Qrafik" və ya "Motion" düyməsinə görə süzülür. */
  tag: "Qrafik" | "Motion";
  /** 12 sütunlu grid-də plitənin eni: 3, 5, 6 və ya 7. */
  span: 3 | 5 | 6 | 7;
  /** `lg` ≈ 440px hündürlük, `sm` ≈ 280px. */
  size: "lg" | "sm";
  /** Açıq şəkildə açıq şüşə, tünd şəkildə tünd şüşə ad lövhəsi. */
  captionGlass: "light" | "dark";

  /** Şəklin yolu, məs. "/images/works/poster-aysel.jpg". */
  image?: string;
  /** Şəklin kadrlanması, məs. "center 30%". Default: mərkəz. */
  imagePosition?: string;

  /* ── Yalnız şəkil YOXDURSA ── */
  /** Placeholder plitənin fonu. */
  fill?: ColorToken | "stripe";
  /** Placeholder üzərindəki dekorativ forma. */
  placeholder?: "poster" | "logo" | "motion";
}

/* ────────────────────────────── Ümumi ────────────────────────────── */

export const site = {
  name: "DesTech",
  locale: "az",
  title: "DesTech — Dizayn akademiyası",
  /** Referansda meta description yoxdur — hero mətnindən qurulub (addım 8-də dəqiqləşir). */
  description:
    "Qrafik, motion və UX/UI dizayn proqramları — nəzəriyyə, vizual zövq və real layihələrlə. Bakı, Cəfərov Qardaşları 16.",
} as const;

export const contact = {
  address: "Cəfərov Qardaşları 16, Bakı",
  city: "Bakı, Azərbaycan",
  phoneLabel: "055 590 36 95",
  phoneHref: "tel:+994555903695",
  whatsapp: "https://wa.me/994555903695",
  instagram: "https://instagram.com/destechcom",
  instagramHandle: "@destechcom",
  /** TODO: real link gələndə əvəz et (CLAUDE.md → Açıq qalanlar). */
  whatsappCommunity: "[WHATSAPP_COMMUNITY_LINK]",
} as const;

/* ────────────────────────────── Naviqasiya ────────────────────────────── */

export const navLinks: NavLink[] = [
  { label: "Proqramlar", href: "#proqramlar" },
  { label: "Tələbə işləri", href: "#isler" },
  { label: "Müəllimlər", href: "#muellimler" },
  { label: "Community", href: "#community" },
  { label: "Suallar", href: "#faq" },
];

export const nav = {
  ariaLabel: "Əsas naviqasiya",
  cta: { label: "Müraciət et", href: "#muraciet" },
  menuOpenLabel: "Menyunu aç",
  menuCloseLabel: "Menyunu bağla",
} as const;

/* ────────────────────────────── Hero ────────────────────────────── */

export const hero = {
  badge: "Onlayn və oflayn",
  titleLines: ["Designer kimi", "düşünməyi öyrən."],
  subtitle:
    "Qrafik, motion və UX/UI dizayn proqramları — nəzəriyyə, vizual zövq və real layihələrlə.",
  primaryCta: { label: "Müraciət et", href: "#muraciet" },
  secondaryCta: { label: "Proqramlara bax", href: "#proqramlar" },
  image: "/images/hero-banner.jpg",
  imageAlt: "DesTech tələbələri birlikdə layihə üzərində işləyir",
  /** Hero üzərindəki şüşə kart. */
  nextGroup: {
    label: "Növbəti qrup",
    badge: "4 ay",
    program: "Qrafik dizayn",
    startLabel: "Başlanğıc",
    startDate: "01 noyabr",
    cta: { label: "Yerini ayır", href: "#muraciet" },
  },
} as const;

/* ────────────────────────────── Bəyanat + loqolar ────────────────────────────── */

export const statement = {
  /** İki tonlu paraqraf: sakit hissə + əsas hissə. */
  lead: "Sadəcə proqramı öyrətmirik —",
  text: "designer kimi görməyi, düşünməyi və qərar verməyi öyrədirik. Nəzəriyyə, vizual zövq və real layihələrlə.",
  primaryCta: { label: "Müraciət et", href: "#muraciet" },
  secondaryCta: { label: "Proqramlara bax", href: "#proqramlar" },
  logosLabel: "Məzunlarımız bu komandalarda işləyir",
  /** TODO: SVG loqolar gələnə qədər mətn (CLAUDE.md → Açıq qalanlar). */
  logos: [
    "Paşa Bank",
    "Sinteks",
    "Dövlət Reklam Agentliyi",
    "AzInTelecom",
    "Okee Agency",
    "Soliton",
  ],
} as const;

/* ────────────────────────────── Proqramlar ────────────────────────────── */

export const programsSection = {
  id: "proqramlar",
  label: "(01) Tədris proqramları",
  headingSoft: "Üç proqram.",
  heading: "Bir düşüncə sistemi.",
  detailsLabel: "Ətraflı",
} as const;

/** Drawer-dəki bölmə etiketləri — hər üç proqram üçün eynidir. */
export const programDetailLabels = {
  durationLabel: "Müddət",
  formatLabel: "Format",
  paymentLabel: "Ödəniş",
  audience: "(a) Kimin üçündür",
  outcomes: "(b) Kursun sonunda bacaracaqsan",
  curriculum: "(c) Tədris planı",
  tools: "(d) Alətlər",
  howYouStudy: "(e) Necə oxuyursan",
  final: "(f) Final layihə və diplom",
  nextGroup: "Növbəti qrup",
  apply: "Bu proqrama müraciət et",
  close: "Bağla",
} as const;

/** "(e) Necə oxuyursan" — drawer içindəki dörd kiçik kart. */
export const studyFormat: StatCard[] = [
  { value: "2×2", description: "Həftədə 2 canlı dərs, hər biri 2 saat" },
  { value: "REC", description: "Hər dərsin yazısı və PDF-i Classroom-da" },
  { value: "LAB", description: "Həftəlik əlavə praktika saatı", highlight: true },
  { value: "1:1", description: "Dərsdənkənar mentor dəstəyi" },
];

export const programs: Program[] = [
  {
    id: "qrafik",
    title: "Qrafik dizayn",
    titleLines: ["Qrafik", "dizayn"],
    cardDescription:
      "Kompozisiya, tipoqrafiya, rəng və konsepsiya — vizual düşüncənin təməli.",
    cardChips: ["4 ay", "Sıfırdan"],
    price: "250 ₼ / ay",
    theme: {
      bg: "pink",
      fg: "ink",
      cardTitleFg: "paper",
      cardBodyFg: "ink",
      accent: "pink",
      orb: "yellow",
    },

    chips: ["4 ay", "Sıfırdan", "Onlayn · Oflayn"],
    summary:
      "Vizual dilin əsaslarından brend identikasına qədər — proqramı yox, dizayn qərarı verməyi öyrənirsən. Hər modul real tapşırıqla bitir.",
    duration: "4 ay",
    format: "Onlayn · Oflayn",
    payment: "250 ₼ / ay",
    moduleCount: "8 modul",
    next: "01 noyabr",
    audience: [
      {
        title: "Sıfırdan başlayanlar",
        description: "Dizayn təcrübəsi tələb olunmur — yalnız kompüter və maraq.",
      },
      {
        title: "Karyera dəyişənlər",
        description:
          "Marketinq, memarlıq və ya başqa sahədən dizayna keçmək istəyənlər.",
      },
      {
        title: "SMM və marketoloqlar",
        description:
          "Vizualları özü hazırlamaq və brief-i düzgün qurmaq istəyənlər.",
      },
    ],
    outcomes: [
      "Kompozisiya, rəng və tipoqrafiya qərarlarını əsaslandırmaq",
      "Grid sistemləri ilə səliqəli, oxunaqlı maketlər qurmaq",
      "Loqo və tam vizual identika sistemi hazırlamaq",
      "Sosial media üçün ardıcıl post seriyaları dizayn etmək",
      "AI alətlərini araşdırma və ideya mərhələsində köməkçi kimi istifadə etmək",
      "Case study formatında portfolio təqdim etmək",
    ],
    modules: [
      {
        number: "01",
        title: "Vizual dilin əsasları",
        description:
          "Nöqtə, xətt, forma, Gestalt prinsipləri; Illustrator-da vektor qrafika.",
      },
      {
        number: "02",
        title: "Rəng nəzəriyyəsi",
        description:
          "Itten və Albers yanaşması, kontrast, palitra qurmaq və rəngin mənası.",
      },
      {
        number: "03",
        title: "Tipoqrafiya və iyerarxiya",
        description:
          "Şrift seçimi və cütləşdirmə, Azərbaycan hərfləri ilə işləmək, oxunaqlılıq.",
      },
      {
        number: "04",
        title: "Kompozisiya və grid sistemləri",
        description: "İsveçrə üslubu, modul grid, poster və nəşr maketləri.",
      },
      {
        number: "05",
        title: "Foto və manipulyasiya",
        description:
          "Photoshop-da retuş, kollaj, işıq-kölgə; AI ilə şəkil redaktəsi.",
      },
      {
        number: "06",
        title: "Rəqəmsal dizayn: sosial media",
        description:
          "Figma-da post seriyası, karusel və brend kit; platforma qaydaları.",
      },
      {
        number: "07",
        title: "Brendinq",
        description: "Brend araşdırması, loqo, identika sistemi və brendbuk.",
      },
      {
        number: "08",
        title: "Portfolio və final layihə",
        description: "İşlərin seçimi, case study yazmaq, Behance və təqdimat.",
      },
    ],
    tools: [
      "Illustrator",
      "Photoshop",
      "InDesign",
      "Figma",
      "Adobe Firefly",
      "ChatGPT / Claude",
    ],
    final:
      "Kursun sonunda real brief əsasında brend identika layihəsi hazırlayır və müdafiə edirsən. Tapşırıqları və final layihəni uğurla təqdim edən tələbəyə DesTech diplomu verilir.",
    formOption: "Qrafik dizayn — 4 ay",
  },

  {
    id: "motion",
    title: "Motion dizayn",
    titleLines: ["Motion", "dizayn"],
    cardDescription:
      "Statik dizaynını hərəkətə gətir. Qrafik dizaynla tanış olanlar üçün.",
    cardChips: ["4 ay", "Dizaynerlər üçün"],
    price: "250 ₼ / ay",
    theme: {
      bg: "yellow",
      fg: "ink",
      cardTitleFg: "ink",
      cardBodyFg: "ink",
      accent: "cobalt",
      orb: "cobalt",
    },

    chips: ["4 ay", "Dizaynerlər üçün", "Onlayn · Oflayn"],
    summary:
      "Statik dizaynı hərəkətə gətir: zaman, ritm və keçidlərlə hekayə danışmağı öyrən. Qrafik dizayn biliyi olanlar üçün.",
    duration: "4 ay",
    format: "Onlayn · Oflayn",
    payment: "250 ₼ / ay",
    moduleCount: "8 modul",
    /** TODO: tarix təsdiqlənəndə əvəz et. */
    next: "[TARİX]",
    audience: [
      {
        title: "Qrafik dizaynerlər",
        description:
          "İşlərinə hərəkət əlavə edib xidmətlərini genişləndirmək istəyənlər.",
      },
      {
        title: "SMM dizaynerləri",
        description:
          "Reels, story və reklam üçün animasiyalı kontent hazırlayanlar.",
      },
      {
        title: "DesTech məzunları",
        description:
          "Qrafik dizayn proqramından sonra növbəti addım atmaq istəyənlər.",
      },
    ],
    outcomes: [
      "Animasiyanın 12 prinsipini öz işlərində tətbiq etmək",
      "After Effects-də keyframe, easing və graph editor ilə sərbəst işləmək",
      "Kinetik tipoqrafiya və loqo animasiyası hazırlamaq",
      "Brend üçün hərəkət dili (motion guideline) qurmaq",
      "Sosial media formatları üçün səslə sinxron video hazırlamaq",
      "Showreel yığıb portfolioya əlavə etmək",
    ],
    modules: [
      {
        number: "01",
        title: "Hərəkətin prinsipləri",
        description: "Animasiyanın 12 prinsipi, zaman, ritm və easing məntiqi.",
      },
      {
        number: "02",
        title: "After Effects əsasları",
        description: "Layer, keyframe, graph editor, kompozisiya qurmaq.",
      },
      {
        number: "03",
        title: "Forma animasiyası",
        description: "Shape layer, mask, matte və trim path ilə işləmək.",
      },
      {
        number: "04",
        title: "Kinetik tipoqrafiya",
        description: "Mətnin hərəkəti, ritm, oxunaqlılıq və səslə sinxron.",
      },
      {
        number: "05",
        title: "Loqo animasiyası və brend hərəkəti",
        description: "Loqo reveal, brendin hərəkət dili və motion guideline.",
      },
      {
        number: "06",
        title: "Sosial media üçün motion",
        description: "Reels, story və reklam formatları; Premiere Pro-da montaj.",
      },
      {
        number: "07",
        title: "AI və motion",
        description:
          "AI ilə asset və video generasiyası, iş axınını sürətləndirmək.",
      },
      {
        number: "08",
        title: "Showreel və final layihə",
        description: "İşlərin seçimi, showreel montajı və təqdimat.",
      },
    ],
    tools: [
      "After Effects",
      "Premiere Pro",
      "Illustrator",
      "Figma",
      "AI video alətləri",
    ],
    final:
      "Kursun sonunda bir brend üçün tam motion paketi (loqo animasiyası, sosial media videoları) hazırlayır və showreel yığırsan. Uğurla müdafiə edənə DesTech diplomu verilir.",
    formOption: "Motion dizayn — 4 ay",
  },

  {
    id: "uxui",
    title: "UX/UI dizayn",
    titleLines: ["UX/UI dizayn"],
    cardDescription:
      "İstifadəçini anlamaqdan prototipə qədər — tədqiqat, wireframe və interfeys dizaynı.",
    cardChips: ["4 ay", "Sıfırdan"],
    price: "250 ₼ / ay",
    theme: {
      bg: "indigo",
      fg: "paper",
      cardTitleFg: "paper",
      cardBodyFg: "paper",
      accent: "indigo",
      orb: "lime",
    },

    chips: ["4 ay", "Sıfırdan", "Onlayn · Oflayn"],
    summary:
      "İstifadəçini anlamaqdan hazır interfeysə qədər rəqəmsal məhsul dizaynının bütün prosesi — AI alətləri iş axınına daxil edilməklə.",
    duration: "4 ay",
    format: "Onlayn · Oflayn",
    payment: "250 ₼ / ay",
    moduleCount: "8 modul",
    /** TODO: tarix təsdiqlənəndə əvəz et. */
    next: "[TARİX]",
    audience: [
      {
        title: "Sıfırdan başlayanlar",
        description: "Rəsm bacarığı tələb olunmur — kurs dizayn düşüncəsi üzərindədir.",
      },
      {
        title: "Qrafik dizaynerlər",
        description: "Rəqəmsal məhsul dizaynına keçmək istəyənlər.",
      },
      {
        title: "Məhsul komandaları",
        description:
          "Dizayn tələblərini düzgün qurmaq istəyən menecer və sahibkarlar.",
      },
    ],
    outcomes: [
      "Brief-i oxuyub istifadəçi araşdırması planlamaq və aparmaq",
      "User flow, wireframe və informasiya arxitekturası qurmaq",
      "Figma-da auto layout, komponent və variantlarla peşəkar işləmək",
      "Veb və mobil tətbiq üçün tam UI dizayn hazırlamaq",
      "Token və variable-larla dizayn sistemi qurmaq",
      "Prototip yığıb istifadəçi testi aparmaq və developer-ə ötürmək",
    ],
    modules: [
      {
        number: "01",
        title: "UX və dizayn düşüncəsi",
        description:
          "Design thinking, problemi düzgün təyin etmək, brief-i oxumaq.",
      },
      {
        number: "02",
        title: "İstifadəçi araşdırması",
        description: "Müsahibə, persona, araşdırma planı; AI ilə nəticələrin təhlili.",
      },
      {
        number: "03",
        title: "İnformasiya arxitekturası",
        description: "User flow, sayt xəritəsi, wireframe.",
      },
      {
        number: "04",
        title: "Figma peşəkar səviyyədə",
        description:
          "Auto layout, komponentlər, variantlar, iş faylının strukturu.",
      },
      {
        number: "05",
        title: "UI dizayn",
        description: "İnterfeysdə tipoqrafiya, rəng, grid; veb və mobil ekranlar.",
      },
      {
        number: "06",
        title: "Dizayn sistemləri",
        description: "Token, variable, komponent kitabxanası.",
      },
      {
        number: "07",
        title: "Prototip və test",
        description: "İnteraktiv prototip, istifadəçi testi və iterasiya.",
      },
      {
        number: "08",
        title: "Handoff, portfolio və final layihə",
        description: "Developer-ə ötürmə, case study və portfolio təqdimatı.",
      },
    ],
    tools: ["Figma", "FigJam", "AI alətləri", "Maze / usability test"],
    final:
      "Kursun sonunda real problem üzərində tam məhsul layihəsi — araşdırmadan prototipə qədər — hazırlayıb case study kimi təqdim edirsən. Uğurla müdafiə edənə DesTech diplomu verilir.",
    formOption: "UX/UI dizayn — 4 ay",
  },
];

/* ────────────────────────────── Necə oxuyursan (bento) ────────────────────────────── */

export const about = {
  id: "haqqimizda",
  headingSoft: "Dərs bitəndə",
  heading: "öyrənmə dayanmır",
  philosophy: {
    label: "Fəlsəfəmiz",
    text: "Adobe proqramlarını bilən insan yox — kompozisiyanı, tipoqrafiyanı və rəngi əsaslandıra bilən, brief-i oxuyan, problemi həll edən designer yetişdiririk.",
    author: {
      name: "Solmaz Rzayeva",
      role: "Qurucu · 10 il qrafik və UX/UI dizayn",
      image: "/images/teacher-solmaz.jpg",
      imagePosition: "50% 18%",
    },
    cta: { label: "Müəllimlərlə tanış ol", href: "#muellimler" },
  },
  stats: [
    {
      value: "2×",
      label: "həftədə",
      description:
        "Canlı dərs, hər biri 2 saat. Onlayn və ya oflayn — formatı sən seçirsən.",
    },
    {
      value: "100%",
      label: "dərs yazılır",
      description:
        "Hər dərsin recording-i və PDF materialı Classroom-da. Buraxsan da geri qalmırsan.",
    },
    {
      value: "LAB",
      label: "həftədə 1",
      description:
        "Əlavə saat: tapşırıqlar üzərində işləyir, suallarını yerində verirsən.",
      highlight: true,
    },
    {
      value: "1:1",
      label: "mentor",
      description:
        "Dərsdənkənar saatlarda mentor səninlə görüşür, suallarını cavablandırır.",
    },
  ] satisfies StatCard[],
} as const;

/* ────────────────────────────── Tələbə işləri (mozaika) ────────────────────────────── */

/**
 * Mozaika plitələri — "Tələbə işləri" bölməsi.
 *
 * Plitələr soldan sağa düzülür. Bir cərgə 12 sütundur, yəni `span`-ların
 * cəmi 12 olanda cərgə dolur:   7 + 5 = 12   ·   3 + 3 + 6 = 12
 *
 * ── REAL İŞ ƏLAVƏ ETMƏK ──
 *   1) şəkli `public/images/works/` qovluğuna at
 *   2) plitəyə `image: "/images/works/fayl-adi.jpg"` yaz
 *   3) `caption`-a işin adını yaz
 *   4) `fill` və `placeholder` sətirlərini sil — artıq lazım deyil
 *
 * Ayrıca dəyişən kimi yazılıb ki, tipi `WorkTile[]` qalsın: `as const`
 * obyektinin içində olsaydı, `image` kimi opsional sahələr tipdən itərdi.
 */
export const workTiles: WorkTile[] = [
  // ── 1-ci cərgə: 7 + 5 = 12 ──
  {
    caption: "Capital 828 — loqo və brend identika",
    tag: "Qrafik",
    span: 7,
    size: "lg",
    captionGlass: "dark",
    image: "/images/works/DesTech_bento_images/span7-lg_1626x864/capital-828.jpg",
  },
  {
    caption: "Kampus.az — veb sayt dizaynı",
    tag: "Qrafik",
    span: 5,
    size: "lg",
    captionGlass: "light",
    image: "/images/works/DesTech_bento_images/span5-lg_1200x897/kampus-az.jpg",
  },

  // ── 2-ci cərgə: 6 + 6 = 12 ──
  {
    caption: "Redesign Luxury — veb sayt dizaynı",
    tag: "Qrafik",
    span: 6,
    size: "sm",
    captionGlass: "dark",
    image: "/images/works/DesTech_bento_images/span6-sm_1400x579/redesign-luxury.jpg",
  },
  {
    caption: "Televago — brend identika",
    tag: "Qrafik",
    span: 6,
    size: "sm",
    captionGlass: "light",
    image: "/images/works/DesTech_bento_images/span6-sm_1400x579/televago.jpg",
  },

  // ── 3-cü cərgə: 3 + 3 + 6 = 12 ──
  {
    caption: "Zenith Wellness — qablaşdırma dizaynı",
    tag: "Qrafik",
    span: 3,
    size: "sm",
    captionGlass: "light",
    image: "/images/works/DesTech_bento_images/span3-sm_800x670/zenith-wellness.jpg",
  },
  {
    caption: "Lazy Basket — qablaşdırma dizaynı",
    tag: "Qrafik",
    span: 3,
    size: "sm",
    captionGlass: "light",
    image: "/images/works/DesTech_bento_images/span3-sm_800x670/lazy-basket.jpg",
  },
  {
    caption: "UAFA — veb sayt dizaynı",
    tag: "Qrafik",
    span: 6,
    size: "sm",
    captionGlass: "light",
    image: "/images/works/DesTech_bento_images/span6-sm_1400x579/uafa.jpg",
  },
];

export const works = {
  id: "isler",
  label: "(03) Tələbə işləri",
  headingSoft: "Kursda",
  heading: "hazırlanan işlər",
  filterLabel: "Proqrama görə süz",
  /** Filter düymələrinin birincisi — qalanları plitələrin teqlərindən qurulur. */
  allFilter: "Hamısı",
  tiles: workTiles,
} as const;

/* ────────────────────────────── Müəllimlər ────────────────────────────── */

export const teachersSection = {
  id: "muellimler",
  label: "(04) Müəllimlər",
  headingSoft: "Sahədə işləyən",
  heading: "dizaynerlərdən öyrən",
  intro:
    "Müəllimlərimiz real layihələrdə işləyir — dərsdə gördüyün qərarlar sənaye təcrübəsindən gəlir.",
  prevLabel: "Əvvəlki müəllim",
  nextLabel: "Növbəti müəllim",
} as const;

export const teachers: Teacher[] = [
  {
    name: "Solmaz Rzayeva",
    role: "Qrafik və UX/UI dizayner",
    badge: "Qurucu",
    image: "/images/teacher-solmaz.jpg",
    imageAlt: "Solmaz Rzayeva — qrafik və UX/UI dizayner",
    imagePosition: "50% 22%",
    /** TODO: real profil linkləri gələndə "#" əvəz olunmalıdır. */
    links: [
      { label: "Bē", ariaLabel: "Behance", href: "#" },
      { label: "Instagram", ariaLabel: "Instagram", href: "#" },
    ],
  },
  {
    name: "Rəşad Əhməd",
    role: "Motion dizayner · 10 il",
    badge: "Motion dizayn",
    image: "/images/teacher-reshad.jpg",
    imageAlt: "Rəşad Əhməd — motion dizayner",
    imagePosition: "50% 30%",
    links: [
      { label: "Bē", ariaLabel: "Behance", href: "#" },
      { label: "Instagram", ariaLabel: "Instagram", href: "#" },
    ],
  },
];

/* ────────────────────────────── Rəylər ────────────────────────────── */

export const testimonialsSection = {
  id: "reyler",
  label: "(05) Tələbə rəyləri",
  /** TODO: launch-dan əvvəl real rəylərlə əvəz et və bu nişanı sil. */
  sampleBadge: "Nümunə mətn",
  prevLabel: "Əvvəlki rəy",
  nextLabel: "Növbəti rəy",
} as const;

export const testimonials: Testimonial[] = [
  {
    lead: "Əvvəllər yalnız şablonla işləyirdim —",
    text: "indi niyə bu şrifti, bu kompozisiyanı seçdiyimi müştəriyə əsaslandıra bilirəm. Kursdan sonra ilk frilans layihəmi aldım.",
    name: "Aysel M.",
    meta: "Qrafik dizayn məzunu",
    color: "pink",
  },
  {
    lead: "LAB saatları ən çox kömək edən hissə oldu —",
    text: "tapşırıq üzərində ilişib qalanda yerində kömək alırdım. Recording-lər sayəsində heç bir dərsi itirmədim.",
    name: "Murad H.",
    meta: "Motion dizayn məzunu",
    color: "cobalt",
  },
  {
    lead: "Proqramı YouTube-dan da öyrənmək olar,",
    text: "amma burada dizayn düşüncəsini öyrəndim. Portfolio-mu kurs müddətində hazırladım və müsahibədə məhz onu göstərdim.",
    name: "Nərmin Ə.",
    meta: "UX/UI dizayn məzunu",
    color: "yellow",
  },
];

/* ────────────────────────────── Community ────────────────────────────── */

export const community = {
  id: "community",
  label: "(06) Community",
  headingLines: ["Kurs bitir.", "Community davam edir."],
  text: "Workshop-lar, portfolio müzakirələri və dizaynerlərlə görüşlər — tələbələr və məzunlar üçün açıq.",
  joinCta: { label: "Community-yə qoşul", href: contact.whatsappCommunity },
  instagramCta: { label: contact.instagramHandle, href: contact.instagram },
  photo: {
    src: "/images/event-1.jpg",
    alt: "DesTech-in keçən tədbirində iştirakçılar çıxışı dinləyir",
    position: "center 62%",
    badge: "Keçən tədbirdən",
  },
  photoInset: {
    src: "/images/event-2.jpg",
    alt: "Tədbirdə çıxış edən spiker",
    position: "60% 40%",
  },
  event: {
    badge: "Növbəti tədbir",
    date: "31 oktyabr",
    title: "AI dünyasında dizayner olmaq",
    /** TODO: saat və məkan təsdiqlənəndə əvəz et. */
    meta: "[Saat] · [Məkan]",
    cta: { label: "Qeydiyyat", href: "#" },
  },
} as const;

/* ────────────────────────────── FAQ ────────────────────────────── */

export const faqSection = {
  id: "faq",
  label: "(08) Suallar",
  headingSoft: "Tez-tez",
  heading: "verilən suallar",
  helpText: "Cavab tapmadın?",
  helpCta: { label: "Bizə yaz", href: "#muraciet" },
} as const;

export const faq: FaqItem[] = [
  {
    number: "01",
    question: "Dərslər onlayndır, yoxsa oflayn?",
    answer:
      "Hər ikisi mümkündür. Dərslər həftədə 2 dəfə, hər biri 2 saat keçirilir — formatı müraciət zamanı seçirsən.",
  },
  {
    number: "02",
    question: "Dərsə qatıla bilməsəm nə olur?",
    answer:
      "Hər dərsin yazısı və PDF materialları Classroom-a yüklənir. Suallarını mentora və ya həftəlik LAB saatında verə bilərsən.",
  },
  {
    number: "03",
    question: "Mentor və LAB nədir?",
    answer:
      "Mentor dərsdənkənar saatlarda səninlə görüşür və suallarını cavablandırır. LAB həftədə bir dəfə keçirilən əlavə saatdır: tapşırıqlar üzərində işləyir, yerində kömək alırsan.",
  },
  {
    number: "04",
    question: "Sıfırdan başlaya bilərəmmi?",
    answer:
      "Bəli. Qrafik dizayn və UX/UI dizayn sıfırdan başlayanlar üçündür. Motion dizayn proqramı qrafik dizayn biliyi olanlar üçündür.",
  },
  {
    number: "05",
    question: "Ödəniş necədir?",
    answer:
      "Bütün proqramlarda ödəniş aylıqdır — 250 ₼ / ay. Proqramların müddəti 4 aydır.",
  },
  {
    number: "06",
    question: "Kurs sonunda diplom verilirmi?",
    /** TODO: diplom şərtləri dəqiqləşəndə köşəli mötərizəni əvəz et. */
    answer:
      "Bəli, proqramı bitirən tələbəyə diplom verilir. [Diplom şərtlərini əlavə et: tapşırıqlar, final layihə.]",
  },
];

/* ────────────────────────────── Müraciət ────────────────────────────── */

export const apply = {
  id: "muraciet",
  label: "(09) Müraciət",
  headingSoft: "Növbəti qrupda",
  heading: "yerini ayır",
  statusPill: "Qrafik dizayn · 01 noyabr",
  text: "Formu doldur — proqram, cədvəl və format barədə səninlə əlaqə saxlayaq.",
  whatsappCta: { label: "WhatsApp", href: contact.whatsapp },
  instagramCta: { label: "Instagram", href: contact.instagram },
  form: {
    nameLabel: "Ad və soyad",
    phoneLabel: "Telefon",
    phonePlaceholder: "+994 __ ___ __ __",
    emailLabel: "Email",
    emailOptional: "(istəyə bağlı)",
    programLabel: "Proqram",
    programPlaceholder: "Proqram seç",
    messageLabel: "Mesaj",
    messageOptional: "(istəyə bağlı)",
    submitLabel: "Müraciəti göndər",
  },
  /** Select seçimləri — proqramlardan törəyir, sıra kartlarla eynidir. */
  programOptions: programs.map((p) => ({ id: p.id, label: p.formOption })),
} as const;

/* ────────────────────────────── Footer ────────────────────────────── */

export const footer = {
  tagline: "Designer yetişdirən, designerləri birləşdirən dizayn akademiyası.",
  pageLabel: "(Səhifə)",
  pageLinks: [
    { label: "Proqramlar", href: "#proqramlar" },
    { label: "Community", href: "#community" },
    { label: "Müraciət", href: "#muraciet" },
  ] satisfies NavLink[],
  contactLabel: "(Əlaqə)",
  contactLinks: [
    { label: "Instagram", href: contact.instagram },
    { label: "WhatsApp", href: contact.whatsapp },
    { label: contact.phoneLabel, href: contact.phoneHref },
  ] satisfies NavLink[],
  address: contact.address,
  copyright: "(2026) © DesTech",
  city: contact.city,
  wordmark: "DesTech",
} as const;

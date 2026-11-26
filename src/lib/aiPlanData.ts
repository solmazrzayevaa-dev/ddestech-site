/**
 * Peşə generatorunun məlumat bazası. Claude API istifadə olunmur — cavablar
 * bu fayldan gəlir, buna görə heç bir xərc və xarici asılılıq yoxdur.
 * Mənbə: dizayn kətanı `V5` → `P` massivi.
 */

import { AI_MODULES, type AiPlan, type Automation, type Creation } from "./aiPlan";

type Profile = {
  keys: string[];
  title: string;
  automations: Automation[];
  creates: Creation[];
  result: string;
};

const PROFILES: Profile[] = [
  {
    keys: ["marketoloq", "marketinq", "smm", "reklam", "brend menecer", "kontent"],
    title: "Marketoloq",
    automations: [
      { name: "Post mətnləri və vizual ideyalar", how: "Bir məhsul təsvirindən paylaşım mətnləri və vizual ideyaları çıxarır", module: "Avtomatlaşdırma" },
      { name: "Rəqib təhlili", how: "Rəqiblərin paylaşımlarını toplayıb həftəlik qısa xülasə hazırlayır", module: "Avtomatlaşdırma" },
    ],
    creates: [
      { t: "Kampaniya vizualları və banner seriyası", module: "Poster" },
      { t: "15 saniyəlik Reels, səsləndirmə ilə", module: "Video" },
      { t: "Kampaniya üçün landing səhifəsi", module: "App və landing" },
    ],
    result: "Dizayner, videoqraf və developer gözləmədən kampaniyanı bir neçə saata hazırlayırsan",
  },
  {
    keys: ["analitik", "analyst", "data"],
    title: "Biznes analitik",
    automations: [
      { name: "Həftəlik hesabat xülasəsi", how: "Excel məlumatını təhlil edib əsas nəticələri yazır", module: "Avtomatlaşdırma" },
      { name: "Görüş qeydlərindən tələblər", how: "Görüş qeydlərindən tələblər siyahısı çıxarır", module: "Avtomatlaşdırma" },
    ],
    creates: [
      { t: "Hesabatdan interaktiv dashboard səhifəsi", module: "App və landing" },
      { t: "Rəhbərlik üçün 1 dəqiqəlik izah videosu", module: "Video" },
      { t: "Təqdimat üçün infoqrafika", module: "Poster" },
    ],
    result: "Rəqəmləri anlaşılan hekayəyə çevirib qərarları sürətləndirirsən",
  },
  {
    keys: ["mühasib", "muhasib", "maliyyə", "maliyye", "accountant"],
    title: "Mühasib",
    automations: [
      { name: "Qaimə və çeklərin cədvələ köçürülməsi", how: "Qaimə və çeklərdən məlumatı cədvələ köçürür", module: "Avtomatlaşdırma" },
      { name: "Ay sonu hesabatı", how: "Ay sonu hesabatına izah mətni yazır", module: "Avtomatlaşdırma" },
    ],
    creates: [
      { t: "Müştərilər üçün qısa izah videoları", module: "Video" },
      { t: "Vergi təqvimi üçün sosial media posterləri", module: "Poster" },
      { t: "Sadə hesablama kalkulyatoru səhifəsi", module: "App və landing" },
    ],
    result: "Əl ilə köçürmə işini azaldır və səhv riskini endirirsən",
  },
  {
    keys: ["sahibkar", "biznes", "mağaza", "magaza", "restoran", "kafe", "şirkət", "sirket"],
    title: "Sahibkar",
    automations: [
      { name: "Müştəri suallarına cavab şablonları", how: "Tez-tez verilən suallara hazır cavab qaralamaları yazır", module: "Avtomatlaşdırma" },
      { name: "Gündəlik sifariş xülasəsi", how: "Sifarişləri cədvələ yığıb gündəlik xülasə hazırlayır", module: "Avtomatlaşdırma" },
    ],
    creates: [
      { t: "Sifariş və ya rezerv üçün app", module: "App və landing" },
      { t: "Brend posterləri və menyu", module: "Poster" },
      { t: "Məhsul təqdimat videoları", module: "Video" },
    ],
    result: "Agentlik büdcəsi olmadan brendini və satış kanalını özün qurursan",
  },
  {
    keys: ["müəllim", "muellim", "tədris", "tedris", "məktəb", "mekteb", "repetitor"],
    title: "Müəllim",
    automations: [
      { name: "Mövzudan test sualları", how: "Verilən mövzu üzrə test sualları və cavab açarı hazırlayır", module: "Avtomatlaşdırma" },
      { name: "Tapşırıqlara ilkin rəy", how: "Tapşırıqlar üçün ilkin rəy qaralamaları yazır", module: "Avtomatlaşdırma" },
    ],
    creates: [
      { t: "Səsləndirilmiş video dərslər", module: "Səsləndirmə" },
      { t: "Dərs posterləri və iş vərəqləri", module: "Poster" },
      { t: "Kursun üçün mini sayt", module: "App və landing" },
    ],
    result: "Hazırlıq vaxtını azaldıb tələbələrə daha çox vaxt ayırırsan",
  },
  {
    keys: ["hr", "kadr", "insan resurs", "recruit", "işə qəbul", "ise qebul"],
    title: "HR",
    automations: [
      { name: "CV-lərin ilkin süzgəci", how: "CV-ləri vakansiyanın meyarlarına görə ilkin qiymətləndirir", module: "Avtomatlaşdırma" },
      { name: "Müsahibə sualları", how: "Vakansiyaya uyğun müsahibə sualları hazırlayır", module: "Avtomatlaşdırma" },
    ],
    creates: [
      { t: "Yeni işçilər üçün onboarding videosu", module: "Video" },
      { t: "Vakansiya vizualları", module: "Poster" },
      { t: "Daxili bilik bazası səhifəsi", module: "App və landing" },
    ],
    result: "Rutin işi azaldıb insanlarla işləməyə vaxt qazanırsan",
  },
  {
    keys: ["dizayner", "dizayn", "designer"],
    title: "Dizayner",
    automations: [
      { name: "Brief-dən konsept variantları", how: "Brief-dən ilkin konsept variantları çıxarır", module: "Şəkil" },
      { name: "Ölçülərə uyğunlaşdırma", how: "Bir dizaynı bütün sosial media ölçülərinə uyğunlaşdırır", module: "Avtomatlaşdırma" },
    ],
    creates: [
      { t: "Moodboard və konsept vizualları", module: "Şəkil" },
      { t: "Animasiyalı story və motion", module: "Montaj" },
      { t: "Portfolio landing-i", module: "App və landing" },
    ],
    result: "İdeyadan təqdimata qədər yolu qısaldırsan",
  },
  {
    keys: ["həkim", "hekim", "stomatoloq", "klinika", "tibb", "doktor"],
    title: "Həkim",
    automations: [
      { name: "Pasiyent suallarına cavab şablonları", how: "Tez-tez verilən suallara cavab qaralamaları yazır", module: "Avtomatlaşdırma" },
      { name: "Qeydlərdən xülasə", how: "Qeydlərdən səliqəli xülasə hazırlayır", module: "Avtomatlaşdırma" },
    ],
    creates: [
      { t: "Pasiyentlər üçün maarifləndirici videolar", module: "Video" },
      { t: "Klinika üçün sosial media vizualları", module: "Poster" },
      { t: "Qəbula yazılış səhifəsi", module: "App və landing" },
    ],
    result: "Sənədləşmə vaxtını azaldıb pasiyentə daha çox diqqət ayırırsan",
  },
  {
    keys: ["hüquq", "huquq", "vəkil", "vekil", "lawyer"],
    title: "Hüquqşünas",
    automations: [
      { name: "Müqavilə bəndlərinin ilkin yoxlanışı", how: "Diqqət tələb edən bəndləri ilkin olaraq işarələyir", module: "Avtomatlaşdırma" },
      { name: "Sənəd şablonlarının doldurulması", how: "Sənəd şablonlarını verilən məlumatla doldurur", module: "Avtomatlaşdırma" },
    ],
    creates: [
      { t: "Hüquqi mövzularda qısa izah videoları", module: "Video" },
      { t: "Xidmətlərin üçün landing səhifəsi", module: "App və landing" },
      { t: "Sosial media postları", module: "Poster" },
    ],
    result: "Rutin sənəd işini qısaldıb mürəkkəb işlərə fokuslanırsan",
  },
  {
    keys: ["satış", "satis", "sales", "menecer"],
    title: "Satış meneceri",
    automations: [
      { name: "Görüşdən sonra follow-up məktubu", how: "Görüş qeydlərindən müştəriyə göndəriləcək məktub yazır", module: "Avtomatlaşdırma" },
      { name: "Lead siyahısının sıralanması", how: "Lead siyahısını prioritetə görə sıralayır", module: "Avtomatlaşdırma" },
    ],
    creates: [
      { t: "Məhsul demo videoları", module: "Video" },
      { t: "Vizual təklif təqdimatı", module: "Poster" },
      { t: "Müştəri üçün fərdi təklif səhifəsi", module: "App və landing" },
    ],
    result: "Hər müştəriyə fərdi təklifi dəqiqələr içində hazırlayırsan",
  },
];

/**
 * Hər peşə üçün əlavə avtomatlaşdırma yolları. Cavabda hər dəfə bunlardan
 * bir hissə seçilir, buna görə eyni peşə fərqli yollarla cavablanır.
 */
const MORE: Record<string, Automation[]> = {
  Marketoloq: [
    { name: "Reklam mətni variantları", how: "Eyni təklif üçün fərqli auditoriyaya uyğun 5 qısa reklam mətni yazır", module: "Avtomatlaşdırma" },
    { name: "Kampaniya planı", how: "Ay üçün paylaşım təqvimini mövzulara və günlərə bölür", module: "Avtomatlaşdırma" },
    { name: "Şərh cavabları", how: "Müştəri şərhlərinə brendin tonuna uyğun cavab qaralamaları hazırlayır", module: "Avtomatlaşdırma" },
  ],
  "Biznes analitik": [
    { name: "Satış trend izahı", how: "Cədvəldəki dəyişiklikləri səbəbləri ilə birlikdə sadə dildə izah edir", module: "Avtomatlaşdırma" },
    { name: "Hesabat şablonu", how: "Hər həftə eyni strukturda hesabat yığır və əsas fərqləri vurğulayır", module: "Avtomatlaşdırma" },
    { name: "Sorğu nəticələri", how: "Sorğu cavablarını qruplaşdırır və əsas nəticələri çıxarır", module: "Avtomatlaşdırma" },
  ],
  Mühasib: [
    { name: "Xərc kateqoriyalaşdırma", how: "Bank çıxarışındakı əməliyyatları xərc növlərinə görə ayırır", module: "Avtomatlaşdırma" },
    { name: "Debitor xatırlatmaları", how: "Ödənilməmiş hesablar üçün nəzakətli xatırlatma mətnləri yazır", module: "Avtomatlaşdırma" },
    { name: "Vergi bildirişi izahı", how: "Vergi bildirişlərini sadə dilə çevirib nə etməli olduğunu göstərir", module: "Avtomatlaşdırma" },
  ],
  Sahibkar: [
    { name: "Stok xəbərdarlığı", how: "Satış qeydlərinə görə hansı məhsulun azaldığını xəbər verir", module: "Avtomatlaşdırma" },
    { name: "Rəy cavabları", how: "Xəritə və sosial media rəylərinə hazır, nəzakətli cavablar yazır", module: "Avtomatlaşdırma" },
    { name: "Həftəlik satış xülasəsi", how: "Həftənin satışını qısa xülasə kimi göndərməyə hazırlayır", module: "Avtomatlaşdırma" },
  ],
  Müəllim: [
    { name: "Dərs planı", how: "Mövzunu gün-gün bölüb dərs planı və vaxt bölgüsü yazır", module: "Avtomatlaşdırma" },
    { name: "Valideyn məktubu", how: "Tələbənin irəliləyişi haqqında valideynə qısa məktub hazırlayır", module: "Avtomatlaşdırma" },
    { name: "Diktant və lüğət", how: "Mövzuya uyğun söz siyahısı və qısa diktant mətni hazırlayır", module: "Avtomatlaşdırma" },
  ],
  HR: [
    { name: "Vakansiya elanı", how: "Vakansiya təsvirini qısa, cəlbedici elan mətninə çevirir", module: "Avtomatlaşdırma" },
    { name: "Onboarding yoxlama siyahısı", how: "Yeni işçi üçün həftə-həftə yoxlama siyahısı yaradır", module: "Avtomatlaşdırma" },
    { name: "Məzuniyyət sorğuları", how: "Məzuniyyət və icazə sorğularını qaydalara görə ilkin yoxlayır", module: "Avtomatlaşdırma" },
  ],
  Dizayner: [
    { name: "Brend rəng palitrası", how: "Logo rənglərindən uyğun palitra və kontrast yoxlaması çıxarır", module: "Şəkil" },
    { name: "Təqdimat slaydları", how: "Brief-dən slayd strukturu və mətn qaralaması hazırlayır", module: "Avtomatlaşdırma" },
    { name: "Sosial media ölçüləri", how: "Eyni vizualı Instagram, Facebook və story ölçülərinə hazırlayır", module: "Poster" },
  ],
  Həkim: [
    { name: "Qəbul xülasəsi", how: "Qeydlərdən qısa, səliqəli qəbul xülasəsi yazır", module: "Avtomatlaşdırma" },
    { name: "Dərman təlimatı", how: "Pasiyent üçün dərmanın qəbul qaydasını sadə dildə izah edir", module: "Avtomatlaşdırma" },
    { name: "Qəbul xatırlatması", how: "Növbəti qəbul üçün pasiyentə xatırlatma mesajı hazırlayır", module: "Avtomatlaşdırma" },
  ],
  Hüquqşünas: [
    { name: "Müqavilə müqayisəsi", how: "İki müqavilə versiyasındakı fərqləri cədvəldə göstərir", module: "Avtomatlaşdırma" },
    { name: "Müştəri məktubu", how: "Hüquqi vəziyyəti müştəri üçün sadə dildə izah edən məktub yazır", module: "Avtomatlaşdırma" },
    { name: "Hüquqi təqvim", how: "Müddətləri və son tarixləri təqvim qaydasında siyahılayır", module: "Avtomatlaşdırma" },
  ],
  "Satış meneceri": [
    { name: "CRM qeydləri", how: "Görüş qeydlərini CRM üçün strukturlaşdırılmış qeydə çevirir", module: "Avtomatlaşdırma" },
    { name: "Etiraz cavabları", how: "Ən çox rast gəlinən etirazlara hazır, səmimi cavablar yazır", module: "Avtomatlaşdırma" },
    { name: "Təklif xülasəsi", how: "Uzun təklifi müştəri üçün bir səhifəlik xülasəyə çevirir", module: "Avtomatlaşdırma" },
  ],
};

const TEAM_NOTES: Record<string, string> = {
  tek: "Tək işlədiyin üçün bu yollar sənin vaxtını birbaşa azaldır.",
  komanda: "Komandanla eyni şablonları paylaşsan, iş standartlaşır və hər kəs eyni nəticəyə çatır.",
};

function hash(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

/** Bazada olmayan peşə üçün ümumi cavab. `title` istifadəçinin yazdığı mətndir. */
const GENERIC: Omit<Profile, "keys" | "title"> = {
  automations: [
    { name: "Təkrarlanan yazışmalar", how: "Məktub və mesajlara sənin üslubunda qaralama hazırlayır", module: "Avtomatlaşdırma" },
    { name: "Sənəd və hesabat xülasəsi", how: "Uzun sənədləri oxuyub əsas nöqtələri çıxarır", module: "Avtomatlaşdırma" },
    { name: "Məlumatın cədvələ yığılması", how: "Dağınıq qeyd və fayllardan məlumatı səliqəli cədvələ köçürür", module: "Avtomatlaşdırma" },
    { name: "Sosial media kontenti", how: "Bir mövzudan post mətni, vizual və qısa video ideyaları hazırlayır", module: "Şəkil" },
  ],
  creates: [
    { t: "İşini izah edən qısa video, səsləndirmə ilə", module: "Video" },
    { t: "Xidmətin üçün poster və vizuallar", module: "Poster" },
    { t: "Öz landing səhifən və ya mini app", module: "App və landing" },
  ],
  result: "Rutin işi Claude-a həvalə edib əsas işinə vaxt qazanırsan",
};

function lower(value: string): string {
  try {
    return value.toLocaleLowerCase("az");
  } catch {
    return value.toLowerCase();
  }
}

function capitalize(value: string): string {
  const first = value.charAt(0);
  let upper = first;
  try {
    upper = first.toLocaleUpperCase("az");
  } catch {
    upper = first.toUpperCase();
  }
  return upper + value.slice(1);
}

/**
 * İstifadəçinin yazdığı peşəyə görə plan qaytarır. `team` (tek / komanda)
 * verilsə, cavab buna görə fərdiləşir. Açar sözü tapılmasa ümumi plan qayıdır.
 */
export function matchPlan(work: string, team?: string): AiPlan {
  const text = lower(work);
  const words = text.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  // Tək söz açarları söz başlanğıcı ilə yoxlanır ("mühasibəm" → "mühasib"),
  // çoxsözlü açarlar isə mətnin içində axtarılır.
  const matches = (key: string) =>
    key.includes(" ") ? text.includes(key) : words.some((w) => w.startsWith(key));
  const found = PROFILES.find((p) => p.keys.some(matches));
  const profile = found ?? { ...GENERIC, title: capitalize(work.trim()), keys: [] };

  const valid = (m: string) => (AI_MODULES as readonly string[]).includes(m);
  const pool = [...profile.automations, ...(MORE[profile.title] ?? [])].filter((a) =>
    valid(a.module),
  );
  // Hər sorğuda iş mətninə görə fərqli üç yol seçilir (sabit, amma müxtəlif).
  const start = pool.length ? hash(work) % pool.length : 0;
  const automations = Array.from({ length: Math.min(3, pool.length) }, (_, i) =>
    pool[(start + i) % pool.length],
  );
  const creates = profile.creates.filter((c) => valid(c.module));
  const note = team ? TEAM_NOTES[team] : undefined;

  return {
    valid: true,
    title: profile.title,
    automations,
    creates,
    result: [profile.result, note].filter(Boolean).join(" "),
  };
}

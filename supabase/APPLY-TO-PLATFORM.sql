-- ============================================================================
-- DesTech landing bazasının köçürülməsi
--
-- NƏ ÜÇÜN: landing-in öz Supabase layihəsi ("DesTech Landing") pulsuz planda
-- fəaliyyətsizlikdən PAUZAYA düşdü. Pauzada host ümumiyyətlə DNS-də həll
-- olunmur, ona görə brauzer "Load failed" verirdi.
--
-- HƏLL: landing-in iki cədvəli aktiv işləyən platform layihəsinə köçürülür.
-- Bir baza qalır, pauza riski aradan qalxır.
--
-- NECƏ: platform layihəsi (gsrytfnfgpxgzcvtdsxe) → SQL Editor → bunu yapışdır
-- və "Run". Fayl idempotentdir: iki dəfə işə salmaq təhlükəsizdir.
-- ============================================================================

-- ── 1. Müraciət formunun lead cədvəli ──────────────────────────────────────
create table if not exists public.website_leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  phone        text not null,
  email        text,
  program      text,
  message      text,
  utm_source   text,
  utm_medium   text,
  utm_campaign text
);

comment on table public.website_leads is
  'destech.az landing səhifəsindəki müraciət formundan gələn lead-lər.';

create index if not exists website_leads_created_at_idx
  on public.website_leads (created_at desc);

-- RLS açıqdır və HEÇ BİR policy yoxdur: anon və authenticated cədvələ çata
-- bilmir. Yazma yalnız Server Action-dakı service role açarı ilə baş verir.
alter table public.website_leads enable row level security;

-- ── 2. AI Creator qeydiyyat cədvəli ────────────────────────────────────────
create table if not exists public.ai_creator_registrations (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  full_name   text not null check (char_length(full_name) between 3 and 120),
  phone       text not null check (phone ~ '^\+994[0-9]{9}$'),
  fin         text not null check (fin ~ '^[A-Z0-9]{7}$'),
  email       text not null check (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
  consent     boolean not null check (consent = true),
  price_azn   int     not null default 120,
  status      text    not null default 'yeni' check (status in ('yeni','zəng edildi','ödənildi','imtina')),
  note        text
);

create unique index if not exists ai_creator_registrations_fin_key
  on public.ai_creator_registrations (fin);

alter table public.ai_creator_registrations enable row level security;

-- anon: yalnız INSERT, yalnız icazə verilən sütunlar, yalnız qeydiyyat
-- müddəti bitənə qədər. SELECT / UPDATE / DELETE üçün policy YOXDUR.
revoke all on public.ai_creator_registrations from anon, authenticated;
grant insert (full_name, phone, fin, email, consent)
  on public.ai_creator_registrations to anon;

drop policy if exists "ai_creator_public_insert" on public.ai_creator_registrations;
create policy "ai_creator_public_insert"
  on public.ai_creator_registrations
  for insert to anon
  with check (true);

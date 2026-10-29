-- DesTech · AI Creator qeydiyyat cədvəli (Supabase → SQL Editor-da bir dəfə işə salın)
-- Təhlükəsizlik: saytdakı anon açar YALNIZ yeni qeydiyyat əlavə edə bilir.
-- Oxumaq (FİN daxil) yalnız Supabase panelindən və ya service_role ilə mümkündür.

create table if not exists public.ai_creator_registrations (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  full_name   text not null check (char_length(full_name) between 3 and 120),
  phone       text not null check (phone ~ '^\+994[0-9]{9}$'),
  fin         text not null check (fin ~ '^[A-Z0-9]{7}$'),
  email       text not null check (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
  consent     boolean not null check (consent = true),
  -- Qiymət serverdə, qeydiyyat anına görə təyin olunur (brauzerdən göndərilə bilməz)
  early_bird  boolean not null default (now() <= timestamptz '2026-11-02 23:59:59+04'),
  price_azn   int     not null default (case when now() <= timestamptz '2026-11-02 23:59:59+04' then 80 else 120 end),
  status      text    not null default 'yeni' check (status in ('yeni','zəng edildi','ödənildi','imtina')),
  note        text
);

-- Eyni FİN ilə ikinci qeydiyyat olmasın
create unique index if not exists ai_creator_registrations_fin_key on public.ai_creator_registrations (fin);

alter table public.ai_creator_registrations enable row level security;

-- anon: yalnız INSERT, yalnız icazə verilən sütunlar, yalnız 20 Noyabr 23:59-a qədər
revoke all on public.ai_creator_registrations from anon, authenticated;
grant insert (full_name, phone, fin, email, consent) on public.ai_creator_registrations to anon;

drop policy if exists "ai_creator_public_insert" on public.ai_creator_registrations;
create policy "ai_creator_public_insert"
  on public.ai_creator_registrations
  for insert to anon
  with check (now() <= timestamptz '2026-11-20 23:59:59+04');

-- SELECT / UPDATE / DELETE üçün policy YOXDUR → anon heç nə oxuya bilmir.

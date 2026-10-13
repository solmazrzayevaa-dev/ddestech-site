-- DesTech landing — müraciət formunun lead cədvəli.
-- Tətbiq: Supabase SQL Editor-da işə sal, və ya `supabase db push`.

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

-- Admin panelində ən yeni müraciətlər birinci göstərilir.
create index if not exists website_leads_created_at_idx
  on public.website_leads (created_at desc);

-- RLS açıqdır və HEÇ BİR policy yoxdur: anon və authenticated rolları
-- cədvələ çata bilmir. Yazma yalnız Server Action-dakı service role
-- açarı ilə baş verir (service role RLS-i bypass edir).
alter table public.website_leads enable row level security;

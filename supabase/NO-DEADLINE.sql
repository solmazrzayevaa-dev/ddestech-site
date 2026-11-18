-- DesTech · AI Creator: tarix məhdudiyyəti yoxdur, qiymət sabit 120 ₼
-- Artıq APPLY-TO-PLATFORM.sql işə salınıbsa, bunu bir dəfə SQL Editor-da işlət.
-- Idempotentdir: təkrar işə salmaq zərər vermir.

-- 1. Early bird sütunu artıq lazım deyil
alter table public.ai_creator_registrations drop column if exists early_bird;

-- 2. Qiymət default-u: sabit 120 ₼
alter table public.ai_creator_registrations
  alter column price_azn set default 120;

-- 3. Anon insert-i artıq tarixlə məhdudlaşmır
drop policy if exists "ai_creator_public_insert" on public.ai_creator_registrations;
create policy "ai_creator_public_insert"
  on public.ai_creator_registrations
  for insert to anon
  with check (true);

create extension if not exists pgcrypto;

create table if not exists public.personas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  author_name text,
  title text not null,
  locale text not null default 'pt-BR',
  is_public boolean not null default true,
  source_persona_id uuid references public.personas (id) on delete set null,
  data jsonb not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists personas_user_id_idx on public.personas (user_id);
create index if not exists personas_public_idx on public.personas (is_public);
create index if not exists personas_updated_at_idx on public.personas (updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists personas_set_updated_at on public.personas;
create trigger personas_set_updated_at
before update on public.personas
for each row execute function public.set_updated_at();

alter table public.personas enable row level security;

drop policy if exists "Read own or public personas" on public.personas;
create policy "Read own or public personas"
on public.personas
for select
using (
  is_public = true
  or auth.uid() = user_id
);

drop policy if exists "Insert own personas" on public.personas;
create policy "Insert own personas"
on public.personas
for insert
with check (auth.uid() = user_id);

drop policy if exists "Update own personas" on public.personas;
create policy "Update own personas"
on public.personas
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Delete own personas" on public.personas;
create policy "Delete own personas"
on public.personas
for delete
using (auth.uid() = user_id);

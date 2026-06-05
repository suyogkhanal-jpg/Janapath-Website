-- Janapath Secondary School — Supabase schema
-- Run this in Supabase Dashboard → SQL Editor → New query → Run

create extension if not exists "pgcrypto";

-- Notices
create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  category text not null default 'General',
  is_pinned boolean not null default false,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Gallery
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  image_url text not null,
  category text not null default 'Campus',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Contact form submissions
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text default '',
  subject text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Site content (single row keyed by "default")
create table if not exists public.site_content (
  key text primary key default 'default',
  slider_texts jsonb not null default '[]'::jsonb,
  logo_url text not null default '/logo.png',
  hero jsonb not null default '{"backgroundImageUrl":"/images/campus.jpg","imageOpacity":100,"overlayOpacity":55}'::jsonb,
  hero_stats jsonb not null default '[]'::jsonb,
  principal jsonb not null default '{}'::jsonb,
  about jsonb not null default '{}'::jsonb,
  staff_overview jsonb not null default '[]'::jsonb,
  map_embed_url text default '',
  map_directions_url text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Updated-at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists notices_updated_at on public.notices;
create trigger notices_updated_at before update on public.notices
  for each row execute function public.set_updated_at();

drop trigger if exists gallery_updated_at on public.gallery;
create trigger gallery_updated_at before update on public.gallery
  for each row execute function public.set_updated_at();

drop trigger if exists contacts_updated_at on public.contacts;
create trigger contacts_updated_at before update on public.contacts
  for each row execute function public.set_updated_at();

drop trigger if exists site_content_updated_at on public.site_content;
create trigger site_content_updated_at before update on public.site_content
  for each row execute function public.set_updated_at();

-- Row Level Security (app uses anon key from server API routes)
alter table public.notices enable row level security;
alter table public.gallery enable row level security;
alter table public.contacts enable row level security;
alter table public.site_content enable row level security;

drop policy if exists "notices_all" on public.notices;
create policy "notices_all" on public.notices for all using (true) with check (true);

drop policy if exists "gallery_all" on public.gallery;
create policy "gallery_all" on public.gallery for all using (true) with check (true);

drop policy if exists "contacts_all" on public.contacts;
create policy "contacts_all" on public.contacts for all using (true) with check (true);

drop policy if exists "site_content_all" on public.site_content;
create policy "site_content_all" on public.site_content for all using (true) with check (true);

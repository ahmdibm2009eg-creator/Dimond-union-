-- =============================================================
-- Diamond Union — Supabase schema
-- Run this in: Supabase Dashboard > SQL Editor > New query
-- =============================================================

-- 1. Projects table
create table if not exists projects (
  id         bigserial primary key,
  name_ar    text not null default '',
  name_en    text not null default '',
  category   text not null default 'stands',
  images     jsonb not null default '[]',
  "order"    integer not null default 0,
  created_at timestamptz not null default now()
);

-- 2. Site content table (text overrides + theme settings)
create table if not exists site_content (
  id           bigserial primary key,
  content_key  text not null unique,
  value_ar     text not null default '',
  value_en     text not null default '',
  created_at   timestamptz not null default now()
);

-- 3. Storage bucket for project images
insert into storage.buckets (id, name, public)
  values ('project-images', 'project-images', true)
  on conflict (id) do nothing;

-- 4. Enable real-time on both tables
alter publication supabase_realtime add table projects;
alter publication supabase_realtime add table site_content;

-- 5. RLS policies (allow all ops for anon — no auth in this app)
alter table projects enable row level security;
alter table site_content enable row level security;

create policy "Allow all on projects"
  on projects for all
  using (true)
  with check (true);

create policy "Allow all on site_content"
  on site_content for all
  using (true)
  with check (true);

create policy "Allow all on project-images"
  on storage.objects for all
  using (bucket_id = 'project-images')
  with check (bucket_id = 'project-images');

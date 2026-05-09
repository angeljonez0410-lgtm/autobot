-- Viral Boss Planner schema
-- Run this in Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  niche text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists platform_profiles (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  profile_name text not null,
  buffer_profile_id text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete set null,
  platform text not null,
  caption text not null,
  image_url text,
  hashtags text[] not null default '{}',
  cta text,
  scheduled_at timestamptz,
  status text not null check (status in ('idea', 'draft', 'ready', 'scheduled', 'posted')),
  buffer_profile_id text,
  buffer_update_id text,
  created_at timestamptz not null default now()
);

create table if not exists content_templates (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  platform text not null,
  hook text not null,
  body text not null,
  cta text not null,
  hashtags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists money_goals (
  id uuid primary key default gen_random_uuid(),
  goal_name text not null,
  target_amount numeric not null default 0,
  current_amount numeric not null default 0,
  due_date date,
  created_at timestamptz not null default now()
);

create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  brand_voice text,
  default_hashtags text[] not null default '{}',
  cta_templates text[] not null default '{}',
  demo_mode boolean not null default true,
  created_at timestamptz not null default now()
);

-- MVP note: open RLS during quick launch, then lock down with auth policies.
alter table businesses enable row level security;
alter table platform_profiles enable row level security;
alter table posts enable row level security;
alter table content_templates enable row level security;
alter table money_goals enable row level security;
alter table settings enable row level security;

create policy if not exists "Allow anon read businesses" on businesses for select to anon using (true);
create policy if not exists "Allow anon write businesses" on businesses for all to anon using (true) with check (true);

create policy if not exists "Allow anon read profiles" on platform_profiles for select to anon using (true);
create policy if not exists "Allow anon write profiles" on platform_profiles for all to anon using (true) with check (true);

create policy if not exists "Allow anon read posts" on posts for select to anon using (true);
create policy if not exists "Allow anon write posts" on posts for all to anon using (true) with check (true);

create policy if not exists "Allow anon read templates" on content_templates for select to anon using (true);
create policy if not exists "Allow anon write templates" on content_templates for all to anon using (true) with check (true);

create policy if not exists "Allow anon read goals" on money_goals for select to anon using (true);
create policy if not exists "Allow anon write goals" on money_goals for all to anon using (true) with check (true);

create policy if not exists "Allow anon read settings" on settings for select to anon using (true);
create policy if not exists "Allow anon write settings" on settings for all to anon using (true) with check (true);

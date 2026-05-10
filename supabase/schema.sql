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

-- Supabase SQL schema for Zu Super Boss Brain
-- All tables start empty. No fake user business data.

-- User profiles
create table profiles (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text,
  avatar_url text,
  plan text default 'free',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Businesses
create table businesses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  type text,
  logo_url text,
  brand_colors jsonb,
  brand_voice text,
  target_audience text,
  hashtags text[],
  content_rules text,
  goals text,
  archived boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Products
create table products (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade,
  name text not null,
  description text,
  price numeric,
  image_url text,
  links text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Posts
create table posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  business_id uuid references businesses(id) on delete cascade,
  product_id uuid references products(id),
  platform text,
  content text,
  status text,
  scheduled_at timestamptz,
  posted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Content Templates
create table content_templates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  business_id uuid references businesses(id) on delete cascade,
  name text,
  template text,
  created_at timestamptz default now()
);

-- Approval Queue
create table approval_queue (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references posts(id) on delete cascade,
  status text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Automation Rules
create table automation_rules (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  business_id uuid references businesses(id) on delete cascade,
  rule text,
  active boolean default true,
  created_at timestamptz default now()
);

-- AI Memory
create table ai_memory (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  business_id uuid references businesses(id) on delete cascade,
  memory jsonb,
  created_at timestamptz default now()
);

-- Knowledge Base
create table knowledge_base (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  business_id uuid references businesses(id) on delete cascade,
  type text,
  content text,
  created_at timestamptz default now()
);

-- Business Goals
create table business_goals (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade,
  goal text,
  target numeric,
  progress numeric default 0,
  created_at timestamptz default now()
);

-- Scheduled Tasks
create table scheduled_tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  business_id uuid references businesses(id) on delete cascade,
  task text,
  scheduled_for timestamptz,
  status text,
  created_at timestamptz default now()
);

-- Subscriptions
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  plan text,
  status text,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- Admin Overrides
create table admin_overrides (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  plan text,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- Analytics Events
create table analytics_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  business_id uuid references businesses(id) on delete cascade,
  event text,
  value numeric,
  created_at timestamptz default now()
);

-- Buffer Connections
create table buffer_connections (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  access_token text,
  connected boolean default false,
  created_at timestamptz default now()
);

-- Platform Profiles
create table platform_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  platform text,
  profile_id text,
  username text,
  created_at timestamptz default now()
);

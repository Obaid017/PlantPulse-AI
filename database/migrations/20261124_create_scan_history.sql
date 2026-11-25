-- Run once in Supabase Dashboard > SQL Editor.
-- The React Native app currently saves accepted scan records via Supabase Auth and RLS.
-- Do not insert fake/demo scan rows.
-- Run this initial setup script only once: its named RLS policies do not use IF NOT EXISTS.

create table if not exists public.scan_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  disease_name text not null,
  status text not null check (status in ('healthy', 'diseased')),
  confidence numeric(5, 2) not null check (confidence between 0 and 100),
  severity_percent numeric(5, 2) check (severity_percent between 0 and 100),
  severity_level text,
  created_at timestamptz not null default now()
);

create index if not exists idx_scan_history_user_date
  on public.scan_history (user_id, created_at desc);

alter table public.scan_history enable row level security;

-- A farmer can see only their own scan history.
create policy "Farmer reads own scans"
  on public.scan_history for select to authenticated
  using ((select auth.uid()) = user_id);

-- The authenticated farmer can insert only their own accepted scan records.
create policy "Farmer adds own scans"
  on public.scan_history for insert to authenticated
  with check ((select auth.uid()) = user_id);

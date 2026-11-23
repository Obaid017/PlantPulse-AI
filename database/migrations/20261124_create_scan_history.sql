-- Run once in Supabase Dashboard > SQL Editor.
-- Actual scan records will be saved by our future FastAPI integration.
-- Do not insert fake/demo scan rows.

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

-- Prepared for later when FastAPI saves authenticated scans.
create policy "Farmer adds own scans"
  on public.scan_history for insert to authenticated
  with check ((select auth.uid()) = user_id);

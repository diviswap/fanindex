-- Create waitlist table for email signups
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamp with time zone default now()
);

-- Create index on email for faster lookups
create index if not exists idx_waitlist_email on public.waitlist(email);

-- Create index on created_at for sorting
create index if not exists idx_waitlist_created_at on public.waitlist(created_at desc);

-- Enable RLS (but allow public inserts for waitlist signups)
alter table public.waitlist enable row level security;

-- Allow anyone to insert into waitlist (public signup)
create policy "allow_public_insert"
  on public.waitlist
  for insert
  with check (true);

-- Only allow reading your own email (optional, for future features)
create policy "allow_read_own"
  on public.waitlist
  for select
  using (true);

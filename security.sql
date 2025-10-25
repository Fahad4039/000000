-- Create secure expenses table with user_id and RLS
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  description text not null,
  amount numeric not null,
  category text,
  date date default current_date,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.expenses enable row level security;

-- Policy: allow authenticated users to select their own rows
create policy "select_own" on public.expenses for select using (auth.uid() = user_id);

-- Policy: allow authenticated users to insert rows where user_id = auth.uid()
create policy "insert_own" on public.expenses for insert with check (auth.uid() = user_id);

-- Policy: allow authenticated users to update their own rows
create policy "update_own" on public.expenses for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Policy: allow authenticated users to delete their own rows
create policy "delete_own" on public.expenses for delete using (auth.uid() = user_id);

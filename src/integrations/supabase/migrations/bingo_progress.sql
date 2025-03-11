
-- Creating bingo_progress table for storing user progress
create table if not exists public.bingo_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  completed_cells integer[] default '{}',
  bingo_count integer default 0,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Set up row level security (RLS)
alter table public.bingo_progress enable row level security;

-- Create policies for access control
create policy "Users can view their own bingo progress"
  on public.bingo_progress
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own bingo progress"
  on public.bingo_progress
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own bingo progress"
  on public.bingo_progress
  for update
  using (auth.uid() = user_id);

-- Create index for faster lookups
create index if not exists bingo_progress_user_id_idx on public.bingo_progress (user_id);


-- Create a table to store user's progress in the game
create table if not exists public.user_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  completed_modules integer[] default '{}',
  xp integer default 0,
  level integer default 1,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id)
);

-- Enable RLS
alter table public.user_progress enable row level security;

-- Create RLS policies
create policy "Users can view their own progress"
  on user_progress for select
  using (auth.uid() = user_id);

create policy "Users can update their own progress"
  on user_progress for update
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on user_progress for insert
  with check (auth.uid() = user_id);

-- Index for faster queries
create index if not exists user_progress_user_id_idx on user_progress(user_id);
